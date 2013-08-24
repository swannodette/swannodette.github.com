(ns blog.promises.core
  (:require-macros
    [cljs.core.async.macros :refer [go]])
  (:require
    [cljs.core.async :refer [>! <! chan put! take!]]))

(defn ^:export go-cljs []
  (let [first (chan)
        last (loop [i 0 last first]
               (if (< i 100000)
                 (let [next (chan)]
                   (take! last (fn [v] (put! next (inc v))))
                   (recur (inc i) next))
                 last))]
    (go (let [s  (js/Date.)
              el (.getElementById js/document "cljs-time")]
          (>! first 0)
          (set! (.-innerHTML el)
            (str (<! last) " elapsed ms: " (- (js/Date.) s)))))))
