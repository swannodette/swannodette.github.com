var d = null;
function k(a) {
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
function m(a, b) {
  var c = Array.prototype.slice.call(arguments), e = c.shift();
  if("undefined" == typeof e) {
    throw Error("[goog.string.format] Template required");
  }
  return e.replace(/%([0\-\ \+]*)(\d+)?(\.(\d+))?([%sfdiu])/g, function(a, b, e, C, y, D, E, $) {
    if("%" == D) {
      return"%"
    }
    var v = c.shift();
    if("undefined" == typeof v) {
      throw Error("[goog.string.format] Not enough arguments");
    }
    arguments[0] = v;
    return m.c[D].apply(d, arguments)
  })
}
m.c = {};
m.c.s = function(a, b, c) {
  return isNaN(c) || "" == c || a.length >= c ? a : a = -1 < b.indexOf("-", 0) ? a + Array(c - a.length + 1).join(" ") : Array(c - a.length + 1).join(" ") + a
};
m.c.f = function(a, b, c, e, r) {
  e = a.toString();
  isNaN(r) || "" == r || (e = a.toFixed(r));
  var l;
  l = 0 > a ? "-" : 0 <= b.indexOf("+") ? "+" : 0 <= b.indexOf(" ") ? " " : "";
  0 <= a && (e = l + e);
  if(isNaN(c) || e.length >= c) {
    return e
  }
  e = isNaN(r) ? Math.abs(a).toString() : Math.abs(a).toFixed(r);
  a = c - e.length - l.length;
  return e = 0 <= b.indexOf("-", 0) ? l + e + Array(a + 1).join(" ") : l + Array(a + 1).join(0 <= b.indexOf("0", 0) ? "0" : " ") + e
};
m.c.d = function(a, b, c, e, r, l, I, C) {
  return m.c.f(parseInt(a, 10), b, c, e, 0, l, I, C)
};
m.c.i = m.c.d;
m.c.u = m.c.d;
function aa(a) {
  return a
}
var n = ["cljs", "core", "set_print_fn_BANG_"], p = this;
!(n[0] in p) && p.execScript && p.execScript("var " + n[0]);
for(var s;n.length && (s = n.shift());) {
  var ba;
  if(ba = !n.length) {
    ba = void 0 !== aa
  }
  ba ? p[s] = aa : p = p[s] ? p[s] : p[s] = {}
}
function ca(a) {
  var b = "string" == typeof a;
  return b ? "\ufdd0" !== a.charAt(0) : b
}
function da(a) {
  var b = ea;
  return b[k(a == d ? d : a)] ? !0 : b._ ? !0 : !1
}
function fa(a, b) {
  var c = b == d ? d : b.constructor, c = (c != d && !1 !== c ? c.m : c) != d && !1 !== (c != d && !1 !== c ? c.m : c) ? c.n : k(b);
  return Error(["No protocol method ", a, " defined for type ", c, ": ", b].join(""))
}
var ea = {}, w, x = d;
function ga(a, b) {
  if(a ? a.h : a) {
    return a.h(a, b)
  }
  var c;
  c = w[k(a == d ? d : a)];
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
  e = w[k(a == d ? d : a)];
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
var z, H = d;
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
H = function(a, b, c) {
  switch(arguments.length) {
    case 2:
      return ia.call(this, a, b);
    case 3:
      return ja.call(this, a, b, c)
  }
  throw Error("Invalid arity: " + arguments.length);
};
H.g = ia;
H.e = ja;
z = H;
var ka, J = d;
function la() {
  return Math.random.a ? Math.random.a() : Math.random.call(d)
}
function ma(a) {
  return a * J.a()
}
J = function(a) {
  switch(arguments.length) {
    case 0:
      return la.call(this);
    case 1:
      return ma.call(this, a)
  }
  throw Error("Invalid arity: " + arguments.length);
};
J.a = la;
J.b = ma;
ka = J;
function K(a) {
  a = ka.b(a);
  return 0 <= a ? Math.floor.b ? Math.floor.b(a) : Math.floor.call(d, a) : Math.ceil.b ? Math.ceil.b(a) : Math.ceil.call(d, a)
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
var L = d;
function oa() {
  return L.b(1)
}
function pa(a) {
  return(Math.random.a ? Math.random.a() : Math.random.call(d)) * a
}
L = function(a) {
  switch(arguments.length) {
    case 0:
      return oa.call(this);
    case 1:
      return pa.call(this, a)
  }
  throw Error("Invalid arity: " + arguments.length);
};
L.a = oa;
L.b = pa;
ka = L;
K = function(a) {
  return Math.floor.b ? Math.floor.b((Math.random.a ? Math.random.a() : Math.random.call(d)) * a) : Math.floor.call(d, (Math.random.a ? Math.random.a() : Math.random.call(d)) * a)
};
var qa = 2 * Math.PI, ra = Math.PI / 2, sa = document.getElementById("game").getContext("2d"), ta = sa.createImageData(424, 240), ua = Array(262144), va = Array(12288);
function wa(a, b, c) {
  return(b = a > b) ? a < c : b
}
function xa() {
  var a = M;
  return 3 * a * a + 81 * a >> 2 & 3
}
var N, O = d;
function ya(a, b) {
  return O.e(a, b, 0)
}
function za(a, b, c) {
  return(a >> c & 255) * b / 255 << c
}
O = function(a, b, c) {
  switch(arguments.length) {
    case 2:
      return ya.call(this, a, b);
    case 3:
      return za.call(this, a, b, c)
  }
  throw Error("Invalid arity: " + arguments.length);
};
O.g = ya;
O.e = za;
N = O;
function Aa() {
  for(var a = Date.now() % 1E4 / 1E4, b = 0.4 * Math.sin(a * qa) + ra, c = 0.4 * Math.cos(a * qa), e = Math.cos(c), c = Math.sin(c), r = Math.cos(b), b = Math.sin(b), a = 32.5 + 64 * a, l = Array(1), I = Array(1), C = Array(1), y = Array(1), D = Array(1), E = 0;;) {
    if(424 > E) {
      for(var $ = (E - 212) / 240, v = 0;;) {
        if(240 > v) {
          var t = (v - 120) / 240, u = 1 * e + t * c, t = t * e - 1 * c, F = $ * r + u * b, u = u * r - $ * b;
          l[0] = 0;
          I[0] = 255;
          C[0] = 0;
          D[0] = 32;
          for(var f = 0;;) {
            if(3 > f) {
              var h = 0 === f ? F : 1 === f ? t : 2 === f ? u : d, A = 1 / (0 > h ? -h : h), G = F * A, B = t * A, Ca = u * A, j = 0 === f ? a - (a | 0) : 1 === f ? 0.5 : 2 === f ? 0.5 : d, j = 0 < h ? 1 - j : j, q = a + G * j, i = 0 === f, q = (i ? 0 > h : i) ? q - 1 : q, i = 32.5 + B * j, g = 1 === f, i = (g ? 0 > h : g) ? i - 1 : i, g = 32.5 + Ca * j, Da = 2 === f, g = (Da ? 0 > h : Da) ? g - 1 : g;
              y[0] = A * j;
              h = q;
              j = i;
              for(q = g;;) {
                if(y[0] < D[0]) {
                  i = ua[(q & 63) << 12 | (j & 63) << 6 | h & 63], 0 < i && (1 === f ? (g = 16 * q & 15, g = 0 > B ? g + 32 : g) : g = (16 * j & 15) + 16, i = va[(1 === f ? 16 * h & 15 : 16 * (h + q) & 15) + 16 * g + 768 * i], g = (f + 2) % 3, 0 < i && (l[0] = i, C[0] = 255 - (255 * (y[0] / 32) | 0), I[0] = 255 * (255 - 50 * g) / 255, D[0] = y[0])), y[0] += A, j += B, q += Ca, h += G
                }else {
                  break
                }
              }
              f += 1
            }else {
              break
            }
          }
          t = I[0];
          F = C[0];
          u = l[0];
          f = (u >> 8 & 255) * t * F / 65025;
          A = (u & 255) * t * F / 65025;
          G = ta.data;
          B = 4 * (E + 424 * v);
          G[B + 0] = (u >> 16 & 255) * t * F / 65025;
          G[B + 1] = f;
          G[B + 2] = A;
          v += 1
        }else {
          break
        }
      }
      E += 1
    }else {
      return d
    }
  }
}
for(var P = Array(1), Q = Array(1), R = Array(1), S = 1;;) {
  if(16 > S) {
    Q[0] = 255 - (96 * Math.random() | 0);
    for(var T = 0;;) {
      if(48 > T) {
        for(var M = 0;;) {
          if(16 > M) {
            P[0] = 9858122;
            4 === S && (P[0] = 8355711);
            var Ba = 4 !== S;
            (Ba ? Ba : 0 === (3 * Math.random() | 0)) && (Q[0] = 255 - (96 * Math.random() | 0));
            1 === S && (T < xa() + 18 ? P[0] = 6990400 : T < xa() + 19 && (Q[0] = 2 * Q[0] / 3));
            if(7 === S) {
              P[0] = 6771249;
              var Ea;
              var Fa = wa(M, 0, 15);
              if(Fa) {
                var Ga = wa(T, 0, 15);
                Ea = Ga ? Ga : wa(T, 32, 47)
              }else {
                Ea = Fa
              }
              if(Ea) {
                P[0] = 12359778;
                var U = [M - 7], V = [(T & 15) - 7];
                0 > U[0] && (U[0] = 1 - U[0]);
                0 > V[0] && (V[0] = 1 - V[0]);
                V[0] > U[0] && (U[0] = V[0]);
                Q[0] = 196 - K(32) - 32 * (U[0] % 3)
              }else {
                0 === K(2) && (Q[0] = Q[0] * (150 - 100 * (M & 1)) / 100)
              }
            }
            if(5 === S) {
              P[0] = 11876885;
              var Ha = 0 === (M + 4 * (T >> 2)) % 8;
              (Ha ? Ha : 0 === T % 4) && (P[0] = 12365733)
            }
            9 === S && (P[0] = 4210943);
            R[0] = Q[0];
            32 <= T && (R[0] /= 2);
            8 === S && (P[0] = 5298487, 0 === K(2) ? P[0] = 0 : R[0] = 255);
            var Ia = P[0], Ja = R[0];
            va[M + 16 * T + 768 * S] = N.e(Ia, Ja, 16) | N.e(Ia, Ja, 8) | N.g(Ia, Ja);
            M += 1
          }else {
            break
          }
        }
        T += 1
      }else {
        break
      }
    }
    S += 1
  }else {
    break
  }
}
for(var W = 0;;) {
  if(64 > W) {
    for(var X = 0;;) {
      if(64 > X) {
        for(var Y = 0;;) {
          if(64 > Y) {
            var Ka = Y << 12 | X << 6 | W, La = 0.4 * (X - 32.5), Ma = 0.4 * (Y - 32.5);
            ua[Ka] = K(16);
            Math.random() > Math.sqrt(Math.sqrt(La * La + Ma * Ma)) - 0.8 && (ua[Ka] = 0);
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
    W += 1
  }else {
    break
  }
}
for(var Z = 0;;) {
  if(101760 > Z) {
    ta.data[4 * Z + 3] = 255, Z += 1
  }else {
    break
  }
}
setInterval(function() {
  Aa.a ? Aa.a() : Aa.call(d);
  return sa.putImageData(ta, 0, 0)
}, 10);
