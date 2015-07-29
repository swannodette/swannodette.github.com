---
layout: post
title: "ClojureScript Next"
description: ""
category: 
tags: []
---
{% include JB/setup %}

<link href="/assets/css/codemirror.css" rel="stylesheet"></link>
<link href="/assets/css/cljs-next/main.css" rel="stylesheet"></link>

## Clojurescript 1.7

Yes, at long last ClojureScript has a version number. Enthusiastic
users have often asked *How long till 1.0?*. However 1.0 would not
correctly reflect the time, effort, and feature set that comes with
four years of very active development. Instead we're adopting 1.7 as
this communicates the incredibly important relationship that
ClojureScript has with its parent language Clojure.

One the biggest aspect of this relationship - the differences between
Clojure and ClojureScript are quite small. So much so that with the
help of reader conditionals, a port of tools.reader, and some
dedicated effort over the past two months, ClojureScript can now
compile itself.

## Our Old Friend, Eval

Let's cut to the chase. The following is a simple ClojureScript
program that creates a definition and immediately invoke it. Click
the **EVAL** button.

<div class="eval-cljs">
    <textarea id="ex0" class="code"></textarea>
    <div class="eval-ctrl">
        <input id="ex0-out" type="text"></input>
        <button id="ex0-run" class="eval">EVAL</button>
    </div>
</div>

<script type="text/javascript"
src="/assets/js/cljs_next/main.js"></script>
