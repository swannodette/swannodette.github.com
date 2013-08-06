(ns blog.utils.dom
  (:require [goog.style :as style]))

(defn by-id [id]
  (.getElementById js/document id))

(defn set-html! [el s]
  (set! (.-innerHTML el) s))

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

(defn index-of [node-list el]
  (loop [i 0]
    (if (< i (count node-list))
      (if (identical? (nth node-list i) el)
        i
        (recur (inc i)))
      -1)))

(defn offset [el]
  [(style/getPageOffsetLeft el) (style/getPageOffsetTop el)])
