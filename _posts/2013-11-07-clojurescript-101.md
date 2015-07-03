---
layout: post
title: "ClojureScript 101"
description: ""
category: 
tags: ["clojurescript", "core.async"]
---
{% include JB/setup %}

While none of the ideas in
[core.async](http://github.com/clojure/core.async) are new,
understanding how to solve problems with
[CSP](http://en.wikipedia.org/wiki/Communicating_sequential_processes)
is simply not as well documented as using plain callbacks or
[Promises](http://promises-aplus.github.io/promises-spec/). My
previous posts have mostly explored fairly sophisticated uses of
**core.async**, this post instead takes the form of a very basic
tutorial on using **core.async** with
[ClojureScript](http://github.com/clojure/clojurescript).

We're going to demonstrate all the steps required to build a simple
search interface and we'll see how **core.async** provides some unique
solutions to problems common to client side user interface
programming.

I recommend using Google Chrome so that you can get good
[source map](http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/)
support. You don't need Emacs to have fun with
Lisp. [SublimeText 2](http://www.sublimetext.com/2) is pretty nice
these days, I recommend installing the
[paredit](http://github.com/odyssomay/paredit) and
[lispindent](http://github.com/odyssomay/sublime-lispindent) packages
via [Sublime Package Control](http://sublime.wbond.net/installation).

If you have [Leiningen](http://github.com/technomancy/leiningen)
installed you can run the following at the command line in whatever
directory you like:

```
lein new mies async-tut1
```

This will create a template project so you don't have to worry about
configuring `lein-cljsbuild` yourself.

Unless otherwise noted files are relative to the project directory.

Change the `:dependencies` in the `project.clj` file to look like the following:

```
:dependencies [[org.clojure/clojure "1.5.1"]
               [org.clojure/clojurescript "0.0-2030"]
               [org.clojure/core.async "0.1.256.0-1bf8cf-alpha"]] ;; ADD
```

In the project directory run the following to start the auto compile
process:

```
lein cljsbuild auto async-tut1
```

First off we want to add the following markup to `index.html` before
the first script tag which loads `goog/base.js`:

```html
<input id="query" type="text"></input>
<button id="search">Search</button>
<p id="results"></p>
```

Open `index.html` in Chrome and make sure you see an input field and a text
button.

Now we want to write some code so that we can interact with the
DOM. We want our code to be resilient to browser differences so we'll
use Google Closure to abstract this stuff away as we might with jQuery.

We require `goog.dom` and give it a less annoying alias.
Change the `ns` form in `src/async_tut1/core.cljs` to the following:

```clj
(ns async-tut1.core
  (:require [goog.dom :as dom]))
```

We want to confirm that this will work so let's change the
`console.log` expression so it looks this instead:

```clj
(.log js/console (dom/getElement "query"))
```

Save the file and it should be recompiled instantly. We should be able
refresh the browser and see that a DOM element got printed in the
JavaScript Console (**View > Developer > JavaScript Console**). Remove
this little test snippet after you've confirmed it works.

So far so good.

Now we want a way to deal with the user clicking the mouse. Instead of
just setting up a callback on the button directly we're going to make
the button put the click event onto a **core.async** *channel*.

Let's write a little helper called `listen` that will return a channel
of the events for a particular element and particular event
type. We need to require **core.async** macros and functions. Our
`ns` should now look like the following:

```clj
(ns async-tut1.core
  (:require-macros [cljs.core.async.macros :refer [go]])
  (:require [goog.dom :as dom]
            [goog.events :as events]
            [cljs.core.async :refer [put! chan <!]]))
```

Again we want to abstract away browser quirks so we use `goog.events`
for dealing with that. We include only the **core.async** macros and
functions that we intend to use.

Now we can write our `listen` fn, it looks like this:

```clj
(defn listen [el type]
  (let [out (chan)]
    (events/listen el type
      (fn [e] (put! out e)))
    out))
```

We want to verify our function works as advertised so we check it with
following snippet of code at the end of the file:

```clj
(let [clicks (listen (dom/getElement "search") "click")]
  (go (while true
        (.log js/console (<! clicks)))))
```

Note that we've created what appears to be an infinite loop here, but
actually it's a little state machine. If there are no events to read
from the click channel, the go block will be suspended.

Let's search Wikipedia. Define the basic URL we are going to hit via
[JSONP](http://en.wikipedia.org/wiki/JSONP), put this right after the
`ns` form.

```clj
(def wiki-search-url
  "http://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=")
```

Now we want to make a function that returns a channel for JSONP
results.

We again reach for Google Closure to avoid browser quirks. Make your
`ns` form looking like the following:

```clj
(ns async-tut1.core
  (:require-macros [cljs.core.async.macros :refer [go]])
  (:require [goog.dom :as dom]
            [goog.events :as events]
            [cljs.core.async :refer [<! put! chan]])
  (:import [goog.net Jsonp]
           [goog Uri]))
```

Here we use `:import` so that we can use short names for the
Google Closure constructors.

> **Note:** `:import` is only for this use case, you never use it with
> ClojureScript libraries

Our JSONP helper looks like the following (put it after `listen` in
the file):

```clj
(defn jsonp [uri]
  (let [out (chan)
        req (Jsonp. (Uri. uri))]
    (.send req nil (fn [res] (put! out res)))
    out))
```

This looks pretty straight forward, very similar to `listen`. Let's
write a simple function for constructing a query url:

```clj
(defn query-url [q]
  (str wiki-search-url q))
```

Again lets test this by writing a snippet of code at the bottom of the file.

```clj
(go (.log js/console (<! (jsonp (query-url "cats")))))
```

In the JavaScript Console we should see we got an array of JSON data
back from Wikipedia. Success!

It's time to hook everything together. Remove the test snippet and
replace it with the following:

```clj
(defn user-query []
  (.-value (dom/getElement "query")))

(defn init []
  (let [clicks (listen (dom/getElement "search") "click")]
    (go (while true
          (<! clicks)
          (.log js/console (<! (jsonp (query-url (user-query)))))))))

(init)
```

Try it now, you should be able to write a query in the input field,
click "Search", and see results in the JavaScript Console.

If you've done any JavaScript programming this way of writing the code
should be somewhat surprising - we don't need a callback to work with
button clicks!

Think a bit how this work. When the page loads, `init` will run, the
`go` block will try to read from `clicks`, but there will be nothing
to read so the `go` block becomes suspended. Only when you click on the
button can it proceed at which point we'll run the query and loop
around. The code reads exactly how it would if you didn't have to
consider asynchrony!

Instead of printing to the console we would like to render the results
to the page. Let's do that now, add the following before `init`:

```clj
(defn render-query [results]
  (str
    "<ul>"
    (apply str
      (for [result results]
        (str "<li>" result "</li>")))
    "</ul>"))
```

The usual string concatenation stuff - we use a list comprehension
here just for fun.

Now change `init` to look like the following:

```clj
(defn init []
  (let [clicks (listen (dom/getElement "search") "click")
        results-view (dom/getElement "results")]
    (go (while true
          (<! clicks)
          (let [[_ results] (<! (jsonp (query-url (user-query))))]
            (set! (.-innerHTML results-view) (render-query results)))))))
```

Hopefully this code at this point just makes sense. Notice how we can
use destructuring on the JSON array of Wikipedia results.

A beautiful succinct program! The complete listing follows:

```clj
(ns async-tut1.core
  (:require-macros [cljs.core.async.macros :refer [go]])
  (:require [goog.dom :as dom]
            [goog.events :as events]
            [cljs.core.async :refer [<! put! chan]])
  (:import [goog.net Jsonp]
           [goog Uri]))

(def wiki-search-url
  "http://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=")

(defn listen [el type]
  (let [out (chan)]
    (events/listen el type
      (fn [e] (put! out e)))
    out))

(defn jsonp [uri]
  (let [out (chan)
        req (Jsonp. (Uri. uri))]
    (.send req nil (fn [res] (put! out res)))
    out))

(defn query-url [q]
  (str wiki-search-url q))

(defn user-query []
  (.-value (dom/getElement "query")))

(defn render-query [results]
  (str
    "<ul>"
    (apply str
      (for [result results]
        (str "<li>" result "</li>")))
    "</ul>"))

(defn init []
  (let [clicks (listen (dom/getElement "search") "click")
        results-view (dom/getElement "results")]
    (go (while true
          (<! clicks)
          (let [[_ results] (<! (jsonp (query-url (user-query))))]
            (set! (.-innerHTML results-view) (render-query results)))))))

(init)
```
