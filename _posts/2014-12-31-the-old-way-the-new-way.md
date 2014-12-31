---
layout: post
title: "The Old Way, The New Way"
description: ""
category: 
tags: []
---
{% include JB/setup %}

This post will walk you through using ClojureScript from master, using
a contrib SNAPSHOT release, and getting a productive fast REPL setup
using the new Node.js REPL support.

Imagine that you want to try out the new ClojureScript support in
test.check `0.6.3-SNAPSHOT`. You would really like to play around with
the API at the REPL.

For kicks let's use ClojureScript master:

```
git clone https://github.com/clojure/clojurescript
cd clojurescript
```

We're going to build ClojureScript from source and install into our
local Maven cache:

```
./script/build
```

You'll see a bunch of stuff scroll by, the most important is this:

```
[INFO] ------------------------------------------------------------------------
[INFO] Building ClojureScript 0.0-2606
[INFO] ------------------------------------------------------------------------
```

This tells us the version number we'll need to use in our
project.clj. It will probably NOT be `0.0-2606` for you.

Let switch to the directory where our project will live and create it:

```
lein mies new test-fun
cd test-fun
```

We need to make several modifications to our project.clj file.
It should look like this:

```clj
(defproject test-fun "0.1.0-SNAPSHOT"
  ;; so we can get SNAPSHOT releases
  :repositories 
  {"sonatype-oss-public" "https://oss.sonatype.org/content/groups/public/"}

  ;; replace NNNN with whatever you saw above
  :dependencies [[org.clojure/clojure "1.6.0"]
                 [org.clojure/clojurescript "0.0-NNNN"]
                 [org.clojure/test.check "0.6.3-SNAPSHOT"]]

  :plugins [[lein-cljsbuild "1.0.4"]]

  :source-paths ["src" "target/classes"]

  :clean-targets ["out/test_fun" "test_fun.js" "test_fun.min.js"]

  :cljsbuild {
    :builds [{:id "dev"
              :source-paths ["src"]
              :compiler {
                :output-to "test_fun.js"
                :output-dir "out"
                :optimizations :none
                :cache-analysis true                
                :source-map true}}]})
```

Let's set things up so our ClojureScript experience is a bit
snappier. It's assumed that you've already got `LEIN_FAST_TRAMPOLINE`
[configured](http://swannodette.github.io/2014/12/22/waitin/).

Let's compile the ClojureScript bits we're going to need once
and for all:

```
lein trampoline run -m clojure.main
user=> (compile 'cljs.repl.rhino)
cljs.repl.rhino
user=> (compile 'cljs.repl.node)
cljs.repl.node
user=> (compile 'cljs.core)
cljs.core
```

Quit the REPL with CTRL-D.

Now we're ready to start a REPL. This will demonstrate how bad
the REPL experience was prior to enhancements to ClojureScript
REPL support.

```
lein trampoline cljsbuild repl-rhino
```

On my 2010 Macbook Pro this takes *20 to 30 seconds* to start even for
subsequent runs.

This would be enough for me to walk away from my computer in utter
disgust, all enthusiasm lost for exploring test.check.

This is because prior to the last ClojureScript changes REPLs did
not cache compilation and analysis to disk. Every REPL invocation
recompiles everything in memory again and streams it to the JS
process.

Now lets try the new Node.js REPL. Let make a file `node_repl.clj`
its contents should like the following:

```clj
(require '[cljs.repl :as repl] 
         '[cljs.repl.node :as node]) 

(repl/repl* (node/repl-env) 
  {:output-dir ".cljs_node_repl" 
   :cache-analysis true 
   :source-map true})"
```

Now try the following:

```
lein trampoline run -m clojure.main node_repl.clj
```

The first time will be slow as we cache everything. Quit the
REPL and try this again.

The REPL should launch in a couple of seconds.

Now let's give test.check a try, let's require the generators namespace:

```clj
To quit, type: :cljs/quit
ClojureScript Node.js REPL server listening on 5001
ClojureScript:cljs.user> (require '[cljs.test.check.generators :as gen])
```

Now lets generate some data!

```clj
ClojureScript:cljs.user> (gen/sample (gen/vector gen/int))
([] [] [] [] [4 0 -4] [3 -4 3] [-4 -5 -3 -5 6 5] [-1 4] ...)
```

Let's check out some docstrings:

```clj
ClojureScript:cljs.user> (doc gen/sample)
-------------------------
cljs.test.check.generators/sample
([generator] [generator num-samples])
  Return a sequence of `num-samples` (default 10)
  realized values from `generator`.
nil
```

The old REPL model simply provides a inferior development
experience. By embracing the same caching infrastructure as provided
to CloureScript builds we can deliver a REPL experience far
more in the line with one enjoyed in Clojure today.
