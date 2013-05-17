---
layout: post
title: "Negation As Failure"
description: ""
category: 
tags: ["prolog", "negation", "core.logic"]
---
{% include JB/setup %}

While I should probably wrap up my nominal logic series, I'm instead
taking a detour to explain a new feature I just landed in
[core.logic](http://github.com/clojure/core.logic) - negation as
failure.

Despite [Prolog](http://en.wikipedia.org/wiki/Prolog)'s name
(*programmation en logique*), programming in it often feels like
anything but logic. One particular weakspot is negation. Take for
example the following simple Prolog program:

Given this information how do you find the data that *doesn't* satisfy
some predicate. What appears to be an incredibly simple idea isn't! In
fact there are many papers on the challenge of implementing negation
in Prolog.

While I could have added a negation as failure operator akin to `\+`
sooner it would have suffered from the same issues illustrated
above. However now that we have a generic constraint programming
infrastructure we can implement the operator while avoiding many the
issues.

All we have to do is delay the negated goal until all of the arguments
to the negated goal are *ground*. By ground we mean that the term is
completely instantied and doesn't have any *holes* in it - that is
fresh variables that are not bound to some value.

Note that using `nafc` in your code might degrade performance - such
as combining it with CLP(FD) operator. In general a hand written
negated goal or constraint will likely perform better every
time. However I think the great convenience of `nafc` and the fact
that we can provide a version with few issues warrants it
conclusion. Many programs that were formerly hard to express now have
a dramatically simpler encoding.
