---
layout: post
title: "The Future of JavaScript MVCs"
description: ""
category: 
tags: []
---
{% include JB/setup %}

<div style="padding: 10px 0px 10px 45px; border-bottom: 1px solid
#ccc;">
<blockquote class="twitter-tweet" lang="en"><p>often devs still approach performance of JS code as if they are riding a horse cart but the horse had long been replaced with fusion reactor</p>&mdash; Vyacheslav Egorov (@mraleph) <a href="https://twitter.com/mraleph/statuses/411549064787152896">December 13, 2013</a></blockquote>
<script async src="//platform.twitter.com/widgets.js"
charset="utf-8"></script>
</div>

We've known this for quite some time over here in the ClojureScript
corner of the world - all of our collections are immutable and modeled
directly on the original Clojure versions written in Java and modern
JavaScript engines have now been tuned to the point that it's no longer
uncommon to see collection performance within 2.5X of the Java Virtual
Machine.

But what in the world does that have to do with JavaScript MVCs?

In this post we'll see how (unintuitively) immutable data allows us to
outperform JavaScript MVC libraries. This is not about
microbenchmarks, it's about *fundamentally flawed design decisions in
JavaScript MVCs that defy global optimization*. We'll start with
gratuitous benchmarks that you can run on your own machine to verify
my claims followed by a technical description how an new experimental
library called [Om](http://github.com/swannodette/om) integrates with
[Facebook's React](http://facebook.github.io/react/) to achieve this
level of performance.

## Benchmarks

I made a humorous claim recently on Twitter:

<div style="padding: 10px 0px 10px 45px; border-bottom: 1px solid
#ccc; border-top: 1px solid #ccc;">
<blockquote class="twitter-tweet" lang="en"><p>ClojureScript om based TodoMVC looks 30-40X faster than Backbone.js TodoMVC, which means other JS frameworks left completely in the dust</p>&mdash; David Nolen (@swannodette) <a href="https://twitter.com/swannodette/statuses/412033352699744256">December 15, 2013</a></blockquote>
<script async src="//platform.twitter.com/widgets.js"
charset="utf-8"></script>
</div>

Open the [Om TodoMVC in a tab]() and run the first benchmark - it creates
200 todos, toggles them all 5 times, and then deletes them. On my 11
inch Macbook it takes about 47ms to render.

Open up the [Backbone.js TodoMVC in a tab]() and run the second benchmark
which does the exact same series of operations. On my machine 

How is this possible? Simple.

The first one doesn't do any work that it doesn't have! Om has
a decoupled design, where Backbone.js encourages via the MVC model to
link together changes in the model, to the view, and to completely
unrelated side concerns like serializing app state into localStorage.

You could argue that you could do this with Backbone.js. You could,
but what would be the point, you would decouple your models, views,
and controllers to the point where most of the APIs becomes
effectively useless.

This is exactly true for Om. We have a whopping 6 functions in our
public api.

## How it works
