---
layout: post
title: "Transit-js Caching"
description: ""
category: 
tags: []
---
{% include JB/setup %}

One of the nicest features of
[Transit](https://github.com/cognitect/transit-format) and thus
[transit-js](https://github.com/cognitect/transit-js) is the standard
caching mechanism. Query results often contain an incredible amount of
data duplication in the map keys and Transit largely eliminates this
problem for you.

Periodically users have requested that the caching mechanism be
extended beyond just map keys to richer data structures. It turns out
this feature has existed within Transit in plain sight since its
initial release. As usual, better data structures save the day, the
presence of ES6-like Maps in **transit-js** makes the solution nearly
trivial ...

Imagine you have a type `Point` that looks like the following:

```js
var transit = require("transit-js");

var Point = function(x, y) {
    this.x = x;
    this.y = y;
};
```

You write your `PointHandler` and construct a Transit writer and write
out the following bit of data:

```js
var write = transit.writer("json", {
    "handlers": transit.map([
        Point, (new PointHandler())        
    ])
});

var p = new Point(1.5,2.5);

console.log(writer.write([p, p, p]));
```

What will we get in return?

```js
[["~#point",[1.5,2.5]],["^0",[1.5,2.5]],["^0",[1.5,2.5]]]
```

The keys were cached, but obviously we're not successfully eliminating
the real data duplication here. If you try to serialize something less
trivial like application state you'll quickly find yourself in
trouble.

## Custom Write Handlers With Caching

We need to duplicate the idea behind Transit's key caching. Key
caching works because the traversal order for reading and writing is
precisely the same. With this knowledge we can build a caching system on
top of Transit with the help of some Maps!

Examine our new caching `PointHandler`:

```js
var PointHandler = function(cache) {
    this.cache = cache;
};
PointHandler.prototype.tag = function(v, h) {
    if(this.cache.toId.get(v)) {
        return "cache";
    } else {
        return "point";
    }
};
PointHandler.prototype.rep = function(v, h) {
    var id = this.cache.toId.get(v)
    if(!id) {
        this.cache.toId.set(v, this.cache.curId++);
        return [v.x, v.y];
    } else {
        return id;
    }
};
```

We construct the `PointHandler` with a shared `cache` object. This
`cache` object has two properties `toId`, a **transit-js** Map from an
arbitrary object to its cache id, and `curId` the current cache id.

When we go to get its representation if it's the first time we've seen
it we add it to the cache and return the full representation. Because
we're using real Maps *we're not restricted to string based keys*. We
can easily and efficiently map objects to integers.

Of course if we have seen the object before we simply return its integer
id.

That's it! Now let's write a `cachingWrite` function:

```js
function cachingWrite(obj) {
    var cache = {
            toId: transit.map(),
            curId: 1
        },
        writer = transit.writer("json", {
            "handlers": transit.map([
                Point, (new PointHandler(cache))
            ])
        });

    return writer.write(obj);
};
```

Let's try it out:

```js
console.log(cachingWrite([p,p,p]));
```

What do we get?

```js
[["~#point",[1.5,2.5]],["~#cache",1],["^1",1]]
```

This should put a smile on your face. The second time we see a cached
value we emit the `"cache"` tagged value. The third time we emit, the
standard Transit key caching kicks in and we get a very succinct
representation.

What about reading this back out?

## Custom Read Handler With Caching

Writing `cachingRead` is quite a bit simpler than `cachingWrite`:

```js
function cachingRead(obj) {
    var cache = {
            fromId: transit.map(),
            curId: 1
        },
        reader = transit.reader("json", {
            "handlers": {
                "point": function (v, h) {
                    var ret = new Point(v[0], v[1]);
                    cache.fromId.set(cache.curId++, ret);
                    return ret;
                },
                "cache": function (v, h) {
                    return cache.fromId.get(v);
                }
            }
        });

    return reader.read(obj);
};
```

Let's roundtrip!

```js
console.log(cachingRead(cachingWrite([p,p,p])));
```

And we'll get the following result:

```js
[{x: 1.5, y: 2.5 , {x: 1.5, y: 2.5}, {x: 1.5, y: 2.5}]
```

Go forth and serialize your application states into efficiently packed JSON values!
