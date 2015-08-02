(ns cljs-next.core
  (:require [goog.dom :as gdom]
            [goog.events :as events]
            [goog.object :as gobj]
            [cljs.pprint :refer [pprint]]
            [cljs.js :as cljs]
            [cljs.analyzer :as ana]
            [cljs.tools.reader :as r]
            [cljs.tools.reader.reader-types :refer [string-push-back-reader]]
            [cljs.tagged-literals :as tags]
            [cljsjs.codemirror.mode.clojure]
            [cljsjs.codemirror.addons.matchbrackets]
            [cognitect.transit :as t])
  (:import [goog.events EventType]
           [goog.net XhrIo]))

;; -----------------------------------------------------------------------------
;; Setup

(enable-console-print!)

;; create cljs.user
(set! (.. js/window -cljs -user) #js {})

(defn cm-opts []
  #js {:fontSize 13
       :lineNumbers true
       :matchBrackets true
       :mode #js {:name "clojure"}})

(defn textarea->cm [id code]
  (let [ta (gdom/getElement id)]
    (js/CodeMirror
      #(.replaceChild (.-parentNode ta) % ta)
      (doto (cm-opts) (gobj/set "value" code)))))

(defn get-file [url cb]
  (.send XhrIo url
    (fn [e]
      (cb (.. e -target getResponseText)))))

(def st (cljs/empty-state))

;; -----------------------------------------------------------------------------
;; Example 0

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
              (do
                (set! (.-value out) "ERROR")
                (.error js/console error)))))))))

;;-----------------------------------------------------------------------------
;; Example 1

(def core-url "/assets/cljs/core.cljs")

(defn read-core [core]
  (let [t (with-out-str
            (time
              (let [rdr (string-push-back-reader core)
                    eof (js-obj)
                    env (ana/empty-env)]
                (binding [ana/*cljs-ns*   'cljs.user
                          *ns*            (create-ns 'cljs.core)
                          r/*data-readers* tags/*cljs-data-readers*]
                  (loop []
                    (let [form (r/read {:eof eof} rdr)]
                      (when-not (identical? eof form)
                        (recur))))))))]
    (set! (.-value (gdom/getElement "ex1-out")) t)))

(defn ex1 []
  (events/listen (gdom/getElement "ex1-run") EventType.CLICK
    (fn [e]
      (get-file core-url read-core))))

;;-----------------------------------------------------------------------------
;; Example 2

(defn elide-env [env ast opts]
  (dissoc ast :env))

(def ex2-src
  (str "(+ 1 1)"))

(defn ex2 []
  (let [ed0 (textarea->cm "ex2" ex2-src)
        ed1 (textarea->cm "ex2-out" "")]
    (events/listen (gdom/getElement "ex2-run") EventType.CLICK
      (fn [e]
        (cljs/analyze-str st (.getValue ed0) nil
          {:passes [ana/infer-type elide-env]}
          (fn [{:keys [error value] :as res}]
            (if-not error
              (.setValue ed1 (with-out-str (pprint value)))
              (.error js/console error))))))))

;;-----------------------------------------------------------------------------
;; Example 3

(def ex3-src
  (str "(js/alert (+ 1 1))\n"
       "(js/alert (aget #js [1 2 3] 0))\n"
       "(js/alert (fn []))\n"
       "(js/alert (if true \"foo\" \"bar\"))"))

(defn ex3 []
  (let [ed0 (textarea->cm "ex3" ex3-src)
        ed1 (textarea->cm "ex3-out" "")]
    (events/listen (gdom/getElement "ex3-run") EventType.CLICK
      (fn [e]
        (cljs/compile-str st (.getValue ed0) nil
          {:source-map true}
          (fn [{:keys [error value]}]
            (if-not error
              (.setValue ed1 value)
              (.error js/console error))))))))

;;-----------------------------------------------------------------------------
;; Example 4

(def ex4-src
  (str "(ns foo.core\n"
       "  (:require-macros\n"
       "    [bar.core :refer [mult]]))\n"
       "\n"
       "(mult 4 4)"))

(def bar-url "/assets/cljs/bar/core.clj")

(defn load [lib cb]
  (get-file bar-url
    (fn [src]
      (cb {:lang :clj :source src}))))

(defn ex4 []
  (let [ed0 (textarea->cm "ex4" ex4-src)
        ed1 (textarea->cm "ex4-out" "")]
    (events/listen (gdom/getElement "ex4-run") EventType.CLICK
      (fn [e]
        (cljs/compile-str st (.getValue ed0) 'foo.bar
          {:load load
           :eval cljs/js-eval
           :source-map true}
          (fn [{:keys [error value]}]
            (if-not error
              (.setValue ed1 value)
              (do
                (println (.. error -cause -stack))
                (.error js/console error)))))))))

;; -----------------------------------------------------------------------------
;; Main

(def cache-path
  "/assets/js/cljs_next/cljs/core.cljs.cache.aot.json")

(defn main []
  (get-file cache-path
    (fn [txt]
      (let [rdr   (t/reader :json)
            cache (t/read rdr txt)]
        (cljs/load-analysis-cache! st 'cljs.core cache)
        (ex0)
        (ex1)
        (ex2)
        (ex3)
        (ex4)))))

(main)
