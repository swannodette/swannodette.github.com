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
    font-weight: bold;
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
read this post as a criticism of the jQuery UI autocompleter, rather a
frame of reference to understand more easily what
[CSP](http://en.wikipedia.org/wiki/Communicating_sequential_processe)
might offer UI programmers. If you haven't read the
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

In contrast to many toy reactive autocompleters you'll find around the
web what follows is an autocompleter much closer to the type of
component you would actually consider integrating. For proponents of
the reactive style I would like to see an FRP version of this
autocompleter that demonstrates not only the level of functionality
but the same level of separation of concerns.

First we declare our namespace. We import the async functions and
macros. We also import the components from the previous blog post, no
need to write that code again. We also import some dom helpers and
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

We setup the url we'll use to populate our menu:

```
(def base-url
  "http://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=")
```

The autocompleter requires some new interface representations - we
need hideable UI components, we need to be able to set text fields,
and we need to update the contents of a list.

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

We can now think about the autocompleter. If you look at the jQuery
autocompleter you'll notice a lot of logic about event suppression,
this is because you have duplicate event handling between the jQuery
autocompleter and the jQuery menu.

In this version we're going to something a bit novel, the
autocompleter will not hold onto a menu instance, it will construct
the menu on the fly as needed and we can complete avoid the problem of
event suppression as we'll just wait until the menu subprocess
completes.

Read the last one more time - *we can just wait until the menu
subprocess completes*. That is when the menu subprocess finishes we
resume where we left off.

Because some of the event handling code is in the jQuery autocompleter
all the browser quirks must be handled there. In our implementation we
have a pure process coordination core devoid of all the browser
specific insanity. It's precisely for this reason why we can
fearlessly combine all the work from the previous post with the code
in this post. We can quarantine client idiosyncracies!

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

Now we cover the event handling.

Finally we put it all together.

<script type="text/javascript" src="/assets/js/ac.js"></script>
