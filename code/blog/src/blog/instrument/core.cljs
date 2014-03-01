(ns blog.instrument.core
  (:require [om.core :as om :include-macros true]
            [om.dom :as dom :include-macros true]
            [cljs.reader :as reader]))

(enable-console-print!)

;; =============================================================================
;; Declarations

(def app-state
  (atom {:ui [{:checked false :label "Foo" :count 0}
              {:checked false :label "Foo" :count 0}]}))

(defn inline-block []
  #js {:style #js {:display "inline-block"}})

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

(defn first-view [data owner]
  (reify
    om/IRender
    (render [_]
      (om/build radio-button (nth (:ui data) 0)))))

(defn second-view [data owner]
  (reify
    om/IRender
    (render [_]
      (om/build radio-button (nth (:ui data) 1)))))

;; =============================================================================
;; Inspection

(defn handle-change [e cursor owner]
  (let [value (.. e -target -value)]
    (try
      (let [data (reader/read-string value)]
        (om/transact! cursor (fn [_] data)))
      (catch :default ex nil)
      (finally
        (om/set-state! owner :value value)))))

(defn pr-map-cursor [cursor]
  (pr-str
    (into cljs.core.PersistentHashMap.EMPTY
      (om/value cursor))))

(defn something-else [[_ cursor :as original] owner opts]
  (reify
    om/IInitState
    (init-state [_]
      {:value (pr-map-cursor cursor)
       :editing false})
    om/IRenderState
    (render-state [_ {:keys [editing value]}]
      (dom/div nil
        (dom/div nil
          (dom/label nil "path:")
          (dom/code nil (pr-str (om/path cursor))))
        (dom/div nil
          (dom/label nil "value:")
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

(om/root first-view app-state
  {:target (.getElementById js/document "ex0")})

(om/root second-view app-state
  {:target (.getElementById js/document "ex1")
   :instrument
   (fn [f cursor m]
     (if (= f radio-button)
       (om/build* something-else (om/graft [f cursor m] cursor))
       ::om/pass))})
