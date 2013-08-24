---
layout: post
title: "ES6 Generators Deliver Go Style Concurrency"
description: ""
category: 
tags: []
---
{% include JB/setup %}

Last night I expressed some frustration about the state and future of
concurrency in JavaScript. I ended up having a little bit of back and
forth with [David Herman](https://twitter.com/littlecalculist) and he
pointed out that [ES6 Generators](http://wiki.ecmascript.org/doku.php?id=harmony:generators) can express [Go](http://golang.org/)
and core.async's flavor of
[CSP](http://en.wikipedia.org/wiki/Communicating_sequential_processes). Now
I had thought about this in the past but *I could not see how*. Part
of this was that I'd never seen how a CSP system works under the hood
(now I have months of core.async development under my belt)
and part of it was my distraction over the limitations of combining
Generators with Promises.

*I'd never considered combining Generators with something else*.

What follows is a minimal amount of code that works in Node.js 0.11
with the ES6 harmony command line setting. I'll explain
each part. The insight is to combine Generators with *Channels*.

This is our low level state machine stepper. `machine` is the
generator and `step` is the result of calling that generator at least
once via `next`. The result of calling `next` on a Generator is an
object with two fields `value`, and `done`.

```
function go_(machine, step) {
  while(!step.done) {
    var arr   = step.value(),
        state = arr[0],
        value = arr[1];

    switch (state) {
      case "park":
        setImmediate(function() { go_(machine, step); });
        return;
        break;
      case "continue":
        step = machine.next(value);
        break;
      default:
        break;
    }
  }
}
```

If the generator is not done we go into a loop. The `value` should be
a function which *attempts* to do some work and returns an array
representing an instruction for the machine. The first value in this
array is what the machine should do next. If this value is `"park"`
then we need to queue ourselves for later execution so we can retry
the function in `step.value`.

If instruction is `"continue"` we call `next` on the machine with the value
portion of the instruction. The yielded process can now continue with the
result of computation to the next step.

This is the actual `go` function users will call, it kicks things off.

```
function go(machine) {
  var gen = machine();
  go_(gen, gen.next());
}
```

What are channels? Channels are simply queues and the simplest way to
represent them is an array. Here is our first channel operation
that asynchronously puts a value onto a channel. Notice that it returns
the required instruction needed by `go_`. If the channel is empty we
can place a value in it, if it is not we park.

It's easy to imagine the sophisticated buffering strategies supported
by Go and core.async by using something other than arrays for channels.

```
function put(chan, val) {
  return function() {
    if(chan.length == 0) {
      chan.unshift(val);
      return ["continue", null];
    } else {
      return ["park", null];
    }
  };
}
```

Here is a take operation. If we're attempting to read off an empty
channel we'll park the machine. Otherwise we pop a value off the
channel and return a continue instruction to the machine.

```
function take(chan) {
  return function() {
    if(chan.length == 0) {
      return ["park", null];
    } else {
      var val = chan.pop();
      return ["continue", val];
    }
  };
}
```

We have a simple example program. We run two processes in parallel. If
you try this in Node.js 0.11 you will see they are interleaved.

```
var c = [];

go(function* () {
  var i = 0;
  while(i < 10) {
    yield put(c, i);
    console.log("process one put", i);
    i++;
  }
  yield put(c, null);
});
    
go(function* () {
  while(true) {
    var val = yield take(c);
    if(val == null) {
      break;
    } else {
      console.log("process two took", val);
    }
  }
});
```

Don't combine Generators with Promises, combine them with Channels!

With tools like [Traceur](http://github.com/google/traceur-compiler)
you can implement many of the ideas from my previous core.async blog
posts today in vanilla JavaScript.
