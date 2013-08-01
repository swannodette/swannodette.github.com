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
  #post #ex0 {
    height: 90px;
    background-color: #efefef;
    border: none;
    padding-top: 20px;
  }
  #post #ex1 {
    height: 110px;
    background-color: #efefef;
    border: none;
    padding-top: 20px;
  }
  #post .example pre {
    background-color: transparent;
    position: relative;
    left: 200px;
    font-size: 18px;
  }
  #post #ex2 {
    height: 150px;
    background-color: #efefef;
    border: none;
    padding-top: 20px;
  }
  #post #ex2 ul {
    position: relative;
    background: white;
    width: 170px;
    left: 190px;
    border: 1px solid #ccc;
    border-radius: 4px;
    -webkit-border-radius: 4px;
    -moz-border-radius: 4px;
  }
  #post #ex2 li {
    cursor: pointer;
    list-style: none;
    padding: 4px 4px 4px 8px;
    border-bottom: 1px solid #ccc;
  }
  #post #ex2 li.highlighted {
    background-color: #ccccff;
  }
  #post #ex2 li.selected {
    background-color: #ffcccc;
  }
  #post #ex2 li.highlighted.selected {
    background-color: #ffccff;
  }
</style>

When architecting user interface components programmers usually engage
in copious amounts of
[complecting](http://www.infoq.com/presentations/Simple-Made-Easy). However
we shouldn't be blamed as traditional approaches do not make
the boundaries clear. In the
[last post](http://swannodette.github.io/2013/07/12/communicating-sequential-processes/)
I alluded to the possibility that [CSP](http://en.wikipedia.org/wiki/Communicating_sequential_processes) provides
opportunities to pull things apart and that there might be real value
in such a separation of concerns.

I believe there are three main elements not called Model View
Controller (nor any other arbitrary variation on that tired old
theme). The trichotomic design I'd like to suggest is more
fundamental:

  1. Event stream processing
  2. Event stream coordination
  3. Interface representation

When you look at UI components written in good object oriented style
whether in Java, Objective-C, or JavaScript you nearly always find
these three clear and distinct aspects complected together. In a
traditional design you would have event stream processing provided by
a base class or mixin. By subclassing you can provide custom interface
representations. When it comes to the most complex and application
specific code - event stream coordination - many well intentioned
components devolve into an
[async mess made worse by the requisite complex state management](http://github.com/jquery/jquery-ui/blob/master/ui/jquery.ui.autocomplete.js).

Ok, but what value can we derive if we take the time pull these
elements apart as described?

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
population of clients - components written in a traditional style
either bloat to address fragmentation or libraries provide incompatible
versions of the same conceptual components like
[this](http://jqueryui.com) and [that](http://jquerymobile.com).

What would it look like to pull apart these concerns? And once we pull
them apart do we actually have a more responsive system?

Rather than tackling a complex component like a non-toy autocompleter
in its entirety as I suggested in the last post, instead I'd like
focus on how we can productively apply the separation of concerns to a
subcomponent of the autocompleter - the drop down menu.

First let's consider **interface representations** for our submenu
process. In order to be responsive we'd like to make no commitments at
all - the only thing we want to describe is a protocol that different
concrete representations must conform to. In ClojureScript this is
simple to express:

```
(defprotocol IHighlightable
  (-highlight! [list n])
  (-unhighlight! [list n]))
```

Done.

We're now free to use any visual representation we please and we'll
see this in a moment.

What about **event stream processing**? 

```
(defn ex0-key-events [prevent-default?]
  (->> (events js/window "keydown" prevent-default?)
    (map key-event->keycode)
    (filter KEYS)
    (map key->keyword)))
```

Again we see the
[reactive](http://reactive-extensions.github.io/RxJS/) approach. We
take the stream of raw key events, map them into key codes, filter
codes that don't correspond to the selection process controls (in this
case up arrow, down arrow, and enter) and then map those into the
messages that the highlighter process actually listens for: `:next`,
`:previous`, `:clear`, or a number. *This is our process
protocol*.

It's critical that the currency of event coordination be at higher
level than concrete events sources like key presses and mouse
movement - this will allow our system to be responsive. Another
benefit that falls out of designing an abstract stream protocol
is that we don't need to complicate our program with superflous
coordination APIs.

Just to drive the point home one more time - *the highlighter process
does not care how the stream events are constructed*. They could just
as easily come from a mouse, a finger on a touch screen, a
[Leap Motion](https://www.leapmotion.com/) device, or a Clojure vector
(think testing).

Now what about **event stream coordination**?

```
(defn highlighter [in list]
  (let [out (chan)]
    (go (loop [highlighted ::none]
          (let [e (<! in)]
            (if (or (#{:next :previous :clear} e) (number? e))
              (let [highlighted (handle-event e highlighted list)]
                (>! out highlighted)
                (recur highlighted))
              (do (>! out e)
                (recur highlighted))))))
    out))
```

`highlighter` takes two arguments, `in` - an input channel of events,
and `list` - a UI rendering target. We enter a loop with one piece of
local state - the current highlighted index. We process every event we
receive from `in`. If we have an event we can handle we side effect
the rendering target accordingly. Note if we cannot handle the message
we just write it to `out`, more on this later.

Lets see this in action. Place your mouse into the grey area (you may
need to click) and trying pressing the up and down arrows:

<div id="ex0" class="example">
   <pre id="ex0-ui" style="border: none;"></pre>
</div>

It seems we have a text based interface similar to the kind you might
find in a Rogue-like. In fact our rendering surface is a JavaScript
array!

```
(def ex0-ui (array "   Alan Kay"
                   "   J.C.R. Licklider"
                   "   John McCarthy"))
```

With each key press we mutate this array, concatenate it into a
string, and render that into a `pre` tag. We'll see in a moment that
all of this code can be reused without modification to target an HTML
interface.

But before we do that we should address a deficiency - we cannot
select anything in the submenu. Let's add another **interface
representation** protocol:

```
(defprotocol ISelectable
  (-select! [list n])
  (-unselect! [list n]))
```

We don't need additional **event stream processing**, the stream above
produces all the information we need - it includes `:select` events
and the highlighter simply passes it along since it cannot handle that
message itself. We can move straight away to **event stream
coordination**:

```
(defn selector [in list data]
  (let [out (chan)]
    (go (loop [highlighted ::none selected ::none]
          (let [e (<! in)]
            (if (= e :select)
              (do
                (when (number? selected)
                  (-unselect! list selected))
                (-select! list highlighted)
                (>! out [:select (nth data highlighted)])
                (recur highlighted highlighted))
              (do
                (>! out e)
                (if (or (= e ::none) (number? e))
                  (recur e selected)
                  (recur highlighted selected)))))))
    out))
```

This looks remarkably similar to `highlighter`, in fact we're feeding
the output of `highlighter` into `selector`! Again place your mouse
over the grey area and press either the up arrow, down arrow, or enter
keys. You'll now see that selections are preserved:

<div id="ex1" class="example">
   <pre id="ex1-ui" style="border: none;"></pre>
</div>

We can inherit functionality just by composing streams. We simply pass
along the messages we don't understand. This all sounds eerily
familiar.

Because we have committed to so little we can now reap the rewards of
the design, what follows is an HTML submenu component that uses all of
the prior logic - the only difference is that the initial stream
includes hover information (which are converted into integers) from
the list items as well as mouse clicks (which are converted into
`:select`s). Put your mouse in the grey area - note that hovering,
clicking, arrows keys, and enter all work.

<div id="ex2" class="example">
   <ul id="ex2-list">
      <li>Gravity's Rainbow</li>
      <li>Swann's Way</li>
      <li>Absalom, Absalom</li>
      <li>Moby Dick</li>
   </ul>
</div>

By teasing apart the architecture of the UI components we now have a
truly modular and *responsive* system. It's also pleasantly small for the
amount of flexibility we get in return.

In the next post we'll see how to put the result of this post and the
original post into a cohesive whole.

<script type="text/javascript" src="/assets/js/csp2.js"></script>
