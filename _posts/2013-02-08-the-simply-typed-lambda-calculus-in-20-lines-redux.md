---
layout: post
title: "The Simply Typed Lambda Calculus in 20 Lines Redux"
description: ""
category: 
tags: []
---
{% include JB/setup %}

Thanks to Nada Amin's work, core.logic now supports Nominal Logic
Programming. Now that sounds scary or esoteric - but I'd like to show
in this post how fun Nominal Logic Programming can be. I'm not a
computer scientist, I'm very much interested in informal reasoning
about 

Some time ago on my old blog I showed the simply typed lambda calculus
in core.logic with no explanation. I'd like to revisit that post and
provide a very detail explanation. I thoroughly setting up core.logic
or alphaKanren with your favorite Scheme so that you can follow along.

What follows are the typing rules for the simply typed lambda
calculus. Don't be put off by the notation! We'll explain each typing
rule. You'll see that the notation allows computer scientists to
succinctly express ideas - a way to "see" the code if you will.

Even better, we'll see how you can encode the following rules directly
into a [core.logic](http://github.com/clojure/core.logic), or
alphaKanren program that you can run!

<div>
$$\frac{x: \tau \in \Gamma}{\Gamma \vdash x: \tau}\rlap{(1)}$$
</div>

<div>
$$\frac{\Gamma \vdash e': \tau \to \tau' \qquad \Gamma \vdash e' :
\tau}{\Gamma \vdash e \space e' : \tau'}\rlap{(2)}$$
</div>

<div>
$$\frac{\Gamma, x:\tau \vdash e:\tau' \qquad (x \notin
Dom(\Gamma))}{\Gamma \vdash \lambda x . t : \tau \to \tau'}\rlap{(3)}$$
</div>

<p>
$(1)$ simply states that if some var $x$ with type $t$ exists in the
type context $\Gamma$, then $\Gamma$ implies that $x$ has the type
$\tau$. Clearly then $\Gamma$ will be represented by some associative
data structure that maps vars to their types.
</p>
