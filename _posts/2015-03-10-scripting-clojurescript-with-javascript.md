---
layout: post
title: "Scripting ClojureScript with JavaScript"
description: ""
category: 
tags: []
---
{% include JB/setup %}

The following code demonstrates how to script the ClojureScript
compiler with the Nashorn JavaScript engine that ships with Java 8.

Create a file called `build.js` with the following contents:

```js
// Use the Java interop clojure.lang.RT namespace to get at 
// Clojure vars
var ArrayList = java.util.ArrayList,
    RT = Packages.clojure.lang.RT,
    seq = RT.var("clojure.core", "seq");

// ================================================================================
// Bootstrap

// Nashorn JavaScript arrays don't satisfy java.util.List
// convert them into ArrayLists which do
var arrayToArrayList = function(arr) {
    var ret = new ArrayList();
    for(var i = 0; i < arr.length; i++) {
        ret.add(arr[i]);
    }
    return ret;
};

// Given a Clojure namespace and name get the var
// and return a JavaScript function which can invoke it
// in the usual JavaScript way
var varToFn = function(ns, name) {
    // if only given one argument assume the namespace
    // is clojure.core
    if(name == null) {
        name = ns;
        ns = "clojure.core";
    }
    var v = RT.var(ns, name);
    return function() {
        var args = arrayToArrayList(arguments);
        return v.applyTo(seq.invoke(args));
    };
};

var hashMap = varToFn("hash-map"),
    keyword = varToFn("keyword");

// Helper to convert JavaScript objects into Clojure
// hash maps
var objectToMap = function(obj) {
    var arr = new ArrayList();
    for(var p in obj) {
        arr.add(keyword(p.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()));
        arr.add(obj[p]);
    }
    return hashMap.apply(null, arr);
};

// =============================================================================
// Fun Starts Here

var symbol = varToFn("symbol"),
    require = varToFn("require");

// Load cljs.closure
require(symbol("cljs.closure"));

// The actual build fn
var build_ = varToFn("cljs.closure", "build");

// Define a build function that can take an JavaScript object
// with camelCase keys
function build(src, obj) {
    return build_(src, objectToMap(obj));
}

// Build!
build("src", {outputTo: "out/main.js"});
```

You can use this script in place of the `build.clj` script described
in the new
[ClojureScript Quick Start](https://github.com/clojure/clojurescript/wiki/Quick-Start)
by running the following instead:

```
jjs -J-Djava.class.path=cljs.jar build.js
```

Fun stuff.
