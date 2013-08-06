(ns blog.utils.dom
  (:require [goog.style :as style]
            [goog.dom :as dom]))

(defn by-id [id]
  (.getElementById js/document id))

(defn set-html! [el s]
  (set! (.-innerHTML el) s))

(defn set-text! [el s]
  (dom/setTextContent el s))

(defn set-class! [el class]
  (set! (.-className el) class))

(defn add-class! [el name]
  (let [cn (.-className el)]
    (when (= (.search cn name) -1)
      (set! (.-className el) (str cn " " name)))))

(defn remove-class! [el name]
  (let [cn (.-className el)]
    (when-not (= (.search cn name) -1)
      (set! (.-className el) (.replace cn name "")))))

(defn tag-match [tag]
  (fn [el]
    (when-let [tag-name (.-tagName el)]
      (= tag (.toLowerCase tag-name)))))

(defn el-matcher [el]
  (fn [other] (identical? other el)))

(defn by-tag-name [el tag]
  (prim-seq (.getElementsByTagName el tag)))

(defn offset [el]
  [(style/getPageOffsetLeft el) (style/getPageOffsetTop el)])
