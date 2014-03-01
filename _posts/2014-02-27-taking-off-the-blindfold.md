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
