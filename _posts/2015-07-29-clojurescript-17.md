---
layout: post
title: "ClojureScript Next"
description: ""
category: 
tags: []
---
{% include JB/setup %}

<link href="/assets/css/codemirror.css" rel="stylesheet"></link>
<link href="/assets/css/cljs-next/main.css" rel="stylesheet"></link>

<img width="590" style="border: 1px solid #ccc" src="/assets/images/lambdam.jpeg" />

I've been enamoured with languages in the Lisp family ever since I
first encountered
[The Structure and Interpretation of Computer Programs](https://mitpress.mit.edu/sicp/full-text/book/book.html)
now more than a decade ago. At the time I was disappointed that such
beautiful systems found so little use in day to day programming. Lisp
seemed both deeply pragmatic (Objects!) and deeply sophisticated
(Meta-circular Interpreters!). But Java, bless its heart, was the
language of the day, and despite Steele's characterization, it seemed
miles away from Scheme or anything like it.

From one angle the next 13 years were my attempt to make Lisp more
relevant for day to day work and not just for some cultic inner
circle. For many years it seemed like a crackpot dream. So it's with a
constant sense of wonder that I look around at the rapidly expanding
ClojureScript community who share the same love for simpler yet more
expressive production systems.

So it's with much happiness that I say today is a big Lisp-y milestone
for ClojureScript.

*ClojureScript can compile itself.*

Yeah.

Before we dig into this mind-bender, a few words on another big change.

## Clojurescript 1.7

ClojureScript now has a version number. Enthusiastic
users have often asked *How long till 1.0?*. However 1.0 would not
correctly reflect the time, effort, and feature set that comes with
four years of very active development. Instead we're adopting 1.7 as
this communicates the incredibly important relationship that
ClojureScript has with its parent language, Clojure.

This close relationship means the differences between Clojure and
ClojureScript are largely uninteresting. So much so that with the help
of
[reader conditionals](http://blog.cognitect.com/blog/2015/6/30/clojure-17)
and some dedicated collaborative effort, ClojureScript can now compile
itself.

Enough ado, let's get to it.

## Say Hello To Our Old Friend, Eval

The following is a simple ClojureScript program that creates a
definition and immediately invokes it. Click the **EVAL** button.

<div class="eval-cljs">
    <textarea id="ex0" class="code"></textarea>
    <div class="eval-ctrl">
        <input id="ex0-out" type="text"></input>
        <button id="ex0-run" class="eval">EVAL</button>
    </div>
</div>

The humble result hides the enormity of the event :)

We read a string out of [CodeMirror](https://codemirror.net/), read
it via [tools.reader](https://github.com/clojure/tools.reader) into
persistent data structures, passed it into the ClojureScript analyzer,
constructed an immutable AST, passed that AST to the compiler, and
generated JavaScript source with inline source maps and eval'ed the
result.

All of this happened inside of your web browser.

To be very clear, *this is precisely the same ClojureScript compiler
that runs on the Java Virtual Machine running on Plain Old
JavaScript*.

For the unbelievers, open Chrome DevTools, open the Sources tab and
you should see something like the following:

<img width="590" style="border: 1px solid #ccc"
src="/assets/images/inline_source_maps.png" />

Let's dig into details that enabled the humble result above.

## Reading

ClojureScript has never been slow. Internally we've spent years tuning
code generation for modern JavaScript JITs without catering to any
specific engine (for a long time V8 was king, but these days
JavaScriptCore is screaming ahead of the pack).

For ClojureScript experts it's possible to achieve zero overhead over
hand-written JavaScript. This is the style employed for critical bits
like persistent data structures and hashing.

So how long does it take to read the entire standard library (about
10,000 lines of code) into persistent data structures? Click the
following button. This will download the entire standard library and
then measure the time it takes to read all of it.

<div class="eval-cljs">
    <div class="eval-ctrl">
        <input id="ex1-out" type="text" value="No Runs"></input>
        <button id="ex1-run">Read cljs.core!</button>
    </div>
</div>

On my 3.5ghz iMac this takes ~80ms under WebKit Nightly, ~130ms
under Chrome Canary, and ~110ms under Firefox Nightly.

Now let's consider the next step, analysis.

## Analysis

To further drive home that this is the *real* ClojureScript compiler
let's take a look at the immutable AST generated from a trivial
ClojureScript expression:

<div id="ana-cljs" class="eval-cljs">
    <div class="cols">
         <div class="left">
              <textarea id="ex2" width="290"></textarea>
         </div>
         <div class="right">
              <textarea id="ex2-out" width="290"></textarea>
         </div>
    </div>
</div>
<div class="eval-ctrl">
     <button id="ex2-run" class="eval">ANALYZE</button>
</div>

The ClojureScript is represented entirely as simple data, maps,
string, numbers, vectors, symbols, etc.

From the AST we can now generate JavaScript.

## Compilation

The compiler generates JavaScript directly from the simple data
oriented AST:

<div id="comp-cljs" class="eval-cljs">
   <div class="eval-cljs">
       <div class="cols">
           <div class="left">
               <textarea id="ex3" class="code"></textarea>
           </div>
           <div class="right">    
               <textarea id="ex3-out" class="code"></textarea>
           </div>
       </div>
    </div>
</div>
<div class="eval-ctrl">
    <button id="ex3-run" class="eval">COMPILE</button>
</div>

Let's show a less trivial example. We can load a macros file from a
URL, compile it, and then compile the source that uses the macro:

## Loop (Conclusion)

<script type="text/javascript" src="/assets/js/cljs_next/main.js"></script>
