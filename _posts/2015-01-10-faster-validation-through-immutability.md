---
layout: post
title: "Faster Validation Through Immutability"
description: ""
category: 
tags: []
---
{% include JB/setup %}

Continuing the line of the thought from the
[previous post](http://swannodette.github.io/2015/01/09/life-with-dynamic-typing/)
let's see how immutability can help us reduce the cost of validation
at runtime.

While `:pre` condition elision is nice we would prefer that the
runtime behavior of our program during development not be so divergent
from our production builds.

Immutable data coupled with innocuous mutation can give us what we
want. All Clojure and ClojureScript data structures already adopt
innocuous mutation in the form of hash code caching. By using the
same idea we can achieve faster validation.

First let us imagine a function which takes two immutable maps that
represent points and computes the distance:

```clj
(defn dist [p0 p1]
  (js/Math.sqrt
    (+ (square (- (:x p0) (:x p1)))
       (square (- (:y p0) (:y p1))))))
```

This looks good except of course if you pass the wrong type of
value in.

So lets write a validating version. First we need to write the
validator. We can do this trivially with
[core.match](https://github.com/clojure/core.match) which
simplifies writing fast validations through function application
support.

```clj
(defn point? [p]
  (match [p]
    [{:x (true :<< number?) :y (true :<< number?)}] true
    :else false))
```

Now we can write the validating version of `dist`:

```clj
(defn dist [p0 p1]
  {:pre [(point? p0) (point? p1)]}
  (js/Math.sqrt
    (+ (square (- (:x p0) (:x p1)))
       (square (- (:y p0) (:y p1))))))
```

Excellent! The only problem is that this version is 2-3X slower
than our previous version in many browsers.

The problem is actually quite deeper than a single function. We often
structure our programs around data and many functions will likely
take the exact same kind of data. In many functional programs
perfectly valid data will likely flow through unchanged yet be
subjected to needless checking at each step.

We can do better, read the following enhanced point validation
implementation closely:

```clj
(defn point? [p]
  (if (and (not (nil? p))
           (keyword-identical? (.-validated_ p) ::point))
    true
    (match [p]
      [{:x (true :<< number?) :y (true :<< number?)}]
      (do (set! (.-validated_ p) ::point) true)
      :else false)))
```

We first check if the data structure has *already* been validated.
Previously validated data structures now have a fast path.

If we haven't validated the data structure before then we pattern
match to check. In the successful case we tag the data structure
with a namespaced keyword to avoid future validations.

What difference does this make? Click the **Run Benchmark** button
below:

<pre id="benchmarks"></pre>
<button id="run" style="padding: 4px 10px; border: 1px solid black;
background-color: white; border-radius: 4px;">Run Benchmark</button>

<script src="/assets/js/faster/main.js"
type="text/javascript"></script>

## Eliminating Boilerplate

All the code above for the validator is pure boilerplate.

One of the most powerful aspects of Lisp is that we can use data
to generate code. [herbert](https://github.com/miner/herbert) is a
beautiful succinct way to describe data structures.

We can easily write a macro `validator` that looks like the
following that automatically generates the above validation
that we wrote by hand with all of the discussed optimizations directly
through a herbert data description.

```clj
(def point? (validator '{:x int :y int}))
```

Note that none of the above would work with mutable data
structures. If a mutation occurred the validation tagging would become
invalid.

And so we witness the beautiful intersection of Lisp and immutable data.
