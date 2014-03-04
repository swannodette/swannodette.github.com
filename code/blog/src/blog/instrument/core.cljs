(ns blog.instrument.core
  (:require [om.core :as om :include-macros true]
            [om.dom :as dom :include-macros true]
            [cljs.reader :as reader]))

(enable-console-print!)

;; =============================================================================
;; Declarations

(def app-state
  (atom {:ui [{:checked false :label "Foo" :count 0}
              {:checked false :label "Bar" :count 0}
              {:checked false :label "Baz" :count 0}]}))

;; =============================================================================
;; Application

(defn radio-button [data owner]
  (reify
    om/IRender
    (render [_]
      (dom/div #js {:className "radio"}
        (dom/input #js {:type "checkbox"
                        :checked (:checked data)
                        :onChange
                        (fn [e]
                          (om/transact! data :checked not)
                          (om/transact! data :count inc))})
        (dom/label nil (:label data))))))

(defn all-buttons [data owner]
  (reify
    om/IRender
    (render [_]
      (apply dom/div nil
        (om/build-all radio-button (:ui data))))))

;; =============================================================================
;; Inspection

(defn pr-map-cursor [cursor]
  (pr-str
    (into cljs.core.PersistentHashMap.EMPTY
      (om/value cursor))))

(defn handle-change [e cursor owner]
  (let [value (.. e -target -value)]
    (try
      (let [data (reader/read-string value)]
        (if (= (set (keys @cursor)) (set (keys data)))
          (do
            (om/transact! cursor (fn [_] data))
            (om/set-state! owner :value value))
          (om/update-state! owner :value identity)))
      (catch :default ex
        (om/set-state! owner :value value)))))

(defn pr-map-cursor [cursor]
  (pr-str
    (into cljs.core.PersistentHashMap.EMPTY
      (om/value cursor))))

(defn editor [[_ cursor :as original] owner opts]
  (reify
    om/IInitState
    (init-state [_]
      {:value (pr-map-cursor cursor)
       :editing false})
    om/IRenderState
    (render-state [_ {:keys [editing value]}]
      (dom/div #js {:className "editor"}
        (dom/div nil
          (dom/label #js {:className "inspector"} "path:")
          (dom/code nil (pr-str (om/path cursor))))
        (dom/div nil
          (dom/label #js {:className "inspector"} "value:")
          (dom/input
            #js {:className "edit"
                 :value (if editing
                          value
                          (pr-map-cursor cursor))
                 :onFocus (fn [e]
                            (om/set-state! owner :editing true)
                            (om/set-state! owner :value
                              (pr-map-cursor (second (om/get-props owner)))))
                 :onBlur (fn [e] (om/set-state! owner :editing false))
                 :onChange #(handle-change % cursor owner)}))
        (apply om/build* original)))))

;; =============================================================================
;; Init

(om/root all-buttons app-state
  {:target (.getElementById js/document "ex0")})

(om/root all-buttons app-state
  {:target (.getElementById js/document "ex1")
   :instrument
   (fn [f cursor m]
     (if (= f radio-button)
       (om/build* editor (om/graft [f cursor m] cursor))
       ::om/pass))})
