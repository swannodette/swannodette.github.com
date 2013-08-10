(ns blog.autocomplete.core
  (:require-macros
    [cljs.core.async.macros :refer [go alt!]]
    [cljs.core.match.macros :refer [match]])
  (:require
    [cljs.core.match]
    [cljs.core.async :refer [>! <! alts! put! sliding-buffer chan]]
    [blog.reponsive.core :as resp]
    [blog.utils.dom :as dom]
    [blog.utils.reactive :as r]))

;; -----------------------------------------------------------------------------
;; Interface representation protocols

(defprotocol IHideable
  (-hide! [view])
  (-show! [view]))

(defprotocol ITextField
  (-set-text! [field txt])
  (-text [field]))

;; =============================================================================
;; Autocompleter

(defn menu-proc [last-event select cancel menu data]
  (let [{sel :chan ctrl :control}
        (resp/selector
          (r/concat [last-event] (resp/highlighter select menu))
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

(extend-type js/HTMLInput
  ITextField
  (-set-text! [field text]
    (set (.-value list) text))
  (-text [field]
    (.-value field)))

(extend-type js/HTMLUListElement
  IHideable
  (-hide! [list]
    (dom/add-class! list "hidden"))
  (-show! [list]
    (dom/remove-class! list "hidden")))

(defn html-menu-events [input menu]
  (r/fan-in
    [(->> (r/listen input :keyup)
       (r/map resp/key-event->keycode)
       (r/filter resp/KEYS)
       (r/map resp/key->keyword))
     (r/hover-child ui "li")
     (r/map (constantly :select)
       (r/listen ui :click))]))

(defn html-input-events [input]
  (->> (r/listen input :keyup)
    (r/map #(-text input))
    (r/split #(string/blank? %))))

(defn html-autocompleter [input menu msecs]
  (let [[filtered removed] (html-input-events input)
        ac (autocomplete
             (r/throttle filtered msecs)
             (html-menu-events input menu)
             (r/map (constantly :cancel)
               (r/fan-in [removed (r/listen input :blur)]))
             input menu)]
    ac))

;; =============================================================================
;; Example

(let [ac (html-autocompleter
           (dom/by-id "autocomplete")
           (dom/by-id "atutocomplete-menu")
           750)]
  (go (while true (<! ac))))
