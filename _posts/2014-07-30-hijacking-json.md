---
layout: post
title: "Immutable JSON"
description: ""
category: 
tags: []
draft: true
---
{% include JB/setup %}

Facebook just released
[immutable-js](https://github.com/facebook/immutable-js) [a persistent
data structure
library](http://en.wikipedia.org/wiki/Persistent_data_structure) for
JavaScript. In this post I'm going to demonstrate consuming [JSON](http://json.org) with
[transit-js](http://github.com/cognitect/transit-js) and producing
immutable-js values instead of JavaScript objects and arrays.

If you have [Node.js](http://nodejs.org) installed you can follow the
code presented in the post easily on your machine. Create a directory
on your machine and add the following `package.json` file to it:

```js
{
    "name": "immutable-json",
    "version": "0.1.0",
    "dependencies": {
        "immutable": "2.0.1",
        "transit-js": "0.8.670"
    }
}
```

Then run the following at the command line to install the
dependencies:

```
npm install
```

Create a JavaScript file and put the following requires at the top:

```js
var Immutable = require("immutable"),
    transit   = require("transit-js");
```

transit-js exposes two low-level options `arrayBuilder` and
`mapBuilder` for constructing readers. This allows readers to
interpret the meaning of the [Transit](http://transit-format.org)
array and map encodings.

We can customize a reader to return `Immutable.Vector` and `Immutable.Map`
like so:

```js
var rdr = transit.reader("json", {
    arrayBuilder: {
        init: function(node) { return Immutable.Vector().asMutable(); },
        add: function(ret, val, node) { return ret.push(val); },
        finalize: function(node) { return ret.asImmutable(); },
        fromArray: function(arr, node) { return Immutable.Vector.from(arr); }
    },
    mapBuilder: {
        init: function(node) { return Immutable.Map().asMutable(); },
        add: function(ret, key, val, node) { return ret.set(key, val);  },
        finalize: function(ret, node) { return ret.asImmutable(); }
    }
});
```

Note that the builder methods get the original node as contextual
information. By default transit-js builds the values
incrementally. transit-js can also build values at once from an array
as in the case of `Immutable.Vector`. Sadly this can't be done for
`Immutable.Map` yet. transit-js maps and ClojureScript both have an
array map type for maps with less than or equal to 8 keys and it is a
significant performance enhancement in time and space.

We can now read JSON objects and arrays into immutable maps and vectors:

```js
rdr.read("[1,2,3]"); // Vector [ 1, 2, 3 ]
rdr.read('{"foo":"bar"}'); // Map { foo: "bar" }
```

For writing we need to make write handlers. This is also pretty
straightforward:

```js
var VectorHandler = transit.makeWriteHandler({
    tag: function(v) { return "array"; },
    rep: function(v) { return v; },
    stringRep: function(v) { return null; }
});

var MapHandler = transit.makeWriteHandler({
    tag: function(v) { return "map"; },
    rep: function(v) { return v; },
    stringRep: function(v) { return null; }
});

var wrtr = transit.writer("json-verbose", {
   handlers: transit.map([
       Immutable.Vector, VectorHandler,
       Immutable.Map, MapHandler
   ]) 
});
```

And now we can roundtrip:

```js
wrtr.write(rdr.read("[1,2,3]")); // [1,2,3]
wrtr.write(rdr.read('{"foo":"bar"}')); // {"foo":"bar"}
```

If you're excited about getting immutable data from your server into
your [React client application](http://facebook.github.io/react/),
transit-js presents a pretty good story even if you marshal plain
JSON. However, if you change your backend to emit Transit JSON you
will see a fairly significant performance boost. If in the future
Immutable provides more efficient means to construct values as well as
exposing an array map type, you will be able deserialize immutable
values nearly as fast or faster than you can `JSON.parse` plain JSON
data in many modern browsers.
