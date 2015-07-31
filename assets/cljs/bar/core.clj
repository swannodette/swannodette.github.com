(ns bar.core)

(defmacro multi [a b]
  `(* ~a ~b))
