(ns blog.utils.helpers)

(defn index-of [x xs]
  (let [len (count xs)]
    (loop [i 0]
      (if (< i len)
        (if (xs (nth xs i) x)
          i
          (recur (inc i)))
        -1))))
