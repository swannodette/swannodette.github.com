(ns cljs-next.core
  (:require-macros [cljs.core.async.macros :refer [go]])
  (:require [goog.dom :as gdom]
            [goog.events :as events]
            [goog.object :as gobj]
            [cljs.js :as cljs]
            [cljs.analyzer :as ana]
            [cljs.tools.reader :as r]
            [cljs.tools.reader.reader-types :refer [string-push-back-reader]]
            [cljs.tagged-literals :as tags]
            [cljsjs.codemirror.mode.clojure]
            [cljsjs.codemirror.addons.matchbrackets]
            [cljs.core.async :as async :refer [chan <! >! put! take!]])
  (:import [goog.events EventType]
           [goog.net XhrIo]))

;; -----------------------------------------------------------------------------
;; Setup

(enable-console-print!)

;; create cljs.user
(set! (.. js/window -cljs -user) #js {})

(defn cm-opts []
  #js {:font-size 15
       :lineNumbers true
       :matchBrackets true
       :mode #js {:name "clojure"}})

(defn textarea->cm [id code]
  (let [ta (gdom/getElement id)]
    (js/CodeMirror
      #(.replaceChild (.-parentNode ta) % ta)
      (doto (cm-opts) (gobj/set "value" code)))))

(defn get-file [url]
  (let [c (chan)]
    (.send XhrIo url
      (fn [e]
        (put! c (.. e -target getResponseText))))
    c))

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
              (.error js/console error))))))))

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
      (go (read-core (<! (get-file core-url)))))))

;;-----------------------------------------------------------------------------
;; Example 2

(defn elide-meta [env ast opts]
  (dissoc ast :env))

(def ex2-src
  (str "(+ 1 1)"))

(defn ex2 []
  (let [ed  (textarea->cm "ex2" ex2-src)
        out (gdom/getElement "ex2-out")]
    (events/listen (gdom/getElement "ex2-run") EventType.CLICK
      (fn [e]
        (cljs/analyze st (.getValue ed) nil
          {:passes [ana/infer-type elide-meta]}
          (fn [{:keys [error value]}]
            (if-not error
              (set! (.-value out) value)
              (.error js/console error))))))))

;; -----------------------------------------------------------------------------
;; Main

(defn main []
  (ex0)
  (ex1))

(main)
