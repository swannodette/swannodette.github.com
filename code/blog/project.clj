(defproject blog "0.1.0-SNAPSHOT"
  :description "Code for swannodette.github.io"
  :url "http://swannodette.github.io"

  :license {:name "Eclipse Public License"
            :url "http://www.eclipse.org/legal/epl-v10.html"}

  :repositories {"sonatype-staging"
                 "https://oss.sonatype.org/content/groups/staging/"}

  :dependencies [[org.clojure/clojure "1.5.1"]
                 [org.clojure/clojurescript "0.0-1847"]
                 [org.clojure/core.async "0.1.0-SNAPSHOT"]]

  :plugins [[lein-cljsbuild "0.3.2"]]

  :cljsbuild
  {:builds
   [{:id "csp-dev"
     :source-paths ["src/"]
     :compiler {:optimizations :whitespace
                :pretty-print false
                :static-fns true
                :output-to "../../assets/js/csp.js"}}
    {:id "csp-adv"
     :source-paths ["src/csp"]
     :compiler {:optimizations :advanced
                :pretty-print false
                :output-to "../../assets/js/csp.js"}}]})
