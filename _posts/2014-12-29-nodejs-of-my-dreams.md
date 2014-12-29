---
layout: post
title: "The Node.js REPL of My Dreams"
description: ""
category: 
tags: []
---
{% include JB/setup %}

Clojure has always been about embracing existing mature
platforms. Being on the JVM means tapping into untold person years
poured into battle-tested libraries and access to a vast ecosystem
with powerful [IDEs](https://cursiveclojure.com), incredible
[profiling](http://www.oracle.com/technetwork/java/javaseproducts/mission-control/java-mission-control-1998576.html)
[tools](http://www.yourkit.com), and answers to
[nearly any question imaginable](http://stackoverflow.com/questions/tagged/java).

Similarly ClojureScript brings a hefty helping of Clojure's semantics
to the most important
[platform](http://en.wikipedia.org/wiki/World_Wide_Web) of all. And
thanks to some smart folks 
[rethinking best practices](http://facebook.github.io/react/),
ClojureScript's solid semantics now shine in way that leaves many
JavaScript libraries playing catchup and copycat.

But of course these days the Web isn't the only reason to target
JavaScript - Node.js is another [great](http://aws.amazon.com/lambda/)
[platform](http://www.raspberrypi.org) with
[attractive](https://github.com/atom/atom-shell) properties for
ClojureScript.

ClojureScript actually shipped three and a half years ago with some
promise of Node.js integration but it remained low priority due to the
fact we had a robust technology for writing server side code. But now
that the languages bits of ClojureScript aren't evolving so quickly I
decided it was a time to go back and make good on this promise.

Prior to the latest commits, ClojureScript shipped with only two
REPLs, Rhino and the Browser. These REPLs are unsatisfactory in some simple
ways - the Rhino REPL runs ClojureScript more than 100X slower than modern
JavaScript engines and the Browser REPL requires you to ... start a
browser.

Enter the Node.js REPL!

Without further ado why don't you give it a shot? You just need
to make sure you have Node.js installed.

```
git clone https://github.com/clojure/clojurescript
cd clojurescript
./script/bootstrap
./script/self-compile
npm install source-map-support
```

Now you're ready to run the REPL:

```
./script/noderepljs
```

The first time you launch this REPL it will be a bit slow as we have
to compile the standard library. Subsequent launches will be
faster. There's still some work to do so expect this to improve over
time.

Once you have a REPL up and running try the following session (the Clojure
programmers reading this will probably yell *Hallelujah!*):

Run a simple expression:

```
ClojureScript:cljs.user> (first [1 2 3])
1
```

Get a doc string:

```
ClojureScript:cljs.user> (doc first)
-------------------------
cljs.core/first
([coll])
  Returns the first item in the collection. Calls seq on its
  argument. If coll is nil, returns nil.
  nil
```

Load a library and try it:

```
ClojureScript:cljs.user> (require '[clojure.string :as string])

ClojureScript:cljs.user> (string/join ", " [1 2 3])
"1, 2, 3"
```

Time an expression:

```
ClojureScript:cljs.user> (time (reduce + (range 1000000)))
"Elapsed time: 211 msecs"
499999500000
```

Write a bad program and get a ClojureScript stack trace not
a JavaScript one:

```
ClojureScript:cljs.user> (first (js/Date.))
Error: Mon Dec 29 2014 18:16:00 GMT-0500 (EST) is not ISeqable
    at Object.seq (.../cljs/core.cljs:664:20)
    at first (.../cljs/core.cljs:673:16)
    at repl:1:81
    at repl:9:3
    at Socket.<anonymous> ([stdin]:26:80)
    at Socket.emit (events.js:95:17)
    at Socket.<anonymous> (_stream_readable.js:764:14)
    at Socket.emit (events.js:92:17)
    at emitReadable_ (_stream_readable.js:426:10)
    at emitReadable (_stream_readable.js:422:5)
```

Have fun!
