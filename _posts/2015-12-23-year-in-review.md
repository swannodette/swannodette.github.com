---
layout: post
title: "ClojureScript Year In Review"
description: ""
category: 
tags: []
---
{% include JB/setup %}

It's been a very exciting year for ClojureScript. It clear that things
have been accelerating and here is a personal selection of highlights:

## Ambly

2015 kicked off with a near complete rewrite of the ClojureScript REPL
infrastructure. This was an admittedly painful transition, but now
that we are on the other side of the hump the considerable payoff is
self-evident.

Case in point, Mike Fike's
[Ambly REPL](https://github.com/omcljs/ambly) delivers a seamless live
experience when developing iOS applications without requiring
tethering or XCode beyond the initial install. Using a slick
combination of Bonjour and WebDAV, the Ambly REPL sets a new bar.

Here's a basic Ambly demo:

<iframe style="border: 1px solid black; padding: 2px;" width="580" height="315"
src="https://www.youtube.com/embed/TVDkYZJW2MY" frameborder="0"
allowfullscreen></iframe>

Ambly plays well with other cool JavaScriptCore integrations like
[Ejecta](https://github.com/phoboslab/ejecta) which exposes both
JavaScript Canvas 2D and WebGL APIs to native iOS clients.

For example here's Ambly being used to develop an Ejecta application
on [tvOS](https://developer.apple.com/tvos/?&cid=wwa-us-kwg-tv):

<iframe style="border: 1px solid black; padding: 2px;"width="420" height="315"
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

<iframe style="border: 1px solid black; padding: 2px;" width="580" height="315"
src="https://www.youtube.com/embed/4txql-1VXJk" frameborder="0"
allowfullscreen></iframe>

For getting up and running with React Native, look at
[natal](https://github.com/dmotz/natal) and
[re-natal](https://github.com/drapanjanas/re-natal) as well the
collection of resources at [cljsrn.org](http://cljsrn.org/).

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

While [Figwheel](https://github.com/bhauman/lein-figwheel) appeared
prior to 2015, it became clear with a slew of strong stable releases
that, Bruce Hauman is one of ClojureScript's finest tooling
authors. In a very short window of time Figwheel has taken the
ClojureScript world by storm as the REPL of choice. The usefulness of
hot-code loading during UI work cannot be understated.

<iframe style="border: 1px solid black; padding: 2px;" width="580" height="315"
src="https://www.youtube.com/embed/j-kj2qwJa_E" frameborder="0"
allowfullscreen></iframe>

This video should be watched in its entirety.

## Devcards

Clearly Figwheel wasn't enough for
Bruce. [Devcards](https://github.com/bhauman/devcards) sets a new bar
for UI tooling. Devcards also came together prior to 2015 but the
adoption rate has skyrocketed of late and for good reason. Having
tried all kinds of UI tooling in my career, Devcards legitimately provides
something so obvious and simple it's incredible it hasn't been tried
before. As Alan Kay sez, a change of perspective is worth a
non-trivial amount of IQ points.

Combined with Figwheel, Devcards provides an interactive way to both
develop and view component states, radically simplifying the task of
testing your UI work:

<iframe style="border: 1px solid black; padding: 2px;" width="580" height="315"
src="https://www.youtube.com/embed/DPHkBp9Mkzk" frameborder="0"
allowfullscreen></iframe>

Again, this video must be watched in its entirety.

## Self Compilation

With the appearance of reader conditionals in Clojure 1.7.0 I got the
bug over the summer to make ClojureScript self-compile. While it may
seem like a feat to outsiders, ClojureScript was always ready for
self compilation and the work was pretty boring. The repercussions
however are only starting to be understood. Some great examples of the
power of optional bootstrapping are the winning
[Clojure Cup entry](http://landofquil.we-do-fp.berlin) and a new
web based [ClojureScript REPL](http://clojurescript.io).

Some other neat bootstrapping projects follow after some brief words
on ClojrueScript 1.7.X.

## ClojureScript 1.7.X

Shortly after bootstrapping we released ClojureScript 1.7.28. This was
the first release of ClojureScript with a proper version number. It
also signified a much slower pace for releases, much needed to avoid
tooling churn. Now that the fundamentals are in place expect 2016 releases
to be heavily focused on compiler performance and build
reliability. Master already includes exciting enhancements like
parallel builds (40 lines of code written during a 45 minute train
ride - thanks Clojure!). Users have reported 30-300% faster compile
times on their multi-core machines.

## Planck

Mike Fikes is clearly a tireless person, within what seemed like hours
of bootstrapping, Mike Fikes had a standalone ClojureScript REPL that
you can easily install with [brew](http://brew.sh).

<iframe style="border: 1px solid black; padding: 2px;" width="580" height="315" src="https://www.youtube.com/embed/CC5jGO712cE" frameborder="0" allowfullscreen></iframe>

If you want a ClojureScript REPL that starts fast for testing one
liners, look no further than Planck.

## Replete

Thanks to bootstrapping you can also use full blown ClojureScript on
your iPhone or iPad:

<iframe style="border: 1px solid black; padding: 2px;" width="580" height="315"
src="https://www.youtube.com/embed/GVVugX3qqF8" frameborder="0"
allowfullscreen></iframe>

If you had told me I would be running a robust dialect of Clojure on my
phone 4 years ago I would have laughed in disbelief.

## Parinfer

This one came out of the blue. Lisp is 58 years old and people are
still coming up with things that no one has tried before. With a
clever algorithm and some inference driven by indentation, Shaun
LeBron has probably created the most beginner friendly way to write
Lisp the world has ever seen. The
[parinfer blog post is a jaw dropper](https://shaunlebron.github.io/parinfer/).

And of course Mike Fikes gets parinfer into Replete in short order:

<iframe style="border: 1px solid black; padding: 2px;" width="580" height="315"
src="https://www.youtube.com/embed/xdIwkPEnlFY" frameborder="0"
allowfullscreen></iframe>

If anything 2015 has been the year of network effects. It's thrilling
to see all these individual efforts come together as part of a grand
shared vision.

## Cursive

[Cursive IDE shipped](https://cursive-ide.com/)! If you're looking for
a rich development environment for Clojure and ClojureScript, Cursive
delivers in spades. I've been using it exclusively for Clojure and
ClojureScript development since January and I can't imagine life without
it.

## Cider 0.10

[Cider 0.10](https://github.com/clojure-emacs/cider/releases/tag/v0.10.0)
shipped with many, many enhancements for ClojureScript. If Emacs is
your tool of choice, the ClojureScript story has improved leaps and
bounds over the past year thanks to the tireless work of many
contributors.

## Om Next

I also did a series of talks on Om Next this year. Whether or not you
adopt Om or the technologies that inspired it (Relay, Falcor,
Datomic), I am confident that Graph-Query-View based UI architectures
will gain steam in 2016. Kovas Boguta and I gave a
[high level talk at QCon](http://www.infoq.com/presentations/domain-driven-architecture)
and I deliver the
[nitty gritty at Clojure/conj](https://www.youtube.com/watch?v=MDZpSIngwm4).

## Conclusion

The amount of innovation and invention in the ClojureScript community
is nothing short of stunning. Hopefully this post gives you a sense of
what sets ClojureScript apart from pretty much every other
compile-to-JavaScript technology. As a group we are now thinking
far beyond programming language esoterica and have turned towards the
challenge of building the necessary *environmental infrastructure*
required for the construction of simpler and more robust software
systems.

Congratulations to all that have given to the evolution of
ClojureScript whether through adoption, contribution, or evangelism!

I suspect 2016 will be an even bigger one for ClojureScript.

Have a Happy New Year!
