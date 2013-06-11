---
layout: post
title: "Functional Programming is a Scam!"
description: ""
category: 
tags: ["ClojureScript", "performance", "games"]
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
elimination is really that good. I've only employed the ClojureScript
operations that map directly to fast JavaScript constructs, no
persistent data structures or cool seq operations in sight and the
advanced compiled source reflects that.

# Local mutation

So then where and how does this version really diverge from the original?
Are we just back to writing yucky mutable JavaScript with crazy
syntax? Is functional programming in the end unsuitable for demanding
interactive applications?
Some time ago [this blog post](http://prog21.dadgum.com/37.html) made me wonder.

First off, Notch's original source, like many typical JavaScript
applications, unnecessarily wields global mutation - the procedural
texture and block generation both operate on global mutable arrays. In
the ClojureScript port we instead have functions that return the
populated arrays. this is the value oriented approach -
`set!` is pure code smell for a Clojure programmer.

For example here is the block generation code:

<script src="https://gist.github.com/swannodette/5756831.js"> </script>

Ok, but still isn't it cheating to be bashing on mutable arrays inside of
functions?

To a functional purist maybe, but then they're probably OK
with abysmal frame rates and inferior interactive experiences. I am
not. *Local mutation is absolutely ok*. Clojure has long supported
this insanely great idea in the notion of [transients](http://clojure.org/transients).

But what about `render-minecraft!`? In the original Notch allocated
an `ImageData` instance *once* and he would bash on this at each turn
of the loop.

Surprisingly this bit of optimization is entirely unnecessary. We can
allocate this internally every single time `render-minecraft!` is
called - the cost of allocating a 424 by 240 `ImageData` object is
completely dwarfed by the real work done in `render-minecraft!`.

# Challenges

I admit one tricky bit that required experimentation is that Clojure's
semantics don't admit mutable locals - something that Notch's code
uses freely. This required a little bit of experimenting, I tried
using a `Box` type with one mutable field, I tried putting the entire
render step into a `deftype` with mutable fields. In the end I settled
on representing mutable locals as arrays of one elements. The
performance of this representation is stunningly good on Chrome and
pretty good in Firefox as well. Surprisingly Safari performs the least
well on this bit of code and I haven't had time to dig into why.

I honestly spent most of the development
time just trying to understand what the original code did. I did find
the ClojureScript development cycle relatively pleasant due to
[lein-cljsbuild]()'s `auto` feature. I wish we had CoffeeScript's
lightning fast build times, but once the JVM is warm, the turn around
is not large enough to matter.

One thing that I absolutely loved about ClojureScript is how many
warings you get from the compiler - getting file and line information
for typos and bad arities for functions calls save a lot of time I
often lose when doing JavaScript.

The one real scratch your head issue I ran into while developing this
was a Google Closure mishandling of the modulo operator. Closure will
incorrectly remove parentheses, this is easily worked around by putting
the result of the modulus operation in an intermediate variable but I
lost more time on this subtle issue than I care to recall.

While this exercise might seem only like a bit of fun, it really
isn't. If ClojureScript could not guarantee this kind of performance
we would have written those fancy persistent data structures in
JavaScript the same way Clojure on the JVM implements them in Java.

I think the intersection of computationally intensive games and
functional programming is a rich area to innovate and ClojureScript
provides the tools needed to forge new ground.

{% include chambered/bottom %}

