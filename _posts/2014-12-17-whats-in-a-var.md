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
are [Vars](http://clojure.org/vars) and
[Metadata](http://clojure.org/metadata). I suspect the reason is
two-fold: there are more obvious benefits and these features don't have
analogous counterparts in popular programming languages rendering them
illegible to many people.

However once you have them their absence in other programming languages
quickly becomes frustrating. Hopefully this post will make their
utility more readily apparent, and for those of you that already use
Clojure, you may be interested to hear that there's now support for
certain forms of Var usage in ClojureScript 0.0-2496. More on that
later.

## Metadata

Metadata in Clojure is beautiful simple - it's data *about* data. All
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
languages think Package or Module). They are a scoping mechanism.

Let's make this more concrete.

Suppose you write your own program with your own Namespace and you
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
Var into a Namespace. Normally you just use *value* that a Var is
bound to:

```clojure
(ns foo.bar)

(defn add [a b]
  (+ a b))

(add 1 2) ;; => 3
```

However you can also get the *reified* Var like so:

```clojure
(var add) ;; => #'add
```

Huh.

Doesn't seem very useful.

```clojure
(meta (var add))
;; {:ns #<Namespace foo.bar>, :name add, :file "foo/bar.clj", :column 1, :line 3}
```

Boom.

Vars are an incredible powerful direct reflective tool - a considerable
amount of existing Clojure tooling relies on Vars to meaningful reason
about Clojure programs without having to play the tedious Parser/AST
game.

So it's little surprise that Clojure testing frameworks (including the
standard **clojure.test**) use Vars to reflect on Namespaces to extract
tests and run them.

## cljs.test


