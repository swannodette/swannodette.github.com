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
theoretical computer science and turn to something more "pragmatic".

In this post I want to talk about
[my port](http://github.com/swannodette/chambered) of
[Notch](http://twitter.com/notch)'s beautiful
[Minecraft JavaScript demo](http://jsfiddle.net/uzMPU/) to
ClojureScript. When I say beautiful I'm not referring to the code -
frankly it's ugly. And being a faithful port the ClojureScript version
ain't much prettier. But this post isn't about writing beautiful code,
it's about ClojureScript's suitability for computationally intensive
interactive applications. However, I did make one very important major
conceptual change to Notch's code and I'll elaborate on this later.

Without further ado here it is (it will look best in Chrome & Firefox):

<div style="text-align: center">
    <canvas id="game" width="424" height="240"></canvas>
</div>

Pretty neat huh? It's not just fast, it's quite small,
[shockingly small](/assets/js/chambered.js) given that ClojureScript
ships with a standard library nearly 7500 lines long. That's right,
*400* lines of pretty printed Closure advanced compiled code (200 of
those are unnecessary and will disappear when ClojureScript gets real
keywords instead of piggy-backing on JavaScript strings).

Voodoo?! No, [Google Closure](http://closure.org) dead code
elimination is just really good. I've only employed the ClojureScript
operations that map directly to fast JavaScript constructs, no
persistent data structures or cool seq operations in sight and the
advanced compiled source reflects that.

So where and how does this version really diverge from the original?
Are we just back to writing yucky mutable JavaScript with crazy
syntax? Is functional programming simply unsuitable for demanding
interactive applications?
[This blog post](http://prog21.dadgum.com/37.html) made me wonder.

First off, Notch's original source actually unnecessarily wielded
global mutation. For example the procedural texture and block
generation both operate on global mutable arrays. Now instead we have
functions that return the populated arrays - this is the value
oriented thinking approach - `set!` is pure code smell for a Clojure
programmer.

For example here is the block generation code:

<script src="https://gist.github.com/swannodette/5756831.js"> </script>

Ok, but still isn't it cheating to be bashing on mutable arrays inside of
functions?

To a functional purist maybe, but then they're probably OK
with abysmal frame rates and inferior interactive experiences. I am
not. *Local mutation is absolutely ok*. Clojure has long supported
this insanely great idea in the notion of transients. We often need to
construct some value as quickly as possible - if it doesn't escape
does the internal mutation?

But what about `render-minecraft!`? In the original Notch allocated
a `ImageData` instance *once* and he would bash on this at each turn
of the loop.

Surprisingly this bit of optimization is entirely unnecessary. We can
allocate this internally every single time `render-minecraft!` is
called - the cost of allocating a 424X240 ImageData object is
completely dwarfed by the real work done in `render-minecraft!`.

I admit one tricky bit that required experimentation is that Clojure's
semantics don't admit mutable locals - something that Notch's code
wields freely. This required a little bit of experimenting, I tried
using a `Box` type with one mutable field, I tried putting the entire
render step into a `deftype` with mutable fields. In the end I settled
on representing mutable locals as arrays of one elements. The
performance of this representation is stunningly good on Chrome and
pretty good in Firefox as well. Surprisingly Safari performs the least
well on this bit of code and I haven't had time to dig into why.

So what were the remaining challenges? I honestly spent most of the
time just trying to understand what the original code did. I did find
the ClojureScript development cycle relatively pleasant due to
[lein-cljsbuild]()'s `auto` feature. I wish we had CoffeeScript's
lightning fast build times, but once the JVM is warm, the turn around
is not large enough to matter.

One thing that I absolutely love about ClojureScript and working on
this port really drove it home is how many errors you get from the
compiler - getting file and line information on and typos and
incorrect arities to functions and macros save a lot of time I often
lose when doing JavaScript.

The one real scratch your head issue I ran into while developing this
was a Google Closure mishandling of parenthesized modulus
operations. Closure will incorrectly remove parentheses, this is
easily worked around by put the result of the modulus operation in an
intermediate variable but I lost more time on this subtle issue than I
care to recall.

While this exercise might seem only like a bit of fun, it really
isn't. If ClojureScript could not guarantee this kind of performance
we would have written those fancy persistent data structures in
JavaScript the same way Clojure on the JVM implements them in Java.

Of the languages that compile to JavaScript [Dart](http:/dartlang.org)
and [TypeScript](http://typescript.org) seem to take the performance
of their generated JavaScript extremely seriously but they do so at
the cost of fairly snoozy language semantics. ClojureScript tries to
deliver a great functional programming experience but it does not back
away from providing the tools you need for a critical inner loop. If
your compile to JavaScript language doesn't take performance
seriously.

{% include chambered/bottom %}

