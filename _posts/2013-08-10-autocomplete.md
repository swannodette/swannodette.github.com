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
    height: 260px;
    background-color: #efefef;
    padding: 10px;
  }

  #ac-container {
    width: 562px;
  }

  #ac-ex0 input {
    width: 100%;
    padding: 5px;
    font-size: 15px;
    font-family: inconsolata;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
  }

  #ac-ex0 ul {
    width: 100%;
    background-color: white;
    margin: 0;
    font-family: inconsolata;
    border-left: 1px solid #ccc;
    border-right: 1px solid #ccc;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
  }

  #ac-ex0 li {
    list-style: none;
    padding: 0 0 0 8px;
    margin: 0;
    border-bottom: 1px solid #ccc;
  }
</style>

<div id="ac-ex0">
    <div class="ac-container">
        <input id="autocomplete" type="text"/>
        <ul id="autocomplete-menu"></ul>
    </div>
</div>

<script type="text/javascript" src="/assets/js/ac.js"></script>
