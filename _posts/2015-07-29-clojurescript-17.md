---
layout: post
title: "ClojureScript Next"
description: ""
category: 
tags: []
---
{% include JB/setup %}

<link href="/assets/css/codemirror.css" rel="stylesheet" />
<link href="/assets/css/cljs-next/main.css" rel="stylesheet" />

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

For many years it seemed unlikely that Lisp would be more widely used
by the working programmer. So it's with a constant sense of wonder
that I look around at a rapidly expanding
[ClojureScript](http://cljsjs.github.io/)
[community](http://cljs.info/cheatsheet/) that
[shares](https://github.com/clojure/clojurescript/wiki/Companies-Using-ClojureScript)
the same love for simpler yet more expressive systems. It seems fair
to attribute this quickening pace of adoption to ClojureScript's
steadfast dedication to pragmatism.

But always taking the practical route can cut off unforeseen avenues
and vistas.

Today ClojureScript embraces the less practical and "dream bigger"
side of Lisp.

*ClojureScript can compile itself.*

Yeah.

There's a lot to talk about, but first a few words on another big
change.

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
and some dedicated collaborative effort, self compilation came rather
quickly.

Enough ado, let's get to it.

## Say Hello To Our Old Friend, Eval

The following is a simple ClojureScript program that creates a
definition and immediately invokes it. Click the **EVAL** button.

<div class="eval-cljs">
    <textarea id="ex0" class="code"></textarea>
    <div class="eval-ctrl">
        <input id="ex0-out" type="text" />
        <button id="ex0-run" class="eval">EVAL</button>
    </div>
</div>

The humble result hides the enormity of the event :) If you know
ClojureScript (or even if you don't), feel free to modify the source
and evaluate whatever you like.

So what is happening here?

We grabbed a string out of [CodeMirror](https://codemirror.net/), read
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

The first step is converting a string into a series of data
structures. What other languages call parsing is traditionally called
reading in Lisp. It's important for this process to be fast. We've
spent years tuning ClojureScript code generation for modern JavaScript
JITs without catering to any specific engine (for a long time V8 was
king, but these days
[JavaScriptCore is screaming ahead of the pack](https://www.webkit.org/blog/3362/introducing-the-webkit-ftl-jit/)).

So how long does it take to read the entire standard library (about
10,000 lines of code) into persistent data structures? Click the
following button. This will download the entire standard library and
then measure the time it takes to read all of it. Make sure to click
a few times and you will observe it get faster.

<div class="eval-cljs">
    <div class="eval-ctrl">
        <input id="ex1-out" type="text" value="No Runs" />
        <button id="ex1-run">Read cljs.core!</button>
    </div>
</div>

On my 3.5ghz iMac this takes ~60ms under WebKit Nightly, ~80ms
under Chrome Canary, and ~60ms under Firefox Nightly. These numbers
are only 1.5X to 2X slower than ClojureScript JVM performance.

A big shoutout to [Andrew Mcveigh](https://github.com/andrewmcveigh)
and [Nicola Mometto](https://github.com/Bronsa) for pushing the
ClojureScript port of tools.reader through.

Now let's consider the next step, analysis.

## Analysis

After successfully reading a form, that form is passed to the
analyzer. This step produces an AST. ClojureScript's AST is composed
entirely of simple immutable values. Similar to the strategy taken by
many popular JavaScript parsers and compilers, a data oriented
representation means the AST can be manipulated easily without an API
of any kind.

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

A big shoutout to [Shaun LeBron](https://github.com/shaunlebron) and
[Jonathan Boston's](https://github.com/bostonou) work on porting
`clojure.pprint` to ClojureScript so that we can see a pretty-printed
AST.

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

Let's show a less trivial example. The following includes a library
import. Users of bootstrapped ClojureScript have total control how
library names are resolved to actual sources. In this case we've
configured libraries to be fetched via a simple XMLHttpRequest. In
order to expand the macros we must first get the macros file, compile
it, eval it, and then continue to parse, analyze, and compile the
`foo.core` namespace.

<div id="macro-cljs" class="eval-cljs">
   <div class="eval-cljs">
       <div class="cols">
           <div class="left">
               <textarea id="ex4" class="code"></textarea>
           </div>
           <div class="right">    
               <textarea id="ex4-out" class="code"></textarea>
           </div>
       </div>
    </div>
</div>
<div class="eval-ctrl">
    <button id="ex4-run" class="eval">COMPILE</button>
</div>

This example demonstrates not only how pluggable the bootstrapped
compiler is, but how anything compilable by ClojureScript JVM is
compilable by ClojureScript JS.

## Conclusion

There's little doubt that this feature enhancement will create an
avalanche of new innovation. You can already run ClojureScript on your
iPhone with [Mike Fikes'](https://github.com/mfikes)
[Replete](https://github.com/mfikes/replete), build iOS apps with
[React Native](https://github.com/omcljs/ambly/wiki/ClojureScript-React-Native-Quick-Start),
and write fast starting shell scripts with
[Planck](https://github.com/mfikes/planck) or with
[Node.js](https://github.com/kanaka/cljs-bootstrap). Suffice to say
we've only scratched the surface of an iceberg of potential.

To be clear, this is not something you want to use for the traditional
ClojureScript use case - building typical web applications. The output
file starting size is simply too large (~300K gzipped). But there are
now many new reachable targets where this cost is not a constraint as
in the examples previously enumerated.

After something this significant you think we would be done, but
there's a lot more good stuff
coming. [Maria Geller's](https://github.com/MNeise) excellent
JavaScript module work should make it a breeze to integrate the
various module types you find in the wild including the new ES 2015
standard. Further out we're looking into automatically generating
externs where possible.

You have an amazing tool for thought at your fingertips. You can play
with the
[latest goodies today](https://github.com/clojure/clojurescript). As I
said at EuroClojure:

*Keep calm and try to take over the world*.

Happy hacking!

<script type="text/javascript" src="/assets/js/cljs_next/main.js"></script>
