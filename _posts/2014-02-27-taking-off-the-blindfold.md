---
layout: post
title: "Taking Off the Blindfold"
description: ""
category: 
tags: []
---
{% include JB/setup %}

<style>
  .radio label {
     margin-left: 0.5em;
  }
  .edit {
     width: 250px;
     border: 1px solid #ccc;
     padding: 4px;
     margin-left: 0.5em;
  }
  .editor code {
     margin-left: 0.5em;
  }
  .inspector {
     font-size: 11px;
     text-transform: uppercase;
     color: #aaa;
  }
  .editor .radio {
     margin-bottom: 10px;
  }
</style>

Here is a simple user interface component:

<div id="ex0"></div>

Here is the exact same interface component again peeking under the blindfold:

<div id="ex1"></div>

Clicking on the checkboxes should convince you that they are backed by
the same data. Note that in the second case you can edit the [EDN](http://github.com/edn-format/edn)
representation of the user interface and see corresponding changes.

It bears repeating that both examples are actually exactly the same:

```
(defn radio-button [data owner]
  (reify
    om/IRender
    (render [_]
      (dom/div #js {:className "radio"}
        (dom/input
          #js {:type "checkbox"
               :checked (:checked data)
               :onChange (fn [e]
                           (om/transact! data :checked not)
                           (om/transact! data :count inc))})
        (dom/label nil (:label data))))))

(defn all-buttons [data owner]
  (reify
    om/IRender
    (render [_]
      (apply dom/div nil
        (om/build-all radio-button (:ui data))))))
```

Then how are we getting the editing interface? [Om](http://github.com/swannodette/om) now supports a very
useful notion called *instrumenting* which allows us to peek under the
blindfold without changing any of the original code.

The first example is rendered with the following:

```
(om/root all-buttons app-state
  {:target (.getElementById js/document "ex0")})
```

The second example is rendered with the following:

```
(om/root all-buttons app-state
  {:target (.getElementById js/document "ex1")
   :instrument
   (fn [f cursor m]
     (if (= f radio-button)
       (om/build* editor (om/graft [f cursor m] cursor))
       ::om/pass))})
```

The new `:instrument` option of `om.core/root` let us intercept all
calls to `om.core/build` so that we can *instrument* the user
interface without having to actually change it directly.

I suspect `:instrument` will allow us to build a useful universe of
*meta* components that help
[us see more clearly](http://worrydream.com/LearnableProgramming/).

<script src="/assets/js/instrument/main.js" type="text/javascript"></script>
