(ns blog.contracts.core
  (:require-macros [blog.contracts.core :refer [add-contract]]))

(enable-console-print!)

(defn contract-fail-str [x {:keys [ns name]} src-info]
  (str x " fails vector contract " (symbol (str ns) (str name))
         " specified at " (:file src-info) ":" (:line src-info)))

(defn add-contract*
  ([v cvar src-info] (add-contract* v cvar @cvar src-info))
  ([v cvar f src-info]
   (specify v
     ISeqable
     (-seq [_]
       (map #(do (assert (f %) (contract-fail-str % (meta cvar) src-info)) %) v))
     ICollection
     (-conj [this x]
       (assert (f x) (contract-fail-str x (meta cvar) src-info))
       (add-contract* (-conj v x) f src-info))
     IVector
     (-assoc-n [this i x]
       (assert (f x) (contract-fail-str x (meta cvar) src-info))
       (add-contract* (-assoc-n v i x) cvar f src-info)))))
