---
layout: post
title: "Time Travel"
description: ""
category: 
tags: []
---
{% include JB/setup %}

In
[my previous post](http://swannodette.github.io/2013/12/17/the-future-of-javascript-mvcs/)
I claimed it was trivial to implement undo in
[Om](http://github.com/swannodette/om). You can see it in action
[here](http://swannodette.github.io/todomvc/labs/architecture-examples/om-undo/index.html).

I added the following 13 lines to add undo.

```
(def app-history (atom [@app-state]))

(add-watch app-state :history
  (fn [_ _ _ n]
    (when-not (= (last @app-history) n)
      (swap! app-history conj n))
    (set! (.-innerHTML (.getElementById js/document "message"))
      (str (count @app-history) " Saved States"))))

(aset js/window "undo"
  (fn [e]
    (when (> (count @app-history) 1)
      (swap! app-history pop)
      (reset! app-state (last @app-history)))))
```

Much more powerful undo/redo capability can be easily added with a
little more effort. It's worth considering how much work it would take
to accomplish the same thing in a traditional JavaScript MVC.
