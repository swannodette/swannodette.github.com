---
layout: post
title: "CSP is Responsive Design"
description: ""
category: 
tags: []
---
{% include JB/setup %}

<style>
  #post ol {
    position: relative;
    left: 200px;
    font-size: 18px;
    line-height: 1.5em;
    margin: 30px 0 30px 0;
  }
  #resp {
    font-size: 18px;
    text-align: center;
    font-family: Georgia;
    margin: 30px 0;
  }
  .example {
  }
</style>

When architecting user interface components programmers usually engage
in copious amount of
[complecting](http://www.infoq.com/presentations/Simple-Made-Easy). However
we shouldn't be blamed as traditional approaches do not make
the boundaries clear. In the
[last post](http://swannodette.github.io/2013/07/12/communicating-sequential-processes/)
I alluded to the possibility that a [CSP](http://en.wikipedia.org/wiki/CSP) approach might provide
opportunities to pull things apart and that there might be real value
in such a separation of concerns.

I believe there are three main elements not called Model View
Controller nor any other arbitrary variation on that tired old
theme. The trichotomic design I'd like to suggest is far more
fundamental:

  1. Event stream processing
  2. Event stream coordination
  3. Interface representation

When you look at UI components written in good object oriented style
whether in Java, Objective-C, or JavaScript you nearly always find
these three clear and distint aspects complected together. In a
traditional design you would have event stream processing provided by
a base class or mixin. By subclassing you can provide custom interface
representations. When it comes to the most complex and application
specific code - event stream coordination - many well intentioned
components devolve into an
[async mess with made worse by the requisite complex state management](http://github.com/jquery/jquery-ui/blob/master/ui/jquery.ui.autocomplete.js).

Ok, but what value can we derive if we take the time pull these
elements apart?

<div id="resp">
    Responsive design
</div>

Despite Cascading Style Sheets' many flaws, with
[media queries](http://www.w3.org/TR/css3-mediaqueries/) designers can
flexibly address many different clients in an open ended manner -
define your base styles and then override only those parts relevant
for a particular client.

User interface programmers don't have the luxury of CSS for complex
interactions yet are faced with the same rapidly growing heterogenous
population of clients - components written in a traditional style tend
bloat to address this fragmentation or libraries provide incompatible
versions of the same conceptual components like
[this](http://jqueryui.com) and [that](http://jquerymobile.com).

What would it look like to pull apart these concerns? And once we pull
them apart do we actually have a more responsive system?

First let's consider **interface representation**. In order to be
responsive we'd like to make no commitments at all - the only thing we
want to describe is a protocol that different concrete representations
must conform to. In ClojureScript this is simple to express:

```
(defprotocol IUIList
  (-select! [list n])
  (-unselect! [list n]))
```

Done.

We're now free to use any visual representation we please and we'll
see this in a moment.

What about **event stream processing**?

```
(def ex0-events
  (->> (events js/window "keydown")
    (map key-event->keycode)
    (filter SELECTOR_KEYS)
    (map selector-key->keyword)))
```

Again we see the
[reactive](http://reactive-extensions.github.io/RxJS/) approach. We
take the stream of raw key events, map them into key codes, filter
codes that don't correspond to the selection process controls (in this
case up arrow, down arrow, and enter) and then map those into the
messages that the selector process actually listens for: `:next`,
`:previous`, `:clear`, `:select`, or a number. *This is our process
protocol*.

While this may seem strange it's important that the currency of event
coordination is at a more abstract level than concrete events sources
like key presses and mouse movement - this will allow our system to be
responsive. Another benefit that falls out of designing an
abstract stream protocol like is that we don't need to complicate our
program with superflous coordination APIs.

Just to drive the point home one more time - *the selector process
does not care how the stream events are constructed*. They could just
as easily come from a mouse, a finger on a touch screen, a
[Leap Motion](https://www.leapmotion.com/) device, or a Clojure vector
(think testing).

Now what about **event stream coordination**?

```
(defn selector [in list data]
  (let [out (chan)
        changes (chan (sliding-buffer 1))]
    (go (loop [selected ::none]
          (let [v (<! in)]
            (cond
              (= v :select) (do (>! out (nth data selected))
                              (recur selected))
              :else (let [selected (handle-event v selected list)]
                      (>! changes selected)
                      (recur selected))))))
    {:out out
     :changes changes}))
```

`selector` takes three arguments, `in` - an input channel of events,
`list` - a UI rendering target, and `data` - the values represented by
the UI rendering target. We enter a loop with one piece of local
state - the current selected index. We process every event we receive
from `in`. If we receive a `:select` event we write the selected value
to `out`, the output channel. Otherwise we have an event to change the
selection and we side effect the rendering target accordingly.

While some render targets like the DOM might update automagically, if
we're rendering ASCII graphics we need to know when the selection has
changed. Thus we provide another channel `changes` where we write
selection change events. Note that we using a `sliding-buffer`
because we don't want to block on writes to `changes` if there isn't
someone to consume them.

<div id="ex0" class="example">
   <pre id="ex0-ui"></pre>
   <div>
       User selected: <span id="ex0-selected"></span>
   </div>
   <div>
       <input id="csv"></input>
       <button>Send</button>
   </div>
</div>

Our UI in this case will be a JavaScript array of strings. This is to
illustrate that our selector process could be used just as well for a
text adventure game. We can then construct a selector process with
`ex0-events`, the array, and a vector representing the actual data
represented by the user interface.

```
(def ex0-ui (array "  one" "  two" "  three"))

(def ex0-c (selector ex0-events ex0-ui ["one" "two" "three"]))

(go (while true
      (.log js/console (<! ex0-c)))))
```

I've found that even with the rising popularity of
[Go](http://golang.org), many people aren't familiar with designing
systems from the CSP perspective so we'll move at a relaxed pace
in this post. Instead of considering an entire autocompletion
component, we'll instead look at just one piece - the drop down
menu. We'll discuss the full component in a later post.
