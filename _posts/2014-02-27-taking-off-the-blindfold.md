---
layout: post
title: "Taking Off the Blindfold"
description: ""
category: 
tags: []
---
{% include JB/setup %}

<style>
  .radio label {
     margin-left: 0.5em;
  }
  .edit {
     width: 250px;
     border: 1px solid #ccc;
     padding: 4px;
     margin-left: 0.5em;
  }
  code {
     margin-left: 0.5em;
  }
</style>

<div style="padding: 10px 0px 10px 45px; border-bottom: 1px solid
#ccc;">
<blockquote class="twitter-tweet" lang="en"><p>If you don&#39;t respect inherent complexity, you create accidental complexity.</p>&mdash; David Herman (@littlecalculist) <a href="https://twitter.com/littlecalculist/statuses/436190079086645248">February 19, 2014</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>
</div>

David Herman's tweet hits the nail squarely on the head. However
there's a subtle assumption that the source of inherent complexity has
been identified.

Often technologies and methodologies purport to manage or avoid
incidental complexity, but quite often they do so without every
identifying the actual source of the problem.

Ungar et al. claim that in the realm of user interface programming all
complexity arises out of *use* vs. *mention*. The paper is sadly not
readily available so let me paraphrase them here.

Backbone.js

<blockquote>
Backbone.js gives structure to web applications by providing models with key-value binding and custom events, collections with a rich API of enumerable functions, views with declarative event handling, and connects it all to your existing API over a RESTful JSON interface.
</blockquote>

Angular.js

<blockquote>
HTML is great for declaring static documents, but it falters when we try to use it for declaring dynamic views in web-applications. AngularJS lets you extend HTML vocabulary for your application. The resulting environment is extraordinarily expressive, readable, and quick to develop.
</blockquote>

Ember.js

<blockquote>
Man should not be required to know his needs, and Man should be
permitted to change mind at any time without being penalized with
slave labor at his keyboard.
</blockquote>

<blockquote>
A framework for creating ambitious web applications.
</blockquote>

Here is a typical user interface element:

<div id="ex0"></div>

Here is the same element with the blindfold off:

<div id="ex1"></div>

Taking off the blindfold should not require us to change anything in the
original program. Instead we should be able to intercept the
particular part of the UI that interests us modify its behavior.

Of course this is the thinking behind

<script src="/assets/js/react.js"></script>
<script src="/assets/js/instrument/out/goog/base.js" type="text/javascript"></script>
<script src="/assets/js/instrument/main.js" type="text/javascript"></script>
<script type="text/javascript">goog.require("blog.instrument.core");</script>
