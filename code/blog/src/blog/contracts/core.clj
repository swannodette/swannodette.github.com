(ns blog.contracts.core)

(defmacro add-contract [v cvar]
  (let [m (meta &form)]
    `(blog.contracts.core/add-contract*
       ~v ~cvar ~(select-keys m [:file :line]))))
