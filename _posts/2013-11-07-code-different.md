---
layout: post
title: "Code Different"
description: ""
category: 
tags: []
---
{% include JB/setup %}

```
(def wiki-search-url)

(defn by-id [id]
  (.getElementById js/document id))

(defn listen [el type]
  (let [out (chan)]
    (events/listen el type
      (fn [e] (put! out e)))
    out))

(defn get-query []
  (str wiki-search-url (.-value input))

(defn init []
  (let [click  (listen (by-id "search") "click")
        search (by-id "search-input"))
        output (by-id "serach-results")]
    (go (while true
          (<! click)
          (set-text! output
            (<! (jsonp (get-query)))))))

(init)
```
