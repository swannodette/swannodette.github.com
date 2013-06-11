---
layout: post
title: "Porting Notch's Minecraft Demo to ClojureScript"
description: ""
category: 
tags: []
---
{% include JB/setup %}

I apologize for not wrapping up my series of posts on
[nominal logic programming](http://arxiv.org/abs/cs/0609062), I
promise I will return soon enough. But let us take leave of
theoretical computer science and turn to matters that are more
"pragmatic".

In this post I want to talk about my port of Notch's JavaScript demo
to ClojureScript. First off the code is very ugly, largely due to the
fidelity of the port possible. This post isn't about writing beautiful
code, it's about demonstrating that ClojureScript is indeed suitable
for writing computational intensive interactive applications. The code
also demonstrates just how good Google Closure is at dead code
elimination.

Without further ado here it is:

<canvas id="game" width="424" height="240"></canvas>

Without doubt, I am a firm advocate of functional programming, but
unlike the various puritans you might encounter in the wild, I don't
find that is the right tool for all problems especially when
performance is absolutely critical.

The sleight of hand that Clojure has pulled is to make functional
programming so fun and attractive that it's unusual to see Clojure
code that isn't largely functional.

But there are of many kinds of interactive applications one might
right for which functional technique may simply not provide the best
tool.

Clojure fortunately doesn't close all the pathway to performance, like
Standard ML before it, Clojure provides.

Again we could have gotten more ambition. One think I would love to
 see is a Nile-like graphic DSL for Clojure.
