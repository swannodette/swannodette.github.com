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
compile the standard library. Don't worry, if you edit your source
file subsequent compiles will be sub second.

Open the provided `index.html` (at the root of the project directory)
in Google Chrome. Enable source maps by clicking on the **View** menu and
selecting **Developer > Developer Tools**. In the bottom right corner of
the **Developer Tools** pane you should see a gear icon. If you click this
you will get a pane of settings, one of which is **Enable JS source
maps**. Enable it.

Refresh the browser, select **View > Developer Tools > JavaScript
Console**. You should see that the `console.log` references
a line in ClojureScript. If you click the line number displayed to
the right of the log message you will be taken to that line in the
original ClojureScript source.

Now try editing `src/hello_world/core.cljs`. For example make your file
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
