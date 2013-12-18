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
the original Clojure versions written in Java. Modern JavaScript
engines have now been tuned to the point that it's no longer uncommon
to see collection performance within 2.5X of the Java Virtual Machine.

Wait, wait, wait. What does the performance of persistent data structures have
to do with future of JavaScript MVCs?

A whole lot.

We'll see how, perhaps unintuitively, immutable data allows a new
library, [Om](http://github.com/swannodette/om), to outperform a
reasonably performant JavaScript
[MVC](http://en.wikipedia.org/wiki/Model-view-controller) like
[Backbone.js](http://backbonejs.org) without hand optimization from
the user. Om itself is built upon the absolutely wonderful
[React](http://facebook.github.io/react/) library from Facebook,
however our approach allows Om to deliver even better results than
using React out of the box.

These benchmarks are not designed to prove that Om is the fastest
possible UI component system in the world. These benchmarks are
designed to demonstrate that many MVCs make implementation decisions
that defy global optimization or leave so little guidance that users
will inevitably make these same problematic design decisions
themselves.

Of course you can correct these issues in your client side application
on a tedious case by case basis, but the whole point of Om is to
deliver comparable levels of component abstraction while making an
entire family of common and tedious hand optimization techniques
*obsolete*.

## Game of Benchmarks

Open the [Om TodoMVC in a tab]() and run the first benchmark. It
creates 200 todos and on my 11 inch Macbook Air it takes Safari 7 around
100ms to render.

Now open up the [Backbone.js TodoMVC in a tab]() and run the same
 benchmark.  On my machine this takes around 700ms to render.

Under Chrome and Firefox, Om on my machine is consistently 2-3X
faster. If you try toggling all of the todos you'll notice
Om feels natural, while Backbone.js will feel a bit janky. This is
probably because Om always re-renders on
[requestAnimationFrame](http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/). A
pretty nice optimization to always have in all of your applications.

Ok, excellent work! But, uh, while 2-7X faster across 3 major browser
should be enough to get anyone interested, that's nowhere near the
30X-40X claims you might have seen me make on Twitter.

Try the second Om benchmark - it creates 200 todos, toggles them all 5
times, and then deletes them. On my 11 inch Macbook it takes around
50ms to render.

Now try the second Backbone.js benchmark which does the exact same series
of operations. On my machine this takes around 2500ms seconds to
render.

*How is this possible?*

Simple.

Om never does any work it doesn't have to. We have a
*decomplected* design: data, views and control logic are not
tied together. If data changes we never immediately trigger a
re-render - we simply schedule a render of the data via
`requestAnimationFrame`. Om conceptually considers the browser as
something more akin to a GPU, not a "place".

I suspect many MVC based application like the toy TodoMVC directly
link together changes in the model, the view, and truly orthogonal
concerns like serializing app state into localStorage simply out of
convenience as few frameworks provide the required support to ensure that
users keep these concerns architecturally separate. Frameworks that
emphasize manipulating string based templates, CSS selectors, and the
DOM as a place to store things are hampering themselves.

To make matters worse When JS MVC frameworks duke it out on
performance benchmarks they emphasize aspects that won't have any real
effect on *global performance*. Who cares if a framework has 5X faster
templating when you'll still end up tying things together yet again in
non-scalable ways? A thousand updates to the model will still trigger
a thousand updates to views which will still trigger a thousand writes
to local storage, and you will be destined to optimize your
application by taking a series of steps on the long road towards the
Om model.

Or you could just start using React for your rendering layer and
[mori](http://swannodette.github.io/mori/) for your data layer. You'd
probably find yourself left with less than 200 lines of "framework"
code and around 6 public functions ...

... just like [Om](http://github.com/swannodette/om/blob/master/src/om/core.cljs).

Hopefully this gives the MVC fanatics some food for thought. A compile
to JavaScript language that uses data structures slower than the
native ones provided by JavaScript some how ends up globally faster
than most of the competition for rich user interfaces. To top it off
the Om TodoMVC with same bells and whistles as everyone else weighs in
at 63K gzipped, 3K shy of [Ember.js](http://emberjs.com) gzipped, even
though we're including some serious firepower like
[core.async](http://github.com/clojure/core.async).

Technical description follows.

## How it works

My recent in interest React is all thanks to [Brandon Bloom](http://twitter.com/brandonbloom) has
been bugging me for month to give React a closer look, however I was
turned off by the OOP-y documentation and the source inline HTML. I didn't
give it a proper chance until I saw [Peter Hunt's
[JSConf EU 2013 presentation](http://2013.jsconf.eu/speakers/pete-hunt-react-rethinking-best-practices.html)
that explained the architecture.

Modifying and querying the DOM is a huge performance bottleneck and
React adopts an approach that avoids that without sacrificing
expressivity. While it present a friendly well designed Object
Oriented interface, everything underneath the hood has been crafted
with the eye of a pragmatic functional programmer.

The React Devs have been ridiculously friendly and responsive in
answering many questions so I could determine an passable interface to
React from ClojureScript.

When React does a diff on the virtual DOM specified by your components
there is a very critical function - `shouldComponentUpdate`. If this
returns false, React will never compute the children of the
component. That is, *React builds the virtual DOM tree lazily for
diffing*.

As it turns out `shouldComponentUpdate` is extremely conservative
because JavaScript devs tend to mutate objects - so in order to
determine if some properties of a component has changed they have to
manually walk the JavaScript object / array to figure this out.

Instead of using JavaScript objects Om uses ClojureScript data
structures which we cannot be changed. Because of this we can provide
a component that implements `shouldComponentUpdate` - all it needs to
do is a reference equality check. This simply change means we can
always determine the path changed starting from the root in
logarithmic time.

Because of this fact we don't need React convenience like `setState`
which support efficient subtree updating. Subtree updating for Om is
always lightning fast even if your UI graph is massive.

Because we always re-render from the root, batched updates are trivial
to implement. We don't even bother with the batched update support in
React, we just rolled our own 6 lines change.

Finally because we always have the entire state of the UI in a single
piece of data we can trivially serialize all of the important app
state - we don't need to bother with serialization protocols, or
making sure that everyone implements them correctly. Om UIs are always
serializable.

But this also means that Om UIs get undo for free. You can simply
snapshot any state in memory and reinstate it whenever you like. It's
memory efficient as ClojureScript data structures work by sharing
structure anyway.

## Closing Thoughts

In short I don't think there is a future in the current crop of
JavaScript MVCs. I think if you sit down and think for months and
years in the end only something akin to Om (even if tucked away under
a traditional MVC hood) will deliver an optimal balance between
simplicity, performance, and expressivity. This is because there's
nothing special in Om that hasn't been known for a long, long, long
time. If you treat the browser as a remote rendering engine and stop
treating it as a place to query and store crap, everything gets
faster. Sound like something familiar? Yeah, computer graphics
programming.

Expect more posts in the future elaborating ideas I've only hinted at
or haven't mentioned: VCR playback of UI state, client/server template
sharing, relational user interfaces, and more.

A huge thanks to [Jordan Walke](http://twitter.com/jordwalke)) for
giving me the original inspiration for Om via a Twitter conversation
and to [Peter Hunt](http://twitter.com/floydophone) and
[Ben Alpert](http://github.com/spicyj) for answering my numerous
questions on the React IRC channel.
