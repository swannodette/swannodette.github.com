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

I added the following 13 lines of code:

```
(def app-history (atom [@app-state]))

(add-watch app-state :history
  (fn [_ _ _ n]
    (when-not (= (last @app-history) n)
      (swap! app-history conj n))
    (set! (.-innerHTML (.getElementById js/document "message"))
      (let [c (count @app-history)]
        (str c " Saved " (pluralize c "State"))))))

(aset js/window "undo"
  (fn [e]
    (when (> (count @app-history) 1)
      (swap! app-history pop)
      (reset! app-state (last @app-history)))))
```

Again in Om we always have access to the entire app state so we just
need to save it on every serious change in app state. Then undo is
simply loading a previous snapshot. Because of immutable data
structures [React](http://facebook.github.io/react/) can re-render
just as quickly going back in time as it does going forward in
time. While it may appear that storing the app state like this would
consume a lot of memory, it doesn't because ClojureScript data
structures work via structural sharing.

Much more powerful undo/redo capability can be easily added with a
little more effort. It's worth considering
[how much work it](http://discuss.emberjs.com/t/undo-manager-implementation/1603)
would take to accomplish the same thing in
[a traditional JavaScript MVC]().

Full source
[here](http://github.com/swannodette/todomvc/blob/gh-pages/labs/architecture-examples/om-undo/src/todomvc/app.cljs).

Happy New Years!
