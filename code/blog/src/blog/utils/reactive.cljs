(ns blog.utils.reactive
  (:refer-clojure :exclude [map filter remove])
  (:require [goog.events :as events]
            [goog.events.EventType]
            [cljs.core.async :refer [>! <! chan put! close!]])
  (:require-macros [cljs.core.async.macros :refer [go]]))

(def keyword->event-type
  {:keyup goog.events.EventType.KEYUP
   :keydown goog.events.EventType.KEYDOWN
   :keypress goog.events.EventType.KEYPRESS
   :click goog.events.EventType.CLICK
   :dblclick goog.events.EventType.DBLCLICK
   :mouseover goog.events.EventType.MOUSEOVER
   :mouseout goog.events.EventType.MOUSEOUT
   :mousemove goog.events.EventType.MOUSEMOVE})

(defn listen [el type]
  (let [c (chan)]
    (events/listen el (keyword->event-type type) #(put! c %))
    c))

(defn map [f in]
  (let [c (chan)]
    (go (loop []
          (if-let [v (<! in)]
            (do (>! c (f v))
              (recur))
            (close! c))))
    c))
