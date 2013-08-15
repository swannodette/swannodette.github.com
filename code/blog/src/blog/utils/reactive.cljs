(ns blog.utils.reactive
  (:refer-clojure :exclude [map filter remove distinct concat take-while])
  (:require [goog.events :as events]
            [goog.events.EventType]
            [goog.net.Jsonp]
            [goog.Uri]
            [goog.dom :as gdom]
            [cljs.core.async :refer [>! <! chan put! close! timeout]]
            [blog.utils.helpers :refer [index-of]]
            [blog.utils.dom :as dom])
  (:require-macros [cljs.core.async.macros :refer [go alt!]])
  (:import goog.events.EventType))

(defn atom? [x]
  (instance? Atom x))

(def keyword->event-type
  {:keyup goog.events.EventType.KEYUP
   :keydown goog.events.EventType.KEYDOWN
   :keypress goog.events.EventType.KEYPRESS
   :click goog.events.EventType.CLICK
   :dblclick goog.events.EventType.DBLCLICK
   :mouseover goog.events.EventType.MOUSEOVER
   :mouseout goog.events.EventType.MOUSEOUT
   :mousemove goog.events.EventType.MOUSEMOVE
   :focus goog.events.EventType.FOCUS
   :blur goog.events.EventType.BLUR})

;; TODO: listen should take an optional side-effect fn - David

(defn listen
  ([el type] (listen el type false))
  ([el type prevent-default?]
    (let [out (chan)]
      (events/listen el (keyword->event-type type)
        (fn [e]
          (if (atom? prevent-default?)
            (when @prevent-default?
              (.preventDefault e))
            (when prevent-default?
              (.preventDefault e)))
          (put! out e)))
      out)))

(defn map [f in]
  (let [out (chan)]
    (go (loop []
          (if-let [x (<! in)]
            (do (>! out (f x))
              (recur))
            (close! out))))
    out))

(defn filter [pred in]
  (let [out (chan)]
    (go (loop []
          (if-let [x (<! in)]
            (do (when (pred x) (>! out x))
              (recur))
            (close! out))))
    out))

(defn remove [f in]
  (let [out (chan)]
    (go (loop []
          (if-let [v (<! in)]
            (do (when-not (f v) (>! out v))
              (recur))
            (close! out))))
    out))

(defn spool [xs]
  (let [out (chan)]
    (go (loop [xs (seq xs)]
          (if xs
            (do (>! out (first xs))
              (recur (next xs)))
            (close! out))))
    out))

(defn split [pred in]
  (let [out1 (chan)
        out2 (chan)]
    (go (loop []
          (if-let [v (<! in)]
            (if (pred v)
              (do (>! out1 v)
                (recur))
              (do (>! out2 v)
                (recur))))))
    [out1 out2]))

(defn concat [xs in]
  (let [out (chan)]
    (go (loop [xs (seq xs)]
          (if xs
            (do (>! out (first xs))
              (recur (next xs)))
            (if-let [x (<! in)]
              (do (>! out x)
                (recur xs))
              (close! out)))))
    out))

(defn distinct [in]
  (let [out (chan)]
    (go (loop [last nil]
          (if-let [x (<! in)]
            (do (when (not= x last) (>! out x))
              (recur x))
            (close! out))))
    out))

(defn fan-in [ins]
  (let [out (chan)]
    (go (while true
          (let [[x] (alts! ins)]
            (>! out x))))
    out))

(defn take-until
  ([pred-sentinel in] (take-until pred-sentinel in (chan)))
  ([pred-sentinel in out]
    (go (loop []
          (if-let [v (<! in)]
            (do
              (>! out v)
              (if-not (pred-sentinel v)
                (recur)
                (close! out)))
            (close! out))))
    out))

(defn siphon
  ([in] (siphon in []))
  ([in coll]
    (go (loop [coll coll]
          (if-let [v (<! in)]
            (recur (conj coll v))
            coll)))))

(defn always [v c]
  (let [out (chan)]
    (go (loop []
          (if-let [e (<! c)]
            (do (>! out v)
              (recur))
            (close! out))))
    out))

(defn toggle [in]
  (let [out (chan)
        control (chan)]
    (go (loop [on true]
          (recur
            (alt!
              in ([x] (when on (>! out x)) on)
              control ([x] x)))))
    {:chan out
     :control control}))

(defn mouse-enter [el]
  (let [matcher (dom/el-matcher el)]
    (->> (listen el :mouseover)
      (filter
        (fn [e]
          (and (identical? el (.-target e))
            (if-let [rel (.-relatedTarget e)] 
              (nil? (gdom/getAncestor rel matcher))
              true))))
      (map (constantly :enter)))))

(defn mouse-leave [el]
  (let [matcher (dom/el-matcher el)]
    (->> (listen el :mouseout)
      (filter
        (fn [e]
          (and (identical? el (.-target e))
            (if-let [rel (.-relatedTarget e)]
              (nil? (gdom/getAncestor rel matcher))
              true))))
      (map (constantly :leave)))))

(defn hover [el]
  (distinct (fan-in [(mouse-enter el) (mouse-leave el)])))

(defn hover-child [el tag]
  (let [matcher (dom/tag-match tag)
        matches (dom/by-tag-name el tag)
        over (->> (listen el :mouseover)
               (map
                 #(let [target (.-target %)]
                    (if (matcher target)
                      target
                      (if-let [el (gdom/getAncestor target matcher)]
                        el
                        :no-match))))
               (remove #{:no-match})
               (map #(index-of matches %)))
        out (->> (listen el :mouseout)
              (filter
                (fn [e]
                  (and (matcher (.-target e))
                       (not (matcher (.-relatedTarget e))))))
              (map (constantly :clear)))]
    (distinct (fan-in [over out]))))

(defn jsonp
  ([uri] (jsonp (chan) uri))
  ([c uri]
    (let [gjsonp (goog.net.Jsonp. (goog.Uri. uri))]
      (.send gjsonp nil #(put! c %))
      c)))

(defn throttle
  ([source msecs]
    (throttle source msecs (chan)))
  ([source msecs out]
    (go
      (loop [state ::init last nil cs [source]]
        (let [[_ sync] cs]
          (let [[v sc] (alts! cs)]
            (condp = sc
              source (condp = state
                       ::init (do (>! out v)
                                (recur ::throttling last
                                  (conj cs (timeout msecs))))
                       ::throttling (recur state v cs))
              sync (if last 
                     (do (>! out last)
                       (recur state nil
                         (conj (pop cs) (timeout msecs))))
                     (recur ::init last (pop cs))))))))
    out))

(defn debounce
  ([source msecs]
    (debounce (chan) source msecs))
  ([out source msecs]
    (go
      (loop [state ::init cs [source]]
        (let [[_ threshold] cs]
          (let [[v sc] (alts! cs)]
            (condp = sc
              source (condp = state
                       ::init
                         (do (>! out v)
                           (recur ::debouncing
                             (conj cs (timeout msecs))))
                       ::debouncing
                         (recur state
                           (conj (pop cs) (timeout msecs))))
              threshold (recur ::init (pop cs)))))))
    out))
