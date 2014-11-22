﻿(function () { var t, e; (function () { var n = {}, i = {}; t = function (t, e, i) { n[t] = { deps: e, callback: i } }; e = function (t) { if (i[t]) { return i[t] } i[t] = {}; var r = n[t], o = r.deps, s = r.callback, f = [], c; for (var u = 0, a = o.length; u < a; u++) { if (o[u] === "exports") { f.push(c = {}) } else { f.push(e(o[u])) } } var l = s.apply(this, f); return i[t] = c || l } })(); t("rsvp/async", ["exports"], function (t) { "use strict"; var e = typeof window !== "undefined" ? window : {}; var n = e.MutationObserver || e.WebKitMutationObserver; var i; if (typeof process !== "undefined" && {}.toString.call(process) === "[object process]") { i = function (t, e) { process.nextTick(function () { t.call(e) }) } } else if (n) { var r = []; var o = new n(function () { var t = r.slice(); r = []; t.forEach(function (t) { var e = t[0], n = t[1]; e.call(n) }) }); var s = document.createElement("div"); o.observe(s, { attributes: true }); window.addEventListener("unload", function () { o.disconnect(); o = null }); i = function (t, e) { r.push([t, e]); s.setAttribute("drainQueue", "drainQueue") } } else { i = function (t, e) { setTimeout(function () { t.call(e) }, 1) } } t.async = i }); t("rsvp/events", ["exports"], function (t) { "use strict"; var e = function (t, e) { this.type = t; for (var n in e) { if (!e.hasOwnProperty(n)) { continue } this[n] = e[n] } }; var n = function (t, e) { for (var n = 0, i = t.length; n < i; n++) { if (t[n][0] === e) { return n } } return -1 }; var i = function (t) { var e = t._promiseCallbacks; if (!e) { e = t._promiseCallbacks = {} } return e }; var r = { mixin: function (t) { t.on = this.on; t.off = this.off; t.trigger = this.trigger; return t }, on: function (t, e, r) { var o = i(this), s, f; t = t.split(/\s+/); r = r || this; while (f = t.shift()) { s = o[f]; if (!s) { s = o[f] = [] } if (n(s, e) === -1) { s.push([e, r]) } } }, off: function (t, e) { var r = i(this), o, s, f; t = t.split(/\s+/); while (s = t.shift()) { if (!e) { r[s] = []; continue } o = r[s]; f = n(o, e); if (f !== -1) { o.splice(f, 1) } } }, trigger: function (t, n) { var r = i(this), o, s, f, c, u; if (o = r[t]) { for (var a = 0; a < o.length; a++) { s = o[a]; f = s[0]; c = s[1]; if (typeof n !== "object") { n = { detail: n } } u = new e(t, n); f.call(c, u) } } } }; t.EventTarget = r }); t("rsvp", ["rsvp/async", "rsvp/events", "exports"], function (t, e, n) { "use strict"; var i = t.async; var r = e.EventTarget; var o = {}; o.async = i; var s = function () { }; var f = function (t) { var e = this; if (typeof t !== "function") { throw new TypeError("You must pass a resolver function as the sole argument to the promise constructor") } if (!(e instanceof f)) { return new f(t) } var n = function (t) { u(e, t); n = s; i = s }; var i = function (t) { l(e, t); n = s; i = s }; this.on("promise:resolved", function (t) { this.trigger("success", { detail: t.detail }) }, this); this.on("promise:failed", function (t) { this.trigger("error", { detail: t.detail }) }, this); t(n, i) }; var c = function (t, e, n, i) { var r = typeof n === "function", o, s, f, c; if (r) { try { o = n(i.detail); f = true } catch (a) { c = true; s = a } } else { o = i.detail; f = true } if (o && typeof o.then === "function") { o.then(function (t) { u(e, t) }, function (t) { l(e, t) }) } else if (r && f) { u(e, o) } else if (c) { l(e, s) } else if (t === "resolve") { u(e, o) } else if (t === "reject") { l(e, o) } }; f.prototype = { constructor: f, then: function (t, e) { var n = new f(function () { }); if (this.isFulfilled) { o.async(function () { c("resolve", n, t, { detail: this.fulfillmentValue }) }, this) } if (this.isRejected) { o.async(function () { c("reject", n, e, { detail: this.rejectedReason }) }, this) } this.on("promise:resolved", function (e) { c("resolve", n, t, e) }); this.on("promise:failed", function (t) { c("reject", n, e, t) }); return n } }; function u(t, e) { if (e && typeof e.then === "function") { e.then(function (e) { u(t, e) }, function (e) { l(t, e) }) } else { a(t, e) } } function a(t, e) { o.async(function () { t.trigger("promise:resolved", { detail: e }); t.isFulfilled = true; t.fulfillmentValue = e }) } function l(t, e) { o.async(function () { t.trigger("promise:failed", { detail: e }); t.isRejected = true; t.rejectedReason = e }) } function v(t) { var e, n = []; var i = new f(function () { }); var r = t.length; if (r === 0) { u(i, []) } var o = function (t) { return function (e) { s(t, e) } }; var s = function (t, e) { n[t] = e; if (--r === 0) { u(i, n) } }; var c = function (t) { l(i, t) }; for (e = 0; e < t.length; e++) { if (t[e] && typeof t[e].then === "function") { t[e].then(o(e), c) } else { s(e, t[e]) } } return i } r.mixin(f.prototype); function p(t, e) { o[t] = e } function h() { var t = {}; var e = new f(function (e, n) { t.resolve = e; t.reject = n }); t.promise = e; return t } function d(t) { return function (e, n) { if (e) { l(t, e) } else if (arguments.length > 2) { u(t, Array.prototype.slice.call(arguments, 1)) } else { u(t, n) } } } function y(t) { return function () { var e = Array.prototype.slice.call(arguments); var n = new f(function () { }); v(e).then(function (e) { e.push(d(n)); try { t.apply(this, e) } catch (i) { l(n, i) } }); return n } } n.Promise = f; n.all = v; n.defer = h; n.denodeify = y; n.configure = p }); window.RSVP = e("rsvp") })();