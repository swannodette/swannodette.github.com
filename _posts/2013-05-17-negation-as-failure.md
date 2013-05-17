---
layout: post
title: "Negation As Failure"
description: ""
category: 
tags: ["prolog", "negation", "core.logic"]
---
{% include JB/setup %}

While I should probably wrap up my nominal logic series, I'm instead
taking a detour to explain a new feature I just landed in core.logic -
Negation as Failure.

Despite Prolog's name (Programmation Logique), programming often feels
like anything but logic. One particular weakspot is negation. Take for
example the following simple Prolog program:
