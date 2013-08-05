(ns blog.processes.core
  (:require [cljs.core.async :as async
             :refer [<! >! chan put! timeout]]
            [blog.utils.dom :refer [by-id set-html! set-class!]])
  (:require-macros [cljs.core.async.macros :refer [go]]))

(def width 100)
(def height 100)

(defn gen-ui []
  (let [arr (array)]
    (loop [y 0]
      (when (< y height)
        (.push arr  "<tr>")
        (loop [x 0]
          (when (< x width)
            (.push arr (str "<td id='cell-") (+ x (* y width)) "'>0</td>")
            (recur (inc x))))
        (.push arr "</tr>")
        (recur (inc y))))
    (set-html! (by-id "big-table") (.join arr ""))))

(gen-ui)

(def group (atom 0))

(defn render! [queue]
  (let [g (str "group" @group)]
    (doseq [[idx v] queue]
      (let [cell (by-id (str "cell-" idx))]
        (set-html! cell v)
        (set-class! cell g)))
    (swap! group (fn [g] (mod (inc g) 5)))))

(defn render-loop [rate]
  (let [in (chan 1000)]
    (go (loop [refresh (timeout rate) queue []]
          (let [[v c] (alts! [refresh in])]
            (condp = c
              refresh (do (render! queue)
                        (<! (timeout 0))
                        (recur (timeout rate) []))
              in (recur refresh (conj queue v))))))
    in))

(let [render (render-loop 40)]
  (loop [i 0]
    (when (< i (* width height))
      (go (while true
            (<! (timeout (+ 1000 (rand-int 10000))))
            (>! render [(rand-int 10000) (rand-int 10)])))
      (recur (inc i)))))
