---
layout: post
title: "Make No Promises"
description: ""
category: 
tags: []
---
{% include JB/setup %}

<style>
  .ex {
    background-color: #efefef;
    padding: 20px 0px;
    text-align: center;
  }
  .ex button {
    margin-top: 15px;
    background-color: white;
    padding: 10px 20px;
    font-weight: bold;
    font-family: Inconsolata;
    font-size: 18px;
    border: 1px solid #666;
    border-radius: 1px solid #ccc;
    -moz-border-radius: 4px;
    -webkit-border-radius: 4px;
  }
  .ex button:active {
    background-color: #ccccff;
  }
  .ex .time {
    padding-top: 30px;
    height: 50px;
    font-size: 32px;
    font-family: Inconsolata;
  }
</style>

[Promises](http://promises-aplus.github.io/promises-spec/) are all the
rage in the JavaScript world even though they don't actually eliminate
callback hell and their design emphasizes coarse grained asychronous
operations leaving much to be desired for the vast universe of
possible interactive applications (*cough*, user interfaces).

Here is a simple benchmark using one of the fastest promise
implementations, [when.js](http://github.com/cujojs/when).

```
function goWhen() {
  var first = when.defer(), last = first.promise;

  for(var i = 0; i < 100000; i++) {
    last = last.then(function(val) {
      return val + 1;
    });
  }

  var s = new Date();
  first.resolve(0);
  last.then(function(val) {
    var el = document.getElementById("when-time")
    el.innerHTML = val + " elapsed ms: " + (new Date()-s);
  });
}
```

<div id="ex0" class="ex">
  <button onclick="goWhen()">Go!</button>
  <div id="when-time" class="time"></div>
</div>

The same conceptual thing in core.async:

```
(defn ^:export go-cljs []
  (let [first (chan)
        last (loop [i 0 last first]
               (if (< i 100000)
                 (let [next (chan)]
                   (take! last (fn [v] (put! next (inc v))))
                   (recur (inc i) next))
                 last))]
    (go (let [s  (js/Date.)
              el (.getElementById js/document "cljs-time")]
          (>! first 0)
          (set! (.-innerHTML el)
            (str (<! last) " elapsed ms: " (- (js/Date.) s)))))))
```

<div id="ex1" class="ex">
  <button onclick="blog.promises.core.go_cljs()">Go!</button>
  <div id="cljs-time" class="time"></div>
</div>

As you can see core.async is competitive. However it has the advantage
in that we can create channels and do many asynchronous operations
over them instead of wastefully instantiating promises again and
again. We can also combine channels with go blocks freeing us from
callback hell.

The above performance is the result of several improvements we've
landed in core.async this week, and what follows are some other
highlights.

*On a 1.7ghz MacBook Air running Chrome Canary we can push one million
events down a channel in around 1 second*.

The following code pushes an event down a 100,000 channel long daisy
chain in less than 200ms in Chrome Canary. For comparison this takes
about 60-80ms in [Go](http://golang.org) on my machine and of course
I can't run Go in my web browser.

In Node.js just calling `setImmediate` 100,000 times takes 360ms. The
following code takes *~420ms* under Node.js. That's an incredibly
small amount of overhead.

```
(defn f [left right]
  (go (>! left (inc (<! right)))))

(let [leftmost (chan)
      rightmost (loop [n 100000 left leftmost]
                  (if-not (pos? n)
                    left
                    (let [right (chan)]
                      (f left right)
                      (recur (dec n) right))))]
  (go
    (let [s (js/Date.)]
      (>! rightmost 1)
      (.log js/console (<! leftmost) " elapsed ms: "
        (- (.valueOf (js/Date.)) (.valueOf s))))))
```

I'm sure core.async performance will continue to improve but these
examples demonstrate that core.async can likely handle even the most
demanding complex event driven applications while providing the
one of the highest level of abstractions offered by any language
targeting JavaScript today.

<script>
    window.define = function(factory) {
        try{ delete window.define; } catch(e){ window.define = void 0; } // IE
        window.when = factory();
    };
    window.define.amd = {};
</script>
<script src="/assets/js/when.js"></script>
<script src="/assets/js/when_ex.js"></script>
<script src="/assets/js/promises.js"></script>
