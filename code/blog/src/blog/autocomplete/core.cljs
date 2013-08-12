(ns blog.autocomplete.core
  (:require-macros
    [cljs.core.async.macros :refer [go]])
  (:require
    [cljs.core.async :refer [>! <! alts! chan]]
    [blog.responsive.core :as resp]
    [blog.utils.dom :as dom]
    [blog.utils.reactive :as r]))

(def base-url
  "http://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=")

;; -----------------------------------------------------------------------------
;; Interface representation protocols

(defprotocol IHideable
  (-hide! [view])
  (-show! [view]))

(defprotocol ITextField
  (-set-text! [field txt])
  (-text [field]))

(defprotocol IUIList
  (-set-items! [list items]))

;; =============================================================================
;; Autocompleter

(defn menu-proc [select cancel menu data]
  (let [ctrl (chan)
        sel  (resp/selector
               (resp/highlighter select menu ctrl)
               menu data)]
    (go
      (let [[v sc] (alts! [cancel sel])]
        (>! ctrl :exit)
        (-hide! menu)
        (if (= sc cancel)
          ::cancel
          v)))))

(defn autocompleter* [{:keys [fetch select cancel menu] :as opts}]
  (let [out (chan)]
    (go (loop [items nil]
          (let [[v sc] (alts! [cancel select fetch])]
            (cond
              (= sc cancel)
              (do (-hide! menu)
                (recur items))

              (and items (= sc select))
              (let [v (<! ((:menu-proc opts) (r/concat [v] select)
                            cancel menu items))]
                (if (= v ::cancel)
                  (recur nil)
                  (do (-set-text! (:input opts) v)
                    (>! out v)
                    (recur items)))))

              (= sc fetch)
              (let [[v c] (alts! [cancel ((:completions opts) v)])]
                (if (= c cancel)
                  (do (-hide! menu)
                    (recur nil))
                  (do (-show! menu)
                    (let [items (nth v 1)]
                      (-set-items! menu items)
                      (recur items)))))

              :else
              (recur items))))
    out))

;; =============================================================================
;; HTML Specific Code

(extend-type js/HTMLInputElement
  ITextField
  (-set-text! [field text]
    (set! (.-value list) text))
  (-text [field]
    (.-value field)))

(extend-type js/HTMLUListElement
  IHideable
  (-hide! [list]
    (dom/add-class! list "hidden"))
  (-show! [list]
    (dom/remove-class! list "hidden"))

  IUIList
  (-set-items! [list items]
    (->> (for [item items] (str "<li>" item "</li>"))
      (apply str)
      (dom/set-html! list))))

(defn html-menu-events [input menu]
  (r/fan-in
    [(->> (r/listen input :keyup)
       (r/map resp/key-event->keycode)
       (r/filter resp/KEYS)
       (r/map resp/key->keyword))
     (r/hover-child menu "li")
     (r/map (constantly :select)
       (r/listen menu :click))]))

(defn html-input-events [input]
  (->> (r/listen input :keyup)
    (r/map #(-text input))
    (r/split #(string/blank? %))))

(defn html-completions [base-url]
  (fn [query]
    (r/jsonp (str base-url query))))

(defn html-autocompleter [input menu msecs]
  (let [[filtered removed] (html-input-events input)]
    (autocompleter*
      {:fetch  (r/throttle filtered msecs)
       :select (html-menu-events input menu)
       :cancel (r/map (constantly :cancel)
                 (r/fan-in [removed (r/listen input :blur)]))
       :input        input
       :menu         menu
       :menu-proc    menu-proc
       :completions (html-completions base-url)})))

;; =============================================================================
;; Example

#_(let [ac (html-autocompleter
           (dom/by-id "autocomplete")
           (dom/by-id "autocomplete-menu")
           750)]
  (go (while true (<! ac))))

#_(go
  (-set-items! (dom/by-id "autocomplete-menu")
    (nth (<! (r/jsonp (str base-url "dog"))) 1)))

