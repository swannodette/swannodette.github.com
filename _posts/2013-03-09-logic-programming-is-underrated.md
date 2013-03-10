---
layout: post
title: "Logic Programming is Underrated"
description: ""
category: 
tags: []
---
{% include JB/setup %}

Mark Engleberg wrote a very interesting post titled
[Logic Programming is Overrated](http://programming-puzzler.blogspot.com/2013/03/logic-programming-is-overrated.html). I
take issue with a quite a few points made in that post and I would
like to address a couple of them here.

First off, yes, list comprehensions are an excellent concise, readable
way to do search when the search is reasonably small and when you
don't really care about performance. That said making any judgements
about core.logic and its utility for solving problems based on
blogpost code written by someone having a bit of fun makes little
sense in my opinion - imagine judging the utility of object oriented
or functional programming this way.

What follows is an explanation of how I would approach the
problem. The main insight here is the original problem is a finite
domain problem in disguise - suprisingly similar to solving sudoku!

My solution solves the puzzle about five times faster on my machine
than Mark's optimized list comprehension version without any change
to the order of the rules.

Admittedly, Mark's version wins on the readability and concisions
fronts due to the moving between keywords and integers in my
code. This could be avoided with support for CLP(Set) which is on the
roadmap for core.logic and I sketch my ideal puzzle solution near the
bottom of the post.

Here's my approach to the puzzle solution:

<pre>
(defn puzzle []
  (let [vs (take 20 (repeatedly lvar))
        ps (->> (partition 4 vs)
             (map #(into {}
               (map vector [:name :cheese :mag :reserv] %)))
             (into []))]
    (run 1 [q]
      (== q ps)
      (everyg #(fd/in % (fd/interval 1 5)) vs)
      (everyg fd/distinct (apply map vector (map vals ps)))
      (conde
        [(ruleo q :name :landon :reserv :730pm)
         (ruleo q :name :jason :cheese :mozzarella)]
        [(ruleo q :name :landon :cheese :mozzarella)
         (ruleo q :name :jason :reserv :730pm)]) ;; 1
      (ruleo q :cheese :blue :mag :fortune) ;; 2
      (fresh [x]
        (!= x (-> p->i :mag :vogue))
        (ruleo q :cheese :muenster :mag x)) ;; 3
      (peopleo q
        [[:mag :fortune] [:name :landon] [:reserv :5pm]
         [:cheese :mascarpone] [:mag :vogue]]) ;; 4
      (fresh [x]
        (!= x (-> p->i :mag :time))
        (ruleo q :reserv :5pm :mag x)) ;; 5
      (earliero q :mag :cosmopolitan :cheese :mascarpone) ;; 6
      (earliero q :cheese :blue :name :bailey) ;; 7
      (conde
        [(ruleo q :reserv :7pm :mag :fortune)]
        [(ruleo q :reserv :730pm :mag :fortune)]) ;; 8
      (earliero q :mag :time :name :landon) ;; 9
      (fresh [x]
        (!= x (-> p->i :mag :fortune))
        (ruleo q :name :jamari :mag x)) ;; 10
      (ruleo q :reserv :5pm :cheese :mozzarella)))) ;; 11
</pre>

This above solution takes about 84ms on my machine campared to about 430ms
with a list comprehension. Note that I freely use `run*` over `run 1`, it
makes no difference.

It's worth pondering exactly how a generic solution like this with no goal
reordering can outperform a tuned list comprehension.

In summary, do you need logic programming to solve logic puzzles?
*Absolutely not!* Should you implement logic puzzles using core.logic?
*Most definitely!* Importantly, you absolutely need to try both
approaches in order to understand the tradeoffs. What bothered me about
Mark's post was the abundance of claims with little evidence of
core.logic experience.

You can see the entire solution for the puzzle
[here](http://gist.github.com/swannodette/5127144). Again I'm not
completely satisfied with this, I look forward to something more like
[this](http://gist.github.com/swannodette/5127150),
which in my humble opinion, is pretty sweet.

As to whether logic programming is useful for "real world" problems, I
recommend picking up a Bratko's 4th edition of
[Prolog Programming for Artificial Intelligence](http://www.amazon.com/Programming-Artificial-Intelligence-International-Computer/dp/0321417461)
and/or
[Concepts, Techniques, and Models of Computer Programming](http://www.amazon.com/Concepts-Techniques-Models-Computer-Programming/dp/0262220695). Both
are eye-opening as far as how broadly these approaches can be applied.

If you don't trust books talk to Martin Trojer who has used core.logic
at the bank UBS or talk to ThreatGRID - they run core.logic on a 12
64-core blade cluster to do threat analysis on the fly (with the rules
written by domain experts - I guess the DSL isn't too "complex" for them).

Mark's post had plenty of valid points like better integration with
Clojure, tracing goal execution, integration with external solvers,
[we're working on it](http://github.com/clojure/core.logic/wiki/Development).
    
