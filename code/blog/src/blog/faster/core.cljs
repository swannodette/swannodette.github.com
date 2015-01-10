(ns blog.faster.core
  (:require [cljs.core.match :refer-macros [match]]
            [goog.dom :as gdom]
            [goog.events :as gevents])
  (:import [goog.events EventType]))

(enable-console-print!)

(defn slow-point? [p]
  (match [p]
    [{:x (true :<< number?) :y (true :<< number?)}] true
    :else false))

(defn fast-point? [p]
  (if (and (not (nil? p))
           (keyword-identical? (.-validated_ p) ::point))
    true
    (match [p]
      [{:x (true :<< number?) :y (true :<< number?)}]
      (do (set! (.-validated_ p) ::point) true)
      :else false)))

(defn square [x] (* x x))

(defn dist [p0 p1]
  (js/Math.sqrt
    (+ (square (- (:x p0) (:x p1)))
       (square (- (:y p0) (:y p1))))))

(defn slow-safe-dist [p0 p1]
  {:pre [(slow-point? p0) (slow-point? p1)]}
  (js/Math.sqrt
    (+ (square (- (:x p0) (:x p1)))
       (square (- (:y p0) (:y p1))))))

(defn fast-safe-dist [p0 p1]
  {:pre [(fast-point? p0) (fast-point? p1)]}
  (js/Math.sqrt
    (+ (square (- (:x p0) (:x p1)))
       (square (- (:y p0) (:y p1))))))

(defn bench-dist []
  (let [p0 {:x 1 :y 1}
        p1 {:x 2 :y 2}]
   (time
     (dotimes [_ 1000000]
       (dist p0 p1)))))

(defn bench-slow-safe-dist []
  (let [p0 {:x 1 :y 1}
        p1 {:x 2 :y 2}]
   (time
     (dotimes [_ 1000000]
       (slow-safe-dist p0 p1)))))

(defn bench-fast-safe-dist []
  (let [p0 {:x 1 :y 1}
        p1 {:x 2 :y 2}]
   (time
     (dotimes [_ 1000000]
       (fast-safe-dist p0 p1)))))

(defn run-bench []
  (gdom/setTextContent
    (gdom/getElement "benchmarks")
    (with-out-str
      (println "unsafe dist - ")
      (bench-dist)
      (println "\n")
      (println "slow safe dist - ")
      (bench-slow-safe-dist)
      (println "\n")
      (println "fast safe dist - ")
      (bench-fast-safe-dist))))

(gevents/listen (gdom/getElement "run") EventType.CLICK
  (fn [e] (run-bench)))
