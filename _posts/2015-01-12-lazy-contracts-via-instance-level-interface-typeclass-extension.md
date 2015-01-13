---
layout: post
title: "Lazy Contracts in 30 lines"
description: ""
category: 
tags: []
---
{% include JB/setup %}

## Instance Level Interface (Typeclass) Extension

Once again continuing
[previous lines of thought](http://swannodette.github.io/2015/01/10/faster-validation-through-immutability/)
let's consider validations beyond `:pre` and `:post` conditions. This
time we'll see how ClojureScript's `specify` construct allows us to
trivially build a form of lazy contracts similar to those described by
[Findler et al.](http://citeseerx.ist.psu.edu/viewdoc/summary?doi=10.1.1.124.180).

For some time now ClojureScript has supported extension of individual
values to protocols via `specify`. Again protocols are analogous to
Java interfaces, Go interfaces, Haskell typeclasses, and Objective-C
protocols. Clojure has had protocols since 1.2.0 and they are commonly
leveraged via `extend-type` and `extend-protocol`. However `specify`
is only currently available in ClojureScript as the semantics of
JavaScript and the performance of modern JavaScript engines permit
practical efficient implementation.

Imagine that we to ensure a vector contains only numbers. Fortunately
there are only two ways to get an updated vector, `conj` and
`assoc`. So given an existing vector we simply need to `specify` new
implementations of the `ICollection` and `IVector` protocols. The
only other protocols we care about are those involved in iteration -
for simplicity's sake we're only going to bother with `ISeqable`,
however for completeness you should implement `IReduce` and
`IKVReduce`. They are trivial to do and involve the same simple
delegation approach.

We will provide a function called `add-contract*` that takes 3
arguments: a vector, a Var and a map of source location information
that informs us where the contract was asserted. This is important
for debugging as this allows us to prune our search for where
the contract might have been violated - it had to happen *before*
the contract. In a mutable context this wouldn't be much information
but thanks immutability we can laser in on source of the trouble.

As to why we take a Var for the second argument, the Var holds useful
reflection information if we want to print verbose error messages. We
can also just deref the function from the Var to get the validating
function. A first attempt at `add-contract*` might look like the
following:

```clj
(ns lazy-contracts.core)  

(enable-console-print!)

(defn add-contract*
  ([v cvar src-info] (add-contract* v cvar @cvar src-info))
  ([v cvar f src-info]
   (specify v
     ISeqable
     (-seq [_]
       (map #(do (assert (f %)) %) v))
     ICollection
     (-conj [this x]
       (assert (f x))
       (add-contract* (-conj v x) f src-info))
     IVector
     (-assoc-n [this i x]
       (assert (f x))
       (add-contract* (-assoc-n v i x) cvar f src-info)))))
```

This won't be very fun to use since the assertion doesn't
print an informative string. Let's fix that by adding
`contract-fail-str`:

```clj
(defn contract-fail-str [x {:keys [ns name]} src-info]
  (str x " fails vector contract " (symbol (str ns) (str name))
         " specified at " (:file src-info) ":" (:line src-info)))
```

Now let's rewrite `add-contract*`:

```clj
(defn add-contract*
  ([v cvar src-info] (add-contract* v cvar @cvar src-info))
  ([v cvar f src-info]
   (specify v
     ISeqable
     (-seq [_]
       (map #(do (assert (f %) (contract-fail-str % (meta cvar) src-info)) %) v))
     ICollection
     (-conj [this x]
       (assert (f x) (contract-fail-str x (meta cvar) src-info))
       (add-contract* (-conj v x) f src-info))
     IVector
     (-assoc-n [this i x]
       (assert (f x) (contract-fail-str x (meta cvar) src-info))
       (add-contract* (-assoc-n v i x) cvar f src-info)))))
```

Much nicer!

Now the only problem is providing source location
information. Fortunately this trivial through a little macro sugar:

In a `lazy-contract.core` macro file we write the following:

```clj
(ns blog.contracts.core)

(defmacro add-contract [v cvar]
  (let [m (meta &form)]
    `(blog.contracts.core/add-contract*
       ~v ~cvar ~(select-keys m [:file :line]))))
```

That's it!

Now we can start a REPL and try to create a contract constrained
vector:

```
ClojureScript:cljs.user> (c/add-contract [2 4 6] #'even?)
[2 4 6]
```

This works fine. But if we try this we'll get a sensible error:

```
ClojureScript:cljs.user> (conj (c/add-contract [2 4 6] #'even?) 7)
Error: Assert failed: 7 fails vector contract cljs.core/even? ...
```

Voila!

We'll also a sensible error even in simple cases like this:

```cjl
ClojureScript:cljs.user> (c/add-contract [1 2 3] #'even?)
Error: Assert failed: 1 fails vector contract cljs.core/even?
```

This is because printing needs to traverse the vector!

In a real program if contract fails the error will always
tell you precisely where the contract was asserted.

Of the course the above could benefit from generalization but we
already have a powerful lazy contract system without bothering
with wrappers or having to dig into the implementation of any of
the core data structures.

With very little effort ClojureScript programs can benefit from
some of the most powerful forms of runtime validation with provenance
available to dynamic programming languages today.

Happy hacking!