---
layout: post
title: "What's in a Var?"
description: ""
category: 
tags: []
---
{% include JB/setup %}

There are many features that set Clojure apart from other programming
languages but two pretty remarkable ones that don't get much airplay
are [vars](http://clojure.org/vars) and
[metadata](http://clojure.org/metadata). I suspect the reason is
two-fold: there are more obvious benefits and these features don't have
analogous counterparts in popular programming languages rendering them
illegible to many people.

However once you have them their absence in other programming languages
quickly becomes frustrating. Hopefully this post will make their
utility more readily apparent, and for those of you that already use
Clojure, you may be interested to hear that there's now support for
certain forms of var usage in ClojureScript 0.0-2496. More on that
later.

## Metadata

Metadata in Clojure is beautifully simple - it's data *about* data. All
persistent collections in Clojure support metadata. They allow you to
arbitrarily annotate values leaving the value otherwise unchanged:

```clojure
(ns my.cool.program)

(def xs (with-meta [1 2 3] {::created #inst "2014-12-18T00:20:51.337-00:00"})

(println (map inc x)) ;; => (2 3 4)

(println (meta xs)) ;; => {::created #inst "2014-12-18T00:20:51.337-00:00"}
```

Most languages force you to store this information elsewhere. Some
languages like JavaScript support adding arbitrary properties to
existing objects but then you find yourself fretting over the very
real possibility of name clashes and unintended visibility (i.e. during
enumeration).

While adding the above annotation is deliciously devoid of ceremony,
how does this solve the name clash issue? `::created` is a
*namespaced* keyword. The compiler will actually interpret it as
`:my.cool.program/created`. Namespaces are a first class construct for
representing a logical grouping of values and functions (in other
languages think package or module). They are a scoping mechanism.

Let's make this more concrete.

Suppose you write your own program with your own namespace and you
want to use my `xs` value. One way to import it and annotate it might
look like so:

```clojure
(ns your.cool.program
  (:require [my.cool.program :refer [xs]]))

(def ys (vary-meta xs assoc ::created #inst "2014-12-18T00:50:29.859-00:00"))
```

Oops!

Or ... maybe not?

```clojure
(meta ys) ;; {:my.cool.program/created #inst "2014-12-18T00:20:51.337-00:00"
          ;;  :your.cool.program/created #inst "2014-12-18T00:50:29.859-00:00"}
```

## Vars

Whenever you make a top level `def` in Clojure you are introducing a
var into a namespace. Normally you just use the *value* that a var is
bound to:

```clojure
(ns foo.bar)

(defn add [a b]
  (+ a b))

(add 1 2) ;; => 3
```

However you can also get the *reified* var like so:

```clojure
(var add) ;; => #'add
```

Huh.

Doesn't seem very useful.

```clojure
(meta (var add))
;; => {:ns #<Namespace foo.bar>, :name add, :arglists ([a b])
;;     :file "foo/bar.clj", :column 1, :line 3}
```

Boom.

Vars are an incredible powerful direct reflective tool - a considerable
amount of existing Clojure tooling relies on vars to meaningfully reason
about Clojure programs without having to play the tedious Parser/AST
game.

So it's little surprise that Clojure testing frameworks (including the
standard **clojure.test**) use vars to reflect on namespaces to extract
tests and run them.

## Vars for ClojureScript

When Rich Hickey first announced ClojureScript in 2011 one somewhat
controversial decision was the omission of reified vars and
namespaces. This omission was driven by the real world pressure to
deliver compact code to browser based clients.

ClojureScript generates code optimized for the Google Closure
Compiler - by following certain conventions Closure can perform
incredibly aggressive minification and dead code elimination. However
the conventions are quite strict - Closure namespaces are represented
as JavaScript objects where all properties are known at compile time:

```javascript
goog.provide("my.cool.program");

my.cool.program.foo = function(a, b) {
    return a + b;
};
```

This convention more or less throws out the possibility of reified vars
and namespaces, at least not without incurring inefficiencies across
many axes.

The first class nature of vars and namespaces seems impossibly at odds
with the compilation strategy.

Or is it?

Upon closer inspection a surprisingly large amount of Clojure
var usage is in fact of the *static* variety - "Give me the docstring
for this var", or "Give me all the vars in the namespace foo.bar.baz".

It turns out that can we provide a simple mechanism that delivers var
power without full reification.

Starting with ClojureScript 0.0-2496 the following works fine:

```clojure
(ns my.cool.program)

(defn foo [a b]
  (+ a b))

(meta (var foo))
;; => {:ns #<Namespace my.cool.program>, :name add, :arglists ([a b])
;;     :file "my/cool/program.clj", :column 1, :line 3}
```

Wow. What just happened?

The ClojureScript compiler now has explicit handling of the `var`
special form. When it encounters a var expression it emits a `Var`
instance which has all the *compile time* metadata you've come to know
and love in Clojure.

The new cjls.test namespace is built on this functionality and anyone
else can do the same.

Couple this arrival with an evolving stable and simplified
[API](https://github.com/clojure/clojurescript/blob/master/src/clj/cljs/analyzer/api.clj),
ClojureScript now delivers fantastic facilities for user programs to
reflect on static information known to the compiler to enable
incredibly powerful metaprogramming facilities. All this without
sacrificing a compilation model that enables reasonably compact and
efficient JavaScript.

The following is the actual macro to filter out every test in a given
namespace, establish a reporting environment, and run them all. At 14
lines of code this is a pretty solid return on investment:

```clojure
(defmacro test-all-vars
  "Calls test-vars on every var with :test metadata interned in the
  namespace, with fixtures."
  ([[quote ns]]
   `(let [env# (cljs.test/get-current-env)]
      (when (nil? env#)
        (cljs.test/set-env! (cljs.test/empty-env)))
      (cljs.test/test-vars
        [~@(map
             (fn [[k _]]
               `(var ~(symbol (name ns) (name k))))
             (filter
               (fn [[_ v]] (:test v))
               (ana-api/ns-interns ns)))])
      (when (nil? env#)
        (cljs.test/clear-env!)))))
```
