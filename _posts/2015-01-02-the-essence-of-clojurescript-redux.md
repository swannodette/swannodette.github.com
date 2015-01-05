---
layout: post
title: "The Essence of ClojureScript Redux"
description: ""
category: 
tags: []
---
{% include JB/setup %}

My
[previous post](http://swannodette.github.io/2014/12/31/the-old-way-the-new-way)
demonstrated a very manual series of steps for getting a sensible
ClojureScript REPL setup going.

This post covers the *easy* way using the shiny 0.0-2665 release of
ClojureScript. The only thing you need to go through this is to have
[Node.js](http://nodejs.org/) and
[rlwrap](http://utopia.knoware.nl/~hlub/uck/rlwrap/) (under OS X
easily installed with [brew](http://brew.sh)) installed:

```
lein new mies hello-world
cd hello-world
```

We want the REPL to load as fast as possible so compile
ClojureScript once and for all:

```
./scripts/compile_cljsc
```

Before we start our REPL let's add a definition to the
`hello-world.core` namespace. Use your favorite text editor
to make it look like the following:

```clj
(ns hello-world.core)

(enable-console-print!)

;; ADD THIS
(defn foo [a b]
  (+ a b))

(println "Hello world!")
```

Now let's start a REPL:

```
./scripts/repl
```

It will take a few seconds the first time as we compile the standard
library. It should be very fast to start on subsequent runs.

Once we have a REPL up and running let's import something and try it:

```
ClojureScript:cljs.user> (require '[hello-world.core :refer [foo]])
Hello world!
ClojureScript:cljs.user> (foo 1 2)
3
```

Unlike Node.js out of the box we can import namespaces again and
ClojureScript will recompile and reload:

Edit the `hello-world.core` namespace again with your text editor:

```clj
(ns hello-world.core)

(enable-console-print!)

(defn foo [a b]
  (+ a b))

;; ADD THIS
(defn bar [a b]
  (* a b))

(println "Hello world!")
```

Just press the up arrow at the REPL to get back to the previous
require statement and edit it to include `:reload`:

```
ClojureScript:cljs.user> (require '[hello-world.core :refer [foo]] :reload)
Hello world!
ClojureScript:cljs.user> hello-world.core
#js {:foo #<function foo(a,b){
return (a + b);
}>, :bar #<function bar(a,b){
return (a + b);
}>}
```

There's our new definition as expected!

For the experienced ClojureScript developers I highly recommend poking
around at the provided scripts. As you'll see with some investigation
the Node.js REPL and the dev build use the same output directory. This
means if you already have a build you can start a REPL pretty much
instantly by setting the REPLs `:output-dir` and `:cache-analysis`
values to be the same as your build.

Happy hacking!
