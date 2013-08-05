(ns blog.utils.reactive
  (:refer-clojure :exclude [map filter remove])
  (:require [goog.events :as events]
            [cljs.core.async :refer [>! <! chan put! close!]])
  (:require-macros [cljs.core.async.macros :refer [go]]))

(defn listen [el type]
  (let [c (chan)]
    (events/listen el type #(put! c %))
    c))

(defn map [f in]
  (let [c (chan)]
    (go (loop []
          (if-let [v (<! in)]
            (do (>! c (f v))
              (recur))
            (close! c))))
    c))
