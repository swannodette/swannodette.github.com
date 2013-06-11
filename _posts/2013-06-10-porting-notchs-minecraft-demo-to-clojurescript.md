---
layout: post
title: "Porting Notch's Minecraft Demo to ClojureScript"
description: ""
category: 
tags: []
---
{% include JB/setup %}
{% include chambered/top %}

I apologize for not wrapping up my series of posts on
[nominal logic programming](http://arxiv.org/abs/cs/0609062), I'll
return to that bit of fun soon enough. But lets take leave of
theoretical computer science and turn to a more "pragmatic" bit of
fun.

In this post I want to talk about my port of Notch's beautiful
JavaScript demo to ClojureScript. When I say beautiful I'm not
referring to the code - it's pretty ugly. And being a faithful port
the ClojureScript version is hardly any better. But this post is not
about writing beautiful code, it's about demonstrating that
ClojureScript is suitable for writing computationally intensive
interactive applications in the web browser. I did make one major
conceptual change to Notch's code - emphasize *local mutation*.

Without further ado here it is:

<!-- <div style="text-align: center"> -->
<!--     <canvas id="game" width="424" height="240"></canvas> -->
<!-- </div> -->

Pretty neat huh? If you're familiar with how much JavaScript the
ClojureScript compiler generates without the help of Google Cloure you
should find the advanced compiled code
[shocking small](/assets/js/chambered.js). That's right, *400* lines
of generated code. 200 of those are unnecessary and will disappear
when ClojureScript gets real keywords instead of piggy-backing on
JavaScript strings.

This seems like powerful voodoo! But it really isn't, Google Closure
is just really, really good. I've only employed the ClojureScript
operations that map directly to fast JavaScript constructs.

Without a doubt, I am a firm advocate of functional programming, but
unlike the various puritans you might encounter in the wild, I don't
find that is the right tool for all problems especially when
performance is absolutely critical.

The sleight of hand that Clojure has pulled is to make functional
programming so fun and attractive that it's unusual to see Clojure
code that isn't largely functional.

But there are of many kinds of interactive applications one might
right for which functional technique may simply not provide the best
tool.

Clojure fortunately doesn't close all the pathway to performance, like
Standard ML before it, Clojure provides.

Again we could have gotten more ambition. One think I would love to
see is a Nile-like graphic DSL for Clojure.

While this exercise might seem only like a bit of fun, it isn't. If
ClojureScript could not guarantee this kind of performance we would
have written those fancy persistent data structures in JavaScript the
same way Clojure on the JVM implements them in Java.

[Dart](http:/dartlang.org) and [TypeScript](http://typescript.org)
seem to take the performance of their generated JavaScript pretty
seriously. We certainly do. If your compile to JavaScript language doesn't
take performance seriously, I believe it highly unlikely to
succeed. The web is interactive and developers are constantly trying
to push it limits.

{% include chambered/bottom %}
