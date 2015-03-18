---
layout: post
title: "Lessons in the Fundamentals"
description: ""
category: 
tags: []
---
{% include JB/setup %}

<img width="300" style="margin-left: 143px; width: 300px; border: 1px solid #ccc" src="/assets/images/fundamentals.jpg" />

[ClojureScript 0.0-3058](https://github.com/clojure/clojurescript) is
a series of lessons in the fundamentals.

## Read-Eval-Print-Loop

For the very first time ClojureScript ships with REPLs
that deliver the functionality people have long ago come to expect
from Clojure: `:reload`, `:reload-all`, `doc`, `source`, `find-doc`,
`apropos`, `dir`, and `pst` are all there.

All REPLs ship with source mapping support enabled. Whether you're in a
REPL hooked up to Firefox, Safari, Chrome, Node.js, Rhino, or Nashorn
you will always get a *ClojureScript* stacktrace.

## Compile Times

While slow compile times are acceptable for production builds,
significantly slowing down the precious interactive programming
feedback loop McCarthy gave us during development is simply
unacceptable. ClojureScript now ships with aggressive caching features
enabled including a pre-compiled standard library, pre-calculated
analysis information, and pre-generated source map.

On my work machine I can now compile a trivial `"Hello world!"` from
cold JVM boot in around 1.7 seconds.

## Utility Without Dependencies

My various "mies" Leiningen templates were patching over the fact that
it was pretty much impossible to try ClojureScript without Leiningen
or Maven to manage dependencies.

No more.

ClojureScript now provides a
[standalone JAR](https://github.com/clojure/clojurescript/releases/tag/r3058),
the only thing you need to bring is an installation of Java 8.

## The Fundamentals

Even if you are an experienced ClojureScript developer it's time to
revisit the
[fundamentals](https://github.com/clojure/clojurescript/wiki/Quick-Start).

I hope that through a shared understanding of the fundamentals we can
collectively push the broader ClojureScript ecosystem of libraries and
tooling to even greater heights.

Happy hacking!
