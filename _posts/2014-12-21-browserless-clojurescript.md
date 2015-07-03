---
layout: post
title: "Browserless ClojureScript"
description: ""
category: 
tags: []
---
{% include JB/setup %}

*UPDATE: This post now contains obsolete information. Please
read the new
[ClojureScript Quick Start](https://github.com/clojure/clojurescript/wiki/Quick-Start)
instead*

As of ClojureScript 0.0-2505 support for Node.js has improved to the
point where a browserless workflow is now quite productive. I now
prefer this approach when developing libraries where dealing with the
browser is a distraction. 

To show how fun and easy it is I've updated my
[mies-node](https://github.com/swannodette/mies-node-template)
Leiningen template. This template provides all the Node.js related
boilerplate and includes source mapping support out of the box.

You can try it out with the following commands:

```
lein new mies-node hello-world
cd hello-world
lein npm install
lein cljsbuild auto
```

This will start an incremental build process. You can run your
script with:

```
node run.js
```

If you would like to run your script on every change just edit your
project.clj `:cljsbuild` `hello-world` entry to look like the
following:

```clojure
{:id "hello-world"
 :source-paths ["src"]
 :notify-command ["node" "run.js"] ;; << ADD THIS
 :compiler {
   :output-to "out/hello_world.js"
   :output-dir "out"
   :target :nodejs
   :optimizations :none
   :source-map true}}
```

Have fun!
