(ns blog.autocomplete.core
  (:require-macros
    [cljs.core.async.macros :refer [go]])
  (:require
    [goog.userAgent :as ua]
    [goog.events :as events]
    [goog.events.EventType]
    [clojure.string :as string]
    [cljs.core.async :refer [>! <! alts! chan sliding-buffer put!]]
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
;; Autocompleter, pure process logic untainted by HTML concerns

(defn menu-proc [select cancel menu data]
  (let [ctrl (chan)
        sel  (->> (resp/selector
                    (resp/highlighter select menu ctrl)
                    menu data)
               (r/filter vector?)
               (r/map second))]
    (go (let [[v sc] (alts! [cancel sel])]
          (do (>! ctrl :exit)
            (if (or (= sc cancel)
                    (= v ::resp/none))
              ::cancel
              v))))))

(defn autocompleter* [{:keys [focus query select cancel menu] :as opts}]
  (let [out (chan)
        [query raw] (r/split r/throttle-msg? query)]
    (go (loop [items nil focused false]
          (let [[v sc] (alts! [raw cancel focus query select])]
            (cond
              (= sc focus)
              (recur items true)

              (= sc cancel)
              (do (-hide! menu)
                (>! (:query-ctrl opts) (h/now))
                (recur items (not= v :blur)))

              (and focused (= sc query))
              (let [[v c] (alts! [cancel ((:completions opts) (second v))])]
                (if (or (= c cancel) (zero? (count v)))
                  (do (-hide! menu)
                    (recur nil (not= v :blur)))
                  (do
                    (-show! menu)
                    (-set-items! menu v)
                    (recur v focused))))

              (and items (= sc select))
              (let [_ (reset! (:selection-state opts) true)
                    _ (>! (:query-ctrl opts) (h/now))
                    choice (<! ((:menu-proc opts) (r/concat [v] select)
                                 (r/fan-in [raw cancel]) menu items))]
                (reset! (:selection-state opts) false)
                (-hide! menu)
                (if (= choice ::cancel)
                  (recur nil (not= v :blur))
                  (do (-set-text! (:input opts) choice)
                    (>! out choice)
                    (recur nil focused))))

              :else
              (recur items focused)))))
    out))

;; =============================================================================
;; HTML Specific Code, DANGER DANGER DANGER Quarantine Line

(defn less-than-ie9? []
  (and ua/IE (not (ua/isVersion 9))))

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

(defn menu-item-event [menu input type]
  (->> (r/listen menu type
         (fn [e]
           (when (dom/in? e menu)
             (.preventDefault e))
           (when (less-than-ie9?)
             (.focus input)))
         (chan (sliding-buffer 1)))
    (r/map
      (fn [e]
        (let [li (dom/parent (.-target e) "li")]
          (h/index-of (dom/by-tag-name menu "li") li))))))

(defn html-menu-events [input menu allow-tab?]
  (r/fan-in
    [;; keyboard menu controls, tab special handling
     (->> (r/listen input :keydown
            (fn [e]
              (when (and @allow-tab?
                         (= (.-keyCode e) resp/TAB))
                (.preventDefault e))))
       (r/map resp/key-event->keycode)
       (r/filter
         (fn [kc]
           (and (resp/KEYS kc)
                (or (not= kc resp/TAB)
                    @allow-tab?))))
       (r/map resp/key->keyword))
     ;; hover events, index of hovered child
     (r/hover-child menu "li")
     ;; need to handle menu clicks
     (->> (r/cyclic-barrier
            [(menu-item-event menu input :mousedown)
             (menu-item-event menu input :mouseup)])
       (r/filter (fn [[d u]] (= d u)))
       (r/always :select))]))

(defn relevant-keys [kc]
  (or (= kc 8)
      (and (> kc 46)
           (not (#{91 92 93} kc)))))

(defn html-input-events [input]
  (->> (r/listen input :keydown)
    (r/remove (fn [e] (.-platformModifierKey e)))
    (r/map resp/key-event->keycode)
    (r/filter relevant-keys)
    (r/map #(-text input))
    (r/split #(not (string/blank? %)))))

(defn ie-blur [input menu selection-state]
  (let [out (chan)]
    (events/listen input goog.events.EventType.KEYDOWN
      (fn [e]
        (when (and (= (.-keyCode e) resp/TAB) (not @selection-state))
          (put! out (h/now)))))
    (events/listen js/document.body goog.events.EventType.MOUSEDOWN
      (fn [e]
        (when-not (some #(dom/in? e %) [menu input])
          (put! out (h/now)))))
    out))

(defn html-autocompleter [input menu completions throttle]
  (let [selection-state (atom false)
        query-ctrl (chan)
        [filtered removed] (html-input-events input)]
    (when (less-than-ie9?)
      (events/listen menu goog.events.EventType.SELECTSTART
        (fn [e] false)))
    (-set-text! input "")
    (autocompleter*
      {:focus (r/always :focus (r/listen input :focus))
       :query (r/throttle* (r/distinct filtered) throttle (chan) query-ctrl)
       :query-ctrl query-ctrl
       :select (html-menu-events input menu selection-state)
       :cancel (r/fan-in
                 [removed
                  (r/always :blur
                    (if-not (less-than-ie9?)
                      (r/listen input :blur)
                      (ie-blur input menu selection-state)))])
       :input input
       :menu menu
       :menu-proc menu-proc
       :completions completions
       :selection-state selection-state})))

;; =============================================================================
;; Example

(defn wikipedia-search [query]
  (go (nth (<! (r/jsonp (str base-url query))) 1)))

(let [ac (html-autocompleter
           (dom/by-id "autocomplete")
           (dom/by-id "autocomplete-menu")
           wikipedia-search 750)]
  (go (while true (<! ac))))

