---
layout: post
title: "The Simply Typed Lambda Calculus in 20 Lines Redux"
description: ""
category: 
tags: []
---
{% include JB/setup %}

Some time ago on my old blog I showed the simply typed lambda calculus
in core.logic with no explanation based on some Prolog code I found on
StackOverflow. I'd like to revisit that meager post with a much more
detailed exposition of the ideas behind that code. I recommend setting
up [core.logic]() with [Clojure](http://clojure.org) or $\alpha$Kanren
with your favorite Scheme (I like [Petite Chez](http://scheme.com)) so that
you can follow along where relevant.

Thanks to [Nada Amin's](http://github.com/namin) work, core.logic now
supports [Nominal Logic Programming](http://arxiv.org/abs/cs/0609062)
(Cheney & Urban). Now that may sound scary or esoteric to the working
programmer - but I'd like to show in the next series of posts how fun
Nominal Logic Programming can be.

I first encountered Nominal Logic Programming in Will Byrd's
excellent
[dissertation](https://scholarworks.iu.edu/dspace/bitstream/handle/2022/8777/Byrd_indiana_0093A_10344.pdf)
on [miniKanren](http://minikanren.org). Will, being a proper computer
scientist and expecting (reasonably) that the dissertation would be read by
other proper computer scientists, simply references the Cheney &
Urban work. Being an undisciplined not computer scientist, I didn't
bother to follow the reference so the section
on $\alpha$Kanren largely went over my head at the time.

It wasn't until after Nada Amin started work on adding $\alpha$Kanren
capabilities to core.logic that I bothered to read the Cheney & Urban
paper. What I found was an incredibly powerful tool for informal
reasoning about theoretical computer science. For me it made
theoretical computer science tangible, and I hope these series of posts
can do the same for the reader.

I would like to show how we can take the typing rules for the simply
typed lambda calculus and encode them directly into a program. Once
done, we will also have a **type inferencer** as well as **term
inhabitation**. Don't worry if you don't know what these words mean
yet, we'll get to them. If you've ever seen Dan & Will do one of their
presentations on miniKanren these posts will cover similar territory
but at a much slower pace.

What follows are the typing rules for the simply typed lambda
calculus. Don't be put off by the notation! We'll explain each typing
rule. You'll see that the notation allows computer scientists to
succinctly communicate ideas - a way to "see" the code if you will.

Without further ado:

<div>
$$\frac{x: \tau \in \Gamma}{\Gamma \vdash x: \tau}\rlap{(1)}$$
</div>

<div>
$$\frac{\Gamma \vdash e : \tau \to \tau' \qquad \Gamma \vdash e' :
\tau}{\Gamma \vdash e \space e' : \tau'}\rlap{(2)}$$
</div>

<div>
$$\frac{\Gamma, x:\tau \vdash e:\tau' \qquad (x \notin
Dom(\Gamma))}{\Gamma \vdash \lambda x . e : \tau \to \tau'}\rlap{(3)}$$
</div>

$(1)$ simply states that if some var $x$ with type $\tau$ exists in the
type context $\Gamma$, then $\Gamma$ implies that $x$ has the type
$\tau$. Clearly then $\Gamma$ will be represented by some associative
data structure that maps vars to their types. We can and will
represent the type context as a list of pairs.

$(2)$ states that if some valid expression $e$ in our language has the
type $\tau \to \tau'$ (arrow types are functions!) and some valid
expression $e'$ has the type $\tau$ then the result of the application
of $e$ to $e'$ has the type $\tau'$. We could imagine writing a
function $\mathtt{even?}$, clearly this function has type
$\mathtt{Int} \to \mathtt{Bool}$. So if we pass $\mathtt{2}$ to
$\mathtt{even?}$ we know we're going to get $\mathtt{True}$ or
$\mathtt{False}$ back.

Finally $(3)$ states that if the var $x$ (which has type $\tau$) is
not already in $\Gamma$, that is, it is **free**, and we have some
expression $e$ of type $\tau'$ then the expression $\lambda x . e$ has
the type $\tau \to \tau'$. Remember $\lambda$ here just denotes a
function which takes one argument $x$ and whose body is some
expression $e$ in our language. You may have noticed we haven't
talked precisely about what valid expressions are in our language,
we'll talk about this in a later post.

You may be scratching your head at the term **free**. Every working
programming has an intuitive notion of **scope**, regardless of the particular
scoping rules a programming language may have. In many popular
languages these days, it's understood that the arguments to a method
or function are **bound** within the body or method of the
function.

To drive the point home a little more here is a snippet of JavaScript
illustrating the idea:

<pre>
// x is free in this function
function() {
  return x;
}
 
// x is bound in this function
function(x) {
  return x + 1;
}
</pre>

Hopefully this makes $(3)$ more clear.

So $\lambda x . e$ is a subtle point! Not only does it communicate the
notion of a function, it also communicates that $x$ is *bound* in the
expression $e$. This is essential information which we will need to
handle properly and we'll see how Nominal Logic Programming gives us
the tools for doing so.

Hopefully this post has honed your informal understanding of the
typing rules for the simply typed lambda calculus. Stay tuned, the
real fun is yet to come!
