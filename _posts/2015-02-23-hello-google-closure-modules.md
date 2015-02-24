---
layout: post
title: "Hello Google Closure Modules"
description: ""
category: 
tags: []
---
{% include JB/setup %}

By now you may have heard some buzz about
[webpack](http://webpack.github.io), a tool for managing web
application assets. webpack can manage images and stylesheets, but
only the facilities for managing JavaScript sources and more
specifically the facilities for *code-splitting* are of interest to us
in this post. We'll briefly look at webpack's support for splitting
and compare it to a little known feature of the
[Google Closure Compiler](https://developers.google.com/closure/compiler/):
Google Closure Modules.

webpack describes its support for code-splitting
[here](https://github.com/webpack/docs/wiki/code-splitting). It's
clear without reading the entire page that the unit of modularity that
webpack operates on is a code module that was written by an actual
human being. Splitting happens on explicit code module dependencies
expressed in the source itself. webpack presents various knobs to
control how chunking of the split occurs because modules written by
humans are actually a terrible unit of modularity when it comes to
optimizing the production artifact. I've already talked about this
from a different angle
[elsewhere](http://swannodette.github.io/2015/01/06/the-false-promise-of-javascript-microlibs/).

Google Closure Modules maintains the simple Closure Compiler
philosophy: don't let a human do anything a computer can do for
you. Code splits are not defined in the source code and the modules
you end up with may have nothing to do with the modules you actually
wrote. This is a good thing. Closure Compiler may freely *move code
between the modules* you wrote to get optimized modules that you would
have never written by hand that contain precisely what is needed.

## Code Motion

Google searching for **code motion** will probably lead you to the
Wikipedia article on
[Loop-invariant code motion](http://en.wikipedia.org/wiki/Loop-invariant_code_motion). The
idea is simple, by moving code without changing the semantics of the
program you can get an optimal result. In our case it isn't faster
loops but *smaller* modules (and faster page loads).

[ClojureScript](https://github.com/clojure/clojurescript) now has full
support for Google Closure Modules. Let's see how it works out in
practice. 

Imagine we have the following namespace in ClojureScript
that we want load on some page of our application:

```clj 
(ns hello-world.foo
  (:require-macros [cljs.core.async.macros :refer [go]])
  (:require [cljs.core.async :refer [timeout chan >! <!]]))

(enable-console-print!)

(def c (chan))

(go
  (<! (timeout 1000))
  (println "Hello world!"))

(go
  (<! c)
  (println "Goodbye!"))

(go
  (>! c :knock))
```

This namespace has a dependency on
[core.async](https://github.com/clojure/core.async), a large-ish
ClojureScript library (~2000 lines).

Now lets imagine another namespace that we would like to load:

```clj
(ns hello-world.bar)

(enable-console-print!)

(println "Hello world from module bar!")
```

We'd like split our application into three pieces, the shared bit, the
bit for `hello-world.foo` and the bit for `hello-world.bar`. So in
our `project.clj` file we would define a `:modules` entry like so:

```clj
{
  ...
  :modules {:foo {:output-to "out/foo.js"
                  :entries #{hello-world.foo}}
            :bar {:output-to "out/bar.js"
                  :entries #{hello-world.bar}}}
}           
```

Notice that we don't need to specify the shared module. The ClojureScript
compiler will automatically move any namespace not explicitly placed
into a module into the shared module.

This sounds like a disaster but Google Closure Compiler will employ *cross
module code motion* to ensure these modules only get the code they
need. In fact we would hope that anything from core.async that wasn't
dead code eliminated got *moved* into `hello-world.foo`.

Running Closure advanced compilation with pretty-printing and human
readable names shows this is in fact the case.

This is the entire file `bar.js` which *does not* depend on core.async:

```js
$cljs$core$enable_console_print_BANG_$$();
$cljs$core$println$$.$cljs$core$IFn$_invoke$arity$variadic$(
    $cljs$core$array_seq$$(["Hello world from module bar!"], 0)
);
```

And this is a snippet of `foo.js` which *does* depend on core.async:

```js
var $cljs$core$async$impl$ioc_helpers$t23998$$ ...
function $cljs$core$async$impl$protocols$active_QMARK_$$($h$$128$$) {
    if ($h$$128$$ ? ...) {
        return!0;
    }
    ...    
}
...    
```

As predicted core.async got moved into `foo.js`!

The final gzipped sizes of the modules for the example above:

* cljs_base.js, 22K
* foo.js, 3K
* bar.js, 0.04K

For large ClojureScript applications I think it's an understatement to
say that this is a "game changer".

I'd like to thank Thomas Heller for his work incorporating Google
Closure Modules into his
[shadow-build](https://github.com/thheller/shadow-build) project. He provided
a lot of inspiration and rationale that inspired me to land this
functionality into ClojureScript itself.

For more details on actual usage checkout the
[ClojureScript wiki](https://github.com/clojure/clojurescript/wiki/Compiler-Options#modules).

Happy hacking!
