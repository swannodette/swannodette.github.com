---
layout: post
title: "Comparative Literate Programming"
description: ""
category: 
tags: []
---
{% include JB/setup %}

<style>
  #post ul,
  #post li {
    list-style: none;
  }
  #post li {
    list-indent: -10px;
  }

  #ac-ex0 {
    margin: 20px 0;
    height: 75px;
    background-color: #efefef;
    padding: 10px;
  }

  #ac-container {
    width: 562px;
  }

  #ac-ex0 input {
    width: 460px;
    padding: 5px;
    font-size: 15px;
    font-family: inconsolata;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
  }

  #ac-ex0 label {
    font-family: inconsolata;
    width: 100px;
    display: inline-block;
    text-align: right;
  }

  #ac-ex0 .section {
    margin-bottom: 10px;
  }

  #ac-ex0 ul {
    list-style: none;
    background-color: white;
    margin: 0;
    font-family: inconsolata;
    border-left: 1px solid #ccc;
    border-right: 1px solid #ccc;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
  }

  #ac-ex0 li {
    list-style: none;
    padding: 0 0 0 8px;
    margin: 0;
    border-bottom: 1px solid #ccc;
  }
</style>

This is the long promised autocompleter post. It's a doozy so I've
decided to present it in the format of *comparative literate
code*. I'll be documenting every part of the autocompleter and showing
how analagous cases are handled in the
[jQuery UI autocompleter](http://github.com/jquery/jquery-ui/blob/master/ui/jquery.ui.autocomplete.js). Don't
read this post as trash talking the jQuery UI autocompleter, rather a
frame of reference to understand more easily what
[CSP](http://en.wikipedia.org/wiki/Communicating_sequential_processe)
might offer UI programmers over more traditional patterns as well as
reactive ones. We will also
apply this method of comparison and critique to Twitter's more
featureful and more complicated
[typeahead.js](http://twitter.github.io/typeahead.js/). If you
haven't read the
[original post](http://swannodette.github.io/2013/07/12/communicating-sequential-processes/)
on CSP or the
[second post](http://swannodette.github.io/2013/07/31/extracting-processes/)
on the selection menu component, please do so before proceeding.

First, the autocompleter in action. Make sure to try all
the following cases:

* &mdash; Control characters should not trigger fetch for results
* &mdash; Losing focus via outside click should close menu
* &mdash; Losing focus by tabbing out of input field should close menu
* &mdash; Keyboard based selection
* &mdash; Mouse based selection

<div id="ac-ex0">
    <div class="ac-container">
        <div class="section">
            <label>Query:</label>
            <span>
                <input id="autocomplete" type="text"/>
                <ul id="autocomplete-menu"></ul>
            </span>
        </div>
        <div class="section">
            <label>Some field:</label>
            <input type="text" />
        </div>
    </div>
</div>

## The Program

In contrast to many toy reactive autocompleters you'll find around the
web what follows is an autocompleter much closer to the type of
component you would actually consider integrating. This is also
another reason to compare with the jQuery UI autocompleter; it
actually handles a lot of edge cases the various FRP toys do not. Of
course this is not a problem with
[FRP](http://en.wikipedia.org/wiki/Functional_reactive_programming),
just the examples you find online. In fact, I would love to see an
alternative version of this autocompleter using an FRP library or
[language](http://elm-lang.org/) that demonstrates not only the level
of functionality but the same deep separation of concerns.

### Namespace definition

First we declare our namespace. We import the core.async functions and
macros. We also import the components from the previous blog post; no
need to write that code again. We also import some utility DOM helpers
(which are just wrappers around Google Closure's battle tested cross
browser DOM library) and
some reactive conveniences.

```
(ns blog.autocomplete.core
  (:require-macros
    [cljs.core.async.macros :refer [go]])
  (:require
    [cljs.core.async :refer [>! <! alts! chan]]
    [blog.responsive.core :as resp]
    [blog.utils.dom :as dom]
    [blog.utils.reactive :as r]))
```

### Declarations

We setup the url that will serve the data that will populate our menu:

```
(def base-url
  "http://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=")
```

### Protocols

The autocompleter requires some new interface representations - we
need hideable components, we need to be able to set text fields,
and we need to update the contents of list components.

```
(defprotocol IHideable
  (-hide! [view])
  (-show! [view]))

(defprotocol ITextField
  (-set-text! [field txt])
  (-text [field]))

(defprotocol IUIList
  (-set-items! [list items]))
```

### Menu subprocess

In this implementation we're going to do something a bit novel as far
as common JavaScript practice. In the jQuery UI, the menu used by the
autocompleter is constructed once and stored in a field of the
autocompleter like so:

```
this.menu = $( "<ul>" )
	.addClass( "ui-autocomplete ui-front" )
	.appendTo( this._appendTo() )
	.menu({
		// disable ARIA support, the live region takes care of that
		role: null
	})
	.hide()
	.menu( "instance" );
```

You can see the source in context
[here](http://github.com/jquery/jquery-ui/blob/master/ui/jquery.ui.autocomplete.js#L192).

In our implementation we will not hold onto a selectable menu instance, instead
we will create a menu selection process on the fly as needed.

Not only will we construct the menu selection subprocess on *demand*,
we can *pause* the autocompleter until the subprocess
completes. This eliminates coordination between components
and superfluous state tracking. It also means we can share
streams of events avoiding redundancy and duplication of logic. [Lines
202 to 307 in the jQuery autocompleter](http://github.com/jquery/jquery-ui/blob/master/ui/jquery.ui.autocomplete.js#L202)
is all component coordination and event handling redundancy that we would like to
avoid.

Our menu subprocess looks like this:

```
(defn menu-proc [select cancel input menu data]
  (let [ctrl (chan)
        sel  (resp/selector
               (resp/highlighter select menu ctrl)
               menu data)]
    (go
      (let [[v sc] (alts! [cancel sel])]
        (>! ctrl :exit)
        (-hide! menu)
        (if (= sc cancel)
          ::cancel
          (do (-set-text! input v)
            v))))))
```

`menu-proc` takes some channels and some UI components. The `select`
channel provides the events that affect the menu component. The
`cancel` channel allows us to abort the selection process should the
user blur the autocomplete field by tabbing out or clicking elsewhere in the
window. It's important to notice the lack of anything specific to HTML
representation at this point (more on this later). We also construct a channel `ctrl` so
that we can tell the menu subprocess to quit and thus get garbage
collected.

As soon as we receive something from `cancel` or `select` we quit the
subprocess and either return `::cancel` or the user selection respectively.

Once more, in this model we only create the menu selection process
when we need it. In many traditional MVC designs you'll see complex
graphs of objects that get allocated at initialization only to sit
around in memory spending most of their time doing nothing.

In this design we're alluding to a system that only constructs the
processes when they are needed and which are destroyed when they have
completed their work. Sounds like a good idea right?

## Core autocompleter

This is our main autocompleter process. There are three main cases,
cancellation, menu subprocess trigger, or a network fetch for completions. Again take
note how abstractly we have specified `autocompleter*` - this
function only takes channels or abstract UI components as
arguments. We can just as easily use this code in a DOM based program as a
Canvas or WebGL based one.

```
(defn autocompleter* [fetch select cancel completions input menu]
  (let [out (chan)]
    (go (loop [items nil]
          (let [[v sc] (alts! [cancel select fetch])]
            (cond
              (= sc cancel)
              (do (-hide! menu)
                (recur items))

              (= sc fetch)
              (let [[v c] (alts! [cancel (completions v)])]
                (if (= c cancel)
                  (do (-hide! menu)
                    (recur nil))
                  (do (-show! menu)
                    (let [items (nth v 1)]
                      (-set-items! menu items)
                      (recur items)))))

              (and items (= sc select))
              (let [v (<! (menu-proc (r/concat [v] select)
                            cancel input menu items))]
                (if (= v ::cancel)
                  (recur nil)
                  (do (>! out v)
                    (recur items)))))

              :else
              (recur items))))
    out))
```

In the first case we have a cancellation event, we simply hide the
menu component.

In the second case we need to fetch data from the server. We call
`completions` with the query supplied by the user. We handle
possible cancellation. If we actually get a result and no cancellation
event we show the menu component, extract the relevant data from
the response and update the contents of the menu component.

The third case is the most interesting. *We hand off control to the menu
process*. We pass along the `select` channel making sure to put the
event we read back at the front. We also pass along the `cancel`
channel. `autocompleter*` will be *paused* until the menu selection subprocess
completes. Because we can hand off control, coordination logic between
`autocompleter*` and `menu-proc` becomes unnecessary.

> ### Code Comprehension
> We've seen hardly anything so far related to HTML - we've
> only been examining an abstract autocompleter process. 
> This may seem like over engineering, but reading through
> the source of the [jQuery autocompleter](http://github.com/jquery/jquery-ui/blob/master/ui/jquery.ui.autocomplete.js) or through
> [typeahead.js](http://github.com/twitter/typeahead.js/blob/master/src/typeahead_view.js)
> it becomes apparent that the difficulty in
> understanding their implementations is due precisely to the lack of separation
> of concerns. We have to digest so many different concerns at once!
> How exhausting.

Now that we defined a fairly sensible autocompleter for any interface
representation, lets actually implement a concrete representation.

### HTML based implementation

We write a concrete implementation of `ITextField` for HTML text inputs.

```
(extend-type js/HTMLInputElement
  ITextField
  (-set-text! [field text]
    (set! (.-value list) text))
  (-text [field]
    (.-value field)))
```

We want HTML `ul` tags to act as hideable list components. So we add
concrete implementations of `IHideable` and `IUIList`.

```
(extend-type js/HTMLUListElement
  IHideable
  (-hide! [list]
    (dom/add-class! list "hidden"))
  (-show! [list]
    (dom/remove-class! list "hidden"))

  IUIList
  (-set-items! [list items]
    (->> (for [item items] (str "<li>" item "</li>"))
      (apply str)
      (dom/set-html! list))))
```

That concludes all the interface presentation code - short and
sweet. Event handling is only a little bit more involved.

### HTML Event Wrangling

These are events for the HTML based menu:

```
(defn html-menu-events [input menu]
  (r/fan-in
    [(->> (r/listen input :keyup)
       (r/map resp/key-event->keycode)
       (r/filter resp/KEYS)
       (r/map resp/key->keyword))
     (r/hover-child menu "li")
     (r/map (constantly :select)
       (r/listen menu :click))]))
```

We listen for up arrow, down arrow, enter, and tab keys. We also listen
for mouse hover events on the `li` children elements of `menu` and
any clicks on `menu`. We don't care about which `li` element gets
clicked because `highlighter` from the previous post tracks that for
us. We use `r/fan-in` to merge these different channels into a single
channel of events, this will be the `select` channel used by
`autocompleter*` and `menu-proc`.

Then we need to listen to key events from the input field. We only
care when the text of input field actually changes (automatically
ignoring control characters). We use `r/split` to generate two channels, a channel of
the things we might query and another channel of blank input events to cancel
the menu selection process.

```
(defn html-input-events [input]
  (->> (r/listen input :keyup)
    (r/map #(-text input))
    r/distinct
    (r/split #(string/blank? %))))
```

> ### Quarantining Quirks
> Because neither of the JavaScript autocompleters we've
> considered have disciplined separation of concerns, browser quirk
> logic is fully interleaved into the process logic - see
> [here](http://github.com/jquery/jquery-ui/blob/master/ui/jquery.ui.autocomplete.js#L127)
> and
> [here](http://github.com/twitter/typeahead.js/blob/master/src/typeahead_view.js#L216).
> In our implementation process coordination is untainted by
> browser specific insanity; browser quirks need
> only appear in the place where it matters, event handling and DOM
> manipulation! This aids code comprehension as well as
> code maintenance. This is real readability, not the purely surface appearance
> notion of readability that's usually bandied about these days.

Finally, a simple `html-completions` function that uses
`JSONP` to make a cross domain request to Wikipedia.

```
(defn html-completions [base-url]
  (fn [query]
    (r/jsonp (str base-url query))))
```

### Putting it all together

We provide a constructor `html-autocompleter`. If someone wants to
write an autocompleter that does intelligent caching of server results
they only need to supply their own `completions` - do all the fancy
[typeahead.js]() optimizations there.

```
(defn html-autocompleter [input menu msecs]
  (let [[filtered removed] (html-input-events input)
        ac (autocompleter*
             (r/throttle filtered msecs)
             (html-menu-events input menu)
             (r/map (constantly :cancel)
               (r/fan-in [removed (r/listen input :blur)]))
             (html-completions base-url)
             input menu)]
    ac))
```

## Conclusion

We've examined a small and manageable amount of code. The core is not
polluted by concrete implementation concerns and thus improving
readability. DOM and browser specific quirks are quarantined into the
parts of the code where they make sense. There are no monolithic
objects, no contorted class hierarchies, no elaborate mixins, just
some functions, some data, and some processes.

Even if you don't intend to use ClojureScript, hopefully you've noticed some
patterns that you can leverage to make your own code more robust,
easier to read, easier to extend, and easier to maintain.

Who knew UI programming could be so *simple*?

<script type="text/javascript" src="/assets/js/ac.js"></script>
