(ns blog.faster.core
  (:require [cljs.core.match :refer-macros [match]]))

(set! *print-fn* js/print)

(defn slow-point? [p]
  (match [p]
    [{:x (true :<< number?) :y (true :<< number?)}]
    (do (set! (.-validated_ p) ::point) true)
    :else false))

(defn fast-point? [p]
  (if (and (not (nil? p))
           (keyword-identical? (.-validated_ p) ::point))
    true
    (match [p]
      [{:x (true :<< number?) :y (true :<< number?)}]
      (do (set! (.-validated_ p) ::point) true)
      :else false)))

(defn add [p0 p1]
  {:x (+ (:x p0) (:x p1))
   :y (+ (:y p0) (:y p1))})

(defn slow-safe-add [p0 p1]
  {:pre [(slow-point? p0) (slow-point? p1)]}
  {:x (+ (:x p0) (:x p1))
   :y (+ (:y p0) (:y p1))})

(defn fast-safe-add [p0 p1]
  {:pre [(fast-point? p0) (fast-point? p1)]}
  {:x (+ (:x p0) (:x p1))
   :y (+ (:y p0) (:y p1))})

(defn ^:export bench-add []
  (let [p0 {:x 1 :y 1}
        p1 {:x 2 :y 2}]
   (time
     (dotimes [_ 1000000]
       (add p0 p1)))))

(defn ^:export bench-slow-safe-add []
  (let [p0 {:x 1 :y 1}
        p1 {:x 2 :y 2}]
   (time
     (dotimes [_ 1000000]
       (slow-safe-add p0 p1)))))

(defn ^:export bench-fast-safe-add []
  (let [p0 {:x 1 :y 1}
        p1 {:x 2 :y 2}]
   (time
     (dotimes [_ 1000000]
       (fast-safe-add p0 p1)))))

(bench-add)
(bench-slow-safe-add)
(bench-fast-safe-add)
