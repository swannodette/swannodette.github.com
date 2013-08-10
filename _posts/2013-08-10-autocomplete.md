---
layout: post
title: "autocomplete"
description: ""
category: 
tags: []
---
{% include JB/setup %}

<style>
  #ac-ex0 {
    height: 200px;
    background-color: #efefef;
    padding: 10px;
  }

  #ac-ex0 input {
    padding: 5px;
    font-size: 15px;
    width: 550px;
    font-family: inconsolata;
  }
</style>

<div id="ac-ex0">
    <input id="autocomplete" type="text"/>
    <ul id="autocomplete-menu"></ul>
</div>

<script type="text/javascript" src="/assets/js/ac.js"></script>
