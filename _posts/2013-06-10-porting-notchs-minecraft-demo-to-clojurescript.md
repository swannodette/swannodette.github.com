---
layout: post
title: "Functional Programming is a Scam!"
description: ""
category: 
tags: []
---
{% include JB/setup %}
{% include chambered/top %}

I apologize for not wrapping up my series of posts on
[nominal logic programming](http://arxiv.org/abs/cs/0609062), I'll
return to that bit of fun soon enough. But lets take leave of
theoretical computer science turn to something more "pragmatic".

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
ClojureScript compiler generates without the help of Google Closure you
should find the advanced compiled code
[shocking small](/assets/js/chambered.js). That's right, *400* lines
of generated code (200 of those are unnecessary and will disappear
when ClojureScript gets real keywords instead of piggy-backing on
JavaScript strings).

This seems like powerful voodoo! It really isn't, Google Closure dead
code elimination is just really, really good and I've only employed the
ClojureScript operations that map directly to fast JavaScript
constructs. No persistent data structure or cool seq operation in
sight and the advanced compiled source reflects that.

Notch's original code has quite a bit of global mutation, as it turns
out it all of it unnecessary. For example the procedural texture and
block generation both operate on a global mutable array - this is
unnecessary. Now instead we have functions that return the populated
arrays - we shifted our thinking away from bashing on arrays to
functions that might bash internally but return values intended to be
used in an immutable way.

So isn't this cheating? To a functional purist maybe, but then they're
probably OK with abysmal frame rates and inferior interactive
experiences. I am not. *Local mutation is absolutely ok*. Clojure has
long supported this whopping great idea in the notion of
transients. We often want to construct some value as quickly as
possible - if it doesn't escape does it matter? *No*.

Surprisingly even the global `pixels` object is unnecessary. We can
allocate this internally in `render-minecraft!`. The cost of
allocating a 424X240 ImageData object is completely dwarfed by the
work done in `render-minecraft!`.

One tricky bit that required experimentation is that Clojure's
semantics don't admit mutable locals - something that Notch's code
wields freely. This required a little bit of experimenting, I tried
using a `Box` type with one mutable field, I tried putting the entire
render step into a `deftype` with mutable fields. In the end I settled
on representing mutable locals as arrays of one elements. The
performance of this representation is stunningly good on Chrome and
pretty good in Firefox as well. Surprisingly Safari performs the least
well on this bit of code. 

So what were the remaining challenges? I honestly spent most of the time just
trying to understand what the original code did. I find the
development cycle relatively pleasant due to [lein-cljsbuild]()'s
`auto` feature. I wish we had CoffeeScript's lightning fast build
times, but once the JVM is warm, the turn around is not large enough
to be a problem especially since ClojureScript supports incremental
compilation.

One thing that I absolutely love about ClojureScript is how many
errors you get from the compiler - getting file and line information
on and typos and incorrect arities to functions and macros save a lot
of time I often lose when doing JavaScript.

The one real scratch your head issue I ran into while developing this
was a Google Closure mishandling of parenthesized modulus
operations. Closure will incorrectly remove parentheses, this is
easily worked around by put the result of the modulus operation in an
intermediate variable but I lost more time on this subtle issue than I
care to recall.

So if you need to write extremely fast code, `loop/recur`, primitives
arrays, and arithmetic. In all these cases we generate 

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
