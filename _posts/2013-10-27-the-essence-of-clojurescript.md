---
layout: post
title: "The Essence of ClojureScript"
description: ""
category: 
tags: []
---
{% include JB/setup %}

Recently a couple of people have communicated that getting up and
running with ClojureScript is challenging. While there's a
[book](http://shop.oreilly.com/product/0636920025139.do) and a
[number of excellent tutorials](http://github.com/magomimmo/modern-cljs),
none emphasize what I consider an absolutely minimal setup with a tight
feedback loop and a good debugging experience.

This short post will get you from zero to developing source mapped
ClojureScript with instant recompiles on file save.

Install [Leiningen](http://leiningen.org).

Once installed edit `~/.lein/profile.clj` so that it includes
`lein-newnew`:

```
{:user {:plugins [[lein-newnew "0.3.4"]]}}
```

Goto a directory where you want your project to live and run the
following on the command line:

```
lein new mies hello-world
```

Switch into the newly created ClojureScript project and run the
following:

```
lein cljsbuild auto hello-world
```

It'll take a little while for the first build - a second for JVM start
up time, a few seconds to compile ClojureScript, and a few seconds to
compile the standard library. If you edit your source file, subsequent
compiles will be sub second.

Open provided `index.html` at the root of the project directory in
Google Chrome. If you've enabled source maps you should see a
`console.log` that references a line in ClojureScript. You can enable
source maps by right clicking in the window and selecting `Inspect
Element`, in the right corner you should see a gear icon. If you click
this you see a bunch of options, one of which is `Enable JS source
maps`.

Try editing `src/hello_world/core.cljs`, for example make your file
look like this:

```
(ns hello-world.core)

(defn foo [a b]
  (+ a b))

(. js/console (log "Hello world!" (foo 1 2)))
```

Save the file. You should see that the file recompiled in under a
second. Refresh your browser and you should see your modifications
logged.

Happy hacking!
