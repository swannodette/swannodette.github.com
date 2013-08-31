---
layout: post
title: "Asynchronous Error Handling"
description: ""
category: 
tags: ["javascript", "async", "promises", "csp", "core.async"]
---
{% include JB/setup %}

*This blog post came to be after some great discussions with
[James Long](http://twitter.com/jlongster) about the best way to
handle errors if CSP is your concurrency model. He showed some neat
JavaScript sketches for converting channel errors into exceptions
that I tweaked for core.async*

In order for
[JavaScript Promise](http://promises-aplus.github.io/promises-spec/)
implementations to be useful they must provide some mechanism for
handling and propagating errors. But the reason Promise
implementations must bear this burden is because JavaScript doesn't
have yield! By bearing this burden they actually complicate finding
error sources as they pollute the stack trace.

This will all be changing soon with the arrival of ES6 Generators.

To see what ES6 Generators can provide we can compare a typical
snippet of Promises based async JavaScript by
[Domenic Denicola](http://twitter.com/domenic) to a version in
[core.async](http://clojure.com/blog/2013/06/28/clojure-core-async-channels.html). Domenic's
snippet appeared in his interesting blog post last year,
[You're Missing the Point of Promises](http://domenic.me/2012/10/14/youre-missing-the-point-of-promises/).

```
getTweetsFor("swannodette")
  .then(function (tweets) {
    var shortUrls = parseTweetsForUrls(tweets);
    var mostRecentShortUrl = shortUrls[0];
    return expandUrlUsingTwitterApi(mostRecentShortUrl);
  })
  .then(httpGet)
  .then(
    function (responseBody) {
      console.log("Most recent link text:", responseBody);
    },
    function (error) {
      console.error("Error with the twitterverse:", error);
    }
  );
```

If you are familiar with purely callback based JavaScript this is a
considerable improvement. This snippet demonstrates how any error in
the code or the asynchronous calls may be caught uniformly - much like
`try/catch` except uglier and you will get garbage in your stack trace.

However if you have a yield construct the code collapses into
something far more readable - *in fact precisely the code you
would write if it was synchronous and you can recover
sensible stack traces*. The equivalent code in core.async:

```
(go (try
      (let [tweets    (<? (get-tweets-for "swannodette"))
            first-url (<? (expand-url (first (parse-urls tweets))))
            response  (<? (http-get first-url))]
        (. js/console (log "Most recent link text:" response)))
      (catch js/Error e
        (. js/console (error "Error with the twitterverse:" e)))))
```

`<?` is just a touch of macro sugar that expands into something
like `(throw-err (<! [expr]))`. In core.async `<!` serves the
same purpose as ES6's `yield` operator. If an asynchronous process
writes an error onto its channel we will convert it into an exception.

*Because we can short circuit and throw an exception we will get more
sensible stacktraces!* In a promise implementation an error will
cascade completely mangling the stack trace. Some of the mature
promise implementations attempt to recover this information but as we
can see here such contorted solutions are unnecessary.

Everything in this post could be accomplished by combining ES6
Generators, a channel implementation, and a little bit of
[sweet.js](http://sweetjs.org). Importantly channels need only focus
on flexibility and efficiency - no need to bear the burden of error
handling or acrobatics and requisite optional configuration to recover
the stack.

While Promises have enamoured some people in the JavaScript community
ultimately I believe they are a dead end on the path to simple,
readable, robust code in highly asynchronous environments like web
browsers.

*For details on how you can model CSP with ES6 Generators see my
 [previous post](http://swannodette.github.io/2013/08/24/es6-generators-and-csp/)*
