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

So why core.async? If you've done Go channels you are probably already
sold. Whatever the case may be, I think this post will demonstrate
core.async's applicability to solving a class of hard problems that
arise in one of the most critical components of our modern distributed
computing ecosystem - User Interface programming.

I frequently blog and talk about [Lisp](http://vimeo.com/68334908) and
its advantages but I truly harbor JavaScript. But I also don't self
identity as a JavaScript programmer. And while I may talk on Twitter
endlessly about Clojure and ClojureScript - I primarily see them as
tools, a powerful means to a personal end.

When it comes to code I primarily see myself as a User Interface
programmer. It's what I've been happily paid to do for the past eight
years. In 2004/5 when I started out it seemed like Wild West. But in
2013 it looks pretty much the same as it did 9 years ago. Newer faces,
better tooling, but the type of code I write is largely
unchanged. Why?

If you ask the average front developer their occupation would they
answer "Distributed Systems Programmer"? I doubt it - but this is
precisely what client sides JavaScript development is! Every
JavaScript developer is stuck between a rock and hard place - the user
and the server.

JavaScript is unsuited for reasoning about complex networks of
processes because it provide no tools for doing so.

Wait, wait, wait. What about Promises? Generators? There's a truly
misguided excitement about Promises, and a slightly misguided one
about Generators. Misguided how?

They are too far down the abstraction stack - if you look at npm there
hundred of libraries that deal with "control flow". Neither Promises
nor Generators will change the state of things as neigther of these
things bring a "process philosophy" to JavaScript.

Let's look at some concrete examples.

## Examples

