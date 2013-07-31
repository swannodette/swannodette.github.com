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
opportunities to pull things apart and that there might be some real value
to derive from such a separation of concerns.

When designing user interface components we should always tease apart
three critical pieces of any UI component:

  1. Event stream processing
  2. Event stream coordination
  3. User interface updates

When you look at most widgets written in good object oriented style
you find these three distint aspects complected together. But is there
any point to actually pulling them apart?

<div id="resp">
    Responsive design
</div>

Despite its many flaws, with
[media queries](http://www.w3.org/TR/css3-mediaqueries/) Cascading
Style Sheets allow designers to flexibly address many different
clients - define your base styles and then override only
those parts relevant for a particular client.

But what about user interfaces? User interface programmers are now
faced with an ever growing number of clients with different
capabilities - components either bloat to address client fragmentation
or you provide incompatible versions of the same components like
[this](http://jqueryui.com) and [that](http://jquerymobile.com).

What would it look like to pull apart these concerns?

First let's consider **3**:

```
(defprotocol IUIList
  (-select! [list n])
  (-unselect! [list n]))
```

That's it.

We don't really care about the rendering of list item selection beyond
these two methods. This means we are free to use any visual
representation we please and we'll see this in a moment.

What about **1**?

```
(def ex0-events
  (->> (events js/window "keydown")
    (map key-event->keycode)
    (filter SELECTOR_KEYS)
    (map selector-key->keyword)))
```

We take the stream of key events, map them into key codes, filter keys
that don't correspond to the selection process controls (in this case
the up arrow, down arrow, and enter) and then map them into the
messages that the selector process actually listens for: `:next`,
`:previous`, `:clear`, `:select`, or a number.

The previous point is extremely important - *the selector process does
not care how the stream events are constructed*. They could just as
easily come from a mouse, a finger on a touch screen, a [Leap
Motion](https://www.leapmotion.com/) device, or a Clojure vector
(think testing).

Now what about **2**?

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

`selector` takes three arguments, `in` a input channel of events,
`list` a UI rendering target, and `data` the values represented by the
UI rendering target. We enter a loop with one piece of local state -
the current selected index. We process every event we receive from
`in`. If we receive a `:select` event we write the selected value to
`out`, the output channel. Otherwise we have either a keyword event to
change the selection or a number to set the selection directly and we
update the selector state and the UI rendering target accordingly.

While some render targets like the DOM might update automagically, if
we're rendering ASCII graphics we need to know when the selection has
changed. Thus we provide another channel `changes` where we write
selection change events. Note that we using a `sliding-buffer`, this
because we don't want to block on channel write if there doesn't
happen to be a consumer.

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
