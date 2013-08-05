---
layout: post
title: "Communicating Sequential Processes"
description: ""
category: 
tags: ["clojurescript", "csp"]
---
{% include JB/setup %}

<style>
  #ex0 #ex0-out {
    margin-top: 10px;
    font-size: 14px;
    line-height: 1.3em;
  }
  .proc-1 {
    color: #ff6666;
  }
  .proc-2 {
    color: #66ff66;
  }
  .proc-3 {
    color: #6666ff;
  }
  .example {
    position: relative;
    margin-top: 20px;
    height: 200px;
    border: 1px solid #ccc;
    background: #efefef;
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
  }
  .out {
    position: absolute;
    top: 0px;
    bottom: 0px;
    right: 0px;
    left: 0px;
    color: #666;
    text-align: center;
    line-height: 200px;
    font-family: 'Inconsolata', sans-serif; font-size: 72px;
  }
  #ex4 {
    height: 100px;
    text-align: center;
  }
  #ex4 button:active {
    background-color: #ccc;
  }
  #ex4 button {
    margin-top: 15px;
    font-size: 18px;
    padding: 6px 15px;
    background-color: white;
    border: 1px solid #333;
    cursor: pointer;
    border-radius: 4px;
    -webkit-border-radius: 4px;
    -moz-border-radius: 4px;
  }
  #ex4 #ex4-out {
    margin-top: 20px;
    width: 100%;
    margin-top: 10px;
    font-size: 18px;
    line-height: 1.3em;
    color: #666;
  }
</style>

With the arrival of
[core.async](http://github.com/clojure/core.async),
[ClojureScript](http://github.com/clojure/clojurescript) provides a
powerful advantage over other popular compile to JavaScript languages
like [CoffeeScript](http://coffeescript.org/),
[Dart](http://www.dartlang.org/), and
[TypeScript](http://www.typescriptlang.org/). These languages fail to
address the single largest source of incidental complexity for any
sizeable client side application - concurrency. In my experience no
amount of simple syntactic sugar, class abstraction, or type annotation can
plug this particular geyser of incidental complexity. These languages
offer no tools beyond the weak ones already offered by JavaScript
libraries or JavaScript itself -
[promises](http://github.com/promises-aplus/promises-spec) and
[generators](http://wiki.ecmascript.org/doku.php?id=harmony:generators).

JavaScript promises don't solve the inversion of control problem -
callback hell is unnested but it's still callback hell. ECMAScript 6
generators suffer in various ways from being too simplistic, you need
to manage coordination by hand or provide your own scheduler. You can
[combine generators with promises](http://jlongster.com/A-Study-on-Solving-Callbacks-with-JavaScript-Generators)
but now you're managing two abstractions instead of one (Dart
[appears to suffer from the same dualism](http://api.dartlang.org/docs/releases/latest/dart_async/Stream.html)
but there it's Future/Stream).

Enough rhetoric, let's see how core.async works in practice.

First let's start off with something dramatic (in fact something that
should seem impossible for those familiar with JavaScript). We will
coordinate three independent processes running at three different
speeds via a fourth process which shows the results of the
coordination *without any obvious use of mutation* - only recursion.

```
(def c (chan))

(defn render [q]
  (apply str
    (for [p (reverse q)]
      (str "<div class='proc-" p "'>Process " p "</div>"))))

(go (while true (<! (timeout 250)) (>! c 1)))
(go (while true (<! (timeout 1000)) (>! c 2)))
(go (while true (<! (timeout 1500)) (>! c 3)))

(defn peekn
  "Returns vector of (up to) n items from the end of vector v"
  [v n]
  (if (> (count v) n)
    (subvec v (- (count v) n))
    v))

(let [el  (by-id "ex0")
      out (by-id "ex0-out")]
  (go (loop [q []]
        (set-html out (render q))
        (recur (-> (conj q (<! c)) (peekn 10))))))
```

<div id="ex0" class="example">
    <div id="ex0-out" class="out"></div>
</div>

As expected we see process 1 more often than process 2, and process 2
more often than process 3. It appears that we have independent
processes, we can coordinate them, and there's not a callback in
sight.

If you haven't fallen out of your chair, let's look at some simpler
examples to build up our intuition.

The code snippets in this post may look familiar to fans of
[functional reactive programming](http://reactive-extensions.github.io/RxJS/),
but fear not, we'll get to the good stuff eventually.

The following code convert events on a DOM element into a channel
we can read from:

```
(defn event-chan [el type]
  (let [c (chan)]
    (events/listen el type #(put! c %))
    c))
```

I've intentionally kept the code as simple as possible to limit the amount
of novelty that we need to introduce (nearly everything I will show
can look prettier/shorter either with more higher order channel operations or
a touch of sweetening via macro sugar). `listen` takes a DOM element
and an event type. The event listener callback puts the DOM event into the
channel, since we're not in a `go` block we do this with an async `put!`.

Channels are like the channels found in
[Tony Hoare's Communicating Sequential Processes](http://www.usingcsp.com/cspbook.pdf). The
[Go community](http://golang.org) is visibly enjoying the benefits of
Hoare's abstraction - but of course programming languages have offered
its treasures since the 1980s ([occam-pi](http://en.wikipedia.org/wiki/Occam-),
[Concurrent ML](http://cml.cs.uchicago.edu),
[JCSP](http://www.cs.kent.ac.uk/projects/ofa/jcsp/)). Interestingly both
[Rob Pike](http://swtch.com/~rsc/thread/cws.pdf) and
[John Reppy](http://alleystoughton.us/eXene/1991-ml-workshop.pdf) have
both discussed the applicability of CSP for the coordination of user
interfaces - user interfaces are inherently asynchronous and thus concurrent.

Let's see `listen` in action:

```
(let [el  (by-id "ex1")
      out (by-id "ex1-mouse")
      c   (listen el "mousemove")]
  (go (while true
        (let [e (<! c)]
          (set-html out (str (.-clientX e) ", " (.-clientY e)))))))
```

Mouse over the grey box below:

<div id="ex1" class="example">
    <div id="ex1-mouse" class="out"></div>
</div>

Only in `go` blocks can we appear to read and write synchronously (via
<span class="code">&lt;!</span> and <span class="code">&gt;!</span> respectively) to a
channel. This allows us to fully escape callback hell in our
coordination code.

Note that the above example is showing the position of the mouse in
the element instead of absolute to the document - let's
fix this with our first higher order channel operation `map`,
analogous to Clojure's `map` except this works on channels not sequences:

```
(defn map [f in]
  (let [c (chan)]
    (go (loop []
          (if-let [v (<! in)]
            (do (>! c (f v))
              (recur))
            (close! c))))
    c))
```

`map` takes a function `f` and a channel `in` and returns a new
channel. All the magic happens once again inside the `go` block, we
can read values out of the `in` channel as they appear, apply `f` and
write the result to the channel we returned. This works just as well
for mouse events or asynchronous results from I/O or an
`XMLHttpRequest`.

Let's use `map`:

```
(defn offset [el]
  (fn [e]
    {:x (- (.-pageX e) (.-offsetLeft el))
     :y (- (.-pageY e) (.-offsetTop el))}))

(let [el  (by-id "ex2")
      out (by-id "ex2-mouse")
      c   (map-chan (offset el)
            (event-chan el "mousemove"))]
  (go (loop []
        (let [e (<! c)]
          (set-html out (str (:x e) ", " (:y e)))
          (recur)))))
```

Mouse over the grey box below to confirm that this works:

<div id="ex2" class="example">
    <div id="ex2-mouse" class="out"></div>
</div>

It's important to understand that `go` blocks paired with `loop/recur`
allow us to create *local* event loops. Normally when writing client
side code you are participating in a *global* event loop. As with
global mutable variables, global event loops defy local reasoning. As
JavaScript developers we work around the global event loop by
coordinating through mutable locals or mutable object fields or by
adding coordination methods to our API. With core.async all these
ad-hoc methods disappear because we don't need them.

To further illustrate, let's see the coordination of two different
streams in the *same logical local event loop*.

Say we want to handle both mouse and key events:

```
(let [el   (by-id "ex3")
      outm (by-id "ex3-mouse")
      outk (by-id "ex3-key")
      mc   (map-chan (offset el)
             (event-chan el "mousemove"))
      kc   (event-chan js/window "keyup")]
  (go (loop []
        (let [[v c] (alts! [mc kc])]
          (condp = c
            mc (set-html outm (str (:x v) ", " (:y v)))
            kc (set-html outk (str (.-keyCode v))))
          (recur)))))
```

Make sure the window is focused and mouse over the following grey box
and type at the same time:

<div id="ex3" class="example">
    <div class="out">
        <span id="ex3-mouse"></span> : <span id="ex3-key"></span>
    </div>
</div>

`alts!` gives us non-deterministic choice over multiple streams. We will
read from whichever channel has information. When reading from a
channel `alts!` will return a tuple, the first element is the value
read from the channel and the second element is the channel that was
read from. This allows us to conditionally handle results from different
channels as you can see with our use of `condp`.

Note this is quite different from the usual JavaScript solutions where we
tend to smear our asynchronous handling across the code base.

Let's end with a final dramatic example, we present a port of
[Rob Pike's Go code](http://talks.golang.org/2012/concurrency.slide#50)
that demonstrates parallel search with timeouts:

```
(defn fake-search [kind]
  (fn [c query]
    (go
     (<! (timeout (rand-int 100)))
     (>! c [kind query]))))

(def web1 (fake-search :web1))
(def web2 (fake-search :web2))
(def image1 (fake-search :image1))
(def image2 (fake-search :image2))
(def video1 (fake-search :video1))
(def video2 (fake-search :video2))

(defn fastest [query & replicas]
  (let [c (chan)]
    (doseq [replica replicas]
      (replica c query))
    c))

(defn google [query]
  (let [c (chan)
        t (timeout 80)]
    (go (>! c (<! (fastest query web1 web2))))
    (go (>! c (<! (fastest query image1 image2))))
    (go (>! c (<! (fastest query video1 video2))))
    (go (loop [i 0 ret []]
          (if (= i 3)
            ret
            (recur (inc i) (conj ret (alt! [c t] ([v] v)))))))))

(let [el (by-id "ex4-out")
      c  (event-chan (by-id "search") "click")]
  (go (loop []
        (<! c)
        (set-html el (pr-str (<! (google "clojure"))))
        (recur))))
```

Click the search button below multiple times:

<div id="ex4" class="example">
    <button id="search">Search</button>
    <div id="ex4-out"></div>
</div>

We can run 3 pairs of requests in parallel, choosing the fastest of
each pair. In addition we set a timeout of 80 milliseconds for the
whole process.

Just to drive the point home all of the examples we have covered are
all running at once, including the original process example at the top
of the page.

Still so far we've only seen what I would consider very trivial if
impressive examples. In the next post we'll look at an advanced
example - a non-toy autocompleter input field. We will see core.async's
advantage over traditional object oriented approaches as well
as purely reactive approaches.

<script type="text/javascript" src="/assets/js/csp.js"></script>
