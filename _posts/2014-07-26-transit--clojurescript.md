---
layout: post
title: "Transit, JSON & ClojureScript"
description: ""
category: 
tags: []
---
{% include JB/setup %}

If you're a ClojureScript user
[transit-cljs](http://github.com/cognitect/transit-cljs) offers nearly all the
benefits of [EDN]() while delivering performance comparable to native
[JSON](http://json.org). And since the Transit JSON encoding is truly just JSON,
transit-cljs also provides a better story when communicating with existing JSON
services.

## The Problem

ClojureScript launched more than 3 years ago with
[`cljs.reader/read-string`](https://github.com/clojure/clojurescript/blob/master/src/cljs/cljs/reader.cljs#L291)
. This allowed Clojure and ClojureScript programs to comfortably communicate
with each other. However, even after seeing several rounds of optimizations
`cljs.reader/read-string` still delivers poor performance compared to
`JSON.parse`.

Worse, most services speak JSON not EDN. You can `JSON.parse` and convert to
ClojureScript data structures via
[`cljs.core/js->clj`](https://github.com/clojure/clojurescript/blob/master/src/cljs/cljs/core.cljs#L7729)
but performance is even worse than `cljs.reader/read-string`.

transit-cljs addresses all of these issues at once.

## JSON Reading

You can consume any existing JSON service in ClojureScript with transit-cljs and
you will get ClojureScript data structures. The performance is 20-30X faster
than combining `JSON.parse` with `cljs.core/js->clj`.

```clj
(def r (transit/reader :json))
(println (transit/read r "{\"foo\":\"bar\"}"))
```

The only caveat is that map keys will be strings - a small price to
pay for the performance gain.

## JSON Writing

You can send JSON to any service simply by using a verbose writer:

```clj
(def w (transit/writer :json-verbose))
(println (transit/write w {"foo" "bar"}))
```

Again your map keys must be strings but encoding is often more than a magnitude
faster than `pr-str`.

## Advantages over transit-js

transit-cljs offers benefits above and beyond those provided by
transit-js. transit-js is consumed by JavaScript applications developers as a
Google Closure Compiler advance compiled artifact. But because Google Closure
Compiler is already a part of the ClojureScript compilation pipeline,
transit-cljs depends directly on the original unoptimized and unminified
transit-js source code. This means far more of the transit-js implementation
can be leveraged - for example transit-js 64 bit
integers are `goog.math.Long` instances and you can treat them as such with
no issues:

```clj
(ns transit-fun.core
  (:require [cognitect.transit :as t])
  (:import [goog.math Long]))

(def r (t/reader :json))
(.add (t/read r "{\"~#':\":\"~i9007199254740993\"\"}") (Long.fromInt 1))
```

If you are ClojureScript user building an application that currently accepts or
marshals either EDN or JSON I strongly recommend switching to transit-cljs for
both tasks.
