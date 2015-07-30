(ns cljs-next.core
  (:require-macros [cljs.core.async.macros :refer [go]])
  (:require [goog.dom :as gdom]
            [goog.events :as events]
            [goog.object :as gobj]
            [cljs.js :as cljs]
            [cljs.analyzer :as ana]
            [cljsjs.codemirror.mode.clojure]
            [cljsjs.codemirror.addons.matchbrackets]
            [cljs.core.async :as async :refer [chan <! >! put! take!]])
  (:import [goog.events EventType]))

(enable-console-print!)

;; create cljs.user
(set! (.. js/window -cljs -user) #js {})

(defn cm-opts []
  #js {:font-size 15
       :lineNumbers true
       :matchBrackets true
       :mode #js {:name "clojure"}})

(defn textarea->cm [id code]
  (let [ta (gdom/getElement "ex0")]
    (js/CodeMirror
      #(.replaceChild (.-parentNode ta) % ta)
      (doto (cm-opts) (gobj/set "value" code)))))

(def st (cljs/empty-state))

(cljs/eval-str st "(+ 1 2)" 'cljs-next.core
  {:eval cljs/js-eval
   :context :expr}
  (fn [res]
    (println res)))

(def ex0-src
  (str "(defn foo [a b]\n"
       "  (interleave (repeat a) (repeat b)))\n"
       "\n"
       "(take 5 (foo :read :eval))"))

(defn ex0 []
  (let [ed  (textarea->cm "ex0" ex0-src)
        out (gdom/getElement "ex0-out")]
    (events/listen (gdom/getElement "ex0-run") EventType.CLICK
      (fn [e]
        (cljs/eval-str st (.getValue ed) 'ex0.core
          {:eval cljs/js-eval
           :source-map true}
          (fn [{:keys [error value]}]
            (if-not error
              (set! (.-value out) value)
              (.error js/console error))))))))

(def ex1-src
  (str "(+ 1 1)"))

(defn elide-meta [env ast opts]
  (dissoc ast :env))

(defn ex1 []
  (let [ed  (textarea->cm "ex1" ex0-src)
        out (gdom/getElement "ex1-out")]
    (events/listen (gdom/getElement "ex1-run") EventType.CLICK
      (fn [e]
        (cljs/analyze st (.getValue ed) nil
          {:passes [ana/infer-type elide-meta]}
          (fn [{:keys [error value]}]
            (if-not error
              (set! (.-value out) value)
              (.error js/console error))))))))

(defn main []
  (ex0))

(main)
