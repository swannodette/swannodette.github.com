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

Here is a simple user interface component:

<div id="ex0"></div>

Here is the exact same interface component again peeking under the blindfold:

<div id="ex1"></div>

Click on the checkboxes should convince you that they are backed by
the same data.

<script src="/assets/js/react.js"></script>
<script src="/assets/js/instrument/out/goog/base.js" type="text/javascript"></script>
<script src="/assets/js/instrument/main.js" type="text/javascript"></script>
<script type="text/javascript">goog.require("blog.instrument.core");</script>
