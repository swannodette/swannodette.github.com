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
code*. I'll be documenting every part of autocompleter and showing how
analagous cases are handled in the
[jQuery UI autocompleter](http://github.com/jquery/jquery-ui/blob/master/ui/jquery.ui.autocomplete.js). Don't
read this post as a trash-talking of the jQuery UI autocompleter,
rather a frame of reference to understand more easily what
[CSP](http://en.wikipedia.org/wiki/Communicating_sequential_processe)
might offer UI programmers. This method of comparison and critique could
readily be applied to Twitter's more featureful and more complicated
[typeahead.js](http://twitter.github.io/typeahead.js/). If you haven't
read the
[original post](http://swannodette.github.io/2013/07/12/communicating-sequential-processes/)
on CSP or the
[second post](http://swannodette.github.io/2013/07/31/extracting-processes/)
on the selection menu component, please do so before proceeding.

First off, here's the autocompleter in action. Make sure to try all
the following

* &mdash; Control characters should not trigger fetch for results
* &mdash; Losing focus via outside click should close menu
* &mdash; Losing focus by tabbing out of input field should close menu
* &mdash; Keyboard based selection should work
* &mdash; Mouse based selection should work

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
course this is not a problem with FRP, just the examples you find
online. I would love to see an alternative version of this autocompleter
using an FRP library or [language](http://elm-lang.org/) that
demonstrates not only the level of functionality but the same
separation of concerns.

Let's begin.

### Namespace definition

First we declare our namespace. We import the async functions and
macros. We also import the components from the previous blog post, no
need to write that code again. We also import some DOM helpers and
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

We setup the url we'll use to populate our menu:

```
(def base-url
  "http://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=")
```

### Protocols

The autocompleter requires some new interface representations - we
need hideable components, we need to be able to set text fields,
and we need to update the contents of a list component.

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

We can now begin to consider the autocompleter. In this version we're
going to do something a bit novel, the autocompleter will not hold onto a
menu instance, it will construct the menu selection process on the fly as
needed. Contrast this to the jQuery autocompleter where the menu is
constructed once and held onto:

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

Just to drive a point home that's easy to miss, not only will we
construct the menu selection subprocess on *demand*, we can *pause*
the autocompleter until the selection subprocess completes. This
eliminates a considerable amount of inter component coordination and
additional state tracking.

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

`menu-proc` takes some channels and some UI components. Notice the
complete lack of anything specific to HTML representation. We
construct a channel `ctrl` so that we can tell the menu subprocess to
quit (and thus get garbage collected). 

## Core autocompleter

This is our autocompleter process. There are three main cases,
cancellation, menu subprocess trigger, or a fetch completiions. Take
note of how little we have specified in the autocompleter* - this
function only takes channels or abstract ui components as
arguments. We can as easily use this code in a HTML based program as a
WebGL based one.

```
(defn autocompleter* [fetch select cancel completions input menu]
  (let [out (chan)]
    (go (loop [items nil]
          (let [[v sc] (alts! [cancel select fetch])]
            (cond
              (= sc cancel)
              (do (-hide! menu)
                (recur items))

              (and items (= sc select))
              (let [v (<! (menu-proc (r/concat [v] select)
                            cancel input menu items))]
                (if (= v ::cancel)
                  (recur nil)
                  (do (>! out v)
                    (recur items)))))

              (= sc fetch)
              (let [[v c] (alts! [cancel (completions v)])]
                (if (= c cancel)
                  (do (-hide! menu)
                    (recur nil))
                  (do (-show! menu)
                    (let [items (nth v 1)]
                      (-set-items! menu items)
                      (recur items)))))

              :else
              (recur items))))
    out))
```

Because some of the event handling code is in the jQuery autocompleter
all the browser quirks must be handled there. In our implementation we
have a pure process coordination core devoid of all the browser
specific insanity. It's precisely for this reason why we can
fearlessly combine all the work from the previous post with the code
in this post. We can quarantine client idiosyncracies!

### HTML based implementation

Let's cover the HTML autocompleter implementation:

First we want to write complete implementation of `ITextField` for HTML inputs.

```
(extend-type js/HTMLInputElement
  ITextField
  (-set-text! [field text]
    (set! (.-value list) text))
  (-text [field]
    (.-value field)))
```

Now we want HTML `ul` tags to act as hideable ui components. So we add
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

### HTML Event Wrangling

Now we cover the event handling.

First the events for the HTML based menu:

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

Now the event for the HTML input field:

```
(defn html-input-events [input]
  (->> (r/listen input :keyup)
    (r/map #(-text input))
    (r/split #(string/blank? %))))
```

We don't want hard code where completions come from:

```
(defn html-completions [base-url]
  (fn [query]
    (r/jsonp (str base-url query))))
```

Finally we put it all together.

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

<script type="text/javascript" src="/assets/js/ac.js"></script>
