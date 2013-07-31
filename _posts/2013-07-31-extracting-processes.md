---
layout: post
title: "Extracting Processes"
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
you find these three aspects merged together into one logical
component. What advantage is there to pulling these apart?

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
or you provide two versions of the same components like
[this](http://jqueryui.com) and [that](http://jquerymobile.com).

What would it look like to pull apart these concerns? First let's
consider **3**:

```
(defprotocol IUIList
  (-select! [list n])
  (-unselect! [list n]))
```

That's it.

We don't really care about the rendering of list item selection beyond
these two methods. This means we are free to use any visual
representation we please - and in fact we'll demonstrate this by
rendering text based lists.

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
messages that the selector process actually listens for - `:next`,
`:previous`, `:clear`, `:select`, or a number.

The previous point is extremely important - *the selector process does
not care how the stream events are constructed*. They could just as
easily come from a mouse, a ClojureScript vector or a [Leap
Motion](https://www.leapmotion.com/) device.

Our UI in this case will be a JavaScript array of strings. This is to
illustrate that our selector process could be used just as well for a
text adventure game. We can then construct a selector process with
`ex0-events`, the array, and a vector representing the actual data
represented by the user interface.

```
(def ui (array "  one" "  two" "  three"))

(def c (selector ex0-events list ["one" "two" "three"]))

(go (while true
      (.log js/console (<! c)))))
```

```
(defn selector [in list data]
  (let [out (chan)]
    (go
      (loop [selected ::none]
        (let [v (<! in)]
          (cond
            (nil? v) :ok
            (= v :select) (do (>! out (nth data selected))
                            (recur selected))
            :else (do (when (number? selected)
                        (-unselect! list selected))
                    (if (= v :out)
                      (recur ::none)
                      (let [n (if (number? v) v (select list selected v))]
                        (-select! list n)
                        (recur n))))))))
    out))
```

I've found that even with the rising popularity of
[Go](http://golang.org), many people aren't familiar with designing
systems from the CSP perspective so we'll move at a relaxed pace
in this post. Instead of considering an entire autocompletion
component, we'll instead look at just one piece - the drop down
menu. We'll discuss the full component in a later post.
