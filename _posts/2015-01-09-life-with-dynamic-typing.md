---
layout: post
title: "Life with Dynamic Typing"
description: ""
category: 
tags: []
---
{% include JB/setup %}

As with many things in the realm of Computer, some choices involve big
tradeoffs. One of these is choosing to write software with a dynamic
programming language. Having built some interesting and impactful user
facing applications for many interesting companies over the years I
can say with confidence that I personally enjoy and in many cases
prefer the flexibility afforded by dynamic typing. However unlike some
worshippers at the altar of Dynamism I don my **Cap of Discernment
+1** and admit:

```
                             Not everything is awesome.
                                  - Rich Hickey
```

Well engineered non-trivial systems written in dynamic languages
embrace runtime assertions especially near public interfaces. For
example here's a snippet of code from React.js that does exactly
that:

```js
  _renderValidatedComponent: function() {
    /* ... */
    invariant(
      renderedComponent === null || renderedComponent === false ||
      ReactElement.isValidElement(renderedComponent),
      '%s.render(): A valid ReactComponent must be returned. You may have ' +
        'returned undefined, an array or some other invalid object.',
      inst.constructor.displayName || 'ReactCompositeComponent'
    );
    return renderedComponent;
  },
```

Embracing assertions means a significantly more pleasant
experience for newcomer and expert alike. While the learned can wax
poetic for days about the utility of strong types for program design,
the immediate benefit of stronger types is simply catching errors
sooner and closer to the source of the problem! *Well placed* runtime
assertions deliver precisely the same benefit.

As the above React.js assertion alludes, asserting function arguments
and return values yields the most bang for the buck.

ClojureScript like Clojure has direct support for this pattern in the
form of `:pre` and `:post` conditions. This is yet another
[old good idea](http://en.wikipedia.org/wiki/Design_by_contract).

Here's an example from Om 0.8.0. The `get-props` helper validates
that its argument is a valid Om component:

```clj
(defn get-props
  "Given an owning Pure node return the Om props. Analogous to React
   component props."
  ([x]
   {:pre [(component? x)]}
   (aget (.-props x) "__om_cursor"))
  ([x korks]
   {:pre [(component? x)]}
   (let [korks (if (sequential? korks) korks [korks])]
     (cond-> (aget (.-props x) "__om_cursor")
       (seq korks) (get-in korks)))))
```

`:pre` takes a vector of arbitrary predicate expressions, they must all
return a truthy value otherwise the program will crash.

`:post` conditions are similarly useful. For example it's a common
pattern to declare a protocol that other users can extend. This permits
the design of pluggable systems - the idea is little different from
Java interfaces, Go interfaces, Objective-C protocols, Haskell
typeclasses etc.

```clj
(defprotocol IReturnEven
  (-return-even [x]))
```

One useful pattern to pair with this - provide a common entry point:

```clj
(defn return-even [x]
  (-return-even x)
```

The benefit of the common entry point is that implementers can focus
on their logic and the common entry point can provide shared assertion
checking:

```clj
(defn return-even [x]
  {:pre  [(number? x)] 
   :post even?}
  (-return-even x)
```

Now people that want to extend your system will get early errors when
their implementations fail to pass the assertion.

Of course you may need to place an assertion in some arbitrary
location in your program. In ClojureScript `assert` satisifies this
role. In fact `:pre` and `:post` are just sugar for automatically
generating `assert`s.

## Elision

```
      LISP programmers know the value of everything and the cost of nothing. 
                                 - Alan Perlis
       
```

The problem with good invariant checking is that it often comes with a
runtime cost. React.js actually elides `invariant` from production
builds (**Update:** Scott Feeney
[clarified this](https://twitter.com/graue/status/553833079865749504),
React.js does not actually elide the logic, just the strings). If
you're a JavaScript developer this is yet another reason why a build
step might not be a bad idea.

All ClojureScript developers again have a leg up - simply provide
`:elide-asserts true` to your production build config and be on your
merry way.

## Conclusion

`:pre` and `:post` conditions are a simple way to provide faster
failures for simpler reasoning about dynamic programs. They also work
quite nicely as an extended form of documentation about the intent of
the program.

As always it's important to use this feature with moderation, don't
forget to don your own **Cap of Discernment +1**.

Happy hacking!
