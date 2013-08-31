(ns blog.errors.core
  (:require-macros
    [cljs.core.async.macros :refer [go]]
    [blog.utils.macros :refer [<?]])
  (:require
    [blog.utils.helpers :as h]
    [blog.utils.node :as node]
    [cljs.core.async :refer [>! <!]]))

(go (try
      (let [x (<? (node/read-file "foo.txt" "utf8"))]
        (.log js/console "Success," x))
      (catch js/Error e
        (.log js/console "Oops" e (.-stack e)))))

#_(go (try
      (let [tweets (<? (get-tweets-for "swannodette"))
            [most-recent] (parse-tweets-for-urls tweets)
            response (<? (http-get (<? (expand-url most-recent))))]
        (.log js/console "Most recent link text:" response))
      (catch js/Error e
        (.log js/console "Error with the twitterverse:" e))))o
