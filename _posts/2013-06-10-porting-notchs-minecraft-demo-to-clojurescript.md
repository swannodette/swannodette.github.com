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
conceptual change to Notch's code - emphasize *local mutation*. I'll
elaborate on this in a moment.

Without further ado here it is:

<!-- <div style="text-align: center"> -->
<!--     <canvas id="game" width="424" height="240"></canvas> -->
<!-- </div> -->

Pretty neat huh? If you're familiar with how much JavaScript the
ClojureScript compiler generates without the help of Google Cloure you
should find the advanced compiled code
[shocking small](/assets/js/chambered.js). That's right, *400* lines
of generated code (200 of those are unnecessary and will disappear
when ClojureScript gets real keywords instead of piggy-backing on
JavaScript strings).

This seems like powerful voodoo! It really isn't, Google Closure dead
code elimination is just really, really good and I've only employed the
ClojureScript operations that map directly to fast JavaScript
constructs. There's no persistent data structure or seq operation in
sight and the advanced compiled source reflects that.

So how I am able to achieve this kind of performance from a language
that is so much higher level than JavaScript? 

So isn't this cheating? To a functional purist maybe, but then they're
probably OK with abysmal framerates. The big takeaway here is that
*local mutation is ok*. Clojure supports this whopping great idea in
the notion of transients. We often want to construct some value as
quickly as possible - if it doesn't escape does it matter? *No*.

Notch's original code has quite a bit of global mutation, as it turns
out it all of it unnecessary. For example the procedural texture and
block generation both operate on a global mutable array - this is
unnecessary. Now instead we have functions that return the populated
arrays - we shifted our thinking away from bashing on arrays to
functions that might bash internally but return values intended to be
used in an immutable way.

Surprisingly even the global `pixels` object is unnecessary. We can
allocate this internally in `render-minecraft!`. The cost of
allocating a 424X240 ImageData object is completely dwarfed by the
work done in `render-minecraft!`.

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
