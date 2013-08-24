---
layout: post
title: "Make No Promises"
description: ""
category: 
tags: []
---
{% include JB/setup %}

<style>
  #ex0 {
    background-color: #efefef;
    padding: 20px 0px;
    text-align: center;
  }
  #ex0 button {
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
  #ex0 button:active {
    background-color: #ccccff;
  }
  #ex0 #when-time {
    padding-top: 30px;
    height: 50px;
    font-size: 32px;
    font-family: Inconsolata;
  }
</style>

I suggest checking out the following examples in Google Chrome Canary.

[Promises](http://promises-aplus.github.io/promises-spec/) are all the
rage in the JavaScript world even though they don't actually eliminate
callback hell and their performance characteristics leave much to be
desired for the vast universe of interactive applications known as
user interfaces.

Here is a simple benchmark in one of the fastest promises
implementation, When.js. I do not recommend trying it anything but a
desktop browser - it will consume nearly >600 megabytes of RAM. For
the desktop users click the button to see how long this computation
takes (be patient):

```
var first = when.defer(), last = first.promise;

for(var i = 0; i < 1000000; i++) {
  last = last.then(function(val) {
    return val + 1;
  });
}

var s = new Date();
first.resolve(0);
last.then(function(val) {
  console.log(val, " elapsed ms:", (new Date())-s);
});
```



<div id="ex0">
  <button onclick="goWhen()">Go!</button>
  <div id="when-time"></div>
</div>

<script>
    window.define = function(factory) {
        try{ delete window.define; } catch(e){ window.define = void 0; } // IE
        window.when = factory();
    };
    window.define.amd = {};
</script>
<script src="/assets/js/when.js"></script>
<script src="/assets/js/when_ex.js"></script>
