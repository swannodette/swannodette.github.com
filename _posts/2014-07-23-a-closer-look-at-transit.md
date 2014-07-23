---
layout: post
title: "A Closer Look at Transit"
description: ""
category: 
tags: ["javascript", "transit"]
---
{% include JB/setup %}

*Disclaimer: I am an employee of Cognitect and I worked on the
 [transit-js](http://github.com/cognitect/transit-js) implementation. Most of
 the opinions found herein are my own and do not necessarily reflect the
 recommendations or views of Cognitect.*

By now you may have heard of something called
[Transit](http://blog.cognitect.com/blog/2014/7/22/transit), a new format for
conveying values between heterogenous systems. Transit seemed to generate a lot
of interest but given the quality of many of the comments on the announcement
post and elsewhere like [Hacker
News](https://news.ycombinator.com/item?id=8069346) it seems
many people may have largely missed the point.

Admittedly this state affairs is not entirely the fault of the audience. I've
had the pleasure of using software designed under the guidance of [Rich
Hickey](http://www.infoq.com/presentations/Simple-Made-Easy) for seven years
now. Often his design decisions cover nuanced territory with far more dimensions
than can be communicated in a single well articulated blog post. I'll try here
to illuminate some valuable properties of Transit that I think were largely
overlooked due to the Internet fog machine. We'll make some of these points
concrete via an example in [Node.js](http://nodejs.org) ([Ruby](http://github.com/cognitect/transit-ruby),
[Python](http://github.com/cognitect/transit-ruby),
[Java](http://github.com/cognitect/transit-ruby),
[Clojure](http://github.com/cognitect/transit-ruby) work just as well). We'll
communicate with client side JavaScript but you can use whatever compile to
JavaScript language you prefer.

But before we do any of that let's address something that appeared with
surprising frequency yesterday - *"Why not use existing format X
instead?"*. This kept getting asked even though the third sentence of the
announcement post read:

> *JSON currently dominates similar use cases*, but it has a limited set of types,
> no extensibility, and is verbose. Actual applications of JSON are rife with ad
> hoc and context-dependent workarounds for these limitations, yielding coupled
> and fragile programs.

Yet people continued to enumerate existing formats which do not actually compete
in the same design space as JSON. If you use some binary data format you are
unlikely to be the target consumer of Transit. If you do use JSON, like the
benefits of JSON and are OK with something comparable in performance to JSON,
then Transit is well worth thinking long and hard about.

Why?

Lets take a typical API result, for example the [JSON response from Twitter's
search api](https://dev.twitter.com/docs/api/1/get/search):

```
{
  "completed_in":0.031,
  "max_id":122078461840982016,
  "max_id_str":"122078461840982016",
  "next_page":"?page=2&max_id=122078461840982016&q=blue%20angels&rpp=5",
  "page":1,
  "query":"blue+angels",
  "refresh_url":"?since_id=122078461840982016&q=blue%20angels",
  "results":[
    {
      "created_at":"Thu, 06 Oct 2011 19:36:17 +0000",
      "entities":{
        "urls":[
          {
            "url":"http://t.co/L9JXJ2ee",
            "expanded_url":"http://bit.ly/q9fyz9",
            "display_url":"bit.ly/q9fyz9",
            ...
          }
        ]
      },
  ...
}
```

Obviously we can represent strings and some numbers just fine with JSON -
but fields like `created_at`, `url`, `expanded_url` have lost their
meaning. It's likely that this JSON response was generated with `URI` and
`DateTime` instances in hand but on the wire they simply become strings. The
receiver now must know which parts of this response represents which values. Is the
convenience of `JSON.stringify` worth the lossy encoding?

Contrast this to a transit-js value before encoding where `t` is `transit` and
`URI` is the constructor from the [URIjs](http://medialize.github.io/URI.js/)
library:

```
t.map([
  "completed_in", 0.031,
  "max_id", 122078461840982016,
  "max_id_str", "122078461840982016",
  "next_page", "?page=2&max_id=122078461840982016&q=blue%20angels&rpp=5",
  "page", 1,
  "query", "blue+angels",
  "refresh_url", "?since_id=122078461840982016&q=blue%20angels",
  "results", [
    t.map([
      "created_at", new Date("Thu, 06 Oct 2011 19:36:17 +0000"), // <<<
      "entities", t.map([
        "urls", [
          t.map([
            "url", URI("http://t.co/L9JXJ2ee"), // <<<
            "expanded_url", URI("http://bit.ly/q9fyz9"), // <<<
            "display_url", "bit.ly/q9fyz9",
            "indices", [37,57]])
        ]]), ...])
  ...
])
```

When this value is written with, transit does not discard the important
semantic information needed to interpret this data upon arrival at the
client. If we're using JavaScript on the front and back end it's simple to
[share
handlers](http://github.com/swannodette/transit-js-example/blob/master/shared/handlers.js),
so we get the same types in both places.

Contrast using JSON versus using transit-js on the front end:

```
(function(global) {
    var j  = global.jQuery,
        _  = global.underscore,
        t  = global.transit,
        th = global.transitHandlers,
        r  = transit.reader("json", {
                 handlers: _.extend(th.readHandlers, {
                    "m": function(v) {
                        return global.moment(parseInt(v,10));
                    }
                 })
             });

    j.get("json", function(data) {
        var aString = data["result"][0]["created_at"];
        console.log(aString);
    });

    j.ajax({
        type: "GET",
        url: "transit",
        complete: function(res) {
            var data = r.read(res.responseText),
                date = data.get("results")[0].get("created_at"),
            console.log(date.add("days", 7).format('MMMM Do YYYY, h:mm:ss a'));
        }
    });
})(this);
```

In the case of JSON you are stuck with a string. In the case of transit-js we can
override the read handlers to use [moment.js](http://momentjs.com/) to hydrate
all Transit dates. If we extracted urls we'd get URIjs URI instances with
sensible methods. With fast ES6-like maps and sets and user extensibility baked
in you can transport values that best describe your application without chaining
yourself to the representational boundaries imposed by JSON.

But at what cost?

<img style="border: 1px solid #ccc" src="/assets/images/transit_net.png" />

The transit-js version of the original Twitter payload is smaller and does not
take measurably longer to transmit to the client.

Here's a Chrome Dev Tools JavaScript profile to determine where our program is
spending it's time. Note how far down the profile transit-js appears:

<img style="border: 1px solid #ccc" src="/assets/images/profile.png" />

You can profile under Firefox, Opera, Safari, and Internet Explorer the results
will be much the same.

You can find the [entire
example](http://github.com/swannodette/transit-js-example) shown here on GitHub.
