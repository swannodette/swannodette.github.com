(ns cljs-next.core
  (:require [cljs.js :as cljs]))

(enable-console-print!)

(def st (cljs/empty-state))

(cljs/eval-str st "(+ 1 2)" 'cljs-next.core
  {:eval cljs/js-eval
   :context :expr}
  (fn [res]
    (println res)))
