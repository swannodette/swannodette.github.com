(ns blog.autocomplete.core
  (:require-macros
    [cljs.core.async.macros :refer [go]]
    [blog.utils.macros :refer [dochan]])
  (:require
    [clojure.string :as string]
    [cljs.core.async :refer [>! <! alts! chan sliding-buffer]]
    [blog.responsive.core :as resp]
    [blog.utils.dom :as dom]
    [blog.utils.helpers :as h]
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
        sel  (->> (resp/selector
                    (resp/highlighter select menu ctrl)
                    menu data)
               (r/filter vector?)
               (r/map second))]
    (go (let [[v sc] (alts! [cancel sel])]
          (do (>! ctrl :exit)
            (if (= sc cancel)
              ::cancel
              v))))))

(defn autocompleter* [{:keys [focus fetch select cancel menu] :as opts}]
  (let [out (chan)]
    (go (loop [items nil focused false]
          (let [[v sc] (alts! [cancel focus select fetch])]
            (cond
              (= sc focus)
              (recur items true)

              (= sc cancel)
              (do (-hide! menu)
                (recur items (not= v :blur)))

              (and focused (= sc fetch))
              (let [[v c] (alts! [cancel ((:completions opts) v)])]
                (if (= c cancel)
                  (do (-hide! menu)
                    (recur nil (not= v :blur)))
                  (do (-show! menu)
                    (-set-items! menu v)
                    (recur v focused))))
              
              (and items (= sc select))
              (let [choice (<! ((:menu-proc opts) (r/concat [v] select)
                                 cancel menu items))]
                (-hide! menu)
                (if (= choice ::canceled)
                  (recur nil (not= v :blur))
                  (do (-set-text! (:input opts) choice)
                    (>! out choice)
                    (recur nil focused)))))

              :else
              (recur items focused))))
    out))

;; =============================================================================
;; HTML Specific Code

(extend-type js/HTMLInputElement
  ITextField
  (-set-text! [field text]
    (set! (.-value field) text))
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

(defn menu-item-event [menu type]
  (->> (r/listen menu type
         (fn [e]
           (when (dom/in? e menu)
             (.preventDefault e)))
         (chan (sliding-buffer 1)))
    (r/map
      (fn [e]
        (let [li (dom/parent (.-target e) "li")]
          (h/index-of (dom/by-tag-name menu "li") li))))))

(defn html-menu-events [input menu]
  (r/fan-in
    [(->> (r/listen input :keydown)
       (r/map resp/key-event->keycode)
       (r/filter resp/KEYS)
       (r/map resp/key->keyword))
     (r/hover-child menu "li")
     (->> (r/cyclic-barrier
            [(menu-item-event menu :mousedown)
             (menu-item-event menu :mouseup)])
       (r/filter (fn [[d u]] (= d u)))
       (r/always :select))]))

(defn html-input-events [input]
  (->> (r/listen input :keydown)
    (r/map #(-text input))
    (r/split #(not (string/blank? %)))))

(defn html-autocompleter [input menu completions msecs]
  (let [[filtered removed] (html-input-events input)]
    (autocompleter*
      {:focus  (r/always :focus (r/listen input :focus))
       :fetch  (r/throttle (r/distinct filtered) msecs)
       :select (html-menu-events input menu)
       :cancel (r/fan-in [removed (r/always :blur (r/listen input :blur))])
       :input  input
       :menu   menu
       :menu-proc   menu-proc
       :completions completions})))

;; =============================================================================
;; Example

(defn wikipedia-search [query]
  (go (nth (<! (r/jsonp (str base-url query))) 1)))

(let [ac (html-autocompleter
           (dom/by-id "autocomplete")
           (dom/by-id "autocomplete-menu")
           wikipedia-search 750)]
  (go (while true (<! ac))))
