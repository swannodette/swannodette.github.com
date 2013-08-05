(ns blog.utils.dom)

(defn by-id [id]
  (.getElementById js/document id))

(defn set-html [el s]
  (set! (.-innerHTML el) s))
