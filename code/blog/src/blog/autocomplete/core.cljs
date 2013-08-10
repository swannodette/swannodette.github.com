(ns blog.autocomplete.core
  (:require-macros
    [cljs.core.async.macros :refer [go alt!]]
    [cljs.core.match.macros :refer [match]])
  (:require
    [cljs.core.match]
    [cljs.core.async :refer [>! <! alts! put! sliding-buffer chan]]
    [blog.utils.dom :as dom]
    [blog.utils.reactive :as r]))

;; -----------------------------------------------------------------------------
;; Declarations

(def ENTER 13)
(def UP_ARROW 38)
(def DOWN_ARROW 40)

(def KEYS #{UP_ARROW DOWN_ARROW ENTER})

(defn key-event->keycode [e]
  (.-keyCode e))

(defn key->keyword [code]
  (condp = code
    UP_ARROW :previous
    DOWN_ARROW :next
    ENTER :select))

;; -----------------------------------------------------------------------------
;; Interface representation protocols

(defprotocol IHighlightable
  (-highlight! [list n])
  (-unhighlight! [list n]))

(defprotocol ISelectable
  (-select! [list n])
  (-unselect! [list n]))

(defprotocol IHideable
  (-hide! [view])
  (-show! [view]))

;; -----------------------------------------------------------------------------
;; Highlighting and Selection

(defn handle-change-event [list idx key]
  (let [cnt (count list)]
    (match [idx key]
      [::none :next    ] 0
      [::none :previous] (dec cnt)
      [_      :next    ] (mod (inc idx) cnt)
      [_      :previous] (mod (dec idx) cnt))))

(defn handle-event [e cur list]
  (when (and list (number? cur))
    (-unhighlight! list cur))
  (if (= e :clear)
    ::none
    (let [n (if (number? e) e (handle-change-event list cur e))]
      (when list (-highlight! list n))
      n)))

(defn highlighter [in list]
  (let [out (chan)]
    (go (loop [highlighted ::none]
          (let [e (<! in)]
            (if (or (#{:next :previous :clear} e) (number? e))
              (let [highlighted (handle-event e highlighted list)]
                (>! out highlighted)
                (recur highlighted))
              (do (>! out e)
                (recur highlighted))))))
    out))

(defn selector [in list data]
  (let [out (chan)]
    (go (loop [highlighted ::none selected ::none]
          (let [e (<! in)]
            (if (= e :select)
              (do
                (when (and list (number? selected))
                  (-unselect! list selected))
                (when list (-select! list highlighted))
                (>! out [:select (nth data highlighted)])
                (recur highlighted highlighted))
              (do
                (>! out e)
                (if (or (= e ::none) (number? e))
                  (recur e selected)
                  (recur highlighted selected)))))))
    out))

;; =============================================================================
;; Autocompleter

(defn menu-proc [last-event select cancel menu data]
  (let [{sel :chan ctrl :control}
        (selector
          (r/concat [last-event] (highlighter select menu))
          menu data)]
    (go
      (let [[v sc] (alts! [sel cancel])]
        (if (= sc cancel)
          ::cancel
          (do (-set-text! input v)
            (>! ctrl :exit)
            (-hide! menu)
            v))))))

(defn autocompleter* [fetch select cancel input menu]
  (let [out (chan)]
    (go (loop [data nil]
          (let [[v sc] (alts! [cancel select fetch])]
            (cond
              (= sc cancel)
              (do (-hide! menu)
                (recur data))

              (and data (= sc select))
              (let [v (<! (menu-proc v select cancel menu data))]
                (if (= v ::cancel)
                  (recur nil)
                  (do (>! out v)
                    (recur data)))))

              (= sc fetch)
              (let [[v c] (alts! [cancel (r/jsonp (str base-url v))])]
                (if (= c cancel)
                  (do (-hide! menu)
                    (recur nil))
                  (do (-show! menu)
                    (show-results res)
                    (recur (nth v 1)))))

              :else
              (recur data)))))
    out))

;; =============================================================================
;; HTML Specific Code

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
    (dom/remove-class! (nth (dom/by-tag-name list "li") n) "selected"))

  IHideable
  (-hide! [list]
    (dom/add-class! list "hidden"))
  (-show! [list]
    (dom/remove-class! list "hidden")))

;; =============================================================================
;; The Example

(defn menu-events [input menu]
  (r/fan-in
    [(->> (r/listen input :keydown)
       (r/map key-event->keycode)
       (r/filter KEYS)
       (r/map key->keyword))
     (r/hover-child ui "li")
     (r/map (constantly :select)
       (r/listen ui :click))]))

(defn input-events [input]
  (->> (events/listen input :keyup)
    (map #(.-value input))
    (r/split #(string/blank? %))))

(defn html-autocompleter [input menu msecs]
  (let [[filtered removed] (input-events input)
        ac (autocomplete
             (throttle filtered msecs)
             (menu-events input menu)
             (map (constantly :cancel)
               (fan/in [removed (events/listen input :blur)]))
             input menu)]
    (go (while true (<! ac)))))

(html-autocompleter
  (by-id "autocomplete")
  (by-id "atutocomplete-menu")
  750)
