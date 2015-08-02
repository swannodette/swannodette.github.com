(defproject blog "0.1.0-SNAPSHOT"
  :description "Code for swannodette.github.io"
  :url "http://swannodette.github.io"

  :license {:name "Eclipse Public License"
            :url "http://www.eclipse.org/legal/epl-v10.html"}

  :repositories {"sonatype-staging"
                 "https://oss.sonatype.org/content/groups/staging/"}

  :dependencies [[org.clojure/clojure "1.7.0"]
                 [org.clojure/clojurescript "1.7.33"]
                 [org.clojure/core.async "0.1.346.0-17112a-alpha"]
                 [org.clojure/core.match "0.3.0-alpha4"]
                 [org.omcljs/om "0.9.0"]
                 [cljsjs/codemirror "5.1.0-2"]
                 [com.cognitect/transit-clj "0.8.275"]
                 [com.cognitect/transit-cljs "0.8.220"]]

  :plugins [[lein-cljsbuild "1.0.6"]
            [cider/cider-nrepl "0.9.1"]]

  :source-paths ["src" "target/classes"]

  :cljsbuild
  {:builds
   [{:id "csp-dev"
     :source-paths ["src/blog/csp"
                    "src/blog/utils"]
     :compiler {:optimizations :whitespace
                :pretty-print false
                :output-to "../../assets/js/csp.js"}}
    {:id "csp-adv"
     :source-paths ["src/blog/csp"
                    "src/blog/utils"]
     :compiler {:optimizations :advanced
                :pretty-print false
                :output-to "../../assets/js/csp.js"
                :output-wrapper true}}

    {:id "proc-dev"
     :source-paths ["src/blog/processes"
                    "src/blog/utils"]
     :compiler {:optimizations :whitespace
                :pretty-print false
                :output-to "../../assets/js/proc.js"}}
    {:id "proc-adv"
     :source-paths ["src/blog/processes"
                    "src/blog/utils"]
     :compiler {:optimizations :advanced
                :pretty-print false
                :output-to "../../assets/js/proc.js"
                :output-wrapper true}}

    {:id "resp-dev"
     :source-paths ["src/blog/responsive"
                    "src/blog/utils"]
     :compiler {:optimizations :whitespace
                :pretty-print false
                :output-to "../../assets/js/resp.js"}}
    {:id "resp-adv"
     :source-paths ["src/blog/responsive"
                    "src/blog/utils"]
     :compiler {:optimizations :advanced
                :pretty-print false
                :output-to "../../assets/js/resp.js"
                :output-wrapper true}}

    {:id "ac-dev"
     :source-paths ["src/blog/autocomplete"
                    "src/blog/utils"]
     :compiler {:optimizations :whitespace
                :pretty-print false
                :output-to "../../assets/js/ac.js"}}
    {:id "ac-adv"
     :source-paths ["src/blog/autocomplete"
                    "src/blog/utils"]
     :compiler {:optimizations :advanced
                :pretty-print false
                :output-to "../../assets/js/ac.js"
                :output-wrapper true}}

    {:id "promises-simp"
     :source-paths ["src/blog/promises"
                    "src/blog/utils"]
     :compiler {:optimizations :simple
                :static-fns true
                :pretty-print false
                :output-to "../../assets/js/promises.js"}}
    {:id "promises-adv"
     :source-paths ["src/blog/promises"
                    "src/blog/utils"]
     :compiler {:optimizations :advanced
                :pretty-print false
                :output-to "../../assets/js/promises.js"
                :output-wrapper true}}

    {:id "errors-simp"
     :source-paths ["src/blog/errors"
                    "src/blog/utils"]
     :compiler {:optimizations :simple
                :static-fns true
                :pretty-print false
                :output-to "../../assets/js/errors.js"}}

    {:id "instrument-dev"
     :source-paths ["src/blog/instrument"]
     :compiler {:optimizations :none
                :source-map true
                :output-dir "../../assets/js/instrument/out"
                :output-to "../../assets/js/instrument/main.js"}}

    {:id "instrument-release"
     :source-paths ["src/blog/instrument"]
     :compiler {:optimizations :advanced
                :pretty-print false
                :output-to "../../assets/js/instrument/main.js"
                :preamble ["react/react.min.js"]
                :externs ["react/externs/react.js"]}}

    {:id "faster-dev"
     :source-paths ["src/blog/faster"]
     :compiler {:optimizations :none
                :source-map true
                :output-dir "../../assets/js/faster/out"
                :output-to "../../assets/js/faster/main.js"}}

    {:id "faster-release"
     :source-paths ["src/blog/faster"]
     :compiler {:optimizations :advanced
                :pretty-print false
                :output-to "../../assets/js/faster/main.js"}}

    {:id "contracts-dev"
     :source-paths ["src/blog/contracts"]
     :compiler {:optimizations :none
                :source-map true
                :output-dir "../../assets/js/contracts/out"
                :output-to "../../assets/js/contracts/main.js"}}

    {:id "contracts-release"
     :source-paths ["src/blog/contracts"]
     :compiler {:optimizations :advanced
                :pretty-print false
                ;:elide-asserts true
                :output-to "../../assets/js/contracts/main.js"}}

    #_{:id "cljs-next-dev"
     :source-paths ["src/blog/cljs_next"]
     :compiler {:optimizations :none
                :main cljs-next.core
                :dump-core false
                :source-maps true
                :verbose true
                :output-to "../../assets/js/cljs_next/main.js"
                :output-dir "../../assets/js/cljs_next"
                :asset-path "/assets/js/cljs_next"
                :foreign-libs
                [{:provides ["cljsjs.codemirror.addons.matchbrackets"]
                  :requires ["cljsjs.codemirror"]
                  :file "../../assets/js/codemirror/matchbrackets.js"}]}}

    {:id "cljs-next-release"
     :source-paths ["src/blog/cljs_next"]
     :compiler {:optimizations :simple
                :pretty-print false
                :dump-core false
                :static-fns true
                :optimize-constants true
                :verbose true
                :output-to "../../assets/js/cljs_next/main.js"
                :output-dir "../../assets/js/cljs_next"
                :asset-path "/assets/js/cljs_next"
                :foreign-libs
                [{:provides ["cljsjs.codemirror.addons.matchbrackets"]
                  :requires ["cljsjs.codemirror"]
                  :file "../../assets/js/codemirror/matchbrackets.js"}]}}
    ]})
