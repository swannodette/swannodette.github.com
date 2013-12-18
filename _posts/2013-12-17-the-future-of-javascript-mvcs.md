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
[React](http://facebook.github.io/react/) library from Facebook. If
you haven't checked it out before, I
recommend [watching this video from JSConf EU 2013]
(http://2013.jsconf.eu/speakers/pete-hunt-react-rethinking-best-practices.html).
Interestingly because of immutable data Om can deliver even better results
than using React out of the box.

These benchmarks are not designed to prove that Om is the fastest
UI component system in the world. These benchmarks are
designed to demonstrate that it's important to avoid implementation
decisions that defy global optimization or leave so little guidance
that users will inevitably make these same problematic design
decisions themselves.

Of course you can correct these issues in your client side application
on a
[tedious case by case basis](http://blog.scalyr.com/2013/10/31/angularjs-1200ms-to-35ms/),
but the whole point of Om is to deliver competitive levels of
component abstraction while making an entire family of common and
tedious hand optimization techniques *obsolete*.

## Game of Benchmarks

Open the [Om TodoMVC in a tab](http://swannodette.github.io/todomvc/labs/architecture-examples/om/index.html) and run the first benchmark. It
creates 200 todos and on my 11 inch Macbook Air it takes Safari 7 around
120ms to render.

Now open up the [Backbone.js TodoMVC in a tab](http://swannodette.github.io/todomvc/architecture-examples/backbone/index.html) and run the same
 benchmark.  On my machine this takes around 500ms to render.

Under Chrome and Firefox, Om on my machine is consistently 2-4X
faster. If you try toggling all of the todos you'll notice
Om feels natural, while Backbone.js will feel a bit janky. This is
probably because Om always re-renders on
[requestAnimationFrame](http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/). A
pretty nice optimization to have enabled in your applications.

Taking a look at the Chrome Dev Tools JS profile flame graphs for this benchmark
is suprisingly informative as far as how Om/React works out of the box
versus how unoptimzed Backbone.js works:

This is Om/React:

<img style="border: 1px solid #ccc" src="/assets/images/om.jpg" />

This is Backbone.js:

<img style="border: 1px solid #ccc" src="/assets/images/bb.jpg" />

The Om/React flame graph seems to suggest, at least to my eyes, a
design far more amenable to global optimization.

Ok, excellent work! But, uh, while 2-4X faster across 3 major browser
should be enough to get anyone interested, especially considering the
fact that we're achieving this level of performance *because of* immutable
data, that's nowhere near the 30X-40X claims you might have
seen me make on Twitter.

Try the second Om benchmark - it creates 200 todos, toggles them all 5
times, and then deletes them. Safari 7 on my 11 inch Macbook Air takes around
5ms to render.

Make sure to delete all of the todos from the Backbone.js benchmark
first then try the second Backbone.js benchmark. On my machine
Safari takes around 4200ms seconds to complete.

*How is this possible?*

Simple.

Om never does any work it doesn't have to: data, views and control
logic are not tied together. If data changes we never immediately
trigger a re-render - we simply schedule a render of the data via
`requestAnimationFrame`. Om conceptually considers the browser as
something more akin to a GPU.

I suspect many JS MVC applications follow the Backbone.js TodoMVC lead
and link together changes in the model, the view, and truly orthogonal
concerns like serializing app state into localStorage simply out of
convenience as few frameworks provide the required support to ensure
that users keep these concerns architecturally separate. But really
this should come as no surprise, the predominant culture leans on
string based templates, CSS selectors, and direct DOM manipulation -
all markers of "place oriented" programming and potential bottlenecks
that Om leaves behind.

Hopefully this gives fans of the current crop JS MVCs and even people
who believe in just using plain JavaScript and jQuery some food for
thought. I've shown that a compile to JavaScript language that uses
slower data structures ends up faster than a reasonably fast
competitor for rich user interfaces. To top it off
[Om TodoMVC](http://github.com/swannodette/todomvc/blob/gh-pages/labs/architecture-examples/om/src/todomvc/app.cljs)
with same bells and whistles as everyone else weighs in at ~260 lines
of code (including all the templates) and the minified code is 63K
gzipped (this total includes the 27K of React, the entire
ClojureScript standard libary, core.async, a routing library, and
several helpers from Google Closure).

If you're a JavaScript developer I think taking a hard look at React
is a really good idea. I think coupling React with a persistent data
structure library like [mori](http://swannodette.github.io/mori/)
could bring JS applications all the way to the type of flexible yet
highly tuned architecture that Om delivers. While it's true immutable
data structures tend to generate more garbage we strongly believe
modern JS engines are up to the task and the hardware we carry around
in our pockets is improving at a rapid clip.

Technical description follows.

## How it works

Modifying and querying the DOM is a huge performance bottleneck and
React embraces an approach that eschews this without sacrificing
expressivity. It presents a well designed Object Oriented interface,
but everything underneath the hood has been crafted with the eye of a
pragmatic functional programmer. It works by generating a virtual
version of the DOM and as your application state evolves it diffs changes
between the virtual DOM trees over time. It uses these diffs to make
the minimal set of changes required on the real DOM so you don't have to.

When React does a diff on the virtual DOM specified by your components
there is a very critical function - `shouldComponentUpdate`. If this
returns false, React will never compute the children of the
component. That is, *React builds the virtual DOM tree lazily for
diffing based on what path in the tree actually changed*.

As it turns out the default `shouldComponentUpdate` implementation is
extremely conservative because JavaScript devs tend to mutate
objects and arrays! So in order to determine if some properties of a component
has changed they have to manually walk JavaScript objects and arrays
to figure this out.

Instead of using JavaScript objects Om uses ClojureScript data
structures which we know will not be changed. Because of this we can
provide a component that implements `shouldComponentUpdate` that does
the fastest check possible - a reference equality check. This means we
can always determine the paths changed starting from the root in
logarithmic time.

Thus we don't need React operations like `setState` which
exists to support both efficient subtree updating as well as good
Object Oriented style. Subtree updating for Om
starting from root is always lightning fast because we're just doing
reference equality checks all the way down.

Also because we always re-render from the root, batched updates are
trivial to implement. We don't bother with the batched update support
in React as it's designed to handle cases we don't care about, so we
just rolled our own 6 line rocket fuel enhancement.

Finally because we always have the entire state of the UI in a single
piece of data we can trivially serialize all of the important app
state - we don't need to bother with serialization protocols, or
making sure that everyone implements them correctly. Om UI states are
always serializable, always snapshotable.

This also means that Om UIs get undo for free. You can simply
snapshot any state in memory and reinstate it whenever you like. It's
memory efficient as ClojureScript data structures work by sharing
structure.

## Closing Thoughts

In short I don't think there is much of future in the current crop
of JavaScript MVCs. I think if you sit down and think for months and
years in the end only something akin to Om (even if tucked away under
a traditional MVC hood) will deliver an optimal balance between
simplicity, performance, and expressivity. There's
nothing special in Om that hasn't been known for a long, long, long
time. If you treat the browser as a remote rendering engine and stop
treating it as a place to query and store crap, everything gets
faster. Sound like something familiar? Yeah, computer graphics
programming.

Expect more posts in the future elaborating ideas I've only hinted at
or haven't mentioned: VCR playback of UI state, trivial UI
instrumentation, client/server template sharing, relational user
interfaces, and much more.

## Thanks

I would not have written this post or written Om if wasn't for the
following people.

[Brandon Bloom](http://twitter.com/brandonbloom) has been bugging me
for many months to give React a closer look. Sadly I didn't give it a
proper chance until I saw
[Peter Hunt's JSConf EU 2013 presentation](http://2013.jsconf.eu/speakers/pete-hunt-react-rethinking-best-practices.html)
that explained the architecture.

A huge thanks to [Jordan Walke](http://twitter.com/jordwalke) for
inadvertently giving me the original inspiration to try something like
Om via a Twitter conversation and to
[Peter Hunt](http://twitter.com/floydophone) and
[Ben Alpert](http://github.com/spicyj) and the other super friendly
people on the React IRC channel for answering my numerous
questions.
