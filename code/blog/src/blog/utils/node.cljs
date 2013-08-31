(ns blog.utils.node
  (:require [blog.utils.reactive :as r]))

(def fs (js/require "fs"))

(defn read-file [fname encoding]
  (r/run-task (.-readFile fs) fname encoding))
