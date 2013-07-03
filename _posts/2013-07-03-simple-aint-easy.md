---
layout: post
title: "Simple Ain't Easy"
description: ""
category: 
tags: []
---
{% include JB/setup %}

Rich Hickey has lots of great talks but one of his best is
[Simple Made Easy](http://www.infoq.com/presentations/Simple-Made-Easy). If
you haven't seen it before stop reading this blog post now and go
watch it.

A few days ago Clojure/core
[announced](http://clojure.com/blog/2013/06/28/clojure-core-async-channels.html)
a new libary called
[core.async](https://github.com/clojure/core.async). I recommend
checking out the post first, I'm not going to retread material covered
elsewhere. I've been excited about this library for a while now and
have been playing with it intensely since the announcement -
tldr; it's beautiful, it's simple, but it ain't easy and that's OK!

So why core.async? If you've done Go channels you are probably already
sold. Whatever the case may be, I think post will demonstrate
core.async applicability to solving a class of hard problems that
arise in one of the most critical component of our distributed
computing ecosystem - User Interface programming.

I frequently blog and talk about [Lisp](http://vimeo.com/68334908) and
its advantages but I truly harbor no animosity towards the lingua
franca of the web - JavaScript. But I also don't self identity as a
JavaScript programmer. And while I may talk on Twitter endlessly about
Clojure and ClojureScript - I primarily see them as tools, a poewrful
means to a personal end.

I see myself primarily as a User Interface programmer. It's what I've
been happily paid to do for the past eight years. In 2004/5 when I
started it truly seemed like the Wild West. But in 2013 it looks pretty
much the same as it did 9 years ago. Newer faces, better tooling, but
the development process is more or less unchanged.

Well not completely. There's a truly misguided excitement about
Promises, and slightly misguided one about Generators. Misguided how?

If you ask the average front developer what they did would they answer
"Distributed Systems Programming"? I doubt it - it's sounds so
pretentious - yet this is precisely what client sides JavaScript
development is!

And by that I do not mean an inventor of ideas
like the fabulous [Bret Victor](http://vimeo.com/36579366). one of
most rewarding a challenging professions one can have. of the using
JavaScript for UI programming for some eight years now, I was very
intrigued by core.async. I've written large code bases with promises
in the past and I've toyed around with the coming
[EcmaScript 6 Generators](http://wiki.ecmascript.org/doku.php?id=harmony:generators). I'm
still not convinced

I've been playing around with core.async pretty intens
