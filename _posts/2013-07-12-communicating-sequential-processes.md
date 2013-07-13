---
layout: post
title: "Communicating Sequential Processes"
description: ""
category: 
tags: ["clojurescript", "csp"]
---
{% include JB/setup %}

<style>
  #ex1 {
    position: relative;
    margin-top: 20px;
    width: 100%;
    height: 200px;
    border: 1px solid #ccc;
    background: #efefef;
  }
  #ex1-mouse {
    position: absolute;
    top: 0px;
    bottom: 0px;
    right: 0px;
    left: 0px;
    color: #666;
    text-align: center;
    line-height: 200px;
    font-family: 'Inconsolata', sans-serif; font-size: 64px;
  }
</style>

With the arrival of
[core.async](http://github.com/clojure/core.async), ClojureScript
provides a powerful advantage over other popular compile to JavaScript
languages like CoffeeScript, Dart, and TypeScript. These languages
fail to offer any concurrency tools over the weak ones offered
by libraries or JavaScript itself - promises and generators.

JavaScript promises don't solve the inversion of control problem -
callback hell is unnested but it's still callback hell. EcmaScript 6
generators suffer in various ways from being too simplistic, you need
manage coordination by hand or provide your own scheduler. You can
combine generators with promises, but now you're managing two
abstractions instead of one.

Enough rhetroic, let's see how core.async works in practice. The
initial examples may look familiar to fans of functional reactive
programming, but we'll quickly see that core.async offer much more
expressive facilities.

The following code convert events on a DOM element into a channel:

```clojure
(defn event-chan [el type]
  (let [c (chan)]
    (.addEventListener el type #(put! c %))
    c)))
```

I've purposely kept the code as simple as possible to limit the amount
of novelty that we need to introduce. `event-chan` takes a DOM element
and an event type. The event listener puts the DOM event into the
channel.

Channels are like the channels found in Tony Hoare's Communicating
Sequential Processes. The Go community is thoroughly enjoying the
benefits of this abstraction - but of course programming languages
have had it since the 1980s and both Rob Pike (Go) and John Reppy
(Concurrent ML) have discussed their applicability for coordination of
user interfaces which are naturally concurrent.

Let's show the `event-chan` in action:

```clojure
(let [el (by-id "ex1")
      out (by-id "ex1-mouse")
       c  (event-chan el "mousemove")]
  (go
    (loop []
      (let [e (<! c)]
        (set-html out (str (.-x e) ", " (.-y e)))
        (recur))))))
```

<div id="ex1" class="example">
    <div id="ex1-mouse"></div>
</div>

<script type="text/javascript" src="/assets/js/csp.js"></script>
