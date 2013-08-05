(ns blog.utils.dom
  (:require [goog.style :as style]))

(defn by-id [id]
  (.getElementById js/document id))

(defn set-html! [el s]
  (set! (.-innerHTML el) s))

(defn set-class! [el class]
  (set! (.-className el) class))

(defn offset [el]
  [(style/getPageOffsetLeft el) (style/getPageOffsetTop el)])
