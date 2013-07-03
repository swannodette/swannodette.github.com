---
layout: post
title: "Simple Ain't Easy"
description: ""
category: 
tags: []
---
{% include JB/setup %}

Rich Hickey has many of great talks but one of his best is
[Simple Made Easy](http://www.infoq.com/presentations/Simple-Made-Easy). If
you haven't seen it before stop reading this blog post now and go
watch it.

A few days ago Clojure/core
[announced](http://clojure.com/blog/2013/06/28/clojure-core-async-channels.html)
a new libary called
[core.async](https://github.com/clojure/core.async). I recommend
checking out the post first, I'm not going to retread material covered
there. I've been excited about this library for a while now and
have been playing with it intensely since the announcement.

tldr; It's beautiful, it's simple, but it ain't easy and that's OK!

Why core.async? I'll tell my own version of story via my own biases. I
believe core.async's provides tools to solve a class of hard problems
that arise in one of the most critical components of our modern
distributed computing ecosystem - User Interface programming. It is
capable of going where few others have (MVC, FRP, etc) because it
takes independent communicating processes as it foundation.

Take the average JavaScript front developer and ask them their
occupation? Would they answer "Distributed Systems Programmer"? I
doubt it - but this is precisely what client sides JavaScript
development is! Every JavaScript developer is stuck between a rock and
hard place - the user and the server.

Yet JavaScript does not ship with any resembling a process about processes.

Wait, wait, wait. What about Promises? Generators? There's a truly
misguided excitement about Promises, and a slightly misguided one
about Generators. Misguided how?

They are too far down the abstraction stack - if you look at npm there
hundred of libraries that deal with "control flow". Neither Promises
nor Generators will change the state of things as neigther of these
things bring a "process philosophy" to JavaScript.

Let's look at some concrete examples.

## Examples

