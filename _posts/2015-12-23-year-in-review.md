---
layout: post
title: "ClojureScript Year In Review"
description: ""
category: 
tags: []
---
{% include JB/setup %}

It's been a very exciting year for ClojureScript. Here is a personal
selection of highlights:

## Ambly

2015 kicked off with a near complete rewrite of the ClojureScript REPL
infrastructure. This was an admittedly painful transition, but now
that we are on the other side of the hump the considerable payoff is
self-evident.

Case in point, Mike Fike's Ambly REPL delivers a seamless live
experience when developing iOS applications without requiring
tethering or XCode beyond the initial install. Using a slick
combination of Bonjour and WebDAV, the Ambly REPL sets a new bar.

Here's a basic Ambly demo:

<iframe width="560" height="315"
src="https://www.youtube.com/embed/TVDkYZJW2MY" frameborder="0"
allowfullscreen></iframe>

Ambly plays well with other cool JavaScriptCore integrations like
[Ejecta](https://github.com/phoboslab/ejecta) which exposes both
JavaScript Canvas 2D and WebGL APIs to native iOS clients.

For example here's Ambly being used to develop an Ejecta application
on [tvOS](https://developer.apple.com/tvos/?&cid=wwa-us-kwg-tv):

<iframe width="420" height="315"
src="https://www.youtube.com/embed/eaWy5mliO38" frameborder="0"
allowfullscreen></iframe>

You can find out more [here](https://github.com/omcljs/ambly);

## React Native

Facebook announced React Native further solidifying the role of React
as a critical part of the ClojureScript ecosystem. ClojureScript React
bindings abound and now the community can easily reach the iOS and
Android platforms using the same React bindings we've all come to love
over the past two years.

Here is another Mike Fikes video demonstrating React Native with
Reagent:

<iframe width="560" height="315"
src="https://www.youtube.com/embed/4txql-1VXJk" frameborder="0"
allowfullscreen></iframe>

Suffice to say I see ClojureScript + React Native really taking off
in 2016.

## Google Summer of Code

The ClojureScript Google Summer of Code 2015 project was smashing
success. Maria Geller dove deep into the problem of integrating
CommonJS, AMD, ES2015 modules as well as integrating popular
JavaScript compilation technology like Babel.js. There's more work to
do but the future is bright for good integration with the wider
JavaScript ecosystem. You can read more about the project
[here](http://mneise.github.io).

Also Maria Geller gave a stunning talk about the ClojureScript
compiler internals at the Clojure/conj which is
[well worth watching](https://www.youtube.com/watch?v=Elg17s_nwDg)

## Re-frame

[Reagent](https://github.com/reagent-project/reagent) has become the
tool of choice for many people in the ClojureScript community. My
uninformed impression is that this has been further bolstered by the
appearance of [re-frame](https://github.com/Day8/re-frame), a very
well-considered architecture for Reagent applications.

If the other ClojureScript React bindings aren't your speed, Reagent
and re-frame are well worthy of a close assessment. The community is
prolific, active, and helpful.

## Figwheel

While Figwheel appeared prior to 2015, it became clear with a slew of
strong stable releases that, Bruce Hauman is one of ClojureScript's
finest tooling authors. In a very short window of time Figwheel has
taken the ClojureScript world by storm as the REPL of choice. The
usefulness of hot-code loading when during UI work cannot be
understated.

<iframe width="560" height="315"
src="https://www.youtube.com/embed/j-kj2qwJa_E" frameborder="0"
allowfullscreen></iframe>

This video should be watched in its entirety.

## Devcards

Clearly Figwheel wasn't enough for Bruce. Devcards sets a new bar for
UI tooling. Have tried all kinds of UI tooling, Devcards legitimately
provides something so obvious and simple it's incredible it hasn't bee
tried before. As Alan Kay says, a chance of perspective is worth a
non-trivial amount of IQ points.

Combined with Figwheel, Devcards provides an interactive way to both
develop and view component states radically simplifying the task of
testing your UI work:

<iframe width="560" height="315"
src="https://www.youtube.com/embed/DPHkBp9Mkzk" frameborder="0"
allowfullscreen></iframe>

Again, this video must be watched in its entirety.

## Self Compilation

With the appearance of reader conditionals in Clojure 1.7.0 I got the
bug over the summer to make ClojureScript self-compile. While it may
seem like a feat to outsiders, ClojureScript was always ready for
self-compilation and the work was pretty boring. The repercussions
however are only starting to be understood. Some great examples of the
power of optional bootstrapping are the winning
[Clojure Cup entry](http://landofquil.we-do-fp.berlin) and a new
web based [ClojureScript REPL](http://clojurescript.io).

Some other neat bootstrapping projects follow.

## Planck

Mike Fikes is clearly a tireless person, within what seems like hours
of bootstrapping, Mike Fikes had a standalone ClojureScript REPL that
you can easily install with [brew](http://brew.sh).

<iframe width="560" height="315" src="https://www.youtube.com/embed/CC5jGO712cE" frameborder="0" allowfullscreen></iframe>

## Replete

Thanks to bootstrapping you can also use full blown ClojureScript on
your iPhone or iPad:

<iframe width="560" height="315"
src="https://www.youtube.com/embed/GVVugX3qqF8" frameborder="0"
allowfullscreen></iframe>

## Parinfer

This one came out of the blue. Lisp is 58 years old and people are
still coming up with things that no one has tried before. With a
clever algorithm and some inference driven by indentation, Shaun
LeBron has probably created the most beginner friendly way to write
Lisp the world has ever seen. The
[parinfer blog post is a jaw dropper](https://shaunlebron.github.io/parinfer/).

And of course Mike Fikes gets parinfer into Replete in short order:

<iframe width="560" height="315"
src="https://www.youtube.com/embed/xdIwkPEnlFY" frameborder="0"
allowfullscreen></iframe>

## Cursive

[Cursive IDE shipped](https://cursive-ide.com/)! If you're looking for
a rich development environment for Clojure and ClojureScript, Cursive
delivers in spades. I've been using it exclusively for Clojure and
ClojureScript development since January and I can't imagine life with
it.

## Cider 0.10

[Cider 0.10](https://github.com/clojure-emacs/cider/releases/tag/v0.10.0)
shipped with many, many enhancements for ClojureScript. If Emacs is
your tool of choice, the ClojureScript story has improved leaps and
bounds over the past year thanks to tireless work of many
contributors.

## Om Next

I also did a series of talks on Om Next this year. Whether or not you
adopt Om or the technologies that inspired it (Relay, Falcor,
Datomic), I am confident that Graph-Query-View based UI architectures
will gain steam in 2016

http://www.infoq.com/presentations/domain-driven-architecture
https://www.youtube.com/watch?v=MDZpSIngwm4

## Conclusion

The amount of innovation and invention in the ClojureScript community
is nothing short of stunning. Hopefully this post give you a sense of
what sets apart ClojureScript from pretty much ever other compile to
JavaScript technology. As a group we are now thinking beyond
programming language esoterica and have turned towards the challenge
of building the much needed *environmental infrastructure* required
for the construction of simpler and more robust software systems.

Looking forward to 2016!
