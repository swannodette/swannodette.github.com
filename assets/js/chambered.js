var d = null;
function l(a) {
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
}
Math.floor(2147483648 * Math.random()).toString(36);
function n(a, b) {
  var c = Array.prototype.slice.call(arguments), e = c.shift();
  if("undefined" == typeof e) {
    throw Error("[goog.string.format] Template required");
  }
  return e.replace(/%([0\-\ \+]*)(\d+)?(\.(\d+))?([%sfdiu])/g, function(a, b, e, C, V, D, y, W) {
    if("%" == D) {
      return"%"
    }
    var h = c.shift();
    if("undefined" == typeof h) {
      throw Error("[goog.string.format] Not enough arguments");
    }
    arguments[0] = h;
    return n.c[D].apply(d, arguments)
  })
}
n.c = {};
n.c.s = function(a, b, c) {
  return isNaN(c) || "" == c || a.length >= c ? a : a = -1 < b.indexOf("-", 0) ? a + Array(c - a.length + 1).join(" ") : Array(c - a.length + 1).join(" ") + a
};
n.c.f = function(a, b, c, e, k) {
  e = a.toString();
  isNaN(k) || "" == k || (e = a.toFixed(k));
  var r;
  r = 0 > a ? "-" : 0 <= b.indexOf("+") ? "+" : 0 <= b.indexOf(" ") ? " " : "";
  0 <= a && (e = r + e);
  if(isNaN(c) || e.length >= c) {
    return e
  }
  e = isNaN(k) ? Math.abs(a).toString() : Math.abs(a).toFixed(k);
  a = c - e.length - r.length;
  return e = 0 <= b.indexOf("-", 0) ? r + e + Array(a + 1).join(" ") : r + Array(a + 1).join(0 <= b.indexOf("0", 0) ? "0" : " ") + e
};
n.c.d = function(a, b, c, e, k, r, U, C) {
  return n.c.f(parseInt(a, 10), b, c, e, 0, r, U, C)
};
n.c.i = n.c.d;
n.c.u = n.c.d;
function aa(a) {
  return a
}
var p = ["cljs", "core", "set_print_fn_BANG_"], q = this;
!(p[0] in q) && q.execScript && q.execScript("var " + p[0]);
for(var t;p.length && (t = p.shift());) {
  var ba;
  if(ba = !p.length) {
    ba = void 0 !== aa
  }
  ba ? q[t] = aa : q = q[t] ? q[t] : q[t] = {}
}
function ca(a) {
  var b = "string" == typeof a;
  return b ? "\ufdd0" !== a.charAt(0) : b
}
function da(a) {
  var b = ea;
  return b[l(a == d ? d : a)] ? !0 : b._ ? !0 : !1
}
function fa(a, b) {
  var c = b == d ? d : b.constructor, c = (c != d && !1 !== c ? c.m : c) != d && !1 !== (c != d && !1 !== c ? c.m : c) ? c.n : l(b);
  return Error(["No protocol method ", a, " defined for type ", c, ": ", b].join(""))
}
var ea = {}, w, x = d;
function ga(a, b) {
  if(a ? a.h : a) {
    return a.h(a, b)
  }
  var c;
  c = w[l(a == d ? d : a)];
  if(!c && (c = w._, !c)) {
    throw fa("ILookup.-lookup", a);
  }
  return c.call(d, a, b)
}
function ha(a, b, c) {
  if(a ? a.j : a) {
    return a.j(a, b, c)
  }
  var e;
  e = w[l(a == d ? d : a)];
  if(!e && (e = w._, !e)) {
    throw fa("ILookup.-lookup", a);
  }
  return e.call(d, a, b, c)
}
x = function(a, b, c) {
  switch(arguments.length) {
    case 2:
      return ga.call(this, a, b);
    case 3:
      return ha.call(this, a, b, c)
  }
  throw Error("Invalid arity: " + arguments.length);
};
x.g = ga;
x.e = ha;
w = x;
var z, E = d;
function ia(a, b) {
  var c;
  if(a == d) {
    c = d
  }else {
    if(c = a) {
      c = (c = a.l & 256) ? c : a.k
    }
    c = c ? a.h(a, b) : a instanceof Array ? b < a.length ? a[b] : d : ca(a) ? b < a.length ? a[b] : d : da(a) ? w.g(a, b) : d
  }
  return c
}
function ja(a, b, c) {
  if(a != d) {
    var e;
    if(e = a) {
      e = (e = a.l & 256) ? e : a.k
    }
    a = e ? a.j(a, b, c) : a instanceof Array ? b < a.length ? a[b] : c : ca(a) ? b < a.length ? a[b] : c : da(a) ? w.e(a, b, c) : c
  }else {
    a = c
  }
  return a
}
E = function(a, b, c) {
  switch(arguments.length) {
    case 2:
      return ia.call(this, a, b);
    case 3:
      return ja.call(this, a, b, c)
  }
  throw Error("Invalid arity: " + arguments.length);
};
E.g = ia;
E.e = ja;
z = E;
var ka, H = d;
function la() {
  return Math.random.b ? Math.random.b() : Math.random.call(d)
}
function ma(a) {
  return a * H.b()
}
H = function(a) {
  switch(arguments.length) {
    case 0:
      return la.call(this);
    case 1:
      return ma.call(this, a)
  }
  throw Error("Invalid arity: " + arguments.length);
};
H.b = la;
H.a = ma;
ka = H;
function I(a) {
  a = ka.a(a);
  return 0 <= a ? Math.floor.a ? Math.floor.a(a) : Math.floor.call(d, a) : Math.ceil.a ? Math.ceil.a(a) : Math.ceil.call(d, a)
}
var na = d, na = function(a, b, c) {
  switch(arguments.length) {
    case 2:
      return z.g(b, this.toString());
    case 3:
      return z.e(b, this.toString(), c)
  }
  throw Error("Invalid arity: " + arguments.length);
};
String.prototype.call = na;
String.prototype.apply = function(a, b) {
  return a.call.apply(a, [a].concat(b.slice()))
};
String.prototype.apply = function(a, b) {
  return 2 > b.length ? z.g(b[0], a) : z.e(b[0], a, b[1])
};
var J = d;
function oa() {
  return J.a(1)
}
function pa(a) {
  return(Math.random.b ? Math.random.b() : Math.random.call(d)) * a
}
J = function(a) {
  switch(arguments.length) {
    case 0:
      return oa.call(this);
    case 1:
      return pa.call(this, a)
  }
  throw Error("Invalid arity: " + arguments.length);
};
J.b = oa;
J.a = pa;
ka = J;
I = function(a) {
  return Math.floor.a ? Math.floor.a((Math.random.b ? Math.random.b() : Math.random.call(d)) * a) : Math.floor.call(d, (Math.random.b ? Math.random.b() : Math.random.call(d)) * a)
};
function qa(a, b, c) {
  return(b = a > b) ? a < c : b
}
function ra() {
  var a = K;
  return 3 * a * a + 81 * a >> 2 & 3
}
var L, M = d;
function sa(a, b) {
  return M.e(a, b, 0)
}
function ta(a, b, c) {
  return(a >> c & 255) * b / 255 << c
}
M = function(a, b, c) {
  switch(arguments.length) {
    case 2:
      return sa.call(this, a, b);
    case 3:
      return ta.call(this, a, b, c)
  }
  throw Error("Invalid arity: " + arguments.length);
};
M.g = sa;
M.e = ta;
L = M;
for(var ua = 2 * Math.PI, va = Math.PI / 2, wa = document.getElementById("game").getContext("2d"), xa = Array(262144), N = 0;;) {
  if(64 > N) {
    for(var O = 0;;) {
      if(64 > O) {
        for(var P = 0;;) {
          if(64 > P) {
            var ya = P << 12 | O << 6 | N, za = 0.4 * (O - 32.5), Aa = 0.4 * (P - 32.5);
            xa[ya] = I(16);
            Math.random() > Math.sqrt(Math.sqrt(za * za + Aa * Aa)) - 0.8 && (xa[ya] = 0);
            P += 1
          }else {
            break
          }
        }
        O += 1
      }else {
        break
      }
    }
    N += 1
  }else {
    break
  }
}
for(var Ba = Array(12288), Q = Array(1), R = Array(1), T = Array(1), X = 1;;) {
  if(16 > X) {
    R[0] = 255 - (96 * Math.random() | 0);
    for(var Y = 0;;) {
      if(48 > Y) {
        for(var K = 0;;) {
          if(16 > K) {
            Q[0] = 9858122;
            4 === X && (Q[0] = 8355711);
            var Ca = 4 !== X;
            (Ca ? Ca : 0 === (3 * Math.random() | 0)) && (R[0] = 255 - (96 * Math.random() | 0));
            1 === X && (Y < ra() + 18 ? Q[0] = 6990400 : Y < ra() + 19 && (R[0] = 2 * R[0] / 3));
            if(7 === X) {
              Q[0] = 6771249;
              var Da;
              var Ea = qa(K, 0, 15);
              if(Ea) {
                var Fa = qa(Y, 0, 15);
                Da = Fa ? Fa : qa(Y, 32, 47)
              }else {
                Da = Ea
              }
              if(Da) {
                Q[0] = 12359778;
                var Z = [K - 7], $ = [(Y & 15) - 7];
                0 > Z[0] && (Z[0] = 1 - Z[0]);
                0 > $[0] && ($[0] = 1 - $[0]);
                $[0] > Z[0] && (Z[0] = $[0]);
                R[0] = 196 - I(32) - 32 * (Z[0] % 3)
              }else {
                0 === I(2) && (R[0] = R[0] * (150 - 100 * (K & 1)) / 100)
              }
            }
            if(5 === X) {
              Q[0] = 11876885;
              var Ga = 0 === (K + 4 * (Y >> 2)) % 8;
              (Ga ? Ga : 0 === Y % 4) && (Q[0] = 12365733)
            }
            9 === X && (Q[0] = 4210943);
            T[0] = R[0];
            32 <= Y && (T[0] /= 2);
            8 === X && (Q[0] = 5298487, 0 === I(2) ? Q[0] = 0 : T[0] = 255);
            var Ha = Q[0], La = T[0];
            Ba[K + 16 * Y + 768 * X] = L.e(Ha, La, 16) | L.e(Ha, La, 8) | L.g(Ha, La);
            K += 1
          }else {
            break
          }
        }
        Y += 1
      }else {
        break
      }
    }
    X += 1
  }else {
    break
  }
}
function Ma(a) {
  for(var b = a.createImageData(424, 240), c = Date.now() % 1E4 / 1E4, e = 0.4 * Math.sin(c * ua) + va, k = 0.4 * Math.cos(c * ua), r = Math.cos(k), k = Math.sin(k), U = Math.cos(e), e = Math.sin(e), c = 32.5 + 64 * c, C = Array(1), V = Array(1), D = Array(1), y = Array(1), W = Array(1), h = 0;;) {
    if(101760 > h) {
      b.data[4 * h + 3] = 255, h += 1
    }else {
      break
    }
  }
  for(h = 0;;) {
    if(424 > h) {
      for(var Ia = (h - 212) / 240, S = 0;;) {
        if(240 > S) {
          var u = (S - 120) / 240, v = 1 * r + u * k, u = u * r - 1 * k, F = Ia * U + v * e, v = v * U - Ia * e;
          C[0] = 0;
          V[0] = 255;
          D[0] = 0;
          W[0] = 32;
          for(var f = 0;;) {
            if(3 > f) {
              var i = 0 === f ? F : 1 === f ? u : 2 === f ? v : d, A = 1 / (0 > i ? -i : i), G = F * A, B = u * A, Ja = v * A, m = 0 === f ? c - (c | 0) : 1 === f ? 0.5 : 2 === f ? 0.5 : d, m = 0 < i ? 1 - m : m, s = c + G * m, j = 0 === f, s = (j ? 0 > i : j) ? s - 1 : s, j = 32.5 + B * m, g = 1 === f, j = (g ? 0 > i : g) ? j - 1 : j, g = 32.5 + Ja * m, Ka = 2 === f, g = (Ka ? 0 > i : Ka) ? g - 1 : g;
              y[0] = A * m;
              i = s;
              m = j;
              for(s = g;;) {
                if(y[0] < W[0]) {
                  j = xa[(s & 63) << 12 | (m & 63) << 6 | i & 63], 0 < j && (1 === f ? (g = 16 * s & 15, g = 0 > B ? g + 32 : g) : g = (16 * m & 15) + 16, j = Ba[(1 === f ? 16 * i & 15 : 16 * (i + s) & 15) + 16 * g + 768 * j], g = (f + 2) % 3, 0 < j && (C[0] = j, D[0] = 255 - (255 * (y[0] / 32) | 0), V[0] = 255 * (255 - 50 * g) / 255, W[0] = y[0])), y[0] += A, m += B, s += Ja, i += G
                }else {
                  break
                }
              }
              f += 1
            }else {
              break
            }
          }
          u = V[0];
          F = D[0];
          v = C[0];
          f = (v >> 8 & 255) * u * F / 65025;
          A = (v & 255) * u * F / 65025;
          G = b.data;
          B = 4 * (h + 424 * S);
          G[B + 0] = (v >> 16 & 255) * u * F / 65025;
          G[B + 1] = f;
          G[B + 2] = A;
          S += 1
        }else {
          break
        }
      }
      h += 1
    }else {
      break
    }
  }
  return a.putImageData(b, 0, 0)
}
setInterval(function() {
  return Ma.a ? Ma.a(wa) : Ma.call(d, wa)
}, 10);
