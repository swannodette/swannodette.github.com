(ns blog.instrument.core
  (:require [om.core :as om :include-macros true]
            [om.dom :as dom :include-macros true]))

(enable-console-print!)

;; =============================================================================
;; Declarations

(def app-state
  (atom {:animals [{:name "Aardvark" :species "Orycteropus afer"}
                   {:name "Humpback Whale" :species "Megaptera novaeangliae"}
                   {:name "Platypus" :species "Ornithorhynchus anatinus"}
                   {:name "Zebra" :species "Equus zebra"}]}))

(defn inline-block []
  #js {:style #js {:display "inline-block"}})

;; =============================================================================
;; Application

(defn animal-view [animal owner]
  (reify
    om/IRender
    (render [_]
      (dom/div nil (str "- " (:name animal))))))

(defn animals-view [app owner]
  (reify
    om/IRender
    (render [_]
      (dom/div nil
        (apply dom/ul nil
          (om/build-all animal-view (:animals app)))))))

;; =============================================================================
;; Inspection

(defn something-else [[_ cursor :as original] owner opts]
  (reify
    om/IRender
    (render [_]
      (dom/div nil
        (dom/div nil
          (dom/code nil (str "path: " (pr-str (om/path cursor)))))
        (dom/div nil
          (dom/code nil (str "value: " (pr-str (om/value cursor)))))
        (apply om/build* original)))))

;; =============================================================================
;; Init

(om/root animals-view app-state
  {:target (.getElementById js/document "ex0")})

(om/root animals-view app-state
  {:target (.getElementById js/document "ex1")
   :instrument
   (fn [f cursor m]
     (if (= f animal-view)
       (om/build* something-else [f cursor m])
       ::om/pass))})
