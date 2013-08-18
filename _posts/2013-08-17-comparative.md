---
layout: post
title: "Comparative Literate Programming"
description: ""
category: 
tags: []
---
{% include JB/setup %}

<style>
  .hidden {
    display: none;
  }

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

  .ac-container .combo-box {
    position: relative;
  }

  #autocomplete-menu {
    position: absolute;
    left: 0px;
    right: 0px;
    top: 25px;
    z-index: 999;
  }

  #ac-ex0 input {
    width: 460px;
    padding: 5px;
    font-size: 15px;
    font-family: inconsolata;
    height: 30px;
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
    border-top: 1px solid #ccc;
    border-left: 1px solid #ccc;
    border-right: 1px solid #ccc;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    box-shadow: 0px 4px 4px rgb(220,220,220);
    user-select: none
    -webkit-user-select: none;
    -moz-user-select: none;
  }

  #ac-ex0 li {
    cursor: pointer;
    list-style: none;
    padding: 3px 0 3px 8px;
    margin: 0;
    border-bottom: 1px solid #ccc;
  }

  #ac-ex0 li.highlighted {
    background-color: #ccccff;
  }
</style>

core.async and systems like it have an unmatched level of power when
it comes to programming user interfaces. I've spent about a week using
core.async to build the long promised autocompleter in about two
hundred lines of ClojureScript.

This post is a doozy so I've
decided to present it in the format of *comparative literate
code*. I'll be documenting every part of the autocompleter and showing
how analagous cases are handled in the
[jQuery UI autocompleter](http://github.com/jquery/jquery-ui/blob/9e00e00f3b54770faa0291d6ee6fc1dcbad028cb/ui/jquery.ui.autocomplete.js). Don't
read this post as trash talking the jQuery UI autocompleter, rather a
frame of reference to understand more easily what
[CSP](http://en.wikipedia.org/wiki/Communicating_sequential_processes)
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

* &mdash; Control characters should not trigger menu
* &mdash; Platform command chords should not trigger menu
* &mdash; Close menu on tab out of field
* &mdash; Close menu on outside click
* &mdash; Tab when user is selecting item should prevent default
* &mdash; Keyboard based selection
* &mdash; Mouse based selection
* &mdash; No selection when mouse down on one item and mouse up on
  different item

The autocompleter should work fine on Internet Explorer 8 or greater
and we'll see how cleanly we can handle browser quirks.

<div id="ac-ex0">
    <div class="ac-container">
        <div class="section">
            <label>Query:</label>
            <span class="combo-box">
                <input id="autocomplete" type="text"/>
                <ul id="autocomplete-menu" class="hidden"></ul>
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
browser DOM library) and some reactive conveniences. We import
`goog.userAgent` and some other `goog` related namespaces to help us
deal with Internet Explorer quirks.

```
(ns blog.autocomplete.core
  (:require-macros
    [cljs.core.async.macros :refer [go]]
  (:require
    [goog.userAgent :as ua]
    [goog.events :as events]
    [goog.events.EventType]
    [clojure.string :as string]
    [cljs.core.async :refer [>! <! alts! chan sliding-buffer put!]]
    [blog.responsive.core :as resp]
    [blog.utils.dom :as dom]
    [blog.utils.helpers :as h]
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
[here](http://github.com/jquery/jquery-ui/blob/9e00e00f3b54770faa0291d6ee6fc1dcbad028cb/ui/jquery.ui.autocomplete.js#L192).

In our implementation we will not hold onto a selectable menu instance, instead
we will create a menu selection process on the fly as needed.

Not only will we construct the menu selection subprocess on *demand*,
we can *pause* the autocompleter until the subprocess
completes. This eliminates coordination between components
and superfluous state tracking. It also means we can share
streams of events avoiding redundancy and duplication of logic. [Lines
202 to 307 in the jQuery autocompleter](http://github.com/jquery/jquery-ui/blob/9e00e00f3b54770faa0291d6ee6fc1dcbad028cb/ui/jquery.ui.autocomplete.js#L202)
is all component coordination and event handling redundancy that we would like to
avoid.

Our menu subprocess looks like this:

```
(defn menu-proc [select cancel menu data]
  (let [ctrl (chan)
        sel  (->> (resp/selector
                    (resp/highlighter select menu ctrl)
                    menu data)
               (r/filter vector?)
               (r/map second))]
    (go (let [[v sc] (alts! [cancel sel])]
          (do (>! ctrl :exit)
            (if (or (= sc cancel)
                    (= v ::resp/none))
              ::cancel
              v))))))
```

`menu-proc` takes some channels and some UI components. The `select`
channel provides the events that affect the menu component. The
`cancel` channel allows us to abort the selection process should the
user start typing again, tab out or click elsewhere in the
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

This is our main autocompleter process. The 39 lines of code below represent
the entirety of the process utterly devoid of clutter about DOM
events or manipulation. This is in stark contrast to jQuery UI or
typeahead.js where the heart of the component is smeared across hundreds
and hundreds of line of code.

`autocompleter*` takes in a variety of values in a ClojureScript
hash-map. `focus` is a channel of input field focus events. `query` is
the stream of text changes made to the input field with values
"highlighted" at throttled intervals. `select` is the channel of events
needed by the menu, but we also use this to know when to start the menu
selection subprocess. `cancel` is channel of events that should cancel
the selection process and hide the selection menu. `menu` is the
abstract menu UI component.

```
(defn autocompleter* [{:keys [focus query select cancel menu] :as opts}]
  (let [out (chan)
        [query raw] (r/split #(r/throttle-msg? %) query)]
```

We enter our go loop. We track two pieces of state, `items` which is the
last JavaScript array of completions we fetched (it could be local or
remote it doesn't matter), and `focused` - whether the input field
is in focus.

We split `query` into the highlighted events and the raw
events. We'll forward `raw` to the selection process when we create
it.

We non-deterministically select over all these channels:

```
    (go (loop [items nil focused false]
          (let [[v sc] (alts! [raw cancel focus query select])]
```

In the first case we have a focus event, we simply track that bit of state.

```
            (cond
              (= sc focus)
              (recur items true)
```

In the second case we have a cancellation event, we simply hide the
menu component and kill any pending throttled query.

```
              (= sc cancel)
              (do (-hide! menu)
                (>! (:query-ctrl opts) (h/now))
                (recur items (not= v :blur)))
```

In the third case we need to get some completions. We call
`completions` with the query supplied by the user. We handle
possible cancellation. If we actually get a result and no cancellation
event we show the menu component and update its contents.

```
              (and focused (= sc query))
              (let [[v c] (alts! [cancel ((:completions opts) (second v))])]
                (if (or (= c cancel) (zero? (count v)))
                  (do (-hide! menu)
                    (recur nil (not= v :blur)))
                  (do
                    (-show! menu)
                    (-set-items! menu v)
                    (recur v focused))))
```

The fourth case is the most interesting. *We hand off control to the menu
process*. We pass along the `select` channel making sure to put the
event we read back at the front. We also pass along the `cancel`
channel, note we use `r/fan-in` to mix in `raw`, which is a channel of the
changes to the input field because we want to cancel menu selection if the
user starts typing again.

`autocompleter*` will be *paused* until the menu selection subprocess
completes. Because we can hand off control, coordination logic between
`autocompleter*` and `menu-proc` becomes unnecessary.

It's worth taking a breath to consider how flexible this is. Because
channels do not require explicit subscription we can simply pass them
along as values, pause our execution allowing some other process to
read from the channel until they are done at which point we can pick
up where we left off. This is very different from the approach taken by
[Reactive Extensions](http://msdn.microsoft.com/en-us/data/gg577609.aspx) and similar systems like [Dart's Stream](http://api.dartlang.org/docs/releases/latest/dart_async/Stream.html).

```
              (= sc select)
              (let [_ (>! (:query-ctrl opts) (h/now))
                    _ (reset! (:selection-state opts) true)
                    choice (<! ((:menu-proc opts) (r/concat [v] select)
                                 (r/fan-in [raw cancel]) menu items))]
                (reset! (:selection-state opts) false)
                (-hide! menu)
                (if (= choice ::cancel)
                  (recur nil (not= v :blur))
                  (do (-set-text! (:input opts) choice)
                    (>! out choice)
                    (recur nil focused))))
```

There's a little bit of complication above around `:selection-state`
this is to support tab for selection, we'll explain this later. We
need to cancel any pending throttle event via `:query-ctrl` as
otherwise the menu might appear after a selection is made if the user is
a particularly fast typist.

The final case, we just loop around. `autocompleter*` just
returns its output channel

```
              :else
              (recur items focused)))))
    out))
```

> ### Code Comprehension
> We've seen hardly anything so far related to HTML - we've
> only been examining an abstract autocompleter process. 
> This may seem like over engineering, but reading through
> the source of the [jQuery autocompleter](http://github.com/jquery/jquery-ui/blob/9e00e00f3b54770faa0291d6ee6fc1dcbad028cb/ui/jquery.ui.autocomplete.js) or through
> [typeahead.js](http://github.com/twitter/typeahead.js/blob/8c493d55f012bb8e9ee4ebfffaa569e465b53813/src/typeahead_view.js)
> it becomes apparent that the difficulty in
> understanding their implementations is due precisely to the lack of separation
> of concerns. We have to digest so many different concerns at once!
> How exhausting.

Now that we defined a fairly sensible autocompleter for any interface
representation, lets actually implement a concrete representation.

### HTML based implementation

First we need a way to detect bad browsers:

```
(defn less-than-ie9? []
  (and ua/IE (not (ua/isVersion 9))))
```

We write a concrete implementation of `ITextField` for HTML text inputs.

```
(extend-type js/HTMLInputElement
  ITextField
  (-set-text! [field text]
    (set! (.-value field) text))
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

We need a way to detect mouse down and up events on items in the menu,
this is because we cannot prevent blur events if we don't prevent
default on mouse down.

`menu-item-event` accomplishes this for us. Notice that for bad
browsers we need to refocus the input field, because we can't even
prevent blur events at mouse down.

```
(defn menu-item-event [menu input type]
  (->> (r/listen menu type
         (fn [e]
           (when (dom/in? e menu)
             (.preventDefault e))
           (when (and (= type :mousedown)
                      (less-than-ie9?))
             (.focus input)))
         (chan (sliding-buffer 1)))
    (r/map
      (fn [e]
        (let [li (dom/parent (.-target e) "li")]
          (h/index-of (dom/by-tag-name menu "li") li))))))
```

For the HTML based menu, we fan in three different channels of events.

First we need the channel of key events that manipulate the menu. If
the user is in the middle of menu selection we need to override the
behavior of the tab key. We are able to detect this via
`allow-tab?` which is an atom, a tiny bit of necessary mutable
state. This is the `:selection-state` option in `autocompleter*` that we
banged on earlier.

```
(defn html-menu-events [input menu allow-tab?]
  (r/fan-in
    [;; keyboard menu controls, tab special handling
     (->> (r/listen input :keydown
            (fn [e]
              (when (and @allow-tab?
                         (= (.-keyCode e) resp/TAB))
                (.preventDefault e))))
       (r/map resp/key-event->keycode)
       (r/filter
         (fn [kc]
           (and (resp/KEYS kc)
                (or (not= kc resp/TAB)
                    @allow-tab?))))
       (r/map resp/key->keyword))
```

We need to detect user hover over items in the menu to track
potential selections.

```
     ;; hover events, index of hovered child
     (r/hover-child menu "li")
```

In order to trigger selection we need both a mouse down event and a
mouse up event - we use `r/cyclic-barrier` to make sure that we have
both before we proceed. We only want to handle cases where the item
the user mouse downed on matches the one that the user mouse upped on.

```
     ;; need to handle menu clicks
     (->> (r/cyclic-barrier
            [(menu-item-event menu input :mousedown)
             (menu-item-event menu input :mouseup)])
       (r/filter (fn [[d u]] (= d u)))
       (r/always :select))]))
```

Then we need to listen to key events from the input field. We only
care when the text of the input field actually changes. We filter out the
various cases we don't care about. We use `r/split` to generate two
channels, a channel of the things we might query and another channel
of blank input events to cancel the menu selection process.

```
(defn relevant-keys [kc]
  (or (= kc 8)
      (and (> kc 46)
           (not (#{91 92 93} kc)))))
           
(defn html-input-events [input]
  (->> (r/listen input :keydown)
    (r/remove (fn [e] (.-platformModifierKey e)))
    (r/map resp/key-event->keycode)
    (r/filter relevant-keys)
    (r/map #(-text input))
    (r/split #(not (string/blank? %)))))
```

Now we need to handle bad browsers that complicate blur detection:

```
(defn ie-blur [input menu selection-state]
  (let [out (chan)]
    (events/listen input goog.events.EventType.KEYDOWN
      (fn [e]
        (when (and (= (.-keyCode e) resp/TAB) (not @selection-state))
          (put! out (h/now)))))
    (events/listen js/document.body goog.events.EventType.MOUSEDOWN
      (fn [e]
        (when-not (some #(dom/in? e %) [menu input])
          (put! out (h/now)))))
    out))
```

> ### Quarantining Quirks
> Because neither of the JavaScript autocompleters we've
> considered have disciplined separation of concerns, browser quirk
> logic is fully interleaved into the process logic - see
> [here](http://github.com/jquery/jquery-ui/blob/9e00e00f3b54770faa0291d6ee6fc1dcbad028cb/ui/jquery.ui.autocomplete.js#L127)
> and
> [here](http://github.com/twitter/typeahead.js/blob/8c493d55f012bb8e9ee4ebfffaa569e465b53813/src/typeahead_view.js#L216).
> In our implementation process coordination is untainted by
> browser specific insanity; browser quirks need
> only appear in the place where it matters, event handling and DOM
> manipulation! This aids code comprehension as well as
> code maintenance. This is real readability, not the purely surface appearance
> notion of readability that's usually bandied about these days.

We can now write the HTML autocompleter construction function.

```
(defn html-autocompleter [input menu completions throttle]
  (let [selection-state (atom false)
        query-ctrl (chan)
        [filtered removed] (html-input-events input)]
    (when (less-than-ie9?)
      (events/listen menu goog.events.EventType.SELECTSTART
        (fn [e] false)))
    (-set-text! input "")
    (autocompleter*
      {:focus (r/always :focus (r/listen input :focus))
       :query (r/throttle* (r/distinct filtered) throttle (chan) query-ctrl)
       :query-ctrl query-ctrl
       :select (html-menu-events input menu selection-state)
       :cancel (r/fan-in
                 [removed
                  (r/always :blur
                    (if-not (less-than-ie9?)
                      (r/listen input :blur)
                      (ie-blur input menu selection-state)))])
       :input input
       :menu menu
       :menu-proc menu-proc
       :completions completions
       :selection-state selection-state})))
```

### Running it

```
(defn wikipedia-search [query]
  (go (nth (<! (r/jsonp (str base-url query))) 1)))

(let [ac (html-autocompleter
           (dom/by-id "autocomplete")
           (dom/by-id "autocomplete-menu")
           wikipedia-search 750)]
  (go (while true (<! ac))))
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

You can see all code for this post
[here](http://github.com/swannodette/swannodette.github.com/blob/master/code/blog/src/blog/autocomplete/core.cljs).



<script type="text/javascript" src="/assets/js/ac.js"></script>
