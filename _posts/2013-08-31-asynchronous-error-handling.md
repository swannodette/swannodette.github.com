---
layout: post
title: "Asynchronous Error Handling"
description: ""
category: 
tags: ["javascript", "async", "promises", "csp", "core.async"]
---
{% include JB/setup %}

In order for
[JavaScript Promise](http://promises-aplus.github.io/promises-spec/)
implementations to be useful they must provide some mechanism for
handling and propagating errors. But the reason Promise
implementations must bear this burden is because JavaScript doesn't
have yield! This will be changing soon with the arrival of ES6
Generators.

To see what ES6 Generators can provide we can compare a typical
snippet of Promises based async JavaScript by
[Domenic Denicola](http://twitter.com/domenic) to a version in
core.async. Domenic's snippet appeared in his interesting blog post last
year,
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
`try/catch` except uglier.

However if you have a yield construct the code collapses into
something far more readable - *in the fact precisely the code you
would write if it was synchronous*. The equivalent code in core.async:

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
