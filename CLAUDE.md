# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is David Nolen's personal blog hosted at swannodette.github.com, built with Jekyll. The blog focuses on Lisp, Logic Programming, and JavaScript, with extensive ClojureScript examples and interactive demos.

## Common Development Commands

### Jekyll Site Development
- **Install dependencies**: `bundle install`
- **Start development server**: `rake preview` or `bundle exec jekyll serve --watch`
- **Build site**: `rake build` or `bundle exec jekyll build`
- **Create new blog post**: `rake post title="Post Title"` (optionally add `date="YYYY-MM-DD"`)
- **Create new page**: `rake page name="page-name.html"`

### ClojureScript Build Commands
Navigate to `code/blog/` directory for ClojureScript development:

- **Build all ClojureScript examples**: `lein cljsbuild once` (builds all configured targets)
- **Auto-rebuild during development**: `lein cljsbuild auto [build-id]`
- **REPL for development**: Use scripts in `code/blog/scripts/` directory

### Available ClojureScript Build Targets
Each example has both development and production builds:
- `csp-dev`/`csp-adv` - CSP (Communicating Sequential Processes) examples
- `proc-dev`/`proc-adv` - Process examples
- `resp-dev`/`resp-adv` - Responsive design examples
- `ac-dev`/`ac-adv` - Autocomplete examples
- `promises-simp`/`promises-adv` - Promise examples
- `errors-simp` - Error handling examples
- `instrument-dev`/`instrument-release` - Instrumentation examples
- `faster-dev`/`faster-release` - Performance examples
- `contracts-dev`/`contracts-release` - Contract examples
- `cljs-next-release` - ClojureScript compiler examples

## Architecture and Code Structure

### Jekyll Blog Structure
- `_posts/` - Blog posts in Markdown format with Jekyll front matter
- `_layouts/` - Jekyll templates (default.html, post.html, page.html)
- `_includes/` - Reusable Jekyll components and themes
- `assets/` - Static assets including compiled JavaScript, CSS, and images

### ClojureScript Code Organization
- `code/blog/src/blog/` - ClojureScript source code organized by topic:
  - `autocomplete/` - Auto-completion demos
  - `cljs_next/` - ClojureScript compiler examples with self-hosted compilation
  - `contracts/` - Contract programming examples
  - `csp/` - Communicating Sequential Processes examples
  - `errors/` - Error handling patterns
  - `faster/` - Performance optimization examples
  - `instrument/` - Development tooling examples
  - `processes/` - Process management examples
  - `promises/` - Promise/async programming examples
  - `responsive/` - Responsive UI examples
  - `utils/` - Shared utilities (DOM manipulation, helpers, reactive patterns)

### Key Technologies and Frameworks
- **Jekyll**: Static site generator with Bootstrap-based theme
- **ClojureScript**: Functional programming language compiling to JavaScript
- **Om**: ClojureScript React wrapper (version 0.9.0)
- **core.async**: Clojure/ClojureScript library for asynchronous programming
- **Transit**: Data serialization format
- **CodeMirror**: Code editor component for interactive examples

### Interactive Examples Pattern
Blog posts include interactive ClojureScript examples that:
1. Use CodeMirror for code editing in the browser
2. Compile and evaluate ClojureScript code client-side using cljs.js
3. Display results in real-time
4. Include both source code and compiled JavaScript output
5. Support macro expansion and analysis visualization

### Build Output Structure
- ClojureScript builds output to `assets/js/[example-name].js`
- Development builds use `:whitespace` or `:none` optimization
- Production builds use `:advanced` optimization with Google Closure Compiler
- Source maps are generated for development builds