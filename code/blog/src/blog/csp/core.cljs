(ns blog.csp.core
  (:refer-clojure :exclude [map])
  (:require [cljs.core.async :as async
              :refer [<! >! chan put! timeout]]
            [clojure.string :as string]
            [blog.utils.dom :refer [by-id set-html! offset]]
            [blog.utils.reactive :refer [listen map]])
  (:require-macros [cljs.core.async.macros :refer [go alt!]]))

(def c (chan))

(defn render [q]
  (apply str
    (for [p (reverse q)]
      (str "<div class='proc-" p "'>Process " p "</div>"))))

(go (while true (<! (timeout 250)) (>! c 1)))
(go (while true (<! (timeout 1000)) (>! c 2)))
(go (while true (<! (timeout 1500)) (>! c 3)))

(defn peekn
  "Returns vector of (up to) n items from the end of vector v"
  [v n]
  (if (> (count v) n)
    (subvec v (- (count v) n))
    v))

(let [el  (by-id "ex0")
      out (by-id "ex0-out")]
  (go (loop [q []]
        (set-html! out (render q))
        (recur (-> (conj q (<! c)) (peekn 10))))))

(let [el  (by-id "ex1")
      out (by-id "ex1-mouse")
      c   (listen el :mousemove)]
  (go (while true
        (let [e (<! c)]
          (set-html! out (str (.-offsetX e) ", " (.-offsetY e)))))))

(defn location [el]
  (let [[left top] (cljs.core/map int (offset el))]
    (fn [e]
      {:x (+ (.-offsetX e) left)
       :y (+ (.-offsetY e) top)})))

(let [el  (by-id "ex2")
      out (by-id "ex2-mouse")
      c   (map (location el)
            (listen el :mousemove))]
  (go (while true
        (let [e (<! c)]
          (set-html! out (str (:x e) ", " (:y e)))))))

(let [el   (by-id "ex3")
      outm (by-id "ex3-mouse")
      outk (by-id "ex3-key")
      mc   (map (location el)
             (listen el :mousemove))
      kc   (listen js/document :keypress)]
  (go (while true
        (let [[v c] (alts! [mc kc])]
          (condp = c
            mc (set-html! outm (str (:x v) ", " (:y v)))
            kc (set-html! outk (str (.-charCode v))))))))

(defn fake-search [kind]
  (fn [c query]
    (go
     (<! (timeout (rand-int 100)))
     (>! c [kind query]))))

(def web1 (fake-search :web1))
(def web2 (fake-search :web2))
(def image1 (fake-search :image1))
(def image2 (fake-search :image2))
(def video1 (fake-search :video1))
(def video2 (fake-search :video2))

(defn fastest [query & replicas]
  (let [c (chan)]
    (doseq [replica replicas]
      (replica c query))
    c))

(defn google [query]
  (let [c (chan)
        t (timeout 80)]
    (go (>! c (<! (fastest query web1 web2))))
    (go (>! c (<! (fastest query image1 image2))))
    (go (>! c (<! (fastest query video1 video2))))
    (go (loop [i 0 ret []]
          (if (= i 3)
            ret
            (recur (inc i) (conj ret (alt! [c t] ([v] v)))))))))

(let [el (by-id "ex4-out")
      c  (listen (by-id "search") :click)]
  (go (while true
        (<! c)
        (set-html! el (pr-str (<! (google "clojure")))))))
