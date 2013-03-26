---
layout: post
title: "STLC Redux: Part II"
description: ""
category: 
tags: ["lambda calculus", "types"]
---
{% include JB/setup %}

[Clojure/West](http://clojurewest.org) was a blast and I'm happy that
Michael Fogus's joke became a
[reality](http://blog.fogus.me/2013/02/20/confo/) with 140+
attendees. All the presentations were great, in particular I enjoyed
[Adam Foltzer's](http://twitter.com/acfoltzer) talk on implementing a
logic programming system in Haskell,
[Ryan Senior's](http://twitter.com/objcmdo) tutorial on the new
finite domain functionality in core.logic, and of course Dan Friedman
and Will Byrd's relational
[CESK machine](http://matt.might.net/articles/cesk-machines/).

[Nada Amin's](http://twitter.com/nadamin) talk on
[nominal logic programming](http://arxiv.org/abs/cs/0609062) was
stellar but I think it may have seemed a bit too far into the deep end
for some of the attendees. In this post I'd like to explain some of
the interesting bits of her talk at a much slower pace. I hope you'll
see that nominal logic programming is really a simple idea in the end.

Whether we know it or not, when we use a functional programming
language we benefit heavily from the formalism of the lambda calculus
(now would be a good time to re-read
 [my earlier post](http://swannodette.github.com/Nominal%20Logic/2013/02/08/the-simply-typed-lambda-calculus-in-20-lines-redux/)). We're
going to go further by actually *running* bits of the formalism. I recommend cloning
[Nada's talk repo](http://github.com/namin/minikanren-confo/) firing
up your favorite REPL, and we'll step through it together.

Again the idea here is to build up an informal understanding (which is
all I have to offer anyway ;)

Let's look at the very first example:

<pre>
(run* [q]
  (nom/fresh [a b]
    (== (lam a a) (lam b b))))
</pre>

If you've used miniKanren or core.logic before you may notice that we
seem to have a new primitive `nom/fresh`. This primitive is similar to
`fresh` but instead of creating fresh logic variables, it creates
fresh *noms*. What are noms? They are like identifiers/names in
programming languages. What they buy us over traditional logic
variables is that we can use them to reason about scope.

But before we get into scope let's break down what the program above
means. If we were to write this in a more standard notation we might
write it in following manner:

<div>
$$\lambda a.a \equiv_{\alpha} \, \lambda b.b$$
</div>

Testing functions for equality is tricky business, however we can
overload unification in the core.logic program above to mean a
more limited form of function equality - up to alpha equivalence.

By
[alpha equivalence](http://en.wikipedia.org/wiki/Lambda_calculus#Alpha_equivalence)
we simply mean that the two lambda terms are equal up to the names - we
can see here the names (or *noms*) don't really matter.

In fact if we run this example, and I recommend that you do, we'll get
back $\_$$_0$, meaning that this set of constraints is
satisfiable!

Now consider the following example:

<pre>
(run* [q]
  (nom/fresh [a b c]
    (== (lam a a) (lam b c))))
</pre>

Will this work? No.

$\mathtt{c}$ occurs *free* in the second lambda expression. We don't
know where that $\mathtt{c}$ comes from, so these terms can't possibly
represent the same thing. Thus:

<div>
$$\lambda a.a \not\equiv_{\alpha} \, \lambda b.c$$
</div>

If we run the program above we'll get the expected dreaded empty list
which lets us know the constraints cannot be satisfied.

Let's break this down further, $\mathtt{lam}$ is actually hiding away the
nominal logic programming primitives, if we dig in we'll see that it
is defined in the following manner:

<pre>
(defn lam [x e]
  `(~'fn ~(nom/tie x e)))
</pre>

It just takes two values, a nom and an expression. It then constructs a
Clojure sequence which which starts with the symbol
$\mathtt{fn}$. This is just to ensure that the output is comprehensible
and importantly - executable Clojure code. The body of the function is
something we haven't see before $\mathtt{nom/tie}$.

$\mathtt{nom/tie}$ takes a nom and an expression and it *constructs a
scope*. In this scope, the nom $\mathtt{x}$ will be bound! This is
precisely what we need.

In the next posts we'll start translating the paper
ideas of the first post into *runnable* ideas.
