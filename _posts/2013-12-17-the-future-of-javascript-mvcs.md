---
layout: post
title: "The Future of JavaScript MVC Frameworks"
description: ""
category: 
tags: []
---
{% include JB/setup %}

## Introducing Om

<div style="padding: 10px 0px 10px 45px; border-bottom: 1px solid
#ccc;">
<blockquote class="twitter-tweet" lang="en"><p>often devs still approach performance of JS code as if they are riding a horse cart but the horse had long been replaced with fusion reactor</p>&mdash; Vyacheslav Egorov (@mraleph) <a href="https://twitter.com/mraleph/statuses/411549064787152896">December 13, 2013</a></blockquote>
<script async src="//platform.twitter.com/widgets.js"
charset="utf-8"></script>
</div>

We've known this for some time over here in the
[ClojureScript](http://github.com/clojure/clojurescript) corner of the
world - all of our collections are immutable and modeled directly on
the original Clojure versions written in Java and modern JavaScript
engines have now been tuned to the point that it's no longer uncommon
to see collection performance within 2.5X of the Java Virtual Machine.

Wait, wait, wait. What does the performance of persistent data structures have
to do with future of JavaScript MVCs?

A whole lot.

We'll see how (unintuitively) immutable data allows a new library,
[Om](http://github.com/swannodette/om), to outperform nearly every
existing JavaScript MVC. Om itself is built upon the absolutely
wonderful [React](http://facebook.github.io/react/) library from
Facebook, however our approach allows Om to deliver even better
results than using React out of the box.

Before we proceed it's important to understand that the following
benchmarks are not the silly uninformed things you find on
[jsperf.com](http://jsperf.com). These benchmarks are designed
demonstrate *fundamentally flawed design decisions in JavaScript MVCs
that defy global optimization*. As far as using
[TodoMVC](http://todomvc.com), it's only because it suitably
demonstrates anti-patterns that will exist in any typical JavaScript
MVC application. But it's also quite familiar to many JavaScript
developers such that I can easily point out bad ideas that you're
bound to recognize in your own code base if you leverage an MVC
framework.

Of course you can correct these issues on a tedious case by case
basis, but the whole point of Om is make an entire class of hand
optimizations techniques *obsolete*. That's the power of starting with
the right design to begin with.

"Worse is better" my ass.

## Game of Benchmarks

<div style="padding: 10px 0px 10px 45px; border-bottom: 1px solid
#ccc;">
<blockquote class="twitter-tweet" lang="en"><p>ClojureScript om based TodoMVC looks 30-40X faster than Backbone.js TodoMVC, which means other JS frameworks left completely in the dust</p>&mdash; David Nolen (@swannodette) <a href="https://twitter.com/swannodette/statuses/412033352699744256">December 15, 2013</a></blockquote>
<script async src="//platform.twitter.com/widgets.js"
charset="utf-8"></script>
</div>

Open the [Om TodoMVC in a tab]() and run the first benchmark - it creates
200 todos. On my 11 inch Macbook it takes Safari 7 around 100ms to render.

Open up the [Backbone.js TodoMVC in a tab]() and run the same
 benchmark.  On my machine this takes around 700ms to render.

Under Chrome and Firefox, Om on my machine is consistently 2-3X
faster. 2-7X faster across 3 major browser should be enough to get
anyone interested. If you try toggling all of the todos you'll notice
Om feels natural, while Backbone.js will feel a bit janky. This is
probably because Om always re-renders on
[requestAnimationFrame](http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/).

Ok, excellent work! But, uh, that's nowhere near the 30X-40X claim!

Try the following.

Open the [Om TodoMVC in a tab]() and run the first benchmark - it creates
200 todos, toggles them all 5 times, and then deletes them. On my 11
inch Macbook it takes around 50ms to render.

Open up the [Backbone.js TodoMVC in a tab]() and run the second benchmark
which does the exact same series of operations. On my machine this
takes around 2500ms seconds to render.

*How is this possible?*

Simple.

The first one doesn't do any work that it doesn't have! The model
changes come so fast there's absolute no reason to do any work. This
works because Om is thoroughly decoupled design, data, views and
control logic are no linked together. This counter to MVC approaches
to link together changes in the model, to the view, and to completely
unrelated side concerns like serializing app state into
localStorage. This is what the Backbone.js version does and if you're
a fan of JS MVCs I'm sure you've done this in your own applications.

You could argue that you could do this with Backbone.js. You could,
but what would be the point, you would decouple your models, views,
and controllers to the point where most of the APIs becomes
effectively useless.

This is exactly true for Om. We have a whopping 6 functions in our
public api.

## How it works

My friend Brandom Bloom has been bugging me for ages to give React a
try, however I was turned off by the documentation. I didn't give it a
chance until I saw the
[JSConf EU 2013 presentation by Peter Hunt](http://2013.jsconf.eu/speakers/pete-hunt-react-rethinking-best-practices.html)
that explained the architecture. At that point I started jumping up
and down.
