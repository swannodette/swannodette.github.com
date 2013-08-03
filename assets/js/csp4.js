var COMPILED = !0, goog = goog || {};
goog.global = this;
goog.DEBUG = !0;
goog.LOCALE = "en";
goog.TRUSTED_SITE = !0;
goog.provide = function(a) {
  if(!COMPILED) {
    if(goog.isProvided_(a)) {
      throw Error('Namespace "' + a + '" already declared.');
    }
    delete goog.implicitNamespaces_[a];
    for(var b = a;(b = b.substring(0, b.lastIndexOf("."))) && !goog.getObjectByName(b);) {
      goog.implicitNamespaces_[b] = !0
    }
  }
  goog.exportPath_(a)
};
goog.setTestOnly = function(a) {
  if(COMPILED && !goog.DEBUG) {
    throw a = a || "", Error("Importing test-only code into non-debug environment" + a ? ": " + a : ".");
  }
};
COMPILED || (goog.isProvided_ = function(a) {
  return!goog.implicitNamespaces_[a] && !!goog.getObjectByName(a)
}, goog.implicitNamespaces_ = {});
goog.exportPath_ = function(a, b, c) {
  a = a.split(".");
  c = c || goog.global;
  a[0] in c || !c.execScript || c.execScript("var " + a[0]);
  for(var d;a.length && (d = a.shift());) {
    !a.length && goog.isDef(b) ? c[d] = b : c = c[d] ? c[d] : c[d] = {}
  }
};
goog.getObjectByName = function(a, b) {
  for(var c = a.split("."), d = b || goog.global, e;e = c.shift();) {
    if(goog.isDefAndNotNull(d[e])) {
      d = d[e]
    }else {
      return null
    }
  }
  return d
};
goog.globalize = function(a, b) {
  var c = b || goog.global, d;
  for(d in a) {
    c[d] = a[d]
  }
};
goog.addDependency = function(a, b, c) {
  if(!COMPILED) {
    var d;
    a = a.replace(/\\/g, "/");
    for(var e = goog.dependencies_, f = 0;d = b[f];f++) {
      e.nameToPath[d] = a, a in e.pathToNames || (e.pathToNames[a] = {}), e.pathToNames[a][d] = !0
    }
    for(d = 0;b = c[d];d++) {
      a in e.requires || (e.requires[a] = {}), e.requires[a][b] = !0
    }
  }
};
goog.ENABLE_DEBUG_LOADER = !0;
goog.require = function(a) {
  if(!COMPILED && !goog.isProvided_(a)) {
    if(goog.ENABLE_DEBUG_LOADER) {
      var b = goog.getPathFromDeps_(a);
      if(b) {
        goog.included_[b] = !0;
        goog.writeScripts_();
        return
      }
    }
    a = "goog.require could not find: " + a;
    goog.global.console && goog.global.console.error(a);
    throw Error(a);
  }
};
goog.basePath = "";
goog.nullFunction = function() {
};
goog.identityFunction = function(a, b) {
  return a
};
goog.abstractMethod = function() {
  throw Error("unimplemented abstract method");
};
goog.addSingletonGetter = function(a) {
  a.getInstance = function() {
    if(a.instance_) {
      return a.instance_
    }
    goog.DEBUG && (goog.instantiatedSingletons_[goog.instantiatedSingletons_.length] = a);
    return a.instance_ = new a
  }
};
goog.instantiatedSingletons_ = [];
!COMPILED && goog.ENABLE_DEBUG_LOADER && (goog.included_ = {}, goog.dependencies_ = {pathToNames:{}, nameToPath:{}, requires:{}, visited:{}, written:{}}, goog.inHtmlDocument_ = function() {
  var a = goog.global.document;
  return"undefined" != typeof a && "write" in a
}, goog.findBasePath_ = function() {
  if(goog.global.CLOSURE_BASE_PATH) {
    goog.basePath = goog.global.CLOSURE_BASE_PATH
  }else {
    if(goog.inHtmlDocument_()) {
      for(var a = goog.global.document.getElementsByTagName("script"), b = a.length - 1;0 <= b;--b) {
        var c = a[b].src, d = c.lastIndexOf("?"), d = -1 == d ? c.length : d;
        if("base.js" == c.substr(d - 7, 7)) {
          goog.basePath = c.substr(0, d - 7);
          break
        }
      }
    }
  }
}, goog.importScript_ = function(a) {
  var b = goog.global.CLOSURE_IMPORT_SCRIPT || goog.writeScriptTag_;
  !goog.dependencies_.written[a] && b(a) && (goog.dependencies_.written[a] = !0)
}, goog.writeScriptTag_ = function(a) {
  if(goog.inHtmlDocument_()) {
    var b = goog.global.document;
    if("complete" == b.readyState) {
      if(/\bdeps.js$/.test(a)) {
        return!1
      }
      throw Error('Cannot write "' + a + '" after document load');
    }
    b.write('\x3cscript type\x3d"text/javascript" src\x3d"' + a + '"\x3e\x3c/script\x3e');
    return!0
  }
  return!1
}, goog.writeScripts_ = function() {
  function a(e) {
    if(!(e in d.written)) {
      if(!(e in d.visited) && (d.visited[e] = !0, e in d.requires)) {
        for(var g in d.requires[e]) {
          if(!goog.isProvided_(g)) {
            if(g in d.nameToPath) {
              a(d.nameToPath[g])
            }else {
              throw Error("Undefined nameToPath for " + g);
            }
          }
        }
      }
      e in c || (c[e] = !0, b.push(e))
    }
  }
  var b = [], c = {}, d = goog.dependencies_, e;
  for(e in goog.included_) {
    d.written[e] || a(e)
  }
  for(e = 0;e < b.length;e++) {
    if(b[e]) {
      goog.importScript_(goog.basePath + b[e])
    }else {
      throw Error("Undefined script input");
    }
  }
}, goog.getPathFromDeps_ = function(a) {
  return a in goog.dependencies_.nameToPath ? goog.dependencies_.nameToPath[a] : null
}, goog.findBasePath_(), goog.global.CLOSURE_NO_DEPS || goog.importScript_(goog.basePath + "deps.js"));
goog.typeOf = function(a) {
  var b = typeof a;
  if("object" == b) {
    if(a) {
      if(a instanceof Array) {
        return"array"
      }
      if(a instanceof Object) {
        return b
      }
      var c = Object.prototype.toString.call(a);
      if("[object Window]" == c) {
        return"object"
      }
      if("[object Array]" == c || "number" == typeof a.length && "undefined" != typeof a.splice && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("splice")) {
        return"array"
      }
      if("[object Function]" == c || "undefined" != typeof a.call && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("call")) {
        return"function"
      }
    }else {
      return"null"
    }
  }else {
    if("function" == b && "undefined" == typeof a.call) {
      return"object"
    }
  }
  return b
};
goog.isDef = function(a) {
  return void 0 !== a
};
goog.isNull = function(a) {
  return null === a
};
goog.isDefAndNotNull = function(a) {
  return null != a
};
goog.isArray = function(a) {
  return"array" == goog.typeOf(a)
};
goog.isArrayLike = function(a) {
  var b = goog.typeOf(a);
  return"array" == b || "object" == b && "number" == typeof a.length
};
goog.isDateLike = function(a) {
  return goog.isObject(a) && "function" == typeof a.getFullYear
};
goog.isString = function(a) {
  return"string" == typeof a
};
goog.isBoolean = function(a) {
  return"boolean" == typeof a
};
goog.isNumber = function(a) {
  return"number" == typeof a
};
goog.isFunction = function(a) {
  return"function" == goog.typeOf(a)
};
goog.isObject = function(a) {
  var b = typeof a;
  return"object" == b && null != a || "function" == b
};
goog.getUid = function(a) {
  return a[goog.UID_PROPERTY_] || (a[goog.UID_PROPERTY_] = ++goog.uidCounter_)
};
goog.removeUid = function(a) {
  "removeAttribute" in a && a.removeAttribute(goog.UID_PROPERTY_);
  try {
    delete a[goog.UID_PROPERTY_]
  }catch(b) {
  }
};
goog.UID_PROPERTY_ = "closure_uid_" + (1E9 * Math.random() >>> 0);
goog.uidCounter_ = 0;
goog.getHashCode = goog.getUid;
goog.removeHashCode = goog.removeUid;
goog.cloneObject = function(a) {
  var b = goog.typeOf(a);
  if("object" == b || "array" == b) {
    if(a.clone) {
      return a.clone()
    }
    var b = "array" == b ? [] : {}, c;
    for(c in a) {
      b[c] = goog.cloneObject(a[c])
    }
    return b
  }
  return a
};
goog.bindNative_ = function(a, b, c) {
  return a.call.apply(a.bind, arguments)
};
goog.bindJs_ = function(a, b, c) {
  if(!a) {
    throw Error();
  }
  if(2 < arguments.length) {
    var d = Array.prototype.slice.call(arguments, 2);
    return function() {
      var c = Array.prototype.slice.call(arguments);
      Array.prototype.unshift.apply(c, d);
      return a.apply(b, c)
    }
  }
  return function() {
    return a.apply(b, arguments)
  }
};
goog.bind = function(a, b, c) {
  Function.prototype.bind && -1 != Function.prototype.bind.toString().indexOf("native code") ? goog.bind = goog.bindNative_ : goog.bind = goog.bindJs_;
  return goog.bind.apply(null, arguments)
};
goog.partial = function(a, b) {
  var c = Array.prototype.slice.call(arguments, 1);
  return function() {
    var b = Array.prototype.slice.call(arguments);
    b.unshift.apply(b, c);
    return a.apply(this, b)
  }
};
goog.mixin = function(a, b) {
  for(var c in b) {
    a[c] = b[c]
  }
};
goog.now = goog.TRUSTED_SITE && Date.now || function() {
  return+new Date
};
goog.globalEval = function(a) {
  if(goog.global.execScript) {
    goog.global.execScript(a, "JavaScript")
  }else {
    if(goog.global.eval) {
      if(null == goog.evalWorksForGlobals_ && (goog.global.eval("var _et_ \x3d 1;"), "undefined" != typeof goog.global._et_ ? (delete goog.global._et_, goog.evalWorksForGlobals_ = !0) : goog.evalWorksForGlobals_ = !1), goog.evalWorksForGlobals_) {
        goog.global.eval(a)
      }else {
        var b = goog.global.document, c = b.createElement("script");
        c.type = "text/javascript";
        c.defer = !1;
        c.appendChild(b.createTextNode(a));
        b.body.appendChild(c);
        b.body.removeChild(c)
      }
    }else {
      throw Error("goog.globalEval not available");
    }
  }
};
goog.evalWorksForGlobals_ = null;
goog.getCssName = function(a, b) {
  var c = function(a) {
    return goog.cssNameMapping_[a] || a
  }, d = function(a) {
    a = a.split("-");
    for(var b = [], d = 0;d < a.length;d++) {
      b.push(c(a[d]))
    }
    return b.join("-")
  }, d = goog.cssNameMapping_ ? "BY_WHOLE" == goog.cssNameMappingStyle_ ? c : d : function(a) {
    return a
  };
  return b ? a + "-" + d(b) : d(a)
};
goog.setCssNameMapping = function(a, b) {
  goog.cssNameMapping_ = a;
  goog.cssNameMappingStyle_ = b
};
!COMPILED && goog.global.CLOSURE_CSS_NAME_MAPPING && (goog.cssNameMapping_ = goog.global.CLOSURE_CSS_NAME_MAPPING);
goog.getMsg = function(a, b) {
  var c = b || {}, d;
  for(d in c) {
    var e = ("" + c[d]).replace(/\$/g, "$$$$");
    a = a.replace(RegExp("\\{\\$" + d + "\\}", "gi"), e)
  }
  return a
};
goog.getMsgWithFallback = function(a, b) {
  return a
};
goog.exportSymbol = function(a, b, c) {
  goog.exportPath_(a, b, c)
};
goog.exportProperty = function(a, b, c) {
  a[b] = c
};
goog.inherits = function(a, b) {
  function c() {
  }
  c.prototype = b.prototype;
  a.superClass_ = b.prototype;
  a.prototype = new c;
  a.prototype.constructor = a
};
goog.base = function(a, b, c) {
  var d = arguments.callee.caller;
  if(d.superClass_) {
    return d.superClass_.constructor.apply(a, Array.prototype.slice.call(arguments, 1))
  }
  for(var e = Array.prototype.slice.call(arguments, 2), f = !1, g = a.constructor;g;g = g.superClass_ && g.superClass_.constructor) {
    if(g.prototype[b] === d) {
      f = !0
    }else {
      if(f) {
        return g.prototype[b].apply(a, e)
      }
    }
  }
  if(a[b] === d) {
    return a.constructor.prototype[b].apply(a, e)
  }
  throw Error("goog.base called from a method of one name to a method of a different name");
};
goog.scope = function(a) {
  a.call(goog.global)
};
goog.debug = {};
goog.debug.Error = function(a) {
  Error.captureStackTrace ? Error.captureStackTrace(this, goog.debug.Error) : this.stack = Error().stack || "";
  a && (this.message = String(a))
};
goog.inherits(goog.debug.Error, Error);
goog.debug.Error.prototype.name = "CustomError";
goog.string = {};
goog.string.Unicode = {NBSP:"\u00a0"};
goog.string.startsWith = function(a, b) {
  return 0 == a.lastIndexOf(b, 0)
};
goog.string.endsWith = function(a, b) {
  var c = a.length - b.length;
  return 0 <= c && a.indexOf(b, c) == c
};
goog.string.caseInsensitiveStartsWith = function(a, b) {
  return 0 == goog.string.caseInsensitiveCompare(b, a.substr(0, b.length))
};
goog.string.caseInsensitiveEndsWith = function(a, b) {
  return 0 == goog.string.caseInsensitiveCompare(b, a.substr(a.length - b.length, b.length))
};
goog.string.subs = function(a, b) {
  for(var c = 1;c < arguments.length;c++) {
    var d = String(arguments[c]).replace(/\$/g, "$$$$");
    a = a.replace(/\%s/, d)
  }
  return a
};
goog.string.collapseWhitespace = function(a) {
  return a.replace(/[\s\xa0]+/g, " ").replace(/^\s+|\s+$/g, "")
};
goog.string.isEmpty = function(a) {
  return/^[\s\xa0]*$/.test(a)
};
goog.string.isEmptySafe = function(a) {
  return goog.string.isEmpty(goog.string.makeSafe(a))
};
goog.string.isBreakingWhitespace = function(a) {
  return!/[^\t\n\r ]/.test(a)
};
goog.string.isAlpha = function(a) {
  return!/[^a-zA-Z]/.test(a)
};
goog.string.isNumeric = function(a) {
  return!/[^0-9]/.test(a)
};
goog.string.isAlphaNumeric = function(a) {
  return!/[^a-zA-Z0-9]/.test(a)
};
goog.string.isSpace = function(a) {
  return" " == a
};
goog.string.isUnicodeChar = function(a) {
  return 1 == a.length && " " <= a && "~" >= a || "\u0080" <= a && "\ufffd" >= a
};
goog.string.stripNewlines = function(a) {
  return a.replace(/(\r\n|\r|\n)+/g, " ")
};
goog.string.canonicalizeNewlines = function(a) {
  return a.replace(/(\r\n|\r|\n)/g, "\n")
};
goog.string.normalizeWhitespace = function(a) {
  return a.replace(/\xa0|\s/g, " ")
};
goog.string.normalizeSpaces = function(a) {
  return a.replace(/\xa0|[ \t]+/g, " ")
};
goog.string.collapseBreakingSpaces = function(a) {
  return a.replace(/[\t\r\n ]+/g, " ").replace(/^[\t\r\n ]+|[\t\r\n ]+$/g, "")
};
goog.string.trim = function(a) {
  return a.replace(/^[\s\xa0]+|[\s\xa0]+$/g, "")
};
goog.string.trimLeft = function(a) {
  return a.replace(/^[\s\xa0]+/, "")
};
goog.string.trimRight = function(a) {
  return a.replace(/[\s\xa0]+$/, "")
};
goog.string.caseInsensitiveCompare = function(a, b) {
  var c = String(a).toLowerCase(), d = String(b).toLowerCase();
  return c < d ? -1 : c == d ? 0 : 1
};
goog.string.numerateCompareRegExp_ = /(\.\d+)|(\d+)|(\D+)/g;
goog.string.numerateCompare = function(a, b) {
  if(a == b) {
    return 0
  }
  if(!a) {
    return-1
  }
  if(!b) {
    return 1
  }
  for(var c = a.toLowerCase().match(goog.string.numerateCompareRegExp_), d = b.toLowerCase().match(goog.string.numerateCompareRegExp_), e = Math.min(c.length, d.length), f = 0;f < e;f++) {
    var g = c[f], h = d[f];
    if(g != h) {
      return c = parseInt(g, 10), !isNaN(c) && (d = parseInt(h, 10), !isNaN(d) && c - d) ? c - d : g < h ? -1 : 1
    }
  }
  return c.length != d.length ? c.length - d.length : a < b ? -1 : 1
};
goog.string.urlEncode = function(a) {
  return encodeURIComponent(String(a))
};
goog.string.urlDecode = function(a) {
  return decodeURIComponent(a.replace(/\+/g, " "))
};
goog.string.newLineToBr = function(a, b) {
  return a.replace(/(\r\n|\r|\n)/g, b ? "\x3cbr /\x3e" : "\x3cbr\x3e")
};
goog.string.htmlEscape = function(a, b) {
  if(b) {
    return a.replace(goog.string.amperRe_, "\x26amp;").replace(goog.string.ltRe_, "\x26lt;").replace(goog.string.gtRe_, "\x26gt;").replace(goog.string.quotRe_, "\x26quot;")
  }
  if(!goog.string.allRe_.test(a)) {
    return a
  }
  -1 != a.indexOf("\x26") && (a = a.replace(goog.string.amperRe_, "\x26amp;"));
  -1 != a.indexOf("\x3c") && (a = a.replace(goog.string.ltRe_, "\x26lt;"));
  -1 != a.indexOf("\x3e") && (a = a.replace(goog.string.gtRe_, "\x26gt;"));
  -1 != a.indexOf('"') && (a = a.replace(goog.string.quotRe_, "\x26quot;"));
  return a
};
goog.string.amperRe_ = /&/g;
goog.string.ltRe_ = /</g;
goog.string.gtRe_ = />/g;
goog.string.quotRe_ = /\"/g;
goog.string.allRe_ = /[&<>\"]/;
goog.string.unescapeEntities = function(a) {
  return goog.string.contains(a, "\x26") ? "document" in goog.global ? goog.string.unescapeEntitiesUsingDom_(a) : goog.string.unescapePureXmlEntities_(a) : a
};
goog.string.unescapeEntitiesUsingDom_ = function(a) {
  var b = {"\x26amp;":"\x26", "\x26lt;":"\x3c", "\x26gt;":"\x3e", "\x26quot;":'"'}, c = document.createElement("div");
  return a.replace(goog.string.HTML_ENTITY_PATTERN_, function(a, e) {
    var f = b[a];
    if(f) {
      return f
    }
    if("#" == e.charAt(0)) {
      var g = Number("0" + e.substr(1));
      isNaN(g) || (f = String.fromCharCode(g))
    }
    f || (c.innerHTML = a + " ", f = c.firstChild.nodeValue.slice(0, -1));
    return b[a] = f
  })
};
goog.string.unescapePureXmlEntities_ = function(a) {
  return a.replace(/&([^;]+);/g, function(a, c) {
    switch(c) {
      case "amp":
        return"\x26";
      case "lt":
        return"\x3c";
      case "gt":
        return"\x3e";
      case "quot":
        return'"';
      default:
        if("#" == c.charAt(0)) {
          var d = Number("0" + c.substr(1));
          if(!isNaN(d)) {
            return String.fromCharCode(d)
          }
        }
        return a
    }
  })
};
goog.string.HTML_ENTITY_PATTERN_ = /&([^;\s<&]+);?/g;
goog.string.whitespaceEscape = function(a, b) {
  return goog.string.newLineToBr(a.replace(/  /g, " \x26#160;"), b)
};
goog.string.stripQuotes = function(a, b) {
  for(var c = b.length, d = 0;d < c;d++) {
    var e = 1 == c ? b : b.charAt(d);
    if(a.charAt(0) == e && a.charAt(a.length - 1) == e) {
      return a.substring(1, a.length - 1)
    }
  }
  return a
};
goog.string.truncate = function(a, b, c) {
  c && (a = goog.string.unescapeEntities(a));
  a.length > b && (a = a.substring(0, b - 3) + "...");
  c && (a = goog.string.htmlEscape(a));
  return a
};
goog.string.truncateMiddle = function(a, b, c, d) {
  c && (a = goog.string.unescapeEntities(a));
  if(d && a.length > b) {
    d > b && (d = b);
    var e = a.length - d;
    a = a.substring(0, b - d) + "..." + a.substring(e)
  }else {
    a.length > b && (d = Math.floor(b / 2), e = a.length - d, a = a.substring(0, d + b % 2) + "..." + a.substring(e))
  }
  c && (a = goog.string.htmlEscape(a));
  return a
};
goog.string.specialEscapeChars_ = {"\x00":"\\0", "\b":"\\b", "\f":"\\f", "\n":"\\n", "\r":"\\r", "\t":"\\t", "\x0B":"\\x0B", '"':'\\"', "\\":"\\\\"};
goog.string.jsEscapeCache_ = {"'":"\\'"};
goog.string.quote = function(a) {
  a = String(a);
  if(a.quote) {
    return a.quote()
  }
  for(var b = ['"'], c = 0;c < a.length;c++) {
    var d = a.charAt(c), e = d.charCodeAt(0);
    b[c + 1] = goog.string.specialEscapeChars_[d] || (31 < e && 127 > e ? d : goog.string.escapeChar(d))
  }
  b.push('"');
  return b.join("")
};
goog.string.escapeString = function(a) {
  for(var b = [], c = 0;c < a.length;c++) {
    b[c] = goog.string.escapeChar(a.charAt(c))
  }
  return b.join("")
};
goog.string.escapeChar = function(a) {
  if(a in goog.string.jsEscapeCache_) {
    return goog.string.jsEscapeCache_[a]
  }
  if(a in goog.string.specialEscapeChars_) {
    return goog.string.jsEscapeCache_[a] = goog.string.specialEscapeChars_[a]
  }
  var b = a, c = a.charCodeAt(0);
  if(31 < c && 127 > c) {
    b = a
  }else {
    if(256 > c) {
      if(b = "\\x", 16 > c || 256 < c) {
        b += "0"
      }
    }else {
      b = "\\u", 4096 > c && (b += "0")
    }
    b += c.toString(16).toUpperCase()
  }
  return goog.string.jsEscapeCache_[a] = b
};
goog.string.toMap = function(a) {
  for(var b = {}, c = 0;c < a.length;c++) {
    b[a.charAt(c)] = !0
  }
  return b
};
goog.string.contains = function(a, b) {
  return-1 != a.indexOf(b)
};
goog.string.countOf = function(a, b) {
  return a && b ? a.split(b).length - 1 : 0
};
goog.string.removeAt = function(a, b, c) {
  var d = a;
  0 <= b && (b < a.length && 0 < c) && (d = a.substr(0, b) + a.substr(b + c, a.length - b - c));
  return d
};
goog.string.remove = function(a, b) {
  var c = RegExp(goog.string.regExpEscape(b), "");
  return a.replace(c, "")
};
goog.string.removeAll = function(a, b) {
  var c = RegExp(goog.string.regExpEscape(b), "g");
  return a.replace(c, "")
};
goog.string.regExpEscape = function(a) {
  return String(a).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1").replace(/\x08/g, "\\x08")
};
goog.string.repeat = function(a, b) {
  return Array(b + 1).join(a)
};
goog.string.padNumber = function(a, b, c) {
  a = goog.isDef(c) ? a.toFixed(c) : String(a);
  c = a.indexOf(".");
  -1 == c && (c = a.length);
  return goog.string.repeat("0", Math.max(0, b - c)) + a
};
goog.string.makeSafe = function(a) {
  return null == a ? "" : String(a)
};
goog.string.buildString = function(a) {
  return Array.prototype.join.call(arguments, "")
};
goog.string.getRandomString = function() {
  return Math.floor(2147483648 * Math.random()).toString(36) + Math.abs(Math.floor(2147483648 * Math.random()) ^ goog.now()).toString(36)
};
goog.string.compareVersions = function(a, b) {
  for(var c = 0, d = goog.string.trim(String(a)).split("."), e = goog.string.trim(String(b)).split("."), f = Math.max(d.length, e.length), g = 0;0 == c && g < f;g++) {
    var h = d[g] || "", k = e[g] || "", l = RegExp("(\\d*)(\\D*)", "g"), m = RegExp("(\\d*)(\\D*)", "g");
    do {
      var n = l.exec(h) || ["", "", ""], p = m.exec(k) || ["", "", ""];
      if(0 == n[0].length && 0 == p[0].length) {
        break
      }
      var c = 0 == n[1].length ? 0 : parseInt(n[1], 10), q = 0 == p[1].length ? 0 : parseInt(p[1], 10), c = goog.string.compareElements_(c, q) || goog.string.compareElements_(0 == n[2].length, 0 == p[2].length) || goog.string.compareElements_(n[2], p[2])
    }while(0 == c)
  }
  return c
};
goog.string.compareElements_ = function(a, b) {
  return a < b ? -1 : a > b ? 1 : 0
};
goog.string.HASHCODE_MAX_ = 4294967296;
goog.string.hashCode = function(a) {
  for(var b = 0, c = 0;c < a.length;++c) {
    b = 31 * b + a.charCodeAt(c), b %= goog.string.HASHCODE_MAX_
  }
  return b
};
goog.string.uniqueStringCounter_ = 2147483648 * Math.random() | 0;
goog.string.createUniqueString = function() {
  return"goog_" + goog.string.uniqueStringCounter_++
};
goog.string.toNumber = function(a) {
  var b = Number(a);
  return 0 == b && goog.string.isEmpty(a) ? NaN : b
};
goog.string.toCamelCase = function(a) {
  return String(a).replace(/\-([a-z])/g, function(a, c) {
    return c.toUpperCase()
  })
};
goog.string.toSelectorCase = function(a) {
  return String(a).replace(/([A-Z])/g, "-$1").toLowerCase()
};
goog.string.toTitleCase = function(a, b) {
  var c = goog.isString(b) ? goog.string.regExpEscape(b) : "\\s";
  return a.replace(RegExp("(^" + (c ? "|[" + c + "]+" : "") + ")([a-z])", "g"), function(a, b, c) {
    return b + c.toUpperCase()
  })
};
goog.string.parseInt = function(a) {
  isFinite(a) && (a = String(a));
  return goog.isString(a) ? /^\s*-?0x/i.test(a) ? parseInt(a, 16) : parseInt(a, 10) : NaN
};
goog.asserts = {};
goog.asserts.ENABLE_ASSERTS = goog.DEBUG;
goog.asserts.AssertionError = function(a, b) {
  b.unshift(a);
  goog.debug.Error.call(this, goog.string.subs.apply(null, b));
  b.shift();
  this.messagePattern = a
};
goog.inherits(goog.asserts.AssertionError, goog.debug.Error);
goog.asserts.AssertionError.prototype.name = "AssertionError";
goog.asserts.doAssertFailure_ = function(a, b, c, d) {
  var e = "Assertion failed";
  if(c) {
    var e = e + (": " + c), f = d
  }else {
    a && (e += ": " + a, f = b)
  }
  throw new goog.asserts.AssertionError("" + e, f || []);
};
goog.asserts.assert = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !a && goog.asserts.doAssertFailure_("", null, b, Array.prototype.slice.call(arguments, 2));
  return a
};
goog.asserts.fail = function(a, b) {
  if(goog.asserts.ENABLE_ASSERTS) {
    throw new goog.asserts.AssertionError("Failure" + (a ? ": " + a : ""), Array.prototype.slice.call(arguments, 1));
  }
};
goog.asserts.assertNumber = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !goog.isNumber(a) && goog.asserts.doAssertFailure_("Expected number but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a
};
goog.asserts.assertString = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !goog.isString(a) && goog.asserts.doAssertFailure_("Expected string but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a
};
goog.asserts.assertFunction = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !goog.isFunction(a) && goog.asserts.doAssertFailure_("Expected function but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a
};
goog.asserts.assertObject = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !goog.isObject(a) && goog.asserts.doAssertFailure_("Expected object but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a
};
goog.asserts.assertArray = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !goog.isArray(a) && goog.asserts.doAssertFailure_("Expected array but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a
};
goog.asserts.assertBoolean = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !goog.isBoolean(a) && goog.asserts.doAssertFailure_("Expected boolean but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a
};
goog.asserts.assertInstanceof = function(a, b, c, d) {
  !goog.asserts.ENABLE_ASSERTS || a instanceof b || goog.asserts.doAssertFailure_("instanceof check failed.", null, c, Array.prototype.slice.call(arguments, 3));
  return a
};
goog.array = {};
goog.NATIVE_ARRAY_PROTOTYPES = goog.TRUSTED_SITE;
goog.array.peek = function(a) {
  return a[a.length - 1]
};
goog.array.ARRAY_PROTOTYPE_ = Array.prototype;
goog.array.indexOf = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.indexOf ? function(a, b, c) {
  goog.asserts.assert(null != a.length);
  return goog.array.ARRAY_PROTOTYPE_.indexOf.call(a, b, c)
} : function(a, b, c) {
  c = null == c ? 0 : 0 > c ? Math.max(0, a.length + c) : c;
  if(goog.isString(a)) {
    return goog.isString(b) && 1 == b.length ? a.indexOf(b, c) : -1
  }
  for(;c < a.length;c++) {
    if(c in a && a[c] === b) {
      return c
    }
  }
  return-1
};
goog.array.lastIndexOf = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.lastIndexOf ? function(a, b, c) {
  goog.asserts.assert(null != a.length);
  return goog.array.ARRAY_PROTOTYPE_.lastIndexOf.call(a, b, null == c ? a.length - 1 : c)
} : function(a, b, c) {
  c = null == c ? a.length - 1 : c;
  0 > c && (c = Math.max(0, a.length + c));
  if(goog.isString(a)) {
    return goog.isString(b) && 1 == b.length ? a.lastIndexOf(b, c) : -1
  }
  for(;0 <= c;c--) {
    if(c in a && a[c] === b) {
      return c
    }
  }
  return-1
};
goog.array.forEach = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.forEach ? function(a, b, c) {
  goog.asserts.assert(null != a.length);
  goog.array.ARRAY_PROTOTYPE_.forEach.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, e = goog.isString(a) ? a.split("") : a, f = 0;f < d;f++) {
    f in e && b.call(c, e[f], f, a)
  }
};
goog.array.forEachRight = function(a, b, c) {
  for(var d = a.length, e = goog.isString(a) ? a.split("") : a, d = d - 1;0 <= d;--d) {
    d in e && b.call(c, e[d], d, a)
  }
};
goog.array.filter = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.filter ? function(a, b, c) {
  goog.asserts.assert(null != a.length);
  return goog.array.ARRAY_PROTOTYPE_.filter.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, e = [], f = 0, g = goog.isString(a) ? a.split("") : a, h = 0;h < d;h++) {
    if(h in g) {
      var k = g[h];
      b.call(c, k, h, a) && (e[f++] = k)
    }
  }
  return e
};
goog.array.map = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.map ? function(a, b, c) {
  goog.asserts.assert(null != a.length);
  return goog.array.ARRAY_PROTOTYPE_.map.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, e = Array(d), f = goog.isString(a) ? a.split("") : a, g = 0;g < d;g++) {
    g in f && (e[g] = b.call(c, f[g], g, a))
  }
  return e
};
goog.array.reduce = function(a, b, c, d) {
  if(a.reduce) {
    return d ? a.reduce(goog.bind(b, d), c) : a.reduce(b, c)
  }
  var e = c;
  goog.array.forEach(a, function(c, g) {
    e = b.call(d, e, c, g, a)
  });
  return e
};
goog.array.reduceRight = function(a, b, c, d) {
  if(a.reduceRight) {
    return d ? a.reduceRight(goog.bind(b, d), c) : a.reduceRight(b, c)
  }
  var e = c;
  goog.array.forEachRight(a, function(c, g) {
    e = b.call(d, e, c, g, a)
  });
  return e
};
goog.array.some = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.some ? function(a, b, c) {
  goog.asserts.assert(null != a.length);
  return goog.array.ARRAY_PROTOTYPE_.some.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, e = goog.isString(a) ? a.split("") : a, f = 0;f < d;f++) {
    if(f in e && b.call(c, e[f], f, a)) {
      return!0
    }
  }
  return!1
};
goog.array.every = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.every ? function(a, b, c) {
  goog.asserts.assert(null != a.length);
  return goog.array.ARRAY_PROTOTYPE_.every.call(a, b, c)
} : function(a, b, c) {
  for(var d = a.length, e = goog.isString(a) ? a.split("") : a, f = 0;f < d;f++) {
    if(f in e && !b.call(c, e[f], f, a)) {
      return!1
    }
  }
  return!0
};
goog.array.count = function(a, b, c) {
  var d = 0;
  goog.array.forEach(a, function(a, f, g) {
    b.call(c, a, f, g) && ++d
  }, c);
  return d
};
goog.array.find = function(a, b, c) {
  b = goog.array.findIndex(a, b, c);
  return 0 > b ? null : goog.isString(a) ? a.charAt(b) : a[b]
};
goog.array.findIndex = function(a, b, c) {
  for(var d = a.length, e = goog.isString(a) ? a.split("") : a, f = 0;f < d;f++) {
    if(f in e && b.call(c, e[f], f, a)) {
      return f
    }
  }
  return-1
};
goog.array.findRight = function(a, b, c) {
  b = goog.array.findIndexRight(a, b, c);
  return 0 > b ? null : goog.isString(a) ? a.charAt(b) : a[b]
};
goog.array.findIndexRight = function(a, b, c) {
  for(var d = a.length, e = goog.isString(a) ? a.split("") : a, d = d - 1;0 <= d;d--) {
    if(d in e && b.call(c, e[d], d, a)) {
      return d
    }
  }
  return-1
};
goog.array.contains = function(a, b) {
  return 0 <= goog.array.indexOf(a, b)
};
goog.array.isEmpty = function(a) {
  return 0 == a.length
};
goog.array.clear = function(a) {
  if(!goog.isArray(a)) {
    for(var b = a.length - 1;0 <= b;b--) {
      delete a[b]
    }
  }
  a.length = 0
};
goog.array.insert = function(a, b) {
  goog.array.contains(a, b) || a.push(b)
};
goog.array.insertAt = function(a, b, c) {
  goog.array.splice(a, c, 0, b)
};
goog.array.insertArrayAt = function(a, b, c) {
  goog.partial(goog.array.splice, a, c, 0).apply(null, b)
};
goog.array.insertBefore = function(a, b, c) {
  var d;
  2 == arguments.length || 0 > (d = goog.array.indexOf(a, c)) ? a.push(b) : goog.array.insertAt(a, b, d)
};
goog.array.remove = function(a, b) {
  var c = goog.array.indexOf(a, b), d;
  (d = 0 <= c) && goog.array.removeAt(a, c);
  return d
};
goog.array.removeAt = function(a, b) {
  goog.asserts.assert(null != a.length);
  return 1 == goog.array.ARRAY_PROTOTYPE_.splice.call(a, b, 1).length
};
goog.array.removeIf = function(a, b, c) {
  b = goog.array.findIndex(a, b, c);
  return 0 <= b ? (goog.array.removeAt(a, b), !0) : !1
};
goog.array.concat = function(a) {
  return goog.array.ARRAY_PROTOTYPE_.concat.apply(goog.array.ARRAY_PROTOTYPE_, arguments)
};
goog.array.toArray = function(a) {
  var b = a.length;
  if(0 < b) {
    for(var c = Array(b), d = 0;d < b;d++) {
      c[d] = a[d]
    }
    return c
  }
  return[]
};
goog.array.clone = goog.array.toArray;
goog.array.extend = function(a, b) {
  for(var c = 1;c < arguments.length;c++) {
    var d = arguments[c], e;
    if(goog.isArray(d) || (e = goog.isArrayLike(d)) && Object.prototype.hasOwnProperty.call(d, "callee")) {
      a.push.apply(a, d)
    }else {
      if(e) {
        for(var f = a.length, g = d.length, h = 0;h < g;h++) {
          a[f + h] = d[h]
        }
      }else {
        a.push(d)
      }
    }
  }
};
goog.array.splice = function(a, b, c, d) {
  goog.asserts.assert(null != a.length);
  return goog.array.ARRAY_PROTOTYPE_.splice.apply(a, goog.array.slice(arguments, 1))
};
goog.array.slice = function(a, b, c) {
  goog.asserts.assert(null != a.length);
  return 2 >= arguments.length ? goog.array.ARRAY_PROTOTYPE_.slice.call(a, b) : goog.array.ARRAY_PROTOTYPE_.slice.call(a, b, c)
};
goog.array.removeDuplicates = function(a, b) {
  for(var c = b || a, d = {}, e = 0, f = 0;f < a.length;) {
    var g = a[f++], h = goog.isObject(g) ? "o" + goog.getUid(g) : (typeof g).charAt(0) + g;
    Object.prototype.hasOwnProperty.call(d, h) || (d[h] = !0, c[e++] = g)
  }
  c.length = e
};
goog.array.binarySearch = function(a, b, c) {
  return goog.array.binarySearch_(a, c || goog.array.defaultCompare, !1, b)
};
goog.array.binarySelect = function(a, b, c) {
  return goog.array.binarySearch_(a, b, !0, void 0, c)
};
goog.array.binarySearch_ = function(a, b, c, d, e) {
  for(var f = 0, g = a.length, h;f < g;) {
    var k = f + g >> 1, l;
    l = c ? b.call(e, a[k], k, a) : b(d, a[k]);
    0 < l ? f = k + 1 : (g = k, h = !l)
  }
  return h ? f : ~f
};
goog.array.sort = function(a, b) {
  goog.asserts.assert(null != a.length);
  goog.array.ARRAY_PROTOTYPE_.sort.call(a, b || goog.array.defaultCompare)
};
goog.array.stableSort = function(a, b) {
  for(var c = 0;c < a.length;c++) {
    a[c] = {index:c, value:a[c]}
  }
  var d = b || goog.array.defaultCompare;
  goog.array.sort(a, function(a, b) {
    return d(a.value, b.value) || a.index - b.index
  });
  for(c = 0;c < a.length;c++) {
    a[c] = a[c].value
  }
};
goog.array.sortObjectsByKey = function(a, b, c) {
  var d = c || goog.array.defaultCompare;
  goog.array.sort(a, function(a, c) {
    return d(a[b], c[b])
  })
};
goog.array.isSorted = function(a, b, c) {
  b = b || goog.array.defaultCompare;
  for(var d = 1;d < a.length;d++) {
    var e = b(a[d - 1], a[d]);
    if(0 < e || 0 == e && c) {
      return!1
    }
  }
  return!0
};
goog.array.equals = function(a, b, c) {
  if(!goog.isArrayLike(a) || !goog.isArrayLike(b) || a.length != b.length) {
    return!1
  }
  var d = a.length;
  c = c || goog.array.defaultCompareEquality;
  for(var e = 0;e < d;e++) {
    if(!c(a[e], b[e])) {
      return!1
    }
  }
  return!0
};
goog.array.compare = function(a, b, c) {
  return goog.array.equals(a, b, c)
};
goog.array.compare3 = function(a, b, c) {
  c = c || goog.array.defaultCompare;
  for(var d = Math.min(a.length, b.length), e = 0;e < d;e++) {
    var f = c(a[e], b[e]);
    if(0 != f) {
      return f
    }
  }
  return goog.array.defaultCompare(a.length, b.length)
};
goog.array.defaultCompare = function(a, b) {
  return a > b ? 1 : a < b ? -1 : 0
};
goog.array.defaultCompareEquality = function(a, b) {
  return a === b
};
goog.array.binaryInsert = function(a, b, c) {
  c = goog.array.binarySearch(a, b, c);
  return 0 > c ? (goog.array.insertAt(a, b, -(c + 1)), !0) : !1
};
goog.array.binaryRemove = function(a, b, c) {
  b = goog.array.binarySearch(a, b, c);
  return 0 <= b ? goog.array.removeAt(a, b) : !1
};
goog.array.bucket = function(a, b) {
  for(var c = {}, d = 0;d < a.length;d++) {
    var e = a[d], f = b(e, d, a);
    goog.isDef(f) && (c[f] || (c[f] = [])).push(e)
  }
  return c
};
goog.array.toObject = function(a, b, c) {
  var d = {};
  goog.array.forEach(a, function(e, f) {
    d[b.call(c, e, f, a)] = e
  });
  return d
};
goog.array.range = function(a, b, c) {
  var d = [], e = 0, f = a;
  c = c || 1;
  void 0 !== b && (e = a, f = b);
  if(0 > c * (f - e)) {
    return[]
  }
  if(0 < c) {
    for(a = e;a < f;a += c) {
      d.push(a)
    }
  }else {
    for(a = e;a > f;a += c) {
      d.push(a)
    }
  }
  return d
};
goog.array.repeat = function(a, b) {
  for(var c = [], d = 0;d < b;d++) {
    c[d] = a
  }
  return c
};
goog.array.flatten = function(a) {
  for(var b = [], c = 0;c < arguments.length;c++) {
    var d = arguments[c];
    goog.isArray(d) ? b.push.apply(b, goog.array.flatten.apply(null, d)) : b.push(d)
  }
  return b
};
goog.array.rotate = function(a, b) {
  goog.asserts.assert(null != a.length);
  a.length && (b %= a.length, 0 < b ? goog.array.ARRAY_PROTOTYPE_.unshift.apply(a, a.splice(-b, b)) : 0 > b && goog.array.ARRAY_PROTOTYPE_.push.apply(a, a.splice(0, -b)));
  return a
};
goog.array.zip = function(a) {
  if(!arguments.length) {
    return[]
  }
  for(var b = [], c = 0;;c++) {
    for(var d = [], e = 0;e < arguments.length;e++) {
      var f = arguments[e];
      if(c >= f.length) {
        return b
      }
      d.push(f[c])
    }
    b.push(d)
  }
};
goog.array.shuffle = function(a, b) {
  for(var c = b || Math.random, d = a.length - 1;0 < d;d--) {
    var e = Math.floor(c() * (d + 1)), f = a[d];
    a[d] = a[e];
    a[e] = f
  }
};
goog.object = {};
goog.object.forEach = function(a, b, c) {
  for(var d in a) {
    b.call(c, a[d], d, a)
  }
};
goog.object.filter = function(a, b, c) {
  var d = {}, e;
  for(e in a) {
    b.call(c, a[e], e, a) && (d[e] = a[e])
  }
  return d
};
goog.object.map = function(a, b, c) {
  var d = {}, e;
  for(e in a) {
    d[e] = b.call(c, a[e], e, a)
  }
  return d
};
goog.object.some = function(a, b, c) {
  for(var d in a) {
    if(b.call(c, a[d], d, a)) {
      return!0
    }
  }
  return!1
};
goog.object.every = function(a, b, c) {
  for(var d in a) {
    if(!b.call(c, a[d], d, a)) {
      return!1
    }
  }
  return!0
};
goog.object.getCount = function(a) {
  var b = 0, c;
  for(c in a) {
    b++
  }
  return b
};
goog.object.getAnyKey = function(a) {
  for(var b in a) {
    return b
  }
};
goog.object.getAnyValue = function(a) {
  for(var b in a) {
    return a[b]
  }
};
goog.object.contains = function(a, b) {
  return goog.object.containsValue(a, b)
};
goog.object.getValues = function(a) {
  var b = [], c = 0, d;
  for(d in a) {
    b[c++] = a[d]
  }
  return b
};
goog.object.getKeys = function(a) {
  var b = [], c = 0, d;
  for(d in a) {
    b[c++] = d
  }
  return b
};
goog.object.getValueByKeys = function(a, b) {
  for(var c = goog.isArrayLike(b), d = c ? b : arguments, c = c ? 0 : 1;c < d.length && (a = a[d[c]], goog.isDef(a));c++) {
  }
  return a
};
goog.object.containsKey = function(a, b) {
  return b in a
};
goog.object.containsValue = function(a, b) {
  for(var c in a) {
    if(a[c] == b) {
      return!0
    }
  }
  return!1
};
goog.object.findKey = function(a, b, c) {
  for(var d in a) {
    if(b.call(c, a[d], d, a)) {
      return d
    }
  }
};
goog.object.findValue = function(a, b, c) {
  return(b = goog.object.findKey(a, b, c)) && a[b]
};
goog.object.isEmpty = function(a) {
  for(var b in a) {
    return!1
  }
  return!0
};
goog.object.clear = function(a) {
  for(var b in a) {
    delete a[b]
  }
};
goog.object.remove = function(a, b) {
  var c;
  (c = b in a) && delete a[b];
  return c
};
goog.object.add = function(a, b, c) {
  if(b in a) {
    throw Error('The object already contains the key "' + b + '"');
  }
  goog.object.set(a, b, c)
};
goog.object.get = function(a, b, c) {
  return b in a ? a[b] : c
};
goog.object.set = function(a, b, c) {
  a[b] = c
};
goog.object.setIfUndefined = function(a, b, c) {
  return b in a ? a[b] : a[b] = c
};
goog.object.clone = function(a) {
  var b = {}, c;
  for(c in a) {
    b[c] = a[c]
  }
  return b
};
goog.object.unsafeClone = function(a) {
  var b = goog.typeOf(a);
  if("object" == b || "array" == b) {
    if(a.clone) {
      return a.clone()
    }
    var b = "array" == b ? [] : {}, c;
    for(c in a) {
      b[c] = goog.object.unsafeClone(a[c])
    }
    return b
  }
  return a
};
goog.object.transpose = function(a) {
  var b = {}, c;
  for(c in a) {
    b[a[c]] = c
  }
  return b
};
goog.object.PROTOTYPE_FIELDS_ = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");
goog.object.extend = function(a, b) {
  for(var c, d, e = 1;e < arguments.length;e++) {
    d = arguments[e];
    for(c in d) {
      a[c] = d[c]
    }
    for(var f = 0;f < goog.object.PROTOTYPE_FIELDS_.length;f++) {
      c = goog.object.PROTOTYPE_FIELDS_[f], Object.prototype.hasOwnProperty.call(d, c) && (a[c] = d[c])
    }
  }
};
goog.object.create = function(a) {
  var b = arguments.length;
  if(1 == b && goog.isArray(arguments[0])) {
    return goog.object.create.apply(null, arguments[0])
  }
  if(b % 2) {
    throw Error("Uneven number of arguments");
  }
  for(var c = {}, d = 0;d < b;d += 2) {
    c[arguments[d]] = arguments[d + 1]
  }
  return c
};
goog.object.createSet = function(a) {
  var b = arguments.length;
  if(1 == b && goog.isArray(arguments[0])) {
    return goog.object.createSet.apply(null, arguments[0])
  }
  for(var c = {}, d = 0;d < b;d++) {
    c[arguments[d]] = !0
  }
  return c
};
goog.object.createImmutableView = function(a) {
  var b = a;
  Object.isFrozen && !Object.isFrozen(a) && (b = Object.create(a), Object.freeze(b));
  return b
};
goog.object.isImmutableView = function(a) {
  return!!Object.isFrozen && Object.isFrozen(a)
};
goog.string.format = function(a, b) {
  var c = Array.prototype.slice.call(arguments), d = c.shift();
  if("undefined" == typeof d) {
    throw Error("[goog.string.format] Template required");
  }
  return d.replace(/%([0\-\ \+]*)(\d+)?(\.(\d+))?([%sfdiu])/g, function(a, b, d, h, k, l, m, n) {
    if("%" == l) {
      return"%"
    }
    var p = c.shift();
    if("undefined" == typeof p) {
      throw Error("[goog.string.format] Not enough arguments");
    }
    arguments[0] = p;
    return goog.string.format.demuxes_[l].apply(null, arguments)
  })
};
goog.string.format.demuxes_ = {};
goog.string.format.demuxes_.s = function(a, b, c, d, e, f, g, h) {
  return isNaN(c) || "" == c || a.length >= c ? a : a = -1 < b.indexOf("-", 0) ? a + goog.string.repeat(" ", c - a.length) : goog.string.repeat(" ", c - a.length) + a
};
goog.string.format.demuxes_.f = function(a, b, c, d, e, f, g, h) {
  d = a.toString();
  isNaN(e) || "" == e || (d = a.toFixed(e));
  f = 0 > a ? "-" : 0 <= b.indexOf("+") ? "+" : 0 <= b.indexOf(" ") ? " " : "";
  0 <= a && (d = f + d);
  if(isNaN(c) || d.length >= c) {
    return d
  }
  d = isNaN(e) ? Math.abs(a).toString() : Math.abs(a).toFixed(e);
  a = c - d.length - f.length;
  0 <= b.indexOf("-", 0) ? d = f + d + goog.string.repeat(" ", a) : (b = 0 <= b.indexOf("0", 0) ? "0" : " ", d = f + goog.string.repeat(b, a) + d);
  return d
};
goog.string.format.demuxes_.d = function(a, b, c, d, e, f, g, h) {
  return goog.string.format.demuxes_.f(parseInt(a, 10), b, c, d, 0, f, g, h)
};
goog.string.format.demuxes_.i = goog.string.format.demuxes_.d;
goog.string.format.demuxes_.u = goog.string.format.demuxes_.d;
goog.string.StringBuffer = function(a, b) {
  null != a && this.append.apply(this, arguments)
};
goog.string.StringBuffer.prototype.buffer_ = "";
goog.string.StringBuffer.prototype.set = function(a) {
  this.buffer_ = "" + a
};
goog.string.StringBuffer.prototype.append = function(a, b, c) {
  this.buffer_ += a;
  if(null != b) {
    for(var d = 1;d < arguments.length;d++) {
      this.buffer_ += arguments[d]
    }
  }
  return this
};
goog.string.StringBuffer.prototype.clear = function() {
  this.buffer_ = ""
};
goog.string.StringBuffer.prototype.getLength = function() {
  return this.buffer_.length
};
goog.string.StringBuffer.prototype.toString = function() {
  return this.buffer_
};
var cljs = {core:{}};
cljs.core._STAR_unchecked_if_STAR_ = !1;
cljs.core._STAR_print_fn_STAR_ = function(a) {
  throw Error("No *print-fn* fn set for evaluation environment");
};
cljs.core.set_print_fn_BANG_ = function(a) {
  return cljs.core._STAR_print_fn_STAR_ = a
};
goog.exportSymbol("cljs.core.set_print_fn_BANG_", cljs.core.set_print_fn_BANG_);
cljs.core._STAR_flush_on_newline_STAR_ = !0;
cljs.core._STAR_print_readably_STAR_ = !0;
cljs.core._STAR_print_meta_STAR_ = !1;
cljs.core._STAR_print_dup_STAR_ = !1;
cljs.core.pr_opts = function() {
  return cljs.core.PersistentArrayMap.fromArray(["\ufdd0:flush-on-newline", cljs.core._STAR_flush_on_newline_STAR_, "\ufdd0:readably", cljs.core._STAR_print_readably_STAR_, "\ufdd0:meta", cljs.core._STAR_print_meta_STAR_, "\ufdd0:dup", cljs.core._STAR_print_dup_STAR_], !0)
};
cljs.core.truth_ = function(a) {
  return null != a && !1 !== a
};
cljs.core.not_native = null;
cljs.core.identical_QMARK_ = function(a, b) {
  return a === b
};
cljs.core.nil_QMARK_ = function(a) {
  return null == a
};
cljs.core.array_QMARK_ = function(a) {
  return a instanceof Array
};
cljs.core.number_QMARK_ = function(a) {
  return"number" === typeof a
};
cljs.core.not = function(a) {
  return cljs.core.truth_(a) ? !1 : !0
};
cljs.core.string_QMARK_ = function(a) {
  var b = goog.isString(a);
  return b ? "\ufdd0" !== a.charAt(0) : b
};
cljs.core.type_satisfies_ = function(a, b) {
  return a[goog.typeOf(null == b ? null : b)] ? !0 : a._ ? !0 : !1
};
cljs.core.is_proto_ = function(a) {
  return a.constructor.prototype === a
};
cljs.core._STAR_main_cli_fn_STAR_ = null;
cljs.core.type = function(a) {
  return null == a ? null : a.constructor
};
cljs.core.missing_protocol = function(a, b) {
  var c = cljs.core.type(b), c = cljs.core.truth_(cljs.core.truth_(c) ? c.cljs$lang$type : c) ? c.cljs$lang$ctorStr : goog.typeOf(b);
  return Error(["No protocol method ", a, " defined for type ", c, ": ", b].join(""))
};
cljs.core.aclone = function(a) {
  return a.slice()
};
cljs.core.array = function(a) {
  return Array.prototype.slice.call(arguments)
};
cljs.core.make_array = function() {
  var a = null, a = function(b, c) {
    switch(arguments.length) {
      case 1:
        return Array(b);
      case 2:
        return a.cljs$core$IFn$_invoke$arity$1(c)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return Array(a)
  };
  a.cljs$core$IFn$_invoke$arity$2 = function(b, c) {
    return a.cljs$core$IFn$_invoke$arity$1(c)
  };
  return a
}();
cljs.core.aget = function() {
  var a = null, b = function() {
    var b = function(b, c, d) {
      return cljs.core.apply.cljs$core$IFn$_invoke$arity$3 ? cljs.core.apply.cljs$core$IFn$_invoke$arity$3(a, a.cljs$core$IFn$_invoke$arity$2(b, c), d) : cljs.core.apply.call(null, a, a.cljs$core$IFn$_invoke$arity$2(b, c), d)
    }, d = function(a, d, g) {
      var h = null;
      2 < arguments.length && (h = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, d, h)
    };
    d.cljs$lang$maxFixedArity = 2;
    d.cljs$lang$applyTo = function(a) {
      var d = cljs.core.first(a);
      a = cljs.core.next(a);
      var g = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(d, g, a)
    };
    d.cljs$core$IFn$_invoke$arity$variadic = b;
    return d
  }(), a = function(a, d, e) {
    switch(arguments.length) {
      case 2:
        return a[d];
      default:
        return b.cljs$core$IFn$_invoke$arity$variadic(a, d, cljs.core.array_seq(arguments, 2))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
    return a[b]
  };
  a.cljs$core$IFn$_invoke$arity$variadic = b.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.aset = function() {
  var a = null, b = function() {
    var b = function(b, c, d, h) {
      return cljs.core.apply.cljs$core$IFn$_invoke$arity$4 ? cljs.core.apply.cljs$core$IFn$_invoke$arity$4(a, b[c], d, h) : cljs.core.apply.call(null, a, b[c], d, h)
    }, d = function(a, d, g, h) {
      var k = null;
      3 < arguments.length && (k = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
      return b.call(this, a, d, g, k)
    };
    d.cljs$lang$maxFixedArity = 3;
    d.cljs$lang$applyTo = function(a) {
      var d = cljs.core.first(a);
      a = cljs.core.next(a);
      var g = cljs.core.first(a);
      a = cljs.core.next(a);
      var h = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(d, g, h, a)
    };
    d.cljs$core$IFn$_invoke$arity$variadic = b;
    return d
  }(), a = function(a, d, e, f) {
    switch(arguments.length) {
      case 3:
        return a[d] = e;
      default:
        return b.cljs$core$IFn$_invoke$arity$variadic(a, d, e, cljs.core.array_seq(arguments, 3))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 3;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$3 = function(a, b, e) {
    return a[b] = e
  };
  a.cljs$core$IFn$_invoke$arity$variadic = b.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.alength = function(a) {
  return a.length
};
cljs.core.into_array = function() {
  var a = null, b = function(b) {
    return a.cljs$core$IFn$_invoke$arity$2(null, b)
  }, c = function(a, b) {
    return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3 ? cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(function(a, b) {
      a.push(b);
      return a
    }, [], b) : cljs.core.reduce.call(null, function(a, b) {
      a.push(b);
      return a
    }, [], b)
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a
}();
cljs.core.Fn = {};
cljs.core.IFn = {};
cljs.core._invoke = function() {
  var a = null, b = function(a) {
    if(a ? a.cljs$core$IFn$_invoke$arity$1 : a) {
      return a.cljs$core$IFn$_invoke$arity$1(a)
    }
    var b;
    b = cljs.core._invoke[goog.typeOf(null == a ? null : a)];
    if(!b && (b = cljs.core._invoke._, !b)) {
      throw cljs.core.missing_protocol("IFn.-invoke", a);
    }
    return b.call(null, a)
  }, c = function(a, b) {
    if(a ? a.cljs$core$IFn$_invoke$arity$2 : a) {
      return a.cljs$core$IFn$_invoke$arity$2(a, b)
    }
    var c;
    c = cljs.core._invoke[goog.typeOf(null == a ? null : a)];
    if(!c && (c = cljs.core._invoke._, !c)) {
      throw cljs.core.missing_protocol("IFn.-invoke", a);
    }
    return c.call(null, a, b)
  }, d = function(a, b, c) {
    if(a ? a.cljs$core$IFn$_invoke$arity$3 : a) {
      return a.cljs$core$IFn$_invoke$arity$3(a, b, c)
    }
    var d;
    d = cljs.core._invoke[goog.typeOf(null == a ? null : a)];
    if(!d && (d = cljs.core._invoke._, !d)) {
      throw cljs.core.missing_protocol("IFn.-invoke", a);
    }
    return d.call(null, a, b, c)
  }, e = function(a, b, c, d) {
    if(a ? a.cljs$core$IFn$_invoke$arity$4 : a) {
      return a.cljs$core$IFn$_invoke$arity$4(a, b, c, d)
    }
    var e;
    e = cljs.core._invoke[goog.typeOf(null == a ? null : a)];
    if(!e && (e = cljs.core._invoke._, !e)) {
      throw cljs.core.missing_protocol("IFn.-invoke", a);
    }
    return e.call(null, a, b, c, d)
  }, f = function(a, b, c, d, e) {
    if(a ? a.cljs$core$IFn$_invoke$arity$5 : a) {
      return a.cljs$core$IFn$_invoke$arity$5(a, b, c, d, e)
    }
    var f;
    f = cljs.core._invoke[goog.typeOf(null == a ? null : a)];
    if(!f && (f = cljs.core._invoke._, !f)) {
      throw cljs.core.missing_protocol("IFn.-invoke", a);
    }
    return f.call(null, a, b, c, d, e)
  }, g = function(a, b, c, d, e, f) {
    if(a ? a.cljs$core$IFn$_invoke$arity$6 : a) {
      return a.cljs$core$IFn$_invoke$arity$6(a, b, c, d, e, f)
    }
    var g;
    g = cljs.core._invoke[goog.typeOf(null == a ? null : a)];
    if(!g && (g = cljs.core._invoke._, !g)) {
      throw cljs.core.missing_protocol("IFn.-invoke", a);
    }
    return g.call(null, a, b, c, d, e, f)
  }, h = function(a, b, c, d, e, f, g) {
    if(a ? a.cljs$core$IFn$_invoke$arity$7 : a) {
      return a.cljs$core$IFn$_invoke$arity$7(a, b, c, d, e, f, g)
    }
    var h;
    h = cljs.core._invoke[goog.typeOf(null == a ? null : a)];
    if(!h && (h = cljs.core._invoke._, !h)) {
      throw cljs.core.missing_protocol("IFn.-invoke", a);
    }
    return h.call(null, a, b, c, d, e, f, g)
  }, k = function(a, b, c, d, e, f, g, h) {
    if(a ? a.cljs$core$IFn$_invoke$arity$8 : a) {
      return a.cljs$core$IFn$_invoke$arity$8(a, b, c, d, e, f, g, h)
    }
    var k;
    k = cljs.core._invoke[goog.typeOf(null == a ? null : a)];
    if(!k && (k = cljs.core._invoke._, !k)) {
      throw cljs.core.missing_protocol("IFn.-invoke", a);
    }
    return k.call(null, a, b, c, d, e, f, g, h)
  }, l = function(a, b, c, d, e, f, g, h, k) {
    if(a ? a.cljs$core$IFn$_invoke$arity$9 : a) {
      return a.cljs$core$IFn$_invoke$arity$9(a, b, c, d, e, f, g, h, k)
    }
    var l;
    l = cljs.core._invoke[goog.typeOf(null == a ? null : a)];
    if(!l && (l = cljs.core._invoke._, !l)) {
      throw cljs.core.missing_protocol("IFn.-invoke", a);
    }
    return l.call(null, a, b, c, d, e, f, g, h, k)
  }, m = function(a, b, c, d, e, f, g, h, k, l) {
    if(a ? a.cljs$core$IFn$_invoke$arity$10 : a) {
      return a.cljs$core$IFn$_invoke$arity$10(a, b, c, d, e, f, g, h, k, l)
    }
    var m;
    m = cljs.core._invoke[goog.typeOf(null == a ? null : a)];
    if(!m && (m = cljs.core._invoke._, !m)) {
      throw cljs.core.missing_protocol("IFn.-invoke", a);
    }
    return m.call(null, a, b, c, d, e, f, g, h, k, l)
  }, n = function(a, b, c, d, e, f, g, h, k, l, m) {
    if(a ? a.cljs$core$IFn$_invoke$arity$11 : a) {
      return a.cljs$core$IFn$_invoke$arity$11(a, b, c, d, e, f, g, h, k, l, m)
    }
    var n;
    n = cljs.core._invoke[goog.typeOf(null == a ? null : a)];
    if(!n && (n = cljs.core._invoke._, !n)) {
      throw cljs.core.missing_protocol("IFn.-invoke", a);
    }
    return n.call(null, a, b, c, d, e, f, g, h, k, l, m)
  }, p = function(a, b, c, d, e, f, g, h, k, l, m, n) {
    if(a ? a.cljs$core$IFn$_invoke$arity$12 : a) {
      return a.cljs$core$IFn$_invoke$arity$12(a, b, c, d, e, f, g, h, k, l, m, n)
    }
    var p;
    p = cljs.core._invoke[goog.typeOf(null == a ? null : a)];
    if(!p && (p = cljs.core._invoke._, !p)) {
      throw cljs.core.missing_protocol("IFn.-invoke", a);
    }
    return p.call(null, a, b, c, d, e, f, g, h, k, l, m, n)
  }, q = function(a, b, c, d, e, f, g, h, k, l, m, n, p) {
    if(a ? a.cljs$core$IFn$_invoke$arity$13 : a) {
      return a.cljs$core$IFn$_invoke$arity$13(a, b, c, d, e, f, g, h, k, l, m, n, p)
    }
    var q;
    q = cljs.core._invoke[goog.typeOf(null == a ? null : a)];
    if(!q && (q = cljs.core._invoke._, !q)) {
      throw cljs.core.missing_protocol("IFn.-invoke", a);
    }
    return q.call(null, a, b, c, d, e, f, g, h, k, l, m, n, p)
  }, r = function(a, b, c, d, e, f, g, h, k, l, m, n, p, q) {
    if(a ? a.cljs$core$IFn$_invoke$arity$14 : a) {
      return a.cljs$core$IFn$_invoke$arity$14(a, b, c, d, e, f, g, h, k, l, m, n, p, q)
    }
    var r;
    r = cljs.core._invoke[goog.typeOf(null == a ? null : a)];
    if(!r && (r = cljs.core._invoke._, !r)) {
      throw cljs.core.missing_protocol("IFn.-invoke", a);
    }
    return r.call(null, a, b, c, d, e, f, g, h, k, l, m, n, p, q)
  }, s = function(a, b, c, d, e, f, g, h, k, l, m, n, p, q, r) {
    if(a ? a.cljs$core$IFn$_invoke$arity$15 : a) {
      return a.cljs$core$IFn$_invoke$arity$15(a, b, c, d, e, f, g, h, k, l, m, n, p, q, r)
    }
    var s;
    s = cljs.core._invoke[goog.typeOf(null == a ? null : a)];
    if(!s && (s = cljs.core._invoke._, !s)) {
      throw cljs.core.missing_protocol("IFn.-invoke", a);
    }
    return s.call(null, a, b, c, d, e, f, g, h, k, l, m, n, p, q, r)
  }, t = function(a, b, c, d, e, f, g, h, k, l, m, n, p, q, r, s) {
    if(a ? a.cljs$core$IFn$_invoke$arity$16 : a) {
      return a.cljs$core$IFn$_invoke$arity$16(a, b, c, d, e, f, g, h, k, l, m, n, p, q, r, s)
    }
    var u;
    u = cljs.core._invoke[goog.typeOf(null == a ? null : a)];
    if(!u && (u = cljs.core._invoke._, !u)) {
      throw cljs.core.missing_protocol("IFn.-invoke", a);
    }
    return u.call(null, a, b, c, d, e, f, g, h, k, l, m, n, p, q, r, s)
  }, v = function(a, b, c, d, e, f, g, h, k, l, m, n, p, q, r, s, u) {
    if(a ? a.cljs$core$IFn$_invoke$arity$17 : a) {
      return a.cljs$core$IFn$_invoke$arity$17(a, b, c, d, e, f, g, h, k, l, m, n, p, q, r, s, u)
    }
    var t;
    t = cljs.core._invoke[goog.typeOf(null == a ? null : a)];
    if(!t && (t = cljs.core._invoke._, !t)) {
      throw cljs.core.missing_protocol("IFn.-invoke", a);
    }
    return t.call(null, a, b, c, d, e, f, g, h, k, l, m, n, p, q, r, s, u)
  }, w = function(a, b, c, d, e, f, g, h, k, l, m, n, p, q, r, s, u, t) {
    if(a ? a.cljs$core$IFn$_invoke$arity$18 : a) {
      return a.cljs$core$IFn$_invoke$arity$18(a, b, c, d, e, f, g, h, k, l, m, n, p, q, r, s, u, t)
    }
    var w;
    w = cljs.core._invoke[goog.typeOf(null == a ? null : a)];
    if(!w && (w = cljs.core._invoke._, !w)) {
      throw cljs.core.missing_protocol("IFn.-invoke", a);
    }
    return w.call(null, a, b, c, d, e, f, g, h, k, l, m, n, p, q, r, s, u, t)
  }, u = function(a, b, c, d, e, f, g, h, k, l, m, n, p, q, r, s, u, t, w) {
    if(a ? a.cljs$core$IFn$_invoke$arity$19 : a) {
      return a.cljs$core$IFn$_invoke$arity$19(a, b, c, d, e, f, g, h, k, l, m, n, p, q, r, s, u, t, w)
    }
    var v;
    v = cljs.core._invoke[goog.typeOf(null == a ? null : a)];
    if(!v && (v = cljs.core._invoke._, !v)) {
      throw cljs.core.missing_protocol("IFn.-invoke", a);
    }
    return v.call(null, a, b, c, d, e, f, g, h, k, l, m, n, p, q, r, s, u, t, w)
  }, B = function(a, b, c, d, e, f, g, h, k, l, m, n, p, q, r, s, u, t, w, v) {
    if(a ? a.cljs$core$IFn$_invoke$arity$20 : a) {
      return a.cljs$core$IFn$_invoke$arity$20(a, b, c, d, e, f, g, h, k, l, m, n, p, q, r, s, u, t, w, v)
    }
    var B;
    B = cljs.core._invoke[goog.typeOf(null == a ? null : a)];
    if(!B && (B = cljs.core._invoke._, !B)) {
      throw cljs.core.missing_protocol("IFn.-invoke", a);
    }
    return B.call(null, a, b, c, d, e, f, g, h, k, l, m, n, p, q, r, s, u, t, w, v)
  }, H = function(a, b, c, d, e, f, g, h, k, l, m, n, p, q, r, s, u, t, w, v, B) {
    if(a ? a.cljs$core$IFn$_invoke$arity$21 : a) {
      return a.cljs$core$IFn$_invoke$arity$21(a, b, c, d, e, f, g, h, k, l, m, n, p, q, r, s, u, t, w, v, B)
    }
    var H;
    H = cljs.core._invoke[goog.typeOf(null == a ? null : a)];
    if(!H && (H = cljs.core._invoke._, !H)) {
      throw cljs.core.missing_protocol("IFn.-invoke", a);
    }
    return H.call(null, a, b, c, d, e, f, g, h, k, l, m, n, p, q, r, s, u, t, w, v, B)
  }, a = function(a, x, y, z, A, C, D, E, F, G, I, J, K, L, M, N, O, P, Q, S, T) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, x);
      case 3:
        return d.call(this, a, x, y);
      case 4:
        return e.call(this, a, x, y, z);
      case 5:
        return f.call(this, a, x, y, z, A);
      case 6:
        return g.call(this, a, x, y, z, A, C);
      case 7:
        return h.call(this, a, x, y, z, A, C, D);
      case 8:
        return k.call(this, a, x, y, z, A, C, D, E);
      case 9:
        return l.call(this, a, x, y, z, A, C, D, E, F);
      case 10:
        return m.call(this, a, x, y, z, A, C, D, E, F, G);
      case 11:
        return n.call(this, a, x, y, z, A, C, D, E, F, G, I);
      case 12:
        return p.call(this, a, x, y, z, A, C, D, E, F, G, I, J);
      case 13:
        return q.call(this, a, x, y, z, A, C, D, E, F, G, I, J, K);
      case 14:
        return r.call(this, a, x, y, z, A, C, D, E, F, G, I, J, K, L);
      case 15:
        return s.call(this, a, x, y, z, A, C, D, E, F, G, I, J, K, L, M);
      case 16:
        return t.call(this, a, x, y, z, A, C, D, E, F, G, I, J, K, L, M, N);
      case 17:
        return v.call(this, a, x, y, z, A, C, D, E, F, G, I, J, K, L, M, N, O);
      case 18:
        return w.call(this, a, x, y, z, A, C, D, E, F, G, I, J, K, L, M, N, O, P);
      case 19:
        return u.call(this, a, x, y, z, A, C, D, E, F, G, I, J, K, L, M, N, O, P, Q);
      case 20:
        return B.call(this, a, x, y, z, A, C, D, E, F, G, I, J, K, L, M, N, O, P, Q, S);
      case 21:
        return H.call(this, a, x, y, z, A, C, D, E, F, G, I, J, K, L, M, N, O, P, Q, S, T)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  a.cljs$core$IFn$_invoke$arity$3 = d;
  a.cljs$core$IFn$_invoke$arity$4 = e;
  a.cljs$core$IFn$_invoke$arity$5 = f;
  a.cljs$core$IFn$_invoke$arity$6 = g;
  a.cljs$core$IFn$_invoke$arity$7 = h;
  a.cljs$core$IFn$_invoke$arity$8 = k;
  a.cljs$core$IFn$_invoke$arity$9 = l;
  a.cljs$core$IFn$_invoke$arity$10 = m;
  a.cljs$core$IFn$_invoke$arity$11 = n;
  a.cljs$core$IFn$_invoke$arity$12 = p;
  a.cljs$core$IFn$_invoke$arity$13 = q;
  a.cljs$core$IFn$_invoke$arity$14 = r;
  a.cljs$core$IFn$_invoke$arity$15 = s;
  a.cljs$core$IFn$_invoke$arity$16 = t;
  a.cljs$core$IFn$_invoke$arity$17 = v;
  a.cljs$core$IFn$_invoke$arity$18 = w;
  a.cljs$core$IFn$_invoke$arity$19 = u;
  a.cljs$core$IFn$_invoke$arity$20 = B;
  a.cljs$core$IFn$_invoke$arity$21 = H;
  return a
}();
cljs.core.ICounted = {};
cljs.core._count = function(a) {
  if(a ? a.cljs$core$ICounted$_count$arity$1 : a) {
    return a.cljs$core$ICounted$_count$arity$1(a)
  }
  var b;
  b = cljs.core._count[goog.typeOf(null == a ? null : a)];
  if(!b && (b = cljs.core._count._, !b)) {
    throw cljs.core.missing_protocol("ICounted.-count", a);
  }
  return b.call(null, a)
};
cljs.core.IEmptyableCollection = {};
cljs.core._empty = function(a) {
  if(a ? a.cljs$core$IEmptyableCollection$_empty$arity$1 : a) {
    return a.cljs$core$IEmptyableCollection$_empty$arity$1(a)
  }
  var b;
  b = cljs.core._empty[goog.typeOf(null == a ? null : a)];
  if(!b && (b = cljs.core._empty._, !b)) {
    throw cljs.core.missing_protocol("IEmptyableCollection.-empty", a);
  }
  return b.call(null, a)
};
cljs.core.ICollection = {};
cljs.core._conj = function(a, b) {
  if(a ? a.cljs$core$ICollection$_conj$arity$2 : a) {
    return a.cljs$core$ICollection$_conj$arity$2(a, b)
  }
  var c;
  c = cljs.core._conj[goog.typeOf(null == a ? null : a)];
  if(!c && (c = cljs.core._conj._, !c)) {
    throw cljs.core.missing_protocol("ICollection.-conj", a);
  }
  return c.call(null, a, b)
};
cljs.core.IIndexed = {};
cljs.core._nth = function() {
  var a = null, b = function(a, b) {
    if(a ? a.cljs$core$IIndexed$_nth$arity$2 : a) {
      return a.cljs$core$IIndexed$_nth$arity$2(a, b)
    }
    var c;
    c = cljs.core._nth[goog.typeOf(null == a ? null : a)];
    if(!c && (c = cljs.core._nth._, !c)) {
      throw cljs.core.missing_protocol("IIndexed.-nth", a);
    }
    return c.call(null, a, b)
  }, c = function(a, b, c) {
    if(a ? a.cljs$core$IIndexed$_nth$arity$3 : a) {
      return a.cljs$core$IIndexed$_nth$arity$3(a, b, c)
    }
    var g;
    g = cljs.core._nth[goog.typeOf(null == a ? null : a)];
    if(!g && (g = cljs.core._nth._, !g)) {
      throw cljs.core.missing_protocol("IIndexed.-nth", a);
    }
    return g.call(null, a, b, c)
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a
}();
cljs.core.ASeq = {};
cljs.core.ISeq = {};
cljs.core._first = function(a) {
  if(a ? a.cljs$core$ISeq$_first$arity$1 : a) {
    return a.cljs$core$ISeq$_first$arity$1(a)
  }
  var b;
  b = cljs.core._first[goog.typeOf(null == a ? null : a)];
  if(!b && (b = cljs.core._first._, !b)) {
    throw cljs.core.missing_protocol("ISeq.-first", a);
  }
  return b.call(null, a)
};
cljs.core._rest = function(a) {
  if(a ? a.cljs$core$ISeq$_rest$arity$1 : a) {
    return a.cljs$core$ISeq$_rest$arity$1(a)
  }
  var b;
  b = cljs.core._rest[goog.typeOf(null == a ? null : a)];
  if(!b && (b = cljs.core._rest._, !b)) {
    throw cljs.core.missing_protocol("ISeq.-rest", a);
  }
  return b.call(null, a)
};
cljs.core.INext = {};
cljs.core._next = function(a) {
  if(a ? a.cljs$core$INext$_next$arity$1 : a) {
    return a.cljs$core$INext$_next$arity$1(a)
  }
  var b;
  b = cljs.core._next[goog.typeOf(null == a ? null : a)];
  if(!b && (b = cljs.core._next._, !b)) {
    throw cljs.core.missing_protocol("INext.-next", a);
  }
  return b.call(null, a)
};
cljs.core.ILookup = {};
cljs.core._lookup = function() {
  var a = null, b = function(a, b) {
    if(a ? a.cljs$core$ILookup$_lookup$arity$2 : a) {
      return a.cljs$core$ILookup$_lookup$arity$2(a, b)
    }
    var c;
    c = cljs.core._lookup[goog.typeOf(null == a ? null : a)];
    if(!c && (c = cljs.core._lookup._, !c)) {
      throw cljs.core.missing_protocol("ILookup.-lookup", a);
    }
    return c.call(null, a, b)
  }, c = function(a, b, c) {
    if(a ? a.cljs$core$ILookup$_lookup$arity$3 : a) {
      return a.cljs$core$ILookup$_lookup$arity$3(a, b, c)
    }
    var g;
    g = cljs.core._lookup[goog.typeOf(null == a ? null : a)];
    if(!g && (g = cljs.core._lookup._, !g)) {
      throw cljs.core.missing_protocol("ILookup.-lookup", a);
    }
    return g.call(null, a, b, c)
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a
}();
cljs.core.IAssociative = {};
cljs.core._contains_key_QMARK_ = function(a, b) {
  if(a ? a.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 : a) {
    return a.cljs$core$IAssociative$_contains_key_QMARK_$arity$2(a, b)
  }
  var c;
  c = cljs.core._contains_key_QMARK_[goog.typeOf(null == a ? null : a)];
  if(!c && (c = cljs.core._contains_key_QMARK_._, !c)) {
    throw cljs.core.missing_protocol("IAssociative.-contains-key?", a);
  }
  return c.call(null, a, b)
};
cljs.core._assoc = function(a, b, c) {
  if(a ? a.cljs$core$IAssociative$_assoc$arity$3 : a) {
    return a.cljs$core$IAssociative$_assoc$arity$3(a, b, c)
  }
  var d;
  d = cljs.core._assoc[goog.typeOf(null == a ? null : a)];
  if(!d && (d = cljs.core._assoc._, !d)) {
    throw cljs.core.missing_protocol("IAssociative.-assoc", a);
  }
  return d.call(null, a, b, c)
};
cljs.core.IMap = {};
cljs.core._dissoc = function(a, b) {
  if(a ? a.cljs$core$IMap$_dissoc$arity$2 : a) {
    return a.cljs$core$IMap$_dissoc$arity$2(a, b)
  }
  var c;
  c = cljs.core._dissoc[goog.typeOf(null == a ? null : a)];
  if(!c && (c = cljs.core._dissoc._, !c)) {
    throw cljs.core.missing_protocol("IMap.-dissoc", a);
  }
  return c.call(null, a, b)
};
cljs.core.IMapEntry = {};
cljs.core._key = function(a) {
  if(a ? a.cljs$core$IMapEntry$_key$arity$1 : a) {
    return a.cljs$core$IMapEntry$_key$arity$1(a)
  }
  var b;
  b = cljs.core._key[goog.typeOf(null == a ? null : a)];
  if(!b && (b = cljs.core._key._, !b)) {
    throw cljs.core.missing_protocol("IMapEntry.-key", a);
  }
  return b.call(null, a)
};
cljs.core._val = function(a) {
  if(a ? a.cljs$core$IMapEntry$_val$arity$1 : a) {
    return a.cljs$core$IMapEntry$_val$arity$1(a)
  }
  var b;
  b = cljs.core._val[goog.typeOf(null == a ? null : a)];
  if(!b && (b = cljs.core._val._, !b)) {
    throw cljs.core.missing_protocol("IMapEntry.-val", a);
  }
  return b.call(null, a)
};
cljs.core.ISet = {};
cljs.core._disjoin = function(a, b) {
  if(a ? a.cljs$core$ISet$_disjoin$arity$2 : a) {
    return a.cljs$core$ISet$_disjoin$arity$2(a, b)
  }
  var c;
  c = cljs.core._disjoin[goog.typeOf(null == a ? null : a)];
  if(!c && (c = cljs.core._disjoin._, !c)) {
    throw cljs.core.missing_protocol("ISet.-disjoin", a);
  }
  return c.call(null, a, b)
};
cljs.core.IStack = {};
cljs.core._peek = function(a) {
  if(a ? a.cljs$core$IStack$_peek$arity$1 : a) {
    return a.cljs$core$IStack$_peek$arity$1(a)
  }
  var b;
  b = cljs.core._peek[goog.typeOf(null == a ? null : a)];
  if(!b && (b = cljs.core._peek._, !b)) {
    throw cljs.core.missing_protocol("IStack.-peek", a);
  }
  return b.call(null, a)
};
cljs.core._pop = function(a) {
  if(a ? a.cljs$core$IStack$_pop$arity$1 : a) {
    return a.cljs$core$IStack$_pop$arity$1(a)
  }
  var b;
  b = cljs.core._pop[goog.typeOf(null == a ? null : a)];
  if(!b && (b = cljs.core._pop._, !b)) {
    throw cljs.core.missing_protocol("IStack.-pop", a);
  }
  return b.call(null, a)
};
cljs.core.IVector = {};
cljs.core._assoc_n = function(a, b, c) {
  if(a ? a.cljs$core$IVector$_assoc_n$arity$3 : a) {
    return a.cljs$core$IVector$_assoc_n$arity$3(a, b, c)
  }
  var d;
  d = cljs.core._assoc_n[goog.typeOf(null == a ? null : a)];
  if(!d && (d = cljs.core._assoc_n._, !d)) {
    throw cljs.core.missing_protocol("IVector.-assoc-n", a);
  }
  return d.call(null, a, b, c)
};
cljs.core.IDeref = {};
cljs.core._deref = function(a) {
  if(a ? a.cljs$core$IDeref$_deref$arity$1 : a) {
    return a.cljs$core$IDeref$_deref$arity$1(a)
  }
  var b;
  b = cljs.core._deref[goog.typeOf(null == a ? null : a)];
  if(!b && (b = cljs.core._deref._, !b)) {
    throw cljs.core.missing_protocol("IDeref.-deref", a);
  }
  return b.call(null, a)
};
cljs.core.IDerefWithTimeout = {};
cljs.core._deref_with_timeout = function(a, b, c) {
  if(a ? a.cljs$core$IDerefWithTimeout$_deref_with_timeout$arity$3 : a) {
    return a.cljs$core$IDerefWithTimeout$_deref_with_timeout$arity$3(a, b, c)
  }
  var d;
  d = cljs.core._deref_with_timeout[goog.typeOf(null == a ? null : a)];
  if(!d && (d = cljs.core._deref_with_timeout._, !d)) {
    throw cljs.core.missing_protocol("IDerefWithTimeout.-deref-with-timeout", a);
  }
  return d.call(null, a, b, c)
};
cljs.core.IMeta = {};
cljs.core._meta = function(a) {
  if(a ? a.cljs$core$IMeta$_meta$arity$1 : a) {
    return a.cljs$core$IMeta$_meta$arity$1(a)
  }
  var b;
  b = cljs.core._meta[goog.typeOf(null == a ? null : a)];
  if(!b && (b = cljs.core._meta._, !b)) {
    throw cljs.core.missing_protocol("IMeta.-meta", a);
  }
  return b.call(null, a)
};
cljs.core.IWithMeta = {};
cljs.core._with_meta = function(a, b) {
  if(a ? a.cljs$core$IWithMeta$_with_meta$arity$2 : a) {
    return a.cljs$core$IWithMeta$_with_meta$arity$2(a, b)
  }
  var c;
  c = cljs.core._with_meta[goog.typeOf(null == a ? null : a)];
  if(!c && (c = cljs.core._with_meta._, !c)) {
    throw cljs.core.missing_protocol("IWithMeta.-with-meta", a);
  }
  return c.call(null, a, b)
};
cljs.core.IReduce = {};
cljs.core._reduce = function() {
  var a = null, b = function(a, b) {
    if(a ? a.cljs$core$IReduce$_reduce$arity$2 : a) {
      return a.cljs$core$IReduce$_reduce$arity$2(a, b)
    }
    var c;
    c = cljs.core._reduce[goog.typeOf(null == a ? null : a)];
    if(!c && (c = cljs.core._reduce._, !c)) {
      throw cljs.core.missing_protocol("IReduce.-reduce", a);
    }
    return c.call(null, a, b)
  }, c = function(a, b, c) {
    if(a ? a.cljs$core$IReduce$_reduce$arity$3 : a) {
      return a.cljs$core$IReduce$_reduce$arity$3(a, b, c)
    }
    var g;
    g = cljs.core._reduce[goog.typeOf(null == a ? null : a)];
    if(!g && (g = cljs.core._reduce._, !g)) {
      throw cljs.core.missing_protocol("IReduce.-reduce", a);
    }
    return g.call(null, a, b, c)
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a
}();
cljs.core.IKVReduce = {};
cljs.core._kv_reduce = function(a, b, c) {
  if(a ? a.cljs$core$IKVReduce$_kv_reduce$arity$3 : a) {
    return a.cljs$core$IKVReduce$_kv_reduce$arity$3(a, b, c)
  }
  var d;
  d = cljs.core._kv_reduce[goog.typeOf(null == a ? null : a)];
  if(!d && (d = cljs.core._kv_reduce._, !d)) {
    throw cljs.core.missing_protocol("IKVReduce.-kv-reduce", a);
  }
  return d.call(null, a, b, c)
};
cljs.core.IEquiv = {};
cljs.core._equiv = function(a, b) {
  if(a ? a.cljs$core$IEquiv$_equiv$arity$2 : a) {
    return a.cljs$core$IEquiv$_equiv$arity$2(a, b)
  }
  var c;
  c = cljs.core._equiv[goog.typeOf(null == a ? null : a)];
  if(!c && (c = cljs.core._equiv._, !c)) {
    throw cljs.core.missing_protocol("IEquiv.-equiv", a);
  }
  return c.call(null, a, b)
};
cljs.core.IHash = {};
cljs.core._hash = function(a) {
  if(a ? a.cljs$core$IHash$_hash$arity$1 : a) {
    return a.cljs$core$IHash$_hash$arity$1(a)
  }
  var b;
  b = cljs.core._hash[goog.typeOf(null == a ? null : a)];
  if(!b && (b = cljs.core._hash._, !b)) {
    throw cljs.core.missing_protocol("IHash.-hash", a);
  }
  return b.call(null, a)
};
cljs.core.ISeqable = {};
cljs.core._seq = function(a) {
  if(a ? a.cljs$core$ISeqable$_seq$arity$1 : a) {
    return a.cljs$core$ISeqable$_seq$arity$1(a)
  }
  var b;
  b = cljs.core._seq[goog.typeOf(null == a ? null : a)];
  if(!b && (b = cljs.core._seq._, !b)) {
    throw cljs.core.missing_protocol("ISeqable.-seq", a);
  }
  return b.call(null, a)
};
cljs.core.ISequential = {};
cljs.core.IList = {};
cljs.core.IRecord = {};
cljs.core.IReversible = {};
cljs.core._rseq = function(a) {
  if(a ? a.cljs$core$IReversible$_rseq$arity$1 : a) {
    return a.cljs$core$IReversible$_rseq$arity$1(a)
  }
  var b;
  b = cljs.core._rseq[goog.typeOf(null == a ? null : a)];
  if(!b && (b = cljs.core._rseq._, !b)) {
    throw cljs.core.missing_protocol("IReversible.-rseq", a);
  }
  return b.call(null, a)
};
cljs.core.ISorted = {};
cljs.core._sorted_seq = function(a, b) {
  if(a ? a.cljs$core$ISorted$_sorted_seq$arity$2 : a) {
    return a.cljs$core$ISorted$_sorted_seq$arity$2(a, b)
  }
  var c;
  c = cljs.core._sorted_seq[goog.typeOf(null == a ? null : a)];
  if(!c && (c = cljs.core._sorted_seq._, !c)) {
    throw cljs.core.missing_protocol("ISorted.-sorted-seq", a);
  }
  return c.call(null, a, b)
};
cljs.core._sorted_seq_from = function(a, b, c) {
  if(a ? a.cljs$core$ISorted$_sorted_seq_from$arity$3 : a) {
    return a.cljs$core$ISorted$_sorted_seq_from$arity$3(a, b, c)
  }
  var d;
  d = cljs.core._sorted_seq_from[goog.typeOf(null == a ? null : a)];
  if(!d && (d = cljs.core._sorted_seq_from._, !d)) {
    throw cljs.core.missing_protocol("ISorted.-sorted-seq-from", a);
  }
  return d.call(null, a, b, c)
};
cljs.core._entry_key = function(a, b) {
  if(a ? a.cljs$core$ISorted$_entry_key$arity$2 : a) {
    return a.cljs$core$ISorted$_entry_key$arity$2(a, b)
  }
  var c;
  c = cljs.core._entry_key[goog.typeOf(null == a ? null : a)];
  if(!c && (c = cljs.core._entry_key._, !c)) {
    throw cljs.core.missing_protocol("ISorted.-entry-key", a);
  }
  return c.call(null, a, b)
};
cljs.core._comparator = function(a) {
  if(a ? a.cljs$core$ISorted$_comparator$arity$1 : a) {
    return a.cljs$core$ISorted$_comparator$arity$1(a)
  }
  var b;
  b = cljs.core._comparator[goog.typeOf(null == a ? null : a)];
  if(!b && (b = cljs.core._comparator._, !b)) {
    throw cljs.core.missing_protocol("ISorted.-comparator", a);
  }
  return b.call(null, a)
};
cljs.core.IWriter = {};
cljs.core._write = function(a, b) {
  if(a ? a.cljs$core$IWriter$_write$arity$2 : a) {
    return a.cljs$core$IWriter$_write$arity$2(a, b)
  }
  var c;
  c = cljs.core._write[goog.typeOf(null == a ? null : a)];
  if(!c && (c = cljs.core._write._, !c)) {
    throw cljs.core.missing_protocol("IWriter.-write", a);
  }
  return c.call(null, a, b)
};
cljs.core._flush = function(a) {
  if(a ? a.cljs$core$IWriter$_flush$arity$1 : a) {
    return a.cljs$core$IWriter$_flush$arity$1(a)
  }
  var b;
  b = cljs.core._flush[goog.typeOf(null == a ? null : a)];
  if(!b && (b = cljs.core._flush._, !b)) {
    throw cljs.core.missing_protocol("IWriter.-flush", a);
  }
  return b.call(null, a)
};
cljs.core.IPrintWithWriter = {};
cljs.core._pr_writer = function(a, b, c) {
  if(a ? a.cljs$core$IPrintWithWriter$_pr_writer$arity$3 : a) {
    return a.cljs$core$IPrintWithWriter$_pr_writer$arity$3(a, b, c)
  }
  var d;
  d = cljs.core._pr_writer[goog.typeOf(null == a ? null : a)];
  if(!d && (d = cljs.core._pr_writer._, !d)) {
    throw cljs.core.missing_protocol("IPrintWithWriter.-pr-writer", a);
  }
  return d.call(null, a, b, c)
};
cljs.core.IPending = {};
cljs.core._realized_QMARK_ = function(a) {
  if(a ? a.cljs$core$IPending$_realized_QMARK_$arity$1 : a) {
    return a.cljs$core$IPending$_realized_QMARK_$arity$1(a)
  }
  var b;
  b = cljs.core._realized_QMARK_[goog.typeOf(null == a ? null : a)];
  if(!b && (b = cljs.core._realized_QMARK_._, !b)) {
    throw cljs.core.missing_protocol("IPending.-realized?", a);
  }
  return b.call(null, a)
};
cljs.core.IWatchable = {};
cljs.core._notify_watches = function(a, b, c) {
  if(a ? a.cljs$core$IWatchable$_notify_watches$arity$3 : a) {
    return a.cljs$core$IWatchable$_notify_watches$arity$3(a, b, c)
  }
  var d;
  d = cljs.core._notify_watches[goog.typeOf(null == a ? null : a)];
  if(!d && (d = cljs.core._notify_watches._, !d)) {
    throw cljs.core.missing_protocol("IWatchable.-notify-watches", a);
  }
  return d.call(null, a, b, c)
};
cljs.core._add_watch = function(a, b, c) {
  if(a ? a.cljs$core$IWatchable$_add_watch$arity$3 : a) {
    return a.cljs$core$IWatchable$_add_watch$arity$3(a, b, c)
  }
  var d;
  d = cljs.core._add_watch[goog.typeOf(null == a ? null : a)];
  if(!d && (d = cljs.core._add_watch._, !d)) {
    throw cljs.core.missing_protocol("IWatchable.-add-watch", a);
  }
  return d.call(null, a, b, c)
};
cljs.core._remove_watch = function(a, b) {
  if(a ? a.cljs$core$IWatchable$_remove_watch$arity$2 : a) {
    return a.cljs$core$IWatchable$_remove_watch$arity$2(a, b)
  }
  var c;
  c = cljs.core._remove_watch[goog.typeOf(null == a ? null : a)];
  if(!c && (c = cljs.core._remove_watch._, !c)) {
    throw cljs.core.missing_protocol("IWatchable.-remove-watch", a);
  }
  return c.call(null, a, b)
};
cljs.core.IEditableCollection = {};
cljs.core._as_transient = function(a) {
  if(a ? a.cljs$core$IEditableCollection$_as_transient$arity$1 : a) {
    return a.cljs$core$IEditableCollection$_as_transient$arity$1(a)
  }
  var b;
  b = cljs.core._as_transient[goog.typeOf(null == a ? null : a)];
  if(!b && (b = cljs.core._as_transient._, !b)) {
    throw cljs.core.missing_protocol("IEditableCollection.-as-transient", a);
  }
  return b.call(null, a)
};
cljs.core.ITransientCollection = {};
cljs.core._conj_BANG_ = function(a, b) {
  if(a ? a.cljs$core$ITransientCollection$_conj_BANG_$arity$2 : a) {
    return a.cljs$core$ITransientCollection$_conj_BANG_$arity$2(a, b)
  }
  var c;
  c = cljs.core._conj_BANG_[goog.typeOf(null == a ? null : a)];
  if(!c && (c = cljs.core._conj_BANG_._, !c)) {
    throw cljs.core.missing_protocol("ITransientCollection.-conj!", a);
  }
  return c.call(null, a, b)
};
cljs.core._persistent_BANG_ = function(a) {
  if(a ? a.cljs$core$ITransientCollection$_persistent_BANG_$arity$1 : a) {
    return a.cljs$core$ITransientCollection$_persistent_BANG_$arity$1(a)
  }
  var b;
  b = cljs.core._persistent_BANG_[goog.typeOf(null == a ? null : a)];
  if(!b && (b = cljs.core._persistent_BANG_._, !b)) {
    throw cljs.core.missing_protocol("ITransientCollection.-persistent!", a);
  }
  return b.call(null, a)
};
cljs.core.ITransientAssociative = {};
cljs.core._assoc_BANG_ = function(a, b, c) {
  if(a ? a.cljs$core$ITransientAssociative$_assoc_BANG_$arity$3 : a) {
    return a.cljs$core$ITransientAssociative$_assoc_BANG_$arity$3(a, b, c)
  }
  var d;
  d = cljs.core._assoc_BANG_[goog.typeOf(null == a ? null : a)];
  if(!d && (d = cljs.core._assoc_BANG_._, !d)) {
    throw cljs.core.missing_protocol("ITransientAssociative.-assoc!", a);
  }
  return d.call(null, a, b, c)
};
cljs.core.ITransientMap = {};
cljs.core._dissoc_BANG_ = function(a, b) {
  if(a ? a.cljs$core$ITransientMap$_dissoc_BANG_$arity$2 : a) {
    return a.cljs$core$ITransientMap$_dissoc_BANG_$arity$2(a, b)
  }
  var c;
  c = cljs.core._dissoc_BANG_[goog.typeOf(null == a ? null : a)];
  if(!c && (c = cljs.core._dissoc_BANG_._, !c)) {
    throw cljs.core.missing_protocol("ITransientMap.-dissoc!", a);
  }
  return c.call(null, a, b)
};
cljs.core.ITransientVector = {};
cljs.core._assoc_n_BANG_ = function(a, b, c) {
  if(a ? a.cljs$core$ITransientVector$_assoc_n_BANG_$arity$3 : a) {
    return a.cljs$core$ITransientVector$_assoc_n_BANG_$arity$3(a, b, c)
  }
  var d;
  d = cljs.core._assoc_n_BANG_[goog.typeOf(null == a ? null : a)];
  if(!d && (d = cljs.core._assoc_n_BANG_._, !d)) {
    throw cljs.core.missing_protocol("ITransientVector.-assoc-n!", a);
  }
  return d.call(null, a, b, c)
};
cljs.core._pop_BANG_ = function(a) {
  if(a ? a.cljs$core$ITransientVector$_pop_BANG_$arity$1 : a) {
    return a.cljs$core$ITransientVector$_pop_BANG_$arity$1(a)
  }
  var b;
  b = cljs.core._pop_BANG_[goog.typeOf(null == a ? null : a)];
  if(!b && (b = cljs.core._pop_BANG_._, !b)) {
    throw cljs.core.missing_protocol("ITransientVector.-pop!", a);
  }
  return b.call(null, a)
};
cljs.core.ITransientSet = {};
cljs.core._disjoin_BANG_ = function(a, b) {
  if(a ? a.cljs$core$ITransientSet$_disjoin_BANG_$arity$2 : a) {
    return a.cljs$core$ITransientSet$_disjoin_BANG_$arity$2(a, b)
  }
  var c;
  c = cljs.core._disjoin_BANG_[goog.typeOf(null == a ? null : a)];
  if(!c && (c = cljs.core._disjoin_BANG_._, !c)) {
    throw cljs.core.missing_protocol("ITransientSet.-disjoin!", a);
  }
  return c.call(null, a, b)
};
cljs.core.IComparable = {};
cljs.core._compare = function(a, b) {
  if(a ? a.cljs$core$IComparable$_compare$arity$2 : a) {
    return a.cljs$core$IComparable$_compare$arity$2(a, b)
  }
  var c;
  c = cljs.core._compare[goog.typeOf(null == a ? null : a)];
  if(!c && (c = cljs.core._compare._, !c)) {
    throw cljs.core.missing_protocol("IComparable.-compare", a);
  }
  return c.call(null, a, b)
};
cljs.core.IChunk = {};
cljs.core._drop_first = function(a) {
  if(a ? a.cljs$core$IChunk$_drop_first$arity$1 : a) {
    return a.cljs$core$IChunk$_drop_first$arity$1(a)
  }
  var b;
  b = cljs.core._drop_first[goog.typeOf(null == a ? null : a)];
  if(!b && (b = cljs.core._drop_first._, !b)) {
    throw cljs.core.missing_protocol("IChunk.-drop-first", a);
  }
  return b.call(null, a)
};
cljs.core.IChunkedSeq = {};
cljs.core._chunked_first = function(a) {
  if(a ? a.cljs$core$IChunkedSeq$_chunked_first$arity$1 : a) {
    return a.cljs$core$IChunkedSeq$_chunked_first$arity$1(a)
  }
  var b;
  b = cljs.core._chunked_first[goog.typeOf(null == a ? null : a)];
  if(!b && (b = cljs.core._chunked_first._, !b)) {
    throw cljs.core.missing_protocol("IChunkedSeq.-chunked-first", a);
  }
  return b.call(null, a)
};
cljs.core._chunked_rest = function(a) {
  if(a ? a.cljs$core$IChunkedSeq$_chunked_rest$arity$1 : a) {
    return a.cljs$core$IChunkedSeq$_chunked_rest$arity$1(a)
  }
  var b;
  b = cljs.core._chunked_rest[goog.typeOf(null == a ? null : a)];
  if(!b && (b = cljs.core._chunked_rest._, !b)) {
    throw cljs.core.missing_protocol("IChunkedSeq.-chunked-rest", a);
  }
  return b.call(null, a)
};
cljs.core.IChunkedNext = {};
cljs.core._chunked_next = function(a) {
  if(a ? a.cljs$core$IChunkedNext$_chunked_next$arity$1 : a) {
    return a.cljs$core$IChunkedNext$_chunked_next$arity$1(a)
  }
  var b;
  b = cljs.core._chunked_next[goog.typeOf(null == a ? null : a)];
  if(!b && (b = cljs.core._chunked_next._, !b)) {
    throw cljs.core.missing_protocol("IChunkedNext.-chunked-next", a);
  }
  return b.call(null, a)
};
cljs.core.INamed = {};
cljs.core._name = function(a) {
  if(a ? a.cljs$core$INamed$_name$arity$1 : a) {
    return a.cljs$core$INamed$_name$arity$1(a)
  }
  var b;
  b = cljs.core._name[goog.typeOf(null == a ? null : a)];
  if(!b && (b = cljs.core._name._, !b)) {
    throw cljs.core.missing_protocol("INamed.-name", a);
  }
  return b.call(null, a)
};
cljs.core._namespace = function(a) {
  if(a ? a.cljs$core$INamed$_namespace$arity$1 : a) {
    return a.cljs$core$INamed$_namespace$arity$1(a)
  }
  var b;
  b = cljs.core._namespace[goog.typeOf(null == a ? null : a)];
  if(!b && (b = cljs.core._namespace._, !b)) {
    throw cljs.core.missing_protocol("INamed.-namespace", a);
  }
  return b.call(null, a)
};
cljs.core.StringBufferWriter = function(a) {
  this.sb = a;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 1073741824
};
cljs.core.StringBufferWriter.cljs$lang$type = !0;
cljs.core.StringBufferWriter.cljs$lang$ctorStr = "cljs.core/StringBufferWriter";
cljs.core.StringBufferWriter.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write(b, "cljs.core/StringBufferWriter")
};
cljs.core.StringBufferWriter.prototype.cljs$core$IWriter$_write$arity$2 = function(a, b) {
  return this.sb.append(b)
};
cljs.core.StringBufferWriter.prototype.cljs$core$IWriter$_flush$arity$1 = function(a) {
  return null
};
cljs.core.__GT_StringBufferWriter = function(a) {
  return new cljs.core.StringBufferWriter(a)
};
cljs.core.pr_str_STAR_ = function(a) {
  var b = new goog.string.StringBuffer, c = new cljs.core.StringBufferWriter(b);
  a.cljs$core$IPrintWithWriter$_pr_writer$arity$3(a, c, cljs.core.pr_opts());
  cljs.core._flush(c);
  return"" + cljs.core.str(b)
};
cljs.core.instance_QMARK_ = function(a, b) {
  return b instanceof a
};
cljs.core.symbol_QMARK_ = function(a) {
  return a instanceof cljs.core.Symbol
};
cljs.core.Symbol = function(a, b, c, d, e) {
  this.ns = a;
  this.name = b;
  this.str = c;
  this._hash = d;
  this._meta = e;
  this.cljs$lang$protocol_mask$partition0$ = 2154168321;
  this.cljs$lang$protocol_mask$partition1$ = 4096
};
cljs.core.Symbol.cljs$lang$type = !0;
cljs.core.Symbol.cljs$lang$ctorStr = "cljs.core/Symbol";
cljs.core.Symbol.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write(b, "cljs.core/Symbol")
};
cljs.core.Symbol.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core._write(b, this.str)
};
cljs.core.Symbol.prototype.cljs$core$INamed$_name$arity$1 = function(a) {
  return this.name
};
cljs.core.Symbol.prototype.cljs$core$INamed$_namespace$arity$1 = function(a) {
  return this.ns
};
cljs.core.Symbol.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  -1 === this._hash && (this._hash = cljs.core.hash_combine.cljs$core$IFn$_invoke$arity$2 ? cljs.core.hash_combine.cljs$core$IFn$_invoke$arity$2(cljs.core.hash.cljs$core$IFn$_invoke$arity$1 ? cljs.core.hash.cljs$core$IFn$_invoke$arity$1(this.ns) : cljs.core.hash.call(null, this.ns), cljs.core.hash.cljs$core$IFn$_invoke$arity$1 ? cljs.core.hash.cljs$core$IFn$_invoke$arity$1(this.name) : cljs.core.hash.call(null, this.name)) : cljs.core.hash_combine.call(null, cljs.core.hash.cljs$core$IFn$_invoke$arity$1 ? 
  cljs.core.hash.cljs$core$IFn$_invoke$arity$1(this.ns) : cljs.core.hash.call(null, this.ns), cljs.core.hash.cljs$core$IFn$_invoke$arity$1 ? cljs.core.hash.cljs$core$IFn$_invoke$arity$1(this.name) : cljs.core.hash.call(null, this.name)));
  return this._hash
};
cljs.core.Symbol.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.Symbol(this.ns, this.name, this.str, this._hash, b)
};
cljs.core.Symbol.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return this._meta
};
cljs.core.Symbol.prototype.call = function() {
  var a = null;
  return a = function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return cljs.core._lookup.cljs$core$IFn$_invoke$arity$3(c, this, null);
      case 3:
        return cljs.core._lookup.cljs$core$IFn$_invoke$arity$3(c, this, d)
    }
    throw Error("Invalid arity: " + arguments.length);
  }
}();
cljs.core.Symbol.prototype.apply = function(a, b) {
  a = this;
  return a.call.apply(a, [a].concat(b.slice()))
};
cljs.core.Symbol.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return b instanceof cljs.core.Symbol ? this.str === b.str : !1
};
cljs.core.Symbol.prototype.toString = function() {
  return this.str
};
cljs.core.__GT_Symbol = function(a, b, c, d, e) {
  return new cljs.core.Symbol(a, b, c, d, e)
};
cljs.core.symbol = function() {
  var a = null, b = function(b) {
    return b instanceof cljs.core.Symbol ? b : a.cljs$core$IFn$_invoke$arity$2(null, b)
  }, c = function(a, b) {
    var c = null != a ? [cljs.core.str(a), cljs.core.str("/"), cljs.core.str(b)].join("") : b;
    return new cljs.core.Symbol(a, b, c, -1, null)
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a
}();
cljs.core.seq = function(a) {
  if(null == a) {
    return null
  }
  var b;
  a ? (b = (b = a.cljs$lang$protocol_mask$partition0$ & 8388608) ? b : a.cljs$core$ISeqable$, b = b ? !0 : !1) : b = !1;
  if(b) {
    return a.cljs$core$ISeqable$_seq$arity$1(a)
  }
  if(a instanceof Array || cljs.core.string_QMARK_(a)) {
    return 0 === a.length ? null : new cljs.core.IndexedSeq(a, 0)
  }
  if(cljs.core.type_satisfies_(cljs.core.ILookup, a)) {
    return cljs.core._seq(a)
  }
  throw Error([cljs.core.str(a), cljs.core.str("is not ISeqable")].join(""));
};
cljs.core.first = function(a) {
  if(null == a) {
    return null
  }
  var b;
  a ? (b = (b = a.cljs$lang$protocol_mask$partition0$ & 64) ? b : a.cljs$core$ISeq$, b = b ? !0 : !1) : b = !1;
  if(b) {
    return a.cljs$core$ISeq$_first$arity$1(a)
  }
  a = cljs.core.seq(a);
  return null == a ? null : cljs.core._first(a)
};
cljs.core.rest = function(a) {
  if(null != a) {
    var b;
    a ? (b = (b = a.cljs$lang$protocol_mask$partition0$ & 64) ? b : a.cljs$core$ISeq$, b = b ? !0 : !1) : b = !1;
    if(b) {
      return a.cljs$core$ISeq$_rest$arity$1(a)
    }
    a = cljs.core.seq(a);
    return null != a ? cljs.core._rest(a) : cljs.core.List.EMPTY
  }
  return cljs.core.List.EMPTY
};
cljs.core.next = function(a) {
  if(null == a) {
    a = null
  }else {
    var b;
    a ? (b = (b = a.cljs$lang$protocol_mask$partition0$ & 128) ? b : a.cljs$core$INext$, b = b ? !0 : !1) : b = !1;
    a = b ? a.cljs$core$INext$_next$arity$1(a) : cljs.core.seq(cljs.core.rest(a))
  }
  return a
};
cljs.core._EQ_ = function() {
  var a = null, b = function(a, b) {
    var c = a === b;
    return c ? c : cljs.core._equiv(a, b)
  }, c = function() {
    var b = function(b, c, d) {
      for(;;) {
        if(cljs.core.truth_(a.cljs$core$IFn$_invoke$arity$2(b, c))) {
          if(cljs.core.next(d)) {
            b = c, c = cljs.core.first(d), d = cljs.core.next(d)
          }else {
            return a.cljs$core$IFn$_invoke$arity$2(c, cljs.core.first(d))
          }
        }else {
          return!1
        }
      }
    }, c = function(a, c, e) {
      var k = null;
      2 < arguments.length && (k = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, c, k)
    };
    c.cljs$lang$maxFixedArity = 2;
    c.cljs$lang$applyTo = function(a) {
      var c = cljs.core.first(a);
      a = cljs.core.next(a);
      var e = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(c, e, a)
    };
    c.cljs$core$IFn$_invoke$arity$variadic = b;
    return c
  }(), a = function(a, e, f) {
    switch(arguments.length) {
      case 1:
        return!0;
      case 2:
        return b.call(this, a, e);
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(a, e, cljs.core.array_seq(arguments, 2))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return!0
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.IHash["null"] = !0;
cljs.core._hash["null"] = function(a) {
  return 0
};
cljs.core.INext["null"] = !0;
cljs.core._next["null"] = function(a) {
  return null
};
cljs.core.IKVReduce["null"] = !0;
cljs.core._kv_reduce["null"] = function(a, b, c) {
  return c
};
cljs.core.ISet["null"] = !0;
cljs.core._disjoin["null"] = function(a, b) {
  return null
};
cljs.core.ICounted["null"] = !0;
cljs.core._count["null"] = function(a) {
  return 0
};
cljs.core.IStack["null"] = !0;
cljs.core._peek["null"] = function(a) {
  return null
};
cljs.core._pop["null"] = function(a) {
  return null
};
cljs.core.IEquiv["null"] = !0;
cljs.core._equiv["null"] = function(a, b) {
  return null == b
};
cljs.core.IWithMeta["null"] = !0;
cljs.core._with_meta["null"] = function(a, b) {
  return null
};
cljs.core.IMeta["null"] = !0;
cljs.core._meta["null"] = function(a) {
  return null
};
cljs.core.IEmptyableCollection["null"] = !0;
cljs.core._empty["null"] = function(a) {
  return null
};
cljs.core.IMap["null"] = !0;
cljs.core._dissoc["null"] = function(a, b) {
  return null
};
Date.prototype.cljs$core$IEquiv$ = !0;
Date.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  var c = b instanceof Date;
  return c ? a.toString() === b.toString() : c
};
cljs.core.IHash.number = !0;
cljs.core._hash.number = function(a) {
  return Math.floor(a) % 2147483647
};
cljs.core.IEquiv.number = !0;
cljs.core._equiv.number = function(a, b) {
  return a === b
};
cljs.core.IHash["boolean"] = !0;
cljs.core._hash["boolean"] = function(a) {
  return!0 === a ? 1 : 0
};
cljs.core.IMeta["function"] = !0;
cljs.core._meta["function"] = function(a) {
  return null
};
cljs.core.Fn["function"] = !0;
cljs.core.IHash._ = !0;
cljs.core._hash._ = function(a) {
  return goog.getUid(a)
};
cljs.core.inc = function(a) {
  return a + 1
};
cljs.core.Reduced = function(a) {
  this.val = a;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 32768
};
cljs.core.Reduced.cljs$lang$type = !0;
cljs.core.Reduced.cljs$lang$ctorStr = "cljs.core/Reduced";
cljs.core.Reduced.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write(b, "cljs.core/Reduced")
};
cljs.core.Reduced.prototype.cljs$core$IDeref$_deref$arity$1 = function(a) {
  return this.val
};
cljs.core.__GT_Reduced = function(a) {
  return new cljs.core.Reduced(a)
};
cljs.core.reduced = function(a) {
  return new cljs.core.Reduced(a)
};
cljs.core.reduced_QMARK_ = function(a) {
  return a instanceof cljs.core.Reduced
};
cljs.core.ci_reduce = function() {
  var a = null, b = function(a, b) {
    var c = cljs.core._count(a);
    if(0 === c) {
      return b.cljs$core$IFn$_invoke$arity$0 ? b.cljs$core$IFn$_invoke$arity$0() : b.call(null)
    }
    for(var d = cljs.core._nth.cljs$core$IFn$_invoke$arity$2(a, 0), k = 1;;) {
      if(k < c) {
        d = b.cljs$core$IFn$_invoke$arity$2 ? b.cljs$core$IFn$_invoke$arity$2(d, cljs.core._nth.cljs$core$IFn$_invoke$arity$2(a, k)) : b.call(null, d, cljs.core._nth.cljs$core$IFn$_invoke$arity$2(a, k));
        if(cljs.core.reduced_QMARK_(d)) {
          return cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(d) : cljs.core.deref.call(null, d)
        }
        k += 1
      }else {
        return d
      }
    }
  }, c = function(a, b, c) {
    for(var d = cljs.core._count(a), k = 0;;) {
      if(k < d) {
        c = b.cljs$core$IFn$_invoke$arity$2 ? b.cljs$core$IFn$_invoke$arity$2(c, cljs.core._nth.cljs$core$IFn$_invoke$arity$2(a, k)) : b.call(null, c, cljs.core._nth.cljs$core$IFn$_invoke$arity$2(a, k));
        if(cljs.core.reduced_QMARK_(c)) {
          return cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(c) : cljs.core.deref.call(null, c)
        }
        k += 1
      }else {
        return c
      }
    }
  }, d = function(a, b, c, d) {
    for(var k = cljs.core._count(a);;) {
      if(d < k) {
        c = b.cljs$core$IFn$_invoke$arity$2 ? b.cljs$core$IFn$_invoke$arity$2(c, cljs.core._nth.cljs$core$IFn$_invoke$arity$2(a, d)) : b.call(null, c, cljs.core._nth.cljs$core$IFn$_invoke$arity$2(a, d));
        if(cljs.core.reduced_QMARK_(c)) {
          return cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(c) : cljs.core.deref.call(null, c)
        }
        d += 1
      }else {
        return c
      }
    }
  }, a = function(a, f, g, h) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, f);
      case 3:
        return c.call(this, a, f, g);
      case 4:
        return d.call(this, a, f, g, h)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  a.cljs$core$IFn$_invoke$arity$4 = d;
  return a
}();
cljs.core.array_reduce = function() {
  var a = null, b = function(a, b) {
    var c = a.length;
    if(0 === a.length) {
      return b.cljs$core$IFn$_invoke$arity$0 ? b.cljs$core$IFn$_invoke$arity$0() : b.call(null)
    }
    for(var d = a[0], k = 1;;) {
      if(k < c) {
        d = b.cljs$core$IFn$_invoke$arity$2 ? b.cljs$core$IFn$_invoke$arity$2(d, a[k]) : b.call(null, d, a[k]);
        if(cljs.core.reduced_QMARK_(d)) {
          return cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(d) : cljs.core.deref.call(null, d)
        }
        k += 1
      }else {
        return d
      }
    }
  }, c = function(a, b, c) {
    for(var d = a.length, k = 0;;) {
      if(k < d) {
        c = b.cljs$core$IFn$_invoke$arity$2 ? b.cljs$core$IFn$_invoke$arity$2(c, a[k]) : b.call(null, c, a[k]);
        if(cljs.core.reduced_QMARK_(c)) {
          return cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(c) : cljs.core.deref.call(null, c)
        }
        k += 1
      }else {
        return c
      }
    }
  }, d = function(a, b, c, d) {
    for(var k = a.length;;) {
      if(d < k) {
        c = b.cljs$core$IFn$_invoke$arity$2 ? b.cljs$core$IFn$_invoke$arity$2(c, a[d]) : b.call(null, c, a[d]);
        if(cljs.core.reduced_QMARK_(c)) {
          return cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(c) : cljs.core.deref.call(null, c)
        }
        d += 1
      }else {
        return c
      }
    }
  }, a = function(a, f, g, h) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, f);
      case 3:
        return c.call(this, a, f, g);
      case 4:
        return d.call(this, a, f, g, h)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  a.cljs$core$IFn$_invoke$arity$4 = d;
  return a
}();
cljs.core.counted_QMARK_ = function(a) {
  if(a) {
    var b;
    b = (b = a.cljs$lang$protocol_mask$partition0$ & 2) ? b : a.cljs$core$ICounted$;
    return b ? !0 : a.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.type_satisfies_(cljs.core.ICounted, a)
  }
  return cljs.core.type_satisfies_(cljs.core.ICounted, a)
};
cljs.core.indexed_QMARK_ = function(a) {
  if(a) {
    var b;
    b = (b = a.cljs$lang$protocol_mask$partition0$ & 16) ? b : a.cljs$core$IIndexed$;
    return b ? !0 : a.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.type_satisfies_(cljs.core.IIndexed, a)
  }
  return cljs.core.type_satisfies_(cljs.core.IIndexed, a)
};
cljs.core.IndexedSeq = function(a, b) {
  this.arr = a;
  this.i = b;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 166199550
};
cljs.core.IndexedSeq.cljs$lang$type = !0;
cljs.core.IndexedSeq.cljs$lang$ctorStr = "cljs.core/IndexedSeq";
cljs.core.IndexedSeq.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write(b, "cljs.core/IndexedSeq")
};
cljs.core.IndexedSeq.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  return cljs.core.hash_coll.cljs$core$IFn$_invoke$arity$1 ? cljs.core.hash_coll.cljs$core$IFn$_invoke$arity$1(a) : cljs.core.hash_coll.call(null, a)
};
cljs.core.IndexedSeq.prototype.cljs$core$INext$_next$arity$1 = function(a) {
  return this.i + 1 < this.arr.length ? new cljs.core.IndexedSeq(this.arr, this.i + 1) : null
};
cljs.core.IndexedSeq.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return cljs.core.cons.cljs$core$IFn$_invoke$arity$2 ? cljs.core.cons.cljs$core$IFn$_invoke$arity$2(b, a) : cljs.core.cons.call(null, b, a)
};
cljs.core.IndexedSeq.prototype.cljs$core$IReversible$_rseq$arity$1 = function(a) {
  var b = a.cljs$core$ICounted$_count$arity$1(a);
  return 0 < b ? new cljs.core.RSeq(a, b - 1, null) : cljs.core.List.EMPTY
};
cljs.core.IndexedSeq.prototype.toString = function() {
  return cljs.core.pr_str_STAR_(this)
};
cljs.core.IndexedSeq.prototype.cljs$core$IReduce$_reduce$arity$2 = function(a, b) {
  return cljs.core.array_reduce.cljs$core$IFn$_invoke$arity$4(this.arr, b, this.arr[this.i], this.i + 1)
};
cljs.core.IndexedSeq.prototype.cljs$core$IReduce$_reduce$arity$3 = function(a, b, c) {
  return cljs.core.array_reduce.cljs$core$IFn$_invoke$arity$4(this.arr, b, c, this.i)
};
cljs.core.IndexedSeq.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return a
};
cljs.core.IndexedSeq.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  return this.arr.length - this.i
};
cljs.core.IndexedSeq.prototype.cljs$core$ISeq$_first$arity$1 = function(a) {
  return this.arr[this.i]
};
cljs.core.IndexedSeq.prototype.cljs$core$ISeq$_rest$arity$1 = function(a) {
  return this.i + 1 < this.arr.length ? new cljs.core.IndexedSeq(this.arr, this.i + 1) : cljs.core.list.cljs$core$IFn$_invoke$arity$0 ? cljs.core.list.cljs$core$IFn$_invoke$arity$0() : cljs.core.list.call(null)
};
cljs.core.IndexedSeq.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential.cljs$core$IFn$_invoke$arity$2 ? cljs.core.equiv_sequential.cljs$core$IFn$_invoke$arity$2(a, b) : cljs.core.equiv_sequential.call(null, a, b)
};
cljs.core.IndexedSeq.prototype.cljs$core$IIndexed$_nth$arity$2 = function(a, b) {
  var c = b + this.i;
  return c < this.arr.length ? this.arr[c] : null
};
cljs.core.IndexedSeq.prototype.cljs$core$IIndexed$_nth$arity$3 = function(a, b, c) {
  a = b + this.i;
  return a < this.arr.length ? this.arr[a] : c
};
cljs.core.IndexedSeq.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return cljs.core.List.EMPTY
};
cljs.core.__GT_IndexedSeq = function(a, b) {
  return new cljs.core.IndexedSeq(a, b)
};
cljs.core.prim_seq = function() {
  var a = null, b = function(b) {
    return a.cljs$core$IFn$_invoke$arity$2(b, 0)
  }, c = function(a, b) {
    return b < a.length ? new cljs.core.IndexedSeq(a, b) : null
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a
}();
cljs.core.array_seq = function() {
  var a = null, b = function(a) {
    return cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(a, 0)
  }, c = function(a, b) {
    return cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(a, b)
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a
}();
cljs.core.IReduce.array = !0;
cljs.core._reduce.array = function(a, b) {
  return cljs.core.array_reduce.cljs$core$IFn$_invoke$arity$2(a, b)
};
cljs.core._reduce.array = function(a, b, c) {
  return cljs.core.array_reduce.cljs$core$IFn$_invoke$arity$3(a, b, c)
};
cljs.core.RSeq = function(a, b, c) {
  this.ci = a;
  this.i = b;
  this.meta = c;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 31850574
};
cljs.core.RSeq.cljs$lang$type = !0;
cljs.core.RSeq.cljs$lang$ctorStr = "cljs.core/RSeq";
cljs.core.RSeq.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write(b, "cljs.core/RSeq")
};
cljs.core.RSeq.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  return cljs.core.hash_coll.cljs$core$IFn$_invoke$arity$1 ? cljs.core.hash_coll.cljs$core$IFn$_invoke$arity$1(a) : cljs.core.hash_coll.call(null, a)
};
cljs.core.RSeq.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return cljs.core.cons.cljs$core$IFn$_invoke$arity$2 ? cljs.core.cons.cljs$core$IFn$_invoke$arity$2(b, a) : cljs.core.cons.call(null, b, a)
};
cljs.core.RSeq.prototype.toString = function() {
  return cljs.core.pr_str_STAR_(this)
};
cljs.core.RSeq.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return a
};
cljs.core.RSeq.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  return this.i + 1
};
cljs.core.RSeq.prototype.cljs$core$ISeq$_first$arity$1 = function(a) {
  return cljs.core._nth.cljs$core$IFn$_invoke$arity$2(this.ci, this.i)
};
cljs.core.RSeq.prototype.cljs$core$ISeq$_rest$arity$1 = function(a) {
  return 0 < this.i ? new cljs.core.RSeq(this.ci, this.i - 1, null) : cljs.core.List.EMPTY
};
cljs.core.RSeq.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential.cljs$core$IFn$_invoke$arity$2 ? cljs.core.equiv_sequential.cljs$core$IFn$_invoke$arity$2(a, b) : cljs.core.equiv_sequential.call(null, a, b)
};
cljs.core.RSeq.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.RSeq(this.ci, this.i, b)
};
cljs.core.RSeq.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return this.meta
};
cljs.core.RSeq.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return cljs.core.with_meta.cljs$core$IFn$_invoke$arity$2 ? cljs.core.with_meta.cljs$core$IFn$_invoke$arity$2(cljs.core.List.EMPTY, this.meta) : cljs.core.with_meta.call(null, cljs.core.List.EMPTY, this.meta)
};
cljs.core.__GT_RSeq = function(a, b, c) {
  return new cljs.core.RSeq(a, b, c)
};
cljs.core.second = function(a) {
  return cljs.core.first(cljs.core.next(a))
};
cljs.core.ffirst = function(a) {
  return cljs.core.first(cljs.core.first(a))
};
cljs.core.nfirst = function(a) {
  return cljs.core.next(cljs.core.first(a))
};
cljs.core.fnext = function(a) {
  return cljs.core.first(cljs.core.next(a))
};
cljs.core.nnext = function(a) {
  return cljs.core.next(cljs.core.next(a))
};
cljs.core.last = function(a) {
  for(;;) {
    var b = cljs.core.next(a);
    if(null != b) {
      a = b
    }else {
      return cljs.core.first(a)
    }
  }
};
cljs.core.IEquiv._ = !0;
cljs.core._equiv._ = function(a, b) {
  return a === b
};
cljs.core.conj = function() {
  var a = null, b = function(a, b) {
    return null != a ? cljs.core._conj(a, b) : cljs.core.list.cljs$core$IFn$_invoke$arity$1 ? cljs.core.list.cljs$core$IFn$_invoke$arity$1(b) : cljs.core.list.call(null, b)
  }, c = function() {
    var b = function(b, c, d) {
      for(;;) {
        if(cljs.core.truth_(d)) {
          b = a.cljs$core$IFn$_invoke$arity$2(b, c), c = cljs.core.first(d), d = cljs.core.next(d)
        }else {
          return a.cljs$core$IFn$_invoke$arity$2(b, c)
        }
      }
    }, c = function(a, c, e) {
      var k = null;
      2 < arguments.length && (k = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, c, k)
    };
    c.cljs$lang$maxFixedArity = 2;
    c.cljs$lang$applyTo = function(a) {
      var c = cljs.core.first(a);
      a = cljs.core.next(a);
      var e = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(c, e, a)
    };
    c.cljs$core$IFn$_invoke$arity$variadic = b;
    return c
  }(), a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(a, e, cljs.core.array_seq(arguments, 2))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.empty = function(a) {
  return cljs.core._empty(a)
};
cljs.core.accumulating_seq_count = function(a) {
  a = cljs.core.seq(a);
  for(var b = 0;;) {
    if(cljs.core.counted_QMARK_(a)) {
      return b + cljs.core._count(a)
    }
    a = cljs.core.next(a);
    b += 1
  }
};
cljs.core.count = function(a) {
  if(null != a) {
    var b;
    a ? (b = (b = a.cljs$lang$protocol_mask$partition0$ & 2) ? b : a.cljs$core$ICounted$, b = b ? !0 : !1) : b = !1;
    a = b ? a.cljs$core$ICounted$_count$arity$1(a) : a instanceof Array ? a.length : cljs.core.string_QMARK_(a) ? a.length : cljs.core.type_satisfies_(cljs.core.ICounted, a) ? cljs.core._count(a) : cljs.core.accumulating_seq_count(a)
  }else {
    a = 0
  }
  return a
};
cljs.core.linear_traversal_nth = function() {
  var a = null, b = function(a, b) {
    for(;;) {
      if(null == a) {
        throw Error("Index out of bounds");
      }
      if(0 === b) {
        if(cljs.core.seq(a)) {
          return cljs.core.first(a)
        }
        throw Error("Index out of bounds");
      }
      if(cljs.core.indexed_QMARK_(a)) {
        return cljs.core._nth.cljs$core$IFn$_invoke$arity$2(a, b)
      }
      if(cljs.core.seq(a)) {
        var c = cljs.core.next(a), g = b - 1;
        a = c;
        b = g
      }else {
        throw Error("Index out of bounds");
      }
    }
  }, c = function(a, b, c) {
    for(;;) {
      if(null == a) {
        return c
      }
      if(0 === b) {
        return cljs.core.seq(a) ? cljs.core.first(a) : c
      }
      if(cljs.core.indexed_QMARK_(a)) {
        return cljs.core._nth.cljs$core$IFn$_invoke$arity$3(a, b, c)
      }
      if(cljs.core.seq(a)) {
        a = cljs.core.next(a), b -= 1
      }else {
        return c
      }
    }
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a
}();
cljs.core.nth = function() {
  var a = null, b = function(a, b) {
    var c;
    null == a ? c = null : (a ? (c = (c = a.cljs$lang$protocol_mask$partition0$ & 16) ? c : a.cljs$core$IIndexed$, c = c ? !0 : !1) : c = !1, c = c ? a.cljs$core$IIndexed$_nth$arity$2(a, Math.floor(b)) : a instanceof Array ? b < a.length ? a[b] : null : cljs.core.string_QMARK_(a) ? b < a.length ? a[b] : null : cljs.core.type_satisfies_(cljs.core.IIndexed, a) ? cljs.core._nth.cljs$core$IFn$_invoke$arity$2(a, b) : cljs.core.linear_traversal_nth.cljs$core$IFn$_invoke$arity$2(a, Math.floor(b)));
    return c
  }, c = function(a, b, c) {
    if(null != a) {
      var g;
      a ? (g = (g = a.cljs$lang$protocol_mask$partition0$ & 16) ? g : a.cljs$core$IIndexed$, g = g ? !0 : !1) : g = !1;
      a = g ? a.cljs$core$IIndexed$_nth$arity$3(a, Math.floor(b), c) : a instanceof Array ? b < a.length ? a[b] : c : cljs.core.string_QMARK_(a) ? b < a.length ? a[b] : c : cljs.core.type_satisfies_(cljs.core.IIndexed, a) ? cljs.core._nth.cljs$core$IFn$_invoke$arity$2(a, b) : cljs.core.linear_traversal_nth.cljs$core$IFn$_invoke$arity$3(a, Math.floor(b), c)
    }else {
      a = c
    }
    return a
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a
}();
cljs.core.get = function() {
  var a = null, b = function(a, b) {
    var c;
    null == a ? c = null : (a ? (c = (c = a.cljs$lang$protocol_mask$partition0$ & 256) ? c : a.cljs$core$ILookup$, c = c ? !0 : !1) : c = !1, c = c ? a.cljs$core$ILookup$_lookup$arity$2(a, b) : a instanceof Array ? b < a.length ? a[b] : null : cljs.core.string_QMARK_(a) ? b < a.length ? a[b] : null : cljs.core.type_satisfies_(cljs.core.ILookup, a) ? cljs.core._lookup.cljs$core$IFn$_invoke$arity$2(a, b) : null);
    return c
  }, c = function(a, b, c) {
    if(null != a) {
      var g;
      a ? (g = (g = a.cljs$lang$protocol_mask$partition0$ & 256) ? g : a.cljs$core$ILookup$, g = g ? !0 : !1) : g = !1;
      a = g ? a.cljs$core$ILookup$_lookup$arity$3(a, b, c) : a instanceof Array ? b < a.length ? a[b] : c : cljs.core.string_QMARK_(a) ? b < a.length ? a[b] : c : cljs.core.type_satisfies_(cljs.core.ILookup, a) ? cljs.core._lookup.cljs$core$IFn$_invoke$arity$3(a, b, c) : c
    }else {
      a = c
    }
    return a
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a
}();
cljs.core.assoc = function() {
  var a = null, b = function(a, b, c) {
    return null != a ? cljs.core._assoc(a, b, c) : cljs.core.hash_map.cljs$core$IFn$_invoke$arity$2 ? cljs.core.hash_map.cljs$core$IFn$_invoke$arity$2(b, c) : cljs.core.hash_map.call(null, b, c)
  }, c = function() {
    var b = function(b, c, d, e) {
      for(;;) {
        if(b = a.cljs$core$IFn$_invoke$arity$3(b, c, d), cljs.core.truth_(e)) {
          c = cljs.core.first(e), d = cljs.core.second(e), e = cljs.core.nnext(e)
        }else {
          return b
        }
      }
    }, c = function(a, c, e, k) {
      var l = null;
      3 < arguments.length && (l = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
      return b.call(this, a, c, e, l)
    };
    c.cljs$lang$maxFixedArity = 3;
    c.cljs$lang$applyTo = function(a) {
      var c = cljs.core.first(a);
      a = cljs.core.next(a);
      var e = cljs.core.first(a);
      a = cljs.core.next(a);
      var k = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(c, e, k, a)
    };
    c.cljs$core$IFn$_invoke$arity$variadic = b;
    return c
  }(), a = function(a, e, f, g) {
    switch(arguments.length) {
      case 3:
        return b.call(this, a, e, f);
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(a, e, f, cljs.core.array_seq(arguments, 3))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 3;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$3 = b;
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.dissoc = function() {
  var a = null, b = function(a, b) {
    return cljs.core._dissoc(a, b)
  }, c = function() {
    var b = function(b, c, d) {
      for(;;) {
        if(b = a.cljs$core$IFn$_invoke$arity$2(b, c), cljs.core.truth_(d)) {
          c = cljs.core.first(d), d = cljs.core.next(d)
        }else {
          return b
        }
      }
    }, c = function(a, c, e) {
      var k = null;
      2 < arguments.length && (k = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, c, k)
    };
    c.cljs$lang$maxFixedArity = 2;
    c.cljs$lang$applyTo = function(a) {
      var c = cljs.core.first(a);
      a = cljs.core.next(a);
      var e = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(c, e, a)
    };
    c.cljs$core$IFn$_invoke$arity$variadic = b;
    return c
  }(), a = function(a, e, f) {
    switch(arguments.length) {
      case 1:
        return a;
      case 2:
        return b.call(this, a, e);
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(a, e, cljs.core.array_seq(arguments, 2))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return a
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.fn_QMARK_ = function(a) {
  var b = goog.isFunction(a);
  return b ? b : a ? cljs.core.truth_(cljs.core.truth_(null) ? null : a.cljs$core$Fn$) ? !0 : a.cljs$lang$protocol_mask$partition$ ? !1 : cljs.core.type_satisfies_(cljs.core.Fn, a) : cljs.core.type_satisfies_(cljs.core.Fn, a)
};
cljs.core.with_meta = function with_meta(b, c) {
  return function() {
    var c = cljs.core.fn_QMARK_(b);
    c && (b ? (c = (c = b.cljs$lang$protocol_mask$partition0$ & 262144) ? c : b.cljs$core$IWithMeta$, c = c ? !0 : b.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.type_satisfies_(cljs.core.IWithMeta, b)) : c = cljs.core.type_satisfies_(cljs.core.IWithMeta, b), c = !c);
    return c
  }() ? with_meta(function() {
    void 0 === cljs.core.t4938 && (cljs.core.t4938 = {}, cljs.core.t4938 = function(b, c, f, g) {
      this.meta = b;
      this.o = c;
      this.with_meta = f;
      this.meta4939 = g;
      this.cljs$lang$protocol_mask$partition1$ = 0;
      this.cljs$lang$protocol_mask$partition0$ = 393217
    }, cljs.core.t4938.cljs$lang$type = !0, cljs.core.t4938.cljs$lang$ctorStr = "cljs.core/t4938", cljs.core.t4938.cljs$lang$ctorPrWriter = function(b, c, f) {
      return cljs.core._write(c, "cljs.core/t4938")
    }, cljs.core.t4938.prototype.call = function() {
      var b = function(b, c) {
        return cljs.core.apply.cljs$core$IFn$_invoke$arity$2 ? cljs.core.apply.cljs$core$IFn$_invoke$arity$2(b.o, c) : cljs.core.apply.call(null, b.o, c)
      }, c = function(c, e) {
        c = this;
        var h = null;
        1 < arguments.length && (h = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
        return b.call(this, c, h)
      };
      c.cljs$lang$maxFixedArity = 1;
      c.cljs$lang$applyTo = function(c) {
        var e = cljs.core.first(c);
        c = cljs.core.rest(c);
        return b(e, c)
      };
      c.cljs$core$IFn$_invoke$arity$variadic = b;
      return c
    }(), cljs.core.t4938.prototype.apply = function(b, c) {
      b = this;
      return b.call.apply(b, [b].concat(c.slice()))
    }, cljs.core.t4938.prototype.cljs$core$Fn$ = !0, cljs.core.t4938.prototype.cljs$core$IMeta$_meta$arity$1 = function(b) {
      return this.meta4939
    }, cljs.core.t4938.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(b, c) {
      return new cljs.core.t4938(this.meta, this.o, this.with_meta, c)
    }, cljs.core.__GT_t4938 = function(b, c, f, g) {
      return new cljs.core.t4938(b, c, f, g)
    });
    return new cljs.core.t4938(c, b, with_meta, null)
  }(), c) : cljs.core._with_meta(b, c)
};
cljs.core.meta = function(a) {
  var b;
  a ? (b = (b = a.cljs$lang$protocol_mask$partition0$ & 131072) ? b : a.cljs$core$IMeta$, b = b ? !0 : a.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.type_satisfies_(cljs.core.IMeta, a)) : b = cljs.core.type_satisfies_(cljs.core.IMeta, a);
  return b ? cljs.core._meta(a) : null
};
cljs.core.peek = function(a) {
  return cljs.core._peek(a)
};
cljs.core.pop = function(a) {
  return cljs.core._pop(a)
};
cljs.core.disj = function() {
  var a = null, b = function(a, b) {
    return cljs.core._disjoin(a, b)
  }, c = function() {
    var b = function(b, c, d) {
      for(;;) {
        if(b = a.cljs$core$IFn$_invoke$arity$2(b, c), cljs.core.truth_(d)) {
          c = cljs.core.first(d), d = cljs.core.next(d)
        }else {
          return b
        }
      }
    }, c = function(a, c, e) {
      var k = null;
      2 < arguments.length && (k = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, c, k)
    };
    c.cljs$lang$maxFixedArity = 2;
    c.cljs$lang$applyTo = function(a) {
      var c = cljs.core.first(a);
      a = cljs.core.next(a);
      var e = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(c, e, a)
    };
    c.cljs$core$IFn$_invoke$arity$variadic = b;
    return c
  }(), a = function(a, e, f) {
    switch(arguments.length) {
      case 1:
        return a;
      case 2:
        return b.call(this, a, e);
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(a, e, cljs.core.array_seq(arguments, 2))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return a
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.string_hash_cache = {};
cljs.core.string_hash_cache_count = 0;
cljs.core.add_to_string_hash_cache = function(a) {
  var b = goog.string.hashCode(a);
  cljs.core.string_hash_cache[a] = b;
  cljs.core.string_hash_cache_count += 1;
  return b
};
cljs.core.check_string_hash_cache = function(a) {
  255 < cljs.core.string_hash_cache_count && (cljs.core.string_hash_cache = {}, cljs.core.string_hash_cache_count = 0);
  var b = cljs.core.string_hash_cache[a];
  return"number" === typeof b ? b : cljs.core.add_to_string_hash_cache(a)
};
cljs.core.hash = function() {
  var a = null, b = function(b) {
    return a.cljs$core$IFn$_invoke$arity$2(b, !0)
  }, c = function(a, b) {
    var c = goog.isString(a);
    return(c ? b : c) ? cljs.core.check_string_hash_cache(a) : cljs.core._hash(a)
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a
}();
cljs.core.empty_QMARK_ = function(a) {
  var b = null == a;
  return b ? b : cljs.core.not(cljs.core.seq(a))
};
cljs.core.coll_QMARK_ = function(a) {
  if(null == a) {
    return!1
  }
  if(a) {
    var b;
    b = (b = a.cljs$lang$protocol_mask$partition0$ & 8) ? b : a.cljs$core$ICollection$;
    return b ? !0 : a.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.type_satisfies_(cljs.core.ICollection, a)
  }
  return cljs.core.type_satisfies_(cljs.core.ICollection, a)
};
cljs.core.set_QMARK_ = function(a) {
  if(null == a) {
    return!1
  }
  if(a) {
    var b;
    b = (b = a.cljs$lang$protocol_mask$partition0$ & 4096) ? b : a.cljs$core$ISet$;
    return b ? !0 : a.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.type_satisfies_(cljs.core.ISet, a)
  }
  return cljs.core.type_satisfies_(cljs.core.ISet, a)
};
cljs.core.associative_QMARK_ = function(a) {
  if(a) {
    var b;
    b = (b = a.cljs$lang$protocol_mask$partition0$ & 512) ? b : a.cljs$core$IAssociative$;
    return b ? !0 : a.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.type_satisfies_(cljs.core.IAssociative, a)
  }
  return cljs.core.type_satisfies_(cljs.core.IAssociative, a)
};
cljs.core.sequential_QMARK_ = function(a) {
  if(a) {
    var b;
    b = (b = a.cljs$lang$protocol_mask$partition0$ & 16777216) ? b : a.cljs$core$ISequential$;
    return b ? !0 : a.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.type_satisfies_(cljs.core.ISequential, a)
  }
  return cljs.core.type_satisfies_(cljs.core.ISequential, a)
};
cljs.core.reduceable_QMARK_ = function(a) {
  if(a) {
    var b;
    b = (b = a.cljs$lang$protocol_mask$partition0$ & 524288) ? b : a.cljs$core$IReduce$;
    return b ? !0 : a.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.type_satisfies_(cljs.core.IReduce, a)
  }
  return cljs.core.type_satisfies_(cljs.core.IReduce, a)
};
cljs.core.map_QMARK_ = function(a) {
  if(null == a) {
    return!1
  }
  if(a) {
    var b;
    b = (b = a.cljs$lang$protocol_mask$partition0$ & 1024) ? b : a.cljs$core$IMap$;
    return b ? !0 : a.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.type_satisfies_(cljs.core.IMap, a)
  }
  return cljs.core.type_satisfies_(cljs.core.IMap, a)
};
cljs.core.vector_QMARK_ = function(a) {
  if(a) {
    var b;
    b = (b = a.cljs$lang$protocol_mask$partition0$ & 16384) ? b : a.cljs$core$IVector$;
    return b ? !0 : a.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.type_satisfies_(cljs.core.IVector, a)
  }
  return cljs.core.type_satisfies_(cljs.core.IVector, a)
};
cljs.core.chunked_seq_QMARK_ = function(a) {
  if(a) {
    var b = a.cljs$lang$protocol_mask$partition1$ & 512;
    a = b ? b : a.cljs$core$IChunkedSeq$;
    return a ? !0 : !1
  }
  return!1
};
cljs.core.js_obj = function() {
  var a = null, b = function() {
    var a = function(a) {
      return cljs.core.apply.cljs$core$IFn$_invoke$arity$2 ? cljs.core.apply.cljs$core$IFn$_invoke$arity$2(goog.object.create, a) : cljs.core.apply.call(null, goog.object.create, a)
    }, b = function(b) {
      var d = null;
      0 < arguments.length && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
      return a.call(this, d)
    };
    b.cljs$lang$maxFixedArity = 0;
    b.cljs$lang$applyTo = function(b) {
      b = cljs.core.seq(b);
      return a(b)
    };
    b.cljs$core$IFn$_invoke$arity$variadic = a;
    return b
  }(), a = function(a) {
    switch(arguments.length) {
      case 0:
        return{};
      default:
        return b.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq(arguments, 0))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 0;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$0 = function() {
    return{}
  };
  a.cljs$core$IFn$_invoke$arity$variadic = b.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.js_keys = function(a) {
  var b = [];
  goog.object.forEach(a, function(a, d, e) {
    return b.push(d)
  });
  return b
};
cljs.core.js_delete = function(a, b) {
  return delete a[b]
};
cljs.core.array_copy = function(a, b, c, d, e) {
  for(;;) {
    if(0 === e) {
      return c
    }
    c[d] = a[b];
    d += 1;
    e -= 1;
    b += 1
  }
};
cljs.core.array_copy_downward = function(a, b, c, d, e) {
  b += e - 1;
  for(d += e - 1;;) {
    if(0 === e) {
      return c
    }
    c[d] = a[b];
    d -= 1;
    e -= 1;
    b -= 1
  }
};
cljs.core.lookup_sentinel = {};
cljs.core.false_QMARK_ = function(a) {
  return!1 === a
};
cljs.core.true_QMARK_ = function(a) {
  return!0 === a
};
cljs.core.undefined_QMARK_ = function(a) {
  return void 0 === a
};
cljs.core.seq_QMARK_ = function(a) {
  if(null == a) {
    return!1
  }
  if(a) {
    var b;
    b = (b = a.cljs$lang$protocol_mask$partition0$ & 64) ? b : a.cljs$core$ISeq$;
    return b ? !0 : a.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.type_satisfies_(cljs.core.ISeq, a)
  }
  return cljs.core.type_satisfies_(cljs.core.ISeq, a)
};
cljs.core.seqable_QMARK_ = function(a) {
  if(a) {
    var b;
    b = (b = a.cljs$lang$protocol_mask$partition0$ & 8388608) ? b : a.cljs$core$ISeqable$;
    return b ? !0 : a.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.type_satisfies_(cljs.core.ISeqable, a)
  }
  return cljs.core.type_satisfies_(cljs.core.ISeqable, a)
};
cljs.core.boolean$ = function(a) {
  return cljs.core.truth_(a) ? !0 : !1
};
cljs.core.keyword_QMARK_ = function(a) {
  var b = goog.isString(a);
  return b ? "\ufdd0" === a.charAt(0) : b
};
cljs.core.ifn_QMARK_ = function(a) {
  var b = cljs.core.fn_QMARK_(a);
  return b ? b : a ? (b = (b = a.cljs$lang$protocol_mask$partition0$ & 1) ? b : a.cljs$core$IFn$, b ? !0 : a.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.type_satisfies_(cljs.core.IFn, a)) : cljs.core.type_satisfies_(cljs.core.IFn, a)
};
cljs.core.integer_QMARK_ = function(a) {
  var b = "number" === typeof a;
  return b && (b = !isNaN(a)) ? (b = Infinity !== a) ? parseFloat(a) === parseInt(a, 10) : b : b
};
cljs.core.contains_QMARK_ = function(a, b) {
  return cljs.core.get.cljs$core$IFn$_invoke$arity$3(a, b, cljs.core.lookup_sentinel) === cljs.core.lookup_sentinel ? !1 : !0
};
cljs.core.find = function(a, b) {
  var c;
  if(c = null != a) {
    c = (c = cljs.core.associative_QMARK_(a)) ? cljs.core.contains_QMARK_(a, b) : c
  }
  return c ? cljs.core.PersistentVector.fromArray([b, cljs.core.get.cljs$core$IFn$_invoke$arity$2(a, b)], !0) : null
};
cljs.core.distinct_QMARK_ = function() {
  var a = null, b = function(a, b) {
    return!cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(a, b)
  }, c = function() {
    var a = function(a, b, c) {
      if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(a, b)) {
        return!1
      }
      a = cljs.core.PersistentHashSet.fromArray([b, null, a, null], !0);
      for(b = c;;) {
        var d = cljs.core.first(b);
        c = cljs.core.next(b);
        if(cljs.core.truth_(b)) {
          if(cljs.core.contains_QMARK_(a, d)) {
            return!1
          }
          a = cljs.core.conj.cljs$core$IFn$_invoke$arity$2(a, d);
          b = c
        }else {
          return!0
        }
      }
    }, b = function(b, c, e) {
      var k = null;
      2 < arguments.length && (k = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return a.call(this, b, c, k)
    };
    b.cljs$lang$maxFixedArity = 2;
    b.cljs$lang$applyTo = function(b) {
      var c = cljs.core.first(b);
      b = cljs.core.next(b);
      var e = cljs.core.first(b);
      b = cljs.core.rest(b);
      return a(c, e, b)
    };
    b.cljs$core$IFn$_invoke$arity$variadic = a;
    return b
  }(), a = function(a, e, f) {
    switch(arguments.length) {
      case 1:
        return!0;
      case 2:
        return b.call(this, a, e);
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(a, e, cljs.core.array_seq(arguments, 2))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return!0
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.compare = function(a, b) {
  if(a === b) {
    return 0
  }
  if(null == a) {
    return-1
  }
  if(null == b) {
    return 1
  }
  if(cljs.core.type(a) === cljs.core.type(b)) {
    var c;
    a ? (c = (c = a.cljs$lang$protocol_mask$partition1$ & 2048) ? c : a.cljs$core$IComparable$, c = c ? !0 : !1) : c = !1;
    return c ? a.cljs$core$IComparable$_compare$arity$2(a, b) : goog.array.defaultCompare(a, b)
  }
  throw Error("compare on non-nil objects of different types");
};
cljs.core.compare_indexed = function() {
  var a = null, b = function(b, c) {
    var f = cljs.core.count(b), g = cljs.core.count(c);
    return f < g ? -1 : f > g ? 1 : a.cljs$core$IFn$_invoke$arity$4(b, c, f, 0)
  }, c = function(a, b, c, g) {
    for(;;) {
      var h = cljs.core.compare(cljs.core.nth.cljs$core$IFn$_invoke$arity$2(a, g), cljs.core.nth.cljs$core$IFn$_invoke$arity$2(b, g)), k;
      k = (k = 0 === h) ? g + 1 < c : k;
      if(k) {
        g += 1
      }else {
        return h
      }
    }
  }, a = function(a, e, f, g) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 4:
        return c.call(this, a, e, f, g)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$4 = c;
  return a
}();
cljs.core.fn__GT_comparator = function(a) {
  return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(a, cljs.core.compare) ? cljs.core.compare : function(b, c) {
    var d = a.cljs$core$IFn$_invoke$arity$2 ? a.cljs$core$IFn$_invoke$arity$2(b, c) : a.call(null, b, c);
    return"number" === typeof d ? d : cljs.core.truth_(d) ? -1 : cljs.core.truth_(a.cljs$core$IFn$_invoke$arity$2 ? a.cljs$core$IFn$_invoke$arity$2(c, b) : a.call(null, c, b)) ? 1 : 0
  }
};
cljs.core.sort = function() {
  var a = null, b = function(b) {
    return a.cljs$core$IFn$_invoke$arity$2(cljs.core.compare, b)
  }, c = function(a, b) {
    if(cljs.core.seq(b)) {
      var c = cljs.core.to_array.cljs$core$IFn$_invoke$arity$1 ? cljs.core.to_array.cljs$core$IFn$_invoke$arity$1(b) : cljs.core.to_array.call(null, b);
      goog.array.stableSort(c, cljs.core.fn__GT_comparator(a));
      return cljs.core.seq(c)
    }
    return cljs.core.List.EMPTY
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a
}();
cljs.core.sort_by = function() {
  var a = null, b = function(b, c) {
    return a.cljs$core$IFn$_invoke$arity$3(b, cljs.core.compare, c)
  }, c = function(a, b, c) {
    return cljs.core.sort.cljs$core$IFn$_invoke$arity$2(function(c, f) {
      return cljs.core.fn__GT_comparator(b).call(null, a.cljs$core$IFn$_invoke$arity$1 ? a.cljs$core$IFn$_invoke$arity$1(c) : a.call(null, c), a.cljs$core$IFn$_invoke$arity$1 ? a.cljs$core$IFn$_invoke$arity$1(f) : a.call(null, f))
    }, c)
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a
}();
cljs.core.seq_reduce = function() {
  var a = null, b = function(a, b) {
    var c = cljs.core.seq(b);
    return c ? cljs.core.reduce.cljs$core$IFn$_invoke$arity$3 ? cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(a, cljs.core.first(c), cljs.core.next(c)) : cljs.core.reduce.call(null, a, cljs.core.first(c), cljs.core.next(c)) : a.cljs$core$IFn$_invoke$arity$0 ? a.cljs$core$IFn$_invoke$arity$0() : a.call(null)
  }, c = function(a, b, c) {
    for(c = cljs.core.seq(c);;) {
      if(c) {
        b = a.cljs$core$IFn$_invoke$arity$2 ? a.cljs$core$IFn$_invoke$arity$2(b, cljs.core.first(c)) : a.call(null, b, cljs.core.first(c));
        if(cljs.core.reduced_QMARK_(b)) {
          return cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(b) : cljs.core.deref.call(null, b)
        }
        c = cljs.core.next(c)
      }else {
        return b
      }
    }
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a
}();
cljs.core.shuffle = function(a) {
  a = cljs.core.to_array.cljs$core$IFn$_invoke$arity$1 ? cljs.core.to_array.cljs$core$IFn$_invoke$arity$1(a) : cljs.core.to_array.call(null, a);
  goog.array.shuffle(a);
  return cljs.core.vec.cljs$core$IFn$_invoke$arity$1 ? cljs.core.vec.cljs$core$IFn$_invoke$arity$1(a) : cljs.core.vec.call(null, a)
};
cljs.core.reduce = function() {
  var a = null, b = function(a, b) {
    var c;
    b ? (c = (c = b.cljs$lang$protocol_mask$partition0$ & 524288) ? c : b.cljs$core$IReduce$, c = c ? !0 : !1) : c = !1;
    return c ? b.cljs$core$IReduce$_reduce$arity$2(b, a) : b instanceof Array ? cljs.core.array_reduce.cljs$core$IFn$_invoke$arity$2(b, a) : cljs.core.string_QMARK_(b) ? cljs.core.array_reduce.cljs$core$IFn$_invoke$arity$2(b, a) : cljs.core.type_satisfies_(cljs.core.IReduce, b) ? cljs.core._reduce.cljs$core$IFn$_invoke$arity$2(b, a) : cljs.core.seq_reduce.cljs$core$IFn$_invoke$arity$2(a, b)
  }, c = function(a, b, c) {
    var g;
    c ? (g = (g = c.cljs$lang$protocol_mask$partition0$ & 524288) ? g : c.cljs$core$IReduce$, g = g ? !0 : !1) : g = !1;
    return g ? c.cljs$core$IReduce$_reduce$arity$3(c, a, b) : c instanceof Array ? cljs.core.array_reduce.cljs$core$IFn$_invoke$arity$3(c, a, b) : cljs.core.string_QMARK_(c) ? cljs.core.array_reduce.cljs$core$IFn$_invoke$arity$3(c, a, b) : cljs.core.type_satisfies_(cljs.core.IReduce, c) ? cljs.core._reduce.cljs$core$IFn$_invoke$arity$3(c, a, b) : cljs.core.seq_reduce.cljs$core$IFn$_invoke$arity$3(a, b, c)
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a
}();
cljs.core.reduce_kv = function(a, b, c) {
  return cljs.core._kv_reduce(c, a, b)
};
cljs.core._PLUS_ = function() {
  var a = null, b = function() {
    var b = function(b, c, d) {
      return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(a, b + c, d)
    }, d = function(a, d, g) {
      var h = null;
      2 < arguments.length && (h = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, d, h)
    };
    d.cljs$lang$maxFixedArity = 2;
    d.cljs$lang$applyTo = function(a) {
      var d = cljs.core.first(a);
      a = cljs.core.next(a);
      var g = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(d, g, a)
    };
    d.cljs$core$IFn$_invoke$arity$variadic = b;
    return d
  }(), a = function(a, d, e) {
    switch(arguments.length) {
      case 0:
        return 0;
      case 1:
        return a;
      case 2:
        return a + d;
      default:
        return b.cljs$core$IFn$_invoke$arity$variadic(a, d, cljs.core.array_seq(arguments, 2))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$0 = function() {
    return 0
  };
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return a
  };
  a.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
    return a + b
  };
  a.cljs$core$IFn$_invoke$arity$variadic = b.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core._ = function() {
  var a = null, b = function() {
    var b = function(b, c, d) {
      return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(a, b - c, d)
    }, d = function(a, d, g) {
      var h = null;
      2 < arguments.length && (h = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, d, h)
    };
    d.cljs$lang$maxFixedArity = 2;
    d.cljs$lang$applyTo = function(a) {
      var d = cljs.core.first(a);
      a = cljs.core.next(a);
      var g = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(d, g, a)
    };
    d.cljs$core$IFn$_invoke$arity$variadic = b;
    return d
  }(), a = function(a, d, e) {
    switch(arguments.length) {
      case 1:
        return-a;
      case 2:
        return a - d;
      default:
        return b.cljs$core$IFn$_invoke$arity$variadic(a, d, cljs.core.array_seq(arguments, 2))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return-a
  };
  a.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
    return a - b
  };
  a.cljs$core$IFn$_invoke$arity$variadic = b.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core._STAR_ = function() {
  var a = null, b = function() {
    var b = function(b, c, d) {
      return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(a, b * c, d)
    }, d = function(a, d, g) {
      var h = null;
      2 < arguments.length && (h = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, d, h)
    };
    d.cljs$lang$maxFixedArity = 2;
    d.cljs$lang$applyTo = function(a) {
      var d = cljs.core.first(a);
      a = cljs.core.next(a);
      var g = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(d, g, a)
    };
    d.cljs$core$IFn$_invoke$arity$variadic = b;
    return d
  }(), a = function(a, d, e) {
    switch(arguments.length) {
      case 0:
        return 1;
      case 1:
        return a;
      case 2:
        return a * d;
      default:
        return b.cljs$core$IFn$_invoke$arity$variadic(a, d, cljs.core.array_seq(arguments, 2))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$0 = function() {
    return 1
  };
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return a
  };
  a.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
    return a * b
  };
  a.cljs$core$IFn$_invoke$arity$variadic = b.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core._SLASH_ = function() {
  var a = null, b = function(b) {
    return a.cljs$core$IFn$_invoke$arity$2(1, b)
  }, c = function() {
    var b = function(b, c, d) {
      return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(a, a.cljs$core$IFn$_invoke$arity$2(b, c), d)
    }, c = function(a, c, e) {
      var k = null;
      2 < arguments.length && (k = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, c, k)
    };
    c.cljs$lang$maxFixedArity = 2;
    c.cljs$lang$applyTo = function(a) {
      var c = cljs.core.first(a);
      a = cljs.core.next(a);
      var e = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(c, e, a)
    };
    c.cljs$core$IFn$_invoke$arity$variadic = b;
    return c
  }(), a = function(a, e, f) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return a / e;
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(a, e, cljs.core.array_seq(arguments, 2))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
    return a / b
  };
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core._LT_ = function() {
  var a = null, b = function() {
    var a = function(a, b, c) {
      for(;;) {
        if(a < b) {
          if(cljs.core.next(c)) {
            a = b, b = cljs.core.first(c), c = cljs.core.next(c)
          }else {
            return b < cljs.core.first(c)
          }
        }else {
          return!1
        }
      }
    }, b = function(b, d, g) {
      var h = null;
      2 < arguments.length && (h = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return a.call(this, b, d, h)
    };
    b.cljs$lang$maxFixedArity = 2;
    b.cljs$lang$applyTo = function(b) {
      var d = cljs.core.first(b);
      b = cljs.core.next(b);
      var g = cljs.core.first(b);
      b = cljs.core.rest(b);
      return a(d, g, b)
    };
    b.cljs$core$IFn$_invoke$arity$variadic = a;
    return b
  }(), a = function(a, d, e) {
    switch(arguments.length) {
      case 1:
        return!0;
      case 2:
        return a < d;
      default:
        return b.cljs$core$IFn$_invoke$arity$variadic(a, d, cljs.core.array_seq(arguments, 2))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return!0
  };
  a.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
    return a < b
  };
  a.cljs$core$IFn$_invoke$arity$variadic = b.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core._LT__EQ_ = function() {
  var a = null, b = function() {
    var a = function(a, b, c) {
      for(;;) {
        if(a <= b) {
          if(cljs.core.next(c)) {
            a = b, b = cljs.core.first(c), c = cljs.core.next(c)
          }else {
            return b <= cljs.core.first(c)
          }
        }else {
          return!1
        }
      }
    }, b = function(b, d, g) {
      var h = null;
      2 < arguments.length && (h = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return a.call(this, b, d, h)
    };
    b.cljs$lang$maxFixedArity = 2;
    b.cljs$lang$applyTo = function(b) {
      var d = cljs.core.first(b);
      b = cljs.core.next(b);
      var g = cljs.core.first(b);
      b = cljs.core.rest(b);
      return a(d, g, b)
    };
    b.cljs$core$IFn$_invoke$arity$variadic = a;
    return b
  }(), a = function(a, d, e) {
    switch(arguments.length) {
      case 1:
        return!0;
      case 2:
        return a <= d;
      default:
        return b.cljs$core$IFn$_invoke$arity$variadic(a, d, cljs.core.array_seq(arguments, 2))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return!0
  };
  a.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
    return a <= b
  };
  a.cljs$core$IFn$_invoke$arity$variadic = b.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core._GT_ = function() {
  var a = null, b = function() {
    var a = function(a, b, c) {
      for(;;) {
        if(a > b) {
          if(cljs.core.next(c)) {
            a = b, b = cljs.core.first(c), c = cljs.core.next(c)
          }else {
            return b > cljs.core.first(c)
          }
        }else {
          return!1
        }
      }
    }, b = function(b, d, g) {
      var h = null;
      2 < arguments.length && (h = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return a.call(this, b, d, h)
    };
    b.cljs$lang$maxFixedArity = 2;
    b.cljs$lang$applyTo = function(b) {
      var d = cljs.core.first(b);
      b = cljs.core.next(b);
      var g = cljs.core.first(b);
      b = cljs.core.rest(b);
      return a(d, g, b)
    };
    b.cljs$core$IFn$_invoke$arity$variadic = a;
    return b
  }(), a = function(a, d, e) {
    switch(arguments.length) {
      case 1:
        return!0;
      case 2:
        return a > d;
      default:
        return b.cljs$core$IFn$_invoke$arity$variadic(a, d, cljs.core.array_seq(arguments, 2))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return!0
  };
  a.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
    return a > b
  };
  a.cljs$core$IFn$_invoke$arity$variadic = b.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core._GT__EQ_ = function() {
  var a = null, b = function() {
    var a = function(a, b, c) {
      for(;;) {
        if(a >= b) {
          if(cljs.core.next(c)) {
            a = b, b = cljs.core.first(c), c = cljs.core.next(c)
          }else {
            return b >= cljs.core.first(c)
          }
        }else {
          return!1
        }
      }
    }, b = function(b, d, g) {
      var h = null;
      2 < arguments.length && (h = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return a.call(this, b, d, h)
    };
    b.cljs$lang$maxFixedArity = 2;
    b.cljs$lang$applyTo = function(b) {
      var d = cljs.core.first(b);
      b = cljs.core.next(b);
      var g = cljs.core.first(b);
      b = cljs.core.rest(b);
      return a(d, g, b)
    };
    b.cljs$core$IFn$_invoke$arity$variadic = a;
    return b
  }(), a = function(a, d, e) {
    switch(arguments.length) {
      case 1:
        return!0;
      case 2:
        return a >= d;
      default:
        return b.cljs$core$IFn$_invoke$arity$variadic(a, d, cljs.core.array_seq(arguments, 2))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return!0
  };
  a.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
    return a >= b
  };
  a.cljs$core$IFn$_invoke$arity$variadic = b.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.dec = function(a) {
  return a - 1
};
cljs.core.max = function() {
  var a = null, b = function(a, b) {
    return a > b ? a : b
  }, c = function() {
    var b = function(b, c, d) {
      return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(a, b > c ? b : c, d)
    }, c = function(a, c, e) {
      var k = null;
      2 < arguments.length && (k = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, c, k)
    };
    c.cljs$lang$maxFixedArity = 2;
    c.cljs$lang$applyTo = function(a) {
      var c = cljs.core.first(a);
      a = cljs.core.next(a);
      var e = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(c, e, a)
    };
    c.cljs$core$IFn$_invoke$arity$variadic = b;
    return c
  }(), a = function(a, e, f) {
    switch(arguments.length) {
      case 1:
        return a;
      case 2:
        return b.call(this, a, e);
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(a, e, cljs.core.array_seq(arguments, 2))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return a
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.min = function() {
  var a = null, b = function(a, b) {
    return a < b ? a : b
  }, c = function() {
    var b = function(b, c, d) {
      return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(a, b < c ? b : c, d)
    }, c = function(a, c, e) {
      var k = null;
      2 < arguments.length && (k = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, c, k)
    };
    c.cljs$lang$maxFixedArity = 2;
    c.cljs$lang$applyTo = function(a) {
      var c = cljs.core.first(a);
      a = cljs.core.next(a);
      var e = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(c, e, a)
    };
    c.cljs$core$IFn$_invoke$arity$variadic = b;
    return c
  }(), a = function(a, e, f) {
    switch(arguments.length) {
      case 1:
        return a;
      case 2:
        return b.call(this, a, e);
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(a, e, cljs.core.array_seq(arguments, 2))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return a
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.byte$ = function(a) {
  return a
};
cljs.core.char$ = function(a) {
  if("number" === typeof a) {
    return String.fromCharCode(a)
  }
  var b;
  b = (b = cljs.core.string_QMARK_(a)) ? 1 === a.length : b;
  if(b) {
    return a
  }
  throw Error("Argument to char must be a character or number");
};
cljs.core.short$ = function(a) {
  return a
};
cljs.core.float$ = function(a) {
  return a
};
cljs.core.double$ = function(a) {
  return a
};
cljs.core.unchecked_byte = function(a) {
  return a
};
cljs.core.unchecked_char = function(a) {
  return a
};
cljs.core.unchecked_short = function(a) {
  return a
};
cljs.core.unchecked_float = function(a) {
  return a
};
cljs.core.unchecked_double = function(a) {
  return a
};
cljs.core.unchecked_add = function() {
  var a = null, b = function() {
    var b = function(b, c, d) {
      return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(a, b + c, d)
    }, d = function(a, d, g) {
      var h = null;
      2 < arguments.length && (h = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, d, h)
    };
    d.cljs$lang$maxFixedArity = 2;
    d.cljs$lang$applyTo = function(a) {
      var d = cljs.core.first(a);
      a = cljs.core.next(a);
      var g = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(d, g, a)
    };
    d.cljs$core$IFn$_invoke$arity$variadic = b;
    return d
  }(), a = function(a, d, e) {
    switch(arguments.length) {
      case 0:
        return 0;
      case 1:
        return a;
      case 2:
        return a + d;
      default:
        return b.cljs$core$IFn$_invoke$arity$variadic(a, d, cljs.core.array_seq(arguments, 2))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$0 = function() {
    return 0
  };
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return a
  };
  a.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
    return a + b
  };
  a.cljs$core$IFn$_invoke$arity$variadic = b.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.unchecked_add_int = function() {
  var a = null, b = function() {
    var b = function(b, c, d) {
      return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(a, b + c, d)
    }, d = function(a, d, g) {
      var h = null;
      2 < arguments.length && (h = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, d, h)
    };
    d.cljs$lang$maxFixedArity = 2;
    d.cljs$lang$applyTo = function(a) {
      var d = cljs.core.first(a);
      a = cljs.core.next(a);
      var g = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(d, g, a)
    };
    d.cljs$core$IFn$_invoke$arity$variadic = b;
    return d
  }(), a = function(a, d, e) {
    switch(arguments.length) {
      case 0:
        return 0;
      case 1:
        return a;
      case 2:
        return a + d;
      default:
        return b.cljs$core$IFn$_invoke$arity$variadic(a, d, cljs.core.array_seq(arguments, 2))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$0 = function() {
    return 0
  };
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return a
  };
  a.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
    return a + b
  };
  a.cljs$core$IFn$_invoke$arity$variadic = b.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.unchecked_dec = function(a) {
  return a - 1
};
cljs.core.unchecked_dec_int = function(a) {
  return a - 1
};
cljs.core.unchecked_divide_int = function() {
  var a = null, b = function(b) {
    return a.cljs$core$IFn$_invoke$arity$2(1, b)
  }, c = function() {
    var b = function(b, c, d) {
      return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(a, a.cljs$core$IFn$_invoke$arity$2(b, c), d)
    }, c = function(a, c, e) {
      var k = null;
      2 < arguments.length && (k = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, c, k)
    };
    c.cljs$lang$maxFixedArity = 2;
    c.cljs$lang$applyTo = function(a) {
      var c = cljs.core.first(a);
      a = cljs.core.next(a);
      var e = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(c, e, a)
    };
    c.cljs$core$IFn$_invoke$arity$variadic = b;
    return c
  }(), a = function(a, e, f) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return a / e;
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(a, e, cljs.core.array_seq(arguments, 2))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
    return a / b
  };
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.unchecked_inc = function(a) {
  return a + 1
};
cljs.core.unchecked_inc_int = function(a) {
  return a + 1
};
cljs.core.unchecked_multiply = function() {
  var a = null, b = function() {
    var b = function(b, c, d) {
      return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(a, b * c, d)
    }, d = function(a, d, g) {
      var h = null;
      2 < arguments.length && (h = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, d, h)
    };
    d.cljs$lang$maxFixedArity = 2;
    d.cljs$lang$applyTo = function(a) {
      var d = cljs.core.first(a);
      a = cljs.core.next(a);
      var g = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(d, g, a)
    };
    d.cljs$core$IFn$_invoke$arity$variadic = b;
    return d
  }(), a = function(a, d, e) {
    switch(arguments.length) {
      case 0:
        return 1;
      case 1:
        return a;
      case 2:
        return a * d;
      default:
        return b.cljs$core$IFn$_invoke$arity$variadic(a, d, cljs.core.array_seq(arguments, 2))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$0 = function() {
    return 1
  };
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return a
  };
  a.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
    return a * b
  };
  a.cljs$core$IFn$_invoke$arity$variadic = b.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.unchecked_multiply_int = function() {
  var a = null, b = function() {
    var b = function(b, c, d) {
      return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(a, b * c, d)
    }, d = function(a, d, g) {
      var h = null;
      2 < arguments.length && (h = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, d, h)
    };
    d.cljs$lang$maxFixedArity = 2;
    d.cljs$lang$applyTo = function(a) {
      var d = cljs.core.first(a);
      a = cljs.core.next(a);
      var g = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(d, g, a)
    };
    d.cljs$core$IFn$_invoke$arity$variadic = b;
    return d
  }(), a = function(a, d, e) {
    switch(arguments.length) {
      case 0:
        return 1;
      case 1:
        return a;
      case 2:
        return a * d;
      default:
        return b.cljs$core$IFn$_invoke$arity$variadic(a, d, cljs.core.array_seq(arguments, 2))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$0 = function() {
    return 1
  };
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return a
  };
  a.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
    return a * b
  };
  a.cljs$core$IFn$_invoke$arity$variadic = b.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.unchecked_negate = function(a) {
  return-a
};
cljs.core.unchecked_negate_int = function(a) {
  return-a
};
cljs.core.unchecked_remainder_int = function(a, b) {
  return cljs.core.mod.cljs$core$IFn$_invoke$arity$2 ? cljs.core.mod.cljs$core$IFn$_invoke$arity$2(a, b) : cljs.core.mod.call(null, a, b)
};
cljs.core.unchecked_substract = function() {
  var a = null, b = function() {
    var b = function(b, c, d) {
      return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(a, b - c, d)
    }, d = function(a, d, g) {
      var h = null;
      2 < arguments.length && (h = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, d, h)
    };
    d.cljs$lang$maxFixedArity = 2;
    d.cljs$lang$applyTo = function(a) {
      var d = cljs.core.first(a);
      a = cljs.core.next(a);
      var g = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(d, g, a)
    };
    d.cljs$core$IFn$_invoke$arity$variadic = b;
    return d
  }(), a = function(a, d, e) {
    switch(arguments.length) {
      case 1:
        return-a;
      case 2:
        return a - d;
      default:
        return b.cljs$core$IFn$_invoke$arity$variadic(a, d, cljs.core.array_seq(arguments, 2))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return-a
  };
  a.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
    return a - b
  };
  a.cljs$core$IFn$_invoke$arity$variadic = b.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.unchecked_substract_int = function() {
  var a = null, b = function() {
    var b = function(b, c, d) {
      return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(a, b - c, d)
    }, d = function(a, d, g) {
      var h = null;
      2 < arguments.length && (h = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, d, h)
    };
    d.cljs$lang$maxFixedArity = 2;
    d.cljs$lang$applyTo = function(a) {
      var d = cljs.core.first(a);
      a = cljs.core.next(a);
      var g = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(d, g, a)
    };
    d.cljs$core$IFn$_invoke$arity$variadic = b;
    return d
  }(), a = function(a, d, e) {
    switch(arguments.length) {
      case 1:
        return-a;
      case 2:
        return a - d;
      default:
        return b.cljs$core$IFn$_invoke$arity$variadic(a, d, cljs.core.array_seq(arguments, 2))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return-a
  };
  a.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
    return a - b
  };
  a.cljs$core$IFn$_invoke$arity$variadic = b.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.fix = function(a) {
  return 0 <= a ? Math.floor.cljs$core$IFn$_invoke$arity$1 ? Math.floor.cljs$core$IFn$_invoke$arity$1(a) : Math.floor.call(null, a) : Math.ceil.cljs$core$IFn$_invoke$arity$1 ? Math.ceil.cljs$core$IFn$_invoke$arity$1(a) : Math.ceil.call(null, a)
};
cljs.core.int$ = function(a) {
  return a | 0
};
cljs.core.unchecked_int = function(a) {
  return cljs.core.fix(a)
};
cljs.core.long$ = function(a) {
  return cljs.core.fix(a)
};
cljs.core.unchecked_long = function(a) {
  return cljs.core.fix(a)
};
cljs.core.booleans = function(a) {
  return a
};
cljs.core.bytes = function(a) {
  return a
};
cljs.core.chars = function(a) {
  return a
};
cljs.core.shorts = function(a) {
  return a
};
cljs.core.ints = function(a) {
  return a
};
cljs.core.floats = function(a) {
  return a
};
cljs.core.doubles = function(a) {
  return a
};
cljs.core.longs = function(a) {
  return a
};
cljs.core.js_mod = function(a, b) {
  return a % b
};
cljs.core.mod = function(a, b) {
  return(a % b + b) % b
};
cljs.core.quot = function(a, b) {
  return cljs.core.fix((a - a % b) / b)
};
cljs.core.rem = function(a, b) {
  var c = cljs.core.quot(a, b);
  return a - b * c
};
cljs.core.rand = function() {
  var a = null, b = function() {
    return Math.random.cljs$core$IFn$_invoke$arity$0 ? Math.random.cljs$core$IFn$_invoke$arity$0() : Math.random.call(null)
  }, c = function(b) {
    return b * a.cljs$core$IFn$_invoke$arity$0()
  }, a = function(a) {
    switch(arguments.length) {
      case 0:
        return b.call(this);
      case 1:
        return c.call(this, a)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$0 = b;
  a.cljs$core$IFn$_invoke$arity$1 = c;
  return a
}();
cljs.core.rand_int = function(a) {
  return cljs.core.fix(cljs.core.rand.cljs$core$IFn$_invoke$arity$1(a))
};
cljs.core.bit_xor = function(a, b) {
  return a ^ b
};
cljs.core.bit_and = function(a, b) {
  return a & b
};
cljs.core.bit_or = function(a, b) {
  return a | b
};
cljs.core.bit_and_not = function(a, b) {
  return a & ~b
};
cljs.core.bit_clear = function(a, b) {
  return a & ~(1 << b)
};
cljs.core.bit_flip = function(a, b) {
  return a ^ 1 << b
};
cljs.core.bit_not = function(a) {
  return~a
};
cljs.core.bit_set = function(a, b) {
  return a | 1 << b
};
cljs.core.bit_test = function(a, b) {
  return 0 != (a & 1 << b)
};
cljs.core.bit_shift_left = function(a, b) {
  return a << b
};
cljs.core.bit_shift_right = function(a, b) {
  return a >> b
};
cljs.core.bit_shift_right_zero_fill = function(a, b) {
  return a >>> b
};
cljs.core.bit_count = function(a) {
  a -= a >> 1 & 1431655765;
  a = (a & 858993459) + (a >> 2 & 858993459);
  return 16843009 * (a + (a >> 4) & 252645135) >> 24
};
cljs.core._EQ__EQ_ = function() {
  var a = null, b = function(a, b) {
    return cljs.core._equiv(a, b)
  }, c = function() {
    var b = function(b, c, d) {
      for(;;) {
        if(cljs.core.truth_(a.cljs$core$IFn$_invoke$arity$2(b, c))) {
          if(cljs.core.next(d)) {
            b = c, c = cljs.core.first(d), d = cljs.core.next(d)
          }else {
            return a.cljs$core$IFn$_invoke$arity$2(c, cljs.core.first(d))
          }
        }else {
          return!1
        }
      }
    }, c = function(a, c, e) {
      var k = null;
      2 < arguments.length && (k = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, c, k)
    };
    c.cljs$lang$maxFixedArity = 2;
    c.cljs$lang$applyTo = function(a) {
      var c = cljs.core.first(a);
      a = cljs.core.next(a);
      var e = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(c, e, a)
    };
    c.cljs$core$IFn$_invoke$arity$variadic = b;
    return c
  }(), a = function(a, e, f) {
    switch(arguments.length) {
      case 1:
        return!0;
      case 2:
        return b.call(this, a, e);
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(a, e, cljs.core.array_seq(arguments, 2))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return!0
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.pos_QMARK_ = function(a) {
  return 0 < a
};
cljs.core.zero_QMARK_ = function(a) {
  return 0 === a
};
cljs.core.neg_QMARK_ = function(a) {
  return 0 > a
};
cljs.core.nthnext = function(a, b) {
  for(var c = b, d = cljs.core.seq(a);;) {
    if(cljs.core.truth_(function() {
      var a = d;
      return a ? 0 < c : a
    }())) {
      var e = c - 1, f = cljs.core.next(d), c = e, d = f
    }else {
      return d
    }
  }
};
cljs.core.str_STAR_ = function() {
  var a = null, b = function(a) {
    return null == a ? "" : a.toString()
  }, c = function() {
    var b = function(b, c) {
      return function(b, c) {
        for(;;) {
          if(cljs.core.truth_(c)) {
            var d = b.append(a.cljs$core$IFn$_invoke$arity$1(cljs.core.first(c))), e = cljs.core.next(c);
            b = d;
            c = e
          }else {
            return a.cljs$core$IFn$_invoke$arity$1(b)
          }
        }
      }.call(null, new goog.string.StringBuffer(a.cljs$core$IFn$_invoke$arity$1(b)), c)
    }, c = function(a, c) {
      var e = null;
      1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
      return b.call(this, a, e)
    };
    c.cljs$lang$maxFixedArity = 1;
    c.cljs$lang$applyTo = function(a) {
      var c = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(c, a)
    };
    c.cljs$core$IFn$_invoke$arity$variadic = b;
    return c
  }(), a = function(a, e) {
    switch(arguments.length) {
      case 0:
        return"";
      case 1:
        return b.call(this, a);
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(a, cljs.core.array_seq(arguments, 1))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 1;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$0 = function() {
    return""
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.str = function() {
  var a = null, b = function(a) {
    return cljs.core.keyword_QMARK_(a) ? cljs.core.str_STAR_.cljs$core$IFn$_invoke$arity$variadic(":", cljs.core.array_seq([a.substring(2, a.length)], 0)) : null == a ? "" : a.toString()
  }, c = function() {
    var b = function(b, c) {
      return function(b, c) {
        for(;;) {
          if(cljs.core.truth_(c)) {
            var d = b.append(a.cljs$core$IFn$_invoke$arity$1(cljs.core.first(c))), e = cljs.core.next(c);
            b = d;
            c = e
          }else {
            return cljs.core.str_STAR_.cljs$core$IFn$_invoke$arity$1(b)
          }
        }
      }.call(null, new goog.string.StringBuffer(a.cljs$core$IFn$_invoke$arity$1(b)), c)
    }, c = function(a, c) {
      var e = null;
      1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
      return b.call(this, a, e)
    };
    c.cljs$lang$maxFixedArity = 1;
    c.cljs$lang$applyTo = function(a) {
      var c = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(c, a)
    };
    c.cljs$core$IFn$_invoke$arity$variadic = b;
    return c
  }(), a = function(a, e) {
    switch(arguments.length) {
      case 0:
        return"";
      case 1:
        return b.call(this, a);
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(a, cljs.core.array_seq(arguments, 1))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 1;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$0 = function() {
    return""
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.subs = function() {
  var a = null, a = function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return a.substring(c);
      case 3:
        return a.substring(c, d)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = function(a, c) {
    return a.substring(c)
  };
  a.cljs$core$IFn$_invoke$arity$3 = function(a, c, d) {
    return a.substring(c, d)
  };
  return a
}();
cljs.core.format = function() {
  var a = function(a, b) {
    var e = cljs.core.map.cljs$core$IFn$_invoke$arity$2 ? cljs.core.map.cljs$core$IFn$_invoke$arity$2(function(a) {
      var b;
      b = (b = cljs.core.keyword_QMARK_(a)) ? b : a instanceof cljs.core.Symbol;
      return b ? "" + cljs.core.str(a) : a
    }, b) : cljs.core.map.call(null, function(a) {
      var b;
      b = (b = cljs.core.keyword_QMARK_(a)) ? b : a instanceof cljs.core.Symbol;
      return b ? "" + cljs.core.str(a) : a
    }, b);
    return cljs.core.apply.cljs$core$IFn$_invoke$arity$3 ? cljs.core.apply.cljs$core$IFn$_invoke$arity$3(goog.string.format, a, e) : cljs.core.apply.call(null, goog.string.format, a, e)
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e)
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b)
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b
}();
cljs.core.keyword = function() {
  var a = null, b = function(a) {
    return cljs.core.keyword_QMARK_(a) ? a : a instanceof cljs.core.Symbol ? cljs.core.str_STAR_.cljs$core$IFn$_invoke$arity$variadic("\ufdd0", cljs.core.array_seq([":", cljs.core.name.cljs$core$IFn$_invoke$arity$1 ? cljs.core.name.cljs$core$IFn$_invoke$arity$1(a) : cljs.core.name.call(null, a)], 0)) : cljs.core.str_STAR_.cljs$core$IFn$_invoke$arity$variadic("\ufdd0", cljs.core.array_seq([":", a], 0))
  }, c = function(b, c) {
    return a.cljs$core$IFn$_invoke$arity$1(cljs.core.str_STAR_.cljs$core$IFn$_invoke$arity$variadic(b, cljs.core.array_seq(["/", c], 0)))
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a
}();
cljs.core.equiv_sequential = function(a, b) {
  return cljs.core.boolean$(cljs.core.sequential_QMARK_(b) ? function() {
    for(var c = cljs.core.seq(a), d = cljs.core.seq(b);;) {
      if(null == c) {
        return null == d
      }
      if(null != d && cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(cljs.core.first(c), cljs.core.first(d))) {
        c = cljs.core.next(c), d = cljs.core.next(d)
      }else {
        return!1
      }
    }
  }() : null)
};
cljs.core.hash_combine = function(a, b) {
  return a ^ b + 2654435769 + (a << 6) + (a >> 2)
};
cljs.core.hash_coll = function(a) {
  return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(function(a, c) {
    return cljs.core.hash_combine(a, cljs.core.hash.cljs$core$IFn$_invoke$arity$2(c, !1))
  }, cljs.core.hash.cljs$core$IFn$_invoke$arity$2(cljs.core.first(a), !1), cljs.core.next(a))
};
cljs.core.hash_imap = function(a) {
  var b = 0;
  for(a = cljs.core.seq(a);;) {
    if(a) {
      var c = cljs.core.first(a), b = (b + (cljs.core.hash.cljs$core$IFn$_invoke$arity$1(cljs.core.key.cljs$core$IFn$_invoke$arity$1 ? cljs.core.key.cljs$core$IFn$_invoke$arity$1(c) : cljs.core.key.call(null, c)) ^ cljs.core.hash.cljs$core$IFn$_invoke$arity$1(cljs.core.val.cljs$core$IFn$_invoke$arity$1 ? cljs.core.val.cljs$core$IFn$_invoke$arity$1(c) : cljs.core.val.call(null, c)))) % 4503599627370496;
      a = cljs.core.next(a)
    }else {
      return b
    }
  }
};
cljs.core.hash_iset = function(a) {
  var b = 0;
  for(a = cljs.core.seq(a);;) {
    if(a) {
      var c = cljs.core.first(a), b = (b + cljs.core.hash.cljs$core$IFn$_invoke$arity$1(c)) % 4503599627370496;
      a = cljs.core.next(a)
    }else {
      return b
    }
  }
};
cljs.core.extend_object_BANG_ = function(a, b) {
  for(var c = cljs.core.seq(b), d = null, e = 0, f = 0;;) {
    if(f < e) {
      var g = d.cljs$core$IIndexed$_nth$arity$2(d, f), h = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(g, 0, null), g = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(g, 1, null), h = cljs.core.name.cljs$core$IFn$_invoke$arity$1 ? cljs.core.name.cljs$core$IFn$_invoke$arity$1(h) : cljs.core.name.call(null, h);
      a[h] = g;
      f += 1
    }else {
      if(c = cljs.core.seq(c)) {
        cljs.core.chunked_seq_QMARK_(c) ? (e = cljs.core.chunk_first.cljs$core$IFn$_invoke$arity$1 ? cljs.core.chunk_first.cljs$core$IFn$_invoke$arity$1(c) : cljs.core.chunk_first.call(null, c), c = cljs.core.chunk_rest.cljs$core$IFn$_invoke$arity$1 ? cljs.core.chunk_rest.cljs$core$IFn$_invoke$arity$1(c) : cljs.core.chunk_rest.call(null, c), d = e, e = cljs.core.count(e)) : (e = cljs.core.first(c), d = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(e, 0, null), e = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(e, 
        1, null), d = cljs.core.name.cljs$core$IFn$_invoke$arity$1 ? cljs.core.name.cljs$core$IFn$_invoke$arity$1(d) : cljs.core.name.call(null, d), a[d] = e, c = cljs.core.next(c), d = null, e = 0), f = 0
      }else {
        break
      }
    }
  }
  return a
};
cljs.core.List = function(a, b, c, d, e) {
  this.meta = a;
  this.first = b;
  this.rest = c;
  this.count = d;
  this.__hash = e;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 65937646
};
cljs.core.List.cljs$lang$type = !0;
cljs.core.List.cljs$lang$ctorStr = "cljs.core/List";
cljs.core.List.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write(b, "cljs.core/List")
};
cljs.core.List.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  var b = this.__hash;
  return null != b ? b : this.__hash = a = cljs.core.hash_coll(a)
};
cljs.core.List.prototype.cljs$core$INext$_next$arity$1 = function(a) {
  return 1 === this.count ? null : this.rest
};
cljs.core.List.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return new cljs.core.List(this.meta, b, a, this.count + 1, null)
};
cljs.core.List.prototype.toString = function() {
  return cljs.core.pr_str_STAR_(this)
};
cljs.core.List.prototype.cljs$core$IReduce$_reduce$arity$2 = function(a, b) {
  return cljs.core.seq_reduce.cljs$core$IFn$_invoke$arity$2(b, a)
};
cljs.core.List.prototype.cljs$core$IReduce$_reduce$arity$3 = function(a, b, c) {
  return cljs.core.seq_reduce.cljs$core$IFn$_invoke$arity$3(b, c, a)
};
cljs.core.List.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return a
};
cljs.core.List.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  return this.count
};
cljs.core.List.prototype.cljs$core$IStack$_peek$arity$1 = function(a) {
  return this.first
};
cljs.core.List.prototype.cljs$core$IStack$_pop$arity$1 = function(a) {
  return a.cljs$core$ISeq$_rest$arity$1(a)
};
cljs.core.List.prototype.cljs$core$ISeq$_first$arity$1 = function(a) {
  return this.first
};
cljs.core.List.prototype.cljs$core$ISeq$_rest$arity$1 = function(a) {
  return 1 === this.count ? cljs.core.List.EMPTY : this.rest
};
cljs.core.List.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential(a, b)
};
cljs.core.List.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.List(b, this.first, this.rest, this.count, this.__hash)
};
cljs.core.List.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return this.meta
};
cljs.core.List.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return cljs.core.List.EMPTY
};
cljs.core.__GT_List = function(a, b, c, d, e) {
  return new cljs.core.List(a, b, c, d, e)
};
cljs.core.EmptyList = function(a) {
  this.meta = a;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 65413326
};
cljs.core.EmptyList.cljs$lang$type = !0;
cljs.core.EmptyList.cljs$lang$ctorStr = "cljs.core/EmptyList";
cljs.core.EmptyList.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write(b, "cljs.core/EmptyList")
};
cljs.core.EmptyList.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  return 0
};
cljs.core.EmptyList.prototype.cljs$core$INext$_next$arity$1 = function(a) {
  return null
};
cljs.core.EmptyList.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return new cljs.core.List(this.meta, b, null, 1, null)
};
cljs.core.EmptyList.prototype.toString = function() {
  return cljs.core.pr_str_STAR_(this)
};
cljs.core.EmptyList.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return null
};
cljs.core.EmptyList.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  return 0
};
cljs.core.EmptyList.prototype.cljs$core$IStack$_peek$arity$1 = function(a) {
  return null
};
cljs.core.EmptyList.prototype.cljs$core$IStack$_pop$arity$1 = function(a) {
  throw Error("Can't pop empty list");
};
cljs.core.EmptyList.prototype.cljs$core$ISeq$_first$arity$1 = function(a) {
  return null
};
cljs.core.EmptyList.prototype.cljs$core$ISeq$_rest$arity$1 = function(a) {
  return cljs.core.List.EMPTY
};
cljs.core.EmptyList.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential(a, b)
};
cljs.core.EmptyList.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.EmptyList(b)
};
cljs.core.EmptyList.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return this.meta
};
cljs.core.EmptyList.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return a
};
cljs.core.__GT_EmptyList = function(a) {
  return new cljs.core.EmptyList(a)
};
cljs.core.List.EMPTY = new cljs.core.EmptyList(null);
cljs.core.reversible_QMARK_ = function(a) {
  if(a) {
    var b;
    b = (b = a.cljs$lang$protocol_mask$partition0$ & 134217728) ? b : a.cljs$core$IReversible$;
    return b ? !0 : a.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.type_satisfies_(cljs.core.IReversible, a)
  }
  return cljs.core.type_satisfies_(cljs.core.IReversible, a)
};
cljs.core.rseq = function(a) {
  return cljs.core._rseq(a)
};
cljs.core.reverse = function(a) {
  return cljs.core.reversible_QMARK_(a) ? cljs.core.rseq(a) : cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(cljs.core.conj, cljs.core.List.EMPTY, a)
};
cljs.core.list = function() {
  var a = function(a) {
    var b;
    if(a instanceof cljs.core.IndexedSeq) {
      b = a.arr
    }else {
      a: {
        for(b = [];;) {
          if(null != a) {
            b.push(a.cljs$core$ISeq$_first$arity$1(a)), a = a.cljs$core$INext$_next$arity$1(a)
          }else {
            break a
          }
        }
        b = void 0
      }
    }
    a = b.length;
    for(var e = cljs.core.List.EMPTY;;) {
      if(0 < a) {
        var f = a - 1, e = e.cljs$core$ICollection$_conj$arity$2(e, b[a - 1]);
        a = f
      }else {
        return e
      }
    }
  }, b = function(b) {
    var d = null;
    0 < arguments.length && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d)
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a(b)
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b
}();
cljs.core.Cons = function(a, b, c, d) {
  this.meta = a;
  this.first = b;
  this.rest = c;
  this.__hash = d;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 65405164
};
cljs.core.Cons.cljs$lang$type = !0;
cljs.core.Cons.cljs$lang$ctorStr = "cljs.core/Cons";
cljs.core.Cons.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write(b, "cljs.core/Cons")
};
cljs.core.Cons.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  var b = this.__hash;
  return null != b ? b : this.__hash = a = cljs.core.hash_coll(a)
};
cljs.core.Cons.prototype.cljs$core$INext$_next$arity$1 = function(a) {
  return null == this.rest ? null : cljs.core._seq(this.rest)
};
cljs.core.Cons.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return new cljs.core.Cons(null, b, a, this.__hash)
};
cljs.core.Cons.prototype.toString = function() {
  return cljs.core.pr_str_STAR_(this)
};
cljs.core.Cons.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return a
};
cljs.core.Cons.prototype.cljs$core$ISeq$_first$arity$1 = function(a) {
  return this.first
};
cljs.core.Cons.prototype.cljs$core$ISeq$_rest$arity$1 = function(a) {
  return null == this.rest ? cljs.core.List.EMPTY : this.rest
};
cljs.core.Cons.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential(a, b)
};
cljs.core.Cons.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.Cons(b, this.first, this.rest, this.__hash)
};
cljs.core.Cons.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return this.meta
};
cljs.core.Cons.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return cljs.core.with_meta(cljs.core.List.EMPTY, this.meta)
};
cljs.core.__GT_Cons = function(a, b, c, d) {
  return new cljs.core.Cons(a, b, c, d)
};
cljs.core.cons = function(a, b) {
  return function() {
    var a = null == b;
    return a ? a : b ? (a = (a = b.cljs$lang$protocol_mask$partition0$ & 64) ? a : b.cljs$core$ISeq$, a ? !0 : !1) : !1
  }() ? new cljs.core.Cons(null, a, b, null) : new cljs.core.Cons(null, a, cljs.core.seq(b), null)
};
cljs.core.list_QMARK_ = function(a) {
  if(a) {
    var b;
    b = (b = a.cljs$lang$protocol_mask$partition0$ & 33554432) ? b : a.cljs$core$IList$;
    return b ? !0 : a.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.type_satisfies_(cljs.core.IList, a)
  }
  return cljs.core.type_satisfies_(cljs.core.IList, a)
};
cljs.core.IHash.string = !0;
cljs.core._hash.string = function(a) {
  return goog.string.hashCode(a)
};
cljs.core.Keyword = function(a) {
  this.k = a;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 1
};
cljs.core.Keyword.cljs$lang$type = !0;
cljs.core.Keyword.cljs$lang$ctorStr = "cljs.core/Keyword";
cljs.core.Keyword.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write(b, "cljs.core/Keyword")
};
cljs.core.Keyword.prototype.call = function() {
  var a = null;
  return a = function(a, c, d) {
    switch(arguments.length) {
      case 2:
        var e = a, e = this;
        if(null == c) {
          e = null
        }else {
          var f;
          c ? (f = (f = c.cljs$lang$protocol_mask$partition0$ & 256) ? f : c.cljs$core$ILookup$, f = f ? !0 : c.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.type_satisfies_(cljs.core.ILookup, c)) : f = cljs.core.type_satisfies_(cljs.core.ILookup, c);
          e = f ? cljs.core._lookup.cljs$core$IFn$_invoke$arity$3(c, e.k, null) : null
        }
        return e;
      case 3:
        return e = a, e = this, null == c ? e = d : (c ? (f = (f = c.cljs$lang$protocol_mask$partition0$ & 256) ? f : c.cljs$core$ILookup$, f = f ? !0 : c.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.type_satisfies_(cljs.core.ILookup, c)) : f = cljs.core.type_satisfies_(cljs.core.ILookup, c), e = f ? cljs.core._lookup.cljs$core$IFn$_invoke$arity$3(c, e.k, d) : null), e
    }
    throw Error("Invalid arity: " + arguments.length);
  }
}();
cljs.core.Keyword.prototype.apply = function(a, b) {
  a = this;
  return a.call.apply(a, [a].concat(b.slice()))
};
cljs.core.__GT_Keyword = function(a) {
  return new cljs.core.Keyword(a)
};
String.prototype.cljs$core$IFn$ = !0;
String.prototype.call = function() {
  var a = null;
  return a = function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return cljs.core.get.cljs$core$IFn$_invoke$arity$2(c, this.toString());
      case 3:
        return cljs.core.get.cljs$core$IFn$_invoke$arity$3(c, this.toString(), d)
    }
    throw Error("Invalid arity: " + arguments.length);
  }
}();
String.prototype.apply = function(a, b) {
  return a.call.apply(a, [a].concat(b.slice()))
};
String.prototype.apply = function(a, b) {
  return 2 > b.length ? cljs.core.get.cljs$core$IFn$_invoke$arity$2(b[0], a) : cljs.core.get.cljs$core$IFn$_invoke$arity$3(b[0], a, b[1])
};
cljs.core.lazy_seq_value = function(a) {
  var b = a.x;
  if(a.realized) {
    return b
  }
  a.x = b.cljs$core$IFn$_invoke$arity$0 ? b.cljs$core$IFn$_invoke$arity$0() : b.call(null);
  a.realized = !0;
  return a.x
};
cljs.core.LazySeq = function(a, b, c, d) {
  this.meta = a;
  this.realized = b;
  this.x = c;
  this.__hash = d;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 31850700
};
cljs.core.LazySeq.cljs$lang$type = !0;
cljs.core.LazySeq.cljs$lang$ctorStr = "cljs.core/LazySeq";
cljs.core.LazySeq.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write(b, "cljs.core/LazySeq")
};
cljs.core.LazySeq.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  var b = this.__hash;
  return null != b ? b : this.__hash = a = cljs.core.hash_coll(a)
};
cljs.core.LazySeq.prototype.cljs$core$INext$_next$arity$1 = function(a) {
  return cljs.core._seq(a.cljs$core$ISeq$_rest$arity$1(a))
};
cljs.core.LazySeq.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return cljs.core.cons(b, a)
};
cljs.core.LazySeq.prototype.toString = function() {
  return cljs.core.pr_str_STAR_(this)
};
cljs.core.LazySeq.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return cljs.core.seq(cljs.core.lazy_seq_value(a))
};
cljs.core.LazySeq.prototype.cljs$core$ISeq$_first$arity$1 = function(a) {
  return cljs.core.first(cljs.core.lazy_seq_value(a))
};
cljs.core.LazySeq.prototype.cljs$core$ISeq$_rest$arity$1 = function(a) {
  return cljs.core.rest(cljs.core.lazy_seq_value(a))
};
cljs.core.LazySeq.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential(a, b)
};
cljs.core.LazySeq.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.LazySeq(b, this.realized, this.x, this.__hash)
};
cljs.core.LazySeq.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return this.meta
};
cljs.core.LazySeq.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return cljs.core.with_meta(cljs.core.List.EMPTY, this.meta)
};
cljs.core.__GT_LazySeq = function(a, b, c, d) {
  return new cljs.core.LazySeq(a, b, c, d)
};
cljs.core.ChunkBuffer = function(a, b) {
  this.buf = a;
  this.end = b;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 2
};
cljs.core.ChunkBuffer.cljs$lang$type = !0;
cljs.core.ChunkBuffer.cljs$lang$ctorStr = "cljs.core/ChunkBuffer";
cljs.core.ChunkBuffer.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write(b, "cljs.core/ChunkBuffer")
};
cljs.core.ChunkBuffer.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  return this.end
};
cljs.core.ChunkBuffer.prototype.add = function(a) {
  this.buf[this.end] = a;
  return this.end += 1
};
cljs.core.ChunkBuffer.prototype.chunk = function(a) {
  a = new cljs.core.ArrayChunk(this.buf, 0, this.end);
  this.buf = null;
  return a
};
cljs.core.__GT_ChunkBuffer = function(a, b) {
  return new cljs.core.ChunkBuffer(a, b)
};
cljs.core.chunk_buffer = function(a) {
  return new cljs.core.ChunkBuffer(Array(a), 0)
};
cljs.core.ArrayChunk = function(a, b, c) {
  this.arr = a;
  this.off = b;
  this.end = c;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 524306
};
cljs.core.ArrayChunk.cljs$lang$type = !0;
cljs.core.ArrayChunk.cljs$lang$ctorStr = "cljs.core/ArrayChunk";
cljs.core.ArrayChunk.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write(b, "cljs.core/ArrayChunk")
};
cljs.core.ArrayChunk.prototype.cljs$core$IReduce$_reduce$arity$2 = function(a, b) {
  return cljs.core.array_reduce.cljs$core$IFn$_invoke$arity$4(this.arr, b, this.arr[this.off], this.off + 1)
};
cljs.core.ArrayChunk.prototype.cljs$core$IReduce$_reduce$arity$3 = function(a, b, c) {
  return cljs.core.array_reduce.cljs$core$IFn$_invoke$arity$4(this.arr, b, c, this.off)
};
cljs.core.ArrayChunk.prototype.cljs$core$IChunk$ = !0;
cljs.core.ArrayChunk.prototype.cljs$core$IChunk$_drop_first$arity$1 = function(a) {
  if(this.off === this.end) {
    throw Error("-drop-first of empty chunk");
  }
  return new cljs.core.ArrayChunk(this.arr, this.off + 1, this.end)
};
cljs.core.ArrayChunk.prototype.cljs$core$IIndexed$_nth$arity$2 = function(a, b) {
  return this.arr[this.off + b]
};
cljs.core.ArrayChunk.prototype.cljs$core$IIndexed$_nth$arity$3 = function(a, b, c) {
  a = (a = 0 <= b) ? b < this.end - this.off : a;
  return a ? this.arr[this.off + b] : c
};
cljs.core.ArrayChunk.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  return this.end - this.off
};
cljs.core.__GT_ArrayChunk = function(a, b, c) {
  return new cljs.core.ArrayChunk(a, b, c)
};
cljs.core.array_chunk = function() {
  var a = null, b = function(a) {
    return new cljs.core.ArrayChunk(a, 0, a.length)
  }, c = function(a, b) {
    return new cljs.core.ArrayChunk(a, b, a.length)
  }, d = function(a, b, c) {
    return new cljs.core.ArrayChunk(a, b, c)
  }, a = function(a, f, g) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, f);
      case 3:
        return d.call(this, a, f, g)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  a.cljs$core$IFn$_invoke$arity$3 = d;
  return a
}();
cljs.core.ChunkedCons = function(a, b, c, d) {
  this.chunk = a;
  this.more = b;
  this.meta = c;
  this.__hash = d;
  this.cljs$lang$protocol_mask$partition0$ = 31850604;
  this.cljs$lang$protocol_mask$partition1$ = 1536
};
cljs.core.ChunkedCons.cljs$lang$type = !0;
cljs.core.ChunkedCons.cljs$lang$ctorStr = "cljs.core/ChunkedCons";
cljs.core.ChunkedCons.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write(b, "cljs.core/ChunkedCons")
};
cljs.core.ChunkedCons.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  var b = this.__hash;
  return null != b ? b : this.__hash = a = cljs.core.hash_coll(a)
};
cljs.core.ChunkedCons.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return cljs.core.cons(b, a)
};
cljs.core.ChunkedCons.prototype.toString = function() {
  return cljs.core.pr_str_STAR_(this)
};
cljs.core.ChunkedCons.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return a
};
cljs.core.ChunkedCons.prototype.cljs$core$ISeq$_first$arity$1 = function(a) {
  return cljs.core._nth.cljs$core$IFn$_invoke$arity$2(this.chunk, 0)
};
cljs.core.ChunkedCons.prototype.cljs$core$ISeq$_rest$arity$1 = function(a) {
  return 1 < cljs.core._count(this.chunk) ? new cljs.core.ChunkedCons(cljs.core._drop_first(this.chunk), this.more, this.meta, null) : null == this.more ? cljs.core.List.EMPTY : this.more
};
cljs.core.ChunkedCons.prototype.cljs$core$IChunkedNext$_chunked_next$arity$1 = function(a) {
  return null == this.more ? null : this.more
};
cljs.core.ChunkedCons.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential(a, b)
};
cljs.core.ChunkedCons.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.ChunkedCons(this.chunk, this.more, b, this.__hash)
};
cljs.core.ChunkedCons.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return this.meta
};
cljs.core.ChunkedCons.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return cljs.core.with_meta(cljs.core.List.EMPTY, this.meta)
};
cljs.core.ChunkedCons.prototype.cljs$core$IChunkedSeq$_chunked_first$arity$1 = function(a) {
  return this.chunk
};
cljs.core.ChunkedCons.prototype.cljs$core$IChunkedSeq$_chunked_rest$arity$1 = function(a) {
  return null == this.more ? cljs.core.List.EMPTY : this.more
};
cljs.core.__GT_ChunkedCons = function(a, b, c, d) {
  return new cljs.core.ChunkedCons(a, b, c, d)
};
cljs.core.chunk_cons = function(a, b) {
  return 0 === cljs.core._count(a) ? b : new cljs.core.ChunkedCons(a, b, null, null)
};
cljs.core.chunk_append = function(a, b) {
  return a.add(b)
};
cljs.core.chunk = function(a) {
  return a.chunk()
};
cljs.core.chunk_first = function(a) {
  return cljs.core._chunked_first(a)
};
cljs.core.chunk_rest = function(a) {
  return cljs.core._chunked_rest(a)
};
cljs.core.chunk_next = function(a) {
  var b;
  a ? (b = (b = a.cljs$lang$protocol_mask$partition1$ & 1024) ? b : a.cljs$core$IChunkedNext$, b = b ? !0 : !1) : b = !1;
  return b ? cljs.core._chunked_next(a) : cljs.core.seq(cljs.core._chunked_rest(a))
};
cljs.core.to_array = function(a) {
  for(var b = [];;) {
    if(cljs.core.seq(a)) {
      b.push(cljs.core.first(a)), a = cljs.core.next(a)
    }else {
      return b
    }
  }
};
cljs.core.to_array_2d = function(a) {
  var b = Array(cljs.core.count(a)), c = 0;
  for(a = cljs.core.seq(a);;) {
    if(a) {
      b[c] = cljs.core.to_array(cljs.core.first(a)), c += 1, a = cljs.core.next(a)
    }else {
      break
    }
  }
  return b
};
cljs.core.int_array = function() {
  var a = null, b = function(b) {
    return"number" === typeof b ? a.cljs$core$IFn$_invoke$arity$2(b, null) : cljs.core.into_array.cljs$core$IFn$_invoke$arity$1(b)
  }, c = function(a, b) {
    var c = Array(a);
    if(cljs.core.seq_QMARK_(b)) {
      for(var g = 0, h = cljs.core.seq(b);;) {
        if(cljs.core.truth_(function() {
          var b = h;
          return b ? g < a : b
        }())) {
          c[g] = cljs.core.first(h);
          var k = g + 1, l = cljs.core.next(h), g = k, h = l
        }else {
          return c
        }
      }
    }else {
      for(k = 0;;) {
        if(k < a) {
          c[k] = b, k += 1
        }else {
          break
        }
      }
      return c
    }
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a
}();
cljs.core.long_array = function() {
  var a = null, b = function(b) {
    return"number" === typeof b ? a.cljs$core$IFn$_invoke$arity$2(b, null) : cljs.core.into_array.cljs$core$IFn$_invoke$arity$1(b)
  }, c = function(a, b) {
    var c = Array(a);
    if(cljs.core.seq_QMARK_(b)) {
      for(var g = 0, h = cljs.core.seq(b);;) {
        if(cljs.core.truth_(function() {
          var b = h;
          return b ? g < a : b
        }())) {
          c[g] = cljs.core.first(h);
          var k = g + 1, l = cljs.core.next(h), g = k, h = l
        }else {
          return c
        }
      }
    }else {
      for(k = 0;;) {
        if(k < a) {
          c[k] = b, k += 1
        }else {
          break
        }
      }
      return c
    }
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a
}();
cljs.core.double_array = function() {
  var a = null, b = function(b) {
    return"number" === typeof b ? a.cljs$core$IFn$_invoke$arity$2(b, null) : cljs.core.into_array.cljs$core$IFn$_invoke$arity$1(b)
  }, c = function(a, b) {
    var c = Array(a);
    if(cljs.core.seq_QMARK_(b)) {
      for(var g = 0, h = cljs.core.seq(b);;) {
        if(cljs.core.truth_(function() {
          var b = h;
          return b ? g < a : b
        }())) {
          c[g] = cljs.core.first(h);
          var k = g + 1, l = cljs.core.next(h), g = k, h = l
        }else {
          return c
        }
      }
    }else {
      for(k = 0;;) {
        if(k < a) {
          c[k] = b, k += 1
        }else {
          break
        }
      }
      return c
    }
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a
}();
cljs.core.object_array = function() {
  var a = null, b = function(b) {
    return"number" === typeof b ? a.cljs$core$IFn$_invoke$arity$2(b, null) : cljs.core.into_array.cljs$core$IFn$_invoke$arity$1(b)
  }, c = function(a, b) {
    var c = Array(a);
    if(cljs.core.seq_QMARK_(b)) {
      for(var g = 0, h = cljs.core.seq(b);;) {
        if(cljs.core.truth_(function() {
          var b = h;
          return b ? g < a : b
        }())) {
          c[g] = cljs.core.first(h);
          var k = g + 1, l = cljs.core.next(h), g = k, h = l
        }else {
          return c
        }
      }
    }else {
      for(k = 0;;) {
        if(k < a) {
          c[k] = b, k += 1
        }else {
          break
        }
      }
      return c
    }
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a
}();
cljs.core.bounded_count = function(a, b) {
  if(cljs.core.counted_QMARK_(a)) {
    return cljs.core.count(a)
  }
  for(var c = a, d = b, e = 0;;) {
    if(cljs.core.truth_(function() {
      var a = 0 < d;
      return a ? cljs.core.seq(c) : a
    }())) {
      var f = cljs.core.next(c), g = d - 1, e = e + 1, c = f, d = g
    }else {
      return e
    }
  }
};
cljs.core.spread = function spread(b) {
  return null == b ? null : null == cljs.core.next(b) ? cljs.core.seq(cljs.core.first(b)) : cljs.core.cons(cljs.core.first(b), spread(cljs.core.next(b)))
};
cljs.core.concat = function() {
  var a = null, b = function() {
    return new cljs.core.LazySeq(null, !1, function() {
      return null
    }, null)
  }, c = function(a) {
    return new cljs.core.LazySeq(null, !1, function() {
      return a
    }, null)
  }, d = function(b, c) {
    return new cljs.core.LazySeq(null, !1, function() {
      var d = cljs.core.seq(b);
      return d ? cljs.core.chunked_seq_QMARK_(d) ? cljs.core.chunk_cons(cljs.core.chunk_first(d), a.cljs$core$IFn$_invoke$arity$2(cljs.core.chunk_rest(d), c)) : cljs.core.cons(cljs.core.first(d), a.cljs$core$IFn$_invoke$arity$2(cljs.core.rest(d), c)) : c
    }, null)
  }, e = function() {
    var b = function(b, c, d) {
      return function n(a, b) {
        return new cljs.core.LazySeq(null, !1, function() {
          var c = cljs.core.seq(a);
          return c ? cljs.core.chunked_seq_QMARK_(c) ? cljs.core.chunk_cons(cljs.core.chunk_first(c), n(cljs.core.chunk_rest(c), b)) : cljs.core.cons(cljs.core.first(c), n(cljs.core.rest(c), b)) : cljs.core.truth_(b) ? n(cljs.core.first(b), cljs.core.next(b)) : null
        }, null)
      }(a.cljs$core$IFn$_invoke$arity$2(b, c), d)
    }, c = function(a, c, d) {
      var e = null;
      2 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, c, e)
    };
    c.cljs$lang$maxFixedArity = 2;
    c.cljs$lang$applyTo = function(a) {
      var c = cljs.core.first(a);
      a = cljs.core.next(a);
      var d = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(c, d, a)
    };
    c.cljs$core$IFn$_invoke$arity$variadic = b;
    return c
  }(), a = function(a, g, h) {
    switch(arguments.length) {
      case 0:
        return b.call(this);
      case 1:
        return c.call(this, a);
      case 2:
        return d.call(this, a, g);
      default:
        return e.cljs$core$IFn$_invoke$arity$variadic(a, g, cljs.core.array_seq(arguments, 2))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = e.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$0 = b;
  a.cljs$core$IFn$_invoke$arity$1 = c;
  a.cljs$core$IFn$_invoke$arity$2 = d;
  a.cljs$core$IFn$_invoke$arity$variadic = e.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.list_STAR_ = function() {
  var a = null, b = function(a) {
    return cljs.core.seq(a)
  }, c = function(a, b) {
    return cljs.core.cons(a, b)
  }, d = function(a, b, c) {
    return cljs.core.cons(a, cljs.core.cons(b, c))
  }, e = function(a, b, c, d) {
    return cljs.core.cons(a, cljs.core.cons(b, cljs.core.cons(c, d)))
  }, f = function() {
    var a = function(a, b, c, d, e) {
      return cljs.core.cons(a, cljs.core.cons(b, cljs.core.cons(c, cljs.core.cons(d, cljs.core.spread(e)))))
    }, b = function(b, c, d, e, f) {
      var h = null;
      4 < arguments.length && (h = cljs.core.array_seq(Array.prototype.slice.call(arguments, 4), 0));
      return a.call(this, b, c, d, e, h)
    };
    b.cljs$lang$maxFixedArity = 4;
    b.cljs$lang$applyTo = function(b) {
      var c = cljs.core.first(b);
      b = cljs.core.next(b);
      var d = cljs.core.first(b);
      b = cljs.core.next(b);
      var e = cljs.core.first(b);
      b = cljs.core.next(b);
      var f = cljs.core.first(b);
      b = cljs.core.rest(b);
      return a(c, d, e, f, b)
    };
    b.cljs$core$IFn$_invoke$arity$variadic = a;
    return b
  }(), a = function(a, h, k, l, m) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, h);
      case 3:
        return d.call(this, a, h, k);
      case 4:
        return e.call(this, a, h, k, l);
      default:
        return f.cljs$core$IFn$_invoke$arity$variadic(a, h, k, l, cljs.core.array_seq(arguments, 4))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 4;
  a.cljs$lang$applyTo = f.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  a.cljs$core$IFn$_invoke$arity$3 = d;
  a.cljs$core$IFn$_invoke$arity$4 = e;
  a.cljs$core$IFn$_invoke$arity$variadic = f.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.transient$ = function(a) {
  return cljs.core._as_transient(a)
};
cljs.core.persistent_BANG_ = function(a) {
  return cljs.core._persistent_BANG_(a)
};
cljs.core.conj_BANG_ = function(a, b) {
  return cljs.core._conj_BANG_(a, b)
};
cljs.core.assoc_BANG_ = function(a, b, c) {
  return cljs.core._assoc_BANG_(a, b, c)
};
cljs.core.dissoc_BANG_ = function(a, b) {
  return cljs.core._dissoc_BANG_(a, b)
};
cljs.core.pop_BANG_ = function(a) {
  return cljs.core._pop_BANG_(a)
};
cljs.core.disj_BANG_ = function(a, b) {
  return cljs.core._disjoin_BANG_(a, b)
};
cljs.core.apply_to = function(a, b, c) {
  var d = cljs.core.seq(c);
  if(0 === b) {
    return a.cljs$core$IFn$_invoke$arity$0 ? a.cljs$core$IFn$_invoke$arity$0() : a.call(null)
  }
  c = cljs.core._first(d);
  var e = cljs.core._rest(d);
  if(1 === b) {
    return a.cljs$core$IFn$_invoke$arity$1 ? a.cljs$core$IFn$_invoke$arity$1(c) : a.cljs$core$IFn$_invoke$arity$1 ? a.cljs$core$IFn$_invoke$arity$1(c) : a.call(null, c)
  }
  var d = cljs.core._first(e), f = cljs.core._rest(e);
  if(2 === b) {
    return a.cljs$core$IFn$_invoke$arity$2 ? a.cljs$core$IFn$_invoke$arity$2(c, d) : a.cljs$core$IFn$_invoke$arity$2 ? a.cljs$core$IFn$_invoke$arity$2(c, d) : a.call(null, c, d)
  }
  var e = cljs.core._first(f), g = cljs.core._rest(f);
  if(3 === b) {
    return a.cljs$core$IFn$_invoke$arity$3 ? a.cljs$core$IFn$_invoke$arity$3(c, d, e) : a.cljs$core$IFn$_invoke$arity$3 ? a.cljs$core$IFn$_invoke$arity$3(c, d, e) : a.call(null, c, d, e)
  }
  var f = cljs.core._first(g), h = cljs.core._rest(g);
  if(4 === b) {
    return a.cljs$core$IFn$_invoke$arity$4 ? a.cljs$core$IFn$_invoke$arity$4(c, d, e, f) : a.cljs$core$IFn$_invoke$arity$4 ? a.cljs$core$IFn$_invoke$arity$4(c, d, e, f) : a.call(null, c, d, e, f)
  }
  g = cljs.core._first(h);
  h = cljs.core._rest(h);
  if(5 === b) {
    return a.cljs$core$IFn$_invoke$arity$5 ? a.cljs$core$IFn$_invoke$arity$5(c, d, e, f, g) : a.cljs$core$IFn$_invoke$arity$5 ? a.cljs$core$IFn$_invoke$arity$5(c, d, e, f, g) : a.call(null, c, d, e, f, g)
  }
  a = cljs.core._first(h);
  var k = cljs.core._rest(h);
  if(6 === b) {
    return a.cljs$core$IFn$_invoke$arity$6 ? a.cljs$core$IFn$_invoke$arity$6(c, d, e, f, g, a) : a.cljs$core$IFn$_invoke$arity$6 ? a.cljs$core$IFn$_invoke$arity$6(c, d, e, f, g, a) : a.call(null, c, d, e, f, g, a)
  }
  var h = cljs.core._first(k), l = cljs.core._rest(k);
  if(7 === b) {
    return a.cljs$core$IFn$_invoke$arity$7 ? a.cljs$core$IFn$_invoke$arity$7(c, d, e, f, g, a, h) : a.cljs$core$IFn$_invoke$arity$7 ? a.cljs$core$IFn$_invoke$arity$7(c, d, e, f, g, a, h) : a.call(null, c, d, e, f, g, a, h)
  }
  var k = cljs.core._first(l), m = cljs.core._rest(l);
  if(8 === b) {
    return a.cljs$core$IFn$_invoke$arity$8 ? a.cljs$core$IFn$_invoke$arity$8(c, d, e, f, g, a, h, k) : a.cljs$core$IFn$_invoke$arity$8 ? a.cljs$core$IFn$_invoke$arity$8(c, d, e, f, g, a, h, k) : a.call(null, c, d, e, f, g, a, h, k)
  }
  var l = cljs.core._first(m), n = cljs.core._rest(m);
  if(9 === b) {
    return a.cljs$core$IFn$_invoke$arity$9 ? a.cljs$core$IFn$_invoke$arity$9(c, d, e, f, g, a, h, k, l) : a.cljs$core$IFn$_invoke$arity$9 ? a.cljs$core$IFn$_invoke$arity$9(c, d, e, f, g, a, h, k, l) : a.call(null, c, d, e, f, g, a, h, k, l)
  }
  var m = cljs.core._first(n), p = cljs.core._rest(n);
  if(10 === b) {
    return a.cljs$core$IFn$_invoke$arity$10 ? a.cljs$core$IFn$_invoke$arity$10(c, d, e, f, g, a, h, k, l, m) : a.cljs$core$IFn$_invoke$arity$10 ? a.cljs$core$IFn$_invoke$arity$10(c, d, e, f, g, a, h, k, l, m) : a.call(null, c, d, e, f, g, a, h, k, l, m)
  }
  var n = cljs.core._first(p), q = cljs.core._rest(p);
  if(11 === b) {
    return a.cljs$core$IFn$_invoke$arity$11 ? a.cljs$core$IFn$_invoke$arity$11(c, d, e, f, g, a, h, k, l, m, n) : a.cljs$core$IFn$_invoke$arity$11 ? a.cljs$core$IFn$_invoke$arity$11(c, d, e, f, g, a, h, k, l, m, n) : a.call(null, c, d, e, f, g, a, h, k, l, m, n)
  }
  var p = cljs.core._first(q), r = cljs.core._rest(q);
  if(12 === b) {
    return a.cljs$core$IFn$_invoke$arity$12 ? a.cljs$core$IFn$_invoke$arity$12(c, d, e, f, g, a, h, k, l, m, n, p) : a.cljs$core$IFn$_invoke$arity$12 ? a.cljs$core$IFn$_invoke$arity$12(c, d, e, f, g, a, h, k, l, m, n, p) : a.call(null, c, d, e, f, g, a, h, k, l, m, n, p)
  }
  var q = cljs.core._first(r), s = cljs.core._rest(r);
  if(13 === b) {
    return a.cljs$core$IFn$_invoke$arity$13 ? a.cljs$core$IFn$_invoke$arity$13(c, d, e, f, g, a, h, k, l, m, n, p, q) : a.cljs$core$IFn$_invoke$arity$13 ? a.cljs$core$IFn$_invoke$arity$13(c, d, e, f, g, a, h, k, l, m, n, p, q) : a.call(null, c, d, e, f, g, a, h, k, l, m, n, p, q)
  }
  var r = cljs.core._first(s), t = cljs.core._rest(s);
  if(14 === b) {
    return a.cljs$core$IFn$_invoke$arity$14 ? a.cljs$core$IFn$_invoke$arity$14(c, d, e, f, g, a, h, k, l, m, n, p, q, r) : a.cljs$core$IFn$_invoke$arity$14 ? a.cljs$core$IFn$_invoke$arity$14(c, d, e, f, g, a, h, k, l, m, n, p, q, r) : a.call(null, c, d, e, f, g, a, h, k, l, m, n, p, q, r)
  }
  var s = cljs.core._first(t), v = cljs.core._rest(t);
  if(15 === b) {
    return a.cljs$core$IFn$_invoke$arity$15 ? a.cljs$core$IFn$_invoke$arity$15(c, d, e, f, g, a, h, k, l, m, n, p, q, r, s) : a.cljs$core$IFn$_invoke$arity$15 ? a.cljs$core$IFn$_invoke$arity$15(c, d, e, f, g, a, h, k, l, m, n, p, q, r, s) : a.call(null, c, d, e, f, g, a, h, k, l, m, n, p, q, r, s)
  }
  var t = cljs.core._first(v), w = cljs.core._rest(v);
  if(16 === b) {
    return a.cljs$core$IFn$_invoke$arity$16 ? a.cljs$core$IFn$_invoke$arity$16(c, d, e, f, g, a, h, k, l, m, n, p, q, r, s, t) : a.cljs$core$IFn$_invoke$arity$16 ? a.cljs$core$IFn$_invoke$arity$16(c, d, e, f, g, a, h, k, l, m, n, p, q, r, s, t) : a.call(null, c, d, e, f, g, a, h, k, l, m, n, p, q, r, s, t)
  }
  var v = cljs.core._first(w), u = cljs.core._rest(w);
  if(17 === b) {
    return a.cljs$core$IFn$_invoke$arity$17 ? a.cljs$core$IFn$_invoke$arity$17(c, d, e, f, g, a, h, k, l, m, n, p, q, r, s, t, v) : a.cljs$core$IFn$_invoke$arity$17 ? a.cljs$core$IFn$_invoke$arity$17(c, d, e, f, g, a, h, k, l, m, n, p, q, r, s, t, v) : a.call(null, c, d, e, f, g, a, h, k, l, m, n, p, q, r, s, t, v)
  }
  var w = cljs.core._first(u), B = cljs.core._rest(u);
  if(18 === b) {
    return a.cljs$core$IFn$_invoke$arity$18 ? a.cljs$core$IFn$_invoke$arity$18(c, d, e, f, g, a, h, k, l, m, n, p, q, r, s, t, v, w) : a.cljs$core$IFn$_invoke$arity$18 ? a.cljs$core$IFn$_invoke$arity$18(c, d, e, f, g, a, h, k, l, m, n, p, q, r, s, t, v, w) : a.call(null, c, d, e, f, g, a, h, k, l, m, n, p, q, r, s, t, v, w)
  }
  u = cljs.core._first(B);
  B = cljs.core._rest(B);
  if(19 === b) {
    return a.cljs$core$IFn$_invoke$arity$19 ? a.cljs$core$IFn$_invoke$arity$19(c, d, e, f, g, a, h, k, l, m, n, p, q, r, s, t, v, w, u) : a.cljs$core$IFn$_invoke$arity$19 ? a.cljs$core$IFn$_invoke$arity$19(c, d, e, f, g, a, h, k, l, m, n, p, q, r, s, t, v, w, u) : a.call(null, c, d, e, f, g, a, h, k, l, m, n, p, q, r, s, t, v, w, u)
  }
  var H = cljs.core._first(B);
  cljs.core._rest(B);
  if(20 === b) {
    return a.cljs$core$IFn$_invoke$arity$20 ? a.cljs$core$IFn$_invoke$arity$20(c, d, e, f, g, a, h, k, l, m, n, p, q, r, s, t, v, w, u, H) : a.cljs$core$IFn$_invoke$arity$20 ? a.cljs$core$IFn$_invoke$arity$20(c, d, e, f, g, a, h, k, l, m, n, p, q, r, s, t, v, w, u, H) : a.call(null, c, d, e, f, g, a, h, k, l, m, n, p, q, r, s, t, v, w, u, H)
  }
  throw Error("Only up to 20 arguments supported on functions");
};
cljs.core.apply = function() {
  var a = null, b = function(a, b) {
    var c = a.cljs$lang$maxFixedArity;
    if(a.cljs$lang$applyTo) {
      var d = cljs.core.bounded_count(b, c + 1);
      return d <= c ? cljs.core.apply_to(a, d, b) : a.cljs$lang$applyTo(b)
    }
    return a.apply(a, cljs.core.to_array(b))
  }, c = function(a, b, c) {
    b = cljs.core.list_STAR_.cljs$core$IFn$_invoke$arity$2(b, c);
    c = a.cljs$lang$maxFixedArity;
    if(a.cljs$lang$applyTo) {
      var d = cljs.core.bounded_count(b, c + 1);
      return d <= c ? cljs.core.apply_to(a, d, b) : a.cljs$lang$applyTo(b)
    }
    return a.apply(a, cljs.core.to_array(b))
  }, d = function(a, b, c, d) {
    b = cljs.core.list_STAR_.cljs$core$IFn$_invoke$arity$3(b, c, d);
    c = a.cljs$lang$maxFixedArity;
    return a.cljs$lang$applyTo ? (d = cljs.core.bounded_count(b, c + 1), d <= c ? cljs.core.apply_to(a, d, b) : a.cljs$lang$applyTo(b)) : a.apply(a, cljs.core.to_array(b))
  }, e = function(a, b, c, d, e) {
    b = cljs.core.list_STAR_.cljs$core$IFn$_invoke$arity$4(b, c, d, e);
    c = a.cljs$lang$maxFixedArity;
    return a.cljs$lang$applyTo ? (d = cljs.core.bounded_count(b, c + 1), d <= c ? cljs.core.apply_to(a, d, b) : a.cljs$lang$applyTo(b)) : a.apply(a, cljs.core.to_array(b))
  }, f = function() {
    var a = function(a, b, c, d, e, f) {
      b = cljs.core.cons(b, cljs.core.cons(c, cljs.core.cons(d, cljs.core.cons(e, cljs.core.spread(f)))));
      c = a.cljs$lang$maxFixedArity;
      return a.cljs$lang$applyTo ? (d = cljs.core.bounded_count(b, c + 1), d <= c ? cljs.core.apply_to(a, d, b) : a.cljs$lang$applyTo(b)) : a.apply(a, cljs.core.to_array(b))
    }, b = function(b, c, d, e, f, h) {
      var r = null;
      5 < arguments.length && (r = cljs.core.array_seq(Array.prototype.slice.call(arguments, 5), 0));
      return a.call(this, b, c, d, e, f, r)
    };
    b.cljs$lang$maxFixedArity = 5;
    b.cljs$lang$applyTo = function(b) {
      var c = cljs.core.first(b);
      b = cljs.core.next(b);
      var d = cljs.core.first(b);
      b = cljs.core.next(b);
      var e = cljs.core.first(b);
      b = cljs.core.next(b);
      var f = cljs.core.first(b);
      b = cljs.core.next(b);
      var h = cljs.core.first(b);
      b = cljs.core.rest(b);
      return a(c, d, e, f, h, b)
    };
    b.cljs$core$IFn$_invoke$arity$variadic = a;
    return b
  }(), a = function(a, h, k, l, m, n) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, h);
      case 3:
        return c.call(this, a, h, k);
      case 4:
        return d.call(this, a, h, k, l);
      case 5:
        return e.call(this, a, h, k, l, m);
      default:
        return f.cljs$core$IFn$_invoke$arity$variadic(a, h, k, l, m, cljs.core.array_seq(arguments, 5))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 5;
  a.cljs$lang$applyTo = f.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  a.cljs$core$IFn$_invoke$arity$4 = d;
  a.cljs$core$IFn$_invoke$arity$5 = e;
  a.cljs$core$IFn$_invoke$arity$variadic = f.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.vary_meta = function() {
  var a = function(a, b, e) {
    return cljs.core.with_meta(a, cljs.core.apply.cljs$core$IFn$_invoke$arity$3(b, cljs.core.meta(a), e))
  }, b = function(b, d, e) {
    var f = null;
    2 < arguments.length && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
    return a.call(this, b, d, f)
  };
  b.cljs$lang$maxFixedArity = 2;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.next(b);
    var e = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, e, b)
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b
}();
cljs.core.not_EQ_ = function() {
  var a = null, b = function(a, b) {
    return!cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(a, b)
  }, c = function() {
    var a = function(a, b, c) {
      return cljs.core.not(cljs.core.apply.cljs$core$IFn$_invoke$arity$4(cljs.core._EQ_, a, b, c))
    }, b = function(b, c, e) {
      var k = null;
      2 < arguments.length && (k = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return a.call(this, b, c, k)
    };
    b.cljs$lang$maxFixedArity = 2;
    b.cljs$lang$applyTo = function(b) {
      var c = cljs.core.first(b);
      b = cljs.core.next(b);
      var e = cljs.core.first(b);
      b = cljs.core.rest(b);
      return a(c, e, b)
    };
    b.cljs$core$IFn$_invoke$arity$variadic = a;
    return b
  }(), a = function(a, e, f) {
    switch(arguments.length) {
      case 1:
        return!1;
      case 2:
        return b.call(this, a, e);
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(a, e, cljs.core.array_seq(arguments, 2))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return!1
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.not_empty = function(a) {
  return cljs.core.seq(a) ? a : null
};
cljs.core.every_QMARK_ = function(a, b) {
  for(;;) {
    if(null == cljs.core.seq(b)) {
      return!0
    }
    if(cljs.core.truth_(a.cljs$core$IFn$_invoke$arity$1 ? a.cljs$core$IFn$_invoke$arity$1(cljs.core.first(b)) : a.call(null, cljs.core.first(b)))) {
      var c = a, d = cljs.core.next(b);
      a = c;
      b = d
    }else {
      return!1
    }
  }
};
cljs.core.not_every_QMARK_ = function(a, b) {
  return!cljs.core.every_QMARK_(a, b)
};
cljs.core.some = function(a, b) {
  for(;;) {
    if(cljs.core.seq(b)) {
      var c = a.cljs$core$IFn$_invoke$arity$1 ? a.cljs$core$IFn$_invoke$arity$1(cljs.core.first(b)) : a.call(null, cljs.core.first(b));
      if(cljs.core.truth_(c)) {
        return c
      }
      var c = a, d = cljs.core.next(b);
      a = c;
      b = d
    }else {
      return null
    }
  }
};
cljs.core.not_any_QMARK_ = function(a, b) {
  return cljs.core.not(cljs.core.some(a, b))
};
cljs.core.even_QMARK_ = function(a) {
  if(cljs.core.integer_QMARK_(a)) {
    return 0 === (a & 1)
  }
  throw Error([cljs.core.str("Argument must be an integer: "), cljs.core.str(a)].join(""));
};
cljs.core.odd_QMARK_ = function(a) {
  return!cljs.core.even_QMARK_(a)
};
cljs.core.identity = function(a) {
  return a
};
cljs.core.complement = function(a) {
  return function() {
    var b = null, c = function() {
      var b = function(b, c, d) {
        return cljs.core.not(cljs.core.apply.cljs$core$IFn$_invoke$arity$4(a, b, c, d))
      }, c = function(a, c, e) {
        var k = null;
        2 < arguments.length && (k = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
        return b.call(this, a, c, k)
      };
      c.cljs$lang$maxFixedArity = 2;
      c.cljs$lang$applyTo = function(a) {
        var c = cljs.core.first(a);
        a = cljs.core.next(a);
        var e = cljs.core.first(a);
        a = cljs.core.rest(a);
        return b(c, e, a)
      };
      c.cljs$core$IFn$_invoke$arity$variadic = b;
      return c
    }(), b = function(b, e, f) {
      switch(arguments.length) {
        case 0:
          return cljs.core.not(a.cljs$core$IFn$_invoke$arity$0 ? a.cljs$core$IFn$_invoke$arity$0() : a.call(null));
        case 1:
          return cljs.core.not(a.cljs$core$IFn$_invoke$arity$1 ? a.cljs$core$IFn$_invoke$arity$1(b) : a.call(null, b));
        case 2:
          return cljs.core.not(a.cljs$core$IFn$_invoke$arity$2 ? a.cljs$core$IFn$_invoke$arity$2(b, e) : a.call(null, b, e));
        default:
          return c.cljs$core$IFn$_invoke$arity$variadic(b, e, cljs.core.array_seq(arguments, 2))
      }
      throw Error("Invalid arity: " + arguments.length);
    };
    b.cljs$lang$maxFixedArity = 2;
    b.cljs$lang$applyTo = c.cljs$lang$applyTo;
    return b
  }()
};
cljs.core.constantly = function(a) {
  return function() {
    var b = function(b) {
      0 < arguments.length && cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0);
      return a
    };
    b.cljs$lang$maxFixedArity = 0;
    b.cljs$lang$applyTo = function(b) {
      cljs.core.seq(b);
      return a
    };
    b.cljs$core$IFn$_invoke$arity$variadic = function(b) {
      return a
    };
    return b
  }()
};
cljs.core.comp = function() {
  var a = null, b = function() {
    return cljs.core.identity
  }, c = function(a, b) {
    return function() {
      var c = null, d = function() {
        var c = function(c, d, e, h) {
          return a.cljs$core$IFn$_invoke$arity$1 ? a.cljs$core$IFn$_invoke$arity$1(cljs.core.apply.cljs$core$IFn$_invoke$arity$5(b, c, d, e, h)) : a.call(null, cljs.core.apply.cljs$core$IFn$_invoke$arity$5(b, c, d, e, h))
        }, d = function(a, b, d, e) {
          var f = null;
          3 < arguments.length && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
          return c.call(this, a, b, d, f)
        };
        d.cljs$lang$maxFixedArity = 3;
        d.cljs$lang$applyTo = function(a) {
          var b = cljs.core.first(a);
          a = cljs.core.next(a);
          var d = cljs.core.first(a);
          a = cljs.core.next(a);
          var e = cljs.core.first(a);
          a = cljs.core.rest(a);
          return c(b, d, e, a)
        };
        d.cljs$core$IFn$_invoke$arity$variadic = c;
        return d
      }(), c = function(c, e, h, p) {
        switch(arguments.length) {
          case 0:
            return a.cljs$core$IFn$_invoke$arity$1 ? a.cljs$core$IFn$_invoke$arity$1(b.cljs$core$IFn$_invoke$arity$0 ? b.cljs$core$IFn$_invoke$arity$0() : b.call(null)) : a.call(null, b.cljs$core$IFn$_invoke$arity$0 ? b.cljs$core$IFn$_invoke$arity$0() : b.call(null));
          case 1:
            return a.cljs$core$IFn$_invoke$arity$1 ? a.cljs$core$IFn$_invoke$arity$1(b.cljs$core$IFn$_invoke$arity$1 ? b.cljs$core$IFn$_invoke$arity$1(c) : b.call(null, c)) : a.call(null, b.cljs$core$IFn$_invoke$arity$1 ? b.cljs$core$IFn$_invoke$arity$1(c) : b.call(null, c));
          case 2:
            return a.cljs$core$IFn$_invoke$arity$1 ? a.cljs$core$IFn$_invoke$arity$1(b.cljs$core$IFn$_invoke$arity$2 ? b.cljs$core$IFn$_invoke$arity$2(c, e) : b.call(null, c, e)) : a.call(null, b.cljs$core$IFn$_invoke$arity$2 ? b.cljs$core$IFn$_invoke$arity$2(c, e) : b.call(null, c, e));
          case 3:
            return a.cljs$core$IFn$_invoke$arity$1 ? a.cljs$core$IFn$_invoke$arity$1(b.cljs$core$IFn$_invoke$arity$3 ? b.cljs$core$IFn$_invoke$arity$3(c, e, h) : b.call(null, c, e, h)) : a.call(null, b.cljs$core$IFn$_invoke$arity$3 ? b.cljs$core$IFn$_invoke$arity$3(c, e, h) : b.call(null, c, e, h));
          default:
            return d.cljs$core$IFn$_invoke$arity$variadic(c, e, h, cljs.core.array_seq(arguments, 3))
        }
        throw Error("Invalid arity: " + arguments.length);
      };
      c.cljs$lang$maxFixedArity = 3;
      c.cljs$lang$applyTo = d.cljs$lang$applyTo;
      return c
    }()
  }, d = function(a, b, c) {
    return function() {
      var d = null, e = function() {
        var d = function(d, e, k, m) {
          return a.cljs$core$IFn$_invoke$arity$1 ? a.cljs$core$IFn$_invoke$arity$1(b.cljs$core$IFn$_invoke$arity$1 ? b.cljs$core$IFn$_invoke$arity$1(cljs.core.apply.cljs$core$IFn$_invoke$arity$5(c, d, e, k, m)) : b.call(null, cljs.core.apply.cljs$core$IFn$_invoke$arity$5(c, d, e, k, m))) : a.call(null, b.cljs$core$IFn$_invoke$arity$1 ? b.cljs$core$IFn$_invoke$arity$1(cljs.core.apply.cljs$core$IFn$_invoke$arity$5(c, d, e, k, m)) : b.call(null, cljs.core.apply.cljs$core$IFn$_invoke$arity$5(c, d, e, 
          k, m)))
        }, e = function(a, b, c, e) {
          var f = null;
          3 < arguments.length && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
          return d.call(this, a, b, c, f)
        };
        e.cljs$lang$maxFixedArity = 3;
        e.cljs$lang$applyTo = function(a) {
          var b = cljs.core.first(a);
          a = cljs.core.next(a);
          var c = cljs.core.first(a);
          a = cljs.core.next(a);
          var e = cljs.core.first(a);
          a = cljs.core.rest(a);
          return d(b, c, e, a)
        };
        e.cljs$core$IFn$_invoke$arity$variadic = d;
        return e
      }(), d = function(d, k, p, q) {
        switch(arguments.length) {
          case 0:
            return a.cljs$core$IFn$_invoke$arity$1 ? a.cljs$core$IFn$_invoke$arity$1(b.cljs$core$IFn$_invoke$arity$1 ? b.cljs$core$IFn$_invoke$arity$1(c.cljs$core$IFn$_invoke$arity$0 ? c.cljs$core$IFn$_invoke$arity$0() : c.call(null)) : b.call(null, c.cljs$core$IFn$_invoke$arity$0 ? c.cljs$core$IFn$_invoke$arity$0() : c.call(null))) : a.call(null, b.cljs$core$IFn$_invoke$arity$1 ? b.cljs$core$IFn$_invoke$arity$1(c.cljs$core$IFn$_invoke$arity$0 ? c.cljs$core$IFn$_invoke$arity$0() : c.call(null)) : 
            b.call(null, c.cljs$core$IFn$_invoke$arity$0 ? c.cljs$core$IFn$_invoke$arity$0() : c.call(null)));
          case 1:
            return a.cljs$core$IFn$_invoke$arity$1 ? a.cljs$core$IFn$_invoke$arity$1(b.cljs$core$IFn$_invoke$arity$1 ? b.cljs$core$IFn$_invoke$arity$1(c.cljs$core$IFn$_invoke$arity$1 ? c.cljs$core$IFn$_invoke$arity$1(d) : c.call(null, d)) : b.call(null, c.cljs$core$IFn$_invoke$arity$1 ? c.cljs$core$IFn$_invoke$arity$1(d) : c.call(null, d))) : a.call(null, b.cljs$core$IFn$_invoke$arity$1 ? b.cljs$core$IFn$_invoke$arity$1(c.cljs$core$IFn$_invoke$arity$1 ? c.cljs$core$IFn$_invoke$arity$1(d) : c.call(null, 
            d)) : b.call(null, c.cljs$core$IFn$_invoke$arity$1 ? c.cljs$core$IFn$_invoke$arity$1(d) : c.call(null, d)));
          case 2:
            return a.cljs$core$IFn$_invoke$arity$1 ? a.cljs$core$IFn$_invoke$arity$1(b.cljs$core$IFn$_invoke$arity$1 ? b.cljs$core$IFn$_invoke$arity$1(c.cljs$core$IFn$_invoke$arity$2 ? c.cljs$core$IFn$_invoke$arity$2(d, k) : c.call(null, d, k)) : b.call(null, c.cljs$core$IFn$_invoke$arity$2 ? c.cljs$core$IFn$_invoke$arity$2(d, k) : c.call(null, d, k))) : a.call(null, b.cljs$core$IFn$_invoke$arity$1 ? b.cljs$core$IFn$_invoke$arity$1(c.cljs$core$IFn$_invoke$arity$2 ? c.cljs$core$IFn$_invoke$arity$2(d, 
            k) : c.call(null, d, k)) : b.call(null, c.cljs$core$IFn$_invoke$arity$2 ? c.cljs$core$IFn$_invoke$arity$2(d, k) : c.call(null, d, k)));
          case 3:
            return a.cljs$core$IFn$_invoke$arity$1 ? a.cljs$core$IFn$_invoke$arity$1(b.cljs$core$IFn$_invoke$arity$1 ? b.cljs$core$IFn$_invoke$arity$1(c.cljs$core$IFn$_invoke$arity$3 ? c.cljs$core$IFn$_invoke$arity$3(d, k, p) : c.call(null, d, k, p)) : b.call(null, c.cljs$core$IFn$_invoke$arity$3 ? c.cljs$core$IFn$_invoke$arity$3(d, k, p) : c.call(null, d, k, p))) : a.call(null, b.cljs$core$IFn$_invoke$arity$1 ? b.cljs$core$IFn$_invoke$arity$1(c.cljs$core$IFn$_invoke$arity$3 ? c.cljs$core$IFn$_invoke$arity$3(d, 
            k, p) : c.call(null, d, k, p)) : b.call(null, c.cljs$core$IFn$_invoke$arity$3 ? c.cljs$core$IFn$_invoke$arity$3(d, k, p) : c.call(null, d, k, p)));
          default:
            return e.cljs$core$IFn$_invoke$arity$variadic(d, k, p, cljs.core.array_seq(arguments, 3))
        }
        throw Error("Invalid arity: " + arguments.length);
      };
      d.cljs$lang$maxFixedArity = 3;
      d.cljs$lang$applyTo = e.cljs$lang$applyTo;
      return d
    }()
  }, e = function() {
    var a = function(a, b, c, d) {
      var e = cljs.core.reverse(cljs.core.list_STAR_.cljs$core$IFn$_invoke$arity$4(a, b, c, d));
      return function() {
        var a = function(a) {
          a = cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.first(e), a);
          for(var b = cljs.core.next(e);;) {
            if(b) {
              a = cljs.core.first(b).call(null, a), b = cljs.core.next(b)
            }else {
              return a
            }
          }
        }, b = function(b) {
          var c = null;
          0 < arguments.length && (c = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
          return a.call(this, c)
        };
        b.cljs$lang$maxFixedArity = 0;
        b.cljs$lang$applyTo = function(b) {
          b = cljs.core.seq(b);
          return a(b)
        };
        b.cljs$core$IFn$_invoke$arity$variadic = a;
        return b
      }()
    }, b = function(b, c, d, e) {
      var g = null;
      3 < arguments.length && (g = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
      return a.call(this, b, c, d, g)
    };
    b.cljs$lang$maxFixedArity = 3;
    b.cljs$lang$applyTo = function(b) {
      var c = cljs.core.first(b);
      b = cljs.core.next(b);
      var d = cljs.core.first(b);
      b = cljs.core.next(b);
      var e = cljs.core.first(b);
      b = cljs.core.rest(b);
      return a(c, d, e, b)
    };
    b.cljs$core$IFn$_invoke$arity$variadic = a;
    return b
  }(), a = function(a, g, h, k) {
    switch(arguments.length) {
      case 0:
        return b.call(this);
      case 1:
        return a;
      case 2:
        return c.call(this, a, g);
      case 3:
        return d.call(this, a, g, h);
      default:
        return e.cljs$core$IFn$_invoke$arity$variadic(a, g, h, cljs.core.array_seq(arguments, 3))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 3;
  a.cljs$lang$applyTo = e.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$0 = b;
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return a
  };
  a.cljs$core$IFn$_invoke$arity$2 = c;
  a.cljs$core$IFn$_invoke$arity$3 = d;
  a.cljs$core$IFn$_invoke$arity$variadic = e.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.partial = function() {
  var a = null, b = function(a, b) {
    return function() {
      var c = function(c) {
        return cljs.core.apply.cljs$core$IFn$_invoke$arity$3(a, b, c)
      }, d = function(a) {
        var b = null;
        0 < arguments.length && (b = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
        return c.call(this, b)
      };
      d.cljs$lang$maxFixedArity = 0;
      d.cljs$lang$applyTo = function(a) {
        a = cljs.core.seq(a);
        return c(a)
      };
      d.cljs$core$IFn$_invoke$arity$variadic = c;
      return d
    }()
  }, c = function(a, b, c) {
    return function() {
      var d = function(d) {
        return cljs.core.apply.cljs$core$IFn$_invoke$arity$4(a, b, c, d)
      }, e = function(a) {
        var b = null;
        0 < arguments.length && (b = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
        return d.call(this, b)
      };
      e.cljs$lang$maxFixedArity = 0;
      e.cljs$lang$applyTo = function(a) {
        a = cljs.core.seq(a);
        return d(a)
      };
      e.cljs$core$IFn$_invoke$arity$variadic = d;
      return e
    }()
  }, d = function(a, b, c, d) {
    return function() {
      var e = function(e) {
        return cljs.core.apply.cljs$core$IFn$_invoke$arity$5(a, b, c, d, e)
      }, m = function(a) {
        var b = null;
        0 < arguments.length && (b = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
        return e.call(this, b)
      };
      m.cljs$lang$maxFixedArity = 0;
      m.cljs$lang$applyTo = function(a) {
        a = cljs.core.seq(a);
        return e(a)
      };
      m.cljs$core$IFn$_invoke$arity$variadic = e;
      return m
    }()
  }, e = function() {
    var a = function(a, b, c, d, e) {
      return function() {
        var f = function(f) {
          return cljs.core.apply.cljs$core$IFn$_invoke$arity$5(a, b, c, d, cljs.core.concat.cljs$core$IFn$_invoke$arity$2(e, f))
        }, g = function(a) {
          var b = null;
          0 < arguments.length && (b = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
          return f.call(this, b)
        };
        g.cljs$lang$maxFixedArity = 0;
        g.cljs$lang$applyTo = function(a) {
          a = cljs.core.seq(a);
          return f(a)
        };
        g.cljs$core$IFn$_invoke$arity$variadic = f;
        return g
      }()
    }, b = function(b, c, d, e, g) {
      var p = null;
      4 < arguments.length && (p = cljs.core.array_seq(Array.prototype.slice.call(arguments, 4), 0));
      return a.call(this, b, c, d, e, p)
    };
    b.cljs$lang$maxFixedArity = 4;
    b.cljs$lang$applyTo = function(b) {
      var c = cljs.core.first(b);
      b = cljs.core.next(b);
      var d = cljs.core.first(b);
      b = cljs.core.next(b);
      var e = cljs.core.first(b);
      b = cljs.core.next(b);
      var g = cljs.core.first(b);
      b = cljs.core.rest(b);
      return a(c, d, e, g, b)
    };
    b.cljs$core$IFn$_invoke$arity$variadic = a;
    return b
  }(), a = function(a, g, h, k, l) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, g);
      case 3:
        return c.call(this, a, g, h);
      case 4:
        return d.call(this, a, g, h, k);
      default:
        return e.cljs$core$IFn$_invoke$arity$variadic(a, g, h, k, cljs.core.array_seq(arguments, 4))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 4;
  a.cljs$lang$applyTo = e.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  a.cljs$core$IFn$_invoke$arity$4 = d;
  a.cljs$core$IFn$_invoke$arity$variadic = e.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.fnil = function() {
  var a = null, b = function(a, b) {
    return function() {
      var c = null, d = function() {
        var c = function(c, d, g, h) {
          return cljs.core.apply.cljs$core$IFn$_invoke$arity$5(a, null == c ? b : c, d, g, h)
        }, d = function(a, b, d, e) {
          var f = null;
          3 < arguments.length && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
          return c.call(this, a, b, d, f)
        };
        d.cljs$lang$maxFixedArity = 3;
        d.cljs$lang$applyTo = function(a) {
          var b = cljs.core.first(a);
          a = cljs.core.next(a);
          var d = cljs.core.first(a);
          a = cljs.core.next(a);
          var e = cljs.core.first(a);
          a = cljs.core.rest(a);
          return c(b, d, e, a)
        };
        d.cljs$core$IFn$_invoke$arity$variadic = c;
        return d
      }(), c = function(c, g, m, n) {
        switch(arguments.length) {
          case 1:
            return a.cljs$core$IFn$_invoke$arity$1 ? a.cljs$core$IFn$_invoke$arity$1(null == c ? b : c) : a.call(null, null == c ? b : c);
          case 2:
            return a.cljs$core$IFn$_invoke$arity$2 ? a.cljs$core$IFn$_invoke$arity$2(null == c ? b : c, g) : a.call(null, null == c ? b : c, g);
          case 3:
            return a.cljs$core$IFn$_invoke$arity$3 ? a.cljs$core$IFn$_invoke$arity$3(null == c ? b : c, g, m) : a.call(null, null == c ? b : c, g, m);
          default:
            return d.cljs$core$IFn$_invoke$arity$variadic(c, g, m, cljs.core.array_seq(arguments, 3))
        }
        throw Error("Invalid arity: " + arguments.length);
      };
      c.cljs$lang$maxFixedArity = 3;
      c.cljs$lang$applyTo = d.cljs$lang$applyTo;
      return c
    }()
  }, c = function(a, b, c) {
    return function() {
      var d = null, k = function() {
        var d = function(d, h, k, l) {
          return cljs.core.apply.cljs$core$IFn$_invoke$arity$5(a, null == d ? b : d, null == h ? c : h, k, l)
        }, h = function(a, b, c, e) {
          var f = null;
          3 < arguments.length && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
          return d.call(this, a, b, c, f)
        };
        h.cljs$lang$maxFixedArity = 3;
        h.cljs$lang$applyTo = function(a) {
          var b = cljs.core.first(a);
          a = cljs.core.next(a);
          var c = cljs.core.first(a);
          a = cljs.core.next(a);
          var e = cljs.core.first(a);
          a = cljs.core.rest(a);
          return d(b, c, e, a)
        };
        h.cljs$core$IFn$_invoke$arity$variadic = d;
        return h
      }(), d = function(d, h, n, p) {
        switch(arguments.length) {
          case 2:
            return a.cljs$core$IFn$_invoke$arity$2 ? a.cljs$core$IFn$_invoke$arity$2(null == d ? b : d, null == h ? c : h) : a.call(null, null == d ? b : d, null == h ? c : h);
          case 3:
            return a.cljs$core$IFn$_invoke$arity$3 ? a.cljs$core$IFn$_invoke$arity$3(null == d ? b : d, null == h ? c : h, n) : a.call(null, null == d ? b : d, null == h ? c : h, n);
          default:
            return k.cljs$core$IFn$_invoke$arity$variadic(d, h, n, cljs.core.array_seq(arguments, 3))
        }
        throw Error("Invalid arity: " + arguments.length);
      };
      d.cljs$lang$maxFixedArity = 3;
      d.cljs$lang$applyTo = k.cljs$lang$applyTo;
      return d
    }()
  }, d = function(a, b, c, d) {
    return function() {
      var k = null, l = function() {
        var k = function(k, l, m, n) {
          return cljs.core.apply.cljs$core$IFn$_invoke$arity$5(a, null == k ? b : k, null == l ? c : l, null == m ? d : m, n)
        }, l = function(a, b, c, d) {
          var e = null;
          3 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
          return k.call(this, a, b, c, e)
        };
        l.cljs$lang$maxFixedArity = 3;
        l.cljs$lang$applyTo = function(a) {
          var b = cljs.core.first(a);
          a = cljs.core.next(a);
          var c = cljs.core.first(a);
          a = cljs.core.next(a);
          var d = cljs.core.first(a);
          a = cljs.core.rest(a);
          return k(b, c, d, a)
        };
        l.cljs$core$IFn$_invoke$arity$variadic = k;
        return l
      }(), k = function(k, n, p, q) {
        switch(arguments.length) {
          case 2:
            return a.cljs$core$IFn$_invoke$arity$2 ? a.cljs$core$IFn$_invoke$arity$2(null == k ? b : k, null == n ? c : n) : a.call(null, null == k ? b : k, null == n ? c : n);
          case 3:
            return a.cljs$core$IFn$_invoke$arity$3 ? a.cljs$core$IFn$_invoke$arity$3(null == k ? b : k, null == n ? c : n, null == p ? d : p) : a.call(null, null == k ? b : k, null == n ? c : n, null == p ? d : p);
          default:
            return l.cljs$core$IFn$_invoke$arity$variadic(k, n, p, cljs.core.array_seq(arguments, 3))
        }
        throw Error("Invalid arity: " + arguments.length);
      };
      k.cljs$lang$maxFixedArity = 3;
      k.cljs$lang$applyTo = l.cljs$lang$applyTo;
      return k
    }()
  }, a = function(a, f, g, h) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, f);
      case 3:
        return c.call(this, a, f, g);
      case 4:
        return d.call(this, a, f, g, h)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  a.cljs$core$IFn$_invoke$arity$4 = d;
  return a
}();
cljs.core.map_indexed = function(a, b) {
  var c = function e(b, c) {
    return new cljs.core.LazySeq(null, !1, function() {
      var h = cljs.core.seq(c);
      if(h) {
        if(cljs.core.chunked_seq_QMARK_(h)) {
          for(var k = cljs.core.chunk_first(h), l = cljs.core.count(k), m = cljs.core.chunk_buffer(l), n = 0;;) {
            if(n < l) {
              cljs.core.chunk_append(m, a.cljs$core$IFn$_invoke$arity$2 ? a.cljs$core$IFn$_invoke$arity$2(b + n, cljs.core._nth.cljs$core$IFn$_invoke$arity$2(k, n)) : a.call(null, b + n, cljs.core._nth.cljs$core$IFn$_invoke$arity$2(k, n))), n += 1
            }else {
              break
            }
          }
          return cljs.core.chunk_cons(cljs.core.chunk(m), e(b + l, cljs.core.chunk_rest(h)))
        }
        return cljs.core.cons(a.cljs$core$IFn$_invoke$arity$2 ? a.cljs$core$IFn$_invoke$arity$2(b, cljs.core.first(h)) : a.call(null, b, cljs.core.first(h)), e(b + 1, cljs.core.rest(h)))
      }
      return null
    }, null)
  };
  return c.cljs$core$IFn$_invoke$arity$2 ? c.cljs$core$IFn$_invoke$arity$2(0, b) : c.call(null, 0, b)
};
cljs.core.keep = function keep(b, c) {
  return new cljs.core.LazySeq(null, !1, function() {
    var d = cljs.core.seq(c);
    if(d) {
      if(cljs.core.chunked_seq_QMARK_(d)) {
        for(var e = cljs.core.chunk_first(d), f = cljs.core.count(e), g = cljs.core.chunk_buffer(f), h = 0;;) {
          if(h < f) {
            var k = b.cljs$core$IFn$_invoke$arity$1 ? b.cljs$core$IFn$_invoke$arity$1(cljs.core._nth.cljs$core$IFn$_invoke$arity$2(e, h)) : b.call(null, cljs.core._nth.cljs$core$IFn$_invoke$arity$2(e, h));
            null != k && cljs.core.chunk_append(g, k);
            h += 1
          }else {
            break
          }
        }
        return cljs.core.chunk_cons(cljs.core.chunk(g), keep(b, cljs.core.chunk_rest(d)))
      }
      e = b.cljs$core$IFn$_invoke$arity$1 ? b.cljs$core$IFn$_invoke$arity$1(cljs.core.first(d)) : b.call(null, cljs.core.first(d));
      return null == e ? keep(b, cljs.core.rest(d)) : cljs.core.cons(e, keep(b, cljs.core.rest(d)))
    }
    return null
  }, null)
};
cljs.core.keep_indexed = function(a, b) {
  var c = function e(b, c) {
    return new cljs.core.LazySeq(null, !1, function() {
      var h = cljs.core.seq(c);
      if(h) {
        if(cljs.core.chunked_seq_QMARK_(h)) {
          for(var k = cljs.core.chunk_first(h), l = cljs.core.count(k), m = cljs.core.chunk_buffer(l), n = 0;;) {
            if(n < l) {
              var p = a.cljs$core$IFn$_invoke$arity$2 ? a.cljs$core$IFn$_invoke$arity$2(b + n, cljs.core._nth.cljs$core$IFn$_invoke$arity$2(k, n)) : a.call(null, b + n, cljs.core._nth.cljs$core$IFn$_invoke$arity$2(k, n));
              null != p && cljs.core.chunk_append(m, p);
              n += 1
            }else {
              break
            }
          }
          return cljs.core.chunk_cons(cljs.core.chunk(m), e(b + l, cljs.core.chunk_rest(h)))
        }
        k = a.cljs$core$IFn$_invoke$arity$2 ? a.cljs$core$IFn$_invoke$arity$2(b, cljs.core.first(h)) : a.call(null, b, cljs.core.first(h));
        return null == k ? e(b + 1, cljs.core.rest(h)) : cljs.core.cons(k, e(b + 1, cljs.core.rest(h)))
      }
      return null
    }, null)
  };
  return c.cljs$core$IFn$_invoke$arity$2 ? c.cljs$core$IFn$_invoke$arity$2(0, b) : c.call(null, 0, b)
};
cljs.core.every_pred = function() {
  var a = null, b = function(a) {
    return function() {
      var b = null, c = function(b) {
        return cljs.core.boolean$(a.cljs$core$IFn$_invoke$arity$1 ? a.cljs$core$IFn$_invoke$arity$1(b) : a.call(null, b))
      }, d = function(b, c) {
        return cljs.core.boolean$(function() {
          var d = a.cljs$core$IFn$_invoke$arity$1 ? a.cljs$core$IFn$_invoke$arity$1(b) : a.call(null, b);
          return cljs.core.truth_(d) ? a.cljs$core$IFn$_invoke$arity$1 ? a.cljs$core$IFn$_invoke$arity$1(c) : a.call(null, c) : d
        }())
      }, e = function(b, c, d) {
        return cljs.core.boolean$(function() {
          var e = a.cljs$core$IFn$_invoke$arity$1 ? a.cljs$core$IFn$_invoke$arity$1(b) : a.call(null, b);
          return cljs.core.truth_(e) ? (e = a.cljs$core$IFn$_invoke$arity$1 ? a.cljs$core$IFn$_invoke$arity$1(c) : a.call(null, c), cljs.core.truth_(e) ? a.cljs$core$IFn$_invoke$arity$1 ? a.cljs$core$IFn$_invoke$arity$1(d) : a.call(null, d) : e) : e
        }())
      }, m = function() {
        var c = function(c, d, e, h) {
          return cljs.core.boolean$(function() {
            var k = b.cljs$core$IFn$_invoke$arity$3(c, d, e);
            return cljs.core.truth_(k) ? cljs.core.every_QMARK_(a, h) : k
          }())
        }, d = function(a, b, d, e) {
          var f = null;
          3 < arguments.length && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
          return c.call(this, a, b, d, f)
        };
        d.cljs$lang$maxFixedArity = 3;
        d.cljs$lang$applyTo = function(a) {
          var b = cljs.core.first(a);
          a = cljs.core.next(a);
          var d = cljs.core.first(a);
          a = cljs.core.next(a);
          var e = cljs.core.first(a);
          a = cljs.core.rest(a);
          return c(b, d, e, a)
        };
        d.cljs$core$IFn$_invoke$arity$variadic = c;
        return d
      }(), b = function(a, b, f, g) {
        switch(arguments.length) {
          case 0:
            return!0;
          case 1:
            return c.call(this, a);
          case 2:
            return d.call(this, a, b);
          case 3:
            return e.call(this, a, b, f);
          default:
            return m.cljs$core$IFn$_invoke$arity$variadic(a, b, f, cljs.core.array_seq(arguments, 3))
        }
        throw Error("Invalid arity: " + arguments.length);
      };
      b.cljs$lang$maxFixedArity = 3;
      b.cljs$lang$applyTo = m.cljs$lang$applyTo;
      b.cljs$core$IFn$_invoke$arity$0 = function() {
        return!0
      };
      b.cljs$core$IFn$_invoke$arity$1 = c;
      b.cljs$core$IFn$_invoke$arity$2 = d;
      b.cljs$core$IFn$_invoke$arity$3 = e;
      b.cljs$core$IFn$_invoke$arity$variadic = m.cljs$core$IFn$_invoke$arity$variadic;
      return b
    }()
  }, c = function(a, b) {
    return function() {
      var c = null, d = function(c) {
        return cljs.core.boolean$(function() {
          var d = a.cljs$core$IFn$_invoke$arity$1 ? a.cljs$core$IFn$_invoke$arity$1(c) : a.call(null, c);
          return cljs.core.truth_(d) ? b.cljs$core$IFn$_invoke$arity$1 ? b.cljs$core$IFn$_invoke$arity$1(c) : b.call(null, c) : d
        }())
      }, e = function(c, d) {
        return cljs.core.boolean$(function() {
          var e = a.cljs$core$IFn$_invoke$arity$1 ? a.cljs$core$IFn$_invoke$arity$1(c) : a.call(null, c);
          return cljs.core.truth_(e) && (e = a.cljs$core$IFn$_invoke$arity$1 ? a.cljs$core$IFn$_invoke$arity$1(d) : a.call(null, d), cljs.core.truth_(e)) ? (e = b.cljs$core$IFn$_invoke$arity$1 ? b.cljs$core$IFn$_invoke$arity$1(c) : b.call(null, c), cljs.core.truth_(e) ? b.cljs$core$IFn$_invoke$arity$1 ? b.cljs$core$IFn$_invoke$arity$1(d) : b.call(null, d) : e) : e
        }())
      }, m = function(c, d, e) {
        return cljs.core.boolean$(function() {
          var h = a.cljs$core$IFn$_invoke$arity$1 ? a.cljs$core$IFn$_invoke$arity$1(c) : a.call(null, c);
          return cljs.core.truth_(h) && (h = a.cljs$core$IFn$_invoke$arity$1 ? a.cljs$core$IFn$_invoke$arity$1(d) : a.call(null, d), cljs.core.truth_(h) && (h = a.cljs$core$IFn$_invoke$arity$1 ? a.cljs$core$IFn$_invoke$arity$1(e) : a.call(null, e), cljs.core.truth_(h) && (h = b.cljs$core$IFn$_invoke$arity$1 ? b.cljs$core$IFn$_invoke$arity$1(c) : b.call(null, c), cljs.core.truth_(h)))) ? (h = b.cljs$core$IFn$_invoke$arity$1 ? b.cljs$core$IFn$_invoke$arity$1(d) : b.call(null, d), cljs.core.truth_(h) ? 
          b.cljs$core$IFn$_invoke$arity$1 ? b.cljs$core$IFn$_invoke$arity$1(e) : b.call(null, e) : h) : h
        }())
      }, n = function() {
        var d = function(d, e, k, l) {
          return cljs.core.boolean$(function() {
            var m = c.cljs$core$IFn$_invoke$arity$3(d, e, k);
            return cljs.core.truth_(m) ? cljs.core.every_QMARK_(function(c) {
              var d = a.cljs$core$IFn$_invoke$arity$1 ? a.cljs$core$IFn$_invoke$arity$1(c) : a.call(null, c);
              return cljs.core.truth_(d) ? b.cljs$core$IFn$_invoke$arity$1 ? b.cljs$core$IFn$_invoke$arity$1(c) : b.call(null, c) : d
            }, l) : m
          }())
        }, e = function(a, b, c, e) {
          var f = null;
          3 < arguments.length && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
          return d.call(this, a, b, c, f)
        };
        e.cljs$lang$maxFixedArity = 3;
        e.cljs$lang$applyTo = function(a) {
          var b = cljs.core.first(a);
          a = cljs.core.next(a);
          var c = cljs.core.first(a);
          a = cljs.core.next(a);
          var e = cljs.core.first(a);
          a = cljs.core.rest(a);
          return d(b, c, e, a)
        };
        e.cljs$core$IFn$_invoke$arity$variadic = d;
        return e
      }(), c = function(a, b, c, f) {
        switch(arguments.length) {
          case 0:
            return!0;
          case 1:
            return d.call(this, a);
          case 2:
            return e.call(this, a, b);
          case 3:
            return m.call(this, a, b, c);
          default:
            return n.cljs$core$IFn$_invoke$arity$variadic(a, b, c, cljs.core.array_seq(arguments, 3))
        }
        throw Error("Invalid arity: " + arguments.length);
      };
      c.cljs$lang$maxFixedArity = 3;
      c.cljs$lang$applyTo = n.cljs$lang$applyTo;
      c.cljs$core$IFn$_invoke$arity$0 = function() {
        return!0
      };
      c.cljs$core$IFn$_invoke$arity$1 = d;
      c.cljs$core$IFn$_invoke$arity$2 = e;
      c.cljs$core$IFn$_invoke$arity$3 = m;
      c.cljs$core$IFn$_invoke$arity$variadic = n.cljs$core$IFn$_invoke$arity$variadic;
      return c
    }()
  }, d = function(a, b, c) {
    return function() {
      var d = null, e = function(d) {
        return cljs.core.boolean$(function() {
          var e = a.cljs$core$IFn$_invoke$arity$1 ? a.cljs$core$IFn$_invoke$arity$1(d) : a.call(null, d);
          return cljs.core.truth_(e) ? (e = b.cljs$core$IFn$_invoke$arity$1 ? b.cljs$core$IFn$_invoke$arity$1(d) : b.call(null, d), cljs.core.truth_(e) ? c.cljs$core$IFn$_invoke$arity$1 ? c.cljs$core$IFn$_invoke$arity$1(d) : c.call(null, d) : e) : e
        }())
      }, m = function(d, e) {
        return cljs.core.boolean$(function() {
          var k = a.cljs$core$IFn$_invoke$arity$1 ? a.cljs$core$IFn$_invoke$arity$1(d) : a.call(null, d);
          return cljs.core.truth_(k) && (k = b.cljs$core$IFn$_invoke$arity$1 ? b.cljs$core$IFn$_invoke$arity$1(d) : b.call(null, d), cljs.core.truth_(k) && (k = c.cljs$core$IFn$_invoke$arity$1 ? c.cljs$core$IFn$_invoke$arity$1(d) : c.call(null, d), cljs.core.truth_(k) && (k = a.cljs$core$IFn$_invoke$arity$1 ? a.cljs$core$IFn$_invoke$arity$1(e) : a.call(null, e), cljs.core.truth_(k)))) ? (k = b.cljs$core$IFn$_invoke$arity$1 ? b.cljs$core$IFn$_invoke$arity$1(e) : b.call(null, e), cljs.core.truth_(k) ? 
          c.cljs$core$IFn$_invoke$arity$1 ? c.cljs$core$IFn$_invoke$arity$1(e) : c.call(null, e) : k) : k
        }())
      }, n = function(d, e, k) {
        return cljs.core.boolean$(function() {
          var l = a.cljs$core$IFn$_invoke$arity$1 ? a.cljs$core$IFn$_invoke$arity$1(d) : a.call(null, d);
          return cljs.core.truth_(l) && (l = b.cljs$core$IFn$_invoke$arity$1 ? b.cljs$core$IFn$_invoke$arity$1(d) : b.call(null, d), cljs.core.truth_(l) && (l = c.cljs$core$IFn$_invoke$arity$1 ? c.cljs$core$IFn$_invoke$arity$1(d) : c.call(null, d), cljs.core.truth_(l) && (l = a.cljs$core$IFn$_invoke$arity$1 ? a.cljs$core$IFn$_invoke$arity$1(e) : a.call(null, e), cljs.core.truth_(l) && (l = b.cljs$core$IFn$_invoke$arity$1 ? b.cljs$core$IFn$_invoke$arity$1(e) : b.call(null, e), cljs.core.truth_(l) && 
          (l = c.cljs$core$IFn$_invoke$arity$1 ? c.cljs$core$IFn$_invoke$arity$1(e) : c.call(null, e), cljs.core.truth_(l) && (l = a.cljs$core$IFn$_invoke$arity$1 ? a.cljs$core$IFn$_invoke$arity$1(k) : a.call(null, k), cljs.core.truth_(l))))))) ? (l = b.cljs$core$IFn$_invoke$arity$1 ? b.cljs$core$IFn$_invoke$arity$1(k) : b.call(null, k), cljs.core.truth_(l) ? c.cljs$core$IFn$_invoke$arity$1 ? c.cljs$core$IFn$_invoke$arity$1(k) : c.call(null, k) : l) : l
        }())
      }, p = function() {
        var e = function(e, l, m, n) {
          return cljs.core.boolean$(function() {
            var p = d.cljs$core$IFn$_invoke$arity$3(e, l, m);
            return cljs.core.truth_(p) ? cljs.core.every_QMARK_(function(d) {
              var e = a.cljs$core$IFn$_invoke$arity$1 ? a.cljs$core$IFn$_invoke$arity$1(d) : a.call(null, d);
              return cljs.core.truth_(e) ? (e = b.cljs$core$IFn$_invoke$arity$1 ? b.cljs$core$IFn$_invoke$arity$1(d) : b.call(null, d), cljs.core.truth_(e) ? c.cljs$core$IFn$_invoke$arity$1 ? c.cljs$core$IFn$_invoke$arity$1(d) : c.call(null, d) : e) : e
            }, n) : p
          }())
        }, l = function(a, b, c, d) {
          var f = null;
          3 < arguments.length && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
          return e.call(this, a, b, c, f)
        };
        l.cljs$lang$maxFixedArity = 3;
        l.cljs$lang$applyTo = function(a) {
          var b = cljs.core.first(a);
          a = cljs.core.next(a);
          var c = cljs.core.first(a);
          a = cljs.core.next(a);
          var d = cljs.core.first(a);
          a = cljs.core.rest(a);
          return e(b, c, d, a)
        };
        l.cljs$core$IFn$_invoke$arity$variadic = e;
        return l
      }(), d = function(a, b, c, d) {
        switch(arguments.length) {
          case 0:
            return!0;
          case 1:
            return e.call(this, a);
          case 2:
            return m.call(this, a, b);
          case 3:
            return n.call(this, a, b, c);
          default:
            return p.cljs$core$IFn$_invoke$arity$variadic(a, b, c, cljs.core.array_seq(arguments, 3))
        }
        throw Error("Invalid arity: " + arguments.length);
      };
      d.cljs$lang$maxFixedArity = 3;
      d.cljs$lang$applyTo = p.cljs$lang$applyTo;
      d.cljs$core$IFn$_invoke$arity$0 = function() {
        return!0
      };
      d.cljs$core$IFn$_invoke$arity$1 = e;
      d.cljs$core$IFn$_invoke$arity$2 = m;
      d.cljs$core$IFn$_invoke$arity$3 = n;
      d.cljs$core$IFn$_invoke$arity$variadic = p.cljs$core$IFn$_invoke$arity$variadic;
      return d
    }()
  }, e = function() {
    var a = function(a, b, c, d) {
      var e = cljs.core.list_STAR_.cljs$core$IFn$_invoke$arity$4(a, b, c, d);
      return function() {
        var a = null, b = function(a) {
          return cljs.core.every_QMARK_(function(b) {
            return b.cljs$core$IFn$_invoke$arity$1 ? b.cljs$core$IFn$_invoke$arity$1(a) : b.call(null, a)
          }, e)
        }, c = function(a, b) {
          return cljs.core.every_QMARK_(function(c) {
            var d = c.cljs$core$IFn$_invoke$arity$1 ? c.cljs$core$IFn$_invoke$arity$1(a) : c.call(null, a);
            return cljs.core.truth_(d) ? c.cljs$core$IFn$_invoke$arity$1 ? c.cljs$core$IFn$_invoke$arity$1(b) : c.call(null, b) : d
          }, e)
        }, d = function(a, b, c) {
          return cljs.core.every_QMARK_(function(d) {
            var e = d.cljs$core$IFn$_invoke$arity$1 ? d.cljs$core$IFn$_invoke$arity$1(a) : d.call(null, a);
            return cljs.core.truth_(e) ? (e = d.cljs$core$IFn$_invoke$arity$1 ? d.cljs$core$IFn$_invoke$arity$1(b) : d.call(null, b), cljs.core.truth_(e) ? d.cljs$core$IFn$_invoke$arity$1 ? d.cljs$core$IFn$_invoke$arity$1(c) : d.call(null, c) : e) : e
          }, e)
        }, f = function() {
          var b = function(b, c, d, f) {
            return cljs.core.boolean$(function() {
              var g = a.cljs$core$IFn$_invoke$arity$3(b, c, d);
              return cljs.core.truth_(g) ? cljs.core.every_QMARK_(function(a) {
                return cljs.core.every_QMARK_(a, f)
              }, e) : g
            }())
          }, c = function(a, c, d, e) {
            var f = null;
            3 < arguments.length && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
            return b.call(this, a, c, d, f)
          };
          c.cljs$lang$maxFixedArity = 3;
          c.cljs$lang$applyTo = function(a) {
            var c = cljs.core.first(a);
            a = cljs.core.next(a);
            var d = cljs.core.first(a);
            a = cljs.core.next(a);
            var e = cljs.core.first(a);
            a = cljs.core.rest(a);
            return b(c, d, e, a)
          };
          c.cljs$core$IFn$_invoke$arity$variadic = b;
          return c
        }(), a = function(a, e, g, h) {
          switch(arguments.length) {
            case 0:
              return!0;
            case 1:
              return b.call(this, a);
            case 2:
              return c.call(this, a, e);
            case 3:
              return d.call(this, a, e, g);
            default:
              return f.cljs$core$IFn$_invoke$arity$variadic(a, e, g, cljs.core.array_seq(arguments, 3))
          }
          throw Error("Invalid arity: " + arguments.length);
        };
        a.cljs$lang$maxFixedArity = 3;
        a.cljs$lang$applyTo = f.cljs$lang$applyTo;
        a.cljs$core$IFn$_invoke$arity$0 = function() {
          return!0
        };
        a.cljs$core$IFn$_invoke$arity$1 = b;
        a.cljs$core$IFn$_invoke$arity$2 = c;
        a.cljs$core$IFn$_invoke$arity$3 = d;
        a.cljs$core$IFn$_invoke$arity$variadic = f.cljs$core$IFn$_invoke$arity$variadic;
        return a
      }()
    }, b = function(b, c, d, e) {
      var g = null;
      3 < arguments.length && (g = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
      return a.call(this, b, c, d, g)
    };
    b.cljs$lang$maxFixedArity = 3;
    b.cljs$lang$applyTo = function(b) {
      var c = cljs.core.first(b);
      b = cljs.core.next(b);
      var d = cljs.core.first(b);
      b = cljs.core.next(b);
      var e = cljs.core.first(b);
      b = cljs.core.rest(b);
      return a(c, d, e, b)
    };
    b.cljs$core$IFn$_invoke$arity$variadic = a;
    return b
  }(), a = function(a, g, h, k) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, g);
      case 3:
        return d.call(this, a, g, h);
      default:
        return e.cljs$core$IFn$_invoke$arity$variadic(a, g, h, cljs.core.array_seq(arguments, 3))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 3;
  a.cljs$lang$applyTo = e.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  a.cljs$core$IFn$_invoke$arity$3 = d;
  a.cljs$core$IFn$_invoke$arity$variadic = e.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.some_fn = function() {
  var a = null, b = function(a) {
    return function() {
      var b = null, c = function(b) {
        return a.cljs$core$IFn$_invoke$arity$1 ? a.cljs$core$IFn$_invoke$arity$1(b) : a.call(null, b)
      }, d = function(b, c) {
        var d = a.cljs$core$IFn$_invoke$arity$1 ? a.cljs$core$IFn$_invoke$arity$1(b) : a.call(null, b);
        return cljs.core.truth_(d) ? d : a.cljs$core$IFn$_invoke$arity$1 ? a.cljs$core$IFn$_invoke$arity$1(c) : a.call(null, c)
      }, e = function(b, c, d) {
        b = a.cljs$core$IFn$_invoke$arity$1 ? a.cljs$core$IFn$_invoke$arity$1(b) : a.call(null, b);
        if(cljs.core.truth_(b)) {
          return b
        }
        c = a.cljs$core$IFn$_invoke$arity$1 ? a.cljs$core$IFn$_invoke$arity$1(c) : a.call(null, c);
        return cljs.core.truth_(c) ? c : a.cljs$core$IFn$_invoke$arity$1 ? a.cljs$core$IFn$_invoke$arity$1(d) : a.call(null, d)
      }, m = function() {
        var c = function(c, d, e, h) {
          c = b.cljs$core$IFn$_invoke$arity$3(c, d, e);
          return cljs.core.truth_(c) ? c : cljs.core.some(a, h)
        }, d = function(a, b, d, e) {
          var f = null;
          3 < arguments.length && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
          return c.call(this, a, b, d, f)
        };
        d.cljs$lang$maxFixedArity = 3;
        d.cljs$lang$applyTo = function(a) {
          var b = cljs.core.first(a);
          a = cljs.core.next(a);
          var d = cljs.core.first(a);
          a = cljs.core.next(a);
          var e = cljs.core.first(a);
          a = cljs.core.rest(a);
          return c(b, d, e, a)
        };
        d.cljs$core$IFn$_invoke$arity$variadic = c;
        return d
      }(), b = function(a, b, f, g) {
        switch(arguments.length) {
          case 0:
            return null;
          case 1:
            return c.call(this, a);
          case 2:
            return d.call(this, a, b);
          case 3:
            return e.call(this, a, b, f);
          default:
            return m.cljs$core$IFn$_invoke$arity$variadic(a, b, f, cljs.core.array_seq(arguments, 3))
        }
        throw Error("Invalid arity: " + arguments.length);
      };
      b.cljs$lang$maxFixedArity = 3;
      b.cljs$lang$applyTo = m.cljs$lang$applyTo;
      b.cljs$core$IFn$_invoke$arity$0 = function() {
        return null
      };
      b.cljs$core$IFn$_invoke$arity$1 = c;
      b.cljs$core$IFn$_invoke$arity$2 = d;
      b.cljs$core$IFn$_invoke$arity$3 = e;
      b.cljs$core$IFn$_invoke$arity$variadic = m.cljs$core$IFn$_invoke$arity$variadic;
      return b
    }()
  }, c = function(a, b) {
    return function() {
      var c = null, d = function(c) {
        var d = a.cljs$core$IFn$_invoke$arity$1 ? a.cljs$core$IFn$_invoke$arity$1(c) : a.call(null, c);
        return cljs.core.truth_(d) ? d : b.cljs$core$IFn$_invoke$arity$1 ? b.cljs$core$IFn$_invoke$arity$1(c) : b.call(null, c)
      }, e = function(c, d) {
        var e = a.cljs$core$IFn$_invoke$arity$1 ? a.cljs$core$IFn$_invoke$arity$1(c) : a.call(null, c);
        if(cljs.core.truth_(e)) {
          return e
        }
        e = a.cljs$core$IFn$_invoke$arity$1 ? a.cljs$core$IFn$_invoke$arity$1(d) : a.call(null, d);
        if(cljs.core.truth_(e)) {
          return e
        }
        e = b.cljs$core$IFn$_invoke$arity$1 ? b.cljs$core$IFn$_invoke$arity$1(c) : b.call(null, c);
        return cljs.core.truth_(e) ? e : b.cljs$core$IFn$_invoke$arity$1 ? b.cljs$core$IFn$_invoke$arity$1(d) : b.call(null, d)
      }, m = function(c, d, e) {
        var h = a.cljs$core$IFn$_invoke$arity$1 ? a.cljs$core$IFn$_invoke$arity$1(c) : a.call(null, c);
        if(cljs.core.truth_(h)) {
          return h
        }
        h = a.cljs$core$IFn$_invoke$arity$1 ? a.cljs$core$IFn$_invoke$arity$1(d) : a.call(null, d);
        if(cljs.core.truth_(h)) {
          return h
        }
        h = a.cljs$core$IFn$_invoke$arity$1 ? a.cljs$core$IFn$_invoke$arity$1(e) : a.call(null, e);
        if(cljs.core.truth_(h)) {
          return h
        }
        c = b.cljs$core$IFn$_invoke$arity$1 ? b.cljs$core$IFn$_invoke$arity$1(c) : b.call(null, c);
        if(cljs.core.truth_(c)) {
          return c
        }
        d = b.cljs$core$IFn$_invoke$arity$1 ? b.cljs$core$IFn$_invoke$arity$1(d) : b.call(null, d);
        return cljs.core.truth_(d) ? d : b.cljs$core$IFn$_invoke$arity$1 ? b.cljs$core$IFn$_invoke$arity$1(e) : b.call(null, e)
      }, n = function() {
        var d = function(d, e, k, l) {
          d = c.cljs$core$IFn$_invoke$arity$3(d, e, k);
          return cljs.core.truth_(d) ? d : cljs.core.some(function(c) {
            var d = a.cljs$core$IFn$_invoke$arity$1 ? a.cljs$core$IFn$_invoke$arity$1(c) : a.call(null, c);
            return cljs.core.truth_(d) ? d : b.cljs$core$IFn$_invoke$arity$1 ? b.cljs$core$IFn$_invoke$arity$1(c) : b.call(null, c)
          }, l)
        }, e = function(a, b, c, e) {
          var f = null;
          3 < arguments.length && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
          return d.call(this, a, b, c, f)
        };
        e.cljs$lang$maxFixedArity = 3;
        e.cljs$lang$applyTo = function(a) {
          var b = cljs.core.first(a);
          a = cljs.core.next(a);
          var c = cljs.core.first(a);
          a = cljs.core.next(a);
          var e = cljs.core.first(a);
          a = cljs.core.rest(a);
          return d(b, c, e, a)
        };
        e.cljs$core$IFn$_invoke$arity$variadic = d;
        return e
      }(), c = function(a, b, c, f) {
        switch(arguments.length) {
          case 0:
            return null;
          case 1:
            return d.call(this, a);
          case 2:
            return e.call(this, a, b);
          case 3:
            return m.call(this, a, b, c);
          default:
            return n.cljs$core$IFn$_invoke$arity$variadic(a, b, c, cljs.core.array_seq(arguments, 3))
        }
        throw Error("Invalid arity: " + arguments.length);
      };
      c.cljs$lang$maxFixedArity = 3;
      c.cljs$lang$applyTo = n.cljs$lang$applyTo;
      c.cljs$core$IFn$_invoke$arity$0 = function() {
        return null
      };
      c.cljs$core$IFn$_invoke$arity$1 = d;
      c.cljs$core$IFn$_invoke$arity$2 = e;
      c.cljs$core$IFn$_invoke$arity$3 = m;
      c.cljs$core$IFn$_invoke$arity$variadic = n.cljs$core$IFn$_invoke$arity$variadic;
      return c
    }()
  }, d = function(a, b, c) {
    return function() {
      var d = null, e = function(d) {
        var e = a.cljs$core$IFn$_invoke$arity$1 ? a.cljs$core$IFn$_invoke$arity$1(d) : a.call(null, d);
        if(cljs.core.truth_(e)) {
          return e
        }
        e = b.cljs$core$IFn$_invoke$arity$1 ? b.cljs$core$IFn$_invoke$arity$1(d) : b.call(null, d);
        return cljs.core.truth_(e) ? e : c.cljs$core$IFn$_invoke$arity$1 ? c.cljs$core$IFn$_invoke$arity$1(d) : c.call(null, d)
      }, m = function(d, e) {
        var k = a.cljs$core$IFn$_invoke$arity$1 ? a.cljs$core$IFn$_invoke$arity$1(d) : a.call(null, d);
        if(cljs.core.truth_(k)) {
          return k
        }
        k = b.cljs$core$IFn$_invoke$arity$1 ? b.cljs$core$IFn$_invoke$arity$1(d) : b.call(null, d);
        if(cljs.core.truth_(k)) {
          return k
        }
        k = c.cljs$core$IFn$_invoke$arity$1 ? c.cljs$core$IFn$_invoke$arity$1(d) : c.call(null, d);
        if(cljs.core.truth_(k)) {
          return k
        }
        k = a.cljs$core$IFn$_invoke$arity$1 ? a.cljs$core$IFn$_invoke$arity$1(e) : a.call(null, e);
        if(cljs.core.truth_(k)) {
          return k
        }
        k = b.cljs$core$IFn$_invoke$arity$1 ? b.cljs$core$IFn$_invoke$arity$1(e) : b.call(null, e);
        return cljs.core.truth_(k) ? k : c.cljs$core$IFn$_invoke$arity$1 ? c.cljs$core$IFn$_invoke$arity$1(e) : c.call(null, e)
      }, n = function(d, e, k) {
        var l = a.cljs$core$IFn$_invoke$arity$1 ? a.cljs$core$IFn$_invoke$arity$1(d) : a.call(null, d);
        if(cljs.core.truth_(l)) {
          return l
        }
        l = b.cljs$core$IFn$_invoke$arity$1 ? b.cljs$core$IFn$_invoke$arity$1(d) : b.call(null, d);
        if(cljs.core.truth_(l)) {
          return l
        }
        d = c.cljs$core$IFn$_invoke$arity$1 ? c.cljs$core$IFn$_invoke$arity$1(d) : c.call(null, d);
        if(cljs.core.truth_(d)) {
          return d
        }
        d = a.cljs$core$IFn$_invoke$arity$1 ? a.cljs$core$IFn$_invoke$arity$1(e) : a.call(null, e);
        if(cljs.core.truth_(d)) {
          return d
        }
        d = b.cljs$core$IFn$_invoke$arity$1 ? b.cljs$core$IFn$_invoke$arity$1(e) : b.call(null, e);
        if(cljs.core.truth_(d)) {
          return d
        }
        e = c.cljs$core$IFn$_invoke$arity$1 ? c.cljs$core$IFn$_invoke$arity$1(e) : c.call(null, e);
        if(cljs.core.truth_(e)) {
          return e
        }
        e = a.cljs$core$IFn$_invoke$arity$1 ? a.cljs$core$IFn$_invoke$arity$1(k) : a.call(null, k);
        if(cljs.core.truth_(e)) {
          return e
        }
        e = b.cljs$core$IFn$_invoke$arity$1 ? b.cljs$core$IFn$_invoke$arity$1(k) : b.call(null, k);
        return cljs.core.truth_(e) ? e : c.cljs$core$IFn$_invoke$arity$1 ? c.cljs$core$IFn$_invoke$arity$1(k) : c.call(null, k)
      }, p = function() {
        var e = function(e, l, m, n) {
          e = d.cljs$core$IFn$_invoke$arity$3(e, l, m);
          return cljs.core.truth_(e) ? e : cljs.core.some(function(d) {
            var e = a.cljs$core$IFn$_invoke$arity$1 ? a.cljs$core$IFn$_invoke$arity$1(d) : a.call(null, d);
            if(cljs.core.truth_(e)) {
              return e
            }
            e = b.cljs$core$IFn$_invoke$arity$1 ? b.cljs$core$IFn$_invoke$arity$1(d) : b.call(null, d);
            return cljs.core.truth_(e) ? e : c.cljs$core$IFn$_invoke$arity$1 ? c.cljs$core$IFn$_invoke$arity$1(d) : c.call(null, d)
          }, n)
        }, l = function(a, b, c, d) {
          var f = null;
          3 < arguments.length && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
          return e.call(this, a, b, c, f)
        };
        l.cljs$lang$maxFixedArity = 3;
        l.cljs$lang$applyTo = function(a) {
          var b = cljs.core.first(a);
          a = cljs.core.next(a);
          var c = cljs.core.first(a);
          a = cljs.core.next(a);
          var d = cljs.core.first(a);
          a = cljs.core.rest(a);
          return e(b, c, d, a)
        };
        l.cljs$core$IFn$_invoke$arity$variadic = e;
        return l
      }(), d = function(a, b, c, d) {
        switch(arguments.length) {
          case 0:
            return null;
          case 1:
            return e.call(this, a);
          case 2:
            return m.call(this, a, b);
          case 3:
            return n.call(this, a, b, c);
          default:
            return p.cljs$core$IFn$_invoke$arity$variadic(a, b, c, cljs.core.array_seq(arguments, 3))
        }
        throw Error("Invalid arity: " + arguments.length);
      };
      d.cljs$lang$maxFixedArity = 3;
      d.cljs$lang$applyTo = p.cljs$lang$applyTo;
      d.cljs$core$IFn$_invoke$arity$0 = function() {
        return null
      };
      d.cljs$core$IFn$_invoke$arity$1 = e;
      d.cljs$core$IFn$_invoke$arity$2 = m;
      d.cljs$core$IFn$_invoke$arity$3 = n;
      d.cljs$core$IFn$_invoke$arity$variadic = p.cljs$core$IFn$_invoke$arity$variadic;
      return d
    }()
  }, e = function() {
    var a = function(a, b, c, d) {
      var e = cljs.core.list_STAR_.cljs$core$IFn$_invoke$arity$4(a, b, c, d);
      return function() {
        var a = null, b = function(a) {
          return cljs.core.some(function(b) {
            return b.cljs$core$IFn$_invoke$arity$1 ? b.cljs$core$IFn$_invoke$arity$1(a) : b.call(null, a)
          }, e)
        }, c = function(a, b) {
          return cljs.core.some(function(c) {
            var d = c.cljs$core$IFn$_invoke$arity$1 ? c.cljs$core$IFn$_invoke$arity$1(a) : c.call(null, a);
            return cljs.core.truth_(d) ? d : c.cljs$core$IFn$_invoke$arity$1 ? c.cljs$core$IFn$_invoke$arity$1(b) : c.call(null, b)
          }, e)
        }, d = function(a, b, c) {
          return cljs.core.some(function(d) {
            var e = d.cljs$core$IFn$_invoke$arity$1 ? d.cljs$core$IFn$_invoke$arity$1(a) : d.call(null, a);
            if(cljs.core.truth_(e)) {
              return e
            }
            e = d.cljs$core$IFn$_invoke$arity$1 ? d.cljs$core$IFn$_invoke$arity$1(b) : d.call(null, b);
            return cljs.core.truth_(e) ? e : d.cljs$core$IFn$_invoke$arity$1 ? d.cljs$core$IFn$_invoke$arity$1(c) : d.call(null, c)
          }, e)
        }, f = function() {
          var b = function(b, c, d, f) {
            b = a.cljs$core$IFn$_invoke$arity$3(b, c, d);
            return cljs.core.truth_(b) ? b : cljs.core.some(function(a) {
              return cljs.core.some(a, f)
            }, e)
          }, c = function(a, c, d, e) {
            var f = null;
            3 < arguments.length && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
            return b.call(this, a, c, d, f)
          };
          c.cljs$lang$maxFixedArity = 3;
          c.cljs$lang$applyTo = function(a) {
            var c = cljs.core.first(a);
            a = cljs.core.next(a);
            var d = cljs.core.first(a);
            a = cljs.core.next(a);
            var e = cljs.core.first(a);
            a = cljs.core.rest(a);
            return b(c, d, e, a)
          };
          c.cljs$core$IFn$_invoke$arity$variadic = b;
          return c
        }(), a = function(a, e, g, h) {
          switch(arguments.length) {
            case 0:
              return null;
            case 1:
              return b.call(this, a);
            case 2:
              return c.call(this, a, e);
            case 3:
              return d.call(this, a, e, g);
            default:
              return f.cljs$core$IFn$_invoke$arity$variadic(a, e, g, cljs.core.array_seq(arguments, 3))
          }
          throw Error("Invalid arity: " + arguments.length);
        };
        a.cljs$lang$maxFixedArity = 3;
        a.cljs$lang$applyTo = f.cljs$lang$applyTo;
        a.cljs$core$IFn$_invoke$arity$0 = function() {
          return null
        };
        a.cljs$core$IFn$_invoke$arity$1 = b;
        a.cljs$core$IFn$_invoke$arity$2 = c;
        a.cljs$core$IFn$_invoke$arity$3 = d;
        a.cljs$core$IFn$_invoke$arity$variadic = f.cljs$core$IFn$_invoke$arity$variadic;
        return a
      }()
    }, b = function(b, c, d, e) {
      var g = null;
      3 < arguments.length && (g = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
      return a.call(this, b, c, d, g)
    };
    b.cljs$lang$maxFixedArity = 3;
    b.cljs$lang$applyTo = function(b) {
      var c = cljs.core.first(b);
      b = cljs.core.next(b);
      var d = cljs.core.first(b);
      b = cljs.core.next(b);
      var e = cljs.core.first(b);
      b = cljs.core.rest(b);
      return a(c, d, e, b)
    };
    b.cljs$core$IFn$_invoke$arity$variadic = a;
    return b
  }(), a = function(a, g, h, k) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, g);
      case 3:
        return d.call(this, a, g, h);
      default:
        return e.cljs$core$IFn$_invoke$arity$variadic(a, g, h, cljs.core.array_seq(arguments, 3))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 3;
  a.cljs$lang$applyTo = e.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  a.cljs$core$IFn$_invoke$arity$3 = d;
  a.cljs$core$IFn$_invoke$arity$variadic = e.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.map = function() {
  var a = null, b = function(b, c) {
    return new cljs.core.LazySeq(null, !1, function() {
      var d = cljs.core.seq(c);
      if(d) {
        if(cljs.core.chunked_seq_QMARK_(d)) {
          for(var e = cljs.core.chunk_first(d), l = cljs.core.count(e), m = cljs.core.chunk_buffer(l), n = 0;;) {
            if(n < l) {
              cljs.core.chunk_append(m, b.cljs$core$IFn$_invoke$arity$1 ? b.cljs$core$IFn$_invoke$arity$1(cljs.core._nth.cljs$core$IFn$_invoke$arity$2(e, n)) : b.call(null, cljs.core._nth.cljs$core$IFn$_invoke$arity$2(e, n))), n += 1
            }else {
              break
            }
          }
          return cljs.core.chunk_cons(cljs.core.chunk(m), a.cljs$core$IFn$_invoke$arity$2(b, cljs.core.chunk_rest(d)))
        }
        return cljs.core.cons(b.cljs$core$IFn$_invoke$arity$1 ? b.cljs$core$IFn$_invoke$arity$1(cljs.core.first(d)) : b.call(null, cljs.core.first(d)), a.cljs$core$IFn$_invoke$arity$2(b, cljs.core.rest(d)))
      }
      return null
    }, null)
  }, c = function(b, c, d) {
    return new cljs.core.LazySeq(null, !1, function() {
      var e = cljs.core.seq(c), l = cljs.core.seq(d);
      return(e ? l : e) ? cljs.core.cons(b.cljs$core$IFn$_invoke$arity$2 ? b.cljs$core$IFn$_invoke$arity$2(cljs.core.first(e), cljs.core.first(l)) : b.call(null, cljs.core.first(e), cljs.core.first(l)), a.cljs$core$IFn$_invoke$arity$3(b, cljs.core.rest(e), cljs.core.rest(l))) : null
    }, null)
  }, d = function(b, c, d, e) {
    return new cljs.core.LazySeq(null, !1, function() {
      var l = cljs.core.seq(c), m = cljs.core.seq(d), n = cljs.core.seq(e);
      return(l ? m ? n : m : l) ? cljs.core.cons(b.cljs$core$IFn$_invoke$arity$3 ? b.cljs$core$IFn$_invoke$arity$3(cljs.core.first(l), cljs.core.first(m), cljs.core.first(n)) : b.call(null, cljs.core.first(l), cljs.core.first(m), cljs.core.first(n)), a.cljs$core$IFn$_invoke$arity$4(b, cljs.core.rest(l), cljs.core.rest(m), cljs.core.rest(n))) : null
    }, null)
  }, e = function() {
    var b = function(b, c, d, e, f) {
      return a.cljs$core$IFn$_invoke$arity$2(function(a) {
        return cljs.core.apply.cljs$core$IFn$_invoke$arity$2(b, a)
      }, function q(b) {
        return new cljs.core.LazySeq(null, !1, function() {
          var c = a.cljs$core$IFn$_invoke$arity$2(cljs.core.seq, b);
          return cljs.core.every_QMARK_(cljs.core.identity, c) ? cljs.core.cons(a.cljs$core$IFn$_invoke$arity$2(cljs.core.first, c), q(a.cljs$core$IFn$_invoke$arity$2(cljs.core.rest, c))) : null
        }, null)
      }(cljs.core.conj.cljs$core$IFn$_invoke$arity$variadic(f, e, cljs.core.array_seq([d, c], 0))))
    }, c = function(a, c, d, e, g) {
      var p = null;
      4 < arguments.length && (p = cljs.core.array_seq(Array.prototype.slice.call(arguments, 4), 0));
      return b.call(this, a, c, d, e, p)
    };
    c.cljs$lang$maxFixedArity = 4;
    c.cljs$lang$applyTo = function(a) {
      var c = cljs.core.first(a);
      a = cljs.core.next(a);
      var d = cljs.core.first(a);
      a = cljs.core.next(a);
      var e = cljs.core.first(a);
      a = cljs.core.next(a);
      var g = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(c, d, e, g, a)
    };
    c.cljs$core$IFn$_invoke$arity$variadic = b;
    return c
  }(), a = function(a, g, h, k, l) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, g);
      case 3:
        return c.call(this, a, g, h);
      case 4:
        return d.call(this, a, g, h, k);
      default:
        return e.cljs$core$IFn$_invoke$arity$variadic(a, g, h, k, cljs.core.array_seq(arguments, 4))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 4;
  a.cljs$lang$applyTo = e.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  a.cljs$core$IFn$_invoke$arity$4 = d;
  a.cljs$core$IFn$_invoke$arity$variadic = e.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.take = function take(b, c) {
  return new cljs.core.LazySeq(null, !1, function() {
    if(0 < b) {
      var d = cljs.core.seq(c);
      return d ? cljs.core.cons(cljs.core.first(d), take(b - 1, cljs.core.rest(d))) : null
    }
    return null
  }, null)
};
cljs.core.drop = function(a, b) {
  var c = function(a, b) {
    for(;;) {
      var c = cljs.core.seq(b);
      if(cljs.core.truth_(function() {
        var b = 0 < a;
        return b ? c : b
      }())) {
        var g = a - 1, h = cljs.core.rest(c);
        a = g;
        b = h
      }else {
        return c
      }
    }
  };
  return new cljs.core.LazySeq(null, !1, function() {
    return c(a, b)
  }, null)
};
cljs.core.drop_last = function() {
  var a = null, b = function(b) {
    return a.cljs$core$IFn$_invoke$arity$2(1, b)
  }, c = function(a, b) {
    return cljs.core.map.cljs$core$IFn$_invoke$arity$3(function(a, b) {
      return a
    }, b, cljs.core.drop(a, b))
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a
}();
cljs.core.take_last = function(a, b) {
  for(var c = cljs.core.seq(b), d = cljs.core.seq(cljs.core.drop(a, b));;) {
    if(d) {
      c = cljs.core.next(c), d = cljs.core.next(d)
    }else {
      return c
    }
  }
};
cljs.core.drop_while = function(a, b) {
  var c = function(a, b) {
    for(;;) {
      var c = cljs.core.seq(b);
      if(cljs.core.truth_(function() {
        var b = c;
        return b ? a.cljs$core$IFn$_invoke$arity$1 ? a.cljs$core$IFn$_invoke$arity$1(cljs.core.first(c)) : a.call(null, cljs.core.first(c)) : b
      }())) {
        var g = a, h = cljs.core.rest(c);
        a = g;
        b = h
      }else {
        return c
      }
    }
  };
  return new cljs.core.LazySeq(null, !1, function() {
    return c(a, b)
  }, null)
};
cljs.core.cycle = function cycle(b) {
  return new cljs.core.LazySeq(null, !1, function() {
    var c = cljs.core.seq(b);
    return c ? cljs.core.concat.cljs$core$IFn$_invoke$arity$2(c, cycle(c)) : null
  }, null)
};
cljs.core.split_at = function(a, b) {
  return cljs.core.PersistentVector.fromArray([cljs.core.take(a, b), cljs.core.drop(a, b)], !0)
};
cljs.core.repeat = function() {
  var a = null, b = function(b) {
    return new cljs.core.LazySeq(null, !1, function() {
      return cljs.core.cons(b, a.cljs$core$IFn$_invoke$arity$1(b))
    }, null)
  }, c = function(b, c) {
    return cljs.core.take(b, a.cljs$core$IFn$_invoke$arity$1(c))
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a
}();
cljs.core.replicate = function(a, b) {
  return cljs.core.take(a, cljs.core.repeat.cljs$core$IFn$_invoke$arity$1(b))
};
cljs.core.repeatedly = function() {
  var a = null, b = function(b) {
    return new cljs.core.LazySeq(null, !1, function() {
      return cljs.core.cons(b.cljs$core$IFn$_invoke$arity$0 ? b.cljs$core$IFn$_invoke$arity$0() : b.call(null), a.cljs$core$IFn$_invoke$arity$1(b))
    }, null)
  }, c = function(b, c) {
    return cljs.core.take(b, a.cljs$core$IFn$_invoke$arity$1(c))
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a
}();
cljs.core.iterate = function iterate(b, c) {
  return cljs.core.cons(c, new cljs.core.LazySeq(null, !1, function() {
    return iterate(b, b.cljs$core$IFn$_invoke$arity$1 ? b.cljs$core$IFn$_invoke$arity$1(c) : b.call(null, c))
  }, null))
};
cljs.core.interleave = function() {
  var a = null, b = function(b, c) {
    return new cljs.core.LazySeq(null, !1, function() {
      var f = cljs.core.seq(b), g = cljs.core.seq(c);
      return(f ? g : f) ? cljs.core.cons(cljs.core.first(f), cljs.core.cons(cljs.core.first(g), a.cljs$core$IFn$_invoke$arity$2(cljs.core.rest(f), cljs.core.rest(g)))) : null
    }, null)
  }, c = function() {
    var b = function(b, c, d) {
      return new cljs.core.LazySeq(null, !1, function() {
        var e = cljs.core.map.cljs$core$IFn$_invoke$arity$2(cljs.core.seq, cljs.core.conj.cljs$core$IFn$_invoke$arity$variadic(d, c, cljs.core.array_seq([b], 0)));
        return cljs.core.every_QMARK_(cljs.core.identity, e) ? cljs.core.concat.cljs$core$IFn$_invoke$arity$2(cljs.core.map.cljs$core$IFn$_invoke$arity$2(cljs.core.first, e), cljs.core.apply.cljs$core$IFn$_invoke$arity$2(a, cljs.core.map.cljs$core$IFn$_invoke$arity$2(cljs.core.rest, e))) : null
      }, null)
    }, c = function(a, c, e) {
      var k = null;
      2 < arguments.length && (k = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, c, k)
    };
    c.cljs$lang$maxFixedArity = 2;
    c.cljs$lang$applyTo = function(a) {
      var c = cljs.core.first(a);
      a = cljs.core.next(a);
      var e = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(c, e, a)
    };
    c.cljs$core$IFn$_invoke$arity$variadic = b;
    return c
  }(), a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(a, e, cljs.core.array_seq(arguments, 2))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.interpose = function(a, b) {
  return cljs.core.drop(1, cljs.core.interleave.cljs$core$IFn$_invoke$arity$2(cljs.core.repeat.cljs$core$IFn$_invoke$arity$1(a), b))
};
cljs.core.flatten1 = function(a) {
  return function c(a, e) {
    return new cljs.core.LazySeq(null, !1, function() {
      var f = cljs.core.seq(a);
      return f ? cljs.core.cons(cljs.core.first(f), c(cljs.core.rest(f), e)) : cljs.core.seq(e) ? c(cljs.core.first(e), cljs.core.rest(e)) : null
    }, null)
  }(null, a)
};
cljs.core.mapcat = function() {
  var a = null, b = function(a, b) {
    return cljs.core.flatten1(cljs.core.map.cljs$core$IFn$_invoke$arity$2(a, b))
  }, c = function() {
    var a = function(a, b, c) {
      return cljs.core.flatten1(cljs.core.apply.cljs$core$IFn$_invoke$arity$4(cljs.core.map, a, b, c))
    }, b = function(b, c, e) {
      var k = null;
      2 < arguments.length && (k = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return a.call(this, b, c, k)
    };
    b.cljs$lang$maxFixedArity = 2;
    b.cljs$lang$applyTo = function(b) {
      var c = cljs.core.first(b);
      b = cljs.core.next(b);
      var e = cljs.core.first(b);
      b = cljs.core.rest(b);
      return a(c, e, b)
    };
    b.cljs$core$IFn$_invoke$arity$variadic = a;
    return b
  }(), a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(a, e, cljs.core.array_seq(arguments, 2))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.filter = function filter(b, c) {
  return new cljs.core.LazySeq(null, !1, function() {
    var d = cljs.core.seq(c);
    if(d) {
      if(cljs.core.chunked_seq_QMARK_(d)) {
        for(var e = cljs.core.chunk_first(d), f = cljs.core.count(e), g = cljs.core.chunk_buffer(f), h = 0;;) {
          if(h < f) {
            cljs.core.truth_(b.cljs$core$IFn$_invoke$arity$1 ? b.cljs$core$IFn$_invoke$arity$1(cljs.core._nth.cljs$core$IFn$_invoke$arity$2(e, h)) : b.call(null, cljs.core._nth.cljs$core$IFn$_invoke$arity$2(e, h))) && cljs.core.chunk_append(g, cljs.core._nth.cljs$core$IFn$_invoke$arity$2(e, h)), h += 1
          }else {
            break
          }
        }
        return cljs.core.chunk_cons(cljs.core.chunk(g), filter(b, cljs.core.chunk_rest(d)))
      }
      e = cljs.core.first(d);
      d = cljs.core.rest(d);
      return cljs.core.truth_(b.cljs$core$IFn$_invoke$arity$1 ? b.cljs$core$IFn$_invoke$arity$1(e) : b.call(null, e)) ? cljs.core.cons(e, filter(b, d)) : filter(b, d)
    }
    return null
  }, null)
};
cljs.core.remove = function(a, b) {
  return cljs.core.filter(cljs.core.complement(a), b)
};
cljs.core.tree_seq = function(a, b, c) {
  return function e(c) {
    return new cljs.core.LazySeq(null, !1, function() {
      return cljs.core.cons(c, cljs.core.truth_(a.cljs$core$IFn$_invoke$arity$1 ? a.cljs$core$IFn$_invoke$arity$1(c) : a.call(null, c)) ? cljs.core.mapcat.cljs$core$IFn$_invoke$arity$2(e, b.cljs$core$IFn$_invoke$arity$1 ? b.cljs$core$IFn$_invoke$arity$1(c) : b.call(null, c)) : null)
    }, null)
  }(c)
};
cljs.core.flatten = function(a) {
  return cljs.core.filter(function(a) {
    return!cljs.core.sequential_QMARK_(a)
  }, cljs.core.rest(cljs.core.tree_seq(cljs.core.sequential_QMARK_, cljs.core.seq, a)))
};
cljs.core.into = function(a, b) {
  var c;
  null != a ? (a ? (c = (c = a.cljs$lang$protocol_mask$partition1$ & 4) ? c : a.cljs$core$IEditableCollection$, c = c ? !0 : !1) : c = !1, c = c ? cljs.core.persistent_BANG_(cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(cljs.core._conj_BANG_, cljs.core.transient$(a), b)) : cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(cljs.core._conj, a, b)) : c = cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(cljs.core.conj, cljs.core.List.EMPTY, b);
  return c
};
cljs.core.mapv = function() {
  var a = null, b = function(a, b) {
    return cljs.core.persistent_BANG_(cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(function(b, c) {
      return cljs.core.conj_BANG_(b, a.cljs$core$IFn$_invoke$arity$1 ? a.cljs$core$IFn$_invoke$arity$1(c) : a.call(null, c))
    }, cljs.core.transient$(cljs.core.PersistentVector.EMPTY), b))
  }, c = function(a, b, c) {
    return cljs.core.into(cljs.core.PersistentVector.EMPTY, cljs.core.map.cljs$core$IFn$_invoke$arity$3(a, b, c))
  }, d = function(a, b, c, d) {
    return cljs.core.into(cljs.core.PersistentVector.EMPTY, cljs.core.map.cljs$core$IFn$_invoke$arity$4(a, b, c, d))
  }, e = function() {
    var a = function(a, b, c, d, e) {
      return cljs.core.into(cljs.core.PersistentVector.EMPTY, cljs.core.apply.cljs$core$IFn$_invoke$arity$variadic(cljs.core.map, a, b, c, d, cljs.core.array_seq([e], 0)))
    }, b = function(b, c, d, e, g) {
      var p = null;
      4 < arguments.length && (p = cljs.core.array_seq(Array.prototype.slice.call(arguments, 4), 0));
      return a.call(this, b, c, d, e, p)
    };
    b.cljs$lang$maxFixedArity = 4;
    b.cljs$lang$applyTo = function(b) {
      var c = cljs.core.first(b);
      b = cljs.core.next(b);
      var d = cljs.core.first(b);
      b = cljs.core.next(b);
      var e = cljs.core.first(b);
      b = cljs.core.next(b);
      var g = cljs.core.first(b);
      b = cljs.core.rest(b);
      return a(c, d, e, g, b)
    };
    b.cljs$core$IFn$_invoke$arity$variadic = a;
    return b
  }(), a = function(a, g, h, k, l) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, g);
      case 3:
        return c.call(this, a, g, h);
      case 4:
        return d.call(this, a, g, h, k);
      default:
        return e.cljs$core$IFn$_invoke$arity$variadic(a, g, h, k, cljs.core.array_seq(arguments, 4))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 4;
  a.cljs$lang$applyTo = e.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  a.cljs$core$IFn$_invoke$arity$4 = d;
  a.cljs$core$IFn$_invoke$arity$variadic = e.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.filterv = function(a, b) {
  return cljs.core.persistent_BANG_(cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(function(b, d) {
    return cljs.core.truth_(a.cljs$core$IFn$_invoke$arity$1 ? a.cljs$core$IFn$_invoke$arity$1(d) : a.call(null, d)) ? cljs.core.conj_BANG_(b, d) : b
  }, cljs.core.transient$(cljs.core.PersistentVector.EMPTY), b))
};
cljs.core.partition = function() {
  var a = null, b = function(b, c) {
    return a.cljs$core$IFn$_invoke$arity$3(b, b, c)
  }, c = function(b, c, d) {
    return new cljs.core.LazySeq(null, !1, function() {
      var h = cljs.core.seq(d);
      if(h) {
        var k = cljs.core.take(b, h);
        return b === cljs.core.count(k) ? cljs.core.cons(k, a.cljs$core$IFn$_invoke$arity$3(b, c, cljs.core.drop(c, h))) : null
      }
      return null
    }, null)
  }, d = function(b, c, d, h) {
    return new cljs.core.LazySeq(null, !1, function() {
      var k = cljs.core.seq(h);
      if(k) {
        var l = cljs.core.take(b, k);
        return b === cljs.core.count(l) ? cljs.core.cons(l, a.cljs$core$IFn$_invoke$arity$4(b, c, d, cljs.core.drop(c, k))) : cljs.core.list.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([cljs.core.take(b, cljs.core.concat.cljs$core$IFn$_invoke$arity$2(l, d))], 0))
      }
      return null
    }, null)
  }, a = function(a, f, g, h) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, f);
      case 3:
        return c.call(this, a, f, g);
      case 4:
        return d.call(this, a, f, g, h)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  a.cljs$core$IFn$_invoke$arity$4 = d;
  return a
}();
cljs.core.get_in = function() {
  var a = null, b = function(b, c) {
    return a.cljs$core$IFn$_invoke$arity$3(b, c, null)
  }, c = function(a, b, c) {
    var g = cljs.core.lookup_sentinel;
    for(b = cljs.core.seq(b);;) {
      if(b) {
        var h;
        if(h = a) {
          var k = void 0;
          k = (k = h.cljs$lang$protocol_mask$partition0$ & 256) ? k : h.cljs$core$ILookup$;
          h = k ? !0 : h.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.type_satisfies_(cljs.core.ILookup, h)
        }else {
          h = cljs.core.type_satisfies_(cljs.core.ILookup, h)
        }
        if(h) {
          a = cljs.core.get.cljs$core$IFn$_invoke$arity$3(a, cljs.core.first(b), g);
          if(g === a) {
            return c
          }
          b = cljs.core.next(b)
        }else {
          return c
        }
      }else {
        return a
      }
    }
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a
}();
cljs.core.assoc_in = function assoc_in(b, c, d) {
  var e = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(c, 0, null);
  c = cljs.core.nthnext(c, 1);
  return cljs.core.truth_(c) ? cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(b, e, assoc_in(cljs.core.get.cljs$core$IFn$_invoke$arity$2(b, e), c, d)) : cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(b, e, d)
};
cljs.core.update_in = function() {
  var a = null, b = function(b, c, d) {
    var e = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(c, 0, null);
    c = cljs.core.nthnext(c, 1);
    return cljs.core.truth_(c) ? cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(b, e, a.cljs$core$IFn$_invoke$arity$3(cljs.core.get.cljs$core$IFn$_invoke$arity$2(b, e), c, d)) : cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(b, e, d.cljs$core$IFn$_invoke$arity$1 ? d.cljs$core$IFn$_invoke$arity$1(cljs.core.get.cljs$core$IFn$_invoke$arity$2(b, e)) : d.call(null, cljs.core.get.cljs$core$IFn$_invoke$arity$2(b, e)))
  }, c = function(b, c, d, e) {
    var f = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(c, 0, null);
    c = cljs.core.nthnext(c, 1);
    return cljs.core.truth_(c) ? cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(b, f, a.cljs$core$IFn$_invoke$arity$4(cljs.core.get.cljs$core$IFn$_invoke$arity$2(b, f), c, d, e)) : cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(b, f, d.cljs$core$IFn$_invoke$arity$2 ? d.cljs$core$IFn$_invoke$arity$2(cljs.core.get.cljs$core$IFn$_invoke$arity$2(b, f), e) : d.call(null, cljs.core.get.cljs$core$IFn$_invoke$arity$2(b, f), e))
  }, d = function(b, c, d, e, f) {
    var n = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(c, 0, null);
    c = cljs.core.nthnext(c, 1);
    return cljs.core.truth_(c) ? cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(b, n, a.cljs$core$IFn$_invoke$arity$5(cljs.core.get.cljs$core$IFn$_invoke$arity$2(b, n), c, d, e, f)) : cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(b, n, d.cljs$core$IFn$_invoke$arity$3 ? d.cljs$core$IFn$_invoke$arity$3(cljs.core.get.cljs$core$IFn$_invoke$arity$2(b, n), e, f) : d.call(null, cljs.core.get.cljs$core$IFn$_invoke$arity$2(b, n), e, f))
  }, e = function(b, c, d, e, f, n) {
    var p = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(c, 0, null);
    c = cljs.core.nthnext(c, 1);
    return cljs.core.truth_(c) ? cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(b, p, a.cljs$core$IFn$_invoke$arity$6(cljs.core.get.cljs$core$IFn$_invoke$arity$2(b, p), c, d, e, f, n)) : cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(b, p, d.cljs$core$IFn$_invoke$arity$4 ? d.cljs$core$IFn$_invoke$arity$4(cljs.core.get.cljs$core$IFn$_invoke$arity$2(b, p), e, f, n) : d.call(null, cljs.core.get.cljs$core$IFn$_invoke$arity$2(b, p), e, f, n))
  }, f = function() {
    var b = function(b, c, d, e, f, g, h) {
      var s = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(c, 0, null);
      c = cljs.core.nthnext(c, 1);
      return cljs.core.truth_(c) ? cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(b, s, cljs.core.apply.cljs$core$IFn$_invoke$arity$variadic(a, cljs.core.get.cljs$core$IFn$_invoke$arity$2(b, s), c, d, e, cljs.core.array_seq([f, g, h], 0))) : cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(b, s, cljs.core.apply.cljs$core$IFn$_invoke$arity$variadic(d, cljs.core.get.cljs$core$IFn$_invoke$arity$2(b, s), e, f, g, cljs.core.array_seq([h], 0)))
    }, c = function(a, c, d, e, f, h, r) {
      var s = null;
      6 < arguments.length && (s = cljs.core.array_seq(Array.prototype.slice.call(arguments, 6), 0));
      return b.call(this, a, c, d, e, f, h, s)
    };
    c.cljs$lang$maxFixedArity = 6;
    c.cljs$lang$applyTo = function(a) {
      var c = cljs.core.first(a);
      a = cljs.core.next(a);
      var d = cljs.core.first(a);
      a = cljs.core.next(a);
      var e = cljs.core.first(a);
      a = cljs.core.next(a);
      var f = cljs.core.first(a);
      a = cljs.core.next(a);
      var h = cljs.core.first(a);
      a = cljs.core.next(a);
      var r = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(c, d, e, f, h, r, a)
    };
    c.cljs$core$IFn$_invoke$arity$variadic = b;
    return c
  }(), a = function(a, h, k, l, m, n, p) {
    switch(arguments.length) {
      case 3:
        return b.call(this, a, h, k);
      case 4:
        return c.call(this, a, h, k, l);
      case 5:
        return d.call(this, a, h, k, l, m);
      case 6:
        return e.call(this, a, h, k, l, m, n);
      default:
        return f.cljs$core$IFn$_invoke$arity$variadic(a, h, k, l, m, n, cljs.core.array_seq(arguments, 6))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 6;
  a.cljs$lang$applyTo = f.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$3 = b;
  a.cljs$core$IFn$_invoke$arity$4 = c;
  a.cljs$core$IFn$_invoke$arity$5 = d;
  a.cljs$core$IFn$_invoke$arity$6 = e;
  a.cljs$core$IFn$_invoke$arity$variadic = f.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.VectorNode = function(a, b) {
  this.edit = a;
  this.arr = b
};
cljs.core.VectorNode.cljs$lang$type = !0;
cljs.core.VectorNode.cljs$lang$ctorStr = "cljs.core/VectorNode";
cljs.core.VectorNode.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write(b, "cljs.core/VectorNode")
};
cljs.core.__GT_VectorNode = function(a, b) {
  return new cljs.core.VectorNode(a, b)
};
cljs.core.pv_fresh_node = function(a) {
  return new cljs.core.VectorNode(a, Array(32))
};
cljs.core.pv_aget = function(a, b) {
  return a.arr[b]
};
cljs.core.pv_aset = function(a, b, c) {
  return a.arr[b] = c
};
cljs.core.pv_clone_node = function(a) {
  return new cljs.core.VectorNode(a.edit, a.arr.slice())
};
cljs.core.tail_off = function(a) {
  a = a.cnt;
  return 32 > a ? 0 : a - 1 >>> 5 << 5
};
cljs.core.new_path = function(a, b, c) {
  for(;;) {
    if(0 === b) {
      return c
    }
    var d = cljs.core.pv_fresh_node(a);
    cljs.core.pv_aset(d, 0, c);
    c = d;
    b -= 5
  }
};
cljs.core.push_tail = function push_tail(b, c, d, e) {
  var f = cljs.core.pv_clone_node(d), g = b.cnt - 1 >>> c & 31;
  5 === c ? cljs.core.pv_aset(f, g, e) : (d = cljs.core.pv_aget(d, g), b = null != d ? push_tail(b, c - 5, d, e) : cljs.core.new_path(null, c - 5, e), cljs.core.pv_aset(f, g, b));
  return f
};
cljs.core.vector_index_out_of_bounds = function(a, b) {
  throw Error([cljs.core.str("No item "), cljs.core.str(a), cljs.core.str(" in vector of length "), cljs.core.str(b)].join(""));
};
cljs.core.array_for = function(a, b) {
  var c;
  c = (c = 0 <= b) ? b < a.cnt : c;
  if(c) {
    if(b >= cljs.core.tail_off(a)) {
      return a.tail
    }
    c = a.root;
    for(var d = a.shift;;) {
      if(0 < d) {
        c = cljs.core.pv_aget(c, b >>> d & 31), d -= 5
      }else {
        return c.arr
      }
    }
  }else {
    return cljs.core.vector_index_out_of_bounds(b, a.cnt)
  }
};
cljs.core.do_assoc = function do_assoc(b, c, d, e, f) {
  var g = cljs.core.pv_clone_node(d);
  if(0 === c) {
    cljs.core.pv_aset(g, e & 31, f)
  }else {
    var h = e >>> c & 31;
    cljs.core.pv_aset(g, h, do_assoc(b, c - 5, cljs.core.pv_aget(d, h), e, f))
  }
  return g
};
cljs.core.pop_tail = function pop_tail(b, c, d) {
  var e = b.cnt - 2 >>> c & 31;
  if(5 < c) {
    b = pop_tail(b, c - 5, cljs.core.pv_aget(d, e));
    c = null == b;
    if(c ? 0 === e : c) {
      return null
    }
    d = cljs.core.pv_clone_node(d);
    cljs.core.pv_aset(d, e, b);
    return d
  }
  if(0 === e) {
    return null
  }
  d = cljs.core.pv_clone_node(d);
  cljs.core.pv_aset(d, e, null);
  return d
};
cljs.core.PersistentVector = function(a, b, c, d, e, f) {
  this.meta = a;
  this.cnt = b;
  this.shift = c;
  this.root = d;
  this.tail = e;
  this.__hash = f;
  this.cljs$lang$protocol_mask$partition1$ = 4;
  this.cljs$lang$protocol_mask$partition0$ = 167668511
};
cljs.core.PersistentVector.cljs$lang$type = !0;
cljs.core.PersistentVector.cljs$lang$ctorStr = "cljs.core/PersistentVector";
cljs.core.PersistentVector.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write(b, "cljs.core/PersistentVector")
};
cljs.core.PersistentVector.prototype.cljs$core$IEditableCollection$_as_transient$arity$1 = function(a) {
  return new cljs.core.TransientVector(this.cnt, this.shift, cljs.core.tv_editable_root.cljs$core$IFn$_invoke$arity$1 ? cljs.core.tv_editable_root.cljs$core$IFn$_invoke$arity$1(this.root) : cljs.core.tv_editable_root.call(null, this.root), cljs.core.tv_editable_tail.cljs$core$IFn$_invoke$arity$1 ? cljs.core.tv_editable_tail.cljs$core$IFn$_invoke$arity$1(this.tail) : cljs.core.tv_editable_tail.call(null, this.tail))
};
cljs.core.PersistentVector.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  var b = this.__hash;
  return null != b ? b : this.__hash = a = cljs.core.hash_coll(a)
};
cljs.core.PersistentVector.prototype.cljs$core$ILookup$_lookup$arity$2 = function(a, b) {
  return a.cljs$core$IIndexed$_nth$arity$3(a, b, null)
};
cljs.core.PersistentVector.prototype.cljs$core$ILookup$_lookup$arity$3 = function(a, b, c) {
  return a.cljs$core$IIndexed$_nth$arity$3(a, b, c)
};
cljs.core.PersistentVector.prototype.cljs$core$IAssociative$_assoc$arity$3 = function(a, b, c) {
  var d;
  d = (d = 0 <= b) ? b < this.cnt : d;
  if(d) {
    return cljs.core.tail_off(a) <= b ? (a = this.tail.slice(), a[b & 31] = c, new cljs.core.PersistentVector(this.meta, this.cnt, this.shift, this.root, a, null)) : new cljs.core.PersistentVector(this.meta, this.cnt, this.shift, cljs.core.do_assoc(a, this.shift, this.root, b, c), this.tail, null)
  }
  if(b === this.cnt) {
    return a.cljs$core$ICollection$_conj$arity$2(a, c)
  }
  throw Error([cljs.core.str("Index "), cljs.core.str(b), cljs.core.str(" out of bounds  [0,"), cljs.core.str(this.cnt), cljs.core.str("]")].join(""));
};
cljs.core.PersistentVector.prototype.call = function() {
  var a = null;
  return a = function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return this.cljs$core$IIndexed$_nth$arity$2(this, c);
      case 3:
        return this.cljs$core$IIndexed$_nth$arity$3(this, c, d)
    }
    throw Error("Invalid arity: " + arguments.length);
  }
}();
cljs.core.PersistentVector.prototype.apply = function(a, b) {
  a = this;
  return a.call.apply(a, [a].concat(b.slice()))
};
cljs.core.PersistentVector.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = function(a, b, c) {
  c = [0, c];
  for(var d = 0;;) {
    if(d < this.cnt) {
      var e = cljs.core.array_for(a, d), f = e.length;
      a: {
        for(var g = 0, h = c[1];;) {
          if(g < f) {
            if(h = b.cljs$core$IFn$_invoke$arity$3 ? b.cljs$core$IFn$_invoke$arity$3(h, g + d, e[g]) : b.call(null, h, g + d, e[g]), cljs.core.reduced_QMARK_(h)) {
              e = h;
              break a
            }else {
              g += 1
            }
          }else {
            c[0] = f;
            e = c[1] = h;
            break a
          }
        }
        e = void 0
      }
      if(cljs.core.reduced_QMARK_(e)) {
        return cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(e) : cljs.core.deref.call(null, e)
      }
      d += c[0]
    }else {
      return c[1]
    }
  }
};
cljs.core.PersistentVector.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  if(32 > this.cnt - cljs.core.tail_off(a)) {
    var c = this.tail.slice();
    c.push(b);
    return new cljs.core.PersistentVector(this.meta, this.cnt + 1, this.shift, this.root, c, null)
  }
  var d = this.cnt >>> 5 > 1 << this.shift, c = d ? this.shift + 5 : this.shift;
  d ? (d = cljs.core.pv_fresh_node(null), cljs.core.pv_aset(d, 0, this.root), cljs.core.pv_aset(d, 1, cljs.core.new_path(null, this.shift, new cljs.core.VectorNode(null, this.tail)))) : d = cljs.core.push_tail(a, this.shift, this.root, new cljs.core.VectorNode(null, this.tail));
  return new cljs.core.PersistentVector(this.meta, this.cnt + 1, c, d, [b], null)
};
cljs.core.PersistentVector.prototype.cljs$core$IReversible$_rseq$arity$1 = function(a) {
  return 0 < this.cnt ? new cljs.core.RSeq(a, this.cnt - 1, null) : cljs.core.List.EMPTY
};
cljs.core.PersistentVector.prototype.cljs$core$IMapEntry$_key$arity$1 = function(a) {
  return a.cljs$core$IIndexed$_nth$arity$2(a, 0)
};
cljs.core.PersistentVector.prototype.cljs$core$IMapEntry$_val$arity$1 = function(a) {
  return a.cljs$core$IIndexed$_nth$arity$2(a, 1)
};
cljs.core.PersistentVector.prototype.toString = function() {
  return cljs.core.pr_str_STAR_(this)
};
cljs.core.PersistentVector.prototype.cljs$core$IReduce$_reduce$arity$2 = function(a, b) {
  return cljs.core.ci_reduce.cljs$core$IFn$_invoke$arity$2(a, b)
};
cljs.core.PersistentVector.prototype.cljs$core$IReduce$_reduce$arity$3 = function(a, b, c) {
  return cljs.core.ci_reduce.cljs$core$IFn$_invoke$arity$3(a, b, c)
};
cljs.core.PersistentVector.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return 0 === this.cnt ? null : 32 > this.cnt ? cljs.core.array_seq.cljs$core$IFn$_invoke$arity$1(this.tail) : cljs.core.chunked_seq.cljs$core$IFn$_invoke$arity$3 ? cljs.core.chunked_seq.cljs$core$IFn$_invoke$arity$3(a, 0, 0) : cljs.core.chunked_seq.call(null, a, 0, 0)
};
cljs.core.PersistentVector.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  return this.cnt
};
cljs.core.PersistentVector.prototype.cljs$core$IStack$_peek$arity$1 = function(a) {
  return 0 < this.cnt ? a.cljs$core$IIndexed$_nth$arity$2(a, this.cnt - 1) : null
};
cljs.core.PersistentVector.prototype.cljs$core$IStack$_pop$arity$1 = function(a) {
  if(0 === this.cnt) {
    throw Error("Can't pop empty vector");
  }
  if(1 === this.cnt) {
    return cljs.core._with_meta(cljs.core.PersistentVector.EMPTY, this.meta)
  }
  if(1 < this.cnt - cljs.core.tail_off(a)) {
    return new cljs.core.PersistentVector(this.meta, this.cnt - 1, this.shift, this.root, this.tail.slice(0, -1), null)
  }
  var b = cljs.core.array_for(a, this.cnt - 2);
  a = cljs.core.pop_tail(a, this.shift, this.root);
  a = null == a ? cljs.core.PersistentVector.EMPTY_NODE : a;
  var c = this.cnt - 1, d;
  d = (d = 5 < this.shift) ? null == cljs.core.pv_aget(a, 1) : d;
  return d ? new cljs.core.PersistentVector(this.meta, c, this.shift - 5, cljs.core.pv_aget(a, 0), b, null) : new cljs.core.PersistentVector(this.meta, c, this.shift, a, b, null)
};
cljs.core.PersistentVector.prototype.cljs$core$IVector$_assoc_n$arity$3 = function(a, b, c) {
  return a.cljs$core$IAssociative$_assoc$arity$3(a, b, c)
};
cljs.core.PersistentVector.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential(a, b)
};
cljs.core.PersistentVector.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.PersistentVector(b, this.cnt, this.shift, this.root, this.tail, this.__hash)
};
cljs.core.PersistentVector.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return this.meta
};
cljs.core.PersistentVector.prototype.cljs$core$IIndexed$_nth$arity$2 = function(a, b) {
  return cljs.core.array_for(a, b)[b & 31]
};
cljs.core.PersistentVector.prototype.cljs$core$IIndexed$_nth$arity$3 = function(a, b, c) {
  var d;
  d = (d = 0 <= b) ? b < this.cnt : d;
  return d ? a.cljs$core$IIndexed$_nth$arity$2(a, b) : c
};
cljs.core.PersistentVector.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return cljs.core.with_meta(cljs.core.PersistentVector.EMPTY, this.meta)
};
cljs.core.__GT_PersistentVector = function(a, b, c, d, e, f) {
  return new cljs.core.PersistentVector(a, b, c, d, e, f)
};
cljs.core.PersistentVector.EMPTY_NODE = new cljs.core.VectorNode(null, Array(32));
cljs.core.PersistentVector.EMPTY = new cljs.core.PersistentVector(null, 0, 5, cljs.core.PersistentVector.EMPTY_NODE, [], 0);
cljs.core.PersistentVector.fromArray = function(a, b) {
  var c = a.length, d = b ? a : a.slice();
  if(32 > c) {
    return new cljs.core.PersistentVector(null, c, 5, cljs.core.PersistentVector.EMPTY_NODE, d, null)
  }
  for(var e = d.slice(0, 32), f = new cljs.core.PersistentVector(null, 32, 5, cljs.core.PersistentVector.EMPTY_NODE, e, null), e = 32, g = cljs.core._as_transient(f);;) {
    if(e < c) {
      f = e + 1, g = cljs.core.conj_BANG_(g, d[e]), e = f
    }else {
      return cljs.core.persistent_BANG_(g)
    }
  }
};
cljs.core.vec = function(a) {
  return cljs.core._persistent_BANG_(cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(cljs.core._conj_BANG_, cljs.core._as_transient(cljs.core.PersistentVector.EMPTY), a))
};
cljs.core.vector = function() {
  var a = function(a) {
    return cljs.core.vec(a)
  }, b = function(b) {
    var d = null;
    0 < arguments.length && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d)
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a(b)
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b
}();
cljs.core.ChunkedSeq = function(a, b, c, d, e, f) {
  this.vec = a;
  this.node = b;
  this.i = c;
  this.off = d;
  this.meta = e;
  this.__hash = f;
  this.cljs$lang$protocol_mask$partition0$ = 32243948;
  this.cljs$lang$protocol_mask$partition1$ = 1536
};
cljs.core.ChunkedSeq.cljs$lang$type = !0;
cljs.core.ChunkedSeq.cljs$lang$ctorStr = "cljs.core/ChunkedSeq";
cljs.core.ChunkedSeq.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write(b, "cljs.core/ChunkedSeq")
};
cljs.core.ChunkedSeq.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  var b = this.__hash;
  return null != b ? b : this.__hash = a = cljs.core.hash_coll(a)
};
cljs.core.ChunkedSeq.prototype.cljs$core$INext$_next$arity$1 = function(a) {
  return this.off + 1 < this.node.length ? (a = cljs.core.chunked_seq.cljs$core$IFn$_invoke$arity$4 ? cljs.core.chunked_seq.cljs$core$IFn$_invoke$arity$4(this.vec, this.node, this.i, this.off + 1) : cljs.core.chunked_seq.call(null, this.vec, this.node, this.i, this.off + 1), null == a ? null : a) : a.cljs$core$IChunkedNext$_chunked_next$arity$1(a)
};
cljs.core.ChunkedSeq.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return cljs.core.cons(b, a)
};
cljs.core.ChunkedSeq.prototype.toString = function() {
  return cljs.core.pr_str_STAR_(this)
};
cljs.core.ChunkedSeq.prototype.cljs$core$IReduce$_reduce$arity$2 = function(a, b) {
  return cljs.core.ci_reduce.cljs$core$IFn$_invoke$arity$2(cljs.core.subvec.cljs$core$IFn$_invoke$arity$3 ? cljs.core.subvec.cljs$core$IFn$_invoke$arity$3(this.vec, this.i + this.off, cljs.core.count(this.vec)) : cljs.core.subvec.call(null, this.vec, this.i + this.off, cljs.core.count(this.vec)), b)
};
cljs.core.ChunkedSeq.prototype.cljs$core$IReduce$_reduce$arity$3 = function(a, b, c) {
  return cljs.core.ci_reduce.cljs$core$IFn$_invoke$arity$3(cljs.core.subvec.cljs$core$IFn$_invoke$arity$3 ? cljs.core.subvec.cljs$core$IFn$_invoke$arity$3(this.vec, this.i + this.off, cljs.core.count(this.vec)) : cljs.core.subvec.call(null, this.vec, this.i + this.off, cljs.core.count(this.vec)), b, c)
};
cljs.core.ChunkedSeq.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return a
};
cljs.core.ChunkedSeq.prototype.cljs$core$ISeq$_first$arity$1 = function(a) {
  return this.node[this.off]
};
cljs.core.ChunkedSeq.prototype.cljs$core$ISeq$_rest$arity$1 = function(a) {
  return this.off + 1 < this.node.length ? (a = cljs.core.chunked_seq.cljs$core$IFn$_invoke$arity$4 ? cljs.core.chunked_seq.cljs$core$IFn$_invoke$arity$4(this.vec, this.node, this.i, this.off + 1) : cljs.core.chunked_seq.call(null, this.vec, this.node, this.i, this.off + 1), null == a ? cljs.core.List.EMPTY : a) : a.cljs$core$IChunkedSeq$_chunked_rest$arity$1(a)
};
cljs.core.ChunkedSeq.prototype.cljs$core$IChunkedNext$_chunked_next$arity$1 = function(a) {
  a = this.node.length;
  a = this.i + a < cljs.core._count(this.vec) ? cljs.core.chunked_seq.cljs$core$IFn$_invoke$arity$3 ? cljs.core.chunked_seq.cljs$core$IFn$_invoke$arity$3(this.vec, this.i + a, 0) : cljs.core.chunked_seq.call(null, this.vec, this.i + a, 0) : null;
  return null == a ? null : a
};
cljs.core.ChunkedSeq.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential(a, b)
};
cljs.core.ChunkedSeq.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return cljs.core.chunked_seq.cljs$core$IFn$_invoke$arity$5 ? cljs.core.chunked_seq.cljs$core$IFn$_invoke$arity$5(this.vec, this.node, this.i, this.off, b) : cljs.core.chunked_seq.call(null, this.vec, this.node, this.i, this.off, b)
};
cljs.core.ChunkedSeq.prototype.cljs$core$IWithMeta$_meta$arity$1 = function(a) {
  return this.meta
};
cljs.core.ChunkedSeq.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return cljs.core.with_meta(cljs.core.PersistentVector.EMPTY, this.meta)
};
cljs.core.ChunkedSeq.prototype.cljs$core$IChunkedSeq$_chunked_first$arity$1 = function(a) {
  return cljs.core.array_chunk.cljs$core$IFn$_invoke$arity$2(this.node, this.off)
};
cljs.core.ChunkedSeq.prototype.cljs$core$IChunkedSeq$_chunked_rest$arity$1 = function(a) {
  a = this.node.length;
  a = this.i + a < cljs.core._count(this.vec) ? cljs.core.chunked_seq.cljs$core$IFn$_invoke$arity$3 ? cljs.core.chunked_seq.cljs$core$IFn$_invoke$arity$3(this.vec, this.i + a, 0) : cljs.core.chunked_seq.call(null, this.vec, this.i + a, 0) : null;
  return null == a ? cljs.core.List.EMPTY : a
};
cljs.core.__GT_ChunkedSeq = function(a, b, c, d, e, f) {
  return new cljs.core.ChunkedSeq(a, b, c, d, e, f)
};
cljs.core.chunked_seq = function() {
  var a = null, b = function(a, b, c) {
    return new cljs.core.ChunkedSeq(a, cljs.core.array_for(a, b), b, c, null, null)
  }, c = function(a, b, c, d) {
    return new cljs.core.ChunkedSeq(a, b, c, d, null, null)
  }, d = function(a, b, c, d, k) {
    return new cljs.core.ChunkedSeq(a, b, c, d, k, null)
  }, a = function(a, f, g, h, k) {
    switch(arguments.length) {
      case 3:
        return b.call(this, a, f, g);
      case 4:
        return c.call(this, a, f, g, h);
      case 5:
        return d.call(this, a, f, g, h, k)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$3 = b;
  a.cljs$core$IFn$_invoke$arity$4 = c;
  a.cljs$core$IFn$_invoke$arity$5 = d;
  return a
}();
cljs.core.Subvec = function(a, b, c, d, e) {
  this.meta = a;
  this.v = b;
  this.start = c;
  this.end = d;
  this.__hash = e;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 32400159
};
cljs.core.Subvec.cljs$lang$type = !0;
cljs.core.Subvec.cljs$lang$ctorStr = "cljs.core/Subvec";
cljs.core.Subvec.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write(b, "cljs.core/Subvec")
};
cljs.core.Subvec.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  var b = this.__hash;
  return null != b ? b : this.__hash = a = cljs.core.hash_coll(a)
};
cljs.core.Subvec.prototype.cljs$core$ILookup$_lookup$arity$2 = function(a, b) {
  return a.cljs$core$IIndexed$_nth$arity$3(a, b, null)
};
cljs.core.Subvec.prototype.cljs$core$ILookup$_lookup$arity$3 = function(a, b, c) {
  return a.cljs$core$IIndexed$_nth$arity$3(a, b, c)
};
cljs.core.Subvec.prototype.cljs$core$IAssociative$_assoc$arity$3 = function(a, b, c) {
  var d = this, e = d.start + b;
  return cljs.core.build_subvec.cljs$core$IFn$_invoke$arity$5 ? cljs.core.build_subvec.cljs$core$IFn$_invoke$arity$5(d.meta, cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(d.v, e, c), d.start, function() {
    var a = d.end, b = e + 1;
    return a > b ? a : b
  }(), null) : cljs.core.build_subvec.call(null, d.meta, cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(d.v, e, c), d.start, function() {
    var a = d.end, b = e + 1;
    return a > b ? a : b
  }(), null)
};
cljs.core.Subvec.prototype.call = function() {
  var a = null;
  return a = function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return this.cljs$core$IIndexed$_nth$arity$2(this, c);
      case 3:
        return this.cljs$core$IIndexed$_nth$arity$3(this, c, d)
    }
    throw Error("Invalid arity: " + arguments.length);
  }
}();
cljs.core.Subvec.prototype.apply = function(a, b) {
  a = this;
  return a.call.apply(a, [a].concat(b.slice()))
};
cljs.core.Subvec.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return cljs.core.build_subvec.cljs$core$IFn$_invoke$arity$5 ? cljs.core.build_subvec.cljs$core$IFn$_invoke$arity$5(this.meta, cljs.core._assoc_n(this.v, this.end, b), this.start, this.end + 1, null) : cljs.core.build_subvec.call(null, this.meta, cljs.core._assoc_n(this.v, this.end, b), this.start, this.end + 1, null)
};
cljs.core.Subvec.prototype.toString = function() {
  return cljs.core.pr_str_STAR_(this)
};
cljs.core.Subvec.prototype.cljs$core$IReduce$_reduce$arity$2 = function(a, b) {
  return cljs.core.ci_reduce.cljs$core$IFn$_invoke$arity$2(a, b)
};
cljs.core.Subvec.prototype.cljs$core$IReduce$_reduce$arity$3 = function(a, b, c) {
  return cljs.core.ci_reduce.cljs$core$IFn$_invoke$arity$3(a, b, c)
};
cljs.core.Subvec.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  var b = this;
  return function d(a) {
    return a === b.end ? null : cljs.core.cons(cljs.core._nth.cljs$core$IFn$_invoke$arity$2(b.v, a), new cljs.core.LazySeq(null, !1, function() {
      return d(a + 1)
    }, null))
  }(b.start)
};
cljs.core.Subvec.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  return this.end - this.start
};
cljs.core.Subvec.prototype.cljs$core$IStack$_peek$arity$1 = function(a) {
  return cljs.core._nth.cljs$core$IFn$_invoke$arity$2(this.v, this.end - 1)
};
cljs.core.Subvec.prototype.cljs$core$IStack$_pop$arity$1 = function(a) {
  if(this.start === this.end) {
    throw Error("Can't pop empty vector");
  }
  return cljs.core.build_subvec.cljs$core$IFn$_invoke$arity$5 ? cljs.core.build_subvec.cljs$core$IFn$_invoke$arity$5(this.meta, this.v, this.start, this.end - 1, null) : cljs.core.build_subvec.call(null, this.meta, this.v, this.start, this.end - 1, null)
};
cljs.core.Subvec.prototype.cljs$core$IVector$_assoc_n$arity$3 = function(a, b, c) {
  return a.cljs$core$IAssociative$_assoc$arity$3(a, b, c)
};
cljs.core.Subvec.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential(a, b)
};
cljs.core.Subvec.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return cljs.core.build_subvec.cljs$core$IFn$_invoke$arity$5 ? cljs.core.build_subvec.cljs$core$IFn$_invoke$arity$5(b, this.v, this.start, this.end, this.__hash) : cljs.core.build_subvec.call(null, b, this.v, this.start, this.end, this.__hash)
};
cljs.core.Subvec.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return this.meta
};
cljs.core.Subvec.prototype.cljs$core$IIndexed$_nth$arity$2 = function(a, b) {
  var c;
  c = (c = 0 > b) ? c : this.end <= this.start + b;
  return c ? cljs.core.vector_index_out_of_bounds(b, this.end - this.start) : cljs.core._nth.cljs$core$IFn$_invoke$arity$2(this.v, this.start + b)
};
cljs.core.Subvec.prototype.cljs$core$IIndexed$_nth$arity$3 = function(a, b, c) {
  a = (a = 0 > b) ? a : this.end <= this.start + b;
  return a ? c : cljs.core._nth.cljs$core$IFn$_invoke$arity$3(this.v, this.start + b, c)
};
cljs.core.Subvec.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return cljs.core.with_meta(cljs.core.PersistentVector.EMPTY, this.meta)
};
cljs.core.__GT_Subvec = function(a, b, c, d, e) {
  return new cljs.core.Subvec(a, b, c, d, e)
};
cljs.core.build_subvec = function(a, b, c, d, e) {
  for(;;) {
    if(b instanceof cljs.core.Subvec) {
      var f = b.start + c, g = b.start + d;
      b = b.v;
      c = f;
      d = g
    }else {
      var h = cljs.core.count(b);
      if(function() {
        var a = 0 > c;
        return a || (a = 0 > d) ? a : (a = c > h) ? a : d > h
      }()) {
        throw Error("Index out of bounds");
      }
      return new cljs.core.Subvec(a, b, c, d, e)
    }
  }
};
cljs.core.subvec = function() {
  var a = null, b = function(b, c) {
    return a.cljs$core$IFn$_invoke$arity$3(b, c, cljs.core.count(b))
  }, c = function(a, b, c) {
    return cljs.core.build_subvec(null, a, b, c, null)
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a
}();
cljs.core.tv_ensure_editable = function(a, b) {
  return a === b.edit ? b : new cljs.core.VectorNode(a, b.arr.slice())
};
cljs.core.tv_editable_root = function(a) {
  return new cljs.core.VectorNode({}, a.arr.slice())
};
cljs.core.tv_editable_tail = function(a) {
  var b = Array(32);
  cljs.core.array_copy(a, 0, b, 0, a.length);
  return b
};
cljs.core.tv_push_tail = function tv_push_tail(b, c, d, e) {
  var f = cljs.core.tv_ensure_editable(b.root.edit, d), g = b.cnt - 1 >>> c & 31;
  cljs.core.pv_aset(f, g, 5 === c ? e : function() {
    var d = cljs.core.pv_aget(f, g);
    return null != d ? tv_push_tail(b, c - 5, d, e) : cljs.core.new_path(b.root.edit, c - 5, e)
  }());
  return f
};
cljs.core.tv_pop_tail = function tv_pop_tail(b, c, d) {
  d = cljs.core.tv_ensure_editable(b.root.edit, d);
  var e = b.cnt - 2 >>> c & 31;
  if(5 < c) {
    b = tv_pop_tail(b, c - 5, cljs.core.pv_aget(d, e));
    c = null == b;
    if(c ? 0 === e : c) {
      return null
    }
    cljs.core.pv_aset(d, e, b);
    return d
  }
  if(0 === e) {
    return null
  }
  cljs.core.pv_aset(d, e, null);
  return d
};
cljs.core.editable_array_for = function(a, b) {
  var c;
  c = (c = 0 <= b) ? b < a.cnt : c;
  if(c) {
    if(b >= cljs.core.tail_off(a)) {
      return a.tail
    }
    for(var d = c = a.root, e = a.shift;;) {
      if(0 < e) {
        d = cljs.core.tv_ensure_editable(c.edit, cljs.core.pv_aget(d, b >>> e & 31)), e -= 5
      }else {
        return d.arr
      }
    }
  }else {
    throw Error([cljs.core.str("No item "), cljs.core.str(b), cljs.core.str(" in transient vector of length "), cljs.core.str(a.cnt)].join(""));
  }
};
cljs.core.TransientVector = function(a, b, c, d) {
  this.cnt = a;
  this.shift = b;
  this.root = c;
  this.tail = d;
  this.cljs$lang$protocol_mask$partition0$ = 275;
  this.cljs$lang$protocol_mask$partition1$ = 88
};
cljs.core.TransientVector.cljs$lang$type = !0;
cljs.core.TransientVector.cljs$lang$ctorStr = "cljs.core/TransientVector";
cljs.core.TransientVector.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write(b, "cljs.core/TransientVector")
};
cljs.core.TransientVector.prototype.call = function() {
  var a = null;
  return a = function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return this.cljs$core$ILookup$_lookup$arity$2(this, c);
      case 3:
        return this.cljs$core$ILookup$_lookup$arity$3(this, c, d)
    }
    throw Error("Invalid arity: " + arguments.length);
  }
}();
cljs.core.TransientVector.prototype.apply = function(a, b) {
  a = this;
  return a.call.apply(a, [a].concat(b.slice()))
};
cljs.core.TransientVector.prototype.cljs$core$ILookup$_lookup$arity$2 = function(a, b) {
  return a.cljs$core$IIndexed$_nth$arity$3(a, b, null)
};
cljs.core.TransientVector.prototype.cljs$core$ILookup$_lookup$arity$3 = function(a, b, c) {
  return a.cljs$core$IIndexed$_nth$arity$3(a, b, c)
};
cljs.core.TransientVector.prototype.cljs$core$IIndexed$_nth$arity$2 = function(a, b) {
  if(this.root.edit) {
    return cljs.core.array_for(a, b)[b & 31]
  }
  throw Error("nth after persistent!");
};
cljs.core.TransientVector.prototype.cljs$core$IIndexed$_nth$arity$3 = function(a, b, c) {
  var d;
  d = (d = 0 <= b) ? b < this.cnt : d;
  return d ? a.cljs$core$IIndexed$_nth$arity$2(a, b) : c
};
cljs.core.TransientVector.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  if(this.root.edit) {
    return this.cnt
  }
  throw Error("count after persistent!");
};
cljs.core.TransientVector.prototype.cljs$core$ITransientVector$_assoc_n_BANG_$arity$3 = function(a, b, c) {
  var d = this;
  if(d.root.edit) {
    if(function() {
      var a = 0 <= b;
      return a ? b < d.cnt : a
    }()) {
      if(cljs.core.tail_off(a) <= b) {
        d.tail[b & 31] = c
      }else {
        var e = function g(a, e) {
          var l = cljs.core.tv_ensure_editable(d.root.edit, e);
          if(0 === a) {
            cljs.core.pv_aset(l, b & 31, c)
          }else {
            var m = b >>> a & 31;
            cljs.core.pv_aset(l, m, g(a - 5, cljs.core.pv_aget(l, m)))
          }
          return l
        }.call(null, d.shift, d.root);
        d.root = e
      }
      return a
    }
    if(b === d.cnt) {
      return a.cljs$core$ITransientCollection$_conj_BANG_$arity$2(a, c)
    }
    throw Error([cljs.core.str("Index "), cljs.core.str(b), cljs.core.str(" out of bounds for TransientVector of length"), cljs.core.str(d.cnt)].join(""));
  }
  throw Error("assoc! after persistent!");
};
cljs.core.TransientVector.prototype.cljs$core$ITransientVector$_pop_BANG_$arity$1 = function(a) {
  var b = this;
  if(b.root.edit) {
    if(0 === b.cnt) {
      throw Error("Can't pop empty vector");
    }
    if(1 === b.cnt) {
      b.cnt = 0
    }else {
      if(0 < (b.cnt - 1 & 31)) {
        b.cnt -= 1
      }else {
        var c = cljs.core.editable_array_for(a, b.cnt - 2), d = function() {
          var c = cljs.core.tv_pop_tail(a, b.shift, b.root);
          return null != c ? c : new cljs.core.VectorNode(b.root.edit, Array(32))
        }();
        if(function() {
          var a = 5 < b.shift;
          return a ? null == cljs.core.pv_aget(d, 1) : a
        }()) {
          var e = cljs.core.tv_ensure_editable(b.root.edit, cljs.core.pv_aget(d, 0));
          b.root = e;
          b.shift -= 5
        }else {
          b.root = d
        }
        b.cnt -= 1;
        b.tail = c
      }
    }
    return a
  }
  throw Error("pop! after persistent!");
};
cljs.core.TransientVector.prototype.cljs$core$ITransientAssociative$_assoc_BANG_$arity$3 = function(a, b, c) {
  return a.cljs$core$ITransientVector$_assoc_n_BANG_$arity$3(a, b, c)
};
cljs.core.TransientVector.prototype.cljs$core$ITransientCollection$_conj_BANG_$arity$2 = function(a, b) {
  if(this.root.edit) {
    if(32 > this.cnt - cljs.core.tail_off(a)) {
      this.tail[this.cnt & 31] = b
    }else {
      var c = new cljs.core.VectorNode(this.root.edit, this.tail), d = Array(32);
      d[0] = b;
      this.tail = d;
      if(this.cnt >>> 5 > 1 << this.shift) {
        var d = Array(32), e = this.shift + 5;
        d[0] = this.root;
        d[1] = cljs.core.new_path(this.root.edit, this.shift, c);
        this.root = new cljs.core.VectorNode(this.root.edit, d);
        this.shift = e
      }else {
        this.root = cljs.core.tv_push_tail(a, this.shift, this.root, c)
      }
    }
    this.cnt += 1;
    return a
  }
  throw Error("conj! after persistent!");
};
cljs.core.TransientVector.prototype.cljs$core$ITransientCollection$_persistent_BANG_$arity$1 = function(a) {
  if(this.root.edit) {
    this.root.edit = null;
    a = this.cnt - cljs.core.tail_off(a);
    var b = Array(a);
    cljs.core.array_copy(this.tail, 0, b, 0, a);
    return new cljs.core.PersistentVector(null, this.cnt, this.shift, this.root, b, null)
  }
  throw Error("persistent! called twice");
};
cljs.core.__GT_TransientVector = function(a, b, c, d) {
  return new cljs.core.TransientVector(a, b, c, d)
};
cljs.core.PersistentQueueSeq = function(a, b, c, d) {
  this.meta = a;
  this.front = b;
  this.rear = c;
  this.__hash = d;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 31850572
};
cljs.core.PersistentQueueSeq.cljs$lang$type = !0;
cljs.core.PersistentQueueSeq.cljs$lang$ctorStr = "cljs.core/PersistentQueueSeq";
cljs.core.PersistentQueueSeq.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write(b, "cljs.core/PersistentQueueSeq")
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  var b = this.__hash;
  return null != b ? b : this.__hash = a = cljs.core.hash_coll(a)
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return cljs.core.cons(b, a)
};
cljs.core.PersistentQueueSeq.prototype.toString = function() {
  return cljs.core.pr_str_STAR_(this)
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return a
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$ISeq$_first$arity$1 = function(a) {
  return cljs.core.first(this.front)
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$ISeq$_rest$arity$1 = function(a) {
  var b = cljs.core.next(this.front);
  return b ? new cljs.core.PersistentQueueSeq(this.meta, b, this.rear, null) : null == this.rear ? a.cljs$core$IEmptyableCollection$_empty$arity$1(a) : new cljs.core.PersistentQueueSeq(this.meta, this.rear, null, null)
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential(a, b)
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.PersistentQueueSeq(b, this.front, this.rear, this.__hash)
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return this.meta
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return cljs.core.with_meta(cljs.core.List.EMPTY, this.meta)
};
cljs.core.__GT_PersistentQueueSeq = function(a, b, c, d) {
  return new cljs.core.PersistentQueueSeq(a, b, c, d)
};
cljs.core.PersistentQueue = function(a, b, c, d, e) {
  this.meta = a;
  this.count = b;
  this.front = c;
  this.rear = d;
  this.__hash = e;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 31858766
};
cljs.core.PersistentQueue.cljs$lang$type = !0;
cljs.core.PersistentQueue.cljs$lang$ctorStr = "cljs.core/PersistentQueue";
cljs.core.PersistentQueue.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write(b, "cljs.core/PersistentQueue")
};
cljs.core.PersistentQueue.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  var b = this.__hash;
  return null != b ? b : this.__hash = a = cljs.core.hash_coll(a)
};
cljs.core.PersistentQueue.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  var c = this;
  return cljs.core.truth_(c.front) ? new cljs.core.PersistentQueue(c.meta, c.count + 1, c.front, cljs.core.conj.cljs$core$IFn$_invoke$arity$2(function() {
    var a = c.rear;
    return cljs.core.truth_(a) ? a : cljs.core.PersistentVector.EMPTY
  }(), b), null) : new cljs.core.PersistentQueue(c.meta, c.count + 1, cljs.core.conj.cljs$core$IFn$_invoke$arity$2(c.front, b), cljs.core.PersistentVector.EMPTY, null)
};
cljs.core.PersistentQueue.prototype.toString = function() {
  return cljs.core.pr_str_STAR_(this)
};
cljs.core.PersistentQueue.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  var b = this, c = cljs.core.seq(b.rear);
  return cljs.core.truth_(function() {
    var a = b.front;
    return cljs.core.truth_(a) ? a : c
  }()) ? new cljs.core.PersistentQueueSeq(null, b.front, cljs.core.seq(c), null) : null
};
cljs.core.PersistentQueue.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  return this.count
};
cljs.core.PersistentQueue.prototype.cljs$core$IStack$_peek$arity$1 = function(a) {
  return cljs.core.first(this.front)
};
cljs.core.PersistentQueue.prototype.cljs$core$IStack$_pop$arity$1 = function(a) {
  return cljs.core.truth_(this.front) ? (a = cljs.core.next(this.front)) ? new cljs.core.PersistentQueue(this.meta, this.count - 1, a, this.rear, null) : new cljs.core.PersistentQueue(this.meta, this.count - 1, cljs.core.seq(this.rear), cljs.core.PersistentVector.EMPTY, null) : a
};
cljs.core.PersistentQueue.prototype.cljs$core$ISeq$_first$arity$1 = function(a) {
  return cljs.core.first(this.front)
};
cljs.core.PersistentQueue.prototype.cljs$core$ISeq$_rest$arity$1 = function(a) {
  return cljs.core.rest(cljs.core.seq(a))
};
cljs.core.PersistentQueue.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential(a, b)
};
cljs.core.PersistentQueue.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.PersistentQueue(b, this.count, this.front, this.rear, this.__hash)
};
cljs.core.PersistentQueue.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return this.meta
};
cljs.core.PersistentQueue.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return cljs.core.PersistentQueue.EMPTY
};
cljs.core.__GT_PersistentQueue = function(a, b, c, d, e) {
  return new cljs.core.PersistentQueue(a, b, c, d, e)
};
cljs.core.PersistentQueue.EMPTY = new cljs.core.PersistentQueue(null, 0, null, cljs.core.PersistentVector.EMPTY, 0);
cljs.core.NeverEquiv = function() {
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 2097152
};
cljs.core.NeverEquiv.cljs$lang$type = !0;
cljs.core.NeverEquiv.cljs$lang$ctorStr = "cljs.core/NeverEquiv";
cljs.core.NeverEquiv.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write(b, "cljs.core/NeverEquiv")
};
cljs.core.NeverEquiv.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return!1
};
cljs.core.__GT_NeverEquiv = function() {
  return new cljs.core.NeverEquiv
};
cljs.core.never_equiv = new cljs.core.NeverEquiv;
cljs.core.equiv_map = function(a, b) {
  return cljs.core.boolean$(cljs.core.map_QMARK_(b) ? cljs.core.count(a) === cljs.core.count(b) ? cljs.core.every_QMARK_(cljs.core.identity, cljs.core.map.cljs$core$IFn$_invoke$arity$2(function(a) {
    return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(cljs.core.get.cljs$core$IFn$_invoke$arity$3(b, cljs.core.first(a), cljs.core.never_equiv), cljs.core.second(a))
  }, a)) : null : null)
};
cljs.core.scan_array = function(a, b, c) {
  for(var d = c.length, e = 0;;) {
    if(e < d) {
      if(b === c[e]) {
        return e
      }
      e += a
    }else {
      return null
    }
  }
};
cljs.core.obj_map_compare_keys = function(a, b) {
  var c = cljs.core.hash.cljs$core$IFn$_invoke$arity$1(a), d = cljs.core.hash.cljs$core$IFn$_invoke$arity$1(b);
  return c < d ? -1 : c > d ? 1 : 0
};
cljs.core.obj_map__GT_hash_map = function(a, b, c) {
  var d = a.keys, e = d.length, f = a.strobj;
  a = cljs.core.meta(a);
  for(var g = 0, h = cljs.core.transient$(cljs.core.PersistentHashMap.EMPTY);;) {
    if(g < e) {
      var k = d[g], g = g + 1, h = cljs.core.assoc_BANG_(h, k, f[k])
    }else {
      return cljs.core.with_meta(cljs.core.persistent_BANG_(cljs.core.assoc_BANG_(h, b, c)), a)
    }
  }
};
cljs.core.obj_clone = function(a, b) {
  for(var c = {}, d = b.length, e = 0;;) {
    if(e < d) {
      var f = b[e];
      c[f] = a[f];
      e += 1
    }else {
      break
    }
  }
  return c
};
cljs.core.ObjMap = function(a, b, c, d, e) {
  this.meta = a;
  this.keys = b;
  this.strobj = c;
  this.update_count = d;
  this.__hash = e;
  this.cljs$lang$protocol_mask$partition1$ = 4;
  this.cljs$lang$protocol_mask$partition0$ = 16123663
};
cljs.core.ObjMap.cljs$lang$type = !0;
cljs.core.ObjMap.cljs$lang$ctorStr = "cljs.core/ObjMap";
cljs.core.ObjMap.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write(b, "cljs.core/ObjMap")
};
cljs.core.ObjMap.prototype.cljs$core$IEditableCollection$_as_transient$arity$1 = function(a) {
  return cljs.core.transient$(cljs.core.into(cljs.core.hash_map.cljs$core$IFn$_invoke$arity$0 ? cljs.core.hash_map.cljs$core$IFn$_invoke$arity$0() : cljs.core.hash_map.call(null), a))
};
cljs.core.ObjMap.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  var b = this.__hash;
  return null != b ? b : this.__hash = a = cljs.core.hash_imap(a)
};
cljs.core.ObjMap.prototype.cljs$core$ILookup$_lookup$arity$2 = function(a, b) {
  return a.cljs$core$ILookup$_lookup$arity$3(a, b, null)
};
cljs.core.ObjMap.prototype.cljs$core$ILookup$_lookup$arity$3 = function(a, b, c) {
  a = (a = goog.isString(b)) ? null != cljs.core.scan_array(1, b, this.keys) : a;
  return a ? this.strobj[b] : c
};
cljs.core.ObjMap.prototype.cljs$core$IAssociative$_assoc$arity$3 = function(a, b, c) {
  if(goog.isString(b)) {
    var d;
    d = (d = this.update_count > cljs.core.ObjMap.HASHMAP_THRESHOLD) ? d : this.keys.length >= cljs.core.ObjMap.HASHMAP_THRESHOLD;
    if(d) {
      return cljs.core.obj_map__GT_hash_map(a, b, c)
    }
    if(null != cljs.core.scan_array(1, b, this.keys)) {
      return a = cljs.core.obj_clone(this.strobj, this.keys), a[b] = c, new cljs.core.ObjMap(this.meta, this.keys, a, this.update_count + 1, null)
    }
    a = cljs.core.obj_clone(this.strobj, this.keys);
    d = this.keys.slice();
    a[b] = c;
    d.push(b);
    return new cljs.core.ObjMap(this.meta, d, a, this.update_count + 1, null)
  }
  return cljs.core.obj_map__GT_hash_map(a, b, c)
};
cljs.core.ObjMap.prototype.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 = function(a, b) {
  var c;
  c = (c = goog.isString(b)) ? null != cljs.core.scan_array(1, b, this.keys) : c;
  return c ? !0 : !1
};
cljs.core.ObjMap.prototype.call = function() {
  var a = null;
  return a = function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return this.cljs$core$ILookup$_lookup$arity$2(this, c);
      case 3:
        return this.cljs$core$ILookup$_lookup$arity$3(this, c, d)
    }
    throw Error("Invalid arity: " + arguments.length);
  }
}();
cljs.core.ObjMap.prototype.apply = function(a, b) {
  a = this;
  return a.call.apply(a, [a].concat(b.slice()))
};
cljs.core.ObjMap.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = function(a, b, c) {
  for(a = this.keys.sort(cljs.core.obj_map_compare_keys);;) {
    if(cljs.core.seq(a)) {
      var d = cljs.core.first(a);
      c = b.cljs$core$IFn$_invoke$arity$3 ? b.cljs$core$IFn$_invoke$arity$3(c, d, this.strobj[d]) : b.call(null, c, d, this.strobj[d]);
      if(cljs.core.reduced_QMARK_(c)) {
        return cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(c) : cljs.core.deref.call(null, c)
      }
      a = cljs.core.rest(a)
    }else {
      return c
    }
  }
};
cljs.core.ObjMap.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return cljs.core.vector_QMARK_(b) ? a.cljs$core$IAssociative$_assoc$arity$3(a, cljs.core._nth.cljs$core$IFn$_invoke$arity$2(b, 0), cljs.core._nth.cljs$core$IFn$_invoke$arity$2(b, 1)) : cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(cljs.core._conj, a, b)
};
cljs.core.ObjMap.prototype.toString = function() {
  return cljs.core.pr_str_STAR_(this)
};
cljs.core.ObjMap.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  var b = this;
  return 0 < b.keys.length ? cljs.core.map.cljs$core$IFn$_invoke$arity$2(function(a) {
    return cljs.core.vector.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([a, b.strobj[a]], 0))
  }, b.keys.sort(cljs.core.obj_map_compare_keys)) : null
};
cljs.core.ObjMap.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  return this.keys.length
};
cljs.core.ObjMap.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_map(a, b)
};
cljs.core.ObjMap.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.ObjMap(b, this.keys, this.strobj, this.update_count, this.__hash)
};
cljs.core.ObjMap.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return this.meta
};
cljs.core.ObjMap.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return cljs.core.with_meta(cljs.core.ObjMap.EMPTY, this.meta)
};
cljs.core.ObjMap.prototype.cljs$core$IMap$_dissoc$arity$2 = function(a, b) {
  var c;
  c = (c = goog.isString(b)) ? null != cljs.core.scan_array(1, b, this.keys) : c;
  if(c) {
    c = this.keys.slice();
    var d = cljs.core.obj_clone(this.strobj, this.keys);
    c.splice(cljs.core.scan_array(1, b, c), 1);
    delete d[b];
    return new cljs.core.ObjMap(this.meta, c, d, this.update_count + 1, null)
  }
  return a
};
cljs.core.__GT_ObjMap = function(a, b, c, d, e) {
  return new cljs.core.ObjMap(a, b, c, d, e)
};
cljs.core.ObjMap.EMPTY = new cljs.core.ObjMap(null, [], {}, 0, 0);
cljs.core.ObjMap.HASHMAP_THRESHOLD = 8;
cljs.core.ObjMap.fromObject = function(a, b) {
  return new cljs.core.ObjMap(null, a, b, 0, null)
};
cljs.core.array_map_index_of_nil_QMARK_ = function(a, b, c) {
  b = a.length;
  for(c = 0;;) {
    if(b <= c) {
      return-1
    }
    if(null == a[c]) {
      return c
    }
    c += 2
  }
};
cljs.core.array_map_index_of_symbol_QMARK_ = function(a, b, c) {
  b = a.length;
  c = c.str;
  for(var d = 0;;) {
    if(b <= d) {
      return-1
    }
    var e;
    e = a[d];
    var f = e instanceof cljs.core.Symbol;
    e = f ? c === e.str : f;
    if(e) {
      return d
    }
    d += 2
  }
};
cljs.core.array_map_index_of_identical_QMARK_ = function(a, b, c) {
  b = a.length;
  for(var d = 0;;) {
    if(b <= d) {
      return-1
    }
    if(c === a[d]) {
      return d
    }
    d += 2
  }
};
cljs.core.array_map_index_of_equiv_QMARK_ = function(a, b, c) {
  b = a.length;
  for(var d = 0;;) {
    if(b <= d) {
      return-1
    }
    if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(c, a[d])) {
      return d
    }
    d += 2
  }
};
cljs.core.array_map_index_of = function(a, b) {
  var c = a.arr;
  var d = goog.isString(b);
  return(d ? d : "number" === typeof b) ? cljs.core.array_map_index_of_identical_QMARK_(c, a, b) : b instanceof cljs.core.Symbol ? cljs.core.array_map_index_of_symbol_QMARK_(c, a, b) : null == b ? cljs.core.array_map_index_of_nil_QMARK_(c, a, b) : cljs.core.array_map_index_of_equiv_QMARK_(c, a, b)
};
cljs.core.array_map_extend_kv = function(a, b, c) {
  a = a.arr;
  for(var d = a.length, e = Array(d + 2), f = 0;;) {
    if(f < d) {
      e[f] = a[f], f += 1
    }else {
      break
    }
  }
  e[d] = b;
  e[d + 1] = c;
  return e
};
cljs.core.PersistentArrayMapSeq = function(a, b, c) {
  this.arr = a;
  this.i = b;
  this._meta = c;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 31850702
};
cljs.core.PersistentArrayMapSeq.cljs$lang$type = !0;
cljs.core.PersistentArrayMapSeq.cljs$lang$ctorStr = "cljs.core/PersistentArrayMapSeq";
cljs.core.PersistentArrayMapSeq.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write(b, "cljs.core/PersistentArrayMapSeq")
};
cljs.core.PersistentArrayMapSeq.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  return cljs.core.hash_coll(a)
};
cljs.core.PersistentArrayMapSeq.prototype.cljs$core$INext$_next$arity$1 = function(a) {
  return this.i < this.arr.length - 2 ? new cljs.core.PersistentArrayMapSeq(this.arr, this.i + 2, this._meta) : null
};
cljs.core.PersistentArrayMapSeq.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return cljs.core.cons(b, a)
};
cljs.core.PersistentArrayMapSeq.prototype.toString = function() {
  return cljs.core.pr_str_STAR_(this)
};
cljs.core.PersistentArrayMapSeq.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return a
};
cljs.core.PersistentArrayMapSeq.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  return(this.arr.length - this.i) / 2
};
cljs.core.PersistentArrayMapSeq.prototype.cljs$core$ISeq$_first$arity$1 = function(a) {
  return cljs.core.PersistentVector.fromArray([this.arr[this.i], this.arr[this.i + 1]], !0)
};
cljs.core.PersistentArrayMapSeq.prototype.cljs$core$ISeq$_rest$arity$1 = function(a) {
  return this.i < this.arr.length - 2 ? new cljs.core.PersistentArrayMapSeq(this.arr, this.i + 2, this._meta) : cljs.core.List.EMPTY
};
cljs.core.PersistentArrayMapSeq.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential(a, b)
};
cljs.core.PersistentArrayMapSeq.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.PersistentArrayMapSeq(this.arr, this.i, b)
};
cljs.core.PersistentArrayMapSeq.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return this._meta
};
cljs.core.PersistentArrayMapSeq.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return cljs.core.with_meta(cljs.core.List.EMPTY, this._meta)
};
cljs.core.__GT_PersistentArrayMapSeq = function(a, b, c) {
  return new cljs.core.PersistentArrayMapSeq(a, b, c)
};
cljs.core.persistent_array_map_seq = function(a, b, c) {
  return b <= a.length - 2 ? new cljs.core.PersistentArrayMapSeq(a, b, c) : null
};
cljs.core.PersistentArrayMap = function(a, b, c, d) {
  this.meta = a;
  this.cnt = b;
  this.arr = c;
  this.__hash = d;
  this.cljs$lang$protocol_mask$partition1$ = 4;
  this.cljs$lang$protocol_mask$partition0$ = 16123663
};
cljs.core.PersistentArrayMap.cljs$lang$type = !0;
cljs.core.PersistentArrayMap.cljs$lang$ctorStr = "cljs.core/PersistentArrayMap";
cljs.core.PersistentArrayMap.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write(b, "cljs.core/PersistentArrayMap")
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IEditableCollection$_as_transient$arity$1 = function(a) {
  return new cljs.core.TransientArrayMap({}, this.arr.length, this.arr.slice())
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  var b = this.__hash;
  return null != b ? b : this.__hash = a = cljs.core.hash_imap(a)
};
cljs.core.PersistentArrayMap.prototype.cljs$core$ILookup$_lookup$arity$2 = function(a, b) {
  return a.cljs$core$ILookup$_lookup$arity$3(a, b, null)
};
cljs.core.PersistentArrayMap.prototype.cljs$core$ILookup$_lookup$arity$3 = function(a, b, c) {
  a = cljs.core.array_map_index_of(a, b);
  return-1 === a ? c : this.arr[a + 1]
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IAssociative$_assoc$arity$3 = function(a, b, c) {
  var d = cljs.core.array_map_index_of(a, b);
  if(-1 === d) {
    return this.cnt < cljs.core.PersistentArrayMap.HASHMAP_THRESHOLD ? (c = cljs.core.array_map_extend_kv(a, b, c), new cljs.core.PersistentArrayMap(this.meta, this.cnt + 1, c, null)) : cljs.core._with_meta(cljs.core._assoc(cljs.core.into(cljs.core.PersistentHashMap.EMPTY, a), b, c), this.meta)
  }
  if(c === this.arr[d + 1]) {
    return a
  }
  a = this.arr.slice();
  a[d + 1] = c;
  return new cljs.core.PersistentArrayMap(this.meta, this.cnt, a, null)
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 = function(a, b) {
  return-1 !== cljs.core.array_map_index_of(a, b)
};
cljs.core.PersistentArrayMap.prototype.call = function() {
  var a = null;
  return a = function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return this.cljs$core$ILookup$_lookup$arity$2(this, c);
      case 3:
        return this.cljs$core$ILookup$_lookup$arity$3(this, c, d)
    }
    throw Error("Invalid arity: " + arguments.length);
  }
}();
cljs.core.PersistentArrayMap.prototype.apply = function(a, b) {
  a = this;
  return a.call.apply(a, [a].concat(b.slice()))
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = function(a, b, c) {
  a = this.arr.length;
  for(var d = 0;;) {
    if(d < a) {
      c = b.cljs$core$IFn$_invoke$arity$3 ? b.cljs$core$IFn$_invoke$arity$3(c, this.arr[d], this.arr[d + 1]) : b.call(null, c, this.arr[d], this.arr[d + 1]);
      if(cljs.core.reduced_QMARK_(c)) {
        return cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(c) : cljs.core.deref.call(null, c)
      }
      d += 2
    }else {
      return c
    }
  }
};
cljs.core.PersistentArrayMap.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return cljs.core.vector_QMARK_(b) ? a.cljs$core$IAssociative$_assoc$arity$3(a, cljs.core._nth.cljs$core$IFn$_invoke$arity$2(b, 0), cljs.core._nth.cljs$core$IFn$_invoke$arity$2(b, 1)) : cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(cljs.core._conj, a, b)
};
cljs.core.PersistentArrayMap.prototype.toString = function() {
  return cljs.core.pr_str_STAR_(this)
};
cljs.core.PersistentArrayMap.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return cljs.core.persistent_array_map_seq(this.arr, 0, null)
};
cljs.core.PersistentArrayMap.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  return this.cnt
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_map(a, b)
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.PersistentArrayMap(b, this.cnt, this.arr, this.__hash)
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return this.meta
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return cljs.core._with_meta(cljs.core.PersistentArrayMap.EMPTY, this.meta)
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IMap$_dissoc$arity$2 = function(a, b) {
  if(0 <= cljs.core.array_map_index_of(a, b)) {
    var c = this.arr.length, d = c - 2;
    if(0 === d) {
      return a.cljs$core$IEmptyableCollection$_empty$arity$1(a)
    }
    for(var d = Array(d), e = 0, f = 0;;) {
      if(e >= c) {
        return new cljs.core.PersistentArrayMap(this.meta, this.cnt - 1, d, null)
      }
      cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(b, this.arr[e]) || (d[f] = this.arr[e], d[f + 1] = this.arr[e + 1], f += 2);
      e += 2
    }
  }else {
    return a
  }
};
cljs.core.__GT_PersistentArrayMap = function(a, b, c, d) {
  return new cljs.core.PersistentArrayMap(a, b, c, d)
};
cljs.core.PersistentArrayMap.EMPTY = new cljs.core.PersistentArrayMap(null, 0, [], null);
cljs.core.PersistentArrayMap.HASHMAP_THRESHOLD = 8;
cljs.core.PersistentArrayMap.fromArray = function(a, b) {
  var c = b ? a : a.slice();
  return new cljs.core.PersistentArrayMap(null, c.length / 2, c, null)
};
cljs.core.TransientArrayMap = function(a, b, c) {
  this.editable_QMARK_ = a;
  this.len = b;
  this.arr = c;
  this.cljs$lang$protocol_mask$partition1$ = 56;
  this.cljs$lang$protocol_mask$partition0$ = 258
};
cljs.core.TransientArrayMap.cljs$lang$type = !0;
cljs.core.TransientArrayMap.cljs$lang$ctorStr = "cljs.core/TransientArrayMap";
cljs.core.TransientArrayMap.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write(b, "cljs.core/TransientArrayMap")
};
cljs.core.TransientArrayMap.prototype.cljs$core$ITransientMap$_dissoc_BANG_$arity$2 = function(a, b) {
  if(cljs.core.truth_(this.editable_QMARK_)) {
    var c = cljs.core.array_map_index_of(a, b);
    0 <= c && (this.arr[c] = this.arr[this.len - 2], this.arr[c + 1] = this.arr[this.len - 1], c = this.arr, c.pop(), c.pop(), this.len -= 2);
    return a
  }
  throw Error("dissoc! after persistent!");
};
cljs.core.TransientArrayMap.prototype.cljs$core$ITransientAssociative$_assoc_BANG_$arity$3 = function(a, b, c) {
  if(cljs.core.truth_(this.editable_QMARK_)) {
    var d = cljs.core.array_map_index_of(a, b);
    if(-1 === d) {
      return this.len + 2 <= 2 * cljs.core.PersistentArrayMap.HASHMAP_THRESHOLD ? (this.len += 2, this.arr.push(b), this.arr.push(c), a) : cljs.core.assoc_BANG_(cljs.core.array__GT_transient_hash_map.cljs$core$IFn$_invoke$arity$2 ? cljs.core.array__GT_transient_hash_map.cljs$core$IFn$_invoke$arity$2(this.len, this.arr) : cljs.core.array__GT_transient_hash_map.call(null, this.len, this.arr), b, c)
    }
    c !== this.arr[d + 1] && (this.arr[d + 1] = c);
    return a
  }
  throw Error("assoc! after persistent!");
};
cljs.core.TransientArrayMap.prototype.cljs$core$ITransientCollection$_conj_BANG_$arity$2 = function(a, b) {
  if(cljs.core.truth_(this.editable_QMARK_)) {
    var c;
    b ? (c = (c = b.cljs$lang$protocol_mask$partition0$ & 2048) ? c : b.cljs$core$IMapEntry$, c = c ? !0 : b.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.type_satisfies_(cljs.core.IMapEntry, b)) : c = cljs.core.type_satisfies_(cljs.core.IMapEntry, b);
    if(c) {
      return a.cljs$core$ITransientAssociative$_assoc_BANG_$arity$3(a, cljs.core.key.cljs$core$IFn$_invoke$arity$1 ? cljs.core.key.cljs$core$IFn$_invoke$arity$1(b) : cljs.core.key.call(null, b), cljs.core.val.cljs$core$IFn$_invoke$arity$1 ? cljs.core.val.cljs$core$IFn$_invoke$arity$1(b) : cljs.core.val.call(null, b))
    }
    c = cljs.core.seq(b);
    for(var d = a;;) {
      var e = cljs.core.first(c);
      if(cljs.core.truth_(e)) {
        c = cljs.core.next(c), d = d.cljs$core$ITransientAssociative$_assoc_BANG_$arity$3(d, cljs.core.key.cljs$core$IFn$_invoke$arity$1 ? cljs.core.key.cljs$core$IFn$_invoke$arity$1(e) : cljs.core.key.call(null, e), cljs.core.val.cljs$core$IFn$_invoke$arity$1 ? cljs.core.val.cljs$core$IFn$_invoke$arity$1(e) : cljs.core.val.call(null, e))
      }else {
        return d
      }
    }
  }else {
    throw Error("conj! after persistent!");
  }
};
cljs.core.TransientArrayMap.prototype.cljs$core$ITransientCollection$_persistent_BANG_$arity$1 = function(a) {
  if(cljs.core.truth_(this.editable_QMARK_)) {
    return this.editable_QMARK_ = !1, new cljs.core.PersistentArrayMap(null, cljs.core.quot(this.len, 2), this.arr, null)
  }
  throw Error("persistent! called twice");
};
cljs.core.TransientArrayMap.prototype.cljs$core$ILookup$_lookup$arity$2 = function(a, b) {
  return a.cljs$core$ILookup$_lookup$arity$3(a, b, null)
};
cljs.core.TransientArrayMap.prototype.cljs$core$ILookup$_lookup$arity$3 = function(a, b, c) {
  if(cljs.core.truth_(this.editable_QMARK_)) {
    return a = cljs.core.array_map_index_of(a, b), -1 === a ? c : this.arr[a + 1]
  }
  throw Error("lookup after persistent!");
};
cljs.core.TransientArrayMap.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  if(cljs.core.truth_(this.editable_QMARK_)) {
    return cljs.core.quot(this.len, 2)
  }
  throw Error("count after persistent!");
};
cljs.core.__GT_TransientArrayMap = function(a, b, c) {
  return new cljs.core.TransientArrayMap(a, b, c)
};
cljs.core.array__GT_transient_hash_map = function(a, b) {
  for(var c = cljs.core.transient$(cljs.core.PersistentHashMap.EMPTY), d = 0;;) {
    if(d < a) {
      c = cljs.core.assoc_BANG_(c, b[d], b[d + 1]), d += 2
    }else {
      return c
    }
  }
};
cljs.core.Box = function(a) {
  this.val = a
};
cljs.core.Box.cljs$lang$type = !0;
cljs.core.Box.cljs$lang$ctorStr = "cljs.core/Box";
cljs.core.Box.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write(b, "cljs.core/Box")
};
cljs.core.__GT_Box = function(a) {
  return new cljs.core.Box(a)
};
cljs.core.key_test = function(a, b) {
  return goog.isString(a) ? a === b : cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(a, b)
};
cljs.core.mask = function(a, b) {
  return a >>> b & 31
};
cljs.core.clone_and_set = function() {
  var a = null, b = function(a, b, c) {
    a = a.slice();
    a[b] = c;
    return a
  }, c = function(a, b, c, g, h) {
    a = a.slice();
    a[b] = c;
    a[g] = h;
    return a
  }, a = function(a, e, f, g, h) {
    switch(arguments.length) {
      case 3:
        return b.call(this, a, e, f);
      case 5:
        return c.call(this, a, e, f, g, h)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$3 = b;
  a.cljs$core$IFn$_invoke$arity$5 = c;
  return a
}();
cljs.core.remove_pair = function(a, b) {
  var c = Array(a.length - 2);
  cljs.core.array_copy(a, 0, c, 0, 2 * b);
  cljs.core.array_copy(a, 2 * (b + 1), c, 2 * b, c.length - 2 * b);
  return c
};
cljs.core.bitmap_indexed_node_index = function(a, b) {
  return cljs.core.bit_count(a & b - 1)
};
cljs.core.bitpos = function(a, b) {
  return 1 << (a >>> b & 31)
};
cljs.core.edit_and_set = function() {
  var a = null, b = function(a, b, c, g) {
    a = a.ensure_editable(b);
    a.arr[c] = g;
    return a
  }, c = function(a, b, c, g, h, k) {
    a = a.ensure_editable(b);
    a.arr[c] = g;
    a.arr[h] = k;
    return a
  }, a = function(a, e, f, g, h, k) {
    switch(arguments.length) {
      case 4:
        return b.call(this, a, e, f, g);
      case 6:
        return c.call(this, a, e, f, g, h, k)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$4 = b;
  a.cljs$core$IFn$_invoke$arity$6 = c;
  return a
}();
cljs.core.inode_kv_reduce = function(a, b, c) {
  for(var d = a.length, e = 0;;) {
    if(e < d) {
      var f = a[e];
      null != f ? c = b.cljs$core$IFn$_invoke$arity$3 ? b.cljs$core$IFn$_invoke$arity$3(c, f, a[e + 1]) : b.call(null, c, f, a[e + 1]) : (f = a[e + 1], c = null != f ? f.kv_reduce(b, c) : c);
      if(cljs.core.reduced_QMARK_(c)) {
        return cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(c) : cljs.core.deref.call(null, c)
      }
      e += 2
    }else {
      return c
    }
  }
};
cljs.core.BitmapIndexedNode = function(a, b, c) {
  this.edit = a;
  this.bitmap = b;
  this.arr = c
};
cljs.core.BitmapIndexedNode.cljs$lang$type = !0;
cljs.core.BitmapIndexedNode.cljs$lang$ctorStr = "cljs.core/BitmapIndexedNode";
cljs.core.BitmapIndexedNode.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write(b, "cljs.core/BitmapIndexedNode")
};
cljs.core.BitmapIndexedNode.prototype.edit_and_remove_pair = function(a, b, c) {
  if(this.bitmap === b) {
    return null
  }
  a = this.ensure_editable(a);
  var d = a.arr, e = d.length;
  a.bitmap ^= b;
  cljs.core.array_copy(d, 2 * (c + 1), d, 2 * c, e - 2 * (c + 1));
  d[e - 2] = null;
  d[e - 1] = null;
  return a
};
cljs.core.BitmapIndexedNode.prototype.inode_assoc_BANG_ = function(a, b, c, d, e, f) {
  var g = 1 << (c >>> b & 31), h = cljs.core.bitmap_indexed_node_index(this.bitmap, g);
  if(0 === (this.bitmap & g)) {
    var k = cljs.core.bit_count(this.bitmap);
    if(2 * k < this.arr.length) {
      return a = this.ensure_editable(a), b = a.arr, f.val = !0, cljs.core.array_copy_downward(b, 2 * h, b, 2 * (h + 1), 2 * (k - h)), b[2 * h] = d, b[2 * h + 1] = e, a.bitmap |= g, a
    }
    if(16 <= k) {
      h = Array(32);
      h[c >>> b & 31] = cljs.core.BitmapIndexedNode.EMPTY.inode_assoc_BANG_(a, b + 5, c, d, e, f);
      for(e = d = 0;;) {
        if(32 > d) {
          0 !== (this.bitmap >>> d & 1) && (h[d] = null != this.arr[e] ? cljs.core.BitmapIndexedNode.EMPTY.inode_assoc_BANG_(a, b + 5, cljs.core.hash.cljs$core$IFn$_invoke$arity$1(this.arr[e]), this.arr[e], this.arr[e + 1], f) : this.arr[e + 1], e += 2), d += 1
        }else {
          break
        }
      }
      return new cljs.core.ArrayNode(a, k + 1, h)
    }
    b = Array(2 * (k + 4));
    cljs.core.array_copy(this.arr, 0, b, 0, 2 * h);
    b[2 * h] = d;
    b[2 * h + 1] = e;
    cljs.core.array_copy(this.arr, 2 * h, b, 2 * (h + 1), 2 * (k - h));
    f.val = !0;
    a = this.ensure_editable(a);
    a.arr = b;
    a.bitmap |= g;
    return a
  }
  k = this.arr[2 * h];
  g = this.arr[2 * h + 1];
  if(null == k) {
    return k = g.inode_assoc_BANG_(a, b + 5, c, d, e, f), k === g ? this : cljs.core.edit_and_set.cljs$core$IFn$_invoke$arity$4(this, a, 2 * h + 1, k)
  }
  if(cljs.core.key_test(d, k)) {
    return e === g ? this : cljs.core.edit_and_set.cljs$core$IFn$_invoke$arity$4(this, a, 2 * h + 1, e)
  }
  f.val = !0;
  return cljs.core.edit_and_set.cljs$core$IFn$_invoke$arity$6(this, a, 2 * h, null, 2 * h + 1, cljs.core.create_node.cljs$core$IFn$_invoke$arity$7 ? cljs.core.create_node.cljs$core$IFn$_invoke$arity$7(a, b + 5, k, g, c, d, e) : cljs.core.create_node.call(null, a, b + 5, k, g, c, d, e))
};
cljs.core.BitmapIndexedNode.prototype.inode_seq = function() {
  return cljs.core.create_inode_seq.cljs$core$IFn$_invoke$arity$1 ? cljs.core.create_inode_seq.cljs$core$IFn$_invoke$arity$1(this.arr) : cljs.core.create_inode_seq.call(null, this.arr)
};
cljs.core.BitmapIndexedNode.prototype.inode_without_BANG_ = function(a, b, c, d, e) {
  var f = 1 << (c >>> b & 31);
  if(0 === (this.bitmap & f)) {
    return this
  }
  var g = cljs.core.bitmap_indexed_node_index(this.bitmap, f), h = this.arr[2 * g], k = this.arr[2 * g + 1];
  return null == h ? (b = k.inode_without_BANG_(a, b + 5, c, d, e), b === k ? this : null != b ? cljs.core.edit_and_set.cljs$core$IFn$_invoke$arity$4(this, a, 2 * g + 1, b) : this.bitmap === f ? null : this.edit_and_remove_pair(a, f, g)) : cljs.core.key_test(d, h) ? (e[0] = !0, this.edit_and_remove_pair(a, f, g)) : this
};
cljs.core.BitmapIndexedNode.prototype.ensure_editable = function(a) {
  if(a === this.edit) {
    return this
  }
  var b = cljs.core.bit_count(this.bitmap), c = Array(0 > b ? 4 : 2 * (b + 1));
  cljs.core.array_copy(this.arr, 0, c, 0, 2 * b);
  return new cljs.core.BitmapIndexedNode(a, this.bitmap, c)
};
cljs.core.BitmapIndexedNode.prototype.kv_reduce = function(a, b) {
  return cljs.core.inode_kv_reduce(this.arr, a, b)
};
cljs.core.BitmapIndexedNode.prototype.inode_find = function(a, b, c, d) {
  var e = 1 << (b >>> a & 31);
  if(0 === (this.bitmap & e)) {
    return d
  }
  var f = cljs.core.bitmap_indexed_node_index(this.bitmap, e), e = this.arr[2 * f], f = this.arr[2 * f + 1];
  return null == e ? f.inode_find(a + 5, b, c, d) : cljs.core.key_test(c, e) ? cljs.core.PersistentVector.fromArray([e, f], !0) : d
};
cljs.core.BitmapIndexedNode.prototype.inode_without = function(a, b, c) {
  var d = 1 << (b >>> a & 31);
  if(0 === (this.bitmap & d)) {
    return this
  }
  var e = cljs.core.bitmap_indexed_node_index(this.bitmap, d), f = this.arr[2 * e], g = this.arr[2 * e + 1];
  return null == f ? (a = g.inode_without(a + 5, b, c), a === g ? this : null != a ? new cljs.core.BitmapIndexedNode(null, this.bitmap, cljs.core.clone_and_set.cljs$core$IFn$_invoke$arity$3(this.arr, 2 * e + 1, a)) : this.bitmap === d ? null : new cljs.core.BitmapIndexedNode(null, this.bitmap ^ d, cljs.core.remove_pair(this.arr, e))) : cljs.core.key_test(c, f) ? new cljs.core.BitmapIndexedNode(null, this.bitmap ^ d, cljs.core.remove_pair(this.arr, e)) : this
};
cljs.core.BitmapIndexedNode.prototype.inode_assoc = function(a, b, c, d, e) {
  var f = 1 << (b >>> a & 31), g = cljs.core.bitmap_indexed_node_index(this.bitmap, f);
  if(0 === (this.bitmap & f)) {
    var h = cljs.core.bit_count(this.bitmap);
    if(16 <= h) {
      g = Array(32);
      g[b >>> a & 31] = cljs.core.BitmapIndexedNode.EMPTY.inode_assoc(a + 5, b, c, d, e);
      for(d = c = 0;;) {
        if(32 > c) {
          0 !== (this.bitmap >>> c & 1) && (g[c] = null != this.arr[d] ? cljs.core.BitmapIndexedNode.EMPTY.inode_assoc(a + 5, cljs.core.hash.cljs$core$IFn$_invoke$arity$1(this.arr[d]), this.arr[d], this.arr[d + 1], e) : this.arr[d + 1], d += 2), c += 1
        }else {
          break
        }
      }
      return new cljs.core.ArrayNode(null, h + 1, g)
    }
    a = Array(2 * (h + 1));
    cljs.core.array_copy(this.arr, 0, a, 0, 2 * g);
    a[2 * g] = c;
    a[2 * g + 1] = d;
    cljs.core.array_copy(this.arr, 2 * g, a, 2 * (g + 1), 2 * (h - g));
    e.val = !0;
    return new cljs.core.BitmapIndexedNode(null, this.bitmap | f, a)
  }
  h = this.arr[2 * g];
  f = this.arr[2 * g + 1];
  if(null == h) {
    return h = f.inode_assoc(a + 5, b, c, d, e), h === f ? this : new cljs.core.BitmapIndexedNode(null, this.bitmap, cljs.core.clone_and_set.cljs$core$IFn$_invoke$arity$3(this.arr, 2 * g + 1, h))
  }
  if(cljs.core.key_test(c, h)) {
    return d === f ? this : new cljs.core.BitmapIndexedNode(null, this.bitmap, cljs.core.clone_and_set.cljs$core$IFn$_invoke$arity$3(this.arr, 2 * g + 1, d))
  }
  e.val = !0;
  return new cljs.core.BitmapIndexedNode(null, this.bitmap, cljs.core.clone_and_set.cljs$core$IFn$_invoke$arity$5(this.arr, 2 * g, null, 2 * g + 1, cljs.core.create_node.cljs$core$IFn$_invoke$arity$6 ? cljs.core.create_node.cljs$core$IFn$_invoke$arity$6(a + 5, h, f, b, c, d) : cljs.core.create_node.call(null, a + 5, h, f, b, c, d)))
};
cljs.core.BitmapIndexedNode.prototype.inode_lookup = function(a, b, c, d) {
  var e = 1 << (b >>> a & 31);
  if(0 === (this.bitmap & e)) {
    return d
  }
  var f = cljs.core.bitmap_indexed_node_index(this.bitmap, e), e = this.arr[2 * f], f = this.arr[2 * f + 1];
  return null == e ? f.inode_lookup(a + 5, b, c, d) : cljs.core.key_test(c, e) ? f : d
};
cljs.core.__GT_BitmapIndexedNode = function(a, b, c) {
  return new cljs.core.BitmapIndexedNode(a, b, c)
};
cljs.core.BitmapIndexedNode.EMPTY = new cljs.core.BitmapIndexedNode(null, 0, []);
cljs.core.pack_array_node = function(a, b, c) {
  var d = a.arr;
  a = 2 * (a.cnt - 1);
  for(var e = Array(a), f = 0, g = 1, h = 0;;) {
    if(f < a) {
      var k;
      k = (k = f !== c) ? null != d[f] : k;
      k && (e[g] = d[f], g += 2, h |= 1 << f);
      f += 1
    }else {
      return new cljs.core.BitmapIndexedNode(b, h, e)
    }
  }
};
cljs.core.ArrayNode = function(a, b, c) {
  this.edit = a;
  this.cnt = b;
  this.arr = c
};
cljs.core.ArrayNode.cljs$lang$type = !0;
cljs.core.ArrayNode.cljs$lang$ctorStr = "cljs.core/ArrayNode";
cljs.core.ArrayNode.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write(b, "cljs.core/ArrayNode")
};
cljs.core.ArrayNode.prototype.inode_assoc_BANG_ = function(a, b, c, d, e, f) {
  var g = c >>> b & 31, h = this.arr[g];
  if(null == h) {
    return a = cljs.core.edit_and_set.cljs$core$IFn$_invoke$arity$4(this, a, g, cljs.core.BitmapIndexedNode.EMPTY.inode_assoc_BANG_(a, b + 5, c, d, e, f)), a.cnt += 1, a
  }
  b = h.inode_assoc_BANG_(a, b + 5, c, d, e, f);
  return b === h ? this : cljs.core.edit_and_set.cljs$core$IFn$_invoke$arity$4(this, a, g, b)
};
cljs.core.ArrayNode.prototype.inode_seq = function() {
  return cljs.core.create_array_node_seq.cljs$core$IFn$_invoke$arity$1 ? cljs.core.create_array_node_seq.cljs$core$IFn$_invoke$arity$1(this.arr) : cljs.core.create_array_node_seq.call(null, this.arr)
};
cljs.core.ArrayNode.prototype.inode_without_BANG_ = function(a, b, c, d, e) {
  var f = c >>> b & 31, g = this.arr[f];
  if(null == g) {
    return this
  }
  b = g.inode_without_BANG_(a, b + 5, c, d, e);
  if(b === g) {
    return this
  }
  if(null == b) {
    if(8 >= this.cnt) {
      return cljs.core.pack_array_node(this, a, f)
    }
    a = cljs.core.edit_and_set.cljs$core$IFn$_invoke$arity$4(this, a, f, b);
    a.cnt -= 1;
    return a
  }
  return cljs.core.edit_and_set.cljs$core$IFn$_invoke$arity$4(this, a, f, b)
};
cljs.core.ArrayNode.prototype.ensure_editable = function(a) {
  return a === this.edit ? this : new cljs.core.ArrayNode(a, this.cnt, this.arr.slice())
};
cljs.core.ArrayNode.prototype.kv_reduce = function(a, b) {
  for(var c = this.arr.length, d = 0, e = b;;) {
    if(d < c) {
      var f = this.arr[d];
      if(null != f && (e = f.kv_reduce(a, e), cljs.core.reduced_QMARK_(e))) {
        return cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(e) : cljs.core.deref.call(null, e)
      }
      d += 1
    }else {
      return e
    }
  }
};
cljs.core.ArrayNode.prototype.inode_find = function(a, b, c, d) {
  var e = this.arr[b >>> a & 31];
  return null != e ? e.inode_find(a + 5, b, c, d) : d
};
cljs.core.ArrayNode.prototype.inode_without = function(a, b, c) {
  var d = b >>> a & 31, e = this.arr[d];
  return null != e ? (a = e.inode_without(a + 5, b, c), a === e ? this : null == a ? 8 >= this.cnt ? cljs.core.pack_array_node(this, null, d) : new cljs.core.ArrayNode(null, this.cnt - 1, cljs.core.clone_and_set.cljs$core$IFn$_invoke$arity$3(this.arr, d, a)) : new cljs.core.ArrayNode(null, this.cnt, cljs.core.clone_and_set.cljs$core$IFn$_invoke$arity$3(this.arr, d, a))) : this
};
cljs.core.ArrayNode.prototype.inode_assoc = function(a, b, c, d, e) {
  var f = b >>> a & 31, g = this.arr[f];
  if(null == g) {
    return new cljs.core.ArrayNode(null, this.cnt + 1, cljs.core.clone_and_set.cljs$core$IFn$_invoke$arity$3(this.arr, f, cljs.core.BitmapIndexedNode.EMPTY.inode_assoc(a + 5, b, c, d, e)))
  }
  a = g.inode_assoc(a + 5, b, c, d, e);
  return a === g ? this : new cljs.core.ArrayNode(null, this.cnt, cljs.core.clone_and_set.cljs$core$IFn$_invoke$arity$3(this.arr, f, a))
};
cljs.core.ArrayNode.prototype.inode_lookup = function(a, b, c, d) {
  var e = this.arr[b >>> a & 31];
  return null != e ? e.inode_lookup(a + 5, b, c, d) : d
};
cljs.core.__GT_ArrayNode = function(a, b, c) {
  return new cljs.core.ArrayNode(a, b, c)
};
cljs.core.hash_collision_node_find_index = function(a, b, c) {
  b *= 2;
  for(var d = 0;;) {
    if(d < b) {
      if(cljs.core.key_test(c, a[d])) {
        return d
      }
      d += 2
    }else {
      return-1
    }
  }
};
cljs.core.HashCollisionNode = function(a, b, c, d) {
  this.edit = a;
  this.collision_hash = b;
  this.cnt = c;
  this.arr = d
};
cljs.core.HashCollisionNode.cljs$lang$type = !0;
cljs.core.HashCollisionNode.cljs$lang$ctorStr = "cljs.core/HashCollisionNode";
cljs.core.HashCollisionNode.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write(b, "cljs.core/HashCollisionNode")
};
cljs.core.HashCollisionNode.prototype.inode_assoc_BANG_ = function(a, b, c, d, e, f) {
  if(c === this.collision_hash) {
    b = cljs.core.hash_collision_node_find_index(this.arr, this.cnt, d);
    if(-1 === b) {
      if(this.arr.length > 2 * this.cnt) {
        return a = cljs.core.edit_and_set.cljs$core$IFn$_invoke$arity$6(this, a, 2 * this.cnt, d, 2 * this.cnt + 1, e), f.val = !0, a.cnt += 1, a
      }
      b = this.arr.length;
      c = Array(b + 2);
      cljs.core.array_copy(this.arr, 0, c, 0, b);
      c[b] = d;
      c[b + 1] = e;
      f.val = !0;
      return this.ensure_editable_array(a, this.cnt + 1, c)
    }
    return this.arr[b + 1] === e ? this : cljs.core.edit_and_set.cljs$core$IFn$_invoke$arity$4(this, a, b + 1, e)
  }
  return(new cljs.core.BitmapIndexedNode(a, 1 << (this.collision_hash >>> b & 31), [null, this, null, null])).inode_assoc_BANG_(a, b, c, d, e, f)
};
cljs.core.HashCollisionNode.prototype.inode_seq = function() {
  return cljs.core.create_inode_seq.cljs$core$IFn$_invoke$arity$1 ? cljs.core.create_inode_seq.cljs$core$IFn$_invoke$arity$1(this.arr) : cljs.core.create_inode_seq.call(null, this.arr)
};
cljs.core.HashCollisionNode.prototype.inode_without_BANG_ = function(a, b, c, d, e) {
  b = cljs.core.hash_collision_node_find_index(this.arr, this.cnt, d);
  if(-1 === b) {
    return this
  }
  e[0] = !0;
  if(1 === this.cnt) {
    return null
  }
  a = this.ensure_editable(a);
  e = a.arr;
  e[b] = e[2 * this.cnt - 2];
  e[b + 1] = e[2 * this.cnt - 1];
  e[2 * this.cnt - 1] = null;
  e[2 * this.cnt - 2] = null;
  a.cnt -= 1;
  return a
};
cljs.core.HashCollisionNode.prototype.ensure_editable = function(a) {
  if(a === this.edit) {
    return this
  }
  var b = Array(2 * (this.cnt + 1));
  cljs.core.array_copy(this.arr, 0, b, 0, 2 * this.cnt);
  return new cljs.core.HashCollisionNode(a, this.collision_hash, this.cnt, b)
};
cljs.core.HashCollisionNode.prototype.kv_reduce = function(a, b) {
  return cljs.core.inode_kv_reduce(this.arr, a, b)
};
cljs.core.HashCollisionNode.prototype.inode_find = function(a, b, c, d) {
  a = cljs.core.hash_collision_node_find_index(this.arr, this.cnt, c);
  return 0 > a ? d : cljs.core.key_test(c, this.arr[a]) ? cljs.core.PersistentVector.fromArray([this.arr[a], this.arr[a + 1]], !0) : d
};
cljs.core.HashCollisionNode.prototype.inode_without = function(a, b, c) {
  a = cljs.core.hash_collision_node_find_index(this.arr, this.cnt, c);
  return-1 === a ? this : 1 === this.cnt ? null : new cljs.core.HashCollisionNode(null, this.collision_hash, this.cnt - 1, cljs.core.remove_pair(this.arr, cljs.core.quot(a, 2)))
};
cljs.core.HashCollisionNode.prototype.inode_assoc = function(a, b, c, d, e) {
  return b === this.collision_hash ? (a = cljs.core.hash_collision_node_find_index(this.arr, this.cnt, c), -1 === a ? (a = this.arr.length, b = Array(a + 2), cljs.core.array_copy(this.arr, 0, b, 0, a), b[a] = c, b[a + 1] = d, e.val = !0, new cljs.core.HashCollisionNode(null, this.collision_hash, this.cnt + 1, b)) : cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this.arr[a], d) ? this : new cljs.core.HashCollisionNode(null, this.collision_hash, this.cnt, cljs.core.clone_and_set.cljs$core$IFn$_invoke$arity$3(this.arr, 
  a + 1, d))) : (new cljs.core.BitmapIndexedNode(null, 1 << (this.collision_hash >>> a & 31), [null, this])).inode_assoc(a, b, c, d, e)
};
cljs.core.HashCollisionNode.prototype.inode_lookup = function(a, b, c, d) {
  a = cljs.core.hash_collision_node_find_index(this.arr, this.cnt, c);
  return 0 > a ? d : cljs.core.key_test(c, this.arr[a]) ? this.arr[a + 1] : d
};
cljs.core.HashCollisionNode.prototype.ensure_editable_array = function(a, b, c) {
  return a === this.edit ? (this.arr = c, this.cnt = b, this) : new cljs.core.HashCollisionNode(this.edit, this.collision_hash, b, c)
};
cljs.core.__GT_HashCollisionNode = function(a, b, c, d) {
  return new cljs.core.HashCollisionNode(a, b, c, d)
};
cljs.core.create_node = function() {
  var a = null, b = function(a, b, c, g, h, k) {
    var l = cljs.core.hash.cljs$core$IFn$_invoke$arity$1(b);
    if(l === g) {
      return new cljs.core.HashCollisionNode(null, l, 2, [b, c, h, k])
    }
    var m = new cljs.core.Box(!1);
    return cljs.core.BitmapIndexedNode.EMPTY.inode_assoc(a, l, b, c, m).inode_assoc(a, g, h, k, m)
  }, c = function(a, b, c, g, h, k, l) {
    var m = cljs.core.hash.cljs$core$IFn$_invoke$arity$1(c);
    if(m === h) {
      return new cljs.core.HashCollisionNode(null, m, 2, [c, g, k, l])
    }
    var n = new cljs.core.Box(!1);
    return cljs.core.BitmapIndexedNode.EMPTY.inode_assoc_BANG_(a, b, m, c, g, n).inode_assoc_BANG_(a, b, h, k, l, n)
  }, a = function(a, e, f, g, h, k, l) {
    switch(arguments.length) {
      case 6:
        return b.call(this, a, e, f, g, h, k);
      case 7:
        return c.call(this, a, e, f, g, h, k, l)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$6 = b;
  a.cljs$core$IFn$_invoke$arity$7 = c;
  return a
}();
cljs.core.NodeSeq = function(a, b, c, d, e) {
  this.meta = a;
  this.nodes = b;
  this.i = c;
  this.s = d;
  this.__hash = e;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 31850572
};
cljs.core.NodeSeq.cljs$lang$type = !0;
cljs.core.NodeSeq.cljs$lang$ctorStr = "cljs.core/NodeSeq";
cljs.core.NodeSeq.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write(b, "cljs.core/NodeSeq")
};
cljs.core.NodeSeq.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  var b = this.__hash;
  return null != b ? b : this.__hash = a = cljs.core.hash_coll(a)
};
cljs.core.NodeSeq.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return cljs.core.cons(b, a)
};
cljs.core.NodeSeq.prototype.toString = function() {
  return cljs.core.pr_str_STAR_(this)
};
cljs.core.NodeSeq.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return a
};
cljs.core.NodeSeq.prototype.cljs$core$ISeq$_first$arity$1 = function(a) {
  return null == this.s ? cljs.core.PersistentVector.fromArray([this.nodes[this.i], this.nodes[this.i + 1]], !0) : cljs.core.first(this.s)
};
cljs.core.NodeSeq.prototype.cljs$core$ISeq$_rest$arity$1 = function(a) {
  return null == this.s ? cljs.core.create_inode_seq.cljs$core$IFn$_invoke$arity$3 ? cljs.core.create_inode_seq.cljs$core$IFn$_invoke$arity$3(this.nodes, this.i + 2, null) : cljs.core.create_inode_seq.call(null, this.nodes, this.i + 2, null) : cljs.core.create_inode_seq.cljs$core$IFn$_invoke$arity$3 ? cljs.core.create_inode_seq.cljs$core$IFn$_invoke$arity$3(this.nodes, this.i, cljs.core.next(this.s)) : cljs.core.create_inode_seq.call(null, this.nodes, this.i, cljs.core.next(this.s))
};
cljs.core.NodeSeq.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential(a, b)
};
cljs.core.NodeSeq.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.NodeSeq(b, this.nodes, this.i, this.s, this.__hash)
};
cljs.core.NodeSeq.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return this.meta
};
cljs.core.NodeSeq.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return cljs.core.with_meta(cljs.core.List.EMPTY, this.meta)
};
cljs.core.__GT_NodeSeq = function(a, b, c, d, e) {
  return new cljs.core.NodeSeq(a, b, c, d, e)
};
cljs.core.create_inode_seq = function() {
  var a = null, b = function(b) {
    return a.cljs$core$IFn$_invoke$arity$3(b, 0, null)
  }, c = function(a, b, c) {
    if(null == c) {
      for(c = a.length;;) {
        if(b < c) {
          if(null != a[b]) {
            return new cljs.core.NodeSeq(null, a, b, null, null)
          }
          var g = a[b + 1];
          if(cljs.core.truth_(g) && (g = g.inode_seq(), cljs.core.truth_(g))) {
            return new cljs.core.NodeSeq(null, a, b + 2, g, null)
          }
          b += 2
        }else {
          return null
        }
      }
    }else {
      return new cljs.core.NodeSeq(null, a, b, c, null)
    }
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 3:
        return c.call(this, a, e, f)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a
}();
cljs.core.ArrayNodeSeq = function(a, b, c, d, e) {
  this.meta = a;
  this.nodes = b;
  this.i = c;
  this.s = d;
  this.__hash = e;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 31850572
};
cljs.core.ArrayNodeSeq.cljs$lang$type = !0;
cljs.core.ArrayNodeSeq.cljs$lang$ctorStr = "cljs.core/ArrayNodeSeq";
cljs.core.ArrayNodeSeq.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write(b, "cljs.core/ArrayNodeSeq")
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  var b = this.__hash;
  return null != b ? b : this.__hash = a = cljs.core.hash_coll(a)
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return cljs.core.cons(b, a)
};
cljs.core.ArrayNodeSeq.prototype.toString = function() {
  return cljs.core.pr_str_STAR_(this)
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return a
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$ISeq$_first$arity$1 = function(a) {
  return cljs.core.first(this.s)
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$ISeq$_rest$arity$1 = function(a) {
  return cljs.core.create_array_node_seq.cljs$core$IFn$_invoke$arity$4 ? cljs.core.create_array_node_seq.cljs$core$IFn$_invoke$arity$4(null, this.nodes, this.i, cljs.core.next(this.s)) : cljs.core.create_array_node_seq.call(null, null, this.nodes, this.i, cljs.core.next(this.s))
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential(a, b)
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.ArrayNodeSeq(b, this.nodes, this.i, this.s, this.__hash)
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return this.meta
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return cljs.core.with_meta(cljs.core.List.EMPTY, this.meta)
};
cljs.core.__GT_ArrayNodeSeq = function(a, b, c, d, e) {
  return new cljs.core.ArrayNodeSeq(a, b, c, d, e)
};
cljs.core.create_array_node_seq = function() {
  var a = null, b = function(b) {
    return a.cljs$core$IFn$_invoke$arity$4(null, b, 0, null)
  }, c = function(a, b, c, g) {
    if(null == g) {
      for(g = b.length;;) {
        if(c < g) {
          var h = b[c];
          if(cljs.core.truth_(h) && (h = h.inode_seq(), cljs.core.truth_(h))) {
            return new cljs.core.ArrayNodeSeq(a, b, c + 1, h, null)
          }
          c += 1
        }else {
          return null
        }
      }
    }else {
      return new cljs.core.ArrayNodeSeq(a, b, c, g, null)
    }
  }, a = function(a, e, f, g) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 4:
        return c.call(this, a, e, f, g)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$4 = c;
  return a
}();
cljs.core.PersistentHashMap = function(a, b, c, d, e, f) {
  this.meta = a;
  this.cnt = b;
  this.root = c;
  this.has_nil_QMARK_ = d;
  this.nil_val = e;
  this.__hash = f;
  this.cljs$lang$protocol_mask$partition1$ = 4;
  this.cljs$lang$protocol_mask$partition0$ = 16123663
};
cljs.core.PersistentHashMap.cljs$lang$type = !0;
cljs.core.PersistentHashMap.cljs$lang$ctorStr = "cljs.core/PersistentHashMap";
cljs.core.PersistentHashMap.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write(b, "cljs.core/PersistentHashMap")
};
cljs.core.PersistentHashMap.prototype.cljs$core$IEditableCollection$_as_transient$arity$1 = function(a) {
  return new cljs.core.TransientHashMap({}, this.root, this.cnt, this.has_nil_QMARK_, this.nil_val)
};
cljs.core.PersistentHashMap.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  var b = this.__hash;
  return null != b ? b : this.__hash = a = cljs.core.hash_imap(a)
};
cljs.core.PersistentHashMap.prototype.cljs$core$ILookup$_lookup$arity$2 = function(a, b) {
  return a.cljs$core$ILookup$_lookup$arity$3(a, b, null)
};
cljs.core.PersistentHashMap.prototype.cljs$core$ILookup$_lookup$arity$3 = function(a, b, c) {
  return null == b ? this.has_nil_QMARK_ ? this.nil_val : c : null == this.root ? c : this.root.inode_lookup(0, cljs.core.hash.cljs$core$IFn$_invoke$arity$1(b), b, c)
};
cljs.core.PersistentHashMap.prototype.cljs$core$IAssociative$_assoc$arity$3 = function(a, b, c) {
  if(null == b) {
    var d;
    d = (d = this.has_nil_QMARK_) ? c === this.nil_val : d;
    return d ? a : new cljs.core.PersistentHashMap(this.meta, this.has_nil_QMARK_ ? this.cnt : this.cnt + 1, this.root, !0, c, null)
  }
  d = new cljs.core.Box(!1);
  c = (null == this.root ? cljs.core.BitmapIndexedNode.EMPTY : this.root).inode_assoc(0, cljs.core.hash.cljs$core$IFn$_invoke$arity$1(b), b, c, d);
  return c === this.root ? a : new cljs.core.PersistentHashMap(this.meta, d.val ? this.cnt + 1 : this.cnt, c, this.has_nil_QMARK_, this.nil_val, null)
};
cljs.core.PersistentHashMap.prototype.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 = function(a, b) {
  return null == b ? this.has_nil_QMARK_ : null == this.root ? !1 : this.root.inode_lookup(0, cljs.core.hash.cljs$core$IFn$_invoke$arity$1(b), b, cljs.core.lookup_sentinel) !== cljs.core.lookup_sentinel
};
cljs.core.PersistentHashMap.prototype.call = function() {
  var a = null;
  return a = function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return this.cljs$core$ILookup$_lookup$arity$2(this, c);
      case 3:
        return this.cljs$core$ILookup$_lookup$arity$3(this, c, d)
    }
    throw Error("Invalid arity: " + arguments.length);
  }
}();
cljs.core.PersistentHashMap.prototype.apply = function(a, b) {
  a = this;
  return a.call.apply(a, [a].concat(b.slice()))
};
cljs.core.PersistentHashMap.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = function(a, b, c) {
  a = this.has_nil_QMARK_ ? b.cljs$core$IFn$_invoke$arity$3 ? b.cljs$core$IFn$_invoke$arity$3(c, null, this.nil_val) : b.call(null, c, null, this.nil_val) : c;
  return cljs.core.reduced_QMARK_(a) ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(a) : cljs.core.deref.call(null, a) : null != this.root ? this.root.kv_reduce(b, a) : a
};
cljs.core.PersistentHashMap.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return cljs.core.vector_QMARK_(b) ? a.cljs$core$IAssociative$_assoc$arity$3(a, cljs.core._nth.cljs$core$IFn$_invoke$arity$2(b, 0), cljs.core._nth.cljs$core$IFn$_invoke$arity$2(b, 1)) : cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(cljs.core._conj, a, b)
};
cljs.core.PersistentHashMap.prototype.toString = function() {
  return cljs.core.pr_str_STAR_(this)
};
cljs.core.PersistentHashMap.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return 0 < this.cnt ? (a = null != this.root ? this.root.inode_seq() : null, this.has_nil_QMARK_ ? cljs.core.cons(cljs.core.PersistentVector.fromArray([null, this.nil_val], !0), a) : a) : null
};
cljs.core.PersistentHashMap.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  return this.cnt
};
cljs.core.PersistentHashMap.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_map(a, b)
};
cljs.core.PersistentHashMap.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.PersistentHashMap(b, this.cnt, this.root, this.has_nil_QMARK_, this.nil_val, this.__hash)
};
cljs.core.PersistentHashMap.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return this.meta
};
cljs.core.PersistentHashMap.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return cljs.core._with_meta(cljs.core.PersistentHashMap.EMPTY, this.meta)
};
cljs.core.PersistentHashMap.prototype.cljs$core$IMap$_dissoc$arity$2 = function(a, b) {
  if(null == b) {
    return this.has_nil_QMARK_ ? new cljs.core.PersistentHashMap(this.meta, this.cnt - 1, this.root, !1, null, null) : a
  }
  if(null == this.root) {
    return a
  }
  var c = this.root.inode_without(0, cljs.core.hash.cljs$core$IFn$_invoke$arity$1(b), b);
  return c === this.root ? a : new cljs.core.PersistentHashMap(this.meta, this.cnt - 1, c, this.has_nil_QMARK_, this.nil_val, null)
};
cljs.core.__GT_PersistentHashMap = function(a, b, c, d, e, f) {
  return new cljs.core.PersistentHashMap(a, b, c, d, e, f)
};
cljs.core.PersistentHashMap.EMPTY = new cljs.core.PersistentHashMap(null, 0, null, !1, null, 0);
cljs.core.PersistentHashMap.fromArrays = function(a, b) {
  for(var c = a.length, d = 0, e = cljs.core.transient$(cljs.core.PersistentHashMap.EMPTY);;) {
    if(d < c) {
      var f = d + 1, e = cljs.core.assoc_BANG_(e, a[d], b[d]), d = f
    }else {
      return cljs.core.persistent_BANG_(e)
    }
  }
};
cljs.core.TransientHashMap = function(a, b, c, d, e) {
  this.edit = a;
  this.root = b;
  this.count = c;
  this.has_nil_QMARK_ = d;
  this.nil_val = e;
  this.cljs$lang$protocol_mask$partition1$ = 56;
  this.cljs$lang$protocol_mask$partition0$ = 258
};
cljs.core.TransientHashMap.cljs$lang$type = !0;
cljs.core.TransientHashMap.cljs$lang$ctorStr = "cljs.core/TransientHashMap";
cljs.core.TransientHashMap.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write(b, "cljs.core/TransientHashMap")
};
cljs.core.TransientHashMap.prototype.cljs$core$ITransientMap$_dissoc_BANG_$arity$2 = function(a, b) {
  return a.without_BANG_(b)
};
cljs.core.TransientHashMap.prototype.cljs$core$ITransientAssociative$_assoc_BANG_$arity$3 = function(a, b, c) {
  return a.assoc_BANG_(b, c)
};
cljs.core.TransientHashMap.prototype.cljs$core$ITransientCollection$_conj_BANG_$arity$2 = function(a, b) {
  return a.conj_BANG_(b)
};
cljs.core.TransientHashMap.prototype.cljs$core$ITransientCollection$_persistent_BANG_$arity$1 = function(a) {
  return a.persistent_BANG_()
};
cljs.core.TransientHashMap.prototype.cljs$core$ILookup$_lookup$arity$2 = function(a, b) {
  return null == b ? this.has_nil_QMARK_ ? this.nil_val : null : null == this.root ? null : this.root.inode_lookup(0, cljs.core.hash.cljs$core$IFn$_invoke$arity$1(b), b)
};
cljs.core.TransientHashMap.prototype.cljs$core$ILookup$_lookup$arity$3 = function(a, b, c) {
  return null == b ? this.has_nil_QMARK_ ? this.nil_val : c : null == this.root ? c : this.root.inode_lookup(0, cljs.core.hash.cljs$core$IFn$_invoke$arity$1(b), b, c)
};
cljs.core.TransientHashMap.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  if(this.edit) {
    return this.count
  }
  throw Error("count after persistent!");
};
cljs.core.TransientHashMap.prototype.conj_BANG_ = function(a) {
  if(this.edit) {
    var b;
    a ? (b = (b = a.cljs$lang$protocol_mask$partition0$ & 2048) ? b : a.cljs$core$IMapEntry$, b = b ? !0 : a.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.type_satisfies_(cljs.core.IMapEntry, a)) : b = cljs.core.type_satisfies_(cljs.core.IMapEntry, a);
    if(b) {
      return this.assoc_BANG_(cljs.core.key.cljs$core$IFn$_invoke$arity$1 ? cljs.core.key.cljs$core$IFn$_invoke$arity$1(a) : cljs.core.key.call(null, a), cljs.core.val.cljs$core$IFn$_invoke$arity$1 ? cljs.core.val.cljs$core$IFn$_invoke$arity$1(a) : cljs.core.val.call(null, a))
    }
    a = cljs.core.seq(a);
    for(b = this;;) {
      var c = cljs.core.first(a);
      if(cljs.core.truth_(c)) {
        a = cljs.core.next(a), b = b.assoc_BANG_(cljs.core.key.cljs$core$IFn$_invoke$arity$1 ? cljs.core.key.cljs$core$IFn$_invoke$arity$1(c) : cljs.core.key.call(null, c), cljs.core.val.cljs$core$IFn$_invoke$arity$1 ? cljs.core.val.cljs$core$IFn$_invoke$arity$1(c) : cljs.core.val.call(null, c))
      }else {
        return b
      }
    }
  }else {
    throw Error("conj! after persistent");
  }
};
cljs.core.TransientHashMap.prototype.assoc_BANG_ = function(a, b) {
  if(this.edit) {
    if(null == a) {
      this.nil_val !== b && (this.nil_val = b), this.has_nil_QMARK_ || (this.count += 1, this.has_nil_QMARK_ = !0)
    }else {
      var c = new cljs.core.Box(!1), d = (null == this.root ? cljs.core.BitmapIndexedNode.EMPTY : this.root).inode_assoc_BANG_(this.edit, 0, cljs.core.hash.cljs$core$IFn$_invoke$arity$1(a), a, b, c);
      d !== this.root && (this.root = d);
      c.val && (this.count += 1)
    }
    return this
  }
  throw Error("assoc! after persistent!");
};
cljs.core.TransientHashMap.prototype.without_BANG_ = function(a) {
  if(this.edit) {
    if(null == a) {
      this.has_nil_QMARK_ && (this.has_nil_QMARK_ = !1, this.nil_val = null, this.count -= 1)
    }else {
      if(null != this.root) {
        var b = new cljs.core.Box(!1);
        a = this.root.inode_without_BANG_(this.edit, 0, cljs.core.hash.cljs$core$IFn$_invoke$arity$1(a), a, b);
        a !== this.root && (this.root = a);
        cljs.core.truth_(b[0]) && (this.count -= 1)
      }
    }
    return this
  }
  throw Error("dissoc! after persistent!");
};
cljs.core.TransientHashMap.prototype.persistent_BANG_ = function() {
  if(this.edit) {
    return this.edit = null, new cljs.core.PersistentHashMap(null, this.count, this.root, this.has_nil_QMARK_, this.nil_val, null)
  }
  throw Error("persistent! called twice");
};
cljs.core.__GT_TransientHashMap = function(a, b, c, d, e) {
  return new cljs.core.TransientHashMap(a, b, c, d, e)
};
cljs.core.tree_map_seq_push = function(a, b, c) {
  for(var d = b;;) {
    if(null != a) {
      b = c ? a.left : a.right, d = cljs.core.conj.cljs$core$IFn$_invoke$arity$2(d, a), a = b
    }else {
      return d
    }
  }
};
cljs.core.PersistentTreeMapSeq = function(a, b, c, d, e) {
  this.meta = a;
  this.stack = b;
  this.ascending_QMARK_ = c;
  this.cnt = d;
  this.__hash = e;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 31850574
};
cljs.core.PersistentTreeMapSeq.cljs$lang$type = !0;
cljs.core.PersistentTreeMapSeq.cljs$lang$ctorStr = "cljs.core/PersistentTreeMapSeq";
cljs.core.PersistentTreeMapSeq.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write(b, "cljs.core/PersistentTreeMapSeq")
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  var b = this.__hash;
  return null != b ? b : this.__hash = a = cljs.core.hash_coll(a)
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return cljs.core.cons(b, a)
};
cljs.core.PersistentTreeMapSeq.prototype.toString = function() {
  return cljs.core.pr_str_STAR_(this)
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return a
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  return 0 > this.cnt ? cljs.core.count(cljs.core.next(a)) + 1 : this.cnt
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$ISeq$_first$arity$1 = function(a) {
  return cljs.core.peek(this.stack)
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$ISeq$_rest$arity$1 = function(a) {
  a = cljs.core.first(this.stack);
  a = cljs.core.tree_map_seq_push(this.ascending_QMARK_ ? a.right : a.left, cljs.core.next(this.stack), this.ascending_QMARK_);
  return null != a ? new cljs.core.PersistentTreeMapSeq(null, a, this.ascending_QMARK_, this.cnt - 1, null) : cljs.core.List.EMPTY
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential(a, b)
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.PersistentTreeMapSeq(b, this.stack, this.ascending_QMARK_, this.cnt, this.__hash)
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return this.meta
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return cljs.core.with_meta(cljs.core.List.EMPTY, this.meta)
};
cljs.core.__GT_PersistentTreeMapSeq = function(a, b, c, d, e) {
  return new cljs.core.PersistentTreeMapSeq(a, b, c, d, e)
};
cljs.core.create_tree_map_seq = function(a, b, c) {
  return new cljs.core.PersistentTreeMapSeq(null, cljs.core.tree_map_seq_push(a, null, b), b, c, null)
};
cljs.core.balance_left = function(a, b, c, d) {
  return c instanceof cljs.core.RedNode ? c.left instanceof cljs.core.RedNode ? new cljs.core.RedNode(c.key, c.val, c.left.blacken(), new cljs.core.BlackNode(a, b, c.right, d, null), null) : c.right instanceof cljs.core.RedNode ? new cljs.core.RedNode(c.right.key, c.right.val, new cljs.core.BlackNode(c.key, c.val, c.left, c.right.left, null), new cljs.core.BlackNode(a, b, c.right.right, d, null), null) : new cljs.core.BlackNode(a, b, c, d, null) : new cljs.core.BlackNode(a, b, c, d, null)
};
cljs.core.balance_right = function(a, b, c, d) {
  return d instanceof cljs.core.RedNode ? d.right instanceof cljs.core.RedNode ? new cljs.core.RedNode(d.key, d.val, new cljs.core.BlackNode(a, b, c, d.left, null), d.right.blacken(), null) : d.left instanceof cljs.core.RedNode ? new cljs.core.RedNode(d.left.key, d.left.val, new cljs.core.BlackNode(a, b, c, d.left.left, null), new cljs.core.BlackNode(d.key, d.val, d.left.right, d.right, null), null) : new cljs.core.BlackNode(a, b, c, d, null) : new cljs.core.BlackNode(a, b, c, d, null)
};
cljs.core.balance_left_del = function(a, b, c, d) {
  if(c instanceof cljs.core.RedNode) {
    return new cljs.core.RedNode(a, b, c.blacken(), d, null)
  }
  if(d instanceof cljs.core.BlackNode) {
    return cljs.core.balance_right(a, b, c, d.redden())
  }
  var e;
  e = (e = d instanceof cljs.core.RedNode) ? d.left instanceof cljs.core.BlackNode : e;
  if(e) {
    return new cljs.core.RedNode(d.left.key, d.left.val, new cljs.core.BlackNode(a, b, c, d.left.left, null), cljs.core.balance_right(d.key, d.val, d.left.right, d.right.redden()), null)
  }
  throw Error("red-black tree invariant violation");
};
cljs.core.balance_right_del = function(a, b, c, d) {
  if(d instanceof cljs.core.RedNode) {
    return new cljs.core.RedNode(a, b, c, d.blacken(), null)
  }
  if(c instanceof cljs.core.BlackNode) {
    return cljs.core.balance_left(a, b, c.redden(), d)
  }
  var e;
  e = (e = c instanceof cljs.core.RedNode) ? c.right instanceof cljs.core.BlackNode : e;
  if(e) {
    return new cljs.core.RedNode(c.right.key, c.right.val, cljs.core.balance_left(c.key, c.val, c.left.redden(), c.right.left), new cljs.core.BlackNode(a, b, c.right.right, d, null), null)
  }
  throw Error("red-black tree invariant violation");
};
cljs.core.tree_map_kv_reduce = function tree_map_kv_reduce(b, c, d) {
  d = null != b.left ? tree_map_kv_reduce(b.left, c, d) : d;
  if(cljs.core.reduced_QMARK_(d)) {
    return cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(d) : cljs.core.deref.call(null, d)
  }
  d = c.cljs$core$IFn$_invoke$arity$3 ? c.cljs$core$IFn$_invoke$arity$3(d, b.key, b.val) : c.call(null, d, b.key, b.val);
  if(cljs.core.reduced_QMARK_(d)) {
    return cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(d) : cljs.core.deref.call(null, d)
  }
  b = null != b.right ? tree_map_kv_reduce(b.right, c, d) : d;
  return cljs.core.reduced_QMARK_(b) ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(b) : cljs.core.deref.call(null, b) : b
};
cljs.core.BlackNode = function(a, b, c, d, e) {
  this.key = a;
  this.val = b;
  this.left = c;
  this.right = d;
  this.__hash = e;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 32402207
};
cljs.core.BlackNode.cljs$lang$type = !0;
cljs.core.BlackNode.cljs$lang$ctorStr = "cljs.core/BlackNode";
cljs.core.BlackNode.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write(b, "cljs.core/BlackNode")
};
cljs.core.BlackNode.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  var b = this.__hash;
  return null != b ? b : this.__hash = a = cljs.core.hash_coll(a)
};
cljs.core.BlackNode.prototype.cljs$core$ILookup$_lookup$arity$2 = function(a, b) {
  return a.cljs$core$IIndexed$_nth$arity$3(a, b, null)
};
cljs.core.BlackNode.prototype.cljs$core$ILookup$_lookup$arity$3 = function(a, b, c) {
  return a.cljs$core$IIndexed$_nth$arity$3(a, b, c)
};
cljs.core.BlackNode.prototype.cljs$core$IAssociative$_assoc$arity$3 = function(a, b, c) {
  return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(cljs.core.PersistentVector.fromArray([this.key, this.val], !0), b, c)
};
cljs.core.BlackNode.prototype.call = function() {
  var a = null;
  return a = function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return this.cljs$core$ILookup$_lookup$arity$2(this, c);
      case 3:
        return this.cljs$core$ILookup$_lookup$arity$3(this, c, d)
    }
    throw Error("Invalid arity: " + arguments.length);
  }
}();
cljs.core.BlackNode.prototype.apply = function(a, b) {
  a = this;
  return a.call.apply(a, [a].concat(b.slice()))
};
cljs.core.BlackNode.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return cljs.core.PersistentVector.fromArray([this.key, this.val, b], !0)
};
cljs.core.BlackNode.prototype.cljs$core$IMapEntry$_key$arity$1 = function(a) {
  return this.key
};
cljs.core.BlackNode.prototype.cljs$core$IMapEntry$_val$arity$1 = function(a) {
  return this.val
};
cljs.core.BlackNode.prototype.add_right = function(a) {
  return a.balance_right(this)
};
cljs.core.BlackNode.prototype.redden = function() {
  return new cljs.core.RedNode(this.key, this.val, this.left, this.right, null)
};
cljs.core.BlackNode.prototype.remove_right = function(a) {
  return cljs.core.balance_right_del(this.key, this.val, this.left, a)
};
cljs.core.BlackNode.prototype.replace = function(a, b, c, d) {
  return new cljs.core.BlackNode(a, b, c, d, null)
};
cljs.core.BlackNode.prototype.kv_reduce = function(a, b) {
  return cljs.core.tree_map_kv_reduce(this, a, b)
};
cljs.core.BlackNode.prototype.remove_left = function(a) {
  return cljs.core.balance_left_del(this.key, this.val, a, this.right)
};
cljs.core.BlackNode.prototype.add_left = function(a) {
  return a.balance_left(this)
};
cljs.core.BlackNode.prototype.balance_left = function(a) {
  return new cljs.core.BlackNode(a.key, a.val, this, a.right, null)
};
cljs.core.BlackNode.prototype.balance_right = function(a) {
  return new cljs.core.BlackNode(a.key, a.val, a.left, this, null)
};
cljs.core.BlackNode.prototype.blacken = function() {
  return this
};
cljs.core.BlackNode.prototype.cljs$core$IReduce$_reduce$arity$2 = function(a, b) {
  return cljs.core.ci_reduce.cljs$core$IFn$_invoke$arity$2(a, b)
};
cljs.core.BlackNode.prototype.cljs$core$IReduce$_reduce$arity$3 = function(a, b, c) {
  return cljs.core.ci_reduce.cljs$core$IFn$_invoke$arity$3(a, b, c)
};
cljs.core.BlackNode.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return cljs.core.list.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([this.key, this.val], 0))
};
cljs.core.BlackNode.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  return 2
};
cljs.core.BlackNode.prototype.cljs$core$IStack$_peek$arity$1 = function(a) {
  return this.val
};
cljs.core.BlackNode.prototype.cljs$core$IStack$_pop$arity$1 = function(a) {
  return cljs.core.PersistentVector.fromArray([this.key], !0)
};
cljs.core.BlackNode.prototype.cljs$core$IVector$_assoc_n$arity$3 = function(a, b, c) {
  return cljs.core._assoc_n(cljs.core.PersistentVector.fromArray([this.key, this.val], !0), b, c)
};
cljs.core.BlackNode.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential(a, b)
};
cljs.core.BlackNode.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return cljs.core.with_meta(cljs.core.PersistentVector.fromArray([this.key, this.val], !0), b)
};
cljs.core.BlackNode.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return null
};
cljs.core.BlackNode.prototype.cljs$core$IIndexed$_nth$arity$2 = function(a, b) {
  return 0 === b ? this.key : 1 === b ? this.val : null
};
cljs.core.BlackNode.prototype.cljs$core$IIndexed$_nth$arity$3 = function(a, b, c) {
  return 0 === b ? this.key : 1 === b ? this.val : c
};
cljs.core.BlackNode.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return cljs.core.PersistentVector.EMPTY
};
cljs.core.__GT_BlackNode = function(a, b, c, d, e) {
  return new cljs.core.BlackNode(a, b, c, d, e)
};
cljs.core.RedNode = function(a, b, c, d, e) {
  this.key = a;
  this.val = b;
  this.left = c;
  this.right = d;
  this.__hash = e;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 32402207
};
cljs.core.RedNode.cljs$lang$type = !0;
cljs.core.RedNode.cljs$lang$ctorStr = "cljs.core/RedNode";
cljs.core.RedNode.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write(b, "cljs.core/RedNode")
};
cljs.core.RedNode.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  var b = this.__hash;
  return null != b ? b : this.__hash = a = cljs.core.hash_coll(a)
};
cljs.core.RedNode.prototype.cljs$core$ILookup$_lookup$arity$2 = function(a, b) {
  return a.cljs$core$IIndexed$_nth$arity$3(a, b, null)
};
cljs.core.RedNode.prototype.cljs$core$ILookup$_lookup$arity$3 = function(a, b, c) {
  return a.cljs$core$IIndexed$_nth$arity$3(a, b, c)
};
cljs.core.RedNode.prototype.cljs$core$IAssociative$_assoc$arity$3 = function(a, b, c) {
  return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(cljs.core.PersistentVector.fromArray([this.key, this.val], !0), b, c)
};
cljs.core.RedNode.prototype.call = function() {
  var a = null;
  return a = function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return this.cljs$core$ILookup$_lookup$arity$2(this, c);
      case 3:
        return this.cljs$core$ILookup$_lookup$arity$3(this, c, d)
    }
    throw Error("Invalid arity: " + arguments.length);
  }
}();
cljs.core.RedNode.prototype.apply = function(a, b) {
  a = this;
  return a.call.apply(a, [a].concat(b.slice()))
};
cljs.core.RedNode.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return cljs.core.PersistentVector.fromArray([this.key, this.val, b], !0)
};
cljs.core.RedNode.prototype.cljs$core$IMapEntry$_key$arity$1 = function(a) {
  return this.key
};
cljs.core.RedNode.prototype.cljs$core$IMapEntry$_val$arity$1 = function(a) {
  return this.val
};
cljs.core.RedNode.prototype.add_right = function(a) {
  return new cljs.core.RedNode(this.key, this.val, this.left, a, null)
};
cljs.core.RedNode.prototype.redden = function() {
  throw Error("red-black tree invariant violation");
};
cljs.core.RedNode.prototype.remove_right = function(a) {
  return new cljs.core.RedNode(this.key, this.val, this.left, a, null)
};
cljs.core.RedNode.prototype.replace = function(a, b, c, d) {
  return new cljs.core.RedNode(a, b, c, d, null)
};
cljs.core.RedNode.prototype.kv_reduce = function(a, b) {
  return cljs.core.tree_map_kv_reduce(this, a, b)
};
cljs.core.RedNode.prototype.remove_left = function(a) {
  return new cljs.core.RedNode(this.key, this.val, a, this.right, null)
};
cljs.core.RedNode.prototype.add_left = function(a) {
  return new cljs.core.RedNode(this.key, this.val, a, this.right, null)
};
cljs.core.RedNode.prototype.balance_left = function(a) {
  return this.left instanceof cljs.core.RedNode ? new cljs.core.RedNode(this.key, this.val, this.left.blacken(), new cljs.core.BlackNode(a.key, a.val, this.right, a.right, null), null) : this.right instanceof cljs.core.RedNode ? new cljs.core.RedNode(this.right.key, this.right.val, new cljs.core.BlackNode(this.key, this.val, this.left, this.right.left, null), new cljs.core.BlackNode(a.key, a.val, this.right.right, a.right, null), null) : new cljs.core.BlackNode(a.key, a.val, this, a.right, null)
};
cljs.core.RedNode.prototype.balance_right = function(a) {
  return this.right instanceof cljs.core.RedNode ? new cljs.core.RedNode(this.key, this.val, new cljs.core.BlackNode(a.key, a.val, a.left, this.left, null), this.right.blacken(), null) : this.left instanceof cljs.core.RedNode ? new cljs.core.RedNode(this.left.key, this.left.val, new cljs.core.BlackNode(a.key, a.val, a.left, this.left.left, null), new cljs.core.BlackNode(this.key, this.val, this.left.right, this.right, null), null) : new cljs.core.BlackNode(a.key, a.val, a.left, this, null)
};
cljs.core.RedNode.prototype.blacken = function() {
  return new cljs.core.BlackNode(this.key, this.val, this.left, this.right, null)
};
cljs.core.RedNode.prototype.cljs$core$IReduce$_reduce$arity$2 = function(a, b) {
  return cljs.core.ci_reduce.cljs$core$IFn$_invoke$arity$2(a, b)
};
cljs.core.RedNode.prototype.cljs$core$IReduce$_reduce$arity$3 = function(a, b, c) {
  return cljs.core.ci_reduce.cljs$core$IFn$_invoke$arity$3(a, b, c)
};
cljs.core.RedNode.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return cljs.core.list.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([this.key, this.val], 0))
};
cljs.core.RedNode.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  return 2
};
cljs.core.RedNode.prototype.cljs$core$IStack$_peek$arity$1 = function(a) {
  return this.val
};
cljs.core.RedNode.prototype.cljs$core$IStack$_pop$arity$1 = function(a) {
  return cljs.core.PersistentVector.fromArray([this.key], !0)
};
cljs.core.RedNode.prototype.cljs$core$IVector$_assoc_n$arity$3 = function(a, b, c) {
  return cljs.core._assoc_n(cljs.core.PersistentVector.fromArray([this.key, this.val], !0), b, c)
};
cljs.core.RedNode.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential(a, b)
};
cljs.core.RedNode.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return cljs.core.with_meta(cljs.core.PersistentVector.fromArray([this.key, this.val], !0), b)
};
cljs.core.RedNode.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return null
};
cljs.core.RedNode.prototype.cljs$core$IIndexed$_nth$arity$2 = function(a, b) {
  return 0 === b ? this.key : 1 === b ? this.val : null
};
cljs.core.RedNode.prototype.cljs$core$IIndexed$_nth$arity$3 = function(a, b, c) {
  return 0 === b ? this.key : 1 === b ? this.val : c
};
cljs.core.RedNode.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return cljs.core.PersistentVector.EMPTY
};
cljs.core.__GT_RedNode = function(a, b, c, d, e) {
  return new cljs.core.RedNode(a, b, c, d, e)
};
cljs.core.tree_map_add = function tree_map_add(b, c, d, e, f) {
  if(null == c) {
    return new cljs.core.RedNode(d, e, null, null, null)
  }
  var g = b.cljs$core$IFn$_invoke$arity$2 ? b.cljs$core$IFn$_invoke$arity$2(d, c.key) : b.call(null, d, c.key);
  if(0 === g) {
    return f[0] = c, null
  }
  if(0 > g) {
    return b = tree_map_add(b, c.left, d, e, f), null != b ? c.add_left(b) : null
  }
  b = tree_map_add(b, c.right, d, e, f);
  return null != b ? c.add_right(b) : null
};
cljs.core.tree_map_append = function tree_map_append(b, c) {
  if(null == b) {
    return c
  }
  if(null == c) {
    return b
  }
  if(b instanceof cljs.core.RedNode) {
    if(c instanceof cljs.core.RedNode) {
      var d = tree_map_append(b.right, c.left);
      return d instanceof cljs.core.RedNode ? new cljs.core.RedNode(d.key, d.val, new cljs.core.RedNode(b.key, b.val, b.left, d.left, null), new cljs.core.RedNode(c.key, c.val, d.right, c.right, null), null) : new cljs.core.RedNode(b.key, b.val, b.left, new cljs.core.RedNode(c.key, c.val, d, c.right, null), null)
    }
    return new cljs.core.RedNode(b.key, b.val, b.left, tree_map_append(b.right, c), null)
  }
  if(c instanceof cljs.core.RedNode) {
    return new cljs.core.RedNode(c.key, c.val, tree_map_append(b, c.left), c.right, null)
  }
  d = tree_map_append(b.right, c.left);
  return d instanceof cljs.core.RedNode ? new cljs.core.RedNode(d.key, d.val, new cljs.core.BlackNode(b.key, b.val, b.left, d.left, null), new cljs.core.BlackNode(c.key, c.val, d.right, c.right, null), null) : cljs.core.balance_left_del(b.key, b.val, b.left, new cljs.core.BlackNode(c.key, c.val, d, c.right, null))
};
cljs.core.tree_map_remove = function tree_map_remove(b, c, d, e) {
  if(null != c) {
    var f = b.cljs$core$IFn$_invoke$arity$2 ? b.cljs$core$IFn$_invoke$arity$2(d, c.key) : b.call(null, d, c.key);
    if(0 === f) {
      return e[0] = c, cljs.core.tree_map_append(c.left, c.right)
    }
    if(0 > f) {
      var g = tree_map_remove(b, c.left, d, e);
      return function() {
        var b = null != g;
        return b ? b : null != e[0]
      }() ? c.left instanceof cljs.core.BlackNode ? cljs.core.balance_left_del(c.key, c.val, g, c.right) : new cljs.core.RedNode(c.key, c.val, g, c.right, null) : null
    }
    g = tree_map_remove(b, c.right, d, e);
    return function() {
      var b = null != g;
      return b ? b : null != e[0]
    }() ? c.right instanceof cljs.core.BlackNode ? cljs.core.balance_right_del(c.key, c.val, c.left, g) : new cljs.core.RedNode(c.key, c.val, c.left, g, null) : null
  }
  return null
};
cljs.core.tree_map_replace = function tree_map_replace(b, c, d, e) {
  var f = c.key, g = b.cljs$core$IFn$_invoke$arity$2 ? b.cljs$core$IFn$_invoke$arity$2(d, f) : b.call(null, d, f);
  return 0 === g ? c.replace(f, e, c.left, c.right) : 0 > g ? c.replace(f, c.val, tree_map_replace(b, c.left, d, e), c.right) : c.replace(f, c.val, c.left, tree_map_replace(b, c.right, d, e))
};
cljs.core.PersistentTreeMap = function(a, b, c, d, e) {
  this.comp = a;
  this.tree = b;
  this.cnt = c;
  this.meta = d;
  this.__hash = e;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 418776847
};
cljs.core.PersistentTreeMap.cljs$lang$type = !0;
cljs.core.PersistentTreeMap.cljs$lang$ctorStr = "cljs.core/PersistentTreeMap";
cljs.core.PersistentTreeMap.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write(b, "cljs.core/PersistentTreeMap")
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  var b = this.__hash;
  return null != b ? b : this.__hash = a = cljs.core.hash_imap(a)
};
cljs.core.PersistentTreeMap.prototype.cljs$core$ILookup$_lookup$arity$2 = function(a, b) {
  return a.cljs$core$ILookup$_lookup$arity$3(a, b, null)
};
cljs.core.PersistentTreeMap.prototype.cljs$core$ILookup$_lookup$arity$3 = function(a, b, c) {
  a = a.entry_at(b);
  return null != a ? a.val : c
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IAssociative$_assoc$arity$3 = function(a, b, c) {
  var d = [null], e = cljs.core.tree_map_add(this.comp, this.tree, b, c, d);
  return null == e ? (d = cljs.core.nth.cljs$core$IFn$_invoke$arity$2(d, 0), cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(c, d.val) ? a : new cljs.core.PersistentTreeMap(this.comp, cljs.core.tree_map_replace(this.comp, this.tree, b, c), this.cnt, this.meta, null)) : new cljs.core.PersistentTreeMap(this.comp, e.blacken(), this.cnt + 1, this.meta, null)
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 = function(a, b) {
  return null != a.entry_at(b)
};
cljs.core.PersistentTreeMap.prototype.call = function() {
  var a = null;
  return a = function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return this.cljs$core$ILookup$_lookup$arity$2(this, c);
      case 3:
        return this.cljs$core$ILookup$_lookup$arity$3(this, c, d)
    }
    throw Error("Invalid arity: " + arguments.length);
  }
}();
cljs.core.PersistentTreeMap.prototype.apply = function(a, b) {
  a = this;
  return a.call.apply(a, [a].concat(b.slice()))
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = function(a, b, c) {
  return null != this.tree ? cljs.core.tree_map_kv_reduce(this.tree, b, c) : c
};
cljs.core.PersistentTreeMap.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return cljs.core.vector_QMARK_(b) ? a.cljs$core$IAssociative$_assoc$arity$3(a, cljs.core._nth.cljs$core$IFn$_invoke$arity$2(b, 0), cljs.core._nth.cljs$core$IFn$_invoke$arity$2(b, 1)) : cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(cljs.core._conj, a, b)
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IReversible$_rseq$arity$1 = function(a) {
  return 0 < this.cnt ? cljs.core.create_tree_map_seq(this.tree, !1, this.cnt) : null
};
cljs.core.PersistentTreeMap.prototype.entry_at = function(a) {
  for(var b = this.tree;;) {
    if(null != b) {
      var c = this.comp.cljs$core$IFn$_invoke$arity$2 ? this.comp.cljs$core$IFn$_invoke$arity$2(a, b.key) : this.comp.call(null, a, b.key);
      if(0 === c) {
        return b
      }
      b = 0 > c ? b.left : b.right
    }else {
      return null
    }
  }
};
cljs.core.PersistentTreeMap.prototype.cljs$core$ISorted$_sorted_seq$arity$2 = function(a, b) {
  return 0 < this.cnt ? cljs.core.create_tree_map_seq(this.tree, b, this.cnt) : null
};
cljs.core.PersistentTreeMap.prototype.cljs$core$ISorted$_sorted_seq_from$arity$3 = function(a, b, c) {
  if(0 < this.cnt) {
    a = null;
    for(var d = this.tree;;) {
      if(null != d) {
        var e = this.comp.cljs$core$IFn$_invoke$arity$2 ? this.comp.cljs$core$IFn$_invoke$arity$2(b, d.key) : this.comp.call(null, b, d.key);
        if(0 === e) {
          return new cljs.core.PersistentTreeMapSeq(null, cljs.core.conj.cljs$core$IFn$_invoke$arity$2(a, d), c, -1, null)
        }
        cljs.core.truth_(c) ? 0 > e ? (a = cljs.core.conj.cljs$core$IFn$_invoke$arity$2(a, d), d = d.left) : d = d.right : 0 < e ? (a = cljs.core.conj.cljs$core$IFn$_invoke$arity$2(a, d), d = d.right) : d = d.left
      }else {
        return null == a ? null : new cljs.core.PersistentTreeMapSeq(null, a, c, -1, null)
      }
    }
  }else {
    return null
  }
};
cljs.core.PersistentTreeMap.prototype.cljs$core$ISorted$_entry_key$arity$2 = function(a, b) {
  return cljs.core.key.cljs$core$IFn$_invoke$arity$1 ? cljs.core.key.cljs$core$IFn$_invoke$arity$1(b) : cljs.core.key.call(null, b)
};
cljs.core.PersistentTreeMap.prototype.cljs$core$ISorted$_comparator$arity$1 = function(a) {
  return this.comp
};
cljs.core.PersistentTreeMap.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return 0 < this.cnt ? cljs.core.create_tree_map_seq(this.tree, !0, this.cnt) : null
};
cljs.core.PersistentTreeMap.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  return this.cnt
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_map(a, b)
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.PersistentTreeMap(this.comp, this.tree, this.cnt, b, this.__hash)
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return this.meta
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return cljs.core.with_meta(cljs.core.PersistentTreeMap.EMPTY, this.meta)
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IMap$_dissoc$arity$2 = function(a, b) {
  var c = [null], d = cljs.core.tree_map_remove(this.comp, this.tree, b, c);
  return null == d ? null == cljs.core.nth.cljs$core$IFn$_invoke$arity$2(c, 0) ? a : new cljs.core.PersistentTreeMap(this.comp, null, 0, this.meta, null) : new cljs.core.PersistentTreeMap(this.comp, d.blacken(), this.cnt - 1, this.meta, null)
};
cljs.core.__GT_PersistentTreeMap = function(a, b, c, d, e) {
  return new cljs.core.PersistentTreeMap(a, b, c, d, e)
};
cljs.core.PersistentTreeMap.EMPTY = new cljs.core.PersistentTreeMap(cljs.core.compare, null, 0, null, 0);
cljs.core.hash_map = function() {
  var a = function(a) {
    a = cljs.core.seq(a);
    for(var b = cljs.core.transient$(cljs.core.PersistentHashMap.EMPTY);;) {
      if(a) {
        var e = cljs.core.nnext(a), b = cljs.core.assoc_BANG_(b, cljs.core.first(a), cljs.core.second(a));
        a = e
      }else {
        return cljs.core.persistent_BANG_(b)
      }
    }
  }, b = function(b) {
    var d = null;
    0 < arguments.length && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d)
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a(b)
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b
}();
cljs.core.array_map = function() {
  var a = function(a) {
    return new cljs.core.PersistentArrayMap(null, cljs.core.quot(cljs.core.count(a), 2), cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.array, a), null)
  }, b = function(b) {
    var d = null;
    0 < arguments.length && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d)
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a(b)
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b
}();
cljs.core.obj_map = function() {
  var a = function(a) {
    var b = [], e = {};
    for(a = cljs.core.seq(a);;) {
      if(a) {
        b.push(cljs.core.first(a)), e[cljs.core.first(a)] = cljs.core.second(a), a = cljs.core.nnext(a)
      }else {
        return cljs.core.ObjMap.fromObject.cljs$core$IFn$_invoke$arity$2 ? cljs.core.ObjMap.fromObject.cljs$core$IFn$_invoke$arity$2(b, e) : cljs.core.ObjMap.fromObject.call(null, b, e)
      }
    }
  }, b = function(b) {
    var d = null;
    0 < arguments.length && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d)
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a(b)
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b
}();
cljs.core.sorted_map = function() {
  var a = function(a) {
    a = cljs.core.seq(a);
    for(var b = cljs.core.PersistentTreeMap.EMPTY;;) {
      if(a) {
        var e = cljs.core.nnext(a), b = cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(b, cljs.core.first(a), cljs.core.second(a));
        a = e
      }else {
        return b
      }
    }
  }, b = function(b) {
    var d = null;
    0 < arguments.length && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d)
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a(b)
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b
}();
cljs.core.sorted_map_by = function() {
  var a = function(a, b) {
    for(var e = cljs.core.seq(b), f = new cljs.core.PersistentTreeMap(cljs.core.fn__GT_comparator(a), null, 0, null, 0);;) {
      if(e) {
        var g = cljs.core.nnext(e), f = cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(f, cljs.core.first(e), cljs.core.second(e)), e = g
      }else {
        return f
      }
    }
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e)
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b)
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b
}();
cljs.core.KeySeq = function(a, b) {
  this.mseq = a;
  this._meta = b;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 31850700
};
cljs.core.KeySeq.cljs$lang$type = !0;
cljs.core.KeySeq.cljs$lang$ctorStr = "cljs.core/KeySeq";
cljs.core.KeySeq.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write(b, "cljs.core/KeySeq")
};
cljs.core.KeySeq.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  return cljs.core.hash_coll(a)
};
cljs.core.KeySeq.prototype.cljs$core$INext$_next$arity$1 = function(a) {
  if(a = this.mseq) {
    var b;
    b = (b = a.cljs$lang$protocol_mask$partition0$ & 128) ? b : a.cljs$core$INext$;
    a = b ? !0 : a.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.type_satisfies_(cljs.core.INext, a)
  }else {
    a = cljs.core.type_satisfies_(cljs.core.INext, a)
  }
  a = a ? this.mseq.cljs$core$INext$_next$arity$1(this.mseq) : cljs.core.next(this.mseq);
  return null == a ? null : new cljs.core.KeySeq(a, this._meta)
};
cljs.core.KeySeq.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return cljs.core.cons(b, a)
};
cljs.core.KeySeq.prototype.toString = function() {
  return cljs.core.pr_str_STAR_(this)
};
cljs.core.KeySeq.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return a
};
cljs.core.KeySeq.prototype.cljs$core$ISeq$_first$arity$1 = function(a) {
  a = this.mseq.cljs$core$ISeq$_first$arity$1(this.mseq);
  return a.cljs$core$IMapEntry$_key$arity$1(a)
};
cljs.core.KeySeq.prototype.cljs$core$ISeq$_rest$arity$1 = function(a) {
  if(a = this.mseq) {
    var b;
    b = (b = a.cljs$lang$protocol_mask$partition0$ & 128) ? b : a.cljs$core$INext$;
    a = b ? !0 : a.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.type_satisfies_(cljs.core.INext, a)
  }else {
    a = cljs.core.type_satisfies_(cljs.core.INext, a)
  }
  a = a ? this.mseq.cljs$core$INext$_next$arity$1(this.mseq) : cljs.core.next(this.mseq);
  return null != a ? new cljs.core.KeySeq(a, this._meta) : cljs.core.List.EMPTY
};
cljs.core.KeySeq.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential(a, b)
};
cljs.core.KeySeq.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.KeySeq(this.mseq, b)
};
cljs.core.KeySeq.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return this._meta
};
cljs.core.KeySeq.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return cljs.core.with_meta(cljs.core.List.EMPTY, this._meta)
};
cljs.core.__GT_KeySeq = function(a, b) {
  return new cljs.core.KeySeq(a, b)
};
cljs.core.keys = function(a) {
  return(a = cljs.core.seq(a)) ? new cljs.core.KeySeq(a, null) : null
};
cljs.core.key = function(a) {
  return cljs.core._key(a)
};
cljs.core.ValSeq = function(a, b) {
  this.mseq = a;
  this._meta = b;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 31850700
};
cljs.core.ValSeq.cljs$lang$type = !0;
cljs.core.ValSeq.cljs$lang$ctorStr = "cljs.core/ValSeq";
cljs.core.ValSeq.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write(b, "cljs.core/ValSeq")
};
cljs.core.ValSeq.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  return cljs.core.hash_coll(a)
};
cljs.core.ValSeq.prototype.cljs$core$INext$_next$arity$1 = function(a) {
  if(a = this.mseq) {
    var b;
    b = (b = a.cljs$lang$protocol_mask$partition0$ & 128) ? b : a.cljs$core$INext$;
    a = b ? !0 : a.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.type_satisfies_(cljs.core.INext, a)
  }else {
    a = cljs.core.type_satisfies_(cljs.core.INext, a)
  }
  a = a ? this.mseq.cljs$core$INext$_next$arity$1(this.mseq) : cljs.core.next(this.mseq);
  return null == a ? null : new cljs.core.ValSeq(a, this._meta)
};
cljs.core.ValSeq.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return cljs.core.cons(b, a)
};
cljs.core.ValSeq.prototype.toString = function() {
  return cljs.core.pr_str_STAR_(this)
};
cljs.core.ValSeq.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return a
};
cljs.core.ValSeq.prototype.cljs$core$ISeq$_first$arity$1 = function(a) {
  a = this.mseq.cljs$core$ISeq$_first$arity$1(this.mseq);
  return a.cljs$core$IMapEntry$_val$arity$1(a)
};
cljs.core.ValSeq.prototype.cljs$core$ISeq$_rest$arity$1 = function(a) {
  if(a = this.mseq) {
    var b;
    b = (b = a.cljs$lang$protocol_mask$partition0$ & 128) ? b : a.cljs$core$INext$;
    a = b ? !0 : a.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.type_satisfies_(cljs.core.INext, a)
  }else {
    a = cljs.core.type_satisfies_(cljs.core.INext, a)
  }
  a = a ? this.mseq.cljs$core$INext$_next$arity$1(this.mseq) : cljs.core.next(this.mseq);
  return null != a ? new cljs.core.ValSeq(a, this._meta) : cljs.core.List.EMPTY
};
cljs.core.ValSeq.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential(a, b)
};
cljs.core.ValSeq.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.ValSeq(this.mseq, b)
};
cljs.core.ValSeq.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return this._meta
};
cljs.core.ValSeq.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return cljs.core.with_meta(cljs.core.List.EMPTY, this._meta)
};
cljs.core.__GT_ValSeq = function(a, b) {
  return new cljs.core.ValSeq(a, b)
};
cljs.core.vals = function(a) {
  return(a = cljs.core.seq(a)) ? new cljs.core.ValSeq(a, null) : null
};
cljs.core.val = function(a) {
  return cljs.core._val(a)
};
cljs.core.merge = function() {
  var a = function(a) {
    return cljs.core.truth_(cljs.core.some(cljs.core.identity, a)) ? cljs.core.reduce.cljs$core$IFn$_invoke$arity$2(function(a, b) {
      return cljs.core.conj.cljs$core$IFn$_invoke$arity$2(cljs.core.truth_(a) ? a : cljs.core.PersistentArrayMap.EMPTY, b)
    }, a) : null
  }, b = function(b) {
    var d = null;
    0 < arguments.length && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d)
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a(b)
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b
}();
cljs.core.merge_with = function() {
  var a = function(a, b) {
    if(cljs.core.truth_(cljs.core.some(cljs.core.identity, b))) {
      var e = function(a) {
        return function(b, c) {
          return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(a, cljs.core.truth_(b) ? b : cljs.core.PersistentArrayMap.EMPTY, cljs.core.seq(c))
        }
      }(function(b, d) {
        var e = cljs.core.first(d), k = cljs.core.second(d);
        return cljs.core.contains_QMARK_(b, e) ? cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(b, e, a.cljs$core$IFn$_invoke$arity$2 ? a.cljs$core$IFn$_invoke$arity$2(cljs.core.get.cljs$core$IFn$_invoke$arity$2(b, e), k) : a.call(null, cljs.core.get.cljs$core$IFn$_invoke$arity$2(b, e), k)) : cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(b, e, k)
      });
      return cljs.core.reduce.cljs$core$IFn$_invoke$arity$2(e, b)
    }
    return null
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e)
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b)
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b
}();
cljs.core.select_keys = function(a, b) {
  for(var c = cljs.core.PersistentArrayMap.EMPTY, d = cljs.core.seq(b);;) {
    if(d) {
      var e = cljs.core.first(d), f = cljs.core.get.cljs$core$IFn$_invoke$arity$3(a, e, "\ufdd0:cljs.core/not-found"), c = cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(f, "\ufdd0:cljs.core/not-found") ? cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(c, e, f) : c, d = cljs.core.next(d)
    }else {
      return c
    }
  }
};
cljs.core.PersistentHashSet = function(a, b, c) {
  this.meta = a;
  this.hash_map = b;
  this.__hash = c;
  this.cljs$lang$protocol_mask$partition1$ = 4;
  this.cljs$lang$protocol_mask$partition0$ = 15077647
};
cljs.core.PersistentHashSet.cljs$lang$type = !0;
cljs.core.PersistentHashSet.cljs$lang$ctorStr = "cljs.core/PersistentHashSet";
cljs.core.PersistentHashSet.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write(b, "cljs.core/PersistentHashSet")
};
cljs.core.PersistentHashSet.prototype.cljs$core$IEditableCollection$_as_transient$arity$1 = function(a) {
  return new cljs.core.TransientHashSet(cljs.core._as_transient(this.hash_map))
};
cljs.core.PersistentHashSet.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  var b = this.__hash;
  return null != b ? b : this.__hash = a = cljs.core.hash_iset(a)
};
cljs.core.PersistentHashSet.prototype.cljs$core$ILookup$_lookup$arity$2 = function(a, b) {
  return a.cljs$core$ILookup$_lookup$arity$3(a, b, null)
};
cljs.core.PersistentHashSet.prototype.cljs$core$ILookup$_lookup$arity$3 = function(a, b, c) {
  return cljs.core.truth_(cljs.core._contains_key_QMARK_(this.hash_map, b)) ? b : c
};
cljs.core.PersistentHashSet.prototype.call = function() {
  var a = null;
  return a = function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return this.cljs$core$ILookup$_lookup$arity$2(this, c);
      case 3:
        return this.cljs$core$ILookup$_lookup$arity$3(this, c, d)
    }
    throw Error("Invalid arity: " + arguments.length);
  }
}();
cljs.core.PersistentHashSet.prototype.apply = function(a, b) {
  a = this;
  return a.call.apply(a, [a].concat(b.slice()))
};
cljs.core.PersistentHashSet.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return new cljs.core.PersistentHashSet(this.meta, cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(this.hash_map, b, null), null)
};
cljs.core.PersistentHashSet.prototype.toString = function() {
  return cljs.core.pr_str_STAR_(this)
};
cljs.core.PersistentHashSet.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return cljs.core.keys(this.hash_map)
};
cljs.core.PersistentHashSet.prototype.cljs$core$ISet$_disjoin$arity$2 = function(a, b) {
  return new cljs.core.PersistentHashSet(this.meta, cljs.core._dissoc(this.hash_map, b), null)
};
cljs.core.PersistentHashSet.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  return cljs.core._count(this.hash_map)
};
cljs.core.PersistentHashSet.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  var c = cljs.core.set_QMARK_(b);
  return c ? (c = cljs.core.count(a) === cljs.core.count(b)) ? cljs.core.every_QMARK_(function(b) {
    return cljs.core.contains_QMARK_(a, b)
  }, b) : c : c
};
cljs.core.PersistentHashSet.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.PersistentHashSet(b, this.hash_map, this.__hash)
};
cljs.core.PersistentHashSet.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return this.meta
};
cljs.core.PersistentHashSet.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return cljs.core.with_meta(cljs.core.PersistentHashSet.EMPTY, this.meta)
};
cljs.core.__GT_PersistentHashSet = function(a, b, c) {
  return new cljs.core.PersistentHashSet(a, b, c)
};
cljs.core.PersistentHashSet.EMPTY = new cljs.core.PersistentHashSet(null, cljs.core.PersistentArrayMap.EMPTY, 0);
cljs.core.PersistentHashSet.fromArray = function(a, b) {
  var c = a.length;
  if(c / 2 <= cljs.core.PersistentArrayMap.HASHMAP_THRESHOLD) {
    return c = b ? a : a.slice(), new cljs.core.PersistentHashSet(null, cljs.core.PersistentArrayMap.fromArray.cljs$core$IFn$_invoke$arity$2 ? cljs.core.PersistentArrayMap.fromArray.cljs$core$IFn$_invoke$arity$2(c, !0) : cljs.core.PersistentArrayMap.fromArray.call(null, c, !0), null)
  }
  for(var d = 0, e = cljs.core.transient$(cljs.core.PersistentHashSet.EMPTY);;) {
    if(d < c) {
      var f = d + 2, e = cljs.core.conj_BANG_(e, a[d]), d = f
    }else {
      return cljs.core.persistent_BANG_(e)
    }
  }
};
cljs.core.TransientHashSet = function(a) {
  this.transient_map = a;
  this.cljs$lang$protocol_mask$partition0$ = 259;
  this.cljs$lang$protocol_mask$partition1$ = 136
};
cljs.core.TransientHashSet.cljs$lang$type = !0;
cljs.core.TransientHashSet.cljs$lang$ctorStr = "cljs.core/TransientHashSet";
cljs.core.TransientHashSet.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write(b, "cljs.core/TransientHashSet")
};
cljs.core.TransientHashSet.prototype.call = function() {
  var a = null;
  return a = function(a, c, d) {
    switch(arguments.length) {
      case 2:
        var e;
        e = cljs.core._lookup.cljs$core$IFn$_invoke$arity$3(this.transient_map, c, cljs.core.lookup_sentinel) === cljs.core.lookup_sentinel ? null : c;
        return e;
      case 3:
        return e = cljs.core._lookup.cljs$core$IFn$_invoke$arity$3(this.transient_map, c, cljs.core.lookup_sentinel) === cljs.core.lookup_sentinel ? d : c, e
    }
    throw Error("Invalid arity: " + arguments.length);
  }
}();
cljs.core.TransientHashSet.prototype.apply = function(a, b) {
  a = this;
  return a.call.apply(a, [a].concat(b.slice()))
};
cljs.core.TransientHashSet.prototype.cljs$core$ILookup$_lookup$arity$2 = function(a, b) {
  return a.cljs$core$ILookup$_lookup$arity$3(a, b, null)
};
cljs.core.TransientHashSet.prototype.cljs$core$ILookup$_lookup$arity$3 = function(a, b, c) {
  return cljs.core._lookup.cljs$core$IFn$_invoke$arity$3(this.transient_map, b, cljs.core.lookup_sentinel) === cljs.core.lookup_sentinel ? c : b
};
cljs.core.TransientHashSet.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  return cljs.core.count(this.transient_map)
};
cljs.core.TransientHashSet.prototype.cljs$core$ITransientSet$_disjoin_BANG_$arity$2 = function(a, b) {
  this.transient_map = cljs.core.dissoc_BANG_(this.transient_map, b);
  return a
};
cljs.core.TransientHashSet.prototype.cljs$core$ITransientCollection$_conj_BANG_$arity$2 = function(a, b) {
  this.transient_map = cljs.core.assoc_BANG_(this.transient_map, b, null);
  return a
};
cljs.core.TransientHashSet.prototype.cljs$core$ITransientCollection$_persistent_BANG_$arity$1 = function(a) {
  return new cljs.core.PersistentHashSet(null, cljs.core.persistent_BANG_(this.transient_map), null)
};
cljs.core.__GT_TransientHashSet = function(a) {
  return new cljs.core.TransientHashSet(a)
};
cljs.core.PersistentTreeSet = function(a, b, c) {
  this.meta = a;
  this.tree_map = b;
  this.__hash = c;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 417730831
};
cljs.core.PersistentTreeSet.cljs$lang$type = !0;
cljs.core.PersistentTreeSet.cljs$lang$ctorStr = "cljs.core/PersistentTreeSet";
cljs.core.PersistentTreeSet.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write(b, "cljs.core/PersistentTreeSet")
};
cljs.core.PersistentTreeSet.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  var b = this.__hash;
  return null != b ? b : this.__hash = a = cljs.core.hash_iset(a)
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ILookup$_lookup$arity$2 = function(a, b) {
  return a.cljs$core$ILookup$_lookup$arity$3(a, b, null)
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ILookup$_lookup$arity$3 = function(a, b, c) {
  a = this.tree_map.entry_at(b);
  return null != a ? a.key : c
};
cljs.core.PersistentTreeSet.prototype.call = function() {
  var a = null;
  return a = function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return this.cljs$core$ILookup$_lookup$arity$2(this, c);
      case 3:
        return this.cljs$core$ILookup$_lookup$arity$3(this, c, d)
    }
    throw Error("Invalid arity: " + arguments.length);
  }
}();
cljs.core.PersistentTreeSet.prototype.apply = function(a, b) {
  a = this;
  return a.call.apply(a, [a].concat(b.slice()))
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return new cljs.core.PersistentTreeSet(this.meta, cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(this.tree_map, b, null), null)
};
cljs.core.PersistentTreeSet.prototype.cljs$core$IReversible$_rseq$arity$1 = function(a) {
  return cljs.core.map.cljs$core$IFn$_invoke$arity$2(cljs.core.key, cljs.core.rseq(this.tree_map))
};
cljs.core.PersistentTreeSet.prototype.toString = function() {
  return cljs.core.pr_str_STAR_(this)
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ISorted$_sorted_seq$arity$2 = function(a, b) {
  return cljs.core.map.cljs$core$IFn$_invoke$arity$2(cljs.core.key, cljs.core._sorted_seq(this.tree_map, b))
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ISorted$_sorted_seq_from$arity$3 = function(a, b, c) {
  return cljs.core.map.cljs$core$IFn$_invoke$arity$2(cljs.core.key, cljs.core._sorted_seq_from(this.tree_map, b, c))
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ISorted$_entry_key$arity$2 = function(a, b) {
  return b
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ISorted$_comparator$arity$1 = function(a) {
  return cljs.core._comparator(this.tree_map)
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return cljs.core.keys(this.tree_map)
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ISet$_disjoin$arity$2 = function(a, b) {
  return new cljs.core.PersistentTreeSet(this.meta, cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(this.tree_map, b), null)
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  return cljs.core.count(this.tree_map)
};
cljs.core.PersistentTreeSet.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  var c = cljs.core.set_QMARK_(b);
  return c ? (c = cljs.core.count(a) === cljs.core.count(b)) ? cljs.core.every_QMARK_(function(b) {
    return cljs.core.contains_QMARK_(a, b)
  }, b) : c : c
};
cljs.core.PersistentTreeSet.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.PersistentTreeSet(b, this.tree_map, this.__hash)
};
cljs.core.PersistentTreeSet.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return this.meta
};
cljs.core.PersistentTreeSet.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return cljs.core.with_meta(cljs.core.PersistentTreeSet.EMPTY, this.meta)
};
cljs.core.__GT_PersistentTreeSet = function(a, b, c) {
  return new cljs.core.PersistentTreeSet(a, b, c)
};
cljs.core.PersistentTreeSet.EMPTY = new cljs.core.PersistentTreeSet(null, cljs.core.PersistentTreeMap.EMPTY, 0);
cljs.core.hash_set = function() {
  var a = null, b = function() {
    return cljs.core.PersistentHashSet.EMPTY
  }, c = function() {
    var a = function(a) {
      var b;
      b = (b = a instanceof cljs.core.IndexedSeq) ? a.arr.length < cljs.core.PersistentArrayMap.HASHMAP_THRESHOLD : b;
      if(b) {
        a = a.arr;
        b = a.length;
        for(var c = Array(2 * b), d = 0;;) {
          if(d < b) {
            var e = 2 * d;
            c[e] = a[d];
            c[e + 1] = null;
            d += 1
          }else {
            return cljs.core.PersistentHashSet.fromArray.cljs$core$IFn$_invoke$arity$2 ? cljs.core.PersistentHashSet.fromArray.cljs$core$IFn$_invoke$arity$2(c, !0) : cljs.core.PersistentHashSet.fromArray.call(null, c, !0)
          }
        }
      }else {
        for(c = cljs.core._as_transient(cljs.core.PersistentHashSet.EMPTY);;) {
          if(null != a) {
            b = a.cljs$core$INext$_next$arity$1(a), c = c.cljs$core$ITransientCollection$_conj_BANG_$arity$2(c, a.cljs$core$ISeq$_first$arity$1(a)), a = b
          }else {
            return c.cljs$core$ITransientCollection$_persistent_BANG_$arity$1(c)
          }
        }
      }
    }, b = function(b) {
      var c = null;
      0 < arguments.length && (c = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
      return a.call(this, c)
    };
    b.cljs$lang$maxFixedArity = 0;
    b.cljs$lang$applyTo = function(b) {
      b = cljs.core.seq(b);
      return a(b)
    };
    b.cljs$core$IFn$_invoke$arity$variadic = a;
    return b
  }(), a = function(a) {
    switch(arguments.length) {
      case 0:
        return b.call(this);
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq(arguments, 0))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 0;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$0 = b;
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.set = function(a) {
  return cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.hash_set, a)
};
cljs.core.sorted_set = function() {
  var a = function(a) {
    return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(cljs.core._conj, cljs.core.PersistentTreeSet.EMPTY, a)
  }, b = function(b) {
    var d = null;
    0 < arguments.length && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d)
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a(b)
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b
}();
cljs.core.sorted_set_by = function() {
  var a = function(a, b) {
    return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(cljs.core._conj, new cljs.core.PersistentTreeSet(null, cljs.core.sorted_map_by(a), 0), b)
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e)
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b)
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b
}();
cljs.core.replace = function(a, b) {
  if(cljs.core.vector_QMARK_(b)) {
    var c = cljs.core.count(b);
    return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(function(b, c) {
      var f = cljs.core.find(a, cljs.core.nth.cljs$core$IFn$_invoke$arity$2(b, c));
      return cljs.core.truth_(f) ? cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(b, c, cljs.core.second(f)) : b
    }, b, cljs.core.take(c, cljs.core.iterate(cljs.core.inc, 0)))
  }
  return cljs.core.map.cljs$core$IFn$_invoke$arity$2(function(b) {
    var c = cljs.core.find(a, b);
    return cljs.core.truth_(c) ? cljs.core.second(c) : b
  }, b)
};
cljs.core.distinct = function(a) {
  return function c(a, e) {
    return new cljs.core.LazySeq(null, !1, function() {
      return function(a, d) {
        for(;;) {
          var e = a, k = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(e, 0, null);
          if(e = cljs.core.seq(e)) {
            if(cljs.core.contains_QMARK_(d, k)) {
              k = cljs.core.rest(e), e = d, a = k, d = e
            }else {
              return cljs.core.cons(k, c(cljs.core.rest(e), cljs.core.conj.cljs$core$IFn$_invoke$arity$2(d, k)))
            }
          }else {
            return null
          }
        }
      }.call(null, a, e)
    }, null)
  }(a, cljs.core.PersistentHashSet.EMPTY)
};
cljs.core.butlast = function(a) {
  for(var b = cljs.core.PersistentVector.EMPTY;;) {
    if(cljs.core.next(a)) {
      b = cljs.core.conj.cljs$core$IFn$_invoke$arity$2(b, cljs.core.first(a)), a = cljs.core.next(a)
    }else {
      return cljs.core.seq(b)
    }
  }
};
cljs.core.name = function(a) {
  var b;
  a ? (b = (b = a.cljs$lang$protocol_mask$partition1$ & 4096) ? b : a.cljs$core$INamed$, b = b ? !0 : !1) : b = !1;
  if(b) {
    return a.cljs$core$INamed$_name$arity$1(a)
  }
  if(cljs.core.string_QMARK_(a)) {
    return a
  }
  if(cljs.core.keyword_QMARK_(a)) {
    return b = a.lastIndexOf("/", a.length - 2), 0 > b ? cljs.core.subs.cljs$core$IFn$_invoke$arity$2(a, 2) : cljs.core.subs.cljs$core$IFn$_invoke$arity$2(a, b + 1)
  }
  throw Error([cljs.core.str("Doesn't support name: "), cljs.core.str(a)].join(""));
};
cljs.core.namespace = function(a) {
  var b;
  a ? (b = (b = a.cljs$lang$protocol_mask$partition1$ & 4096) ? b : a.cljs$core$INamed$, b = b ? !0 : !1) : b = !1;
  if(b) {
    return a.cljs$core$INamed$_namespace$arity$1(a)
  }
  if(cljs.core.keyword_QMARK_(a)) {
    return b = a.lastIndexOf("/", a.length - 2), -1 < b ? cljs.core.subs.cljs$core$IFn$_invoke$arity$3(a, 2, b) : null
  }
  throw Error([cljs.core.str("Doesn't support namespace: "), cljs.core.str(a)].join(""));
};
cljs.core.zipmap = function(a, b) {
  for(var c = cljs.core.transient$(cljs.core.PersistentArrayMap.EMPTY), d = cljs.core.seq(a), e = cljs.core.seq(b);;) {
    var f;
    f = (f = d) ? e : f;
    if(f) {
      c = cljs.core.assoc_BANG_(c, cljs.core.first(d), cljs.core.first(e)), d = cljs.core.next(d), e = cljs.core.next(e)
    }else {
      return cljs.core.persistent_BANG_(c)
    }
  }
};
cljs.core.max_key = function() {
  var a = null, b = function(a, b, c) {
    return(a.cljs$core$IFn$_invoke$arity$1 ? a.cljs$core$IFn$_invoke$arity$1(b) : a.call(null, b)) > (a.cljs$core$IFn$_invoke$arity$1 ? a.cljs$core$IFn$_invoke$arity$1(c) : a.call(null, c)) ? b : c
  }, c = function() {
    var b = function(b, c, d, e) {
      return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(function(c, d) {
        return a.cljs$core$IFn$_invoke$arity$3(b, c, d)
      }, a.cljs$core$IFn$_invoke$arity$3(b, c, d), e)
    }, c = function(a, c, e, k) {
      var l = null;
      3 < arguments.length && (l = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
      return b.call(this, a, c, e, l)
    };
    c.cljs$lang$maxFixedArity = 3;
    c.cljs$lang$applyTo = function(a) {
      var c = cljs.core.first(a);
      a = cljs.core.next(a);
      var e = cljs.core.first(a);
      a = cljs.core.next(a);
      var k = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(c, e, k, a)
    };
    c.cljs$core$IFn$_invoke$arity$variadic = b;
    return c
  }(), a = function(a, e, f, g) {
    switch(arguments.length) {
      case 2:
        return e;
      case 3:
        return b.call(this, a, e, f);
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(a, e, f, cljs.core.array_seq(arguments, 3))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 3;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
    return b
  };
  a.cljs$core$IFn$_invoke$arity$3 = b;
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.min_key = function() {
  var a = null, b = function(a, b, c) {
    return(a.cljs$core$IFn$_invoke$arity$1 ? a.cljs$core$IFn$_invoke$arity$1(b) : a.call(null, b)) < (a.cljs$core$IFn$_invoke$arity$1 ? a.cljs$core$IFn$_invoke$arity$1(c) : a.call(null, c)) ? b : c
  }, c = function() {
    var b = function(b, c, d, e) {
      return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(function(c, d) {
        return a.cljs$core$IFn$_invoke$arity$3(b, c, d)
      }, a.cljs$core$IFn$_invoke$arity$3(b, c, d), e)
    }, c = function(a, c, e, k) {
      var l = null;
      3 < arguments.length && (l = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
      return b.call(this, a, c, e, l)
    };
    c.cljs$lang$maxFixedArity = 3;
    c.cljs$lang$applyTo = function(a) {
      var c = cljs.core.first(a);
      a = cljs.core.next(a);
      var e = cljs.core.first(a);
      a = cljs.core.next(a);
      var k = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(c, e, k, a)
    };
    c.cljs$core$IFn$_invoke$arity$variadic = b;
    return c
  }(), a = function(a, e, f, g) {
    switch(arguments.length) {
      case 2:
        return e;
      case 3:
        return b.call(this, a, e, f);
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(a, e, f, cljs.core.array_seq(arguments, 3))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 3;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
    return b
  };
  a.cljs$core$IFn$_invoke$arity$3 = b;
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.partition_all = function() {
  var a = null, b = function(b, c) {
    return a.cljs$core$IFn$_invoke$arity$3(b, b, c)
  }, c = function(b, c, f) {
    return new cljs.core.LazySeq(null, !1, function() {
      var g = cljs.core.seq(f);
      return g ? cljs.core.cons(cljs.core.take(b, g), a.cljs$core$IFn$_invoke$arity$3(b, c, cljs.core.drop(c, g))) : null
    }, null)
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a
}();
cljs.core.take_while = function take_while(b, c) {
  return new cljs.core.LazySeq(null, !1, function() {
    var d = cljs.core.seq(c);
    return d ? cljs.core.truth_(b.cljs$core$IFn$_invoke$arity$1 ? b.cljs$core$IFn$_invoke$arity$1(cljs.core.first(d)) : b.call(null, cljs.core.first(d))) ? cljs.core.cons(cljs.core.first(d), take_while(b, cljs.core.rest(d))) : null : null
  }, null)
};
cljs.core.mk_bound_fn = function(a, b, c) {
  return function(d) {
    var e = cljs.core._comparator(a);
    return b.cljs$core$IFn$_invoke$arity$2 ? b.cljs$core$IFn$_invoke$arity$2(e.cljs$core$IFn$_invoke$arity$2 ? e.cljs$core$IFn$_invoke$arity$2(cljs.core._entry_key(a, d), c) : e.call(null, cljs.core._entry_key(a, d), c), 0) : b.call(null, e.cljs$core$IFn$_invoke$arity$2 ? e.cljs$core$IFn$_invoke$arity$2(cljs.core._entry_key(a, d), c) : e.call(null, cljs.core._entry_key(a, d), c), 0)
  }
};
cljs.core.subseq = function() {
  var a = null, b = function(a, b, c) {
    var g = cljs.core.mk_bound_fn(a, b, c);
    return cljs.core.truth_(cljs.core.PersistentHashSet.fromArray([cljs.core._GT_, null, cljs.core._GT__EQ_, null], !0).call(null, b)) ? (a = cljs.core._sorted_seq_from(a, c, !0), cljs.core.truth_(a) ? (b = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(a, 0, null), cljs.core.truth_(g.cljs$core$IFn$_invoke$arity$1 ? g.cljs$core$IFn$_invoke$arity$1(b) : g.call(null, b)) ? a : cljs.core.next(a)) : null) : cljs.core.take_while(g, cljs.core._sorted_seq(a, !0))
  }, c = function(a, b, c, g, h) {
    var k = cljs.core._sorted_seq_from(a, c, !0);
    if(cljs.core.truth_(k)) {
      var l = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(k, 0, null);
      return cljs.core.take_while(cljs.core.mk_bound_fn(a, g, h), cljs.core.truth_(cljs.core.mk_bound_fn(a, b, c).call(null, l)) ? k : cljs.core.next(k))
    }
    return null
  }, a = function(a, e, f, g, h) {
    switch(arguments.length) {
      case 3:
        return b.call(this, a, e, f);
      case 5:
        return c.call(this, a, e, f, g, h)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$3 = b;
  a.cljs$core$IFn$_invoke$arity$5 = c;
  return a
}();
cljs.core.rsubseq = function() {
  var a = null, b = function(a, b, c) {
    var g = cljs.core.mk_bound_fn(a, b, c);
    return cljs.core.truth_(cljs.core.PersistentHashSet.fromArray([cljs.core._LT_, null, cljs.core._LT__EQ_, null], !0).call(null, b)) ? (a = cljs.core._sorted_seq_from(a, c, !1), cljs.core.truth_(a) ? (b = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(a, 0, null), cljs.core.truth_(g.cljs$core$IFn$_invoke$arity$1 ? g.cljs$core$IFn$_invoke$arity$1(b) : g.call(null, b)) ? a : cljs.core.next(a)) : null) : cljs.core.take_while(g, cljs.core._sorted_seq(a, !1))
  }, c = function(a, b, c, g, h) {
    var k = cljs.core._sorted_seq_from(a, h, !1);
    if(cljs.core.truth_(k)) {
      var l = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(k, 0, null);
      return cljs.core.take_while(cljs.core.mk_bound_fn(a, b, c), cljs.core.truth_(cljs.core.mk_bound_fn(a, g, h).call(null, l)) ? k : cljs.core.next(k))
    }
    return null
  }, a = function(a, e, f, g, h) {
    switch(arguments.length) {
      case 3:
        return b.call(this, a, e, f);
      case 5:
        return c.call(this, a, e, f, g, h)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$3 = b;
  a.cljs$core$IFn$_invoke$arity$5 = c;
  return a
}();
cljs.core.Range = function(a, b, c, d, e) {
  this.meta = a;
  this.start = b;
  this.end = c;
  this.step = d;
  this.__hash = e;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 32375006
};
cljs.core.Range.cljs$lang$type = !0;
cljs.core.Range.cljs$lang$ctorStr = "cljs.core/Range";
cljs.core.Range.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write(b, "cljs.core/Range")
};
cljs.core.Range.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  var b = this.__hash;
  return null != b ? b : this.__hash = a = cljs.core.hash_coll(a)
};
cljs.core.Range.prototype.cljs$core$INext$_next$arity$1 = function(a) {
  return 0 < this.step ? this.start + this.step < this.end ? new cljs.core.Range(this.meta, this.start + this.step, this.end, this.step, null) : null : this.start + this.step > this.end ? new cljs.core.Range(this.meta, this.start + this.step, this.end, this.step, null) : null
};
cljs.core.Range.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return cljs.core.cons(b, a)
};
cljs.core.Range.prototype.toString = function() {
  return cljs.core.pr_str_STAR_(this)
};
cljs.core.Range.prototype.cljs$core$IReduce$_reduce$arity$2 = function(a, b) {
  return cljs.core.ci_reduce.cljs$core$IFn$_invoke$arity$2(a, b)
};
cljs.core.Range.prototype.cljs$core$IReduce$_reduce$arity$3 = function(a, b, c) {
  return cljs.core.ci_reduce.cljs$core$IFn$_invoke$arity$3(a, b, c)
};
cljs.core.Range.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return 0 < this.step ? this.start < this.end ? a : null : this.start > this.end ? a : null
};
cljs.core.Range.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  return cljs.core.not(a.cljs$core$ISeqable$_seq$arity$1(a)) ? 0 : Math.ceil((this.end - this.start) / this.step)
};
cljs.core.Range.prototype.cljs$core$ISeq$_first$arity$1 = function(a) {
  return this.start
};
cljs.core.Range.prototype.cljs$core$ISeq$_rest$arity$1 = function(a) {
  return null != a.cljs$core$ISeqable$_seq$arity$1(a) ? new cljs.core.Range(this.meta, this.start + this.step, this.end, this.step, null) : cljs.core.List.EMPTY
};
cljs.core.Range.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential(a, b)
};
cljs.core.Range.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.Range(b, this.start, this.end, this.step, this.__hash)
};
cljs.core.Range.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return this.meta
};
cljs.core.Range.prototype.cljs$core$IIndexed$_nth$arity$2 = function(a, b) {
  if(b < a.cljs$core$ICounted$_count$arity$1(a)) {
    return this.start + b * this.step
  }
  var c;
  c = (c = this.start > this.end) ? 0 === this.step : c;
  if(c) {
    return this.start
  }
  throw Error("Index out of bounds");
};
cljs.core.Range.prototype.cljs$core$IIndexed$_nth$arity$3 = function(a, b, c) {
  if(b < a.cljs$core$ICounted$_count$arity$1(a)) {
    return this.start + b * this.step
  }
  a = (a = this.start > this.end) ? 0 === this.step : a;
  return a ? this.start : c
};
cljs.core.Range.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return cljs.core.with_meta(cljs.core.List.EMPTY, this.meta)
};
cljs.core.__GT_Range = function(a, b, c, d, e) {
  return new cljs.core.Range(a, b, c, d, e)
};
cljs.core.range = function() {
  var a = null, b = function() {
    return a.cljs$core$IFn$_invoke$arity$3(0, Number.MAX_VALUE, 1)
  }, c = function(b) {
    return a.cljs$core$IFn$_invoke$arity$3(0, b, 1)
  }, d = function(b, c) {
    return a.cljs$core$IFn$_invoke$arity$3(b, c, 1)
  }, e = function(a, b, c) {
    return new cljs.core.Range(null, a, b, c, null)
  }, a = function(a, g, h) {
    switch(arguments.length) {
      case 0:
        return b.call(this);
      case 1:
        return c.call(this, a);
      case 2:
        return d.call(this, a, g);
      case 3:
        return e.call(this, a, g, h)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$0 = b;
  a.cljs$core$IFn$_invoke$arity$1 = c;
  a.cljs$core$IFn$_invoke$arity$2 = d;
  a.cljs$core$IFn$_invoke$arity$3 = e;
  return a
}();
cljs.core.take_nth = function take_nth(b, c) {
  return new cljs.core.LazySeq(null, !1, function() {
    var d = cljs.core.seq(c);
    return d ? cljs.core.cons(cljs.core.first(d), take_nth(b, cljs.core.drop(b, d))) : null
  }, null)
};
cljs.core.split_with = function(a, b) {
  return cljs.core.PersistentVector.fromArray([cljs.core.take_while(a, b), cljs.core.drop_while(a, b)], !0)
};
cljs.core.partition_by = function partition_by(b, c) {
  return new cljs.core.LazySeq(null, !1, function() {
    var d = cljs.core.seq(c);
    if(d) {
      var e = cljs.core.first(d), f = b.cljs$core$IFn$_invoke$arity$1 ? b.cljs$core$IFn$_invoke$arity$1(e) : b.call(null, e), e = cljs.core.cons(e, cljs.core.take_while(function(c, d) {
        return function(c) {
          return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(d, b.cljs$core$IFn$_invoke$arity$1 ? b.cljs$core$IFn$_invoke$arity$1(c) : b.call(null, c))
        }
      }(e, f), cljs.core.next(d)));
      return cljs.core.cons(e, partition_by(b, cljs.core.seq(cljs.core.drop(cljs.core.count(e), d))))
    }
    return null
  }, null)
};
cljs.core.frequencies = function(a) {
  return cljs.core.persistent_BANG_(cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(function(a, c) {
    return cljs.core.assoc_BANG_(a, c, cljs.core.get.cljs$core$IFn$_invoke$arity$3(a, c, 0) + 1)
  }, cljs.core.transient$(cljs.core.PersistentArrayMap.EMPTY), a))
};
cljs.core.reductions = function() {
  var a = null, b = function(b, c) {
    return new cljs.core.LazySeq(null, !1, function() {
      var f = cljs.core.seq(c);
      return f ? a.cljs$core$IFn$_invoke$arity$3(b, cljs.core.first(f), cljs.core.rest(f)) : cljs.core.list.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([b.cljs$core$IFn$_invoke$arity$0 ? b.cljs$core$IFn$_invoke$arity$0() : b.call(null)], 0))
    }, null)
  }, c = function(b, c, f) {
    return cljs.core.cons(c, new cljs.core.LazySeq(null, !1, function() {
      var g = cljs.core.seq(f);
      return g ? a.cljs$core$IFn$_invoke$arity$3(b, b.cljs$core$IFn$_invoke$arity$2 ? b.cljs$core$IFn$_invoke$arity$2(c, cljs.core.first(g)) : b.call(null, c, cljs.core.first(g)), cljs.core.rest(g)) : null
    }, null))
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a
}();
cljs.core.juxt = function() {
  var a = null, b = function(a) {
    return function() {
      var b = null, c = function() {
        var b = function(b, c, d, e) {
          return cljs.core.vector.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([cljs.core.apply.cljs$core$IFn$_invoke$arity$5(a, b, c, d, e)], 0))
        }, c = function(a, c, d, e) {
          var f = null;
          3 < arguments.length && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
          return b.call(this, a, c, d, f)
        };
        c.cljs$lang$maxFixedArity = 3;
        c.cljs$lang$applyTo = function(a) {
          var c = cljs.core.first(a);
          a = cljs.core.next(a);
          var d = cljs.core.first(a);
          a = cljs.core.next(a);
          var e = cljs.core.first(a);
          a = cljs.core.rest(a);
          return b(c, d, e, a)
        };
        c.cljs$core$IFn$_invoke$arity$variadic = b;
        return c
      }(), b = function(b, d, e, g) {
        switch(arguments.length) {
          case 0:
            return cljs.core.vector.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([a.cljs$core$IFn$_invoke$arity$0 ? a.cljs$core$IFn$_invoke$arity$0() : a.call(null)], 0));
          case 1:
            return cljs.core.vector.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([a.cljs$core$IFn$_invoke$arity$1 ? a.cljs$core$IFn$_invoke$arity$1(b) : a.call(null, b)], 0));
          case 2:
            return cljs.core.vector.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([a.cljs$core$IFn$_invoke$arity$2 ? a.cljs$core$IFn$_invoke$arity$2(b, d) : a.call(null, b, d)], 0));
          case 3:
            return cljs.core.vector.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([a.cljs$core$IFn$_invoke$arity$3 ? a.cljs$core$IFn$_invoke$arity$3(b, d, e) : a.call(null, b, d, e)], 0));
          default:
            return c.cljs$core$IFn$_invoke$arity$variadic(b, d, e, cljs.core.array_seq(arguments, 3))
        }
        throw Error("Invalid arity: " + arguments.length);
      };
      b.cljs$lang$maxFixedArity = 3;
      b.cljs$lang$applyTo = c.cljs$lang$applyTo;
      return b
    }()
  }, c = function(a, b) {
    return function() {
      var c = null, d = function() {
        var c = function(c, d, e, h) {
          return cljs.core.vector.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([cljs.core.apply.cljs$core$IFn$_invoke$arity$5(a, c, d, e, h), cljs.core.apply.cljs$core$IFn$_invoke$arity$5(b, c, d, e, h)], 0))
        }, d = function(a, b, d, e) {
          var f = null;
          3 < arguments.length && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
          return c.call(this, a, b, d, f)
        };
        d.cljs$lang$maxFixedArity = 3;
        d.cljs$lang$applyTo = function(a) {
          var b = cljs.core.first(a);
          a = cljs.core.next(a);
          var d = cljs.core.first(a);
          a = cljs.core.next(a);
          var e = cljs.core.first(a);
          a = cljs.core.rest(a);
          return c(b, d, e, a)
        };
        d.cljs$core$IFn$_invoke$arity$variadic = c;
        return d
      }(), c = function(c, e, h, p) {
        switch(arguments.length) {
          case 0:
            return cljs.core.vector.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([a.cljs$core$IFn$_invoke$arity$0 ? a.cljs$core$IFn$_invoke$arity$0() : a.call(null), b.cljs$core$IFn$_invoke$arity$0 ? b.cljs$core$IFn$_invoke$arity$0() : b.call(null)], 0));
          case 1:
            return cljs.core.vector.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([a.cljs$core$IFn$_invoke$arity$1 ? a.cljs$core$IFn$_invoke$arity$1(c) : a.call(null, c), b.cljs$core$IFn$_invoke$arity$1 ? b.cljs$core$IFn$_invoke$arity$1(c) : b.call(null, c)], 0));
          case 2:
            return cljs.core.vector.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([a.cljs$core$IFn$_invoke$arity$2 ? a.cljs$core$IFn$_invoke$arity$2(c, e) : a.call(null, c, e), b.cljs$core$IFn$_invoke$arity$2 ? b.cljs$core$IFn$_invoke$arity$2(c, e) : b.call(null, c, e)], 0));
          case 3:
            return cljs.core.vector.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([a.cljs$core$IFn$_invoke$arity$3 ? a.cljs$core$IFn$_invoke$arity$3(c, e, h) : a.call(null, c, e, h), b.cljs$core$IFn$_invoke$arity$3 ? b.cljs$core$IFn$_invoke$arity$3(c, e, h) : b.call(null, c, e, h)], 0));
          default:
            return d.cljs$core$IFn$_invoke$arity$variadic(c, e, h, cljs.core.array_seq(arguments, 3))
        }
        throw Error("Invalid arity: " + arguments.length);
      };
      c.cljs$lang$maxFixedArity = 3;
      c.cljs$lang$applyTo = d.cljs$lang$applyTo;
      return c
    }()
  }, d = function(a, b, c) {
    return function() {
      var d = null, e = function() {
        var d = function(d, e, k, l) {
          return cljs.core.vector.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([cljs.core.apply.cljs$core$IFn$_invoke$arity$5(a, d, e, k, l), cljs.core.apply.cljs$core$IFn$_invoke$arity$5(b, d, e, k, l), cljs.core.apply.cljs$core$IFn$_invoke$arity$5(c, d, e, k, l)], 0))
        }, e = function(a, b, c, e) {
          var f = null;
          3 < arguments.length && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
          return d.call(this, a, b, c, f)
        };
        e.cljs$lang$maxFixedArity = 3;
        e.cljs$lang$applyTo = function(a) {
          var b = cljs.core.first(a);
          a = cljs.core.next(a);
          var c = cljs.core.first(a);
          a = cljs.core.next(a);
          var e = cljs.core.first(a);
          a = cljs.core.rest(a);
          return d(b, c, e, a)
        };
        e.cljs$core$IFn$_invoke$arity$variadic = d;
        return e
      }(), d = function(d, k, p, q) {
        switch(arguments.length) {
          case 0:
            return cljs.core.vector.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([a.cljs$core$IFn$_invoke$arity$0 ? a.cljs$core$IFn$_invoke$arity$0() : a.call(null), b.cljs$core$IFn$_invoke$arity$0 ? b.cljs$core$IFn$_invoke$arity$0() : b.call(null), c.cljs$core$IFn$_invoke$arity$0 ? c.cljs$core$IFn$_invoke$arity$0() : c.call(null)], 0));
          case 1:
            return cljs.core.vector.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([a.cljs$core$IFn$_invoke$arity$1 ? a.cljs$core$IFn$_invoke$arity$1(d) : a.call(null, d), b.cljs$core$IFn$_invoke$arity$1 ? b.cljs$core$IFn$_invoke$arity$1(d) : b.call(null, d), c.cljs$core$IFn$_invoke$arity$1 ? c.cljs$core$IFn$_invoke$arity$1(d) : c.call(null, d)], 0));
          case 2:
            return cljs.core.vector.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([a.cljs$core$IFn$_invoke$arity$2 ? a.cljs$core$IFn$_invoke$arity$2(d, k) : a.call(null, d, k), b.cljs$core$IFn$_invoke$arity$2 ? b.cljs$core$IFn$_invoke$arity$2(d, k) : b.call(null, d, k), c.cljs$core$IFn$_invoke$arity$2 ? c.cljs$core$IFn$_invoke$arity$2(d, k) : c.call(null, d, k)], 0));
          case 3:
            return cljs.core.vector.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([a.cljs$core$IFn$_invoke$arity$3 ? a.cljs$core$IFn$_invoke$arity$3(d, k, p) : a.call(null, d, k, p), b.cljs$core$IFn$_invoke$arity$3 ? b.cljs$core$IFn$_invoke$arity$3(d, k, p) : b.call(null, d, k, p), c.cljs$core$IFn$_invoke$arity$3 ? c.cljs$core$IFn$_invoke$arity$3(d, k, p) : c.call(null, d, k, p)], 0));
          default:
            return e.cljs$core$IFn$_invoke$arity$variadic(d, k, p, cljs.core.array_seq(arguments, 3))
        }
        throw Error("Invalid arity: " + arguments.length);
      };
      d.cljs$lang$maxFixedArity = 3;
      d.cljs$lang$applyTo = e.cljs$lang$applyTo;
      return d
    }()
  }, e = function() {
    var a = function(a, b, c, d) {
      var e = cljs.core.list_STAR_.cljs$core$IFn$_invoke$arity$4(a, b, c, d);
      return function() {
        var a = null, b = function() {
          return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(function(a, b) {
            return cljs.core.conj.cljs$core$IFn$_invoke$arity$2(a, b.cljs$core$IFn$_invoke$arity$0 ? b.cljs$core$IFn$_invoke$arity$0() : b.call(null))
          }, cljs.core.PersistentVector.EMPTY, e)
        }, c = function(a) {
          return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(function(b, c) {
            return cljs.core.conj.cljs$core$IFn$_invoke$arity$2(b, c.cljs$core$IFn$_invoke$arity$1 ? c.cljs$core$IFn$_invoke$arity$1(a) : c.call(null, a))
          }, cljs.core.PersistentVector.EMPTY, e)
        }, d = function(a, b) {
          return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(function(c, d) {
            return cljs.core.conj.cljs$core$IFn$_invoke$arity$2(c, d.cljs$core$IFn$_invoke$arity$2 ? d.cljs$core$IFn$_invoke$arity$2(a, b) : d.call(null, a, b))
          }, cljs.core.PersistentVector.EMPTY, e)
        }, f = function(a, b, c) {
          return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(function(d, e) {
            return cljs.core.conj.cljs$core$IFn$_invoke$arity$2(d, e.cljs$core$IFn$_invoke$arity$3 ? e.cljs$core$IFn$_invoke$arity$3(a, b, c) : e.call(null, a, b, c))
          }, cljs.core.PersistentVector.EMPTY, e)
        }, g = function() {
          var a = function(a, b, c, d) {
            return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(function(e, f) {
              return cljs.core.conj.cljs$core$IFn$_invoke$arity$2(e, cljs.core.apply.cljs$core$IFn$_invoke$arity$5(f, a, b, c, d))
            }, cljs.core.PersistentVector.EMPTY, e)
          }, b = function(b, c, d, e) {
            var f = null;
            3 < arguments.length && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
            return a.call(this, b, c, d, f)
          };
          b.cljs$lang$maxFixedArity = 3;
          b.cljs$lang$applyTo = function(b) {
            var c = cljs.core.first(b);
            b = cljs.core.next(b);
            var d = cljs.core.first(b);
            b = cljs.core.next(b);
            var e = cljs.core.first(b);
            b = cljs.core.rest(b);
            return a(c, d, e, b)
          };
          b.cljs$core$IFn$_invoke$arity$variadic = a;
          return b
        }(), a = function(a, e, h, k) {
          switch(arguments.length) {
            case 0:
              return b.call(this);
            case 1:
              return c.call(this, a);
            case 2:
              return d.call(this, a, e);
            case 3:
              return f.call(this, a, e, h);
            default:
              return g.cljs$core$IFn$_invoke$arity$variadic(a, e, h, cljs.core.array_seq(arguments, 3))
          }
          throw Error("Invalid arity: " + arguments.length);
        };
        a.cljs$lang$maxFixedArity = 3;
        a.cljs$lang$applyTo = g.cljs$lang$applyTo;
        return a
      }()
    }, b = function(b, c, d, e) {
      var g = null;
      3 < arguments.length && (g = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
      return a.call(this, b, c, d, g)
    };
    b.cljs$lang$maxFixedArity = 3;
    b.cljs$lang$applyTo = function(b) {
      var c = cljs.core.first(b);
      b = cljs.core.next(b);
      var d = cljs.core.first(b);
      b = cljs.core.next(b);
      var e = cljs.core.first(b);
      b = cljs.core.rest(b);
      return a(c, d, e, b)
    };
    b.cljs$core$IFn$_invoke$arity$variadic = a;
    return b
  }(), a = function(a, g, h, k) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, g);
      case 3:
        return d.call(this, a, g, h);
      default:
        return e.cljs$core$IFn$_invoke$arity$variadic(a, g, h, cljs.core.array_seq(arguments, 3))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 3;
  a.cljs$lang$applyTo = e.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  a.cljs$core$IFn$_invoke$arity$3 = d;
  a.cljs$core$IFn$_invoke$arity$variadic = e.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.dorun = function() {
  var a = null, b = function(a) {
    for(;;) {
      if(cljs.core.seq(a)) {
        a = cljs.core.next(a)
      }else {
        return null
      }
    }
  }, c = function(a, b) {
    for(;;) {
      if(cljs.core.truth_(function() {
        var c = cljs.core.seq(b);
        return c ? 0 < a : c
      }())) {
        var c = a - 1, g = cljs.core.next(b);
        a = c;
        b = g
      }else {
        return null
      }
    }
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a
}();
cljs.core.doall = function() {
  var a = null, b = function(a) {
    cljs.core.dorun.cljs$core$IFn$_invoke$arity$1(a);
    return a
  }, c = function(a, b) {
    cljs.core.dorun.cljs$core$IFn$_invoke$arity$2(a, b);
    return b
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a
}();
cljs.core.regexp_QMARK_ = function(a) {
  return a instanceof RegExp
};
cljs.core.re_matches = function(a, b) {
  var c = a.exec(b);
  return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(cljs.core.first(c), b) ? 1 === cljs.core.count(c) ? cljs.core.first(c) : cljs.core.vec(c) : null
};
cljs.core.re_find = function(a, b) {
  var c = a.exec(b);
  return null == c ? null : 1 === cljs.core.count(c) ? cljs.core.first(c) : cljs.core.vec(c)
};
cljs.core.re_seq = function re_seq(b, c) {
  var d = cljs.core.re_find(b, c), e = c.search(b), f = cljs.core.coll_QMARK_(d) ? cljs.core.first(d) : d, g = cljs.core.subs.cljs$core$IFn$_invoke$arity$2(c, e + cljs.core.count(f));
  return cljs.core.truth_(d) ? new cljs.core.LazySeq(null, !1, function() {
    return cljs.core.cons(d, re_seq(b, g))
  }, null) : null
};
cljs.core.re_pattern = function(a) {
  var b = cljs.core.re_find(/^(?:\(\?([idmsux]*)\))?(.*)/, a);
  cljs.core.nth.cljs$core$IFn$_invoke$arity$3(b, 0, null);
  a = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(b, 1, null);
  b = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(b, 2, null);
  return RegExp(b, a)
};
cljs.core.pr_sequential_writer = function(a, b, c, d, e, f, g) {
  cljs.core._write(a, c);
  cljs.core.seq(g) && (b.cljs$core$IFn$_invoke$arity$3 ? b.cljs$core$IFn$_invoke$arity$3(cljs.core.first(g), a, f) : b.call(null, cljs.core.first(g), a, f));
  c = cljs.core.seq(cljs.core.next(g));
  g = null;
  for(var h = 0, k = 0;;) {
    if(k < h) {
      var l = g.cljs$core$IIndexed$_nth$arity$2(g, k);
      cljs.core._write(a, d);
      b.cljs$core$IFn$_invoke$arity$3 ? b.cljs$core$IFn$_invoke$arity$3(l, a, f) : b.call(null, l, a, f);
      k += 1
    }else {
      if(c = cljs.core.seq(c)) {
        g = c, cljs.core.chunked_seq_QMARK_(g) ? (c = cljs.core.chunk_first(g), k = cljs.core.chunk_rest(g), g = c, h = cljs.core.count(c), c = k) : (c = cljs.core.first(g), cljs.core._write(a, d), b.cljs$core$IFn$_invoke$arity$3 ? b.cljs$core$IFn$_invoke$arity$3(c, a, f) : b.call(null, c, a, f), c = cljs.core.next(g), g = null, h = 0), k = 0
      }else {
        break
      }
    }
  }
  return cljs.core._write(a, e)
};
cljs.core.write_all = function() {
  var a = function(a, b) {
    for(var e = cljs.core.seq(b), f = null, g = 0, h = 0;;) {
      if(h < g) {
        var k = f.cljs$core$IIndexed$_nth$arity$2(f, h);
        cljs.core._write(a, k);
        h += 1
      }else {
        if(e = cljs.core.seq(e)) {
          f = e, cljs.core.chunked_seq_QMARK_(f) ? (e = cljs.core.chunk_first(f), g = cljs.core.chunk_rest(f), f = e, k = cljs.core.count(e), e = g, g = k) : (k = cljs.core.first(f), cljs.core._write(a, k), e = cljs.core.next(f), f = null, g = 0), h = 0
        }else {
          return null
        }
      }
    }
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e)
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b)
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b
}();
cljs.core.string_print = function(a) {
  cljs.core._STAR_print_fn_STAR_.cljs$core$IFn$_invoke$arity$1 ? cljs.core._STAR_print_fn_STAR_.cljs$core$IFn$_invoke$arity$1(a) : cljs.core._STAR_print_fn_STAR_.call(null, a);
  return null
};
cljs.core.flush = function() {
  return null
};
cljs.core.char_escapes = {'"':'\\"', "\\":"\\\\", "\b":"\\b", "\f":"\\f", "\n":"\\n", "\r":"\\r", "\t":"\\t"};
cljs.core.quote_string = function(a) {
  return[cljs.core.str('"'), cljs.core.str(a.replace(RegExp('[\\\\"\b\f\n\r\t]', "g"), function(a) {
    return cljs.core.char_escapes[a]
  })), cljs.core.str('"')].join("")
};
cljs.core.pr_writer = function pr_writer(b, c, d) {
  if(null == b) {
    return cljs.core._write(c, "nil")
  }
  if(void 0 === b) {
    return cljs.core._write(c, "#\x3cundefined\x3e")
  }
  cljs.core.truth_(function() {
    var c = cljs.core.get.cljs$core$IFn$_invoke$arity$2(d, "\ufdd0:meta");
    return cljs.core.truth_(c) ? (b ? (c = (c = b.cljs$lang$protocol_mask$partition0$ & 131072) ? c : b.cljs$core$IMeta$, c = c ? !0 : b.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.type_satisfies_(cljs.core.IMeta, b)) : c = cljs.core.type_satisfies_(cljs.core.IMeta, b), cljs.core.truth_(c) ? cljs.core.meta(b) : c) : c
  }()) && (cljs.core._write(c, "^"), pr_writer(cljs.core.meta(b), c, d), cljs.core._write(c, " "));
  if(null == b) {
    return cljs.core._write(c, "nil")
  }
  if(b.cljs$lang$type) {
    return b.cljs$lang$ctorPrWriter(b, c, d)
  }
  if(function() {
    if(b) {
      var c;
      c = (c = b.cljs$lang$protocol_mask$partition0$ & 2147483648) ? c : b.cljs$core$IPrintWithWriter$;
      return c ? !0 : !1
    }
    return!1
  }()) {
    return b.cljs$core$IPrintWithWriter$_pr_writer$arity$3(b, c, d)
  }
  if(function() {
    var c = cljs.core.type(b) === Boolean;
    return c ? c : "number" === typeof b
  }()) {
    return cljs.core._write(c, "" + cljs.core.str(b))
  }
  if(b instanceof Array) {
    return cljs.core.pr_sequential_writer(c, pr_writer, "#\x3cArray [", ", ", "]\x3e", d, b)
  }
  if(goog.isString(b)) {
    if(cljs.core.keyword_QMARK_(b)) {
      cljs.core._write(c, ":");
      var e = cljs.core.namespace(b);
      cljs.core.truth_(e) && cljs.core.write_all.cljs$core$IFn$_invoke$arity$variadic(c, cljs.core.array_seq(["" + cljs.core.str(e), "/"], 0));
      return cljs.core._write(c, cljs.core.name(b))
    }
    return b instanceof cljs.core.Symbol ? (e = cljs.core.namespace(b), cljs.core.truth_(e) && cljs.core.write_all.cljs$core$IFn$_invoke$arity$variadic(c, cljs.core.array_seq(["" + cljs.core.str(e), "/"], 0)), cljs.core._write(c, cljs.core.name(b))) : cljs.core.truth_((new cljs.core.Keyword("\ufdd0:readably")).call(null, d)) ? cljs.core._write(c, cljs.core.quote_string(b)) : cljs.core._write(c, b)
  }
  return cljs.core.fn_QMARK_(b) ? cljs.core.write_all.cljs$core$IFn$_invoke$arity$variadic(c, cljs.core.array_seq(["#\x3c", "" + cljs.core.str(b), "\x3e"], 0)) : b instanceof Date ? (e = function(b, c) {
    for(var d = "" + cljs.core.str(b);;) {
      if(cljs.core.count(d) < c) {
        d = [cljs.core.str("0"), cljs.core.str(d)].join("")
      }else {
        return d
      }
    }
  }, cljs.core.write_all.cljs$core$IFn$_invoke$arity$variadic(c, cljs.core.array_seq(['#inst "', "" + cljs.core.str(b.getUTCFullYear()), "-", e(b.getUTCMonth() + 1, 2), "-", e(b.getUTCDate(), 2), "T", e(b.getUTCHours(), 2), ":", e(b.getUTCMinutes(), 2), ":", e(b.getUTCSeconds(), 2), ".", e(b.getUTCMilliseconds(), 3), "-", '00:00"'], 0))) : cljs.core.truth_(cljs.core.regexp_QMARK_(b)) ? cljs.core.write_all.cljs$core$IFn$_invoke$arity$variadic(c, cljs.core.array_seq(['#"', b.source, '"'], 0)) : function() {
    if(b) {
      var c;
      c = (c = b.cljs$lang$protocol_mask$partition0$ & 2147483648) ? c : b.cljs$core$IPrintWithWriter$;
      return c ? !0 : b.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.type_satisfies_(cljs.core.IPrintWithWriter, b)
    }
    return cljs.core.type_satisfies_(cljs.core.IPrintWithWriter, b)
  }() ? cljs.core._pr_writer(b, c, d) : cljs.core.write_all.cljs$core$IFn$_invoke$arity$variadic(c, cljs.core.array_seq(["#\x3c", "" + cljs.core.str(b), "\x3e"], 0))
};
cljs.core.pr_seq_writer = function(a, b, c) {
  cljs.core.pr_writer(cljs.core.first(a), b, c);
  a = cljs.core.seq(cljs.core.next(a));
  for(var d = null, e = 0, f = 0;;) {
    if(f < e) {
      var g = d.cljs$core$IIndexed$_nth$arity$2(d, f);
      cljs.core._write(b, " ");
      cljs.core.pr_writer(g, b, c);
      f += 1
    }else {
      if(a = cljs.core.seq(a)) {
        d = a, cljs.core.chunked_seq_QMARK_(d) ? (a = cljs.core.chunk_first(d), e = cljs.core.chunk_rest(d), d = a, g = cljs.core.count(a), a = e, e = g) : (g = cljs.core.first(d), cljs.core._write(b, " "), cljs.core.pr_writer(g, b, c), a = cljs.core.next(d), d = null, e = 0), f = 0
      }else {
        return null
      }
    }
  }
};
cljs.core.pr_sb_with_opts = function(a, b) {
  var c = new goog.string.StringBuffer, d = new cljs.core.StringBufferWriter(c);
  cljs.core.pr_seq_writer(a, d, b);
  cljs.core._flush(d);
  return c
};
cljs.core.pr_str_with_opts = function(a, b) {
  return cljs.core.empty_QMARK_(a) ? "" : "" + cljs.core.str(cljs.core.pr_sb_with_opts(a, b))
};
cljs.core.prn_str_with_opts = function(a, b) {
  if(cljs.core.empty_QMARK_(a)) {
    return"\n"
  }
  var c = cljs.core.pr_sb_with_opts(a, b);
  c.append("\n");
  return"" + cljs.core.str(c)
};
cljs.core.pr_with_opts = function(a, b) {
  return cljs.core.string_print(cljs.core.pr_str_with_opts(a, b))
};
cljs.core.newline = function(a) {
  cljs.core.string_print("\n");
  return cljs.core.truth_(cljs.core.get.cljs$core$IFn$_invoke$arity$2(a, "\ufdd0:flush-on-newline")) ? cljs.core.flush() : null
};
cljs.core.pr_str = function() {
  var a = function(a) {
    return cljs.core.pr_str_with_opts(a, cljs.core.pr_opts())
  }, b = function(b) {
    var d = null;
    0 < arguments.length && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d)
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a(b)
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b
}();
cljs.core.prn_str = function() {
  var a = function(a) {
    return cljs.core.prn_str_with_opts(a, cljs.core.pr_opts())
  }, b = function(b) {
    var d = null;
    0 < arguments.length && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d)
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a(b)
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b
}();
cljs.core.pr = function() {
  var a = function(a) {
    return cljs.core.pr_with_opts(a, cljs.core.pr_opts())
  }, b = function(b) {
    var d = null;
    0 < arguments.length && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d)
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a(b)
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b
}();
cljs.core.print = function() {
  var a = function(a) {
    return cljs.core.pr_with_opts(a, cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(cljs.core.pr_opts(), "\ufdd0:readably", !1))
  }, b = function(b) {
    var d = null;
    0 < arguments.length && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d)
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a(b)
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b
}();
cljs.core.print_str = function() {
  var a = function(a) {
    return cljs.core.pr_str_with_opts(a, cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(cljs.core.pr_opts(), "\ufdd0:readably", !1))
  }, b = function(b) {
    var d = null;
    0 < arguments.length && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d)
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a(b)
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b
}();
cljs.core.println = function() {
  var a = function(a) {
    cljs.core.pr_with_opts(a, cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(cljs.core.pr_opts(), "\ufdd0:readably", !1));
    return cljs.core.newline(cljs.core.pr_opts())
  }, b = function(b) {
    var d = null;
    0 < arguments.length && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d)
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a(b)
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b
}();
cljs.core.println_str = function() {
  var a = function(a) {
    return cljs.core.prn_str_with_opts(a, cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(cljs.core.pr_opts(), "\ufdd0:readably", !1))
  }, b = function(b) {
    var d = null;
    0 < arguments.length && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d)
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a(b)
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b
}();
cljs.core.prn = function() {
  var a = function(a) {
    cljs.core.pr_with_opts(a, cljs.core.pr_opts());
    return cljs.core.newline(cljs.core.pr_opts())
  }, b = function(b) {
    var d = null;
    0 < arguments.length && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d)
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a(b)
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b
}();
cljs.core.printf = function() {
  var a = function(a, b) {
    return cljs.core.print.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([cljs.core.apply.cljs$core$IFn$_invoke$arity$3(cljs.core.format, a, b)], 0))
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e)
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b)
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b
}();
cljs.core.KeySeq.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.KeySeq.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer(b, cljs.core.pr_writer, "(", " ", ")", c, a)
};
cljs.core.IndexedSeq.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.IndexedSeq.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer(b, cljs.core.pr_writer, "(", " ", ")", c, a)
};
cljs.core.Subvec.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.Subvec.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer(b, cljs.core.pr_writer, "[", " ", "]", c, a)
};
cljs.core.ChunkedCons.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.ChunkedCons.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer(b, cljs.core.pr_writer, "(", " ", ")", c, a)
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.PersistentTreeMap.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer(b, function(a) {
    return cljs.core.pr_sequential_writer(b, cljs.core.pr_writer, "", " ", "", c, a)
  }, "{", ", ", "}", c, a)
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.PersistentArrayMap.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer(b, function(a) {
    return cljs.core.pr_sequential_writer(b, cljs.core.pr_writer, "", " ", "", c, a)
  }, "{", ", ", "}", c, a)
};
cljs.core.PersistentQueue.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.PersistentQueue.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer(b, cljs.core.pr_writer, "#queue [", " ", "]", c, cljs.core.seq(a))
};
cljs.core.LazySeq.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.LazySeq.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer(b, cljs.core.pr_writer, "(", " ", ")", c, a)
};
cljs.core.RSeq.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.RSeq.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer(b, cljs.core.pr_writer, "(", " ", ")", c, a)
};
cljs.core.PersistentTreeSet.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.PersistentTreeSet.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer(b, cljs.core.pr_writer, "#{", " ", "}", c, a)
};
cljs.core.NodeSeq.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.NodeSeq.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer(b, cljs.core.pr_writer, "(", " ", ")", c, a)
};
cljs.core.RedNode.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.RedNode.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer(b, cljs.core.pr_writer, "[", " ", "]", c, a)
};
cljs.core.ChunkedSeq.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.ChunkedSeq.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer(b, cljs.core.pr_writer, "(", " ", ")", c, a)
};
cljs.core.PersistentHashMap.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.PersistentHashMap.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer(b, function(a) {
    return cljs.core.pr_sequential_writer(b, cljs.core.pr_writer, "", " ", "", c, a)
  }, "{", ", ", "}", c, a)
};
cljs.core.PersistentHashSet.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.PersistentHashSet.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer(b, cljs.core.pr_writer, "#{", " ", "}", c, a)
};
cljs.core.PersistentVector.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.PersistentVector.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer(b, cljs.core.pr_writer, "[", " ", "]", c, a)
};
cljs.core.List.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.List.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer(b, cljs.core.pr_writer, "(", " ", ")", c, a)
};
cljs.core.PersistentArrayMapSeq.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.PersistentArrayMapSeq.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer(b, cljs.core.pr_writer, "(", " ", ")", c, a)
};
cljs.core.EmptyList.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.EmptyList.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core._write(b, "()")
};
cljs.core.BlackNode.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.BlackNode.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer(b, cljs.core.pr_writer, "[", " ", "]", c, a)
};
cljs.core.Cons.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.Cons.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer(b, cljs.core.pr_writer, "(", " ", ")", c, a)
};
cljs.core.Range.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.Range.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer(b, cljs.core.pr_writer, "(", " ", ")", c, a)
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.ArrayNodeSeq.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer(b, cljs.core.pr_writer, "(", " ", ")", c, a)
};
cljs.core.ValSeq.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.ValSeq.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer(b, cljs.core.pr_writer, "(", " ", ")", c, a)
};
cljs.core.ObjMap.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.ObjMap.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer(b, function(a) {
    return cljs.core.pr_sequential_writer(b, cljs.core.pr_writer, "", " ", "", c, a)
  }, "{", ", ", "}", c, a)
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer(b, cljs.core.pr_writer, "(", " ", ")", c, a)
};
cljs.core.PersistentVector.prototype.cljs$core$IComparable$ = !0;
cljs.core.PersistentVector.prototype.cljs$core$IComparable$_compare$arity$2 = function(a, b) {
  return cljs.core.compare_indexed.cljs$core$IFn$_invoke$arity$2(a, b)
};
cljs.core.Subvec.prototype.cljs$core$IComparable$ = !0;
cljs.core.Subvec.prototype.cljs$core$IComparable$_compare$arity$2 = function(a, b) {
  return cljs.core.compare_indexed.cljs$core$IFn$_invoke$arity$2(a, b)
};
cljs.core.Atom = function(a, b, c, d) {
  this.state = a;
  this.meta = b;
  this.validator = c;
  this.watches = d;
  this.cljs$lang$protocol_mask$partition0$ = 2153938944;
  this.cljs$lang$protocol_mask$partition1$ = 2
};
cljs.core.Atom.cljs$lang$type = !0;
cljs.core.Atom.cljs$lang$ctorStr = "cljs.core/Atom";
cljs.core.Atom.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write(b, "cljs.core/Atom")
};
cljs.core.Atom.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  return goog.getUid(a)
};
cljs.core.Atom.prototype.cljs$core$IWatchable$_notify_watches$arity$3 = function(a, b, c) {
  for(var d = cljs.core.seq(this.watches), e = null, f = 0, g = 0;;) {
    if(g < f) {
      var h = e.cljs$core$IIndexed$_nth$arity$2(e, g), k = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(h, 0, null), h = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(h, 1, null);
      h.cljs$core$IFn$_invoke$arity$4 ? h.cljs$core$IFn$_invoke$arity$4(k, a, b, c) : h.call(null, k, a, b, c);
      g += 1
    }else {
      if(d = cljs.core.seq(d)) {
        cljs.core.chunked_seq_QMARK_(d) ? (e = cljs.core.chunk_first(d), d = cljs.core.chunk_rest(d), k = e, f = cljs.core.count(e), e = k) : (e = cljs.core.first(d), k = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(e, 0, null), h = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(e, 1, null), h.cljs$core$IFn$_invoke$arity$4 ? h.cljs$core$IFn$_invoke$arity$4(k, a, b, c) : h.call(null, k, a, b, c), d = cljs.core.next(d), e = null, f = 0), g = 0
      }else {
        return null
      }
    }
  }
};
cljs.core.Atom.prototype.cljs$core$IWatchable$_add_watch$arity$3 = function(a, b, c) {
  return a.watches = cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(this.watches, b, c)
};
cljs.core.Atom.prototype.cljs$core$IWatchable$_remove_watch$arity$2 = function(a, b) {
  return a.watches = cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(this.watches, b)
};
cljs.core.Atom.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  cljs.core._write(b, "#\x3cAtom: ");
  cljs.core.pr_writer(this.state, b, c);
  return cljs.core._write(b, "\x3e")
};
cljs.core.Atom.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return this.meta
};
cljs.core.Atom.prototype.cljs$core$IDeref$_deref$arity$1 = function(a) {
  return this.state
};
cljs.core.Atom.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return a === b
};
cljs.core.__GT_Atom = function(a, b, c, d) {
  return new cljs.core.Atom(a, b, c, d)
};
cljs.core.atom = function() {
  var a = null, b = function(a) {
    return new cljs.core.Atom(a, null, null, null)
  }, c = function() {
    var a = function(a, b) {
      var c = cljs.core.seq_QMARK_(b) ? cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.hash_map, b) : b, d = cljs.core.get.cljs$core$IFn$_invoke$arity$2(c, "\ufdd0:validator"), c = cljs.core.get.cljs$core$IFn$_invoke$arity$2(c, "\ufdd0:meta");
      return new cljs.core.Atom(a, c, d, null)
    }, b = function(b, c) {
      var e = null;
      1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
      return a.call(this, b, e)
    };
    b.cljs$lang$maxFixedArity = 1;
    b.cljs$lang$applyTo = function(b) {
      var c = cljs.core.first(b);
      b = cljs.core.rest(b);
      return a(c, b)
    };
    b.cljs$core$IFn$_invoke$arity$variadic = a;
    return b
  }(), a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(a, cljs.core.array_seq(arguments, 1))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 1;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.reset_BANG_ = function(a, b) {
  var c = a.validator;
  if(cljs.core.truth_(c) && !cljs.core.truth_(c.cljs$core$IFn$_invoke$arity$1 ? c.cljs$core$IFn$_invoke$arity$1(b) : c.call(null, b))) {
    throw Error([cljs.core.str("Assert failed: "), cljs.core.str("Validator rejected reference state"), cljs.core.str("\n"), cljs.core.str(cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([cljs.core.list(new cljs.core.Symbol(null, "validate", "validate", 1233162959, null), new cljs.core.Symbol(null, "new-value", "new-value", 972165309, null))], 0)))].join(""));
  }
  c = a.state;
  a.state = b;
  cljs.core._notify_watches(a, c, b);
  return b
};
cljs.core.swap_BANG_ = function() {
  var a = null, b = function(a, b) {
    return cljs.core.reset_BANG_(a, b.cljs$core$IFn$_invoke$arity$1 ? b.cljs$core$IFn$_invoke$arity$1(a.state) : b.call(null, a.state))
  }, c = function(a, b, c) {
    return cljs.core.reset_BANG_(a, b.cljs$core$IFn$_invoke$arity$2 ? b.cljs$core$IFn$_invoke$arity$2(a.state, c) : b.call(null, a.state, c))
  }, d = function(a, b, c, d) {
    return cljs.core.reset_BANG_(a, b.cljs$core$IFn$_invoke$arity$3 ? b.cljs$core$IFn$_invoke$arity$3(a.state, c, d) : b.call(null, a.state, c, d))
  }, e = function(a, b, c, d, e) {
    return cljs.core.reset_BANG_(a, b.cljs$core$IFn$_invoke$arity$4 ? b.cljs$core$IFn$_invoke$arity$4(a.state, c, d, e) : b.call(null, a.state, c, d, e))
  }, f = function() {
    var a = function(a, b, c, d, e, f) {
      return cljs.core.reset_BANG_(a, cljs.core.apply.cljs$core$IFn$_invoke$arity$variadic(b, a.state, c, d, e, cljs.core.array_seq([f], 0)))
    }, b = function(b, c, d, e, f, h) {
      var r = null;
      5 < arguments.length && (r = cljs.core.array_seq(Array.prototype.slice.call(arguments, 5), 0));
      return a.call(this, b, c, d, e, f, r)
    };
    b.cljs$lang$maxFixedArity = 5;
    b.cljs$lang$applyTo = function(b) {
      var c = cljs.core.first(b);
      b = cljs.core.next(b);
      var d = cljs.core.first(b);
      b = cljs.core.next(b);
      var e = cljs.core.first(b);
      b = cljs.core.next(b);
      var f = cljs.core.first(b);
      b = cljs.core.next(b);
      var h = cljs.core.first(b);
      b = cljs.core.rest(b);
      return a(c, d, e, f, h, b)
    };
    b.cljs$core$IFn$_invoke$arity$variadic = a;
    return b
  }(), a = function(a, h, k, l, m, n) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, h);
      case 3:
        return c.call(this, a, h, k);
      case 4:
        return d.call(this, a, h, k, l);
      case 5:
        return e.call(this, a, h, k, l, m);
      default:
        return f.cljs$core$IFn$_invoke$arity$variadic(a, h, k, l, m, cljs.core.array_seq(arguments, 5))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 5;
  a.cljs$lang$applyTo = f.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  a.cljs$core$IFn$_invoke$arity$4 = d;
  a.cljs$core$IFn$_invoke$arity$5 = e;
  a.cljs$core$IFn$_invoke$arity$variadic = f.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.compare_and_set_BANG_ = function(a, b, c) {
  return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(a.state, b) ? (cljs.core.reset_BANG_(a, c), !0) : !1
};
cljs.core.deref = function(a) {
  return cljs.core._deref(a)
};
cljs.core.set_validator_BANG_ = function(a, b) {
  return a.validator = b
};
cljs.core.get_validator = function(a) {
  return a.validator
};
cljs.core.alter_meta_BANG_ = function() {
  var a = function(a, b, e) {
    return a.meta = cljs.core.apply.cljs$core$IFn$_invoke$arity$3(b, a.meta, e)
  }, b = function(b, d, e) {
    var f = null;
    2 < arguments.length && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
    return a.call(this, b, d, f)
  };
  b.cljs$lang$maxFixedArity = 2;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.next(b);
    var e = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, e, b)
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b
}();
cljs.core.reset_meta_BANG_ = function(a, b) {
  return a.meta = b
};
cljs.core.add_watch = function(a, b, c) {
  return cljs.core._add_watch(a, b, c)
};
cljs.core.remove_watch = function(a, b) {
  return cljs.core._remove_watch(a, b)
};
cljs.core.gensym_counter = null;
cljs.core.gensym = function() {
  var a = null, b = function() {
    return a.cljs$core$IFn$_invoke$arity$1("G__")
  }, c = function(a) {
    null == cljs.core.gensym_counter && (cljs.core.gensym_counter = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(0));
    return cljs.core.symbol.cljs$core$IFn$_invoke$arity$1([cljs.core.str(a), cljs.core.str(cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$2(cljs.core.gensym_counter, cljs.core.inc))].join(""))
  }, a = function(a) {
    switch(arguments.length) {
      case 0:
        return b.call(this);
      case 1:
        return c.call(this, a)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$0 = b;
  a.cljs$core$IFn$_invoke$arity$1 = c;
  return a
}();
cljs.core.fixture1 = 1;
cljs.core.fixture2 = 2;
cljs.core.Delay = function(a, b) {
  this.state = a;
  this.f = b;
  this.cljs$lang$protocol_mask$partition1$ = 1;
  this.cljs$lang$protocol_mask$partition0$ = 32768
};
cljs.core.Delay.cljs$lang$type = !0;
cljs.core.Delay.cljs$lang$ctorStr = "cljs.core/Delay";
cljs.core.Delay.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write(b, "cljs.core/Delay")
};
cljs.core.Delay.prototype.cljs$core$IPending$_realized_QMARK_$arity$1 = function(a) {
  return(new cljs.core.Keyword("\ufdd0:done")).call(null, cljs.core.deref(this.state))
};
cljs.core.Delay.prototype.cljs$core$IDeref$_deref$arity$1 = function(a) {
  var b = this;
  return(new cljs.core.Keyword("\ufdd0:value")).call(null, cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$2(b.state, function(a) {
    a = cljs.core.seq_QMARK_(a) ? cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.hash_map, a) : a;
    var d = cljs.core.get.cljs$core$IFn$_invoke$arity$2(a, "\ufdd0:done");
    return cljs.core.truth_(d) ? a : cljs.core.PersistentArrayMap.fromArray(["\ufdd0:done", !0, "\ufdd0:value", b.f.cljs$core$IFn$_invoke$arity$0 ? b.f.cljs$core$IFn$_invoke$arity$0() : b.f.call(null)], !0)
  }))
};
cljs.core.__GT_Delay = function(a, b) {
  return new cljs.core.Delay(a, b)
};
cljs.core.delay_QMARK_ = function(a) {
  return a instanceof cljs.core.Delay
};
cljs.core.force = function(a) {
  return cljs.core.delay_QMARK_(a) ? cljs.core.deref(a) : a
};
cljs.core.realized_QMARK_ = function(a) {
  return cljs.core._realized_QMARK_(a)
};
cljs.core.IEncodeJS = {};
cljs.core._clj__GT_js = function(a) {
  if(a ? a.cljs$core$IEncodeJS$_clj__GT_js$arity$1 : a) {
    return a.cljs$core$IEncodeJS$_clj__GT_js$arity$1(a)
  }
  var b;
  b = cljs.core._clj__GT_js[goog.typeOf(null == a ? null : a)];
  if(!b && (b = cljs.core._clj__GT_js._, !b)) {
    throw cljs.core.missing_protocol("IEncodeJS.-clj-\x3ejs", a);
  }
  return b.call(null, a)
};
cljs.core._key__GT_js = function(a) {
  if(a ? a.cljs$core$IEncodeJS$_key__GT_js$arity$1 : a) {
    return a.cljs$core$IEncodeJS$_key__GT_js$arity$1(a)
  }
  var b;
  b = cljs.core._key__GT_js[goog.typeOf(null == a ? null : a)];
  if(!b && (b = cljs.core._key__GT_js._, !b)) {
    throw cljs.core.missing_protocol("IEncodeJS.-key-\x3ejs", a);
  }
  return b.call(null, a)
};
cljs.core.key__GT_js = function(a) {
  return(a ? cljs.core.truth_(cljs.core.truth_(null) ? null : a.cljs$core$IEncodeJS$) || (a.cljs$lang$protocol_mask$partition$ ? 0 : cljs.core.type_satisfies_(cljs.core.IEncodeJS, a)) : cljs.core.type_satisfies_(cljs.core.IEncodeJS, a)) ? cljs.core._clj__GT_js(a) : function() {
    var b = cljs.core.string_QMARK_(a);
    return b || (b = "number" === typeof a) ? b : (b = cljs.core.keyword_QMARK_(a)) ? b : a instanceof cljs.core.Symbol
  }() ? cljs.core.clj__GT_js.cljs$core$IFn$_invoke$arity$1 ? cljs.core.clj__GT_js.cljs$core$IFn$_invoke$arity$1(a) : cljs.core.clj__GT_js.call(null, a) : cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([a], 0))
};
cljs.core.clj__GT_js = function clj__GT_js(b) {
  if(null == b) {
    return null
  }
  if(b ? cljs.core.truth_(cljs.core.truth_(null) ? null : b.cljs$core$IEncodeJS$) || (b.cljs$lang$protocol_mask$partition$ ? 0 : cljs.core.type_satisfies_(cljs.core.IEncodeJS, b)) : cljs.core.type_satisfies_(cljs.core.IEncodeJS, b)) {
    return cljs.core._clj__GT_js(b)
  }
  if(cljs.core.keyword_QMARK_(b)) {
    return cljs.core.name(b)
  }
  if(b instanceof cljs.core.Symbol) {
    return"" + cljs.core.str(b)
  }
  if(cljs.core.map_QMARK_(b)) {
    var c = {};
    b = cljs.core.seq(b);
    for(var d = null, e = 0, f = 0;;) {
      if(f < e) {
        var g = d.cljs$core$IIndexed$_nth$arity$2(d, f), h = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(g, 0, null), g = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(g, 1, null);
        c[cljs.core.key__GT_js(h)] = clj__GT_js(g);
        f += 1
      }else {
        if(b = cljs.core.seq(b)) {
          cljs.core.chunked_seq_QMARK_(b) ? (e = cljs.core.chunk_first(b), b = cljs.core.chunk_rest(b), d = e, e = cljs.core.count(e)) : (e = cljs.core.first(b), d = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(e, 0, null), e = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(e, 1, null), c[cljs.core.key__GT_js(d)] = clj__GT_js(e), b = cljs.core.next(b), d = null, e = 0), f = 0
        }else {
          break
        }
      }
    }
    return c
  }
  return cljs.core.coll_QMARK_(b) ? cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.array, cljs.core.map.cljs$core$IFn$_invoke$arity$2(clj__GT_js, b)) : b
};
cljs.core.IEncodeClojure = {};
cljs.core._js__GT_clj = function(a, b) {
  if(a ? a.cljs$core$IEncodeClojure$_js__GT_clj$arity$2 : a) {
    return a.cljs$core$IEncodeClojure$_js__GT_clj$arity$2(a, b)
  }
  var c;
  c = cljs.core._js__GT_clj[goog.typeOf(null == a ? null : a)];
  if(!c && (c = cljs.core._js__GT_clj._, !c)) {
    throw cljs.core.missing_protocol("IEncodeClojure.-js-\x3eclj", a);
  }
  return c.call(null, a, b)
};
cljs.core.js__GT_clj = function() {
  var a = null, b = function(b) {
    return a.cljs$core$IFn$_invoke$arity$variadic(b, cljs.core.array_seq([cljs.core.PersistentArrayMap.fromArray(["\ufdd0:keywordize-keys", !1], !0)], 0))
  }, c = function() {
    var a = function(a, b) {
      if(function() {
        var b = cljs.core.IEncodeClojure;
        return b ? cljs.core.truth_(cljs.core.truth_(null) ? null : b.cljs$core$x$) ? !0 : b.cljs$lang$protocol_mask$partition$ ? !1 : cljs.core.type_satisfies_(a, b) : cljs.core.type_satisfies_(a, b)
      }()) {
        return cljs.core._js__GT_clj(a, cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.array_map, b))
      }
      if(cljs.core.seq(b)) {
        var c = cljs.core.seq_QMARK_(b) ? cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.hash_map, b) : b, d = cljs.core.get.cljs$core$IFn$_invoke$arity$2(c, "\ufdd0:keywordize-keys"), e = cljs.core.truth_(d) ? cljs.core.keyword : cljs.core.str;
        return function(a, b, c, d) {
          return function s(e) {
            return cljs.core.seq_QMARK_(e) ? cljs.core.doall.cljs$core$IFn$_invoke$arity$1(cljs.core.map.cljs$core$IFn$_invoke$arity$2(s, e)) : cljs.core.coll_QMARK_(e) ? cljs.core.into(cljs.core.empty(e), cljs.core.map.cljs$core$IFn$_invoke$arity$2(s, e)) : e instanceof Array ? cljs.core.vec(cljs.core.map.cljs$core$IFn$_invoke$arity$2(s, e)) : cljs.core.type(e) === Object ? cljs.core.into(cljs.core.PersistentArrayMap.EMPTY, function() {
              return function(a, b, c, d) {
                return function R(f) {
                  return new cljs.core.LazySeq(null, !1, function(a, b, c, d) {
                    return function() {
                      for(;;) {
                        var a = cljs.core.seq(f);
                        if(a) {
                          if(cljs.core.chunked_seq_QMARK_(a)) {
                            var b = cljs.core.chunk_first(a), c = cljs.core.count(b), g = cljs.core.chunk_buffer(c);
                            a: {
                              for(var h = 0;;) {
                                if(h < c) {
                                  var k = cljs.core._nth.cljs$core$IFn$_invoke$arity$2(b, h);
                                  cljs.core.chunk_append(g, cljs.core.PersistentVector.fromArray([d.cljs$core$IFn$_invoke$arity$1 ? d.cljs$core$IFn$_invoke$arity$1(k) : d.call(null, k), s(e[k])], !0));
                                  h += 1
                                }else {
                                  b = !0;
                                  break a
                                }
                              }
                              b = void 0
                            }
                            return b ? cljs.core.chunk_cons(cljs.core.chunk(g), R(cljs.core.chunk_rest(a))) : cljs.core.chunk_cons(cljs.core.chunk(g), null)
                          }
                          g = cljs.core.first(a);
                          return cljs.core.cons(cljs.core.PersistentVector.fromArray([d.cljs$core$IFn$_invoke$arity$1 ? d.cljs$core$IFn$_invoke$arity$1(g) : d.call(null, g), s(e[g])], !0), R(cljs.core.rest(a)))
                        }
                        return null
                      }
                    }
                  }(a, b, c, d), null)
                }
              }(a, b, c, d)(cljs.core.js_keys(e))
            }()) : e
          }
        }(b, c, d, e)(a)
      }
      return null
    }, b = function(b, c) {
      var e = null;
      1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
      return a.call(this, b, e)
    };
    b.cljs$lang$maxFixedArity = 1;
    b.cljs$lang$applyTo = function(b) {
      var c = cljs.core.first(b);
      b = cljs.core.rest(b);
      return a(c, b)
    };
    b.cljs$core$IFn$_invoke$arity$variadic = a;
    return b
  }(), a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(a, cljs.core.array_seq(arguments, 1))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 1;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.memoize = function(a) {
  var b = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(cljs.core.PersistentArrayMap.EMPTY);
  return function() {
    var c = function(c) {
      var d = cljs.core.get.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(b), c);
      if(cljs.core.truth_(d)) {
        return d
      }
      d = cljs.core.apply.cljs$core$IFn$_invoke$arity$2(a, c);
      cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(b, cljs.core.assoc, c, d);
      return d
    }, d = function(a) {
      var b = null;
      0 < arguments.length && (b = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
      return c.call(this, b)
    };
    d.cljs$lang$maxFixedArity = 0;
    d.cljs$lang$applyTo = function(a) {
      a = cljs.core.seq(a);
      return c(a)
    };
    d.cljs$core$IFn$_invoke$arity$variadic = c;
    return d
  }()
};
cljs.core.trampoline = function() {
  var a = null, b = function(a) {
    for(;;) {
      if(a = a.cljs$core$IFn$_invoke$arity$0 ? a.cljs$core$IFn$_invoke$arity$0() : a.call(null), !cljs.core.fn_QMARK_(a)) {
        return a
      }
    }
  }, c = function() {
    var b = function(b, c) {
      return a.cljs$core$IFn$_invoke$arity$1(function() {
        return cljs.core.apply.cljs$core$IFn$_invoke$arity$2(b, c)
      })
    }, c = function(a, c) {
      var e = null;
      1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
      return b.call(this, a, e)
    };
    c.cljs$lang$maxFixedArity = 1;
    c.cljs$lang$applyTo = function(a) {
      var c = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(c, a)
    };
    c.cljs$core$IFn$_invoke$arity$variadic = b;
    return c
  }(), a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(a, cljs.core.array_seq(arguments, 1))
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 1;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a
}();
cljs.core.rand = function() {
  var a = null, b = function() {
    return a.cljs$core$IFn$_invoke$arity$1(1)
  }, c = function(a) {
    return(Math.random.cljs$core$IFn$_invoke$arity$0 ? Math.random.cljs$core$IFn$_invoke$arity$0() : Math.random.call(null)) * a
  }, a = function(a) {
    switch(arguments.length) {
      case 0:
        return b.call(this);
      case 1:
        return c.call(this, a)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$0 = b;
  a.cljs$core$IFn$_invoke$arity$1 = c;
  return a
}();
cljs.core.rand_int = function(a) {
  return Math.floor.cljs$core$IFn$_invoke$arity$1 ? Math.floor.cljs$core$IFn$_invoke$arity$1((Math.random.cljs$core$IFn$_invoke$arity$0 ? Math.random.cljs$core$IFn$_invoke$arity$0() : Math.random.call(null)) * a) : Math.floor.call(null, (Math.random.cljs$core$IFn$_invoke$arity$0 ? Math.random.cljs$core$IFn$_invoke$arity$0() : Math.random.call(null)) * a)
};
cljs.core.rand_nth = function(a) {
  return cljs.core.nth.cljs$core$IFn$_invoke$arity$2(a, cljs.core.rand_int(cljs.core.count(a)))
};
cljs.core.group_by = function(a, b) {
  return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(function(b, d) {
    var e = a.cljs$core$IFn$_invoke$arity$1 ? a.cljs$core$IFn$_invoke$arity$1(d) : a.call(null, d);
    return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(b, e, cljs.core.conj.cljs$core$IFn$_invoke$arity$2(cljs.core.get.cljs$core$IFn$_invoke$arity$3(b, e, cljs.core.PersistentVector.EMPTY), d))
  }, cljs.core.PersistentArrayMap.EMPTY, b)
};
cljs.core.make_hierarchy = function() {
  return cljs.core.PersistentArrayMap.fromArray(["\ufdd0:parents", cljs.core.PersistentArrayMap.EMPTY, "\ufdd0:descendants", cljs.core.PersistentArrayMap.EMPTY, "\ufdd0:ancestors", cljs.core.PersistentArrayMap.EMPTY], !0)
};
cljs.core._global_hierarchy = null;
cljs.core.get_global_hierarchy = function() {
  null == cljs.core._global_hierarchy && (cljs.core._global_hierarchy = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(cljs.core.make_hierarchy()));
  return cljs.core._global_hierarchy
};
cljs.core.swap_global_hierarchy_BANG_ = function() {
  var a = function(a, b) {
    return cljs.core.apply.cljs$core$IFn$_invoke$arity$4(cljs.core.swap_BANG_, cljs.core.get_global_hierarchy(), a, b)
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e)
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b)
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b
}();
cljs.core.isa_QMARK_ = function() {
  var a = null, b = function(b, c) {
    return a.cljs$core$IFn$_invoke$arity$3(cljs.core.deref(cljs.core.get_global_hierarchy()), b, c)
  }, c = function(b, c, f) {
    var g = cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(c, f);
    if(!g && !(g = cljs.core.contains_QMARK_((new cljs.core.Keyword("\ufdd0:ancestors")).call(null, b).call(null, c), f)) && (g = cljs.core.vector_QMARK_(f)) && (g = cljs.core.vector_QMARK_(c))) {
      if(g = cljs.core.count(f) === cljs.core.count(c)) {
        for(var g = !0, h = 0;;) {
          var k;
          k = (k = cljs.core.not(g)) ? k : h === cljs.core.count(f);
          if(k) {
            return g
          }
          g = a.cljs$core$IFn$_invoke$arity$3(b, c.cljs$core$IFn$_invoke$arity$1 ? c.cljs$core$IFn$_invoke$arity$1(h) : c.call(null, h), f.cljs$core$IFn$_invoke$arity$1 ? f.cljs$core$IFn$_invoke$arity$1(h) : f.call(null, h));
          h += 1
        }
      }else {
        return g
      }
    }else {
      return g
    }
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a
}();
cljs.core.parents = function() {
  var a = null, b = function(b) {
    return a.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(cljs.core.get_global_hierarchy()), b)
  }, c = function(a, b) {
    return cljs.core.not_empty(cljs.core.get.cljs$core$IFn$_invoke$arity$2((new cljs.core.Keyword("\ufdd0:parents")).call(null, a), b))
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a
}();
cljs.core.ancestors = function() {
  var a = null, b = function(b) {
    return a.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(cljs.core.get_global_hierarchy()), b)
  }, c = function(a, b) {
    return cljs.core.not_empty(cljs.core.get.cljs$core$IFn$_invoke$arity$2((new cljs.core.Keyword("\ufdd0:ancestors")).call(null, a), b))
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a
}();
cljs.core.descendants = function() {
  var a = null, b = function(b) {
    return a.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(cljs.core.get_global_hierarchy()), b)
  }, c = function(a, b) {
    return cljs.core.not_empty(cljs.core.get.cljs$core$IFn$_invoke$arity$2((new cljs.core.Keyword("\ufdd0:descendants")).call(null, a), b))
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a
}();
cljs.core.derive = function() {
  var a = null, b = function(b, c) {
    if(!cljs.core.truth_(cljs.core.namespace(c))) {
      throw Error([cljs.core.str("Assert failed: "), cljs.core.str(cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([cljs.core.list(new cljs.core.Symbol(null, "namespace", "namespace", -388313324, null), new cljs.core.Symbol(null, "parent", "parent", 1659011683, null))], 0)))].join(""));
    }
    cljs.core.swap_global_hierarchy_BANG_.cljs$core$IFn$_invoke$arity$variadic(a, cljs.core.array_seq([b, c], 0));
    return null
  }, c = function(a, b, c) {
    if(!cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(b, c)) {
      throw Error([cljs.core.str("Assert failed: "), cljs.core.str(cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([cljs.core.list(new cljs.core.Symbol(null, "not\x3d", "not\x3d", -1637144189, null), new cljs.core.Symbol(null, "tag", "tag", -1640416941, null), new cljs.core.Symbol(null, "parent", "parent", 1659011683, null))], 0)))].join(""));
    }
    var g = (new cljs.core.Keyword("\ufdd0:parents")).call(null, a), h = (new cljs.core.Keyword("\ufdd0:descendants")).call(null, a), k = (new cljs.core.Keyword("\ufdd0:ancestors")).call(null, a), l = function(a, b, c) {
      return function(d, e, f, g, h) {
        return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(function(a, b, c) {
          return function(a, b) {
            return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(a, b, cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(cljs.core.conj, cljs.core.get.cljs$core$IFn$_invoke$arity$3(h, b, cljs.core.PersistentHashSet.EMPTY), cljs.core.cons(g, h.cljs$core$IFn$_invoke$arity$1 ? h.cljs$core$IFn$_invoke$arity$1(g) : h.call(null, g))))
          }
        }(a, b, c), d, cljs.core.cons(e, f.cljs$core$IFn$_invoke$arity$1 ? f.cljs$core$IFn$_invoke$arity$1(e) : f.call(null, e)))
      }
    }(g, h, k);
    if(cljs.core.contains_QMARK_(g.cljs$core$IFn$_invoke$arity$1 ? g.cljs$core$IFn$_invoke$arity$1(b) : g.call(null, b), c)) {
      b = null
    }else {
      if(cljs.core.contains_QMARK_(k.cljs$core$IFn$_invoke$arity$1 ? k.cljs$core$IFn$_invoke$arity$1(b) : k.call(null, b), c)) {
        throw Error([cljs.core.str(b), cljs.core.str("already has"), cljs.core.str(c), cljs.core.str("as ancestor")].join(""));
      }
      if(cljs.core.contains_QMARK_(k.cljs$core$IFn$_invoke$arity$1 ? k.cljs$core$IFn$_invoke$arity$1(c) : k.call(null, c), b)) {
        throw Error([cljs.core.str("Cyclic derivation:"), cljs.core.str(c), cljs.core.str("has"), cljs.core.str(b), cljs.core.str("as ancestor")].join(""));
      }
      b = cljs.core.PersistentArrayMap.fromArray(["\ufdd0:parents", cljs.core.assoc.cljs$core$IFn$_invoke$arity$3((new cljs.core.Keyword("\ufdd0:parents")).call(null, a), b, cljs.core.conj.cljs$core$IFn$_invoke$arity$2(cljs.core.get.cljs$core$IFn$_invoke$arity$3(g, b, cljs.core.PersistentHashSet.EMPTY), c)), "\ufdd0:ancestors", l((new cljs.core.Keyword("\ufdd0:ancestors")).call(null, a), b, h, c, k), "\ufdd0:descendants", l((new cljs.core.Keyword("\ufdd0:descendants")).call(null, a), c, k, b, h)], 
      !0)
    }
    return cljs.core.truth_(b) ? b : a
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a
}();
cljs.core.underive = function() {
  var a = null, b = function(b, c) {
    cljs.core.swap_global_hierarchy_BANG_.cljs$core$IFn$_invoke$arity$variadic(a, cljs.core.array_seq([b, c], 0));
    return null
  }, c = function(a, b, c) {
    var g = (new cljs.core.Keyword("\ufdd0:parents")).call(null, a), h = cljs.core.truth_(g.cljs$core$IFn$_invoke$arity$1 ? g.cljs$core$IFn$_invoke$arity$1(b) : g.call(null, b)) ? cljs.core.disj.cljs$core$IFn$_invoke$arity$2(g.cljs$core$IFn$_invoke$arity$1 ? g.cljs$core$IFn$_invoke$arity$1(b) : g.call(null, b), c) : cljs.core.PersistentHashSet.EMPTY, k = cljs.core.truth_(cljs.core.not_empty(h)) ? cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(g, b, h) : cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(g, 
    b), h = cljs.core.flatten(cljs.core.map.cljs$core$IFn$_invoke$arity$2(function(a, b, c) {
      return function(a) {
        return cljs.core.cons(cljs.core.first(a), cljs.core.interpose(cljs.core.first(a), cljs.core.second(a)))
      }
    }(g, h, k), cljs.core.seq(k)));
    return cljs.core.contains_QMARK_(g.cljs$core$IFn$_invoke$arity$1 ? g.cljs$core$IFn$_invoke$arity$1(b) : g.call(null, b), c) ? cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(function(a, b) {
      return cljs.core.apply.cljs$core$IFn$_invoke$arity$3(cljs.core.derive, a, b)
    }, cljs.core.make_hierarchy(), cljs.core.partition.cljs$core$IFn$_invoke$arity$2(2, h)) : a
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a
}();
cljs.core.reset_cache = function(a, b, c, d) {
  cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$2(a, function(a) {
    return cljs.core.deref(b)
  });
  return cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$2(c, function(a) {
    return cljs.core.deref(d)
  })
};
cljs.core.prefers_STAR_ = function prefers_STAR_(b, c, d) {
  var e = cljs.core.deref(d).call(null, b), e = cljs.core.truth_(cljs.core.truth_(e) ? e.cljs$core$IFn$_invoke$arity$1 ? e.cljs$core$IFn$_invoke$arity$1(c) : e.call(null, c) : e) ? !0 : null;
  if(cljs.core.truth_(e)) {
    return e
  }
  e = function() {
    for(var e = cljs.core.parents.cljs$core$IFn$_invoke$arity$1(c);;) {
      if(0 < cljs.core.count(e)) {
        cljs.core.truth_(prefers_STAR_(b, cljs.core.first(e), d)), e = cljs.core.rest(e)
      }else {
        return null
      }
    }
  }();
  if(cljs.core.truth_(e)) {
    return e
  }
  e = function() {
    for(var e = cljs.core.parents.cljs$core$IFn$_invoke$arity$1(b);;) {
      if(0 < cljs.core.count(e)) {
        cljs.core.truth_(prefers_STAR_(cljs.core.first(e), c, d)), e = cljs.core.rest(e)
      }else {
        return null
      }
    }
  }();
  return cljs.core.truth_(e) ? e : !1
};
cljs.core.dominates = function(a, b, c) {
  c = cljs.core.prefers_STAR_(a, b, c);
  return cljs.core.truth_(c) ? c : cljs.core.isa_QMARK_.cljs$core$IFn$_invoke$arity$2(a, b)
};
cljs.core.find_and_cache_best_method = function find_and_cache_best_method(b, c, d, e, f, g, h) {
  var k = cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(function(e, g) {
    var h = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(g, 0, null);
    cljs.core.nth.cljs$core$IFn$_invoke$arity$3(g, 1, null);
    if(cljs.core.isa_QMARK_.cljs$core$IFn$_invoke$arity$3(cljs.core.deref(d), c, h)) {
      var k = cljs.core.truth_(function() {
        var b = null == e;
        return b ? b : cljs.core.dominates(h, cljs.core.first(e), f)
      }()) ? g : e;
      if(!cljs.core.truth_(cljs.core.dominates(cljs.core.first(k), h, f))) {
        throw Error([cljs.core.str("Multiple methods in multimethod '"), cljs.core.str(b), cljs.core.str("' match dispatch value: "), cljs.core.str(c), cljs.core.str(" -\x3e "), cljs.core.str(h), cljs.core.str(" and "), cljs.core.str(cljs.core.first(k)), cljs.core.str(", and neither is preferred")].join(""));
      }
      return k
    }
    return e
  }, null, cljs.core.deref(e));
  if(cljs.core.truth_(k)) {
    if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(h), cljs.core.deref(d))) {
      return cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(g, cljs.core.assoc, c, cljs.core.second(k)), cljs.core.second(k)
    }
    cljs.core.reset_cache(g, e, h, d);
    return find_and_cache_best_method(b, c, d, e, f, g, h)
  }
  return null
};
cljs.core.IMultiFn = {};
cljs.core._reset = function(a) {
  if(a ? a.cljs$core$IMultiFn$_reset$arity$1 : a) {
    return a.cljs$core$IMultiFn$_reset$arity$1(a)
  }
  var b;
  b = cljs.core._reset[goog.typeOf(null == a ? null : a)];
  if(!b && (b = cljs.core._reset._, !b)) {
    throw cljs.core.missing_protocol("IMultiFn.-reset", a);
  }
  return b.call(null, a)
};
cljs.core._add_method = function(a, b, c) {
  if(a ? a.cljs$core$IMultiFn$_add_method$arity$3 : a) {
    return a.cljs$core$IMultiFn$_add_method$arity$3(a, b, c)
  }
  var d;
  d = cljs.core._add_method[goog.typeOf(null == a ? null : a)];
  if(!d && (d = cljs.core._add_method._, !d)) {
    throw cljs.core.missing_protocol("IMultiFn.-add-method", a);
  }
  return d.call(null, a, b, c)
};
cljs.core._remove_method = function(a, b) {
  if(a ? a.cljs$core$IMultiFn$_remove_method$arity$2 : a) {
    return a.cljs$core$IMultiFn$_remove_method$arity$2(a, b)
  }
  var c;
  c = cljs.core._remove_method[goog.typeOf(null == a ? null : a)];
  if(!c && (c = cljs.core._remove_method._, !c)) {
    throw cljs.core.missing_protocol("IMultiFn.-remove-method", a);
  }
  return c.call(null, a, b)
};
cljs.core._prefer_method = function(a, b, c) {
  if(a ? a.cljs$core$IMultiFn$_prefer_method$arity$3 : a) {
    return a.cljs$core$IMultiFn$_prefer_method$arity$3(a, b, c)
  }
  var d;
  d = cljs.core._prefer_method[goog.typeOf(null == a ? null : a)];
  if(!d && (d = cljs.core._prefer_method._, !d)) {
    throw cljs.core.missing_protocol("IMultiFn.-prefer-method", a);
  }
  return d.call(null, a, b, c)
};
cljs.core._get_method = function(a, b) {
  if(a ? a.cljs$core$IMultiFn$_get_method$arity$2 : a) {
    return a.cljs$core$IMultiFn$_get_method$arity$2(a, b)
  }
  var c;
  c = cljs.core._get_method[goog.typeOf(null == a ? null : a)];
  if(!c && (c = cljs.core._get_method._, !c)) {
    throw cljs.core.missing_protocol("IMultiFn.-get-method", a);
  }
  return c.call(null, a, b)
};
cljs.core._methods = function(a) {
  if(a ? a.cljs$core$IMultiFn$_methods$arity$1 : a) {
    return a.cljs$core$IMultiFn$_methods$arity$1(a)
  }
  var b;
  b = cljs.core._methods[goog.typeOf(null == a ? null : a)];
  if(!b && (b = cljs.core._methods._, !b)) {
    throw cljs.core.missing_protocol("IMultiFn.-methods", a);
  }
  return b.call(null, a)
};
cljs.core._prefers = function(a) {
  if(a ? a.cljs$core$IMultiFn$_prefers$arity$1 : a) {
    return a.cljs$core$IMultiFn$_prefers$arity$1(a)
  }
  var b;
  b = cljs.core._prefers[goog.typeOf(null == a ? null : a)];
  if(!b && (b = cljs.core._prefers._, !b)) {
    throw cljs.core.missing_protocol("IMultiFn.-prefers", a);
  }
  return b.call(null, a)
};
cljs.core._dispatch = function(a, b) {
  if(a ? a.cljs$core$IMultiFn$_dispatch$arity$2 : a) {
    return a.cljs$core$IMultiFn$_dispatch$arity$2(a, b)
  }
  var c;
  c = cljs.core._dispatch[goog.typeOf(null == a ? null : a)];
  if(!c && (c = cljs.core._dispatch._, !c)) {
    throw cljs.core.missing_protocol("IMultiFn.-dispatch", a);
  }
  return c.call(null, a, b)
};
cljs.core.do_dispatch = function(a, b, c) {
  b = cljs.core.apply.cljs$core$IFn$_invoke$arity$2(b, c);
  a = cljs.core._get_method(a, b);
  if(!cljs.core.truth_(a)) {
    throw Error([cljs.core.str("No method in multimethod '"), cljs.core.str(cljs.core.name), cljs.core.str("' for dispatch value: "), cljs.core.str(b)].join(""));
  }
  return cljs.core.apply.cljs$core$IFn$_invoke$arity$2(a, c)
};
cljs.core.MultiFn = function(a, b, c, d, e, f, g, h) {
  this.name = a;
  this.dispatch_fn = b;
  this.default_dispatch_val = c;
  this.hierarchy = d;
  this.method_table = e;
  this.prefer_table = f;
  this.method_cache = g;
  this.cached_hierarchy = h;
  this.cljs$lang$protocol_mask$partition0$ = 4194304;
  this.cljs$lang$protocol_mask$partition1$ = 256
};
cljs.core.MultiFn.cljs$lang$type = !0;
cljs.core.MultiFn.cljs$lang$ctorStr = "cljs.core/MultiFn";
cljs.core.MultiFn.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write(b, "cljs.core/MultiFn")
};
cljs.core.MultiFn.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  return goog.getUid(a)
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_reset$arity$1 = function(a) {
  cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$2(this.method_table, function(a) {
    return cljs.core.PersistentArrayMap.EMPTY
  });
  cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$2(this.method_cache, function(a) {
    return cljs.core.PersistentArrayMap.EMPTY
  });
  cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$2(this.prefer_table, function(a) {
    return cljs.core.PersistentArrayMap.EMPTY
  });
  cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$2(this.cached_hierarchy, function(a) {
    return null
  });
  return a
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_add_method$arity$3 = function(a, b, c) {
  cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(this.method_table, cljs.core.assoc, b, c);
  cljs.core.reset_cache(this.method_cache, this.method_table, this.cached_hierarchy, this.hierarchy);
  return a
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_remove_method$arity$2 = function(a, b) {
  cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$3(this.method_table, cljs.core.dissoc, b);
  cljs.core.reset_cache(this.method_cache, this.method_table, this.cached_hierarchy, this.hierarchy);
  return a
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_get_method$arity$2 = function(a, b) {
  cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(this.cached_hierarchy), cljs.core.deref(this.hierarchy)) || cljs.core.reset_cache(this.method_cache, this.method_table, this.cached_hierarchy, this.hierarchy);
  var c = cljs.core.deref(this.method_cache).call(null, b);
  if(cljs.core.truth_(c)) {
    return c
  }
  c = cljs.core.find_and_cache_best_method(this.name, b, this.hierarchy, this.method_table, this.prefer_table, this.method_cache, this.cached_hierarchy);
  return cljs.core.truth_(c) ? c : cljs.core.deref(this.method_table).call(null, this.default_dispatch_val)
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_prefer_method$arity$3 = function(a, b, c) {
  if(cljs.core.truth_(cljs.core.prefers_STAR_(b, c, this.prefer_table))) {
    throw Error([cljs.core.str("Preference conflict in multimethod '"), cljs.core.str(this.name), cljs.core.str("': "), cljs.core.str(c), cljs.core.str(" is already preferred to "), cljs.core.str(b)].join(""));
  }
  cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$2(this.prefer_table, function(a) {
    return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(a, b, cljs.core.conj.cljs$core$IFn$_invoke$arity$2(cljs.core.get.cljs$core$IFn$_invoke$arity$3(a, b, cljs.core.PersistentHashSet.EMPTY), c))
  });
  return cljs.core.reset_cache(this.method_cache, this.method_table, this.cached_hierarchy, this.hierarchy)
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_methods$arity$1 = function(a) {
  return cljs.core.deref(this.method_table)
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_prefers$arity$1 = function(a) {
  return cljs.core.deref(this.prefer_table)
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_dispatch$arity$2 = function(a, b) {
  return cljs.core.do_dispatch(a, this.dispatch_fn, b)
};
cljs.core.__GT_MultiFn = function(a, b, c, d, e, f, g, h) {
  return new cljs.core.MultiFn(a, b, c, d, e, f, g, h)
};
cljs.core.MultiFn.prototype.call = function() {
  var a = function(a, b) {
    return cljs.core._dispatch(this, b)
  }, b = function(a, b) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return cljs.core._dispatch(this, e)
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b)
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b
}();
cljs.core.MultiFn.prototype.apply = function(a, b) {
  return cljs.core._dispatch(this, b)
};
cljs.core.remove_all_methods = function(a) {
  return cljs.core._reset(a)
};
cljs.core.remove_method = function(a, b) {
  return cljs.core._remove_method(a, b)
};
cljs.core.prefer_method = function(a, b, c) {
  return cljs.core._prefer_method(a, b, c)
};
cljs.core.methods$ = function(a) {
  return cljs.core._methods(a)
};
cljs.core.get_method = function(a, b) {
  return cljs.core._get_method(a, b)
};
cljs.core.prefers = function(a) {
  return cljs.core._prefers(a)
};
cljs.core.UUID = function(a) {
  this.uuid = a;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 2153775104
};
cljs.core.UUID.cljs$lang$type = !0;
cljs.core.UUID.cljs$lang$ctorStr = "cljs.core/UUID";
cljs.core.UUID.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write(b, "cljs.core/UUID")
};
cljs.core.UUID.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  return goog.string.hashCode(cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([a], 0)))
};
cljs.core.UUID.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core._write(b, [cljs.core.str('#uuid "'), cljs.core.str(this.uuid), cljs.core.str('"')].join(""))
};
cljs.core.UUID.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  var c = b instanceof cljs.core.UUID;
  return c ? this.uuid === b.uuid : c
};
cljs.core.__GT_UUID = function(a) {
  return new cljs.core.UUID(a)
};
cljs.core.ExceptionInfo = function(a, b, c) {
  this.message = a;
  this.data = b;
  this.cause = c
};
cljs.core.ExceptionInfo.cljs$lang$type = !0;
cljs.core.ExceptionInfo.cljs$lang$ctorStr = "cljs.core/ExceptionInfo";
cljs.core.ExceptionInfo.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write(b, "cljs.core/ExceptionInfo")
};
cljs.core.__GT_ExceptionInfo = function(a, b, c) {
  return new cljs.core.ExceptionInfo(a, b, c)
};
cljs.core.ExceptionInfo.prototype = Error();
cljs.core.ExceptionInfo.prototype.constructor = cljs.core.ExceptionInfo;
cljs.core.ex_info = function() {
  var a = null, b = function(a, b) {
    return new cljs.core.ExceptionInfo(a, b, null)
  }, c = function(a, b, c) {
    return new cljs.core.ExceptionInfo(a, b, c)
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a
}();
cljs.core.ex_data = function(a) {
  return a instanceof cljs.core.ExceptionInfo ? a.data : null
};
cljs.core.ex_message = function(a) {
  return a instanceof Error ? a.message : null
};
cljs.core.ex_cause = function(a) {
  return a instanceof cljs.core.ExceptionInfo ? a.cause : null
};
cljs.core.comparator = function(a) {
  return function(b, c) {
    return cljs.core.truth_(a.cljs$core$IFn$_invoke$arity$2 ? a.cljs$core$IFn$_invoke$arity$2(b, c) : a.call(null, b, c)) ? -1 : cljs.core.truth_(a.cljs$core$IFn$_invoke$arity$2 ? a.cljs$core$IFn$_invoke$arity$2(c, b) : a.call(null, c, b)) ? 1 : 0
  }
};
cljs.core.special_symbol_QMARK_ = function(a) {
  return cljs.core.contains_QMARK_(cljs.core.PersistentHashSet.fromArray([new cljs.core.Symbol(null, "deftype*", "deftype*", -978581244, null), null, new cljs.core.Symbol(null, "new", "new", -1640422567, null), null, new cljs.core.Symbol(null, "try*", "try*", -1636962424, null), null, new cljs.core.Symbol(null, "quote", "quote", -1532577739, null), null, new cljs.core.Symbol(null, "\x26", "\x26", -1640531489, null), null, new cljs.core.Symbol(null, "set!", "set!", -1637004872, null), null, new cljs.core.Symbol(null, 
  "recur", "recur", -1532142362, null), null, new cljs.core.Symbol(null, ".", ".", -1640531481, null), null, new cljs.core.Symbol(null, "ns", "ns", -1640528002, null), null, new cljs.core.Symbol(null, "do", "do", -1640528316, null), null, new cljs.core.Symbol(null, "fn*", "fn*", -1640430053, null), null, new cljs.core.Symbol(null, "throw", "throw", -1530191713, null), null, new cljs.core.Symbol(null, "letfn*", "letfn*", 1548249632, null), null, new cljs.core.Symbol(null, "js*", "js*", -1640426054, 
  null), null, new cljs.core.Symbol(null, "defrecord*", "defrecord*", 774272013, null), null, new cljs.core.Symbol(null, "let*", "let*", -1637213400, null), null, new cljs.core.Symbol(null, "loop*", "loop*", -1537374273, null), null, new cljs.core.Symbol(null, "if", "if", -1640528170, null), null, new cljs.core.Symbol(null, "def", "def", -1640432194, null), null], !0), a)
};
goog.userAgent = {};
goog.userAgent.ASSUME_IE = !1;
goog.userAgent.ASSUME_GECKO = !1;
goog.userAgent.ASSUME_WEBKIT = !1;
goog.userAgent.ASSUME_MOBILE_WEBKIT = !1;
goog.userAgent.ASSUME_OPERA = !1;
goog.userAgent.ASSUME_ANY_VERSION = !1;
goog.userAgent.BROWSER_KNOWN_ = goog.userAgent.ASSUME_IE || goog.userAgent.ASSUME_GECKO || goog.userAgent.ASSUME_MOBILE_WEBKIT || goog.userAgent.ASSUME_WEBKIT || goog.userAgent.ASSUME_OPERA;
goog.userAgent.getUserAgentString = function() {
  return goog.global.navigator ? goog.global.navigator.userAgent : null
};
goog.userAgent.getNavigator = function() {
  return goog.global.navigator
};
goog.userAgent.init_ = function() {
  goog.userAgent.detectedOpera_ = !1;
  goog.userAgent.detectedIe_ = !1;
  goog.userAgent.detectedWebkit_ = !1;
  goog.userAgent.detectedMobile_ = !1;
  goog.userAgent.detectedGecko_ = !1;
  var a;
  if(!goog.userAgent.BROWSER_KNOWN_ && (a = goog.userAgent.getUserAgentString())) {
    var b = goog.userAgent.getNavigator();
    goog.userAgent.detectedOpera_ = 0 == a.indexOf("Opera");
    goog.userAgent.detectedIe_ = !goog.userAgent.detectedOpera_ && -1 != a.indexOf("MSIE");
    goog.userAgent.detectedWebkit_ = !goog.userAgent.detectedOpera_ && -1 != a.indexOf("WebKit");
    goog.userAgent.detectedMobile_ = goog.userAgent.detectedWebkit_ && -1 != a.indexOf("Mobile");
    goog.userAgent.detectedGecko_ = !goog.userAgent.detectedOpera_ && !goog.userAgent.detectedWebkit_ && "Gecko" == b.product
  }
};
goog.userAgent.BROWSER_KNOWN_ || goog.userAgent.init_();
goog.userAgent.OPERA = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_OPERA : goog.userAgent.detectedOpera_;
goog.userAgent.IE = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_IE : goog.userAgent.detectedIe_;
goog.userAgent.GECKO = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_GECKO : goog.userAgent.detectedGecko_;
goog.userAgent.WEBKIT = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_WEBKIT || goog.userAgent.ASSUME_MOBILE_WEBKIT : goog.userAgent.detectedWebkit_;
goog.userAgent.MOBILE = goog.userAgent.ASSUME_MOBILE_WEBKIT || goog.userAgent.detectedMobile_;
goog.userAgent.SAFARI = goog.userAgent.WEBKIT;
goog.userAgent.determinePlatform_ = function() {
  var a = goog.userAgent.getNavigator();
  return a && a.platform || ""
};
goog.userAgent.PLATFORM = goog.userAgent.determinePlatform_();
goog.userAgent.ASSUME_MAC = !1;
goog.userAgent.ASSUME_WINDOWS = !1;
goog.userAgent.ASSUME_LINUX = !1;
goog.userAgent.ASSUME_X11 = !1;
goog.userAgent.ASSUME_ANDROID = !1;
goog.userAgent.ASSUME_IPHONE = !1;
goog.userAgent.ASSUME_IPAD = !1;
goog.userAgent.PLATFORM_KNOWN_ = goog.userAgent.ASSUME_MAC || goog.userAgent.ASSUME_WINDOWS || goog.userAgent.ASSUME_LINUX || goog.userAgent.ASSUME_X11 || goog.userAgent.ASSUME_ANDROID || goog.userAgent.ASSUME_IPHONE || goog.userAgent.ASSUME_IPAD;
goog.userAgent.initPlatform_ = function() {
  goog.userAgent.detectedMac_ = goog.string.contains(goog.userAgent.PLATFORM, "Mac");
  goog.userAgent.detectedWindows_ = goog.string.contains(goog.userAgent.PLATFORM, "Win");
  goog.userAgent.detectedLinux_ = goog.string.contains(goog.userAgent.PLATFORM, "Linux");
  goog.userAgent.detectedX11_ = !!goog.userAgent.getNavigator() && goog.string.contains(goog.userAgent.getNavigator().appVersion || "", "X11");
  var a = goog.userAgent.getUserAgentString();
  goog.userAgent.detectedAndroid_ = !!a && 0 <= a.indexOf("Android");
  goog.userAgent.detectedIPhone_ = !!a && 0 <= a.indexOf("iPhone");
  goog.userAgent.detectedIPad_ = !!a && 0 <= a.indexOf("iPad")
};
goog.userAgent.PLATFORM_KNOWN_ || goog.userAgent.initPlatform_();
goog.userAgent.MAC = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_MAC : goog.userAgent.detectedMac_;
goog.userAgent.WINDOWS = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_WINDOWS : goog.userAgent.detectedWindows_;
goog.userAgent.LINUX = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_LINUX : goog.userAgent.detectedLinux_;
goog.userAgent.X11 = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_X11 : goog.userAgent.detectedX11_;
goog.userAgent.ANDROID = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_ANDROID : goog.userAgent.detectedAndroid_;
goog.userAgent.IPHONE = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_IPHONE : goog.userAgent.detectedIPhone_;
goog.userAgent.IPAD = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_IPAD : goog.userAgent.detectedIPad_;
goog.userAgent.determineVersion_ = function() {
  var a = "", b;
  goog.userAgent.OPERA && goog.global.opera ? (a = goog.global.opera.version, a = "function" == typeof a ? a() : a) : (goog.userAgent.GECKO ? b = /rv\:([^\);]+)(\)|;)/ : goog.userAgent.IE ? b = /MSIE\s+([^\);]+)(\)|;)/ : goog.userAgent.WEBKIT && (b = /WebKit\/(\S+)/), b && (a = (a = b.exec(goog.userAgent.getUserAgentString())) ? a[1] : ""));
  return goog.userAgent.IE && (b = goog.userAgent.getDocumentMode_(), b > parseFloat(a)) ? String(b) : a
};
goog.userAgent.getDocumentMode_ = function() {
  var a = goog.global.document;
  return a ? a.documentMode : void 0
};
goog.userAgent.VERSION = goog.userAgent.determineVersion_();
goog.userAgent.compare = function(a, b) {
  return goog.string.compareVersions(a, b)
};
goog.userAgent.isVersionCache_ = {};
goog.userAgent.isVersion = function(a) {
  return goog.userAgent.ASSUME_ANY_VERSION || goog.userAgent.isVersionCache_[a] || (goog.userAgent.isVersionCache_[a] = 0 <= goog.string.compareVersions(goog.userAgent.VERSION, a))
};
goog.userAgent.isDocumentMode = function(a) {
  return goog.userAgent.IE && goog.userAgent.DOCUMENT_MODE >= a
};
goog.userAgent.DOCUMENT_MODE = function() {
  var a = goog.global.document;
  return a && goog.userAgent.IE ? goog.userAgent.getDocumentMode_() || ("CSS1Compat" == a.compatMode ? parseInt(goog.userAgent.VERSION, 10) : 5) : void 0
}();
goog.dom = {};
goog.dom.BrowserFeature = {CAN_ADD_NAME_OR_TYPE_ATTRIBUTES:!goog.userAgent.IE || goog.userAgent.isDocumentMode(9), CAN_USE_CHILDREN_ATTRIBUTE:!goog.userAgent.GECKO && !goog.userAgent.IE || goog.userAgent.IE && goog.userAgent.isDocumentMode(9) || goog.userAgent.GECKO && goog.userAgent.isVersion("1.9.1"), CAN_USE_INNER_TEXT:goog.userAgent.IE && !goog.userAgent.isVersion("9"), CAN_USE_PARENT_ELEMENT_PROPERTY:goog.userAgent.IE || goog.userAgent.OPERA || goog.userAgent.WEBKIT, INNER_HTML_NEEDS_SCOPED_ELEMENT:goog.userAgent.IE};
goog.dom.TagName = {A:"A", ABBR:"ABBR", ACRONYM:"ACRONYM", ADDRESS:"ADDRESS", APPLET:"APPLET", AREA:"AREA", ARTICLE:"ARTICLE", ASIDE:"ASIDE", AUDIO:"AUDIO", B:"B", BASE:"BASE", BASEFONT:"BASEFONT", BDI:"BDI", BDO:"BDO", BIG:"BIG", BLOCKQUOTE:"BLOCKQUOTE", BODY:"BODY", BR:"BR", BUTTON:"BUTTON", CANVAS:"CANVAS", CAPTION:"CAPTION", CENTER:"CENTER", CITE:"CITE", CODE:"CODE", COL:"COL", COLGROUP:"COLGROUP", COMMAND:"COMMAND", DATA:"DATA", DATALIST:"DATALIST", DD:"DD", DEL:"DEL", DETAILS:"DETAILS", DFN:"DFN", 
DIALOG:"DIALOG", DIR:"DIR", DIV:"DIV", DL:"DL", DT:"DT", EM:"EM", EMBED:"EMBED", FIELDSET:"FIELDSET", FIGCAPTION:"FIGCAPTION", FIGURE:"FIGURE", FONT:"FONT", FOOTER:"FOOTER", FORM:"FORM", FRAME:"FRAME", FRAMESET:"FRAMESET", H1:"H1", H2:"H2", H3:"H3", H4:"H4", H5:"H5", H6:"H6", HEAD:"HEAD", HEADER:"HEADER", HGROUP:"HGROUP", HR:"HR", HTML:"HTML", I:"I", IFRAME:"IFRAME", IMG:"IMG", INPUT:"INPUT", INS:"INS", ISINDEX:"ISINDEX", KBD:"KBD", KEYGEN:"KEYGEN", LABEL:"LABEL", LEGEND:"LEGEND", LI:"LI", LINK:"LINK", 
MAP:"MAP", MARK:"MARK", MATH:"MATH", MENU:"MENU", META:"META", METER:"METER", NAV:"NAV", NOFRAMES:"NOFRAMES", NOSCRIPT:"NOSCRIPT", OBJECT:"OBJECT", OL:"OL", OPTGROUP:"OPTGROUP", OPTION:"OPTION", OUTPUT:"OUTPUT", P:"P", PARAM:"PARAM", PRE:"PRE", PROGRESS:"PROGRESS", Q:"Q", RP:"RP", RT:"RT", RUBY:"RUBY", S:"S", SAMP:"SAMP", SCRIPT:"SCRIPT", SECTION:"SECTION", SELECT:"SELECT", SMALL:"SMALL", SOURCE:"SOURCE", SPAN:"SPAN", STRIKE:"STRIKE", STRONG:"STRONG", STYLE:"STYLE", SUB:"SUB", SUMMARY:"SUMMARY", 
SUP:"SUP", SVG:"SVG", TABLE:"TABLE", TBODY:"TBODY", TD:"TD", TEXTAREA:"TEXTAREA", TFOOT:"TFOOT", TH:"TH", THEAD:"THEAD", TIME:"TIME", TITLE:"TITLE", TR:"TR", TRACK:"TRACK", TT:"TT", U:"U", UL:"UL", VAR:"VAR", VIDEO:"VIDEO", WBR:"WBR"};
goog.dom.classes = {};
goog.dom.classes.set = function(a, b) {
  a.className = b
};
goog.dom.classes.get = function(a) {
  a = a.className;
  return goog.isString(a) && a.match(/\S+/g) || []
};
goog.dom.classes.add = function(a, b) {
  var c = goog.dom.classes.get(a), d = goog.array.slice(arguments, 1), e = c.length + d.length;
  goog.dom.classes.add_(c, d);
  goog.dom.classes.set(a, c.join(" "));
  return c.length == e
};
goog.dom.classes.remove = function(a, b) {
  var c = goog.dom.classes.get(a), d = goog.array.slice(arguments, 1), e = goog.dom.classes.getDifference_(c, d);
  goog.dom.classes.set(a, e.join(" "));
  return e.length == c.length - d.length
};
goog.dom.classes.add_ = function(a, b) {
  for(var c = 0;c < b.length;c++) {
    goog.array.contains(a, b[c]) || a.push(b[c])
  }
};
goog.dom.classes.getDifference_ = function(a, b) {
  return goog.array.filter(a, function(a) {
    return!goog.array.contains(b, a)
  })
};
goog.dom.classes.swap = function(a, b, c) {
  for(var d = goog.dom.classes.get(a), e = !1, f = 0;f < d.length;f++) {
    d[f] == b && (goog.array.splice(d, f--, 1), e = !0)
  }
  e && (d.push(c), goog.dom.classes.set(a, d.join(" ")));
  return e
};
goog.dom.classes.addRemove = function(a, b, c) {
  var d = goog.dom.classes.get(a);
  goog.isString(b) ? goog.array.remove(d, b) : goog.isArray(b) && (d = goog.dom.classes.getDifference_(d, b));
  goog.isString(c) && !goog.array.contains(d, c) ? d.push(c) : goog.isArray(c) && goog.dom.classes.add_(d, c);
  goog.dom.classes.set(a, d.join(" "))
};
goog.dom.classes.has = function(a, b) {
  return goog.array.contains(goog.dom.classes.get(a), b)
};
goog.dom.classes.enable = function(a, b, c) {
  c ? goog.dom.classes.add(a, b) : goog.dom.classes.remove(a, b)
};
goog.dom.classes.toggle = function(a, b) {
  var c = !goog.dom.classes.has(a, b);
  goog.dom.classes.enable(a, b, c);
  return c
};
goog.math = {};
goog.math.randomInt = function(a) {
  return Math.floor(Math.random() * a)
};
goog.math.uniformRandom = function(a, b) {
  return a + Math.random() * (b - a)
};
goog.math.clamp = function(a, b, c) {
  return Math.min(Math.max(a, b), c)
};
goog.math.modulo = function(a, b) {
  var c = a % b;
  return 0 > c * b ? c + b : c
};
goog.math.lerp = function(a, b, c) {
  return a + c * (b - a)
};
goog.math.nearlyEquals = function(a, b, c) {
  return Math.abs(a - b) <= (c || 1E-6)
};
goog.math.standardAngle = function(a) {
  return goog.math.modulo(a, 360)
};
goog.math.toRadians = function(a) {
  return a * Math.PI / 180
};
goog.math.toDegrees = function(a) {
  return 180 * a / Math.PI
};
goog.math.angleDx = function(a, b) {
  return b * Math.cos(goog.math.toRadians(a))
};
goog.math.angleDy = function(a, b) {
  return b * Math.sin(goog.math.toRadians(a))
};
goog.math.angle = function(a, b, c, d) {
  return goog.math.standardAngle(goog.math.toDegrees(Math.atan2(d - b, c - a)))
};
goog.math.angleDifference = function(a, b) {
  var c = goog.math.standardAngle(b) - goog.math.standardAngle(a);
  180 < c ? c -= 360 : -180 >= c && (c = 360 + c);
  return c
};
goog.math.sign = function(a) {
  return 0 == a ? 0 : 0 > a ? -1 : 1
};
goog.math.longestCommonSubsequence = function(a, b, c, d) {
  c = c || function(a, b) {
    return a == b
  };
  d = d || function(b, c) {
    return a[b]
  };
  for(var e = a.length, f = b.length, g = [], h = 0;h < e + 1;h++) {
    g[h] = [], g[h][0] = 0
  }
  for(var k = 0;k < f + 1;k++) {
    g[0][k] = 0
  }
  for(h = 1;h <= e;h++) {
    for(k = 1;k <= e;k++) {
      c(a[h - 1], b[k - 1]) ? g[h][k] = g[h - 1][k - 1] + 1 : g[h][k] = Math.max(g[h - 1][k], g[h][k - 1])
    }
  }
  for(var l = [], h = e, k = f;0 < h && 0 < k;) {
    c(a[h - 1], b[k - 1]) ? (l.unshift(d(h - 1, k - 1)), h--, k--) : g[h - 1][k] > g[h][k - 1] ? h-- : k--
  }
  return l
};
goog.math.sum = function(a) {
  return goog.array.reduce(arguments, function(a, c) {
    return a + c
  }, 0)
};
goog.math.average = function(a) {
  return goog.math.sum.apply(null, arguments) / arguments.length
};
goog.math.standardDeviation = function(a) {
  var b = arguments.length;
  if(2 > b) {
    return 0
  }
  var c = goog.math.average.apply(null, arguments), b = goog.math.sum.apply(null, goog.array.map(arguments, function(a) {
    return Math.pow(a - c, 2)
  })) / (b - 1);
  return Math.sqrt(b)
};
goog.math.isInt = function(a) {
  return isFinite(a) && 0 == a % 1
};
goog.math.isFiniteNumber = function(a) {
  return isFinite(a) && !isNaN(a)
};
goog.math.safeFloor = function(a, b) {
  goog.asserts.assert(!goog.isDef(b) || 0 < b);
  return Math.floor(a + (b || 2E-15))
};
goog.math.safeCeil = function(a, b) {
  goog.asserts.assert(!goog.isDef(b) || 0 < b);
  return Math.ceil(a - (b || 2E-15))
};
goog.math.Coordinate = function(a, b) {
  this.x = goog.isDef(a) ? a : 0;
  this.y = goog.isDef(b) ? b : 0
};
goog.math.Coordinate.prototype.clone = function() {
  return new goog.math.Coordinate(this.x, this.y)
};
goog.DEBUG && (goog.math.Coordinate.prototype.toString = function() {
  return"(" + this.x + ", " + this.y + ")"
});
goog.math.Coordinate.equals = function(a, b) {
  return a == b ? !0 : a && b ? a.x == b.x && a.y == b.y : !1
};
goog.math.Coordinate.distance = function(a, b) {
  var c = a.x - b.x, d = a.y - b.y;
  return Math.sqrt(c * c + d * d)
};
goog.math.Coordinate.magnitude = function(a) {
  return Math.sqrt(a.x * a.x + a.y * a.y)
};
goog.math.Coordinate.azimuth = function(a) {
  return goog.math.angle(0, 0, a.x, a.y)
};
goog.math.Coordinate.squaredDistance = function(a, b) {
  var c = a.x - b.x, d = a.y - b.y;
  return c * c + d * d
};
goog.math.Coordinate.difference = function(a, b) {
  return new goog.math.Coordinate(a.x - b.x, a.y - b.y)
};
goog.math.Coordinate.sum = function(a, b) {
  return new goog.math.Coordinate(a.x + b.x, a.y + b.y)
};
goog.math.Coordinate.prototype.ceil = function() {
  this.x = Math.ceil(this.x);
  this.y = Math.ceil(this.y);
  return this
};
goog.math.Coordinate.prototype.floor = function() {
  this.x = Math.floor(this.x);
  this.y = Math.floor(this.y);
  return this
};
goog.math.Coordinate.prototype.round = function() {
  this.x = Math.round(this.x);
  this.y = Math.round(this.y);
  return this
};
goog.math.Coordinate.prototype.translate = function(a, b) {
  a instanceof goog.math.Coordinate ? (this.x += a.x, this.y += a.y) : (this.x += a, goog.isNumber(b) && (this.y += b));
  return this
};
goog.math.Coordinate.prototype.scale = function(a, b) {
  var c = goog.isNumber(b) ? b : a;
  this.x *= a;
  this.y *= c;
  return this
};
goog.math.Size = function(a, b) {
  this.width = a;
  this.height = b
};
goog.math.Size.equals = function(a, b) {
  return a == b ? !0 : a && b ? a.width == b.width && a.height == b.height : !1
};
goog.math.Size.prototype.clone = function() {
  return new goog.math.Size(this.width, this.height)
};
goog.DEBUG && (goog.math.Size.prototype.toString = function() {
  return"(" + this.width + " x " + this.height + ")"
});
goog.math.Size.prototype.getLongest = function() {
  return Math.max(this.width, this.height)
};
goog.math.Size.prototype.getShortest = function() {
  return Math.min(this.width, this.height)
};
goog.math.Size.prototype.area = function() {
  return this.width * this.height
};
goog.math.Size.prototype.perimeter = function() {
  return 2 * (this.width + this.height)
};
goog.math.Size.prototype.aspectRatio = function() {
  return this.width / this.height
};
goog.math.Size.prototype.isEmpty = function() {
  return!this.area()
};
goog.math.Size.prototype.ceil = function() {
  this.width = Math.ceil(this.width);
  this.height = Math.ceil(this.height);
  return this
};
goog.math.Size.prototype.fitsInside = function(a) {
  return this.width <= a.width && this.height <= a.height
};
goog.math.Size.prototype.floor = function() {
  this.width = Math.floor(this.width);
  this.height = Math.floor(this.height);
  return this
};
goog.math.Size.prototype.round = function() {
  this.width = Math.round(this.width);
  this.height = Math.round(this.height);
  return this
};
goog.math.Size.prototype.scale = function(a, b) {
  var c = goog.isNumber(b) ? b : a;
  this.width *= a;
  this.height *= c;
  return this
};
goog.math.Size.prototype.scaleToFit = function(a) {
  a = this.aspectRatio() > a.aspectRatio() ? a.width / this.width : a.height / this.height;
  return this.scale(a)
};
goog.dom.ASSUME_QUIRKS_MODE = !1;
goog.dom.ASSUME_STANDARDS_MODE = !1;
goog.dom.COMPAT_MODE_KNOWN_ = goog.dom.ASSUME_QUIRKS_MODE || goog.dom.ASSUME_STANDARDS_MODE;
goog.dom.NodeType = {ELEMENT:1, ATTRIBUTE:2, TEXT:3, CDATA_SECTION:4, ENTITY_REFERENCE:5, ENTITY:6, PROCESSING_INSTRUCTION:7, COMMENT:8, DOCUMENT:9, DOCUMENT_TYPE:10, DOCUMENT_FRAGMENT:11, NOTATION:12};
goog.dom.getDomHelper = function(a) {
  return a ? new goog.dom.DomHelper(goog.dom.getOwnerDocument(a)) : goog.dom.defaultDomHelper_ || (goog.dom.defaultDomHelper_ = new goog.dom.DomHelper)
};
goog.dom.getDocument = function() {
  return document
};
goog.dom.getElement = function(a) {
  return goog.isString(a) ? document.getElementById(a) : a
};
goog.dom.$ = goog.dom.getElement;
goog.dom.getElementsByTagNameAndClass = function(a, b, c) {
  return goog.dom.getElementsByTagNameAndClass_(document, a, b, c)
};
goog.dom.getElementsByClass = function(a, b) {
  var c = b || document;
  return goog.dom.canUseQuerySelector_(c) ? c.querySelectorAll("." + a) : c.getElementsByClassName ? c.getElementsByClassName(a) : goog.dom.getElementsByTagNameAndClass_(document, "*", a, b)
};
goog.dom.getElementByClass = function(a, b) {
  var c = b || document, d = null;
  return(d = goog.dom.canUseQuerySelector_(c) ? c.querySelector("." + a) : goog.dom.getElementsByClass(a, b)[0]) || null
};
goog.dom.canUseQuerySelector_ = function(a) {
  return!(!a.querySelectorAll || !a.querySelector)
};
goog.dom.getElementsByTagNameAndClass_ = function(a, b, c, d) {
  a = d || a;
  b = b && "*" != b ? b.toUpperCase() : "";
  if(goog.dom.canUseQuerySelector_(a) && (b || c)) {
    return a.querySelectorAll(b + (c ? "." + c : ""))
  }
  if(c && a.getElementsByClassName) {
    a = a.getElementsByClassName(c);
    if(b) {
      d = {};
      for(var e = 0, f = 0, g;g = a[f];f++) {
        b == g.nodeName && (d[e++] = g)
      }
      d.length = e;
      return d
    }
    return a
  }
  a = a.getElementsByTagName(b || "*");
  if(c) {
    d = {};
    for(f = e = 0;g = a[f];f++) {
      b = g.className, "function" == typeof b.split && goog.array.contains(b.split(/\s+/), c) && (d[e++] = g)
    }
    d.length = e;
    return d
  }
  return a
};
goog.dom.$$ = goog.dom.getElementsByTagNameAndClass;
goog.dom.setProperties = function(a, b) {
  goog.object.forEach(b, function(b, d) {
    "style" == d ? a.style.cssText = b : "class" == d ? a.className = b : "for" == d ? a.htmlFor = b : d in goog.dom.DIRECT_ATTRIBUTE_MAP_ ? a.setAttribute(goog.dom.DIRECT_ATTRIBUTE_MAP_[d], b) : goog.string.startsWith(d, "aria-") || goog.string.startsWith(d, "data-") ? a.setAttribute(d, b) : a[d] = b
  })
};
goog.dom.DIRECT_ATTRIBUTE_MAP_ = {cellpadding:"cellPadding", cellspacing:"cellSpacing", colspan:"colSpan", frameborder:"frameBorder", height:"height", maxlength:"maxLength", role:"role", rowspan:"rowSpan", type:"type", usemap:"useMap", valign:"vAlign", width:"width"};
goog.dom.getViewportSize = function(a) {
  return goog.dom.getViewportSize_(a || window)
};
goog.dom.getViewportSize_ = function(a) {
  a = a.document;
  a = goog.dom.isCss1CompatMode_(a) ? a.documentElement : a.body;
  return new goog.math.Size(a.clientWidth, a.clientHeight)
};
goog.dom.getDocumentHeight = function() {
  return goog.dom.getDocumentHeight_(window)
};
goog.dom.getDocumentHeight_ = function(a) {
  var b = a.document, c = 0;
  if(b) {
    a = goog.dom.getViewportSize_(a).height;
    var c = b.body, d = b.documentElement;
    if(goog.dom.isCss1CompatMode_(b) && d.scrollHeight) {
      c = d.scrollHeight != a ? d.scrollHeight : d.offsetHeight
    }else {
      var b = d.scrollHeight, e = d.offsetHeight;
      d.clientHeight != e && (b = c.scrollHeight, e = c.offsetHeight);
      c = b > a ? b > e ? b : e : b < e ? b : e
    }
  }
  return c
};
goog.dom.getPageScroll = function(a) {
  return goog.dom.getDomHelper((a || goog.global || window).document).getDocumentScroll()
};
goog.dom.getDocumentScroll = function() {
  return goog.dom.getDocumentScroll_(document)
};
goog.dom.getDocumentScroll_ = function(a) {
  var b = goog.dom.getDocumentScrollElement_(a);
  a = goog.dom.getWindow_(a);
  return new goog.math.Coordinate(a.pageXOffset || b.scrollLeft, a.pageYOffset || b.scrollTop)
};
goog.dom.getDocumentScrollElement = function() {
  return goog.dom.getDocumentScrollElement_(document)
};
goog.dom.getDocumentScrollElement_ = function(a) {
  return!goog.userAgent.WEBKIT && goog.dom.isCss1CompatMode_(a) ? a.documentElement : a.body
};
goog.dom.getWindow = function(a) {
  return a ? goog.dom.getWindow_(a) : window
};
goog.dom.getWindow_ = function(a) {
  return a.parentWindow || a.defaultView
};
goog.dom.createDom = function(a, b, c) {
  return goog.dom.createDom_(document, arguments)
};
goog.dom.createDom_ = function(a, b) {
  var c = b[0], d = b[1];
  if(!goog.dom.BrowserFeature.CAN_ADD_NAME_OR_TYPE_ATTRIBUTES && d && (d.name || d.type)) {
    c = ["\x3c", c];
    d.name && c.push(' name\x3d"', goog.string.htmlEscape(d.name), '"');
    if(d.type) {
      c.push(' type\x3d"', goog.string.htmlEscape(d.type), '"');
      var e = {};
      goog.object.extend(e, d);
      delete e.type;
      d = e
    }
    c.push("\x3e");
    c = c.join("")
  }
  c = a.createElement(c);
  d && (goog.isString(d) ? c.className = d : goog.isArray(d) ? goog.dom.classes.add.apply(null, [c].concat(d)) : goog.dom.setProperties(c, d));
  2 < b.length && goog.dom.append_(a, c, b, 2);
  return c
};
goog.dom.append_ = function(a, b, c, d) {
  function e(c) {
    c && b.appendChild(goog.isString(c) ? a.createTextNode(c) : c)
  }
  for(;d < c.length;d++) {
    var f = c[d];
    goog.isArrayLike(f) && !goog.dom.isNodeLike(f) ? goog.array.forEach(goog.dom.isNodeList(f) ? goog.array.toArray(f) : f, e) : e(f)
  }
};
goog.dom.$dom = goog.dom.createDom;
goog.dom.createElement = function(a) {
  return document.createElement(a)
};
goog.dom.createTextNode = function(a) {
  return document.createTextNode(String(a))
};
goog.dom.createTable = function(a, b, c) {
  return goog.dom.createTable_(document, a, b, !!c)
};
goog.dom.createTable_ = function(a, b, c, d) {
  for(var e = ["\x3ctr\x3e"], f = 0;f < c;f++) {
    e.push(d ? "\x3ctd\x3e\x26nbsp;\x3c/td\x3e" : "\x3ctd\x3e\x3c/td\x3e")
  }
  e.push("\x3c/tr\x3e");
  e = e.join("");
  c = ["\x3ctable\x3e"];
  for(f = 0;f < b;f++) {
    c.push(e)
  }
  c.push("\x3c/table\x3e");
  a = a.createElement(goog.dom.TagName.DIV);
  a.innerHTML = c.join("");
  return a.removeChild(a.firstChild)
};
goog.dom.htmlToDocumentFragment = function(a) {
  return goog.dom.htmlToDocumentFragment_(document, a)
};
goog.dom.htmlToDocumentFragment_ = function(a, b) {
  var c = a.createElement("div");
  goog.dom.BrowserFeature.INNER_HTML_NEEDS_SCOPED_ELEMENT ? (c.innerHTML = "\x3cbr\x3e" + b, c.removeChild(c.firstChild)) : c.innerHTML = b;
  if(1 == c.childNodes.length) {
    return c.removeChild(c.firstChild)
  }
  for(var d = a.createDocumentFragment();c.firstChild;) {
    d.appendChild(c.firstChild)
  }
  return d
};
goog.dom.getCompatMode = function() {
  return goog.dom.isCss1CompatMode() ? "CSS1Compat" : "BackCompat"
};
goog.dom.isCss1CompatMode = function() {
  return goog.dom.isCss1CompatMode_(document)
};
goog.dom.isCss1CompatMode_ = function(a) {
  return goog.dom.COMPAT_MODE_KNOWN_ ? goog.dom.ASSUME_STANDARDS_MODE : "CSS1Compat" == a.compatMode
};
goog.dom.canHaveChildren = function(a) {
  if(a.nodeType != goog.dom.NodeType.ELEMENT) {
    return!1
  }
  switch(a.tagName) {
    case goog.dom.TagName.APPLET:
    ;
    case goog.dom.TagName.AREA:
    ;
    case goog.dom.TagName.BASE:
    ;
    case goog.dom.TagName.BR:
    ;
    case goog.dom.TagName.COL:
    ;
    case goog.dom.TagName.COMMAND:
    ;
    case goog.dom.TagName.EMBED:
    ;
    case goog.dom.TagName.FRAME:
    ;
    case goog.dom.TagName.HR:
    ;
    case goog.dom.TagName.IMG:
    ;
    case goog.dom.TagName.INPUT:
    ;
    case goog.dom.TagName.IFRAME:
    ;
    case goog.dom.TagName.ISINDEX:
    ;
    case goog.dom.TagName.KEYGEN:
    ;
    case goog.dom.TagName.LINK:
    ;
    case goog.dom.TagName.NOFRAMES:
    ;
    case goog.dom.TagName.NOSCRIPT:
    ;
    case goog.dom.TagName.META:
    ;
    case goog.dom.TagName.OBJECT:
    ;
    case goog.dom.TagName.PARAM:
    ;
    case goog.dom.TagName.SCRIPT:
    ;
    case goog.dom.TagName.SOURCE:
    ;
    case goog.dom.TagName.STYLE:
    ;
    case goog.dom.TagName.TRACK:
    ;
    case goog.dom.TagName.WBR:
      return!1
  }
  return!0
};
goog.dom.appendChild = function(a, b) {
  a.appendChild(b)
};
goog.dom.append = function(a, b) {
  goog.dom.append_(goog.dom.getOwnerDocument(a), a, arguments, 1)
};
goog.dom.removeChildren = function(a) {
  for(var b;b = a.firstChild;) {
    a.removeChild(b)
  }
};
goog.dom.insertSiblingBefore = function(a, b) {
  b.parentNode && b.parentNode.insertBefore(a, b)
};
goog.dom.insertSiblingAfter = function(a, b) {
  b.parentNode && b.parentNode.insertBefore(a, b.nextSibling)
};
goog.dom.insertChildAt = function(a, b, c) {
  a.insertBefore(b, a.childNodes[c] || null)
};
goog.dom.removeNode = function(a) {
  return a && a.parentNode ? a.parentNode.removeChild(a) : null
};
goog.dom.replaceNode = function(a, b) {
  var c = b.parentNode;
  c && c.replaceChild(a, b)
};
goog.dom.flattenElement = function(a) {
  var b, c = a.parentNode;
  if(c && c.nodeType != goog.dom.NodeType.DOCUMENT_FRAGMENT) {
    if(a.removeNode) {
      return a.removeNode(!1)
    }
    for(;b = a.firstChild;) {
      c.insertBefore(b, a)
    }
    return goog.dom.removeNode(a)
  }
};
goog.dom.getChildren = function(a) {
  return goog.dom.BrowserFeature.CAN_USE_CHILDREN_ATTRIBUTE && void 0 != a.children ? a.children : goog.array.filter(a.childNodes, function(a) {
    return a.nodeType == goog.dom.NodeType.ELEMENT
  })
};
goog.dom.getFirstElementChild = function(a) {
  return void 0 != a.firstElementChild ? a.firstElementChild : goog.dom.getNextElementNode_(a.firstChild, !0)
};
goog.dom.getLastElementChild = function(a) {
  return void 0 != a.lastElementChild ? a.lastElementChild : goog.dom.getNextElementNode_(a.lastChild, !1)
};
goog.dom.getNextElementSibling = function(a) {
  return void 0 != a.nextElementSibling ? a.nextElementSibling : goog.dom.getNextElementNode_(a.nextSibling, !0)
};
goog.dom.getPreviousElementSibling = function(a) {
  return void 0 != a.previousElementSibling ? a.previousElementSibling : goog.dom.getNextElementNode_(a.previousSibling, !1)
};
goog.dom.getNextElementNode_ = function(a, b) {
  for(;a && a.nodeType != goog.dom.NodeType.ELEMENT;) {
    a = b ? a.nextSibling : a.previousSibling
  }
  return a
};
goog.dom.getNextNode = function(a) {
  if(!a) {
    return null
  }
  if(a.firstChild) {
    return a.firstChild
  }
  for(;a && !a.nextSibling;) {
    a = a.parentNode
  }
  return a ? a.nextSibling : null
};
goog.dom.getPreviousNode = function(a) {
  if(!a) {
    return null
  }
  if(!a.previousSibling) {
    return a.parentNode
  }
  for(a = a.previousSibling;a && a.lastChild;) {
    a = a.lastChild
  }
  return a
};
goog.dom.isNodeLike = function(a) {
  return goog.isObject(a) && 0 < a.nodeType
};
goog.dom.isElement = function(a) {
  return goog.isObject(a) && a.nodeType == goog.dom.NodeType.ELEMENT
};
goog.dom.isWindow = function(a) {
  return goog.isObject(a) && a.window == a
};
goog.dom.getParentElement = function(a) {
  if(goog.dom.BrowserFeature.CAN_USE_PARENT_ELEMENT_PROPERTY) {
    return a.parentElement
  }
  a = a.parentNode;
  return goog.dom.isElement(a) ? a : null
};
goog.dom.contains = function(a, b) {
  if(a.contains && b.nodeType == goog.dom.NodeType.ELEMENT) {
    return a == b || a.contains(b)
  }
  if("undefined" != typeof a.compareDocumentPosition) {
    return a == b || Boolean(a.compareDocumentPosition(b) & 16)
  }
  for(;b && a != b;) {
    b = b.parentNode
  }
  return b == a
};
goog.dom.compareNodeOrder = function(a, b) {
  if(a == b) {
    return 0
  }
  if(a.compareDocumentPosition) {
    return a.compareDocumentPosition(b) & 2 ? 1 : -1
  }
  if(goog.userAgent.IE && !goog.userAgent.isDocumentMode(9)) {
    if(a.nodeType == goog.dom.NodeType.DOCUMENT) {
      return-1
    }
    if(b.nodeType == goog.dom.NodeType.DOCUMENT) {
      return 1
    }
  }
  if("sourceIndex" in a || a.parentNode && "sourceIndex" in a.parentNode) {
    var c = a.nodeType == goog.dom.NodeType.ELEMENT, d = b.nodeType == goog.dom.NodeType.ELEMENT;
    if(c && d) {
      return a.sourceIndex - b.sourceIndex
    }
    var e = a.parentNode, f = b.parentNode;
    return e == f ? goog.dom.compareSiblingOrder_(a, b) : !c && goog.dom.contains(e, b) ? -1 * goog.dom.compareParentsDescendantNodeIe_(a, b) : !d && goog.dom.contains(f, a) ? goog.dom.compareParentsDescendantNodeIe_(b, a) : (c ? a.sourceIndex : e.sourceIndex) - (d ? b.sourceIndex : f.sourceIndex)
  }
  d = goog.dom.getOwnerDocument(a);
  c = d.createRange();
  c.selectNode(a);
  c.collapse(!0);
  d = d.createRange();
  d.selectNode(b);
  d.collapse(!0);
  return c.compareBoundaryPoints(goog.global.Range.START_TO_END, d)
};
goog.dom.compareParentsDescendantNodeIe_ = function(a, b) {
  var c = a.parentNode;
  if(c == b) {
    return-1
  }
  for(var d = b;d.parentNode != c;) {
    d = d.parentNode
  }
  return goog.dom.compareSiblingOrder_(d, a)
};
goog.dom.compareSiblingOrder_ = function(a, b) {
  for(var c = b;c = c.previousSibling;) {
    if(c == a) {
      return-1
    }
  }
  return 1
};
goog.dom.findCommonAncestor = function(a) {
  var b, c = arguments.length;
  if(!c) {
    return null
  }
  if(1 == c) {
    return arguments[0]
  }
  var d = [], e = Infinity;
  for(b = 0;b < c;b++) {
    for(var f = [], g = arguments[b];g;) {
      f.unshift(g), g = g.parentNode
    }
    d.push(f);
    e = Math.min(e, f.length)
  }
  f = null;
  for(b = 0;b < e;b++) {
    for(var g = d[0][b], h = 1;h < c;h++) {
      if(g != d[h][b]) {
        return f
      }
    }
    f = g
  }
  return f
};
goog.dom.getOwnerDocument = function(a) {
  return a.nodeType == goog.dom.NodeType.DOCUMENT ? a : a.ownerDocument || a.document
};
goog.dom.getFrameContentDocument = function(a) {
  return a.contentDocument || a.contentWindow.document
};
goog.dom.getFrameContentWindow = function(a) {
  return a.contentWindow || goog.dom.getWindow_(goog.dom.getFrameContentDocument(a))
};
goog.dom.setTextContent = function(a, b) {
  if("textContent" in a) {
    a.textContent = b
  }else {
    if(a.firstChild && a.firstChild.nodeType == goog.dom.NodeType.TEXT) {
      for(;a.lastChild != a.firstChild;) {
        a.removeChild(a.lastChild)
      }
      a.firstChild.data = b
    }else {
      goog.dom.removeChildren(a);
      var c = goog.dom.getOwnerDocument(a);
      a.appendChild(c.createTextNode(String(b)))
    }
  }
};
goog.dom.getOuterHtml = function(a) {
  if("outerHTML" in a) {
    return a.outerHTML
  }
  var b = goog.dom.getOwnerDocument(a).createElement("div");
  b.appendChild(a.cloneNode(!0));
  return b.innerHTML
};
goog.dom.findNode = function(a, b) {
  var c = [];
  return goog.dom.findNodes_(a, b, c, !0) ? c[0] : void 0
};
goog.dom.findNodes = function(a, b) {
  var c = [];
  goog.dom.findNodes_(a, b, c, !1);
  return c
};
goog.dom.findNodes_ = function(a, b, c, d) {
  if(null != a) {
    for(a = a.firstChild;a;) {
      if(b(a) && (c.push(a), d) || goog.dom.findNodes_(a, b, c, d)) {
        return!0
      }
      a = a.nextSibling
    }
  }
  return!1
};
goog.dom.TAGS_TO_IGNORE_ = {SCRIPT:1, STYLE:1, HEAD:1, IFRAME:1, OBJECT:1};
goog.dom.PREDEFINED_TAG_VALUES_ = {IMG:" ", BR:"\n"};
goog.dom.isFocusableTabIndex = function(a) {
  var b = a.getAttributeNode("tabindex");
  return b && b.specified ? (a = a.tabIndex, goog.isNumber(a) && 0 <= a && 32768 > a) : !1
};
goog.dom.setFocusableTabIndex = function(a, b) {
  b ? a.tabIndex = 0 : (a.tabIndex = -1, a.removeAttribute("tabIndex"))
};
goog.dom.getTextContent = function(a) {
  if(goog.dom.BrowserFeature.CAN_USE_INNER_TEXT && "innerText" in a) {
    a = goog.string.canonicalizeNewlines(a.innerText)
  }else {
    var b = [];
    goog.dom.getTextContent_(a, b, !0);
    a = b.join("")
  }
  a = a.replace(/ \xAD /g, " ").replace(/\xAD/g, "");
  a = a.replace(/\u200B/g, "");
  goog.dom.BrowserFeature.CAN_USE_INNER_TEXT || (a = a.replace(/ +/g, " "));
  " " != a && (a = a.replace(/^\s*/, ""));
  return a
};
goog.dom.getRawTextContent = function(a) {
  var b = [];
  goog.dom.getTextContent_(a, b, !1);
  return b.join("")
};
goog.dom.getTextContent_ = function(a, b, c) {
  if(!(a.nodeName in goog.dom.TAGS_TO_IGNORE_)) {
    if(a.nodeType == goog.dom.NodeType.TEXT) {
      c ? b.push(String(a.nodeValue).replace(/(\r\n|\r|\n)/g, "")) : b.push(a.nodeValue)
    }else {
      if(a.nodeName in goog.dom.PREDEFINED_TAG_VALUES_) {
        b.push(goog.dom.PREDEFINED_TAG_VALUES_[a.nodeName])
      }else {
        for(a = a.firstChild;a;) {
          goog.dom.getTextContent_(a, b, c), a = a.nextSibling
        }
      }
    }
  }
};
goog.dom.getNodeTextLength = function(a) {
  return goog.dom.getTextContent(a).length
};
goog.dom.getNodeTextOffset = function(a, b) {
  for(var c = b || goog.dom.getOwnerDocument(a).body, d = [];a && a != c;) {
    for(var e = a;e = e.previousSibling;) {
      d.unshift(goog.dom.getTextContent(e))
    }
    a = a.parentNode
  }
  return goog.string.trimLeft(d.join("")).replace(/ +/g, " ").length
};
goog.dom.getNodeAtOffset = function(a, b, c) {
  a = [a];
  for(var d = 0, e = null;0 < a.length && d < b;) {
    if(e = a.pop(), !(e.nodeName in goog.dom.TAGS_TO_IGNORE_)) {
      if(e.nodeType == goog.dom.NodeType.TEXT) {
        var f = e.nodeValue.replace(/(\r\n|\r|\n)/g, "").replace(/ +/g, " "), d = d + f.length
      }else {
        if(e.nodeName in goog.dom.PREDEFINED_TAG_VALUES_) {
          d += goog.dom.PREDEFINED_TAG_VALUES_[e.nodeName].length
        }else {
          for(f = e.childNodes.length - 1;0 <= f;f--) {
            a.push(e.childNodes[f])
          }
        }
      }
    }
  }
  goog.isObject(c) && (c.remainder = e ? e.nodeValue.length + b - d - 1 : 0, c.node = e);
  return e
};
goog.dom.isNodeList = function(a) {
  if(a && "number" == typeof a.length) {
    if(goog.isObject(a)) {
      return"function" == typeof a.item || "string" == typeof a.item
    }
    if(goog.isFunction(a)) {
      return"function" == typeof a.item
    }
  }
  return!1
};
goog.dom.getAncestorByTagNameAndClass = function(a, b, c) {
  if(!b && !c) {
    return null
  }
  var d = b ? b.toUpperCase() : null;
  return goog.dom.getAncestor(a, function(a) {
    return(!d || a.nodeName == d) && (!c || goog.dom.classes.has(a, c))
  }, !0)
};
goog.dom.getAncestorByClass = function(a, b) {
  return goog.dom.getAncestorByTagNameAndClass(a, null, b)
};
goog.dom.getAncestor = function(a, b, c, d) {
  c || (a = a.parentNode);
  c = null == d;
  for(var e = 0;a && (c || e <= d);) {
    if(b(a)) {
      return a
    }
    a = a.parentNode;
    e++
  }
  return null
};
goog.dom.getActiveElement = function(a) {
  try {
    return a && a.activeElement
  }catch(b) {
  }
  return null
};
goog.dom.DomHelper = function(a) {
  this.document_ = a || goog.global.document || document
};
goog.dom.DomHelper.prototype.getDomHelper = goog.dom.getDomHelper;
goog.dom.DomHelper.prototype.setDocument = function(a) {
  this.document_ = a
};
goog.dom.DomHelper.prototype.getDocument = function() {
  return this.document_
};
goog.dom.DomHelper.prototype.getElement = function(a) {
  return goog.isString(a) ? this.document_.getElementById(a) : a
};
goog.dom.DomHelper.prototype.$ = goog.dom.DomHelper.prototype.getElement;
goog.dom.DomHelper.prototype.getElementsByTagNameAndClass = function(a, b, c) {
  return goog.dom.getElementsByTagNameAndClass_(this.document_, a, b, c)
};
goog.dom.DomHelper.prototype.getElementsByClass = function(a, b) {
  return goog.dom.getElementsByClass(a, b || this.document_)
};
goog.dom.DomHelper.prototype.getElementByClass = function(a, b) {
  return goog.dom.getElementByClass(a, b || this.document_)
};
goog.dom.DomHelper.prototype.$$ = goog.dom.DomHelper.prototype.getElementsByTagNameAndClass;
goog.dom.DomHelper.prototype.setProperties = goog.dom.setProperties;
goog.dom.DomHelper.prototype.getViewportSize = function(a) {
  return goog.dom.getViewportSize(a || this.getWindow())
};
goog.dom.DomHelper.prototype.getDocumentHeight = function() {
  return goog.dom.getDocumentHeight_(this.getWindow())
};
goog.dom.DomHelper.prototype.createDom = function(a, b, c) {
  return goog.dom.createDom_(this.document_, arguments)
};
goog.dom.DomHelper.prototype.$dom = goog.dom.DomHelper.prototype.createDom;
goog.dom.DomHelper.prototype.createElement = function(a) {
  return this.document_.createElement(a)
};
goog.dom.DomHelper.prototype.createTextNode = function(a) {
  return this.document_.createTextNode(String(a))
};
goog.dom.DomHelper.prototype.createTable = function(a, b, c) {
  return goog.dom.createTable_(this.document_, a, b, !!c)
};
goog.dom.DomHelper.prototype.htmlToDocumentFragment = function(a) {
  return goog.dom.htmlToDocumentFragment_(this.document_, a)
};
goog.dom.DomHelper.prototype.getCompatMode = function() {
  return this.isCss1CompatMode() ? "CSS1Compat" : "BackCompat"
};
goog.dom.DomHelper.prototype.isCss1CompatMode = function() {
  return goog.dom.isCss1CompatMode_(this.document_)
};
goog.dom.DomHelper.prototype.getWindow = function() {
  return goog.dom.getWindow_(this.document_)
};
goog.dom.DomHelper.prototype.getDocumentScrollElement = function() {
  return goog.dom.getDocumentScrollElement_(this.document_)
};
goog.dom.DomHelper.prototype.getDocumentScroll = function() {
  return goog.dom.getDocumentScroll_(this.document_)
};
goog.dom.DomHelper.prototype.getActiveElement = function(a) {
  return goog.dom.getActiveElement(a || this.document_)
};
goog.dom.DomHelper.prototype.appendChild = goog.dom.appendChild;
goog.dom.DomHelper.prototype.append = goog.dom.append;
goog.dom.DomHelper.prototype.canHaveChildren = goog.dom.canHaveChildren;
goog.dom.DomHelper.prototype.removeChildren = goog.dom.removeChildren;
goog.dom.DomHelper.prototype.insertSiblingBefore = goog.dom.insertSiblingBefore;
goog.dom.DomHelper.prototype.insertSiblingAfter = goog.dom.insertSiblingAfter;
goog.dom.DomHelper.prototype.insertChildAt = goog.dom.insertChildAt;
goog.dom.DomHelper.prototype.removeNode = goog.dom.removeNode;
goog.dom.DomHelper.prototype.replaceNode = goog.dom.replaceNode;
goog.dom.DomHelper.prototype.flattenElement = goog.dom.flattenElement;
goog.dom.DomHelper.prototype.getChildren = goog.dom.getChildren;
goog.dom.DomHelper.prototype.getFirstElementChild = goog.dom.getFirstElementChild;
goog.dom.DomHelper.prototype.getLastElementChild = goog.dom.getLastElementChild;
goog.dom.DomHelper.prototype.getNextElementSibling = goog.dom.getNextElementSibling;
goog.dom.DomHelper.prototype.getPreviousElementSibling = goog.dom.getPreviousElementSibling;
goog.dom.DomHelper.prototype.getNextNode = goog.dom.getNextNode;
goog.dom.DomHelper.prototype.getPreviousNode = goog.dom.getPreviousNode;
goog.dom.DomHelper.prototype.isNodeLike = goog.dom.isNodeLike;
goog.dom.DomHelper.prototype.isElement = goog.dom.isElement;
goog.dom.DomHelper.prototype.isWindow = goog.dom.isWindow;
goog.dom.DomHelper.prototype.getParentElement = goog.dom.getParentElement;
goog.dom.DomHelper.prototype.contains = goog.dom.contains;
goog.dom.DomHelper.prototype.compareNodeOrder = goog.dom.compareNodeOrder;
goog.dom.DomHelper.prototype.findCommonAncestor = goog.dom.findCommonAncestor;
goog.dom.DomHelper.prototype.getOwnerDocument = goog.dom.getOwnerDocument;
goog.dom.DomHelper.prototype.getFrameContentDocument = goog.dom.getFrameContentDocument;
goog.dom.DomHelper.prototype.getFrameContentWindow = goog.dom.getFrameContentWindow;
goog.dom.DomHelper.prototype.setTextContent = goog.dom.setTextContent;
goog.dom.DomHelper.prototype.getOuterHtml = goog.dom.getOuterHtml;
goog.dom.DomHelper.prototype.findNode = goog.dom.findNode;
goog.dom.DomHelper.prototype.findNodes = goog.dom.findNodes;
goog.dom.DomHelper.prototype.isFocusableTabIndex = goog.dom.isFocusableTabIndex;
goog.dom.DomHelper.prototype.setFocusableTabIndex = goog.dom.setFocusableTabIndex;
goog.dom.DomHelper.prototype.getTextContent = goog.dom.getTextContent;
goog.dom.DomHelper.prototype.getNodeTextLength = goog.dom.getNodeTextLength;
goog.dom.DomHelper.prototype.getNodeTextOffset = goog.dom.getNodeTextOffset;
goog.dom.DomHelper.prototype.getNodeAtOffset = goog.dom.getNodeAtOffset;
goog.dom.DomHelper.prototype.isNodeList = goog.dom.isNodeList;
goog.dom.DomHelper.prototype.getAncestorByTagNameAndClass = goog.dom.getAncestorByTagNameAndClass;
goog.dom.DomHelper.prototype.getAncestorByClass = goog.dom.getAncestorByClass;
goog.dom.DomHelper.prototype.getAncestor = goog.dom.getAncestor;
cljs.core.async = {};
cljs.core.async.impl = {};
cljs.core.async.impl.protocols = {};
cljs.core.async.impl.protocols.ReadPort = {};
cljs.core.async.impl.protocols.take_BANG_ = function(a, b) {
  if(a ? a.cljs$core$async$impl$protocols$ReadPort$take_BANG_$arity$2 : a) {
    return a.cljs$core$async$impl$protocols$ReadPort$take_BANG_$arity$2(a, b)
  }
  var c;
  c = cljs.core.async.impl.protocols.take_BANG_[goog.typeOf(null == a ? null : a)];
  if(!c && (c = cljs.core.async.impl.protocols.take_BANG_._, !c)) {
    throw cljs.core.missing_protocol("ReadPort.take!", a);
  }
  return c.call(null, a, b)
};
cljs.core.async.impl.protocols.WritePort = {};
cljs.core.async.impl.protocols.put_BANG_ = function(a, b, c) {
  if(a ? a.cljs$core$async$impl$protocols$WritePort$put_BANG_$arity$3 : a) {
    return a.cljs$core$async$impl$protocols$WritePort$put_BANG_$arity$3(a, b, c)
  }
  var d;
  d = cljs.core.async.impl.protocols.put_BANG_[goog.typeOf(null == a ? null : a)];
  if(!d && (d = cljs.core.async.impl.protocols.put_BANG_._, !d)) {
    throw cljs.core.missing_protocol("WritePort.put!", a);
  }
  return d.call(null, a, b, c)
};
cljs.core.async.impl.protocols.Channel = {};
cljs.core.async.impl.protocols.close_BANG_ = function(a) {
  if(a ? a.cljs$core$async$impl$protocols$Channel$close_BANG_$arity$1 : a) {
    return a.cljs$core$async$impl$protocols$Channel$close_BANG_$arity$1(a)
  }
  var b;
  b = cljs.core.async.impl.protocols.close_BANG_[goog.typeOf(null == a ? null : a)];
  if(!b && (b = cljs.core.async.impl.protocols.close_BANG_._, !b)) {
    throw cljs.core.missing_protocol("Channel.close!", a);
  }
  return b.call(null, a)
};
cljs.core.async.impl.protocols.Handler = {};
cljs.core.async.impl.protocols.active_QMARK_ = function(a) {
  if(a ? a.cljs$core$async$impl$protocols$Handler$active_QMARK_$arity$1 : a) {
    return a.cljs$core$async$impl$protocols$Handler$active_QMARK_$arity$1(a)
  }
  var b;
  b = cljs.core.async.impl.protocols.active_QMARK_[goog.typeOf(null == a ? null : a)];
  if(!b && (b = cljs.core.async.impl.protocols.active_QMARK_._, !b)) {
    throw cljs.core.missing_protocol("Handler.active?", a);
  }
  return b.call(null, a)
};
cljs.core.async.impl.protocols.commit = function(a) {
  if(a ? a.cljs$core$async$impl$protocols$Handler$commit$arity$1 : a) {
    return a.cljs$core$async$impl$protocols$Handler$commit$arity$1(a)
  }
  var b;
  b = cljs.core.async.impl.protocols.commit[goog.typeOf(null == a ? null : a)];
  if(!b && (b = cljs.core.async.impl.protocols.commit._, !b)) {
    throw cljs.core.missing_protocol("Handler.commit", a);
  }
  return b.call(null, a)
};
cljs.core.async.impl.protocols.Buffer = {};
cljs.core.async.impl.protocols.full_QMARK_ = function(a) {
  if(a ? a.cljs$core$async$impl$protocols$Buffer$full_QMARK_$arity$1 : a) {
    return a.cljs$core$async$impl$protocols$Buffer$full_QMARK_$arity$1(a)
  }
  var b;
  b = cljs.core.async.impl.protocols.full_QMARK_[goog.typeOf(null == a ? null : a)];
  if(!b && (b = cljs.core.async.impl.protocols.full_QMARK_._, !b)) {
    throw cljs.core.missing_protocol("Buffer.full?", a);
  }
  return b.call(null, a)
};
cljs.core.async.impl.protocols.remove_BANG_ = function(a) {
  if(a ? a.cljs$core$async$impl$protocols$Buffer$remove_BANG_$arity$1 : a) {
    return a.cljs$core$async$impl$protocols$Buffer$remove_BANG_$arity$1(a)
  }
  var b;
  b = cljs.core.async.impl.protocols.remove_BANG_[goog.typeOf(null == a ? null : a)];
  if(!b && (b = cljs.core.async.impl.protocols.remove_BANG_._, !b)) {
    throw cljs.core.missing_protocol("Buffer.remove!", a);
  }
  return b.call(null, a)
};
cljs.core.async.impl.protocols.add_BANG_ = function(a, b) {
  if(a ? a.cljs$core$async$impl$protocols$Buffer$add_BANG_$arity$2 : a) {
    return a.cljs$core$async$impl$protocols$Buffer$add_BANG_$arity$2(a, b)
  }
  var c;
  c = cljs.core.async.impl.protocols.add_BANG_[goog.typeOf(null == a ? null : a)];
  if(!c && (c = cljs.core.async.impl.protocols.add_BANG_._, !c)) {
    throw cljs.core.missing_protocol("Buffer.add!", a);
  }
  return c.call(null, a, b)
};
cljs.core.async.impl.ioc_helpers = {};
cljs.core.async.impl.ioc_helpers.FN_IDX = 0;
cljs.core.async.impl.ioc_helpers.STATE_IDX = 1;
cljs.core.async.impl.ioc_helpers.VALUE_IDX = 2;
cljs.core.async.impl.ioc_helpers.BINDINGS_IDX = 3;
cljs.core.async.impl.ioc_helpers.USER_START_IDX = 4;
cljs.core.async.impl.ioc_helpers.aset_object = function(a, b, c) {
  return a[b][c]
};
cljs.core.async.impl.ioc_helpers.aget_object = function(a, b) {
  return a[b]
};
cljs.core.async.impl.ioc_helpers.finished_QMARK_ = function(a) {
  return"\ufdd0:finished" === a[cljs.core.async.impl.ioc_helpers.STATE_IDX]
};
cljs.core.async.impl.ioc_helpers.fn_handler = function fn_handler(b) {
  void 0 === cljs.core.async.impl.ioc_helpers.t5797 && (cljs.core.async.impl.ioc_helpers.t5797 = {}, cljs.core.async.impl.ioc_helpers.t5797 = function(b, d, e) {
    this.f = b;
    this.fn_handler = d;
    this.meta5798 = e;
    this.cljs$lang$protocol_mask$partition1$ = 0;
    this.cljs$lang$protocol_mask$partition0$ = 393216
  }, cljs.core.async.impl.ioc_helpers.t5797.cljs$lang$type = !0, cljs.core.async.impl.ioc_helpers.t5797.cljs$lang$ctorStr = "cljs.core.async.impl.ioc-helpers/t5797", cljs.core.async.impl.ioc_helpers.t5797.cljs$lang$ctorPrWriter = function(b, d, e) {
    return cljs.core._write(d, "cljs.core.async.impl.ioc-helpers/t5797")
  }, cljs.core.async.impl.ioc_helpers.t5797.prototype.cljs$core$async$impl$protocols$Handler$ = !0, cljs.core.async.impl.ioc_helpers.t5797.prototype.cljs$core$async$impl$protocols$Handler$active_QMARK_$arity$1 = function(b) {
    return!0
  }, cljs.core.async.impl.ioc_helpers.t5797.prototype.cljs$core$async$impl$protocols$Handler$commit$arity$1 = function(b) {
    return this.f
  }, cljs.core.async.impl.ioc_helpers.t5797.prototype.cljs$core$IMeta$_meta$arity$1 = function(b) {
    return this.meta5798
  }, cljs.core.async.impl.ioc_helpers.t5797.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(b, d) {
    return new cljs.core.async.impl.ioc_helpers.t5797(this.f, this.fn_handler, d)
  }, cljs.core.async.impl.ioc_helpers.__GT_t5797 = function(b, d, e) {
    return new cljs.core.async.impl.ioc_helpers.t5797(b, d, e)
  });
  return new cljs.core.async.impl.ioc_helpers.t5797(b, fn_handler, null)
};
cljs.core.async.impl.ioc_helpers.run_state_machine = function(a) {
  return cljs.core.async.impl.ioc_helpers.aget_object(a, cljs.core.async.impl.ioc_helpers.FN_IDX).call(null, a)
};
cljs.core.async.impl.ioc_helpers.take_BANG_ = function(a, b, c) {
  c = cljs.core.async.impl.protocols.take_BANG_(c, cljs.core.async.impl.ioc_helpers.fn_handler(function(c) {
    a[cljs.core.async.impl.ioc_helpers.VALUE_IDX] = c;
    a[cljs.core.async.impl.ioc_helpers.STATE_IDX] = b;
    return cljs.core.async.impl.ioc_helpers.run_state_machine(a)
  }));
  return cljs.core.truth_(c) ? (a[cljs.core.async.impl.ioc_helpers.VALUE_IDX] = cljs.core.deref(c), a[cljs.core.async.impl.ioc_helpers.STATE_IDX] = b, "\ufdd0:recur") : null
};
cljs.core.async.impl.ioc_helpers.put_BANG_ = function(a, b, c, d) {
  c = cljs.core.async.impl.protocols.put_BANG_(c, d, cljs.core.async.impl.ioc_helpers.fn_handler(function() {
    a[cljs.core.async.impl.ioc_helpers.VALUE_IDX] = null;
    a[cljs.core.async.impl.ioc_helpers.STATE_IDX] = b;
    return cljs.core.async.impl.ioc_helpers.run_state_machine(a)
  }));
  return cljs.core.truth_(c) ? (a[cljs.core.async.impl.ioc_helpers.VALUE_IDX] = cljs.core.deref(c), a[cljs.core.async.impl.ioc_helpers.STATE_IDX] = b, "\ufdd0:recur") : null
};
cljs.core.async.impl.ioc_helpers.ioc_alts_BANG_ = function() {
  var a = function(a, b, e, f) {
    f = cljs.core.seq_QMARK_(f) ? cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.hash_map, f) : f;
    a[cljs.core.async.impl.ioc_helpers.STATE_IDX] = b;
    b = cljs.core.async.do_alts(function(b) {
      a[cljs.core.async.impl.ioc_helpers.VALUE_IDX] = b;
      return cljs.core.async.impl.ioc_helpers.run_state_machine(a)
    }, e, f);
    return cljs.core.truth_(b) ? (a[cljs.core.async.impl.ioc_helpers.VALUE_IDX] = cljs.core.deref(b), "\ufdd0:recur") : null
  }, b = function(b, d, e, f) {
    var g = null;
    3 < arguments.length && (g = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
    return a.call(this, b, d, e, g)
  };
  b.cljs$lang$maxFixedArity = 3;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.next(b);
    var e = cljs.core.first(b);
    b = cljs.core.next(b);
    var f = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, e, f, b)
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b
}();
cljs.core.async.impl.ioc_helpers.return_chan = function(a, b) {
  var c = a[cljs.core.async.impl.ioc_helpers.USER_START_IDX];
  null != b && cljs.core.async.impl.protocols.put_BANG_(c, b, cljs.core.async.impl.ioc_helpers.fn_handler(function() {
    return null
  }));
  cljs.core.async.impl.protocols.close_BANG_(c);
  return c
};
cljs.core.async.impl.dispatch = {};
cljs.core.async.impl.dispatch.message_channel = null;
cljs.core.async.impl.dispatch.tasks = null;
"undefined" !== typeof MessageChannel && (cljs.core.async.impl.dispatch.message_channel = new MessageChannel, cljs.core.async.impl.dispatch.tasks = [], cljs.core.async.impl.dispatch.message_channel.port1.onmessage = function(a) {
  return cljs.core.async.impl.dispatch.tasks.shift().call(null)
});
cljs.core.async.impl.dispatch.queue_task = function(a) {
  cljs.core.async.impl.dispatch.tasks.push(a);
  return cljs.core.async.impl.dispatch.message_channel.port2.postMessage(0)
};
cljs.core.async.impl.dispatch.run = function(a) {
  return"undefined" !== typeof MessageChannel ? cljs.core.async.impl.dispatch.queue_task(a) : "undefined" !== typeof setImmediate ? setImmediate(a) : setTimeout(a, 0)
};
cljs.core.async.impl.dispatch.queue_delay = function(a, b) {
  return setTimeout(a, b)
};
cljs.core.async.impl.channels = {};
cljs.core.async.impl.channels.box = function box(b) {
  void 0 === cljs.core.async.impl.channels.t5772 && (cljs.core.async.impl.channels.t5772 = {}, cljs.core.async.impl.channels.t5772 = function(b, d, e) {
    this.val = b;
    this.box = d;
    this.meta5773 = e;
    this.cljs$lang$protocol_mask$partition1$ = 0;
    this.cljs$lang$protocol_mask$partition0$ = 425984
  }, cljs.core.async.impl.channels.t5772.cljs$lang$type = !0, cljs.core.async.impl.channels.t5772.cljs$lang$ctorStr = "cljs.core.async.impl.channels/t5772", cljs.core.async.impl.channels.t5772.cljs$lang$ctorPrWriter = function(b, d, e) {
    return cljs.core._write(d, "cljs.core.async.impl.channels/t5772")
  }, cljs.core.async.impl.channels.t5772.prototype.cljs$core$IDeref$_deref$arity$1 = function(b) {
    return this.val
  }, cljs.core.async.impl.channels.t5772.prototype.cljs$core$IMeta$_meta$arity$1 = function(b) {
    return this.meta5773
  }, cljs.core.async.impl.channels.t5772.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(b, d) {
    return new cljs.core.async.impl.channels.t5772(this.val, this.box, d)
  }, cljs.core.async.impl.channels.__GT_t5772 = function(b, d, e) {
    return new cljs.core.async.impl.channels.t5772(b, d, e)
  });
  return new cljs.core.async.impl.channels.t5772(b, box, null)
};
cljs.core.async.impl.channels.MMC = {};
cljs.core.async.impl.channels.cleanup = function(a) {
  if(a ? a.cljs$core$async$impl$channels$MMC$cleanup$arity$1 : a) {
    return a.cljs$core$async$impl$channels$MMC$cleanup$arity$1(a)
  }
  var b;
  b = cljs.core.async.impl.channels.cleanup[goog.typeOf(null == a ? null : a)];
  if(!b && (b = cljs.core.async.impl.channels.cleanup._, !b)) {
    throw cljs.core.missing_protocol("MMC.cleanup", a);
  }
  return b.call(null, a)
};
cljs.core.async.impl.channels.ManyToManyChannel = function(a, b, c, d) {
  this.takes = a;
  this.puts = b;
  this.buf = c;
  this.closed = d
};
cljs.core.async.impl.channels.ManyToManyChannel.cljs$lang$type = !0;
cljs.core.async.impl.channels.ManyToManyChannel.cljs$lang$ctorStr = "cljs.core.async.impl.channels/ManyToManyChannel";
cljs.core.async.impl.channels.ManyToManyChannel.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write(b, "cljs.core.async.impl.channels/ManyToManyChannel")
};
cljs.core.async.impl.channels.ManyToManyChannel.prototype.cljs$core$async$impl$protocols$Channel$ = !0;
cljs.core.async.impl.channels.ManyToManyChannel.prototype.cljs$core$async$impl$protocols$Channel$close_BANG_$arity$1 = function(a) {
  a.cljs$core$async$impl$channels$MMC$cleanup$arity$1(a);
  if(!cljs.core.truth_(cljs.core.deref(this.closed))) {
    cljs.core.reset_BANG_(this.closed, !0);
    a = this.takes.length;
    for(var b = 0;;) {
      if(b < a) {
        var c = this.takes[b], d = function() {
          var a = cljs.core.async.impl.protocols.active_QMARK_(c);
          return cljs.core.truth_(a) ? cljs.core.async.impl.protocols.commit(c) : a
        }();
        cljs.core.truth_(d) && cljs.core.async.impl.dispatch.run(function(a, b, c) {
          return function() {
            return c.cljs$core$IFn$_invoke$arity$1 ? c.cljs$core$IFn$_invoke$arity$1(null) : c.call(null, null)
          }
        }(b, c, d));
        b += 1
      }else {
        break
      }
    }
  }
  return null
};
cljs.core.async.impl.channels.ManyToManyChannel.prototype.cljs$core$async$impl$protocols$ReadPort$ = !0;
cljs.core.async.impl.channels.ManyToManyChannel.prototype.cljs$core$async$impl$protocols$ReadPort$take_BANG_$arity$2 = function(a, b) {
  var c = this;
  a.cljs$core$async$impl$channels$MMC$cleanup$arity$1(a);
  if(cljs.core.truth_(function() {
    var a = c.buf;
    return cljs.core.truth_(a) ? 0 < cljs.core.count(c.buf) : a
  }())) {
    var d = function() {
      var a = cljs.core.async.impl.protocols.active_QMARK_(b);
      return cljs.core.truth_(a) ? cljs.core.async.impl.protocols.commit(b) : a
    }();
    return cljs.core.truth_(d) ? cljs.core.async.impl.channels.box(cljs.core.async.impl.protocols.remove_BANG_(c.buf)) : null
  }
  var e = function() {
    for(var a = 0;;) {
      if(a < c.puts.length) {
        var d = c.puts[a], e = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(d, 0, null), d = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(d, 1, null), d = cljs.core.truth_(function() {
          var a = cljs.core.async.impl.protocols.active_QMARK_(b);
          return cljs.core.truth_(a) ? cljs.core.async.impl.protocols.active_QMARK_(e) : a
        }()) ? cljs.core.PersistentVector.fromArray([cljs.core.async.impl.protocols.commit(b), cljs.core.async.impl.protocols.commit(e), d], !0) : null;
        if(cljs.core.truth_(d)) {
          return c.puts.splice(a, 1), d
        }
        a += 1
      }else {
        return null
      }
    }
  }(), d = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(e, 0, null), f = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(e, 1, null), e = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(e, 2, null);
  if(cljs.core.truth_(cljs.core.truth_(f) ? d : f)) {
    return cljs.core.async.impl.dispatch.run(f), cljs.core.async.impl.channels.box(e)
  }
  if(cljs.core.truth_(cljs.core.deref(c.closed))) {
    return d = function() {
      var a = cljs.core.async.impl.protocols.active_QMARK_(b);
      return cljs.core.truth_(a) ? cljs.core.async.impl.protocols.commit(b) : a
    }(), cljs.core.truth_(d) ? cljs.core.async.impl.channels.box(null) : null
  }
  c.takes.unshift(b);
  return null
};
cljs.core.async.impl.channels.ManyToManyChannel.prototype.cljs$core$async$impl$protocols$WritePort$ = !0;
cljs.core.async.impl.channels.ManyToManyChannel.prototype.cljs$core$async$impl$protocols$WritePort$put_BANG_$arity$3 = function(a, b, c) {
  var d = this;
  if(null == b) {
    throw Error([cljs.core.str("Assert failed: "), cljs.core.str("Can't put nil in on a channel"), cljs.core.str("\n"), cljs.core.str(cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([cljs.core.list(new cljs.core.Symbol(null, "not", "not", -1640422260, null), cljs.core.list(new cljs.core.Symbol(null, "nil?", "nil?", -1637150201, null), new cljs.core.Symbol(null, "val", "val", -1640415014, null)))], 0)))].join(""));
  }
  a.cljs$core$async$impl$channels$MMC$cleanup$arity$1(a);
  if(cljs.core.truth_(cljs.core.deref(d.closed))) {
    return cljs.core.async.impl.channels.box(null)
  }
  a = function() {
    for(var a = 0;;) {
      if(a < d.takes.length) {
        var b = d.takes[a];
        if(cljs.core.truth_(function() {
          var a = cljs.core.async.impl.protocols.active_QMARK_(b);
          return cljs.core.truth_(a) ? cljs.core.async.impl.protocols.active_QMARK_(c) : a
        }())) {
          return d.takes.splice(a, 1), cljs.core.PersistentVector.fromArray([cljs.core.async.impl.protocols.commit(c), cljs.core.async.impl.protocols.commit(b)], !0)
        }
        a += 1
      }else {
        return null
      }
    }
  }();
  var e = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(a, 0, null), f = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(a, 1, null);
  if(cljs.core.truth_(cljs.core.truth_(e) ? f : e)) {
    return cljs.core.async.impl.dispatch.run(function() {
      return f.cljs$core$IFn$_invoke$arity$1 ? f.cljs$core$IFn$_invoke$arity$1(b) : f.call(null, b)
    }), cljs.core.async.impl.channels.box(null)
  }
  if(cljs.core.truth_(function() {
    var a = d.buf;
    return cljs.core.truth_(a) ? cljs.core.not(cljs.core.async.impl.protocols.full_QMARK_(d.buf)) : a
  }())) {
    return a = function() {
      var a = cljs.core.async.impl.protocols.active_QMARK_(c);
      return cljs.core.truth_(a) ? cljs.core.async.impl.protocols.commit(c) : a
    }(), cljs.core.truth_(a) ? (cljs.core.async.impl.protocols.add_BANG_(d.buf, b), cljs.core.async.impl.channels.box(null)) : null
  }
  d.puts.unshift(cljs.core.PersistentVector.fromArray([c, b], !0));
  return null
};
cljs.core.async.impl.channels.ManyToManyChannel.prototype.cljs$core$async$impl$channels$MMC$ = !0;
cljs.core.async.impl.channels.ManyToManyChannel.prototype.cljs$core$async$impl$channels$MMC$cleanup$arity$1 = function(a) {
  for(a = 0;;) {
    if(a < this.puts.length) {
      var b = this.puts[a], c = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(b, 0, null);
      cljs.core.nth.cljs$core$IFn$_invoke$arity$3(b, 1, null);
      cljs.core.truth_(cljs.core.async.impl.protocols.active_QMARK_(c)) ? a += 1 : this.puts.splice(a, 1)
    }else {
      break
    }
  }
  for(a = 0;;) {
    if(a < this.takes.length) {
      cljs.core.truth_(cljs.core.async.impl.protocols.active_QMARK_(this.takes[a])) ? a += 1 : this.takes.splice(a, 1)
    }else {
      return null
    }
  }
};
cljs.core.async.impl.channels.__GT_ManyToManyChannel = function(a, b, c, d) {
  return new cljs.core.async.impl.channels.ManyToManyChannel(a, b, c, d)
};
cljs.core.async.impl.channels.chan = function(a) {
  return new cljs.core.async.impl.channels.ManyToManyChannel([], [], a, cljs.core.atom.cljs$core$IFn$_invoke$arity$1(null))
};
cljs.core.async.impl.timers = {};
cljs.core.async.impl.timers.MAX_LEVEL = 15;
cljs.core.async.impl.timers.P = 0.5;
cljs.core.async.impl.timers.random_level = function() {
  var a = null, b = function() {
    return a.cljs$core$IFn$_invoke$arity$1(0)
  }, c = function(a) {
    for(;;) {
      var b;
      b = (b = Math.random() < cljs.core.async.impl.timers.P) ? a < cljs.core.async.impl.timers.MAX_LEVEL : b;
      if(b) {
        a += 1
      }else {
        return a
      }
    }
  }, a = function(a) {
    switch(arguments.length) {
      case 0:
        return b.call(this);
      case 1:
        return c.call(this, a)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$0 = b;
  a.cljs$core$IFn$_invoke$arity$1 = c;
  return a
}();
cljs.core.async.impl.timers.SkipListNode = function(a, b, c) {
  this.key = a;
  this.val = b;
  this.forward = c;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 2155872256
};
cljs.core.async.impl.timers.SkipListNode.cljs$lang$type = !0;
cljs.core.async.impl.timers.SkipListNode.cljs$lang$ctorStr = "cljs.core.async.impl.timers/SkipListNode";
cljs.core.async.impl.timers.SkipListNode.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write(b, "cljs.core.async.impl.timers/SkipListNode")
};
cljs.core.async.impl.timers.SkipListNode.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer(b, cljs.core.pr_writer, "[", " ", "]", c, a)
};
cljs.core.async.impl.timers.SkipListNode.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return cljs.core.list.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([this.key, this.val], 0))
};
cljs.core.async.impl.timers.__GT_SkipListNode = function(a, b, c) {
  return new cljs.core.async.impl.timers.SkipListNode(a, b, c)
};
cljs.core.async.impl.timers.skip_list_node = function() {
  var a = null, b = function(b) {
    return a.cljs$core$IFn$_invoke$arity$3(null, null, b)
  }, c = function(a, b, c) {
    c = Array(c + 1);
    for(var g = 0;;) {
      if(g < c.length) {
        c[g] = null, g += 1
      }else {
        break
      }
    }
    return new cljs.core.async.impl.timers.SkipListNode(a, b, c)
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 3:
        return c.call(this, a, e, f)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a
}();
cljs.core.async.impl.timers.least_greater_node = function() {
  var a = null, b = function(b, c, f) {
    return a.cljs$core$IFn$_invoke$arity$4(b, c, f, null)
  }, c = function(a, b, c, g) {
    for(;;) {
      if(0 > c) {
        return a
      }
      a: {
        for(;;) {
          var h = a.forward[c];
          if(cljs.core.truth_(h)) {
            if(h.key < b) {
              a = h
            }else {
              break a
            }
          }else {
            break a
          }
        }
        a = void 0
      }
      null != g && (g[c] = a);
      c -= 1
    }
  }, a = function(a, e, f, g) {
    switch(arguments.length) {
      case 3:
        return b.call(this, a, e, f);
      case 4:
        return c.call(this, a, e, f, g)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$3 = b;
  a.cljs$core$IFn$_invoke$arity$4 = c;
  return a
}();
cljs.core.async.impl.timers.SkipList = function(a, b) {
  this.header = a;
  this.level = b;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 2155872256
};
cljs.core.async.impl.timers.SkipList.cljs$lang$type = !0;
cljs.core.async.impl.timers.SkipList.cljs$lang$ctorStr = "cljs.core.async.impl.timers/SkipList";
cljs.core.async.impl.timers.SkipList.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write(b, "cljs.core.async.impl.timers/SkipList")
};
cljs.core.async.impl.timers.SkipList.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer(b, function(a) {
    return cljs.core.pr_sequential_writer(b, cljs.core.pr_writer, "", " ", "", c, a)
  }, "{", ", ", "}", c, a)
};
cljs.core.async.impl.timers.SkipList.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  a = function c(a) {
    return new cljs.core.LazySeq(null, !1, function() {
      return null == a ? null : cljs.core.cons(cljs.core.PersistentVector.fromArray([a.key, a.val], !0), c(a.forward[0]))
    }, null)
  };
  return a.cljs$core$IFn$_invoke$arity$1 ? a.cljs$core$IFn$_invoke$arity$1(this.header.forward[0]) : a.call(null, this.header.forward[0])
};
cljs.core.async.impl.timers.SkipList.prototype.put = function(a, b) {
  var c = Array(cljs.core.async.impl.timers.MAX_LEVEL), d = cljs.core.async.impl.timers.least_greater_node.cljs$core$IFn$_invoke$arity$4(this.header, a, this.level, c).forward[0], e;
  e = (e = null != d) ? d.key === a : e;
  if(e) {
    return d.val = b
  }
  d = cljs.core.async.impl.timers.random_level.cljs$core$IFn$_invoke$arity$0();
  if(d > this.level) {
    for(e = this.level + 1;;) {
      if(e <= d + 1) {
        c[e] = this.header, e += 1
      }else {
        break
      }
    }
    this.level = d
  }
  for(d = cljs.core.async.impl.timers.skip_list_node.cljs$core$IFn$_invoke$arity$3(a, b, Array(d));;) {
    return 0 <= this.level ? (c = c[0].forward, d.forward[0] = c[0], c[0] = d) : null
  }
};
cljs.core.async.impl.timers.SkipList.prototype.remove = function(a) {
  var b = this, c = Array(cljs.core.async.impl.timers.MAX_LEVEL), d = cljs.core.async.impl.timers.least_greater_node.cljs$core$IFn$_invoke$arity$4(b.header, a, b.level, c).forward[0];
  if(function() {
    var b = null != d;
    return b ? d.key === a : b
  }()) {
    for(var e = 0;;) {
      if(e <= b.level) {
        var f = c[e].forward;
        f[e] === d && (f[e] = d.forward[e]);
        e += 1
      }else {
        break
      }
    }
    for(;;) {
      if(function() {
        var a = 0 < b.level;
        return a ? null == b.header.forward[b.level] : a
      }()) {
        b.level -= 1
      }else {
        return null
      }
    }
  }else {
    return null
  }
};
cljs.core.async.impl.timers.SkipList.prototype.ceilingEntry = function(a) {
  for(var b = this.header, c = this.level;;) {
    if(0 > c) {
      return b === this.header ? null : b
    }
    var d;
    a: {
      for(d = b;;) {
        if(d = d.forward[c], null == d) {
          d = null;
          break a
        }else {
          if(d.key >= a) {
            break a
          }
        }
      }
      d = void 0
    }
    null != d ? (c -= 1, b = d) : c -= 1
  }
};
cljs.core.async.impl.timers.SkipList.prototype.floorEntry = function(a) {
  for(var b = this.header, c = this.level;;) {
    if(0 > c) {
      return b === this.header ? null : b
    }
    var d;
    a: {
      for(d = b;;) {
        var e = d.forward[c];
        if(null != e) {
          if(e.key > a) {
            break a
          }
          d = e
        }else {
          d = 0 === c ? d : null;
          break a
        }
      }
      d = void 0
    }
    cljs.core.truth_(d) ? (c -= 1, b = d) : c -= 1
  }
};
cljs.core.async.impl.timers.__GT_SkipList = function(a, b) {
  return new cljs.core.async.impl.timers.SkipList(a, b)
};
cljs.core.async.impl.timers.skip_list = function() {
  return new cljs.core.async.impl.timers.SkipList(cljs.core.async.impl.timers.skip_list_node.cljs$core$IFn$_invoke$arity$1(0), 0)
};
cljs.core.async.impl.timers.timeouts_map = cljs.core.async.impl.timers.skip_list();
cljs.core.async.impl.timers.TIMEOUT_RESOLUTION_MS = 10;
cljs.core.async.impl.timers.timeout = function(a) {
  var b = (new Date).valueOf() + a, c = cljs.core.async.impl.timers.timeouts_map.floorEntry(b);
  if(cljs.core.truth_(cljs.core.truth_(c) ? c.key > b - cljs.core.async.impl.timers.TIMEOUT_RESOLUTION_MS : c)) {
    return c.val
  }
  c = cljs.core.async.impl.timers.timeouts_map.ceilingEntry(b);
  if(cljs.core.truth_(cljs.core.truth_(c) ? c.key < b + cljs.core.async.impl.timers.TIMEOUT_RESOLUTION_MS : c)) {
    return c.val
  }
  var d = cljs.core.async.impl.channels.chan(null);
  cljs.core.async.impl.timers.timeouts_map.put(b, d);
  cljs.core.async.impl.dispatch.queue_delay(function() {
    cljs.core.async.impl.timers.timeouts_map.remove(b);
    return cljs.core.async.impl.protocols.close_BANG_(d)
  }, a);
  return d
};
cljs.core.async.impl.buffers = {};
cljs.core.async.impl.buffers.FixedBuffer = function(a, b) {
  this.buf = a;
  this.n = b;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 2
};
cljs.core.async.impl.buffers.FixedBuffer.cljs$lang$type = !0;
cljs.core.async.impl.buffers.FixedBuffer.cljs$lang$ctorStr = "cljs.core.async.impl.buffers/FixedBuffer";
cljs.core.async.impl.buffers.FixedBuffer.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write(b, "cljs.core.async.impl.buffers/FixedBuffer")
};
cljs.core.async.impl.buffers.FixedBuffer.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  return this.buf.length
};
cljs.core.async.impl.buffers.FixedBuffer.prototype.cljs$core$async$impl$protocols$Buffer$ = !0;
cljs.core.async.impl.buffers.FixedBuffer.prototype.cljs$core$async$impl$protocols$Buffer$full_QMARK_$arity$1 = function(a) {
  return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this.buf.length, this.n)
};
cljs.core.async.impl.buffers.FixedBuffer.prototype.cljs$core$async$impl$protocols$Buffer$remove_BANG_$arity$1 = function(a) {
  return this.buf.pop()
};
cljs.core.async.impl.buffers.FixedBuffer.prototype.cljs$core$async$impl$protocols$Buffer$add_BANG_$arity$2 = function(a, b) {
  if(!cljs.core.not(a.cljs$core$async$impl$protocols$Buffer$full_QMARK_$arity$1(a))) {
    throw Error([cljs.core.str("Assert failed: "), cljs.core.str("Can't add to a full buffer"), cljs.core.str("\n"), cljs.core.str(cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([cljs.core.list(new cljs.core.Symbol(null, "not", "not", -1640422260, null), cljs.core.list(new cljs.core.Symbol("impl", "full?", "impl/full?", -1337857039, null), new cljs.core.Symbol(null, "this", "this", -1636972457, null)))], 0)))].join(""));
  }
  return this.buf.unshift(b)
};
cljs.core.async.impl.buffers.__GT_FixedBuffer = function(a, b) {
  return new cljs.core.async.impl.buffers.FixedBuffer(a, b)
};
cljs.core.async.impl.buffers.fixed_buffer = function(a) {
  return new cljs.core.async.impl.buffers.FixedBuffer([], a)
};
cljs.core.async.impl.buffers.DroppingBuffer = function(a, b) {
  this.buf = a;
  this.n = b;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 2
};
cljs.core.async.impl.buffers.DroppingBuffer.cljs$lang$type = !0;
cljs.core.async.impl.buffers.DroppingBuffer.cljs$lang$ctorStr = "cljs.core.async.impl.buffers/DroppingBuffer";
cljs.core.async.impl.buffers.DroppingBuffer.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write(b, "cljs.core.async.impl.buffers/DroppingBuffer")
};
cljs.core.async.impl.buffers.DroppingBuffer.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  return this.buf.length
};
cljs.core.async.impl.buffers.DroppingBuffer.prototype.cljs$core$async$impl$protocols$Buffer$ = !0;
cljs.core.async.impl.buffers.DroppingBuffer.prototype.cljs$core$async$impl$protocols$Buffer$full_QMARK_$arity$1 = function(a) {
  return!1
};
cljs.core.async.impl.buffers.DroppingBuffer.prototype.cljs$core$async$impl$protocols$Buffer$remove_BANG_$arity$1 = function(a) {
  return this.buf.pop()
};
cljs.core.async.impl.buffers.DroppingBuffer.prototype.cljs$core$async$impl$protocols$Buffer$add_BANG_$arity$2 = function(a, b) {
  return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this.buf.length, this.n) ? null : this.buf.unshift(b)
};
cljs.core.async.impl.buffers.__GT_DroppingBuffer = function(a, b) {
  return new cljs.core.async.impl.buffers.DroppingBuffer(a, b)
};
cljs.core.async.impl.buffers.dropping_buffer = function(a) {
  return new cljs.core.async.impl.buffers.DroppingBuffer([], a)
};
cljs.core.async.impl.buffers.SlidingBuffer = function(a, b) {
  this.buf = a;
  this.n = b;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 2
};
cljs.core.async.impl.buffers.SlidingBuffer.cljs$lang$type = !0;
cljs.core.async.impl.buffers.SlidingBuffer.cljs$lang$ctorStr = "cljs.core.async.impl.buffers/SlidingBuffer";
cljs.core.async.impl.buffers.SlidingBuffer.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write(b, "cljs.core.async.impl.buffers/SlidingBuffer")
};
cljs.core.async.impl.buffers.SlidingBuffer.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  return this.buf.length
};
cljs.core.async.impl.buffers.SlidingBuffer.prototype.cljs$core$async$impl$protocols$Buffer$ = !0;
cljs.core.async.impl.buffers.SlidingBuffer.prototype.cljs$core$async$impl$protocols$Buffer$full_QMARK_$arity$1 = function(a) {
  return!1
};
cljs.core.async.impl.buffers.SlidingBuffer.prototype.cljs$core$async$impl$protocols$Buffer$remove_BANG_$arity$1 = function(a) {
  return this.buf.pop()
};
cljs.core.async.impl.buffers.SlidingBuffer.prototype.cljs$core$async$impl$protocols$Buffer$add_BANG_$arity$2 = function(a, b) {
  cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this.buf.length, this.n) && a.cljs$core$async$impl$protocols$Buffer$remove_BANG_$arity$1(a);
  return this.buf.unshift(b)
};
cljs.core.async.impl.buffers.__GT_SlidingBuffer = function(a, b) {
  return new cljs.core.async.impl.buffers.SlidingBuffer(a, b)
};
cljs.core.async.impl.buffers.sliding_buffer = function(a) {
  return new cljs.core.async.impl.buffers.SlidingBuffer([], a)
};
cljs.core.async.fn_handler = function fn_handler$$0(b) {
  void 0 === cljs.core.async.t5719 && (cljs.core.async.t5719 = {}, cljs.core.async.t5719 = function(b, d, e) {
    this.f = b;
    this.fn_handler = d;
    this.meta5720 = e;
    this.cljs$lang$protocol_mask$partition1$ = 0;
    this.cljs$lang$protocol_mask$partition0$ = 393216
  }, cljs.core.async.t5719.cljs$lang$type = !0, cljs.core.async.t5719.cljs$lang$ctorStr = "cljs.core.async/t5719", cljs.core.async.t5719.cljs$lang$ctorPrWriter = function(b, d, e) {
    return cljs.core._write(d, "cljs.core.async/t5719")
  }, cljs.core.async.t5719.prototype.cljs$core$async$impl$protocols$Handler$ = !0, cljs.core.async.t5719.prototype.cljs$core$async$impl$protocols$Handler$active_QMARK_$arity$1 = function(b) {
    return!0
  }, cljs.core.async.t5719.prototype.cljs$core$async$impl$protocols$Handler$commit$arity$1 = function(b) {
    return this.f
  }, cljs.core.async.t5719.prototype.cljs$core$IMeta$_meta$arity$1 = function(b) {
    return this.meta5720
  }, cljs.core.async.t5719.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(b, d) {
    return new cljs.core.async.t5719(this.f, this.fn_handler, d)
  }, cljs.core.async.__GT_t5719 = function(b, d, e) {
    return new cljs.core.async.t5719(b, d, e)
  });
  return new cljs.core.async.t5719(b, fn_handler$$0, null)
};
cljs.core.async.buffer = function(a) {
  return cljs.core.async.impl.buffers.fixed_buffer(a)
};
cljs.core.async.dropping_buffer = function(a) {
  return cljs.core.async.impl.buffers.dropping_buffer(a)
};
cljs.core.async.sliding_buffer = function(a) {
  return cljs.core.async.impl.buffers.sliding_buffer(a)
};
cljs.core.async.chan = function() {
  var a = null, b = function() {
    return a.cljs$core$IFn$_invoke$arity$1(null)
  }, c = function(a) {
    return cljs.core.async.impl.channels.chan("number" === typeof a ? cljs.core.async.buffer(a) : a)
  }, a = function(a) {
    switch(arguments.length) {
      case 0:
        return b.call(this);
      case 1:
        return c.call(this, a)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$0 = b;
  a.cljs$core$IFn$_invoke$arity$1 = c;
  return a
}();
cljs.core.async.timeout = function(a) {
  return cljs.core.async.impl.timers.timeout(a)
};
cljs.core.async._LT__BANG_ = function(a) {
  throw Error([cljs.core.str("Assert failed: "), cljs.core.str("\x3c! used not in (go ...) block"), cljs.core.str("\n"), cljs.core.str(cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([null], 0)))].join(""));
};
cljs.core.async.take_BANG_ = function() {
  var a = null, b = function(b, c) {
    return a.cljs$core$IFn$_invoke$arity$3(b, c, !0)
  }, c = function(a, b, c) {
    a = cljs.core.async.impl.protocols.take_BANG_(a, cljs.core.async.fn_handler(b));
    if(cljs.core.truth_(a)) {
      var g = cljs.core.deref(a);
      cljs.core.truth_(c) ? b.cljs$core$IFn$_invoke$arity$1 ? b.cljs$core$IFn$_invoke$arity$1(g) : b.call(null, g) : cljs.core.async.impl.dispatch.run(function() {
        return b.cljs$core$IFn$_invoke$arity$1 ? b.cljs$core$IFn$_invoke$arity$1(g) : b.call(null, g)
      })
    }
    return null
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a
}();
cljs.core.async.nop = function() {
  return null
};
cljs.core.async._GT__BANG_ = function(a, b) {
  throw Error([cljs.core.str("Assert failed: "), cljs.core.str("\x3e! used not in (go ...) block"), cljs.core.str("\n"), cljs.core.str(cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([null], 0)))].join(""));
};
cljs.core.async.put_BANG_ = function() {
  var a = null, b = function(b, c) {
    return a.cljs$core$IFn$_invoke$arity$3(b, c, cljs.core.async.nop)
  }, c = function(b, c, d) {
    return a.cljs$core$IFn$_invoke$arity$4(b, c, d, !0)
  }, d = function(a, b, c, d) {
    a = cljs.core.async.impl.protocols.put_BANG_(a, b, cljs.core.async.fn_handler(c));
    cljs.core.truth_(cljs.core.truth_(a) ? cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(c, cljs.core.async.nop) : a) && (cljs.core.truth_(d) ? c.cljs$core$IFn$_invoke$arity$0 ? c.cljs$core$IFn$_invoke$arity$0() : c.call(null) : cljs.core.async.impl.dispatch.run(c));
    return null
  }, a = function(a, f, g, h) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, f);
      case 3:
        return c.call(this, a, f, g);
      case 4:
        return d.call(this, a, f, g, h)
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  a.cljs$core$IFn$_invoke$arity$4 = d;
  return a
}();
cljs.core.async.close_BANG_ = function(a) {
  return cljs.core.async.impl.protocols.close_BANG_(a)
};
cljs.core.async.random_array = function(a) {
  for(var b = Array(a), c = 0;;) {
    if(c < a) {
      b[c] = 0, c += 1
    }else {
      break
    }
  }
  for(c = 1;;) {
    if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(c, a)) {
      return b
    }
    var d = cljs.core.rand_int(c);
    b[c] = b[d];
    b[d] = c;
    c += 1
  }
};
cljs.core.async.alt_flag = function alt_flag() {
  var b = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(!0);
  void 0 === cljs.core.async.t5730 && (cljs.core.async.t5730 = {}, cljs.core.async.t5730 = function(b, d, e) {
    this.flag = b;
    this.alt_flag = d;
    this.meta5731 = e;
    this.cljs$lang$protocol_mask$partition1$ = 0;
    this.cljs$lang$protocol_mask$partition0$ = 393216
  }, cljs.core.async.t5730.cljs$lang$type = !0, cljs.core.async.t5730.cljs$lang$ctorStr = "cljs.core.async/t5730", cljs.core.async.t5730.cljs$lang$ctorPrWriter = function(b, d, e) {
    return cljs.core._write(d, "cljs.core.async/t5730")
  }, cljs.core.async.t5730.prototype.cljs$core$async$impl$protocols$Handler$ = !0, cljs.core.async.t5730.prototype.cljs$core$async$impl$protocols$Handler$active_QMARK_$arity$1 = function(b) {
    return cljs.core.deref(this.flag)
  }, cljs.core.async.t5730.prototype.cljs$core$async$impl$protocols$Handler$commit$arity$1 = function(b) {
    cljs.core.reset_BANG_(this.flag, null);
    return!0
  }, cljs.core.async.t5730.prototype.cljs$core$IMeta$_meta$arity$1 = function(b) {
    return this.meta5731
  }, cljs.core.async.t5730.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(b, d) {
    return new cljs.core.async.t5730(this.flag, this.alt_flag, d)
  }, cljs.core.async.__GT_t5730 = function(b, d, e) {
    return new cljs.core.async.t5730(b, d, e)
  });
  return new cljs.core.async.t5730(b, alt_flag, null)
};
cljs.core.async.alt_handler = function alt_handler(b, c) {
  void 0 === cljs.core.async.t5736 && (cljs.core.async.t5736 = {}, cljs.core.async.t5736 = function(b, c, f, g) {
    this.cb = b;
    this.flag = c;
    this.alt_handler = f;
    this.meta5737 = g;
    this.cljs$lang$protocol_mask$partition1$ = 0;
    this.cljs$lang$protocol_mask$partition0$ = 393216
  }, cljs.core.async.t5736.cljs$lang$type = !0, cljs.core.async.t5736.cljs$lang$ctorStr = "cljs.core.async/t5736", cljs.core.async.t5736.cljs$lang$ctorPrWriter = function(b, c, f) {
    return cljs.core._write(c, "cljs.core.async/t5736")
  }, cljs.core.async.t5736.prototype.cljs$core$async$impl$protocols$Handler$ = !0, cljs.core.async.t5736.prototype.cljs$core$async$impl$protocols$Handler$active_QMARK_$arity$1 = function(b) {
    return cljs.core.async.impl.protocols.active_QMARK_(this.flag)
  }, cljs.core.async.t5736.prototype.cljs$core$async$impl$protocols$Handler$commit$arity$1 = function(b) {
    cljs.core.async.impl.protocols.commit(this.flag);
    return this.cb
  }, cljs.core.async.t5736.prototype.cljs$core$IMeta$_meta$arity$1 = function(b) {
    return this.meta5737
  }, cljs.core.async.t5736.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(b, c) {
    return new cljs.core.async.t5736(this.cb, this.flag, this.alt_handler, c)
  }, cljs.core.async.__GT_t5736 = function(b, c, f, g) {
    return new cljs.core.async.t5736(b, c, f, g)
  });
  return new cljs.core.async.t5736(c, b, alt_handler, null)
};
cljs.core.async.do_alts = function(a, b, c) {
  var d = cljs.core.async.alt_flag(), e = cljs.core.count(b), f = cljs.core.async.random_array(e), g = (new cljs.core.Keyword("\ufdd0:priority")).call(null, c), h = function() {
    for(var c = 0;;) {
      if(c < e) {
        var h = cljs.core.truth_(g) ? c : f[c], m = cljs.core.nth.cljs$core$IFn$_invoke$arity$2(b, h), n = cljs.core.vector_QMARK_(m) ? m.cljs$core$IFn$_invoke$arity$1 ? m.cljs$core$IFn$_invoke$arity$1(0) : m.call(null, 0) : null, p = cljs.core.truth_(n) ? function() {
          var b = m.cljs$core$IFn$_invoke$arity$1 ? m.cljs$core$IFn$_invoke$arity$1(1) : m.call(null, 1);
          return cljs.core.async.impl.protocols.put_BANG_(n, b, cljs.core.async.alt_handler(d, function(b, c, d, e, f, g, h, k, l) {
            return function() {
              return a.cljs$core$IFn$_invoke$arity$1 ? a.cljs$core$IFn$_invoke$arity$1(cljs.core.PersistentVector.fromArray([null, f], !0)) : a.call(null, cljs.core.PersistentVector.fromArray([null, f], !0))
            }
          }(c, b, h, m, n, d, e, f, g)))
        }() : cljs.core.async.impl.protocols.take_BANG_(m, cljs.core.async.alt_handler(d, function(b, c, d, e, f, g, h, k) {
          return function(b) {
            return a.cljs$core$IFn$_invoke$arity$1 ? a.cljs$core$IFn$_invoke$arity$1(cljs.core.PersistentVector.fromArray([b, d], !0)) : a.call(null, cljs.core.PersistentVector.fromArray([b, d], !0))
          }
        }(c, h, m, n, d, e, f, g)));
        if(cljs.core.truth_(p)) {
          return cljs.core.async.impl.channels.box(cljs.core.PersistentVector.fromArray([cljs.core.deref(p), function() {
            var a = n;
            return cljs.core.truth_(a) ? a : m
          }()], !0))
        }
        c += 1
      }else {
        return null
      }
    }
  }();
  return cljs.core.truth_(h) ? h : cljs.core.contains_QMARK_(c, "\ufdd0:default") ? (h = function() {
    var a = cljs.core.async.impl.protocols.active_QMARK_(d);
    return cljs.core.truth_(a) ? cljs.core.async.impl.protocols.commit(d) : a
  }(), cljs.core.truth_(h) ? cljs.core.async.impl.channels.box(cljs.core.PersistentVector.fromArray([(new cljs.core.Keyword("\ufdd0:default")).call(null, c), "\ufdd0:default"], !0)) : null) : null
};
cljs.core.async.alts_BANG_ = function() {
  var a = function(a, b) {
    cljs.core.seq_QMARK_(b) && cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.hash_map, b);
    throw Error([cljs.core.str("Assert failed: "), cljs.core.str("alts! used not in (go ...) block"), cljs.core.str("\n"), cljs.core.str(cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([null], 0)))].join(""));
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e)
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b)
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b
}();
var view_bench = {core:{}};
view_bench.core.by_id = function(a) {
  return document.getElementById(a)
};
view_bench.core.set_html_BANG_ = function(a, b) {
  return a.innerHTML = b
};
view_bench.core.set_class_BANG_ = function(a, b) {
  return a.className = b
};
view_bench.core.events = function(a, b) {
  var c = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$0();
  a.addEventListener(b, function(a) {
    return cljs.core.async.put_BANG_.cljs$core$IFn$_invoke$arity$2(c, a)
  });
  return c
};
view_bench.core.now = function() {
  return new Date
};
view_bench.core.width = 100;
view_bench.core.height = 100;
view_bench.core.gen_ui = function() {
  for(var a = [], b = 0;;) {
    if(b < view_bench.core.height) {
      a.push("\x3ctr\x3e");
      for(var c = 0;;) {
        if(c < view_bench.core.width) {
          a.push("" + cljs.core.str("\x3ctd id\x3d'cell-"), c + b * view_bench.core.width, "'\x3e0\x3c/td\x3e"), c += 1
        }else {
          break
        }
      }
      a.push("\x3c/tr\x3e");
      b += 1
    }else {
      break
    }
  }
  return view_bench.core.set_html_BANG_(view_bench.core.by_id("big-table"), a.join(""))
};
view_bench.core.gen_ui();
view_bench.core.group = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(0);
view_bench.core.render_BANG_ = function(a) {
  var b = [cljs.core.str("group"), cljs.core.str(cljs.core.deref(view_bench.core.group))].join("");
  a = cljs.core.seq(a);
  for(var c = null, d = 0, e = 0;;) {
    if(e < d) {
      var f = c.cljs$core$IIndexed$_nth$arity$2(c, e), g = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(f, 0, null), f = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(f, 1, null), g = view_bench.core.by_id([cljs.core.str("cell-"), cljs.core.str(g)].join(""));
      view_bench.core.set_html_BANG_(g, f);
      view_bench.core.set_class_BANG_(g, b);
      e += 1
    }else {
      if(a = cljs.core.seq(a)) {
        cljs.core.chunked_seq_QMARK_(a) ? (d = cljs.core.chunk_first(a), a = cljs.core.chunk_rest(a), c = d, d = cljs.core.count(d)) : (d = cljs.core.first(a), c = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(d, 0, null), d = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(d, 1, null), c = view_bench.core.by_id([cljs.core.str("cell-"), cljs.core.str(c)].join("")), view_bench.core.set_html_BANG_(c, d), view_bench.core.set_class_BANG_(c, b), a = cljs.core.next(a), c = null, d = 0), e = 0
      }else {
        break
      }
    }
  }
  return cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$2(view_bench.core.group, function(a) {
    return cljs.core.mod(a + 1, 5)
  })
};
view_bench.core.render_loop = function(a) {
  var b = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1(1), c = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1(1);
  cljs.core.async.impl.dispatch.run(function() {
    var d = function() {
      return function(a) {
        return function() {
          var b = null, c = function() {
            var a = Array(10);
            a[0] = b;
            a[1] = 1;
            return a
          }, d = function(b) {
            for(;;) {
              var c = a(b);
              if("\ufdd0:recur" !== c) {
                return c
              }
            }
          }, b = function(a) {
            switch(arguments.length) {
              case 0:
                return c.call(this);
              case 1:
                return d.call(this, a)
            }
            throw Error("Invalid arity: " + arguments.length);
          };
          b.cljs$core$IFn$_invoke$arity$0 = c;
          b.cljs$core$IFn$_invoke$arity$1 = d;
          return b
        }()
      }(function(c) {
        var d = c[1];
        if(1 === d) {
          var d = cljs.core.async.timeout(a), e = cljs.core.vector(), k;
          c[5] = e;
          c[6] = d;
          c[2] = null;
          c[1] = 2;
          return"\ufdd0:recur"
        }
        if(2 === d) {
          return d = c[6], d = cljs.core.vector.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([d, b], 0)), cljs.core.async.impl.ioc_helpers.ioc_alts_BANG_(c, 4, d)
        }
        if(3 === d) {
          return d = c[2], cljs.core.async.impl.ioc_helpers.return_chan(c, d)
        }
        if(4 === d) {
          return d = c[7], d = c[6], k = c[2], e = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(k, 0, null), k = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(k, 1, null), d = cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(d, k), c[7] = k, c[8] = e, c[1] = d ? 5 : 6, "\ufdd0:recur"
        }
        if(5 === d) {
          return k = c[5], d = view_bench.core.render_BANG_(k), e = cljs.core.async.timeout(a), k = cljs.core.vector(), c[9] = d, c[5] = k, c[6] = e, c[2] = null, c[1] = 2, "\ufdd0:recur"
        }
        if(6 === d) {
          return d = c[7], d = cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(b, d), c[1] = d ? 8 : 9, "\ufdd0:recur"
        }
        if(7 === d) {
          return d = c[2], c[2] = d, c[1] = 3, "\ufdd0:recur"
        }
        if(8 === d) {
          return e = c[8], k = c[5], d = c[6], e = cljs.core.conj.cljs$core$IFn$_invoke$arity$2(k, e), c[5] = e, c[6] = d, c[2] = null, c[1] = 2, "\ufdd0:recur"
        }
        if(9 === d) {
          throw d = c[7], c = [cljs.core.str("No matching clause: "), cljs.core.str(d)].join(""), Error(c);
        }
        return 10 === d ? (d = c[2], c[2] = d, c[1] = 7, "\ufdd0:recur") : null
      })
    }(), e = function() {
      var a = d.cljs$core$IFn$_invoke$arity$0 ? d.cljs$core$IFn$_invoke$arity$0() : d.call(null);
      a[cljs.core.async.impl.ioc_helpers.USER_START_IDX] = c;
      return a
    }();
    return cljs.core.async.impl.ioc_helpers.run_state_machine(e)
  });
  return b
};
var render_5378 = view_bench.core.render_loop(40), c__4518__auto___5379 = cljs.core.async.chan.cljs$core$IFn$_invoke$arity$1(1);
cljs.core.async.impl.dispatch.run(function() {
  var a = function() {
    return function(a) {
      return function() {
        var b = null, e = function() {
          var a = Array(9);
          a[0] = b;
          a[1] = 1;
          return a
        }, f = function(b) {
          for(;;) {
            var d = a(b);
            if("\ufdd0:recur" !== d) {
              return d
            }
          }
        }, b = function(a) {
          switch(arguments.length) {
            case 0:
              return e.call(this);
            case 1:
              return f.call(this, a)
          }
          throw Error("Invalid arity: " + arguments.length);
        };
        b.cljs$core$IFn$_invoke$arity$0 = e;
        b.cljs$core$IFn$_invoke$arity$1 = f;
        return b
      }()
    }(function(a) {
      var b = a[1];
      if(1 === b) {
        return a[2] = null, a[1] = 2, "\ufdd0:recur"
      }
      if(2 === b) {
        return a[1] = 4, "\ufdd0:recur"
      }
      if(3 === b) {
        return b = a[2], cljs.core.async.impl.ioc_helpers.return_chan(a, b)
      }
      if(4 === b) {
        return a[5] = 0, a[2] = null, a[1] = 7, "\ufdd0:recur"
      }
      if(5 === b) {
        return a[2] = null, a[1] = 6, "\ufdd0:recur"
      }
      if(6 === b) {
        return b = a[2], a[2] = b, a[1] = 3, "\ufdd0:recur"
      }
      if(7 === b) {
        return b = a[5], b = 0 === cljs.core.mod(b, 1E3), cljs.core.truth_(b) ? a[1] = 9 : a[1] = 10, "\ufdd0:recur"
      }
      if(8 === b) {
        return a[6] = a[2], a[2] = null, a[1] = 2, "\ufdd0:recur"
      }
      if(9 === b) {
        return b = cljs.core.async.timeout(0), cljs.core.async.impl.ioc_helpers.take_BANG_(a, 12, b)
      }
      if(10 === b) {
        return a[2] = null, a[1] = 11, "\ufdd0:recur"
      }
      if(11 === b) {
        return b = a[5], b = b < 10 * view_bench.core.width * view_bench.core.height, a[7] = a[2], cljs.core.truth_(b) ? a[1] = 13 : a[1] = 14, "\ufdd0:recur"
      }
      if(12 === b) {
        return b = a[2], a[2] = b, a[1] = 11, "\ufdd0:recur"
      }
      if(13 === b) {
        var b = cljs.core.rand_int(1E4), e = cljs.core.rand_int(10), b = cljs.core.vector.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([b, e], 0));
        return cljs.core.async.impl.ioc_helpers.put_BANG_(a, 16, render_5378, b)
      }
      return 14 === b ? (a[2] = null, a[1] = 15, "\ufdd0:recur") : 15 === b ? (b = a[2], a[2] = b, a[1] = 8, "\ufdd0:recur") : 16 === b ? (b = a[5], a[8] = a[2], a[5] = b + 1, a[2] = null, a[1] = 7, "\ufdd0:recur") : null
    })
  }(), b = function() {
    var b = a.cljs$core$IFn$_invoke$arity$0 ? a.cljs$core$IFn$_invoke$arity$0() : a.call(null);
    b[cljs.core.async.impl.ioc_helpers.USER_START_IDX] = c__4518__auto___5379;
    return b
  }();
  return cljs.core.async.impl.ioc_helpers.run_state_machine(b)
});
