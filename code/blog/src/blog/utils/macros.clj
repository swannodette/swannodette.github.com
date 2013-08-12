(ns blog.utils.macros)

(defmacro dochan [[binding chan] & body]
  `(cljs.core.async.macros/go
     (loop []
       (if-let [~binding (cljs.core.async/<! ~chan)]
         (do
           ~@body
           (recur))
         :done))))
