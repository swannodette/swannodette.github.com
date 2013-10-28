(ns blog.responsive.core
  (:require-macros
    [cljs.core.async.macros :refer [go]]
    [cljs.core.match.macros :refer [match]])
  (:require
    [cljs.core.match]
    [cljs.core.async :refer [>! <! alts! chan]]
    [blog.utils.dom :as dom]
    [blog.utils.reactive :as r]))

;; -----------------------------------------------------------------------------
;; Declarations

(def ENTER 13)
(def UP_ARROW 38)
(def DOWN_ARROW 40)
(def TAB 9)
(def ESC 27)

(def KEYS #{UP_ARROW DOWN_ARROW ENTER TAB ESC})

(defn key-event->keycode [e]
  (.-keyCode e))

(defn key->keyword [code]
  (condp = code
    UP_ARROW   :previous
    DOWN_ARROW :next
    ENTER      :select
    TAB        :select
    ESC        :exit))

;; -----------------------------------------------------------------------------
;; Interface representation protocols

(defprotocol IHighlightable
  (-highlight! [list n])
  (-unhighlight! [list n]))

(defprotocol ISelectable
  (-select! [list n])
  (-unselect! [list n]))

;; -----------------------------------------------------------------------------
;; Event stream coordination

(defn handle-change-event [list idx key]
  (let [cnt (count list)]
    (match [idx key]
      [::none :next    ] 0
      [::none :previous] (dec cnt)
      [_      :next    ] (mod (inc idx) cnt)
      [_      :previous] (mod (dec idx) cnt))))

(defn handle-event [e cur list]
  (when (number? cur)
    (-unhighlight! list cur))
  (if (= e :clear)
    ::none
    (let [n (if (number? e) e (handle-change-event list cur e))]
      (-highlight! list n)
      n)))

(defn highlighter
  ([in list] (highlighter in list (chan)))
  ([in list control]
    (let [out (chan)]
      (go (loop [highlighted ::none]
            (let [[e c] (alts! [in control])]
              (condp = c
                control :done

                in (if (or (#{:next :previous :clear} e) (number? e))
                     (let [highlighted (handle-event e highlighted list)]
                       (>! out highlighted)
                       (recur highlighted))
                     (do (>! out e)
                       (recur highlighted)))))))
      out)))

(defn selector [in list data]
  (let [out (chan)]
    (go (loop [highlighted ::none selected ::none]
          (let [e (<! in)]
            (if (= e :select)
              (do
                (when (number? selected)
                  (-unselect! list selected))
                (if (number? highlighted)
                  (do
                    (-select! list highlighted)
                    (>! out [:select (nth data highlighted)]))
                  (>! out [:select highlighted]))
                (recur highlighted highlighted))
              (do
                (>! out e)
                (if (or (= e ::none) (number? e))
                  (recur e selected)
                  (recur highlighted selected)))))))
    out))

;; =============================================================================
;; Example constructor

(defn key-events [prevent-default?]
  (->> (r/listen js/document :keydown prevent-default?)
    (r/map key-event->keycode)
    (r/filter KEYS)
    (r/map key->keyword)))

(defn create-example [id event-fn render-fn ctor-fn]
  (let [hc      (r/hover (dom/by-id id))
        prevent (atom false)
        raw     (event-fn #(deref prevent))
        c       (r/toggle raw)
        changes (ctor-fn (:chan c))
        ctrl    (:control c)]
  (when render-fn
    (render-fn))
  (go
    (>! ctrl false)
    (while true
      (when (= (<! hc) :enter)
        (>! ctrl true)
        (reset! prevent true)
        (loop []
          (let [[e c] (alts! [hc changes])]
            (cond
              (= e :leave) (do (>! ctrl false)
                             (reset! prevent false))
              (= c changes) (do (when render-fn (render-fn))
                              (recur))
              :else (recur)))))))))

;; =============================================================================
;; Example 0

(defn set-char! [s i c]
  (str (.substring s 0 i) c (.substring s (inc i))))

(extend-type array
  IHighlightable
  (-highlight! [list n]
    (aset list n (set-char! (aget list n) 0 ">")))
  (-unhighlight! [list n]
    (aset list n (set-char! (aget list n) 0 " ")))

  ISelectable
  (-select! [list n]
    (aset list n (set-char! (aget list n) 1 "*")))
  (-unselect! [list n]
    (aset list n (set-char! (aget list n) 1 " "))))

(when (dom/by-id "ex0")
  (let [ui (array "   Alan Kay"
                  "   J.C.R. Licklider"
                  "   John McCarthy")]
    (create-example "ex0"
      key-events
      (fn []
        (dom/set-text! (dom/by-id "ex0-ui") (.join ui "\n")))
      (fn [events]
        (highlighter events ui)))))

;; =============================================================================
;; Example 1

(when (dom/by-id "ex1")
  (let [ui (array "   Smalltalk"
                  "   Lisp"
                  "   Prolog"
                  "   ML")]
    (create-example "ex1"
      key-events
      (fn []
        (dom/set-text! (dom/by-id "ex1-ui") (.join ui "\n")))
      (fn [events]
        (selector (highlighter events ui)
          ui ["smalltalk", "lisp", "prolog", "ml"])))))

;;=============================================================================
;; Example 2

(defn ex2-events [ui prevent]
  (r/fan-in [(key-events prevent)
             (r/hover-child ui "li")
             (r/map (constantly :select)
               (r/listen ui :click))]))

(extend-type js/HTMLUListElement
  ICounted
  (-count [list]
    (count (dom/by-tag-name list "li")))

  IHighlightable
  (-highlight! [list n]
    (dom/add-class! (nth (dom/by-tag-name list "li") n) "highlighted"))
  (-unhighlight! [list n]
    (dom/remove-class! (nth (dom/by-tag-name list "li") n) "highlighted"))

  ISelectable
  (-select! [list n]
    (dom/add-class! (nth (dom/by-tag-name list "li") n) "selected"))
  (-unselect! [list n]
    (dom/remove-class! (nth (dom/by-tag-name list "li") n) "selected")))

(when (dom/by-id "ex2-list")
  (let [ui (dom/by-id "ex2-list")]
    (create-example "ex2"
      (fn [prevent] (ex2-events ui prevent))
      nil
      (fn [events]
        (selector (highlighter events ui) ui
          ["pynchon" "proust" "faulkner" "melville"])))))
