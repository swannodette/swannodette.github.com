---
layout: post
title: "JavaScript Modularity Shaming"
description: ""
category: 
tags: []
---
{% include JB/setup %}

[Pete Hunt](http://twitter.com) of React fame recently got into an
online discussion about the pros and cons of
[Webpack vs. Browserify](https://gist.github.com/substack/68f8d502be42d5cd4942#comment-1365101).
In the discussion he inadvertently coins a hilarious term for a form
of rhetoric in some circles of the JavaScript community - "Modularity
Shaming". React itself has been on the receiving end of "Modularity
Shaming" due to its relatively large size for a JavaScript dependency,
~37K gzipped.

The wellspring of "Modularity Shaming" is of course the very real need for
JavaScript applications to load quickly. This means trying to decrease
the payload of the application through some obvious approaches like
concatenation and minification. However the very popular combination of jQuery
and Underscore.js alone add up to ~40K gzipped, and of course real
applications need significantly more support than that and we haven't
even gotten to your application code yet!

At this point there are a couple of options - break apart the code and
only use what you need when you need it through asynchronous module
loading. While this works OK for library dependencies, for your
application modules you'll likely as not be fighting race conditions
if you don't exert some discipline. Surmountable for sure, but
certainly not as simple to reason about as a single concatenated file.

The other option is to use smaller dependencies. The problem with this
is that the
[microlib](https://web.archive.org/web/20111214102140/http://momentjs.com/)
of yesterday may very well become the [macrolib](http://momentjs.com) of
tomorrow. The fully internationalized version of moment.js is as big as
jQuery & Underscore.js combined!

There is an alternative solution to this problem that's rarely discussed.

## Dead Code Elimination

For suitably written JavaScript, the
[Google Closure Compiler](https://developers.google.com/closure/compiler/)
to this day defeats all comers in producing compact JavaScript - this
is due to
[Dead Code Elimination](http://en.wikipedia.org/wiki/Dead_code_elimination). Google
long ago decided they would need an incredible amount of JavaScript
functionality across their products so they created
the [Google Closure Libary](https://github.com/google/closure-library). The
code base including all tests is a whopping 300,000 lines of
JavaScript!

Through the magic of Dead Code Elimination if I use just one single
function in this behemoth of a JavaScript library I will only get
the code that's necessary for that one function to do its job.

But just how good is it in practice?

Consider the following ClojureScript program. It includes DateTime
formatting, DateTime arithmetic, and internationalization:

```clj
(ns practice.core
  (:import [goog.date DateTime Interval]
           [goog.i18n DateTimeFormat]))

(def f (DateTimeFormat. "EEEE MMMM d, y"))

(let [week (Interval. nil nil 7)
      dt   (DateTime.)]
  (.add dt week)
  (.log js/console (.format f dt)))
```

If I want this ClojureScript program to emit a DateTime string in
French the total cost of this entire program will be ~4K
gzipped. That's 10X less of a dependency than moment.js with
internationalization.

### Use Google Closure

If you're a ClojureScript developer I highly recommend always first
checking to see if there isn't a
[satisfactory Google Closure module](http://docs.closure-library.googlecode.com/git/index.html)
that will get the job done. Just the
other day I needed a pseudorandom number generator for
[test.check](https://github.com/clojure/test.check), Closure did not
[disappoint](http://docs.closure-library.googlecode.com/git/class_goog_testing_PseudoRandom.html).

In some cases the Google Closure doesn't provide the nicest of APIs or
is poorly documented but it's generally a simple matter to present
a
[lovingly crafted facade](https://github.com/andrewmcveigh/cljs-time). There's
no need to promulgate the disease of
[NIH](http://en.wikipedia.org/wiki/Not_invented_here) you encounter so
often in JavaScript circles.
