(require '[clojure.java.io :as io]
         '[cognitect.transit :as t])
(import [java.io ByteArrayOutputStream])

(def cache
  (read-string
    (slurp (io/resource "cljs/core.cljs.cache.aot.edn"))))

(def out (ByteArrayOutputStream. 1000000))

(def writer (t/writer out :json))

(t/write writer cache)

(def out-path
  "../../assets/js/cljs_next/cljs/core.cljs.cache.aot.json")

(spit (io/file out-path) (.toString out))
