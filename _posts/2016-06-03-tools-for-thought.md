---
layout: post
title: "A Tool For Thought"
description: ""
category: 
tags: []
---
{% include JB/setup %}

<img width="590" src="/assets/images/tools.png" />

As [ClojureScript](http://clojurescript.org) nears its fifth birthday
I find myself reflecting on its suitability as a
["tool for thought"](http://www.rheingold.com/texts/tft/). Certainly
reading the
[Structure and Interpretation of Computer Programs](https://mitpress.mit.edu/sicp/full-text/book/book.html)
nearly thirteen years ago painted an ideal image of Lisp as a truly
interactive and tangible approach to computing. That experience
eventually lead me to [Clojure](http://clojure.org) and later
ClojureScript. Now that I use both for the day job, has that wonderful
image of computing that Sussman & Abelson mapped out faded over the
ensuing years?

Certainly looking around we see many compelling new languages with a
client story in the functional space especially of the typed
variety. Some of these are truly new endeavors and others are simply
old faces with JavaScript backends. [Elm](http://elm-lang.org/) is
especially exciting with its principled stance on simplicity and
approachability while delivering on the benefits of static
typing. Whatever your opinions of [Scala](http://www.scala-lang.org/),
many programmers find it a comfortable train ride across the OOP / FP
border and [Scala.js](https://www.scala-js.org/) means you can bring
your experiences to the client. [PureScript](http://purescript.org)
has a strong following in the [Haskell](http://haskell.org)
community and course if you really just want Haskell or OCaml on the
client you have a [few](https://github.com/ghcjs/ghcjs)
[options](http://ocsigen.org/js_of_ocaml/) as well.

But frankly I don't have any interest in any of these initiatives
beyond that of the language geek. For me
[debugging and profiling](https://github.com/clojure/clojurescript/wiki/Source-maps),
[advanced optimization](https://developers.google.com/closure/compiler/),
[IDE support](https://cursive-ide.com/),
[rich](https://www.youtube.com/watch?v=j-kj2qwJa_E)
[tooling](https://github.com/binaryage/cljs-devtools) across
[all](https://github.com/drapanjanas/re-natal)
[desirable](https://github.com/omcljs/ambly) JavaScript targets are
equally important considerations to weigh against static guarantees
when choosing the programming language for clients.

Still I'm not a staunch defender of the dynamic nor the static stance
and I think people with the strong opinions either way are being more
than a bit dishonest to themselves about the realities of industrial
software development. Personally the thing I find most compelling
about statically typed languages is that well designed ones give you a
*tool for thinking*. As [Simon Peyton Jones](http://research.microsoft.com/en-us/people/simonpj/) sez in
[Coders At Work](http://www.codersatwork.com/), it's not about
*correctness* it's about *crispness*.

As a Clojure(Script) programmer I would love to tap into that deep
well of crispness somehow. Unfortunately idiomatic Clojure code
presents many challenges to typing, just ask my buddy
[Ambrose Bonnaire-Sergeant](https://www.youtube.com/watch?v=a0gT0syAXsY).

As
Clojurists we live in a sea of lists, symbols, maps, keywords,
vectors, and sets and some of these structures represent data and
others represent code. I think it's no small part of the attraction of
Lisps that the
[use/mention distinction](https://en.wikipedia.org/wiki/Use-mention_distinction)
becomes at least slightly blurred. The problem as I think many of us
can attest is when things get so blurry you lose your way. This isn't to
say that you can't build big sophisticated programs
in this way, for example, ClojureScript itself:

<img width="590" src="/assets/images/cloc.png" />

And while I'm sure [Kent Dybvig](http://www.cs.indiana.edu/~dyb/)
[is nodding as well](https://github.com/cisco/ChezScheme), we
shouldn't stop wondering if we can't the move the goal post a little
bit closer.

I think
[clojure.spec](https://clojure.org/news/2016/05/23/introducing-clojure-spec)
moves that goal post *a lot closer*.

# clojure.spec

In my humble opinion clojure.spec is the most
[VPRI-worthy](http://www.vpri.org) feature Rich Hickey has shipped
since delivering fast persistent data structure. Yes, yes you now have
[Schema](https://github.com/plumatic/schema) like validations, but
this is but the tip of an iceberg. clojure.spec takes
[Matt Might et. al. Parsing with Derivatives](http://matt.might.net/papers/might2011derivatives.pdf)
and really, really runs with it. By casting validation as fundamentally a
parsing problem (computer science!), we get a wonderfully expressive
language for *crisply describing* our Clojure programs without
changing how we *joyfully write them*.

So instead of thinking about typical application domain examples, lets
instead consider how we might spec our old friend `let`. Intuitively
we know `let` must be made of some obvious basic parts:

```clj
(require '[cljs.spec :as s])

(s/def ::let
  (s/cat
     :name     '#{let}
     :bindings ::bindings
     :forms    (s/seq* identity)))
```

Ah our old friend wishful thinking! How we adore thee. We know the
first part of a `let` expression has to be the symbol `let` (Duh!),
we're ignoring `::bindings` for now, and we know that we'll have zero
or many forms after the bindings. After a some hammocking we give
`::bindings` a go &mdash;

```clj
(s/def ::bindings
  vector?)
```

Voila!

Let's try it:

```clj
(s/conform ::let '(let [x 1] (+ x y)))
;; {:name let, :bindings [x 1], :forms [(+ x y)]}
```

Shazam!

... hmm, actually not so fast.

```clj
(s/conform ::let '(let [x 1 y] (+ x y)))
;; {:name let, :bindings [x 1 y], :forms [(+ x y)]}
```

Ugh. That's not right, `:bindings` must be an even number of forms:

```clj
(s/def ::bindings
  (s/and vector? #(-> % count even?)))
```

Let's try again:

```clj
(s/conform ::let '(let [x 1 y] (+ x y)))
;; :cljs.spec/invalid
```

That's more like it but good tools for thinking should be a little bit
more forthcoming:

```clj
(s/explain ::let '(let [x 1 y] (+ x y)))
;; In: [1] val: [x 1 y] fails spec: 
;;   :om.next.spec/bindings at: [:bindings] predicate:
;;   (-> % count even?)
```

Nice.

```clj
(s/conform ::let '(let [1 y] (+ x y)))
;; {:name let, :bindings [1 y], :forms [(+ x y)]}
```

Ah we're not crisp enough yet. Let's make a `::binding` spec to
control what can appear in the vector:

```clj
(s/def ::binding
  (s/cat
    :name symbol?
    :value identity))
```

That looks right, now let's fix `::bindings` to use it:

```clj
(s/def ::bindings
  (s/and vector?
         #(-> % count even?)
         (s/* ::binding)))
```

Now let's try it:

```clj
(s/conform ::let '(let [y 1] (+ x y)))
;; {:name let, :bindings [{:name y, :value 1}], :forms [(+ x y)]}
```

Yes I am trying to trick you into reimplementing ClojureScript from
scratch.

Obviously we could go further but the above should suffice to show how
much clojure.spec can help when thinking about the shape of the
problem.

# Conclusion

While the Clojurist loves to wax poetic about hammock driven
development, Clojure(Script) *the language* did not offer much in the
way of helping us really work through a design while sitting at a
keyword. Without belittling the power of pencil and paper, the whole
point of a computer is to give us interactive ways of exploring our
thoughts in ways that pencil and paper can't! So I think
clojure.spec gives us a pretty damn nice hammock away from the hammock
and I look forward to hearing more about it from the larger community.

Happy hacking!
