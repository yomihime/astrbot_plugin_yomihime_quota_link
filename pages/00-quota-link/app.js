//#region node_modules/@vue/shared/dist/shared.esm-bundler.js
// @__NO_SIDE_EFFECTS__
function e(e) {
	let t = /* @__PURE__ */ Object.create(null);
	for (let n of e.split(",")) t[n] = 1;
	return (e) => e in t;
}
var t = {}, n = [], r = () => {}, i = () => !1, a = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && (e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97), o = (e) => e.startsWith("onUpdate:"), s = Object.assign, c = (e, t) => {
	let n = e.indexOf(t);
	n > -1 && e.splice(n, 1);
}, l = Object.prototype.hasOwnProperty, u = (e, t) => l.call(e, t), d = Array.isArray, f = (e) => x(e) === "[object Map]", p = (e) => x(e) === "[object Set]", m = (e) => x(e) === "[object Date]", h = (e) => typeof e == "function", g = (e) => typeof e == "string", _ = (e) => typeof e == "symbol", v = (e) => typeof e == "object" && !!e, y = (e) => (v(e) || h(e)) && h(e.then) && h(e.catch), b = Object.prototype.toString, x = (e) => b.call(e), S = (e) => x(e).slice(8, -1), C = (e) => x(e) === "[object Object]", w = (e) => g(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, T = /* @__PURE__ */ e(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"), E = (e) => {
	let t = /* @__PURE__ */ Object.create(null);
	return ((n) => t[n] || (t[n] = e(n)));
}, D = /-\w/g, O = E((e) => e.replace(D, (e) => e.slice(1).toUpperCase())), ee = /\B([A-Z])/g, te = E((e) => e.replace(ee, "-$1").toLowerCase()), ne = E((e) => e.charAt(0).toUpperCase() + e.slice(1)), re = E((e) => e ? `on${ne(e)}` : ""), ie = (e, t) => !Object.is(e, t), ae = (e, ...t) => {
	for (let n = 0; n < e.length; n++) e[n](...t);
}, oe = (e, t, n, r = !1) => {
	Object.defineProperty(e, t, {
		configurable: !0,
		enumerable: !1,
		writable: r,
		value: n
	});
}, se = (e) => {
	let t = parseFloat(e);
	return isNaN(t) ? e : t;
}, ce = (e) => {
	let t = g(e) ? Number(e) : NaN;
	return isNaN(t) ? e : t;
}, le, ue = () => le ||= typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {};
function k(e) {
	if (d(e)) {
		let t = {};
		for (let n = 0; n < e.length; n++) {
			let r = e[n], i = g(r) ? me(r) : k(r);
			if (i) for (let e in i) t[e] = i[e];
		}
		return t;
	}
	if (g(e) || v(e)) return e;
}
var de = /;(?![^(]*\))/g, fe = /:([^]+)/, pe = /"(?:[^"\\]|\\[^])*"|'(?:[^'\\]|\\[^])*'|\\[^]|\/\*[^]*?\*\//g;
function me(e) {
	let t = {};
	return e.replace(pe, (e) => e.startsWith("/*") ? "" : e).split(de).forEach((e) => {
		if (e) {
			let n = e.split(fe);
			n.length > 1 && (t[n[0].trim()] = n[1].trim());
		}
	}), t;
}
function he(e) {
	let t = "";
	if (g(e)) t = e;
	else if (d(e)) for (let n = 0; n < e.length; n++) {
		let r = he(e[n]);
		r && (t += r + " ");
	}
	else if (v(e)) for (let n in e) e[n] && (t += n + " ");
	return t.trim();
}
var ge = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly", _e = /* @__PURE__ */ e(ge);
ge + "";
function ve(e) {
	return !!e || e === "";
}
function ye(e, t, n) {
	if (e.length !== t.length) return !1;
	let r = !0;
	for (let i = 0; r && i < e.length; i++) r = Ce(e[i], t[i], n);
	return r;
}
function be(e, t, n) {
	if (e.size !== t.size) return !1;
	let r = Array.from(t), i = new Uint8Array(r.length);
	for (let t of e) {
		let e = -1;
		for (let a = 0; a < r.length; a++) if (!i[a] && Ce(t, r[a], n)) {
			e = a;
			break;
		}
		if (e < 0) return !1;
		i[e] = 1;
	}
	return !0;
}
function xe(e, t, n) {
	let r = f(e), i = f(t);
	if (r || i || (r = p(e), i = p(t), r || i)) return r && i ? be(e, t, n) : !1;
	if (Object.keys(e).length !== Object.keys(t).length) return !1;
	for (let r in e) {
		let i = e.hasOwnProperty(r), a = t.hasOwnProperty(r);
		if (i && !a || !i && a || !Ce(e[r], t[r], n)) return !1;
	}
	return String(e) === String(t);
}
function Se(e, t, n, r) {
	n ||= [/* @__PURE__ */ new Map(), /* @__PURE__ */ new Map()];
	let [i, a] = n;
	if (i.has(e) || a.has(t)) return i.get(e) === t && a.get(t) === e;
	i.set(e, t), a.set(t, e);
	let o = r(e, t, n);
	return i.delete(e), a.delete(t), o;
}
function Ce(e, t, n) {
	if (e === t) return !0;
	let r = m(e), i = m(t);
	return r || i ? r && i ? e.getTime() === t.getTime() : !1 : (r = _(e), i = _(t), r || i ? e === t : (r = d(e), i = d(t), r || i ? r && i ? Se(e, t, n, ye) : !1 : (r = v(e), i = v(t), r || i ? !r || !i ? !1 : Se(e, t, n, xe) : String(e) === String(t))));
}
//#endregion
//#region node_modules/@vue/reactivity/dist/reactivity.esm-bundler.js
var A, we = class {
	constructor(e = !1) {
		this.detached = e, this._active = !0, this._on = 0, this.effects = [], this.cleanups = [], this._isPaused = !1, this._warnOnRun = !0, this.__v_skip = !0, !e && A && (A.active ? (this.parent = A, this.index = (A.scopes || (A.scopes = [])).push(this) - 1) : (this._active = !1, this._warnOnRun = !1));
	}
	get active() {
		return this._active;
	}
	pause() {
		if (this._active) {
			this._isPaused = !0;
			let e, t;
			if (this.scopes) {
				let n = this.scopes.slice();
				for (e = 0, t = n.length; e < t; e++) n[e].pause();
			}
			for (e = 0, t = this.effects.length; e < t; e++) this.effects[e].pause();
		}
	}
	resume() {
		if (this._active && this._isPaused) {
			this._isPaused = !1;
			let e, t;
			if (this.scopes) {
				let n = this.scopes.slice();
				for (e = 0, t = n.length; e < t; e++) n[e].resume();
			}
			let n = this.effects.slice();
			for (e = 0, t = n.length; e < t; e++) n[e].resume();
		}
	}
	run(e) {
		if (this._active) {
			let t = A;
			try {
				return A = this, e();
			} finally {
				A = t;
			}
		}
	}
	on() {
		++this._on === 1 && (this.prevScope = A, A = this);
	}
	off() {
		if (this._on > 0 && --this._on === 0) {
			if (A === this) A = this.prevScope;
			else {
				let e = A;
				for (; e;) {
					if (e.prevScope === this) {
						e.prevScope = this.prevScope;
						break;
					}
					e = e.prevScope;
				}
			}
			this.prevScope = void 0;
		}
	}
	stop(e) {
		if (this._active) {
			this._active = !1;
			let t, n;
			for (t = 0, n = this.effects.length; t < n; t++) this.effects[t].stop();
			for (this.effects.length = 0, t = 0, n = this.cleanups.length; t < n; t++) this.cleanups[t]();
			if (this.cleanups.length = 0, this.scopes) {
				let e = this.scopes.slice();
				for (t = 0, n = e.length; t < n; t++) e[t].stop(!0);
				this.scopes.length = 0;
			}
			if (!this.detached && this.parent && !e) {
				let e = this.parent.scopes.pop();
				e && e !== this && (this.parent.scopes[this.index] = e, e.index = this.index);
			}
			this.parent = void 0;
		}
	}
};
function Te() {
	return A;
}
var j, Ee = /* @__PURE__ */ new WeakSet(), De = class {
	constructor(e) {
		this.fn = e, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, A && (A.active ? A.effects.push(this) : this.flags &= -2);
	}
	pause() {
		this.flags |= 64;
	}
	resume() {
		this.flags & 64 && (this.flags &= -65, Ee.has(this) && (Ee.delete(this), this.trigger()));
	}
	notify() {
		this.flags & 2 && !(this.flags & 32) || this.flags & 8 || je(this);
	}
	run() {
		if (!(this.flags & 1)) return this.fn();
		this.flags |= 2, We(this), Pe(this);
		let e = j, t = Be;
		j = this, Be = !0;
		try {
			return this.fn();
		} finally {
			Fe(this), j = e, Be = t, this.flags &= -3;
		}
	}
	stop() {
		if (this.flags & 1) {
			for (let e = this.deps; e; e = e.nextDep) Re(e);
			this.deps = this.depsTail = void 0, We(this), this.onStop && this.onStop(), this.flags &= -2;
		}
	}
	trigger() {
		this.flags & 64 ? Ee.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
	}
	runIfDirty() {
		Ie(this) && this.run();
	}
	get dirty() {
		return Ie(this);
	}
}, Oe = 0, ke, Ae;
function je(e, t = !1) {
	if (e.flags |= 8, t) {
		e.next = Ae, Ae = e;
		return;
	}
	e.next = ke, ke = e;
}
function Me() {
	Oe++;
}
function Ne() {
	if (--Oe > 0) return;
	if (Ae) {
		let e = Ae;
		for (Ae = void 0; e;) {
			let t = e.next;
			e.next = void 0, e.flags &= -9, e = t;
		}
	}
	let e;
	for (; ke;) {
		let t = ke;
		for (ke = void 0; t;) {
			let n = t.next;
			if (t.next = void 0, t.flags &= -9, t.flags & 1) try {
				t.trigger();
			} catch (t) {
				e ||= t;
			}
			t = n;
		}
	}
	if (e) throw e;
}
function Pe(e) {
	for (let t = e.deps; t; t = t.nextDep) t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function Fe(e) {
	let t, n = e.depsTail, r = n;
	for (; r;) {
		let e = r.prevDep;
		r.version === -1 ? (r === n && (n = e), Re(r), ze(r)) : t = r, r.dep.activeLink = r.prevActiveLink, r.prevActiveLink = void 0, r = e;
	}
	e.deps = t, e.depsTail = n;
}
function Ie(e) {
	for (let t = e.deps; t; t = t.nextDep) if (t.dep.version !== t.version || t.dep.computed && (Le(t.dep.computed) || t.dep.version !== t.version)) return !0;
	return !!e._dirty;
}
function Le(e) {
	if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === Ge) || (e.globalVersion = Ge, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !Ie(e)))) return;
	e.flags |= 2;
	let t = e.dep, n = j, r = Be;
	j = e, Be = !0;
	try {
		Pe(e);
		let n = e.fn(e._value);
		(t.version === 0 || ie(n, e._value)) && (e.flags |= 128, e._value = n, t.version++);
	} catch (e) {
		throw t.version++, e;
	} finally {
		j = n, Be = r, Fe(e), e.flags &= -3;
	}
}
function Re(e, t = !1) {
	let { dep: n, prevSub: r, nextSub: i } = e;
	if (r && (r.nextSub = i, e.prevSub = void 0), i && (i.prevSub = r, e.nextSub = void 0), n.subs === e && (n.subs = r, !r && n.computed)) {
		n.computed.flags &= -5;
		for (let e = n.computed.deps; e; e = e.nextDep) Re(e, !0);
	}
	!t && !--n.sc && n.map && n.map.delete(n.key);
}
function ze(e) {
	let { prevDep: t, nextDep: n } = e;
	t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
var Be = !0, Ve = [];
function He() {
	Ve.push(Be), Be = !1;
}
function Ue() {
	let e = Ve.pop();
	Be = e === void 0 || e;
}
function We(e) {
	let { cleanup: t } = e;
	if (e.cleanup = void 0, t) {
		let e = j;
		j = void 0;
		try {
			t();
		} finally {
			j = e;
		}
	}
}
var Ge = 0, Ke = class {
	constructor(e, t) {
		this.sub = e, this.dep = t, this.version = t.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
	}
}, qe = class {
	constructor(e) {
		this.computed = e, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0;
	}
	track(e) {
		if (!j || !Be || j === this.computed) return;
		let t = this.activeLink;
		if (t === void 0 || t.sub !== j) t = this.activeLink = new Ke(j, this), j.deps ? (t.prevDep = j.depsTail, j.depsTail.nextDep = t, j.depsTail = t) : j.deps = j.depsTail = t, Je(t);
		else if (t.version === -1 && (t.version = this.version, t.nextDep)) {
			let e = t.nextDep;
			e.prevDep = t.prevDep, t.prevDep && (t.prevDep.nextDep = e), t.prevDep = j.depsTail, t.nextDep = void 0, j.depsTail.nextDep = t, j.depsTail = t, j.deps === t && (j.deps = e);
		}
		return t;
	}
	trigger(e) {
		this.version++, Ge++, this.notify(e);
	}
	notify(e) {
		Me();
		try {
			for (let e = this.subs; e; e = e.prevSub) e.sub.notify() && e.sub.dep.notify();
		} finally {
			Ne();
		}
	}
};
function Je(e) {
	if (e.dep.sc++, e.sub.flags & 4) {
		let t = e.dep.computed;
		if (t && !e.dep.subs) {
			t.flags |= 20;
			for (let e = t.deps; e; e = e.nextDep) Je(e);
		}
		let n = e.dep.subs;
		n !== e && (e.prevSub = n, n && (n.nextSub = e)), e.dep.subs = e;
	}
}
var Ye = /* @__PURE__ */ new WeakMap(), Xe = /* @__PURE__ */ Symbol(""), Ze = /* @__PURE__ */ Symbol(""), Qe = /* @__PURE__ */ Symbol("");
function $e(e, t, n) {
	if (Be && j) {
		let t = Ye.get(e);
		t || Ye.set(e, t = /* @__PURE__ */ new Map());
		let r = t.get(n);
		r || (t.set(n, r = new qe()), r.map = t, r.key = n), r.track();
	}
}
function et(e, t, n, r, i, a) {
	let o = Ye.get(e);
	if (!o) {
		Ge++;
		return;
	}
	let s = (e) => {
		e && e.trigger();
	};
	if (Me(), t === "clear") o.forEach(s);
	else {
		let i = d(e), a = i && w(n);
		if (i && n === "length") {
			let e = Number(r);
			o.forEach((t, n) => {
				(n === "length" || n === Qe || !_(n) && n >= e) && s(t);
			});
		} else switch ((n !== void 0 || o.has(void 0)) && s(o.get(n)), a && s(o.get(Qe)), t) {
			case "add":
				i ? a && s(o.get("length")) : (s(o.get(Xe)), f(e) && s(o.get(Ze)));
				break;
			case "delete":
				i || (s(o.get(Xe)), f(e) && s(o.get(Ze)));
				break;
			case "set": f(e) && s(o.get(Xe));
		}
	}
	Ne();
}
function tt(e, t) {
	let n = Ye.get(e);
	return n && n.get(t);
}
function nt(e) {
	let t = /* @__PURE__ */ M(e);
	return t === e || ($e(t, "iterate", Qe), /* @__PURE__ */ Vt(e)) ? t : /* @__PURE__ */ Bt(e) ? /* @__PURE__ */ zt(e) ? t.map((e) => Gt(Wt(e))) : t.map(Gt) : t.map(Wt);
}
function rt(e) {
	return $e(e = /* @__PURE__ */ M(e), "iterate", Qe), e;
}
function it(e, t) {
	return /* @__PURE__ */ Bt(e) ? Gt(/* @__PURE__ */ zt(e) ? Wt(t) : t) : Wt(t);
}
var at = {
	__proto__: null,
	[Symbol.iterator]() {
		return ot(this, Symbol.iterator, (e) => it(this, e));
	},
	concat(...e) {
		return nt(this).concat(...e.map((e) => d(e) ? nt(e) : e));
	},
	entries() {
		return ot(this, "entries", (e) => (e[1] = it(this, e[1]), e));
	},
	every(e, t) {
		return ct(this, "every", e, t, void 0, arguments);
	},
	filter(e, t) {
		return ct(this, "filter", e, t, (e) => e.map((e) => it(this, e)), arguments);
	},
	find(e, t) {
		return ct(this, "find", e, t, (e) => it(this, e), arguments);
	},
	findIndex(e, t) {
		return ct(this, "findIndex", e, t, void 0, arguments);
	},
	findLast(e, t) {
		return ct(this, "findLast", e, t, (e) => it(this, e), arguments);
	},
	findLastIndex(e, t) {
		return ct(this, "findLastIndex", e, t, void 0, arguments);
	},
	forEach(e, t) {
		return ct(this, "forEach", e, t, void 0, arguments);
	},
	includes(...e) {
		return ut(this, "includes", e);
	},
	indexOf(...e) {
		return ut(this, "indexOf", e);
	},
	join(e) {
		return nt(this).join(e);
	},
	lastIndexOf(...e) {
		return ut(this, "lastIndexOf", e);
	},
	map(e, t) {
		return ct(this, "map", e, t, void 0, arguments);
	},
	pop() {
		return dt(this, "pop");
	},
	push(...e) {
		return dt(this, "push", e);
	},
	reduce(e, ...t) {
		return lt(this, "reduce", e, t);
	},
	reduceRight(e, ...t) {
		return lt(this, "reduceRight", e, t);
	},
	shift() {
		return dt(this, "shift");
	},
	some(e, t) {
		return ct(this, "some", e, t, void 0, arguments);
	},
	splice(...e) {
		return dt(this, "splice", e);
	},
	toReversed() {
		return nt(this).toReversed();
	},
	toSorted(e) {
		return nt(this).toSorted(e);
	},
	toSpliced(...e) {
		return nt(this).toSpliced(...e);
	},
	unshift(...e) {
		return dt(this, "unshift", e);
	},
	values() {
		return ot(this, "values", (e) => it(this, e));
	}
};
function ot(e, t, n) {
	let r = rt(e), i = r[t]();
	return r !== e && !/* @__PURE__ */ Vt(e) && (i._next = i.next, i.next = () => {
		let e = i._next();
		return e.done || (e.value = n(e.value)), e;
	}), i;
}
var st = Array.prototype;
function ct(e, t, n, r, i, a) {
	let o = rt(e), s = o !== e && !/* @__PURE__ */ Vt(e), c = o[t];
	if (c !== st[t]) {
		let t = c.apply(e, a);
		return s ? Wt(t) : t;
	}
	let l = n;
	o !== e && (s ? l = function(t, r) {
		return n.call(this, it(e, t), r, e);
	} : n.length > 2 && (l = function(t, r) {
		return n.call(this, t, r, e);
	}));
	let u = c.call(o, l, r);
	return s && i ? i(u) : u;
}
function lt(e, t, n, r) {
	let i = rt(e), a = i !== e && !/* @__PURE__ */ Vt(e), o = n, s = !1;
	i !== e && (a ? (s = r.length === 0, o = function(t, r, i) {
		return s && (s = !1, t = it(e, t)), n.call(this, t, it(e, r), i, e);
	}) : n.length > 3 && (o = function(t, r, i) {
		return n.call(this, t, r, i, e);
	}));
	let c = i[t](o, ...r);
	return s ? it(e, c) : c;
}
function ut(e, t, n) {
	let r = /* @__PURE__ */ M(e);
	$e(r, "iterate", Qe);
	let i = r[t](...n);
	return (i === -1 || i === !1) && /* @__PURE__ */ Ht(n[0]) ? (n[0] = /* @__PURE__ */ M(n[0]), r[t](...n)) : i;
}
function dt(e, t, n = []) {
	He(), Me();
	let r = (/* @__PURE__ */ M(e))[t].apply(e, n);
	return Ne(), Ue(), r;
}
var ft = /* @__PURE__ */ e("__proto__,__v_isRef,__isVue"), pt = new Set(/* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(_));
function mt(e) {
	_(e) || (e = String(e));
	let t = /* @__PURE__ */ M(this);
	return $e(t, "has", e), t.hasOwnProperty(e);
}
var ht = class {
	constructor(e = !1, t = !1) {
		this._isReadonly = e, this._isShallow = t;
	}
	get(e, t, n) {
		if (t === "__v_skip") return e.__v_skip;
		let r = this._isReadonly, i = this._isShallow;
		if (t === "__v_isReactive") return !r;
		if (t === "__v_isReadonly") return r;
		if (t === "__v_isShallow") return i;
		if (t === "__v_raw") return n === (r ? i ? Nt : Mt : i ? jt : At).get(e) || Object.getPrototypeOf(e) === Object.getPrototypeOf(n) ? e : void 0;
		let a = d(e);
		if (!r) {
			let e;
			if (a && (e = at[t])) return e;
			if (t === "hasOwnProperty") return mt;
		}
		let o = Reflect.get(e, t, /* @__PURE__ */ Kt(e) ? e : n);
		if ((_(t) ? pt.has(t) : ft(t)) || (r || $e(e, "get", t), i)) return o;
		if (/* @__PURE__ */ Kt(o)) {
			let e = a && w(t) ? o : o.value;
			return r && v(e) ? /* @__PURE__ */ Lt(e) : e;
		}
		return v(o) ? r ? /* @__PURE__ */ Lt(o) : /* @__PURE__ */ Ft(o) : o;
	}
}, gt = class extends ht {
	constructor(e = !1) {
		super(!1, e);
	}
	set(e, t, n, r) {
		let i = e[t], a = d(e) && w(t);
		if (!this._isShallow) {
			let e = /* @__PURE__ */ Bt(i);
			if (!/* @__PURE__ */ Vt(n) && !/* @__PURE__ */ Bt(n) && (i = /* @__PURE__ */ M(i), n = /* @__PURE__ */ M(n)), !a && /* @__PURE__ */ Kt(i) && !/* @__PURE__ */ Kt(n)) return e || (i.value = n), !0;
		}
		let o = a ? Number(t) < e.length : u(e, t), s = Reflect.set(e, t, n, /* @__PURE__ */ Kt(e) ? e : r);
		return e === /* @__PURE__ */ M(r) && s && (o ? ie(n, i) && et(e, "set", t, n, i) : et(e, "add", t, n)), s;
	}
	deleteProperty(e, t) {
		let n = u(e, t), r = e[t], i = Reflect.deleteProperty(e, t);
		return i && n && et(e, "delete", t, void 0, r), i;
	}
	has(e, t) {
		let n = Reflect.has(e, t);
		return (!_(t) || !pt.has(t)) && $e(e, "has", t), n;
	}
	ownKeys(e) {
		return $e(e, "iterate", d(e) ? "length" : Xe), Reflect.ownKeys(e);
	}
}, _t = class extends ht {
	constructor(e = !1) {
		super(!0, e);
	}
	set(e, t) {
		return !0;
	}
	deleteProperty(e, t) {
		return !0;
	}
}, vt = /* @__PURE__ */ new gt(), yt = /* @__PURE__ */ new _t(), bt = /* @__PURE__ */ new gt(!0), xt = (e) => e, St = (e) => Reflect.getPrototypeOf(e);
function Ct(e, t, n) {
	return function(...r) {
		let i = this.__v_raw, a = /* @__PURE__ */ M(i), o = f(a), c = e === "entries" || e === Symbol.iterator && o, l = e === "keys" && o, u = i[e](...r), d = n ? xt : t ? Gt : Wt;
		return !t && $e(a, "iterate", l ? Ze : Xe), s(Object.create(u), { next() {
			let { value: e, done: t } = u.next();
			return t ? {
				value: e,
				done: t
			} : {
				value: c ? [d(e[0]), d(e[1])] : d(e),
				done: t
			};
		} });
	};
}
function wt(e) {
	return function(...t) {
		return e === "delete" ? !1 : e === "clear" ? void 0 : this;
	};
}
function Tt(e, t) {
	let n = {
		get(n) {
			let r = this.__v_raw, i = /* @__PURE__ */ M(r), a = /* @__PURE__ */ M(n);
			e || (ie(n, a) && $e(i, "get", n), $e(i, "get", a));
			let { has: o } = St(i), s = t ? xt : e ? Gt : Wt;
			if (o.call(i, n)) return s(r.get(n));
			if (o.call(i, a)) return s(r.get(a));
			r !== i && r.get(n);
		},
		get size() {
			let t = this.__v_raw;
			return !e && $e(/* @__PURE__ */ M(t), "iterate", Xe), t.size;
		},
		has(t) {
			let n = this.__v_raw, r = /* @__PURE__ */ M(n), i = /* @__PURE__ */ M(t);
			return e || (ie(t, i) && $e(r, "has", t), $e(r, "has", i)), t === i ? n.has(t) : n.has(t) || n.has(i);
		},
		forEach(n, r) {
			let i = this, a = i.__v_raw, o = /* @__PURE__ */ M(a), s = t ? xt : e ? Gt : Wt;
			return !e && $e(o, "iterate", Xe), a.forEach((e, t) => n.call(r, s(e), s(t), i));
		}
	};
	return s(n, e ? {
		add: wt("add"),
		set: wt("set"),
		delete: wt("delete"),
		clear: wt("clear")
	} : {
		add(e) {
			let n = /* @__PURE__ */ M(this), r = St(n), i = /* @__PURE__ */ M(e), a = !t && !/* @__PURE__ */ Vt(e) && !/* @__PURE__ */ Bt(e) ? i : e;
			return r.has.call(n, a) || ie(e, a) && r.has.call(n, e) || ie(i, a) && r.has.call(n, i) || (n.add(a), et(n, "add", a, a)), this;
		},
		set(e, n) {
			!t && !/* @__PURE__ */ Vt(n) && !/* @__PURE__ */ Bt(n) && (n = /* @__PURE__ */ M(n));
			let r = /* @__PURE__ */ M(this), { has: i, get: a } = St(r), o = i.call(r, e);
			o ||= (e = /* @__PURE__ */ M(e), i.call(r, e));
			let s = a.call(r, e);
			return r.set(e, n), o ? ie(n, s) && et(r, "set", e, n, s) : et(r, "add", e, n), this;
		},
		delete(e) {
			let t = /* @__PURE__ */ M(this), { has: n, get: r } = St(t), i = n.call(t, e);
			i ||= (e = /* @__PURE__ */ M(e), n.call(t, e));
			let a = r ? r.call(t, e) : void 0, o = t.delete(e);
			return i && et(t, "delete", e, void 0, a), o;
		},
		clear() {
			let e = /* @__PURE__ */ M(this), t = e.size !== 0, n = e.clear();
			return t && et(e, "clear", void 0, void 0, void 0), n;
		}
	}), [
		"keys",
		"values",
		"entries",
		Symbol.iterator
	].forEach((r) => {
		n[r] = Ct(r, e, t);
	}), n;
}
function Et(e, t) {
	let n = Tt(e, t);
	return (t, r, i) => r === "__v_isReactive" ? !e : r === "__v_isReadonly" ? e : r === "__v_raw" ? t : Reflect.get(u(n, r) && r in t ? n : t, r, i);
}
var Dt = { get: /* @__PURE__ */ Et(!1, !1) }, Ot = { get: /* @__PURE__ */ Et(!1, !0) }, kt = { get: /* @__PURE__ */ Et(!0, !1) }, At = /* @__PURE__ */ new WeakMap(), jt = /* @__PURE__ */ new WeakMap(), Mt = /* @__PURE__ */ new WeakMap(), Nt = /* @__PURE__ */ new WeakMap();
function Pt(e) {
	switch (e) {
		case "Object":
		case "Array": return 1;
		case "Map":
		case "Set":
		case "WeakMap":
		case "WeakSet": return 2;
		default: return 0;
	}
}
// @__NO_SIDE_EFFECTS__
function Ft(e) {
	return /* @__PURE__ */ Bt(e) ? e : Rt(e, !1, vt, Dt, At);
}
// @__NO_SIDE_EFFECTS__
function It(e) {
	return Rt(e, !1, bt, Ot, jt);
}
// @__NO_SIDE_EFFECTS__
function Lt(e) {
	return Rt(e, !0, yt, kt, Mt);
}
function Rt(e, t, n, r, i) {
	if (!v(e) || e.__v_raw && !(t && e.__v_isReactive) || e.__v_skip || !Object.isExtensible(e)) return e;
	let a = i.get(e);
	if (a) return a;
	let o = Pt(S(e));
	if (o === 0) return e;
	let s = new Proxy(e, o === 2 ? r : n);
	return i.set(e, s), s;
}
// @__NO_SIDE_EFFECTS__
function zt(e) {
	return /* @__PURE__ */ Bt(e) ? /* @__PURE__ */ zt(e.__v_raw) : !!(e && e.__v_isReactive);
}
// @__NO_SIDE_EFFECTS__
function Bt(e) {
	return !!(e && e.__v_isReadonly);
}
// @__NO_SIDE_EFFECTS__
function Vt(e) {
	return !!(e && e.__v_isShallow);
}
// @__NO_SIDE_EFFECTS__
function Ht(e) {
	return e ? !!e.__v_raw : !1;
}
// @__NO_SIDE_EFFECTS__
function M(e) {
	let t = e && e.__v_raw;
	return t ? /* @__PURE__ */ M(t) : e;
}
function Ut(e) {
	return !u(e, "__v_skip") && Object.isExtensible(e) && oe(e, "__v_skip", !0), e;
}
var Wt = (e) => v(e) ? /* @__PURE__ */ Ft(e) : e, Gt = (e) => v(e) ? /* @__PURE__ */ Lt(e) : e;
// @__NO_SIDE_EFFECTS__
function Kt(e) {
	return e ? e.__v_isRef === !0 : !1;
}
// @__NO_SIDE_EFFECTS__
function N(e) {
	return Jt(e, !1);
}
// @__NO_SIDE_EFFECTS__
function qt(e) {
	return Jt(e, !0);
}
function Jt(e, t) {
	return /* @__PURE__ */ Kt(e) ? e : new Yt(e, t);
}
var Yt = class {
	constructor(e, t) {
		this.dep = new qe(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = t ? e : /* @__PURE__ */ M(e), this._value = t ? e : Wt(e), this.__v_isShallow = t;
	}
	get value() {
		return this.dep.track(), this._value;
	}
	set value(e) {
		let t = this._rawValue, n = this.__v_isShallow || /* @__PURE__ */ Vt(e) || /* @__PURE__ */ Bt(e);
		e = n ? e : /* @__PURE__ */ M(e), ie(e, t) && (this._rawValue = e, this._value = n ? e : Wt(e), this.dep.trigger());
	}
};
function Xt(e) {
	return /* @__PURE__ */ Kt(e) ? e.value : e;
}
var Zt = {
	get: (e, t, n) => t === "__v_raw" ? e : Xt(Reflect.get(e, t, n)),
	set: (e, t, n, r) => {
		let i = e[t];
		return /* @__PURE__ */ Kt(i) && !/* @__PURE__ */ Kt(n) ? (i.value = n, !0) : Reflect.set(e, t, n, r);
	}
};
function Qt(e) {
	return /* @__PURE__ */ zt(e) ? e : new Proxy(e, Zt);
}
var $t = class {
	constructor(e, t, n) {
		this._object = e, this._defaultValue = n, this.__v_isRef = !0, this._value = void 0, this._key = _(t) ? t : String(t), this._raw = /* @__PURE__ */ M(e);
		let r = !0, i = e;
		if (!d(e) || _(this._key) || !w(this._key)) do
			r = !/* @__PURE__ */ Ht(i) || /* @__PURE__ */ Vt(i);
		while (r && (i = i.__v_raw));
		this._shallow = r;
	}
	get value() {
		let e = this._object[this._key];
		return this._shallow && (e = Xt(e)), this._value = e === void 0 ? this._defaultValue : e;
	}
	set value(e) {
		if (this._shallow && /* @__PURE__ */ Kt(this._raw[this._key])) {
			let t = this._object[this._key];
			if (/* @__PURE__ */ Kt(t)) {
				t.value = e;
				return;
			}
		}
		this._object[this._key] = e;
	}
	get dep() {
		return tt(this._raw, this._key);
	}
}, en = class {
	constructor(e) {
		this._getter = e, this.__v_isRef = !0, this.__v_isReadonly = !0, this._value = void 0;
	}
	get value() {
		return this._value = this._getter();
	}
};
// @__NO_SIDE_EFFECTS__
function tn(e, t, n) {
	return /* @__PURE__ */ Kt(e) ? e : h(e) ? new en(e) : v(e) && arguments.length > 1 ? nn(e, t, n) : /* @__PURE__ */ N(e);
}
function nn(e, t, n) {
	return new $t(e, t, n);
}
var rn = class {
	constructor(e, t, n) {
		this.fn = e, this.setter = t, this._value = void 0, this.dep = new qe(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = Ge - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !t, this.isSSR = n;
	}
	notify() {
		if (this.flags |= 16, !(this.flags & 8) && j !== this) return je(this, !0), !0;
	}
	get value() {
		let e = this.dep.track();
		return Le(this), e && (e.version = this.dep.version), this._value;
	}
	set value(e) {
		this.setter && this.setter(e);
	}
};
// @__NO_SIDE_EFFECTS__
function an(e, t, n = !1) {
	let r, i;
	return h(e) ? r = e : (r = e.get, i = e.set), new rn(r, i, n);
}
var on = {}, sn = /* @__PURE__ */ new WeakMap(), cn = void 0;
function ln(e, t = !1, n = cn) {
	if (n) {
		let t = sn.get(n);
		t || sn.set(n, t = []), t.push(e);
	}
}
function un(e, n, i = t) {
	let { immediate: a, deep: o, once: s, scheduler: l, augmentJob: u, call: f } = i, p = (e) => o ? e : /* @__PURE__ */ Vt(e) || o === !1 || o === 0 ? dn(e, 1) : dn(e), m, g, _, v, y = !1, b = !1;
	if (/* @__PURE__ */ Kt(e) ? (g = () => e.value, y = /* @__PURE__ */ Vt(e)) : /* @__PURE__ */ zt(e) ? (g = () => p(e), y = !0) : d(e) ? (b = !0, y = e.some((e) => /* @__PURE__ */ zt(e) || /* @__PURE__ */ Vt(e)), g = () => e.map((e) => {
		if (/* @__PURE__ */ Kt(e)) return e.value;
		if (/* @__PURE__ */ zt(e)) return p(e);
		if (h(e)) return f ? f(e, 2) : e();
	})) : g = h(e) ? n ? f ? () => f(e, 2) : e : () => {
		if (_) {
			He();
			try {
				_();
			} finally {
				Ue();
			}
		}
		let t = cn;
		cn = m;
		try {
			return f ? f(e, 3, [v]) : e(v);
		} finally {
			cn = t;
		}
	} : r, n && o) {
		let e = g, t = o === !0 ? Infinity : o;
		g = () => dn(e(), t);
	}
	let x = Te(), S = () => {
		m.stop(), x && x.active && c(x.effects, m);
	};
	if (s && n) {
		let e = n;
		n = (...t) => {
			let n = e(...t);
			return S(), n;
		};
	}
	let C = b ? Array(e.length).fill(on) : on, w = (e) => {
		if (m.flags & 1 && (m.dirty || e)) {
			if (n) {
				let t = m.run();
				if (e || o || y || (b ? t.some((e, t) => ie(e, C[t])) : ie(t, C))) {
					_ && _();
					let e = cn;
					cn = m;
					try {
						let e = [
							t,
							C === on ? void 0 : b && C[0] === on ? [] : C,
							v
						];
						C = t, f ? f(n, 3, e) : n(...e);
					} finally {
						cn = e;
					}
				}
			} else m.run();
		}
	};
	return u && u(w), m = new De(g), m.scheduler = l ? () => l(w, !1) : w, v = (e) => ln(e, !1, m), _ = m.onStop = () => {
		let e = sn.get(m);
		if (e) {
			if (f) f(e, 4);
			else for (let t of e) t();
			sn.delete(m);
		}
	}, n ? a ? w(!0) : C = m.run() : l ? l(w.bind(null, !0), !0) : m.run(), S.pause = m.pause.bind(m), S.resume = m.resume.bind(m), S.stop = S, S;
}
function dn(e, t = Infinity, n) {
	if (t <= 0 || !v(e) || e.__v_skip || (n ||= /* @__PURE__ */ new Map(), (n.get(e) || 0) >= t)) return e;
	if (n.set(e, t), t--, /* @__PURE__ */ Kt(e)) dn(e.value, t, n);
	else if (d(e)) for (let r = 0; r < e.length; r++) dn(e[r], t, n);
	else if (p(e) || f(e)) e.forEach((e) => {
		dn(e, t, n);
	});
	else if (C(e)) {
		for (let r in e) dn(e[r], t, n);
		for (let r of Object.getOwnPropertySymbols(e)) Object.prototype.propertyIsEnumerable.call(e, r) && dn(e[r], t, n);
	}
	return e;
}
//#endregion
//#region node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js
function fn(e, t, n, r) {
	try {
		return r ? e(...r) : e();
	} catch (e) {
		mn(e, t, n);
	}
}
function pn(e, t, n, r) {
	if (h(e)) {
		let i = fn(e, t, n, r);
		return i && y(i) && i.catch((e) => {
			mn(e, t, n);
		}), i;
	}
	if (d(e)) {
		let i = [];
		for (let a = 0; a < e.length; a++) i.push(pn(e[a], t, n, r));
		return i;
	}
}
function mn(e, n, r, i = !0) {
	let a = n ? n.vnode : null, { errorHandler: o, throwUnhandledErrorInProduction: s } = n && n.appContext.config || t;
	if (n) {
		let t = n.parent, i = n.proxy, a = `https://vuejs.org/error-reference/#runtime-${r}`;
		for (; t;) {
			let n = t.ec;
			if (n) {
				for (let t = 0; t < n.length; t++) if (n[t](e, i, a) === !1) return;
			}
			t = t.parent;
		}
		if (o) {
			He(), fn(o, null, 10, [
				e,
				i,
				a
			]), Ue();
			return;
		}
	}
	hn(e, r, a, i, s);
}
function hn(e, t, n, r = !0, i = !1) {
	if (i) throw e;
	console.error(e);
}
var gn = [], _n = -1, vn = [], yn = null, bn = 0, xn = /* @__PURE__ */ Promise.resolve(), Sn = null;
function Cn(e) {
	let t = Sn || xn;
	return e ? t.then(this ? e.bind(this) : e) : t;
}
function wn(e) {
	let t = _n + 1, n = gn.length;
	for (; t < n;) {
		let r = t + n >>> 1, i = gn[r], a = An(i);
		a < e || a === e && i.flags & 2 ? t = r + 1 : n = r;
	}
	return t;
}
function Tn(e) {
	if (!(e.flags & 1)) {
		let t = An(e), n = gn[gn.length - 1];
		!n || !(e.flags & 2) && t >= An(n) ? gn.push(e) : gn.splice(wn(t), 0, e), e.flags |= 1, En();
	}
}
function En() {
	Sn ||= xn.then(jn);
}
function Dn(e) {
	if (!d(e)) yn && e.id === -1 ? yn.splice(bn + 1, 0, e) : e.flags & 1 || (vn.push(e), e.flags |= 1);
	else for (let t = 0; t < e.length; t++) vn.push(e[t]);
	En();
}
function On(e, t, n = _n + 1) {
	for (; n < gn.length; n++) {
		let t = gn[n];
		if (t && t.flags & 2) {
			if (e && t.id !== e.uid) continue;
			gn.splice(n, 1), n--, t.flags & 4 && (t.flags &= -2), t(), t.flags & 4 || (t.flags &= -2);
		}
	}
}
function kn(e) {
	if (vn.length) {
		let e = [...new Set(vn)].sort((e, t) => An(e) - An(t));
		if (vn.length = 0, yn) {
			for (let t = 0; t < e.length; t++) yn.push(e[t]);
			return;
		}
		for (yn = e, bn = 0; bn < yn.length; bn++) {
			let e = yn[bn];
			e.flags & 4 && (e.flags &= -2), e.flags & 8 || e(), e.flags &= -2;
		}
		yn = null, bn = 0;
	}
}
var An = (e) => e.id == null ? e.flags & 2 ? -1 : Infinity : e.id;
function jn(e) {
	try {
		for (_n = 0; _n < gn.length; _n++) {
			let e = gn[_n];
			e && !(e.flags & 8) && (e.flags & 4 && (e.flags &= -2), fn(e, e.i, e.i ? 15 : 14), e.flags & 4 || (e.flags &= -2));
		}
	} finally {
		for (; _n < gn.length; _n++) {
			let e = gn[_n];
			e && (e.flags &= -2);
		}
		_n = -1, gn.length = 0, kn(e), Sn = null, (gn.length || vn.length) && jn(e);
	}
}
var Mn = null, Nn = null;
function Pn(e) {
	let t = Mn;
	return Mn = e, Nn = e && e.type.__scopeId || null, t;
}
function Fn(e, t = Mn, n) {
	if (!t || e._n) return e;
	let r = (...n) => {
		r._d && ji(-1);
		let i = Pn(t), a = Di.length, o;
		try {
			o = e(...n);
		} finally {
			for (let e = Di.length; e > a; e--) ki();
			Pn(i), r._d && ji(1);
		}
		return o;
	};
	return r._n = !0, r._c = !0, r._d = !0, r;
}
function In(e, t, n, r) {
	let i = e.dirs, a = t && t.dirs;
	for (let o = 0; o < i.length; o++) {
		let s = i[o];
		a && (s.oldValue = a[o].value);
		let c = s.dir[r];
		c && (He(), pn(c, n, 8, [
			e.el,
			s,
			e,
			t
		]), Ue());
	}
}
function Ln(e, t) {
	if ($i) {
		let n = $i.provides, r = $i.parent && $i.parent.provides;
		r === n && (n = $i.provides = Object.create(r)), n[e] = t;
	}
}
function Rn(e, t, n = !1) {
	let r = ea();
	if (r || Fr) {
		let i = Fr ? Fr._context.provides : r ? r.parent == null || r.ce ? r.vnode.appContext && r.vnode.appContext.provides : r.parent.provides : void 0;
		if (i && e in i) return i[e];
		if (arguments.length > 1) return n && h(t) ? t.call(r && r.proxy) : t;
	}
}
var zn = /* @__PURE__ */ Symbol.for("v-scx"), Bn = () => Rn(zn);
function Vn(e, t) {
	return Un(e, null, t);
}
function Hn(e, t, n) {
	return Un(e, t, n);
}
function Un(e, n, i = t) {
	let { immediate: a, deep: o, flush: c, once: l } = i, u = s({}, i), d = n && a || !n && c !== "post", f;
	if (oa) {
		if (c === "sync") {
			let e = Bn();
			f = e.__watcherHandles ||= [];
		} else if (!d) {
			let e = () => {};
			return e.stop = r, e.resume = r, e.pause = r, e;
		}
	}
	let p = $i;
	u.call = (e, t, n) => pn(e, p, t, n);
	let m = !1;
	c === "post" ? u.scheduler = (e) => {
		ui(e, p && p.suspense);
	} : c !== "sync" && (m = !0, u.scheduler = (e, t) => {
		t ? e() : Tn(e);
	}), u.augmentJob = (e) => {
		n && (e.flags |= 4), m && (e.flags |= 2, p && (e.id = p.uid, e.i = p));
	};
	let h = un(e, n, u);
	return oa && (f ? f.push(h) : d && h()), h;
}
var Wn = /* @__PURE__ */ Symbol("_vte"), Gn = (e) => e.__isTeleport, Kn = /* @__PURE__ */ Symbol("_leaveCb"), qn = /* @__PURE__ */ Symbol("_enterCb");
function Jn() {
	let e = {
		isMounted: !1,
		isLeaving: !1,
		isUnmounting: !1,
		leavingVNodes: /* @__PURE__ */ new Map()
	};
	return xr(() => {
		e.isMounted = !0;
	}), Cr(() => {
		e.isUnmounting = !0;
	}), e;
}
var Yn = [Function, Array], Xn = {
	mode: String,
	appear: Boolean,
	persisted: Boolean,
	onBeforeEnter: Yn,
	onEnter: Yn,
	onAfterEnter: Yn,
	onEnterCancelled: Yn,
	onBeforeLeave: Yn,
	onLeave: Yn,
	onAfterLeave: Yn,
	onLeaveCancelled: Yn,
	onBeforeAppear: Yn,
	onAppear: Yn,
	onAfterAppear: Yn,
	onAppearCancelled: Yn
}, Zn = (e) => {
	let t = e.subTree;
	return t.component ? Zn(t.component) : t;
}, Qn = {
	name: "BaseTransition",
	props: Xn,
	setup(e, { slots: t }) {
		let n = ea(), r = Jn();
		return () => {
			let i = t.default && or(t.default(), !0), a = i && i.length ? $n(i) : n.subTree ? Wi() : void 0;
			if (!a) return;
			let o = /* @__PURE__ */ M(e), { mode: s } = o;
			if (r.isLeaving) return rr(a);
			let c = ir(a);
			if (!c) return rr(a);
			let l = nr(c, o, r, n, (e) => l = e);
			c.type !== Ti && ar(c, l);
			let u = n.subTree && ir(n.subTree);
			if (u && u.type !== Ti && !Fi(u, c) && Zn(n).type !== Ti) {
				let e = nr(u, o, r, n);
				if (ar(u, e), s === "out-in" && c.type !== Ti) return r.isLeaving = !0, e.afterLeave = () => {
					r.isLeaving = !1, n.job.flags & 8 || n.update(), delete e.afterLeave, u = void 0;
				}, rr(a);
				s === "in-out" && c.type !== Ti ? e.delayLeave = (e, t, n) => {
					let i = tr(r, u);
					i[String(u.key)] = u, e[Kn] = () => {
						t(), e[Kn] = void 0, delete l.delayedLeave, u = void 0;
					}, l.delayedLeave = () => {
						n(), delete l.delayedLeave, u = void 0;
					};
				} : u = void 0;
			} else u &&= void 0;
			return a;
		};
	}
};
function $n(e) {
	let t = e[0];
	if (e.length > 1) {
		for (let n of e) if (n.type !== Ti) {
			t = n;
			break;
		}
	}
	return t;
}
var er = Qn;
function tr(e, t) {
	let { leavingVNodes: n } = e, r = n.get(t.type);
	return r || (r = /* @__PURE__ */ Object.create(null), n.set(t.type, r)), r;
}
function nr(e, t, n, r, i) {
	let { appear: a, mode: o, persisted: s = !1, onBeforeEnter: c, onEnter: l, onAfterEnter: u, onEnterCancelled: f, onBeforeLeave: p, onLeave: m, onAfterLeave: h, onLeaveCancelled: g, onBeforeAppear: _, onAppear: v, onAfterAppear: y, onAppearCancelled: b } = t, x = String(e.key), S = tr(n, e), C = (e, t) => {
		e && pn(e, r, 9, t);
	}, w = (e, t) => {
		let n = t[1];
		C(e, t), d(e) ? e.every((e) => e.length <= 1) && n() : e.length <= 1 && n();
	}, T = {
		mode: o,
		persisted: s,
		beforeEnter(t) {
			let r = c;
			if (!n.isMounted) {
				if (a) r = _ || c;
				else return;
			}
			t[Kn] && t[Kn](!0);
			let i = S[x];
			i && Fi(e, i) && i.el[Kn] && i.el[Kn](), C(r, [t]);
		},
		enter(t) {
			if (S[x] === e) return;
			let r = l, i = u, o = f;
			if (!n.isMounted) {
				if (a) r = v || l, i = y || u, o = b || f;
				else return;
			}
			let s = !1;
			t[qn] = (e) => {
				s || (s = !0, C(e ? o : i, [t]), T.delayedLeave && T.delayedLeave(), t[qn] = void 0);
			};
			let c = t[qn].bind(null, !1);
			r ? w(r, [t, c]) : c();
		},
		leave(t, r) {
			let i = String(e.key);
			if (t[qn] && t[qn](!0), n.isUnmounting) return r();
			C(p, [t]);
			let a = !1;
			t[Kn] = (n) => {
				a || (a = !0, r(), C(n ? g : h, [t]), t[Kn] = void 0, S[i] === e && delete S[i]);
			};
			let o = t[Kn].bind(null, !1);
			S[i] = e, m ? w(m, [t, o]) : o();
		},
		clone(e) {
			let a = nr(e, t, n, r, i);
			return i && i(a), a;
		}
	};
	return T;
}
function rr(e) {
	if (pr(e)) return e = Hi(e), e.children = null, e;
}
function ir(e) {
	if (!pr(e)) return Gn(e.type) && e.children ? $n(e.children) : e;
	if (e.component) return e.component.subTree;
	let { shapeFlag: t, children: n } = e;
	if (n) {
		if (t & 16) return n[0];
		if (t & 32 && h(n.default)) return n.default();
	}
}
function ar(e, t) {
	if (e.shapeFlag & 6 && e.component) {
		e.transition = t;
		let n = e.component.subTree;
		ar(Gn(n.type) && ir(n) || n, t);
	} else e.shapeFlag & 128 ? (e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback)) : e.transition = t;
}
function or(e, t = !1, n) {
	let r = [], i = 0;
	for (let a = 0; a < e.length; a++) {
		let o = e[a], s = n == null ? o.key : String(n) + String(o.key == null ? a : o.key);
		o.type === Ci ? (o.patchFlag & 128 && i++, r = r.concat(or(o.children, t, s))) : (t || o.type !== Ti) && r.push(s == null ? o : Hi(o, { key: s }));
	}
	if (i > 1) for (let e = 0; e < r.length; e++) r[e].patchFlag = -2;
	return r;
}
// @__NO_SIDE_EFFECTS__
function P(e, t) {
	return h(e) ? /* @__PURE__ */ s({ name: e.name }, t, { setup: e }) : e;
}
function sr(e) {
	e.ids = [
		e.ids[0] + e.ids[2]++ + "-",
		0,
		0
	];
}
function cr(e, t) {
	let n;
	return !!((n = Object.getOwnPropertyDescriptor(e, t)) && !n.configurable);
}
var lr = /* @__PURE__ */ new WeakMap();
function ur(e, n, r, a, o = !1) {
	if (d(e)) {
		e.forEach((e, t) => ur(e, n && (d(n) ? n[t] : n), r, a, o));
		return;
	}
	if (fr(a) && !o) {
		a.shapeFlag & 512 && a.type.__asyncResolved && a.component.subTree.component && ur(e, n, r, a.component.subTree);
		return;
	}
	let s = a.shapeFlag & 4 ? pa(a.component) : a.el, l = o ? null : s, { i: f, r: p } = e, m = n && n.r, _ = f.refs === t ? f.refs = {} : f.refs, v = f.setupState, y = /* @__PURE__ */ M(v), b = v === t ? i : (e) => !cr(_, e) && u(y, e), x = (e, t) => !(t && cr(_, t));
	if (m != null && m !== p) {
		if (dr(n), g(m)) _[m] = null, b(m) && (v[m] = null);
		else if (/* @__PURE__ */ Kt(m)) {
			let e = n;
			x(m, e.k) && (m.value = null), e.k && (_[e.k] = null);
		}
	}
	if (h(p)) fn(p, f, 12, [l, _]);
	else {
		let t = g(p), n = /* @__PURE__ */ Kt(p);
		if (t || n) {
			let i = () => {
				if (e.f) {
					let n = t ? b(p) ? v[p] : _[p] : x(p) || !e.k ? p.value : _[e.k];
					if (o) d(n) && c(n, s);
					else if (d(n)) n.includes(s) || n.push(s);
					else if (t) _[p] = [s], b(p) && (v[p] = _[p]);
					else {
						let t = [s];
						x(p, e.k) && (p.value = t), e.k && (_[e.k] = t);
					}
				} else t ? (_[p] = l, b(p) && (v[p] = l)) : n && (x(p, e.k) && (p.value = l), e.k && (_[e.k] = l));
			};
			if (l) {
				let t = () => {
					i(), lr.delete(e);
				};
				t.id = -1, lr.set(e, t), ui(t, r);
			} else dr(e), i();
		}
	}
}
function dr(e) {
	let t = lr.get(e);
	t && (t.flags |= 8, lr.delete(e));
}
ue().requestIdleCallback, ue().cancelIdleCallback;
var fr = (e) => !!e.type.__asyncLoader, pr = (e) => e.type.__isKeepAlive;
function mr(e, t) {
	gr(e, "a", t);
}
function hr(e, t) {
	gr(e, "da", t);
}
function gr(e, t, n = $i) {
	let r = e.__wdc ||= () => {
		let t = n;
		for (; t;) {
			if (t.isDeactivated) return;
			t = t.parent;
		}
		return e();
	};
	if (vr(t, r, n), n) {
		let e = n.parent;
		for (; e && e.parent;) pr(e.parent.vnode) && _r(r, t, n, e), e = e.parent;
	}
}
function _r(e, t, n, r) {
	let i = vr(t, e, r, !0);
	wr(() => {
		c(r[t], i);
	}, n);
}
function vr(e, t, n = $i, r = !1) {
	if (n) {
		let i = n[e] || (n[e] = []), a = t.__weh ||= (...r) => {
			He();
			let i = ra(n), a = pn(t, n, e, r);
			return i(), Ue(), a;
		};
		return r ? i.unshift(a) : i.push(a), a;
	}
}
var yr = (e) => (t, n = $i) => {
	(!oa || e === "sp") && vr(e, (...e) => t(...e), n);
}, br = yr("bm"), xr = yr("m"), Sr = yr("u"), Cr = yr("bum"), wr = yr("um"), Tr = /* @__PURE__ */ Symbol.for("v-ndc");
function Er(e, t, n, r, i, a) {
	if (n ??= {}, Mn.ce || Mn.parent && fr(Mn.parent) && Mn.parent.ce) {
		let e = a != null && n.key == null ? s({}, n, { key: a }) : n, i = Object.keys(e).length > 0;
		return t !== "default" && (e.name = t), F(), Ni(Ci, null, [zi("slot", e, r && r())], i ? -2 : 64);
	}
	let o = e[t];
	o && o._c && (o._d = !1);
	let c = Di.length;
	F();
	let l;
	try {
		let i = o && Dr(o(n)), s = n.key || a || i && i.key;
		l = Ni(Ci, { key: (s && !_(s) ? s : `_${t}`) + (!i && r ? "_fb" : "") }, i || (r ? r() : []), i && e._ === 1 ? 64 : -2);
	} catch (e) {
		for (let e = Di.length; e > c; e--) ki();
		throw e;
	} finally {
		o && o._c && (o._d = !0);
	}
	return !i && l.scopeId && (l.slotScopeIds = [l.scopeId + "-s"]), l;
}
function Dr(e) {
	return e.some((e) => !Pi(e) || !(e.type === Ti || e.type === Ci && !Dr(e.children))) ? e : null;
}
var Or = (e) => e ? aa(e) ? pa(e) : Or(e.parent) : null, kr = /* @__PURE__ */ s(/* @__PURE__ */ Object.create(null), {
	$: (e) => e,
	$el: (e) => e.vnode.el,
	$data: (e) => e.data,
	$props: (e) => e.props,
	$attrs: (e) => e.attrs,
	$slots: (e) => e.slots,
	$refs: (e) => e.refs,
	$parent: (e) => Or(e.parent),
	$root: (e) => Or(e.root),
	$host: (e) => e.ce,
	$emit: (e) => e.emit,
	$options: (e) => e.type,
	$forceUpdate: (e) => e.f ||= () => {
		Tn(e.update);
	},
	$nextTick: (e) => e.n ||= Cn.bind(e.proxy),
	$watch: (e) => r
}), Ar = (e, n) => e !== t && !e.__isScriptSetup && u(e, n), jr = {
	get({ _: e }, n) {
		if (n === "__v_skip") return !0;
		let { ctx: r, setupState: i, data: a, props: o, accessCache: s, type: c, appContext: l } = e;
		if (n[0] !== "$") {
			let e = s[n];
			if (e !== void 0) switch (e) {
				case 1: return i[n];
				case 2: return a[n];
				case 4: return r[n];
				case 3: return o[n];
			}
			else if (Ar(i, n)) return s[n] = 1, i[n];
			else if (u(o, n)) return s[n] = 3, o[n];
			else if (r !== t && u(r, n)) return s[n] = 4, r[n];
			else s[n] = 0;
		}
		let d = kr[n], f, p;
		if (d) return n === "$attrs" && $e(e.attrs, "get", ""), d(e);
		if ((f = c.__cssModules) && (f = f[n])) return f;
		if (r !== t && u(r, n)) return s[n] = 4, r[n];
		if (p = l.config.globalProperties, u(p, n)) return p[n];
	},
	set({ _: e }, t, n) {
		let { data: r, setupState: i, ctx: a } = e;
		return Ar(i, t) ? (i[t] = n, !0) : u(e.props, t) || t[0] === "$" && t.slice(1) in e ? !1 : (a[t] = n, !0);
	},
	has({ _: { data: e, setupState: t, accessCache: n, ctx: r, appContext: i, props: a, type: o } }, s) {
		let c;
		return !!(n[s] || Ar(t, s) || u(a, s) || u(r, s) || u(kr, s) || u(i.config.globalProperties, s) || (c = o.__cssModules) && c[s]);
	},
	defineProperty(e, t, n) {
		return n.get == null ? u(n, "value") && this.set(e, t, n.value, null) : e._.accessCache[t] = 0, Reflect.defineProperty(e, t, n);
	}
};
function Mr() {
	return {
		app: null,
		config: {
			isNativeTag: i,
			performance: !1,
			globalProperties: {},
			optionMergeStrategies: {},
			errorHandler: void 0,
			warnHandler: void 0,
			compilerOptions: {}
		},
		mixins: [],
		components: {},
		directives: {},
		provides: /* @__PURE__ */ Object.create(null),
		optionsCache: /* @__PURE__ */ new WeakMap(),
		propsCache: /* @__PURE__ */ new WeakMap(),
		emitsCache: /* @__PURE__ */ new WeakMap()
	};
}
var Nr = 0;
function Pr(e, t) {
	return function(n, r = null) {
		h(n) || (n = s({}, n)), r != null && !v(r) && (r = null);
		let i = Mr(), a = /* @__PURE__ */ new WeakSet(), o = [], c = !1, l = i.app = {
			_uid: Nr++,
			_component: n,
			_props: r,
			_container: null,
			_context: i,
			_instance: null,
			version: ha,
			get config() {
				return i.config;
			},
			set config(e) {},
			use(e, ...t) {
				return a.has(e) || (e && h(e.install) ? (a.add(e), e.install(l, ...t)) : h(e) && (a.add(e), e(l, ...t))), l;
			},
			mixin(e) {
				return l;
			},
			component(e, t) {
				return t ? (i.components[e] = t, l) : i.components[e];
			},
			directive(e, t) {
				return t ? (i.directives[e] = t, l) : i.directives[e];
			},
			mount(a, o, s) {
				if (!c) {
					let u = l._ceVNode || zi(n, r);
					return u.appContext = i, s === !0 ? s = "svg" : s === !1 && (s = void 0), o && t ? t(u, a) : e(u, a, s), c = !0, l._container = a, a.__vue_app__ = l, pa(u.component);
				}
			},
			onUnmount(e) {
				o.push(e);
			},
			unmount() {
				c && (pn(o, l._instance, 16), e(null, l._container), delete l._container.__vue_app__);
			},
			provide(e, t) {
				return i.provides[e] = t, l;
			},
			runWithContext(e) {
				let t = Fr;
				Fr = l;
				try {
					return e();
				} finally {
					Fr = t;
				}
			}
		};
		return l;
	};
}
var Fr = null, Ir = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${O(t)}Modifiers`] || e[`${te(t)}Modifiers`];
function Lr(e, n, ...r) {
	if (e.isUnmounted) return;
	let i = e.vnode.props || t, a = r, o = n.startsWith("update:"), s = o && Ir(i, n.slice(7));
	s && (s.trim && (a = r.map((e) => g(e) ? e.trim() : e)), s.number && (a = a.map(se)));
	let c, l = i[c = re(n)] || i[c = re(O(n))];
	!l && o && (l = i[c = re(te(n))]), l && pn(l, e, 6, a);
	let u = i[c + "Once"];
	if (u) {
		if (!e.emitted) e.emitted = {};
		else if (e.emitted[c]) return;
		e.emitted[c] = !0, pn(u, e, 6, a);
	}
}
function Rr(e, t, n = !1) {
	let r = t.emitsCache, i = r.get(e);
	if (i !== void 0) return i;
	let a = e.emits, o = {};
	return a ? (d(a) ? a.forEach((e) => o[e] = null) : s(o, a), v(e) && r.set(e, o), o) : (v(e) && r.set(e, null), null);
}
function zr(e, t) {
	return !e || !a(t) ? !1 : (t = t.slice(2), t = t === "Once" ? t : t.replace(/Once$/, ""), u(e, t[0].toLowerCase() + t.slice(1)) || u(e, te(t)) || u(e, t));
}
function Br(e) {
	let { type: t, vnode: n, proxy: r, withProxy: i, propsOptions: [a], slots: s, attrs: c, emit: l, render: u, renderCache: d, props: f, data: p, setupState: m, ctx: h, inheritAttrs: g } = e, _ = Pn(e), v, y;
	try {
		if (n.shapeFlag & 4) {
			let e = i || r, t = e;
			v = Gi(u.call(t, e, d, f, m, p, h)), y = c;
		} else {
			let e = t;
			v = Gi(e.length > 1 ? e(f, {
				attrs: c,
				slots: s,
				emit: l
			}) : e(f, null)), y = t.props ? c : Vr(c);
		}
	} catch (t) {
		Di.length = 0, mn(t, e, 1), v = zi(Ti);
	}
	let b = v;
	if (y && g !== !1) {
		let e = Object.keys(y), { shapeFlag: t } = b;
		e.length && t & 7 && (a && e.some(o) && (y = Hr(y, a)), b = Hi(b, y, !1, !0));
	}
	return n.dirs && (b = Hi(b, null, !1, !0), b.dirs = b.dirs ? b.dirs.concat(n.dirs) : n.dirs), n.transition && ar(Gn(b.type) && ir(b) || b, n.transition), v = b, Pn(_), v;
}
var Vr = (e) => {
	let t;
	for (let n in e) (n === "class" || n === "style" || a(n)) && ((t ||= {})[n] = e[n]);
	return t;
}, Hr = (e, t) => {
	let n = {};
	for (let r in e) (!o(r) || !(r.slice(9) in t)) && (n[r] = e[r]);
	return n;
};
function Ur(e, t, n) {
	let { props: r, children: i, component: a } = e, { props: o, children: s, patchFlag: c } = t, l = a.emitsOptions;
	if (t.dirs || t.transition) return !0;
	if (n && c >= 0) {
		if (c & 1024) return !0;
		if (c & 16) return r ? Wr(r, o, l) : !!o;
		if (c & 8) {
			let e = t.dynamicProps;
			for (let t = 0; t < e.length; t++) {
				let n = e[t];
				if (Gr(o, r, n) && !zr(l, n)) return !0;
			}
		}
	} else return (i || s) && (!s || !s.$stable) ? !0 : r === o ? !1 : r ? !o || Wr(r, o, l) : !!o;
	return !1;
}
function Wr(e, t, n) {
	let r = Object.keys(t);
	if (r.length !== Object.keys(e).length) return !0;
	for (let i = 0; i < r.length; i++) {
		let a = r[i];
		if (Gr(t, e, a) && !zr(n, a)) return !0;
	}
	return !1;
}
function Gr(e, t, n) {
	let r = e[n], i = t[n];
	return n === "style" && v(r) && v(i) ? !Ce(r, i) : r !== i;
}
function Kr({ vnode: e, parent: t, suspense: n }, r) {
	for (; t;) {
		let n = t.subTree;
		if (n.suspense && n.suspense.activeBranch === e && (n.suspense.vnode.el = n.el = r, e = n), n === e) (e = t.vnode).el = r, t = t.parent;
		else break;
	}
	n && n.activeBranch === e && (n.vnode.el = r);
}
var qr = {}, Jr = () => Object.create(qr), Yr = (e) => Object.getPrototypeOf(e) === qr;
function Xr(e, t, n, r = !1) {
	let i = {}, a = Jr();
	e.propsDefaults = /* @__PURE__ */ Object.create(null), Qr(e, t, i, a);
	for (let t in e.propsOptions[0]) t in i || (i[t] = void 0);
	e.props = n ? r ? i : /* @__PURE__ */ It(i) : e.type.props ? i : a, e.attrs = a;
}
function Zr(e, t, n, r) {
	let { props: i, attrs: a, vnode: { patchFlag: o } } = e, s = /* @__PURE__ */ M(i), [c] = e.propsOptions, l = !1;
	if ((r || o > 0) && !(o & 16)) {
		if (o & 8) {
			let n = e.vnode.dynamicProps;
			for (let r = 0; r < n.length; r++) {
				let o = n[r];
				if (zr(e.emitsOptions, o)) continue;
				let d = t[o];
				if (c) {
					if (u(a, o)) d !== a[o] && (a[o] = d, l = !0);
					else {
						let t = O(o);
						i[t] = $r(c, s, t, d, e, !1);
					}
				} else d !== a[o] && (a[o] = d, l = !0);
			}
		}
	} else {
		Qr(e, t, i, a) && (l = !0);
		let r;
		for (let a in s) (!t || !u(t, a) && ((r = te(a)) === a || !u(t, r))) && (c ? n && (n[a] !== void 0 || n[r] !== void 0) && (i[a] = $r(c, s, a, void 0, e, !0)) : delete i[a]);
		if (a !== s) for (let e in a) (!t || !u(t, e)) && (delete a[e], l = !0);
	}
	l && et(e.attrs, "set", "");
}
function Qr(e, n, r, i) {
	let [a, o] = e.propsOptions, s = !1, c;
	if (n) for (let t in n) {
		if (T(t)) continue;
		let l = n[t], d;
		a && u(a, d = O(t)) ? !o || !o.includes(d) ? r[d] = l : (c ||= {})[d] = l : zr(e.emitsOptions, t) || (!(t in i) || l !== i[t]) && (i[t] = l, s = !0);
	}
	if (o) {
		let n = /* @__PURE__ */ M(r), i = c || t;
		for (let t = 0; t < o.length; t++) {
			let s = o[t];
			r[s] = $r(a, n, s, i[s], e, !u(i, s));
		}
	}
	return s;
}
function $r(e, t, n, r, i, a) {
	let o = e[n];
	if (o != null) {
		let e = u(o, "default");
		if (e && r === void 0) {
			let e = o.default;
			if (o.type !== Function && !o.skipFactory && h(e)) {
				let { propsDefaults: a } = i;
				if (n in a) r = a[n];
				else {
					let o = ra(i);
					r = a[n] = e.call(null, t), o();
				}
			} else r = e;
			i.ce && i.ce._setProp(n, r);
		}
		o[0] && (a && !e ? r = !1 : o[1] && (r === "" || r === te(n)) && (r = !0));
	}
	return r;
}
function ei(e, r, i = !1) {
	let a = r.propsCache, o = a.get(e);
	if (o) return o;
	let c = e.props, l = {}, f = [];
	if (!c) return v(e) && a.set(e, n), n;
	if (d(c)) for (let e = 0; e < c.length; e++) {
		let n = O(c[e]);
		ti(n) && (l[n] = t);
	}
	else if (c) for (let e in c) {
		let t = O(e);
		if (ti(t)) {
			let n = c[e], r = l[t] = d(n) || h(n) ? { type: n } : s({}, n), i = r.type, a = !1, o = !0;
			if (d(i)) for (let e = 0; e < i.length; ++e) {
				let t = i[e], n = h(t) && t.name;
				if (n === "Boolean") {
					a = !0;
					break;
				}
				n === "String" && (o = !1);
			}
			else a = h(i) && i.name === "Boolean";
			r[0] = a, r[1] = o, (a || u(r, "default")) && f.push(t);
		}
	}
	let p = [l, f];
	return v(e) && a.set(e, p), p;
}
function ti(e) {
	return e[0] !== "$" && !T(e);
}
var ni = (e) => e === "_" || e === "_ctx" || e === "$stable", ri = (e) => d(e) ? e.map(Gi) : [Gi(e)], ii = (e, t, n) => {
	if (t._n) return t;
	let r = Fn((...e) => ri(t(...e)), n);
	return r._c = !1, r;
}, ai = (e, t, n) => {
	let r = e._ctx;
	for (let n in e) {
		if (ni(n)) continue;
		let i = e[n];
		if (h(i)) t[n] = ii(n, i, r);
		else if (i != null) {
			let e = ri(i);
			t[n] = () => e;
		}
	}
}, oi = (e, t) => {
	let n = ri(t);
	e.slots.default = () => n;
}, si = (e, t, n) => {
	for (let r in t) (n || !ni(r)) && (e[r] = t[r]);
}, ci = (e, t, n) => {
	let r = e.slots = Jr();
	if (e.vnode.shapeFlag & 32) {
		let e = t._;
		e ? (si(r, t, n), n && oe(r, "_", e, !0)) : ai(t, r);
	} else t && oi(e, t);
}, li = (e, n, r) => {
	let { vnode: i, slots: a } = e, o = !0, s = t;
	if (i.shapeFlag & 32) {
		let e = n._;
		e ? r && e === 1 ? o = !1 : si(a, n, r) : (o = !n.$stable, ai(n, a)), s = n;
	} else n && (oi(e, n), s = { default: 1 });
	if (o) for (let e in a) !ni(e) && s[e] == null && delete a[e];
}, ui = Si;
function di(e) {
	return fi(e);
}
function fi(e, i) {
	let a = ue();
	a.__VUE__ = !0;
	let { insert: o, remove: s, patchProp: c, createElement: l, createText: u, createComment: d, setText: f, setElementText: p, parentNode: m, nextSibling: h, setScopeId: g = r, insertStaticContent: _ } = e, v = (e, t, r, i = null, a = null, o = null, s = void 0, c = null, l = !!t.dynamicChildren) => {
		if (e === t) return;
		e && !Fi(e, t) && (i = ye(e), me(e, a, o, !0), e = null), t.patchFlag === -2 && (l = !1, t.dynamicChildren = null), t.dynamicChildren && e && e.dynamicChildren && e.dynamicChildren.hasOnce && (t.dynamicChildren === n && (t.dynamicChildren = []), t.dynamicChildren.hasOnce = !0);
		let { type: u, ref: d, shapeFlag: f } = t;
		switch (u) {
			case wi:
				y(e, t, r, i);
				break;
			case Ti:
				b(e, t, r, i);
				break;
			case Ei:
				e ?? x(t, r, i, s);
				break;
			case Ci:
				re(e, t, r, i, a, o, s, c, l);
				break;
			default: f & 1 ? w(e, t, r, i, a, o, s, c, l) : f & 6 ? ie(e, t, r, i, a, o, s, c, l) : (f & 64 || f & 128) && u.process(e, t, r, i, a, o, s, c, l, Se);
		}
		d != null && a ? ur(d, e && e.ref, o, t || e, !t) : d == null && e && e.ref != null && ur(e.ref, null, o, e, !0);
	}, y = (e, t, n, r) => {
		if (e == null) o(t.el = u(t.children), n, r);
		else {
			let n = t.el = e.el;
			t.children !== e.children && f(n, t.children);
		}
	}, b = (e, t, n, r) => {
		e == null ? o(t.el = d(t.children || ""), n, r) : t.el = e.el;
	}, x = (e, t, n, r) => {
		[e.el, e.anchor] = _(e.children, t, n, r, e.el, e.anchor);
	}, S = ({ el: e, anchor: t }, n, r) => {
		let i;
		for (; e && e !== t;) i = h(e), o(e, n, r), e = i;
		o(t, n, r);
	}, C = ({ el: e, anchor: t }) => {
		let n;
		for (; e && e !== t;) n = h(e), s(e), e = n;
		s(t);
	}, w = (e, t, n, r, i, a, o, s, c) => {
		if (t.type === "svg" ? o = "svg" : t.type === "math" && (o = "mathml"), e == null) E(t, n, r, i, a, o, s, c);
		else {
			let n = e.el && e.el._isVueCE ? e.el : null;
			try {
				n && n._beginPatch(), ee(e, t, i, a, o, s, c);
			} finally {
				n && n._endPatch();
			}
		}
	}, E = (e, t, n, r, i, a, s, u) => {
		let d, f, { props: m, shapeFlag: h, transition: g, dirs: _ } = e;
		if (d = e.el = l(e.type, a, m && m.is, m), h & 8 ? p(d, e.children) : h & 16 && O(e.children, d, null, r, i, pi(e, a), s, u), _ && In(e, null, r, "created"), D(d, e, e.scopeId, s, r), m) {
			for (let e in m) e !== "value" && !T(e) && c(d, e, null, m[e], a, r);
			"value" in m && c(d, "value", null, m.value, a), (f = m.onVnodeBeforeMount) && Yi(f, r, e);
		}
		_ && In(e, null, r, "beforeMount");
		let v = hi(i, g);
		v && g.beforeEnter(d), o(d, t, n), ((f = m && m.onVnodeMounted) || v || _) && ui(() => {
			try {
				f && Yi(f, r, e), v && g.enter(d), _ && In(e, null, r, "mounted");
			} finally {}
		}, i);
	}, D = (e, t, n, r, i) => {
		if (n && g(e, n), r) for (let t = 0; t < r.length; t++) g(e, r[t]);
		if (i) {
			let n = i.subTree;
			if (t === n || xi(n.type) && (n.ssContent === t || n.ssFallback === t)) {
				let t = i.vnode;
				D(e, t, t.scopeId, t.slotScopeIds, i.parent);
			}
		}
	}, O = (e, t, n, r, i, a, o, s, c = 0) => {
		for (let l = c; l < e.length; l++) {
			let c = e[l] = s ? Ki(e[l]) : Gi(e[l]);
			v(null, c, t, n, r, i, a, o, s);
		}
	}, ee = (e, n, r, i, a, o, s) => {
		let l = n.el = e.el, { patchFlag: u, dynamicChildren: d, dirs: f } = n;
		u |= e.patchFlag & 16;
		let m = e.props || t, h = n.props || t, g;
		if (r && mi(r, !1), (g = h.onVnodeBeforeUpdate) && Yi(g, r, n, e), f && In(n, e, r, "beforeUpdate"), r && mi(r, !0), d && (!e.dynamicChildren || e.dynamicChildren.length !== d.length) && (u = 0, s = !1, d = null), (m.innerHTML && h.innerHTML == null || m.textContent && h.textContent == null) && p(l, ""), d ? te(e.dynamicChildren, d, l, r, i, pi(n, a), o) : s || k(e, n, l, null, r, i, pi(n, a), o, !1), u > 0) {
			if (u & 16) ne(l, m, h, r, a);
			else if (u & 2 && m.class !== h.class && c(l, "class", null, h.class, a), u & 4 && c(l, "style", m.style, h.style, a), u & 8) {
				let e = n.dynamicProps;
				for (let t = 0; t < e.length; t++) {
					let n = e[t], i = m[n], o = h[n];
					(o !== i || n === "value") && c(l, n, i, o, a, r);
				}
			}
			u & 1 && e.children !== n.children && p(l, n.children);
		} else !s && d == null && ne(l, m, h, r, a);
		((g = h.onVnodeUpdated) || f) && ui(() => {
			g && Yi(g, r, n, e), f && In(n, e, r, "updated");
		}, i);
	}, te = (e, t, n, r, i, a, o) => {
		for (let s = 0; s < t.length; s++) {
			let c = e[s], l = t[s], u = c.el && (c.type === Ci || !Fi(c, l) || c.shapeFlag & 198) ? m(c.el) : n;
			v(c, l, u, null, r, i, a, o, !0);
		}
	}, ne = (e, n, r, i, a) => {
		if (n !== r) {
			if (n !== t) for (let t in n) !T(t) && !(t in r) && c(e, t, n[t], null, a, i);
			for (let t in r) {
				if (T(t)) continue;
				let o = r[t], s = n[t];
				o !== s && t !== "value" && c(e, t, s, o, a, i);
			}
			"value" in r && c(e, "value", n.value, r.value, a);
		}
	}, re = (e, t, n, r, i, a, s, c, l) => {
		let d = t.el = e ? e.el : u(""), f = t.anchor = e ? e.anchor : u(""), { patchFlag: p, dynamicChildren: m, slotScopeIds: h } = t;
		h && (c = c ? c.concat(h) : h), e == null ? (o(d, n, r), o(f, n, r), O(t.children || [], n, f, i, a, s, c, l)) : p > 0 && p & 64 && m && e.dynamicChildren && e.dynamicChildren.length === m.length ? (te(e.dynamicChildren, m, n, i, a, s, c), (t.key != null || i && t === i.subTree) && gi(e, t, !0)) : k(e, t, n, f, i, a, s, c, l);
	}, ie = (e, t, n, r, i, a, o, s, c) => {
		t.slotScopeIds = s, e == null ? t.shapeFlag & 512 ? i.ctx.activate(t, n, r, o, c) : oe(t, n, r, i, a, o, c) : se(e, t, c);
	}, oe = (e, t, n, r, i, a, o) => {
		let s = e.component = Qi(e, r, i);
		if (pr(e) && (s.ctx.renderer = Se), sa(s, !1, o), s.asyncDep) {
			if (i && i.registerDep(s, ce, o), !e.el) {
				let r = s.subTree = zi(Ti);
				b(null, r, t, n), e.placeholder = r.el;
			}
		} else ce(s, e, t, n, i, a, o);
	}, se = (e, t, n) => {
		let r = t.component = e.component;
		if (Ur(e, t, n)) {
			if (r.asyncDep && !r.asyncResolved) {
				t.el = e.el, le(r, t, n);
				return;
			}
			r.next = t, r.update();
		} else t.el = e.el, r.vnode = t;
	}, ce = (e, t, n, r, i, a, o) => {
		let s = () => {
			if (e.isMounted) {
				let { next: t, bu: n, u: r, parent: s, vnode: c } = e;
				{
					let n = vi(e);
					if (n) {
						t && (t.el = c.el, le(e, t, o)), n.asyncDep.then(() => {
							ui(() => {
								e.isUnmounted || l();
							}, i);
						});
						return;
					}
				}
				let u = t, d;
				mi(e, !1), t ? (t.el = c.el, le(e, t, o)) : t = c, n && ae(n), (d = t.props && t.props.onVnodeBeforeUpdate) && Yi(d, s, t, c), mi(e, !0);
				let f = Br(e), p = e.subTree;
				e.subTree = f, v(p, f, m(p.el), ye(p), e, i, a), t.el = f.el, u === null && Kr(e, f.el), r && ui(r, i), (d = t.props && t.props.onVnodeUpdated) && ui(() => Yi(d, s, t, c), i);
			} else {
				let o, { el: s, props: c } = t, { bm: l, m: u, parent: d, root: f, type: p } = e, m = fr(t);
				if (mi(e, !1), l && ae(l), !m && (o = c && c.onVnodeBeforeMount) && Yi(o, d, t), mi(e, !0), s && A) {
					let t = () => {
						e.subTree = Br(e), A(s, e.subTree, e, i, null);
					};
					m && p.__asyncHydrate ? p.__asyncHydrate(s, e, t) : t();
				} else {
					f.ce && f.ce._hasShadowRoot() && f.ce._injectChildStyle(p, e.parent ? e.parent.type : void 0);
					let o = e.subTree = Br(e);
					v(null, o, n, r, e, i, a), t.el = o.el;
				}
				if (u && ui(u, i), !m && (o = c && c.onVnodeMounted)) {
					let e = t;
					ui(() => Yi(o, d, e), i);
				}
				(t.shapeFlag & 256 || d && fr(d.vnode) && d.vnode.shapeFlag & 256) && e.a && ui(e.a, i), e.isMounted = !0, t = n = r = null;
			}
		};
		e.scope.on();
		let c = e.effect = new De(s);
		e.scope.off();
		let l = e.update = c.run.bind(c), u = e.job = c.runIfDirty.bind(c);
		u.i = e, u.id = e.uid, c.scheduler = () => Tn(u), mi(e, !0), l();
	}, le = (e, t, n) => {
		t.component = e;
		let r = e.vnode.props;
		e.vnode = t, e.next = null, Zr(e, t.props, r, n), li(e, t.children, n), He(), On(e), Ue();
	}, k = (e, t, n, r, i, a, o, s, c = !1) => {
		let l = e && e.children, u = e ? e.shapeFlag : 0, d = t.children, { patchFlag: f, shapeFlag: m } = t;
		if (f > 0) {
			if (f & 128) {
				fe(l, d, n, r, i, a, o, s, c);
				return;
			}
			if (f & 256) {
				de(l, d, n, r, i, a, o, s, c);
				return;
			}
		}
		m & 8 ? (u & 16 && ve(l, i, a), d !== l && p(n, d)) : u & 16 ? m & 16 ? fe(l, d, n, r, i, a, o, s, c) : ve(l, i, a, !0) : (u & 8 && p(n, ""), m & 16 && O(d, n, r, i, a, o, s, c));
	}, de = (e, t, r, i, a, o, s, c, l) => {
		e ||= n, t ||= n;
		let u = e.length, d = t.length, f = Math.min(u, d), p = 0;
		for (; p < f; p++) {
			let n = t[p] = l ? Ki(t[p]) : Gi(t[p]);
			v(e[p], n, r, null, a, o, s, c, l);
		}
		u > d ? ve(e, a, o, !0, !1, f) : O(t, r, i, a, o, s, c, l, f);
	}, fe = (e, t, r, i, a, o, s, c, l) => {
		let u = 0, d = t.length, f = e.length - 1, p = d - 1;
		for (; u <= f && u <= p;) {
			let n = e[u], i = t[u] = l ? Ki(t[u]) : Gi(t[u]);
			if (Fi(n, i)) v(n, i, r, null, a, o, s, c, l);
			else break;
			u++;
		}
		for (; u <= f && u <= p;) {
			let n = e[f], i = t[p] = l ? Ki(t[p]) : Gi(t[p]);
			if (Fi(n, i)) v(n, i, r, null, a, o, s, c, l);
			else break;
			f--, p--;
		}
		if (u > f) {
			if (u <= p) {
				let e = p + 1, n = e < d ? t[e].el : i;
				for (; u <= p;) v(null, t[u] = l ? Ki(t[u]) : Gi(t[u]), r, n, a, o, s, c, l), u++;
			}
		} else if (u > p) for (; u <= f;) me(e[u], a, o, !0), u++;
		else {
			let m = u, h = u, g = /* @__PURE__ */ new Map();
			for (u = h; u <= p; u++) {
				let e = t[u] = l ? Ki(t[u]) : Gi(t[u]);
				e.key != null && g.set(e.key, u);
			}
			let _, y = 0, b = p - h + 1, x = !1, S = 0, C = Array(b);
			for (u = 0; u < b; u++) C[u] = 0;
			for (u = m; u <= f; u++) {
				let n = e[u];
				if (y >= b) {
					me(n, a, o, !0);
					continue;
				}
				let i;
				if (n.key != null) i = g.get(n.key);
				else for (_ = h; _ <= p; _++) if (C[_ - h] === 0 && Fi(n, t[_])) {
					i = _;
					break;
				}
				i === void 0 ? me(n, a, o, !0) : (C[i - h] = u + 1, i >= S ? S = i : x = !0, v(n, t[i], r, null, a, o, s, c, l), y++);
			}
			let w = x ? _i(C) : n;
			for (_ = w.length - 1, u = b - 1; u >= 0; u--) {
				let e = h + u, n = t[e], f = t[e + 1], p = e + 1 < d ? f.el || bi(f) : i;
				C[u] === 0 ? v(null, n, r, p, a, o, s, c, l) : x && (_ < 0 || u !== w[_] ? pe(n, r, p, 2) : _--);
			}
		}
	}, pe = (e, t, n, r, i = null) => {
		let { el: a, type: c, transition: l, children: u, shapeFlag: d } = e;
		if (d & 6) {
			pe(e.component.subTree, t, n, r);
			return;
		}
		if (d & 128) {
			e.suspense.move(t, n, r);
			return;
		}
		if (d & 64) {
			c.move(e, t, n, Se);
			return;
		}
		if (c === Ci) {
			o(a, t, n);
			for (let e = 0; e < u.length; e++) pe(u[e], t, n, r);
			o(e.anchor, t, n);
			return;
		}
		if (c === Ei) {
			S(e, t, n);
			return;
		}
		if (r !== 2 && d & 1 && l) {
			if (r === 0) l.persisted && !a[Kn] ? o(a, t, n) : (l.beforeEnter(a), o(a, t, n), ui(() => l.enter(a), i));
			else {
				let { leave: r, delayLeave: i, afterLeave: c } = l, u = () => {
					e.ctx.isUnmounted ? s(a) : o(a, t, n);
				}, d = () => {
					let e = a._isLeaving || !!a[Kn];
					a._isLeaving && a[Kn](!0), l.persisted && !e ? u() : r(a, () => {
						u(), c && c();
					});
				};
				i ? i(a, u, d) : d();
			}
		} else o(a, t, n);
	}, me = (e, t, n, r = !1, i = !1) => {
		let { type: a, props: o, ref: s, children: c, dynamicChildren: l, shapeFlag: u, patchFlag: d, dirs: f, cacheIndex: p, memo: m } = e;
		if ((d === -2 || l && l.hasOnce) && (i = !1), s != null && (He(), ur(s, null, n, e, !0), Ue()), p != null && (!e.ctx || e.ctx === t) && (t.renderCache[p] = void 0), u & 256) {
			t.ctx.deactivate(e);
			return;
		}
		let h = u & 1 && f, g = !fr(e), _;
		if (g && (_ = o && o.onVnodeBeforeUnmount) && Yi(_, t, e), u & 6) _e(e.component, n, r);
		else {
			if (u & 128) {
				e.suspense.unmount(n, r);
				return;
			}
			h && In(e, null, t, "beforeUnmount"), u & 64 ? e.type.remove(e, t, n, Se, r) : l && !l.hasOnce && (a !== Ci || d > 0 && d & 64) ? ve(l, t, n, !1, !0) : (a === Ci && d & 384 || !i && u & 16) && ve(c, t, n), r && he(e);
		}
		let v = m != null && p == null;
		(g && (_ = o && o.onVnodeUnmounted) || h || v) && ui(() => {
			_ && Yi(_, t, e), h && In(e, null, t, "unmounted"), v && (e.el = null);
		}, n);
	}, he = (e) => {
		let { type: t, el: n, anchor: r, transition: i } = e;
		if (t === Ci) {
			ge(n, r);
			return;
		}
		if (t === Ei) {
			C(e), i && !i.persisted && i.afterLeave && i.afterLeave();
			return;
		}
		let a = () => {
			s(n), i && !i.persisted && i.afterLeave && i.afterLeave();
		};
		if (e.shapeFlag & 1 && i && !i.persisted) {
			let { leave: t, delayLeave: r } = i, o = () => t(n, a);
			r ? r(e.el, a, o) : o();
		} else a();
	}, ge = (e, t) => {
		let n;
		for (; e !== t;) n = h(e), s(e), e = n;
		s(t);
	}, _e = (e, t, n) => {
		let { bum: r, scope: i, job: a, subTree: o, um: s, m: c, a: l } = e;
		yi(c), yi(l), r && ae(r), i.stop(), a ? (a.flags |= 8, me(o, e, t, n)) : e.vnode.el && o && (o.transition = e.vnode.transition, me(o, e, t, n)), s && ui(s, t), ui(() => {
			e.isUnmounted = !0;
		}, t);
	}, ve = (e, t, n, r = !1, i = !1, a = 0) => {
		for (let o = a; o < e.length; o++) me(e[o], t, n, r, i);
	}, ye = (e) => {
		if (e.shapeFlag & 6) return ye(e.component.subTree);
		if (e.shapeFlag & 128) return e.suspense.next();
		let t = h(e.anchor || e.el), n = t && t[Wn];
		return n ? h(n) : t;
	}, be = !1, xe = (e, t, n) => {
		let r;
		e == null ? t._vnode && (me(t._vnode, null, null, !0), r = t._vnode.component) : v(t._vnode || null, e, t, null, null, null, n), t._vnode = e, be ||= (be = !0, On(r), kn(), !1);
	}, Se = {
		p: v,
		um: me,
		m: pe,
		r: he,
		mt: oe,
		mc: O,
		pc: k,
		pbc: te,
		n: ye,
		o: e
	}, Ce, A;
	return i && ([Ce, A] = i(Se)), {
		render: xe,
		hydrate: Ce,
		createApp: Pr(xe, Ce)
	};
}
function pi({ type: e, props: t }, n) {
	return n === "svg" && e === "foreignObject" || n === "mathml" && e === "annotation-xml" && t && t.encoding && t.encoding.includes("html") ? void 0 : n;
}
function mi({ effect: e, job: t }, n) {
	n ? (e.flags |= 32, t.flags |= 4) : (e.flags &= -33, t.flags &= -5);
}
function hi(e, t) {
	return (!e || e && !e.pendingBranch) && t && !t.persisted;
}
function gi(e, t, n = !1) {
	let r = e.children, i = t.children;
	if (d(r) && d(i)) for (let e = 0; e < r.length; e++) {
		let t = r[e], a = i[e];
		a.shapeFlag & 1 && !a.dynamicChildren && ((a.patchFlag <= 0 || a.patchFlag === 32) && (a = i[e] = Ki(i[e]), a.el = t.el), !n && a.patchFlag !== -2 && gi(t, a)), a.type === wi && (a.patchFlag === -1 && (a = i[e] = Ki(a)), a.el = t.el), a.type === Ti && !a.el && (a.el = t.el);
	}
}
function _i(e) {
	let t = e.slice(), n = [0], r, i, a, o, s, c = e.length;
	for (r = 0; r < c; r++) {
		let c = e[r];
		if (c !== 0) {
			if (i = n[n.length - 1], e[i] < c) {
				t[r] = i, n.push(r);
				continue;
			}
			for (a = 0, o = n.length - 1; a < o;) s = a + o >> 1, e[n[s]] < c ? a = s + 1 : o = s;
			c < e[n[a]] && (a > 0 && (t[r] = n[a - 1]), n[a] = r);
		}
	}
	for (a = n.length, o = n[a - 1]; a-- > 0;) n[a] = o, o = t[o];
	return n;
}
function vi(e) {
	let t = e.subTree.component;
	if (t) return t.asyncDep && !t.asyncResolved ? t : vi(t);
}
function yi(e) {
	if (e) for (let t = 0; t < e.length; t++) e[t].flags |= 8;
}
function bi(e) {
	if (e.placeholder) return e.placeholder;
	let t = e.component;
	return t ? bi(t.subTree) : null;
}
var xi = (e) => e.__isSuspense;
function Si(e, t) {
	t && t.pendingBranch ? d(e) ? t.effects.push(...e) : t.effects.push(e) : Dn(e);
}
var Ci = /* @__PURE__ */ Symbol.for("v-fgt"), wi = /* @__PURE__ */ Symbol.for("v-txt"), Ti = /* @__PURE__ */ Symbol.for("v-cmt"), Ei = /* @__PURE__ */ Symbol.for("v-stc"), Di = [], Oi = null;
function F(e = !1) {
	Di.push(Oi = e ? null : []);
}
function ki() {
	Di.pop(), Oi = Di[Di.length - 1] || null;
}
var Ai = 1;
function ji(e, t = !1) {
	Ai += e, e < 0 && Oi && t && (Oi.hasOnce = !0);
}
function Mi(e) {
	return e.dynamicChildren = Ai > 0 ? Oi || n : null, ki(), Ai > 0 && Oi && Oi.push(e), e;
}
function I(e, t, n, r, i, a) {
	return Mi(Ri(e, t, n, r, i, a, !0));
}
function Ni(e, t, n, r, i) {
	return Mi(zi(e, t, n, r, i, !0));
}
function Pi(e) {
	return e ? e.__v_isVNode === !0 : !1;
}
function Fi(e, t) {
	return e.type === t.type && e.key === t.key;
}
var Ii = ({ key: e }) => e ?? null, Li = ({ ref: e, ref_key: t, ref_for: n }) => (typeof e == "number" && (e = "" + e), e == null ? null : g(e) || /* @__PURE__ */ Kt(e) || h(e) ? {
	i: Mn,
	r: e,
	k: t,
	f: !!n
} : e);
function Ri(e, t = null, n = null, r = 0, i = null, a = e === Ci ? 0 : 1, o = !1, s = !1) {
	let c = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e,
		props: t,
		key: t && Ii(t),
		ref: t && Li(t),
		scopeId: Nn,
		slotScopeIds: null,
		children: n,
		component: null,
		suspense: null,
		ssContent: null,
		ssFallback: null,
		dirs: null,
		transition: null,
		el: null,
		anchor: null,
		target: null,
		targetStart: null,
		targetAnchor: null,
		staticCount: 0,
		shapeFlag: a,
		patchFlag: r,
		dynamicProps: i,
		dynamicChildren: null,
		appContext: null,
		ctx: Mn
	};
	return s ? (qi(c, n), a & 128 && e.normalize(c)) : n && (c.shapeFlag |= g(n) ? 8 : 16), Ai > 0 && !o && Oi && (c.patchFlag > 0 || a & 6) && c.patchFlag !== 32 && Oi.push(c), c;
}
var zi = Bi;
function Bi(e, t = null, n = null, r = 0, i = null, a = !1) {
	if ((!e || e === Tr) && (e = Ti), Pi(e)) {
		let r = Hi(e, t, !0);
		return n && qi(r, n), Ai > 0 && !a && Oi && (r.shapeFlag & 6 ? Oi[Oi.indexOf(e)] = r : Oi.push(r)), r.patchFlag = -2, r;
	}
	if (ma(e) && (e = e.__vccOpts), t) {
		t = Vi(t);
		let { class: e, style: n } = t;
		e && !g(e) && (t.class = he(e)), v(n) && (/* @__PURE__ */ Ht(n) && !d(n) && (n = s({}, n)), t.style = k(n));
	}
	let o = g(e) ? 1 : xi(e) ? 128 : Gn(e) ? 64 : v(e) ? 4 : h(e) ? 2 : 0;
	return Ri(e, t, n, r, i, o, a, !0);
}
function Vi(e) {
	return e ? /* @__PURE__ */ Ht(e) || Yr(e) ? s({}, e) : e : null;
}
function Hi(e, t, n = !1, r = !1) {
	let { props: i, ref: a, patchFlag: o, children: s, transition: c } = e, l = t ? Ji(i || {}, t) : i, u = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e.type,
		props: l,
		key: l && Ii(l),
		ref: t && t.ref ? n && a ? d(a) ? a.concat(Li(t)) : [a, Li(t)] : Li(t) : a,
		scopeId: e.scopeId,
		slotScopeIds: e.slotScopeIds,
		children: s,
		target: e.target,
		targetStart: e.targetStart,
		targetAnchor: e.targetAnchor,
		staticCount: e.staticCount,
		shapeFlag: e.shapeFlag,
		patchFlag: t && e.type !== Ci ? o === -1 ? 16 : o | 16 : o,
		dynamicProps: e.dynamicProps,
		dynamicChildren: e.dynamicChildren,
		appContext: e.appContext,
		dirs: e.dirs,
		transition: c,
		component: e.component,
		suspense: e.suspense,
		ssContent: e.ssContent && Hi(e.ssContent),
		ssFallback: e.ssFallback && Hi(e.ssFallback),
		placeholder: e.placeholder,
		el: e.el,
		anchor: e.anchor,
		ctx: e.ctx,
		ce: e.ce,
		cacheIndex: e.cacheIndex
	};
	return c && r && ar(u, c.clone(u)), u;
}
function Ui(e = " ", t = 0) {
	return zi(wi, null, e, t);
}
function Wi(e = "", t = !1) {
	return t ? (F(), Ni(Ti, null, e)) : zi(Ti, null, e);
}
function Gi(e) {
	return e == null || typeof e == "boolean" ? zi(Ti) : d(e) ? zi(Ci, null, e.slice()) : Pi(e) ? Ki(e) : zi(wi, null, String(e));
}
function Ki(e) {
	return e.el === null && e.patchFlag !== -1 || e.memo ? e : Hi(e);
}
function qi(e, t) {
	let n = 0, { shapeFlag: r } = e;
	if (t == null) t = null;
	else if (d(t)) n = 16;
	else if (typeof t == "object") {
		if (r & 65) {
			let n = t.default;
			n && (n._c && (n._d = !1), qi(e, n()), n._c && (n._d = !0));
			return;
		}
		{
			n = 32;
			let r = t._;
			!r && !Yr(t) ? t._ctx = Mn : r === 3 && Mn && (Mn.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
		}
	} else if (h(t)) {
		if (r & 65) {
			qi(e, { default: t });
			return;
		}
		t = {
			default: t,
			_ctx: Mn
		}, n = 32;
	} else t = String(t), r & 64 ? (n = 16, t = [Ui(t)]) : n = 8;
	e.children = t, e.shapeFlag |= n;
}
function Ji(...e) {
	let t = {};
	for (let n = 0; n < e.length; n++) {
		let r = e[n];
		for (let e in r) if (e === "class") t.class !== r.class && (t.class = he([t.class, r.class]));
		else if (e === "style") t.style = k([t.style, r.style]);
		else if (a(e)) {
			let n = t[e], i = r[e];
			i && n !== i && !(d(n) && n.includes(i)) ? t[e] = n ? [].concat(n, i) : i : i == null && n == null && !o(e) && (t[e] = i);
		} else e !== "" && (t[e] = r[e]);
	}
	return t;
}
function Yi(e, t, n, r = null) {
	pn(e, t, 7, [n, r]);
}
var Xi = Mr(), Zi = 0;
function Qi(e, n, r) {
	let i = e.type, a = (n ? n.appContext : e.appContext) || Xi, o = {
		uid: Zi++,
		vnode: e,
		type: i,
		parent: n,
		appContext: a,
		root: null,
		next: null,
		subTree: null,
		effect: null,
		update: null,
		job: null,
		scope: new we(!0),
		render: null,
		proxy: null,
		exposed: null,
		exposeProxy: null,
		withProxy: null,
		provides: n ? n.provides : Object.create(a.provides),
		ids: n ? n.ids : [
			"",
			0,
			0
		],
		accessCache: null,
		renderCache: [],
		components: null,
		directives: null,
		propsOptions: ei(i, a),
		emitsOptions: Rr(i, a),
		emit: null,
		emitted: null,
		propsDefaults: t,
		inheritAttrs: i.inheritAttrs,
		ctx: t,
		data: t,
		props: t,
		attrs: t,
		slots: t,
		refs: t,
		setupState: t,
		setupContext: null,
		suspense: r,
		suspenseId: r ? r.pendingId : 0,
		asyncDep: null,
		asyncResolved: !1,
		isMounted: !1,
		isUnmounted: !1,
		isDeactivated: !1,
		bc: null,
		c: null,
		bm: null,
		m: null,
		bu: null,
		u: null,
		um: null,
		bum: null,
		da: null,
		a: null,
		rtg: null,
		rtc: null,
		ec: null,
		sp: null
	};
	return o.ctx = { _: o }, o.root = n ? n.root : o, o.emit = Lr.bind(null, o), e.ce && e.ce(o), o;
}
var $i = null, ea = () => $i || Mn, ta, na;
{
	let e = ue(), t = (t, n) => {
		let r;
		return (r = e[t]) || (r = e[t] = []), r.push(n), (e) => {
			r.length > 1 ? r.forEach((t) => t(e)) : r[0](e);
		};
	};
	ta = t("__VUE_INSTANCE_SETTERS__", (e) => $i = e), na = t("__VUE_SSR_SETTERS__", (e) => oa = e);
}
var ra = (e) => {
	let t = $i;
	return ta(e), e.scope.on(), () => {
		e.scope.off(), ta(t);
	};
}, ia = () => {
	$i && $i.scope.off(), ta(null);
};
function aa(e) {
	return e.vnode.shapeFlag & 4;
}
var oa = !1;
function sa(e, t = !1, n = !1) {
	t && na(t);
	let { props: r, children: i } = e.vnode, a = aa(e);
	Xr(e, r, a, t), ci(e, i, n || t);
	let o = a ? ca(e, t) : void 0;
	return t && na(!1), o;
}
function ca(e, t) {
	let n = e.type;
	e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = new Proxy(e.ctx, jr);
	let { setup: r } = n;
	if (r) {
		He();
		let n = e.setupContext = r.length > 1 ? fa(e) : null, i = ra(e), a = fn(r, e, 0, [e.props, n]), o = y(a);
		if (Ue(), i(), (o || e.sp) && !fr(e) && sr(e), o) {
			if (a.then(ia, ia), t) return a.then((n) => {
				na(!0);
				try {
					la(e, n, t);
				} finally {
					na(!1);
				}
			}).catch((t) => {
				mn(t, e, 0);
			});
			e.asyncDep = a;
		} else la(e, a, t);
	} else ua(e, t);
}
function la(e, t, n) {
	h(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : v(t) && (e.setupState = Qt(t)), ua(e, n);
}
function ua(e, t, n) {
	let i = e.type;
	e.render ||= i.render || r;
}
var da = { get(e, t) {
	return $e(e, "get", ""), e[t];
} };
function fa(e) {
	return {
		attrs: new Proxy(e.attrs, da),
		slots: e.slots,
		emit: e.emit,
		expose: (t) => {
			e.exposed = t || {};
		}
	};
}
function pa(e) {
	return e.exposed ? e.exposeProxy ||= new Proxy(Qt(Ut(e.exposed)), {
		get(t, n) {
			if (n in t) return t[n];
			if (n in kr) return kr[n](e);
		},
		has(e, t) {
			return t in e || t in kr;
		}
	}) : e.proxy;
}
function ma(e) {
	return h(e) && "__vccOpts" in e;
}
var L = (e, t) => /* @__PURE__ */ an(e, t, oa);
function R(e, t, n) {
	try {
		ji(-1);
		let r = arguments.length;
		return r === 2 ? v(t) && !d(t) ? Pi(t) ? zi(e, null, [t]) : zi(e, t) : zi(e, null, t) : (r > 3 ? n = Array.prototype.slice.call(arguments, 2) : r === 3 && Pi(n) && (n = [n]), zi(e, t, n));
	} finally {
		ji(1);
	}
}
var ha = "3.5.43", ga = void 0, _a = typeof window < "u" && window.trustedTypes;
if (_a) try {
	ga = /* @__PURE__ */ _a.createPolicy("vue", { createHTML: (e) => e });
} catch {}
var va = ga ? (e) => ga.createHTML(e) : (e) => e, ya = "http://www.w3.org/2000/svg", ba = "http://www.w3.org/1998/Math/MathML", xa = typeof document < "u" ? document : null, Sa = xa && /* @__PURE__ */ xa.createElement("template"), Ca = {
	insert: (e, t, n) => {
		t.insertBefore(e, n || null);
	},
	remove: (e) => {
		let t = e.parentNode;
		t && t.removeChild(e);
	},
	createElement: (e, t, n, r) => {
		let i = t === "svg" ? xa.createElementNS(ya, e) : t === "mathml" ? xa.createElementNS(ba, e) : n ? xa.createElement(e, { is: n }) : xa.createElement(e);
		return e === "select" && r && r.multiple != null && i.setAttribute("multiple", r.multiple), i;
	},
	createText: (e) => xa.createTextNode(e),
	createComment: (e) => xa.createComment(e),
	setText: (e, t) => {
		e.nodeValue = t;
	},
	setElementText: (e, t) => {
		e.textContent = t;
	},
	parentNode: (e) => e.parentNode,
	nextSibling: (e) => e.nextSibling,
	querySelector: (e) => xa.querySelector(e),
	setScopeId(e, t) {
		e.setAttribute(t, "");
	},
	insertStaticContent(e, t, n, r, i, a) {
		let o = n ? n.previousSibling : t.lastChild;
		if (i && (i === a || i.nextSibling)) for (; t.insertBefore(i.cloneNode(!0), n), i !== a && (i = i.nextSibling););
		else {
			Sa.innerHTML = va(r === "svg" ? `<svg>${e}</svg>` : r === "mathml" ? `<math>${e}</math>` : e);
			let i = Sa.content;
			if (r === "svg" || r === "mathml") {
				let e = i.firstChild;
				for (; e.firstChild;) i.appendChild(e.firstChild);
				i.removeChild(e);
			}
			t.insertBefore(i, n);
		}
		return [o ? o.nextSibling : t.firstChild, n ? n.previousSibling : t.lastChild];
	}
}, wa = "transition", Ta = "animation", Ea = /* @__PURE__ */ Symbol("_vtc"), Da = {
	name: String,
	type: String,
	css: {
		type: Boolean,
		default: !0
	},
	duration: [
		String,
		Number,
		Object
	],
	enterFromClass: String,
	enterActiveClass: String,
	enterToClass: String,
	appearFromClass: String,
	appearActiveClass: String,
	appearToClass: String,
	leaveFromClass: String,
	leaveActiveClass: String,
	leaveToClass: String
}, Oa = /* @__PURE__ */ s({}, Xn, Da), ka = /* @__PURE__ */ ((e) => (e.displayName = "Transition", e.props = Oa, e))((e, { slots: t }) => R(er, Ma(e), t)), Aa = (e, t = []) => {
	d(e) ? e.forEach((e) => e(...t)) : e && e(...t);
}, ja = (e) => e ? d(e) ? e.some((e) => e.length > 1) : e.length > 1 : !1;
function Ma(e) {
	let t = {};
	for (let n in e) n in Da || (t[n] = e[n]);
	if (e.css === !1) return t;
	let { name: n = "v", type: r, duration: i, enterFromClass: a = `${n}-enter-from`, enterActiveClass: o = `${n}-enter-active`, enterToClass: c = `${n}-enter-to`, appearFromClass: l = a, appearActiveClass: u = o, appearToClass: d = c, leaveFromClass: f = `${n}-leave-from`, leaveActiveClass: p = `${n}-leave-active`, leaveToClass: m = `${n}-leave-to` } = e, h = Na(i), g = h && h[0], _ = h && h[1], { onBeforeEnter: v, onEnter: y, onEnterCancelled: b, onLeave: x, onLeaveCancelled: S, onBeforeAppear: C = v, onAppear: w = y, onAppearCancelled: T = b } = t, E = (e, t, n, r) => {
		e._enterCancelled = r, Ia(e, t ? d : c), Ia(e, t ? u : o), n && n();
	}, D = (e, t) => {
		e._isLeaving = !1, Ia(e, f), Ia(e, m), Ia(e, p), t && t();
	}, O = (e) => (t, n) => {
		let i = e ? w : y, o = () => E(t, e, n);
		Aa(i, [t, o]), La(() => {
			Ia(t, e ? l : a), Fa(t, e ? d : c), ja(i) || za(t, r, g, o);
		});
	};
	return s(t, {
		onBeforeEnter(e) {
			Aa(v, [e]), Fa(e, a), Fa(e, o);
		},
		onBeforeAppear(e) {
			Aa(C, [e]), Fa(e, l), Fa(e, u);
		},
		onEnter: O(!1),
		onAppear: O(!0),
		onLeave(e, t) {
			e._isLeaving = !0;
			let n = () => D(e, t);
			Fa(e, f), e._enterCancelled ? (Fa(e, p), Ua(e)) : (Ua(e), Fa(e, p)), La(() => {
				e._isLeaving && (Ia(e, f), Fa(e, m), ja(x) || za(e, r, _, n));
			}), Aa(x, [e, n]);
		},
		onEnterCancelled(e) {
			E(e, !1, void 0, !0), Aa(b, [e]);
		},
		onAppearCancelled(e) {
			E(e, !0, void 0, !0), Aa(T, [e]);
		},
		onLeaveCancelled(e) {
			D(e), Aa(S, [e]);
		}
	});
}
function Na(e) {
	if (e == null) return null;
	if (v(e)) return [Pa(e.enter), Pa(e.leave)];
	{
		let t = Pa(e);
		return [t, t];
	}
}
function Pa(e) {
	return ce(e);
}
function Fa(e, t) {
	t.split(/\s+/).forEach((t) => t && e.classList.add(t)), (e[Ea] || (e[Ea] = /* @__PURE__ */ new Set())).add(t);
}
function Ia(e, t) {
	t.split(/\s+/).forEach((t) => t && e.classList.remove(t));
	let n = e[Ea];
	n && (n.delete(t), n.size || (e[Ea] = void 0));
}
function La(e) {
	requestAnimationFrame(() => {
		requestAnimationFrame(e);
	});
}
var Ra = 0;
function za(e, t, n, r) {
	let i = e._endId = ++Ra, a = () => {
		i === e._endId && r();
	};
	if (n != null) return setTimeout(a, n);
	let { type: o, timeout: s, propCount: c } = Ba(e, t);
	if (!o) return r();
	let l = o + "end", u = 0, d = () => {
		e.removeEventListener(l, f), a();
	}, f = (t) => {
		t.target === e && ++u >= c && d();
	};
	setTimeout(() => {
		u < c && d();
	}, s + 1), e.addEventListener(l, f);
}
function Ba(e, t) {
	let n = window.getComputedStyle(e), r = (e) => (n[e] || "").split(", "), i = r(`${wa}Delay`), a = r(`${wa}Duration`), o = Va(i, a), s = r(`${Ta}Delay`), c = r(`${Ta}Duration`), l = Va(s, c), u = null, d = 0, f = 0;
	t === wa ? o > 0 && (u = wa, d = o, f = a.length) : t === Ta ? l > 0 && (u = Ta, d = l, f = c.length) : (d = Math.max(o, l), u = d > 0 ? o > l ? wa : Ta : null, f = u ? u === wa ? a.length : c.length : 0);
	let p = u === wa && /\b(?:transform|all)(?:,|$)/.test(r(`${wa}Property`).toString());
	return {
		type: u,
		timeout: d,
		propCount: f,
		hasTransform: p
	};
}
function Va(e, t) {
	for (; e.length < t.length;) e = e.concat(e);
	return Math.max(...t.map((t, n) => Ha(t) + Ha(e[n])));
}
function Ha(e) {
	return e === "auto" ? 0 : Number(e.slice(0, -1).replace(",", ".")) * 1e3;
}
function Ua(e) {
	return (e ? e.ownerDocument : document).body.offsetHeight;
}
function Wa(e, t, n) {
	let r = e[Ea];
	r && (t = (t ? [t, ...r] : [...r]).join(" ")), t == null ? e.removeAttribute("class") : n ? e.setAttribute("class", t) : e.className = t;
}
var Ga = /* @__PURE__ */ Symbol("_vod"), Ka = /* @__PURE__ */ Symbol("_vsh"), qa = /* @__PURE__ */ Symbol(""), Ja = /(?:^|;)\s*display\s*:/;
function Ya(e, t, n) {
	let r = e.style, i = g(n), a = !1;
	if (n && !i) {
		if (t) {
			if (g(t)) for (let e of t.split(";")) {
				let t = e.slice(0, e.indexOf(":")).trim();
				n[t] ?? Za(r, t, "");
			}
			else for (let e in t) n[e] ?? Za(r, e, "");
		}
		for (let i in n) {
			i === "display" && (a = !0);
			let o = n[i];
			o == null ? Za(r, i, "") : to(e, i, !g(t) && t ? t[i] : void 0, o) || Za(r, i, o);
		}
	} else if (i) {
		if (t !== n) {
			let e = r[qa];
			e && (n += ";" + e), r.cssText = n, a = Ja.test(n);
		}
	} else t && e.removeAttribute("style");
	Ga in e && (e[Ga] = a ? r.display : "", e[Ka] && (r.display = "none"));
}
var Xa = /\s*!important$/;
function Za(e, t, n) {
	if (d(n)) n.forEach((n) => Za(e, t, n));
	else if (n ??= "", t.startsWith("--")) Xa.test(n) ? e.setProperty(t, n.replace(Xa, ""), "important") : e.setProperty(t, n);
	else {
		let r = eo(e, t);
		Xa.test(n) ? e.setProperty(te(r), n.replace(Xa, ""), "important") : e[r] = n;
	}
}
var Qa = [
	"Webkit",
	"Moz",
	"ms"
], $a = {};
function eo(e, t) {
	let n = $a[t];
	if (n) return n;
	let r = O(t);
	if (r !== "filter" && r in e) return $a[t] = r;
	r = ne(r);
	for (let n = 0; n < Qa.length; n++) {
		let i = Qa[n] + r;
		if (i in e) return $a[t] = i;
	}
	return t;
}
function to(e, t, n, r) {
	return e.tagName === "TEXTAREA" && (t === "width" || t === "height") && g(r) && n === r;
}
var no = "http://www.w3.org/1999/xlink";
function ro(e, t, n, r, i, a = _e(t)) {
	r && t.startsWith("xlink:") ? n == null ? e.removeAttributeNS(no, t.slice(6, t.length)) : e.setAttributeNS(no, t, n) : n == null || a && !ve(n) ? e.removeAttribute(t) : e.setAttribute(t, a ? "" : _(n) ? String(n) : n);
}
function io(e, t, n, r, i) {
	if (t === "innerHTML" || t === "textContent") {
		n != null && (e[t] = t === "innerHTML" ? va(n) : n);
		return;
	}
	let a = e.tagName;
	if (t === "value" && a !== "PROGRESS" && !a.includes("-")) {
		let r = a === "OPTION" ? e.getAttribute("value") || "" : e.value, i = n == null ? e.type === "checkbox" ? "on" : "" : String(n);
		(r !== i || !("_value" in e)) && (e.value = i), n ?? e.removeAttribute(t), e._value = n;
		return;
	}
	let o = !1;
	if (n === "" || n == null) {
		let r = typeof e[t];
		r === "boolean" ? n = ve(n) : n == null && r === "string" ? (n = "", o = !0) : r === "number" && (n = 0, o = !0);
	}
	try {
		e[t] = n;
	} catch {}
	o && e.removeAttribute(i || t);
}
function ao(e, t, n, r) {
	e.addEventListener(t, n, r);
}
function oo(e, t, n, r) {
	e.removeEventListener(t, n, r);
}
var so = /* @__PURE__ */ Symbol("_vei");
function co(e, t, n, r, i = null) {
	let a = e[so] || (e[so] = {}), o = a[t];
	if (r && o) o.value = r;
	else {
		let [n, s] = fo(t);
		r ? ao(e, n, a[t] = go(r, i), s) : o && (oo(e, n, o, s), a[t] = void 0);
	}
}
var lo = /(Once|Passive|Capture)$/, uo = /^on:?(?:Once|Passive|Capture)$/;
function fo(e) {
	let t, n;
	for (; (n = e.match(lo)) && !uo.test(e);) t ||= {}, e = e.slice(0, e.length - n[1].length), t[n[1].toLowerCase()] = !0;
	return [e[2] === ":" ? e.slice(3) : te(e.slice(2)), t];
}
var po = 0, mo = /* @__PURE__ */ Promise.resolve(), ho = () => po ||= (mo.then(() => po = 0), Date.now());
function go(e, t) {
	let n = (e) => {
		if (!e._vts) e._vts = Date.now();
		else if (e._vts <= n.attached) return;
		let r = n.value;
		if (d(r)) {
			let n = e.stopImmediatePropagation;
			e.stopImmediatePropagation = () => {
				n.call(e), e._stopped = !0;
			};
			let i = r.slice(), a = [e];
			for (let n = 0; n < i.length && !e._stopped; n++) {
				let e = i[n];
				e && pn(e, t, 5, a);
			}
		} else pn(r, t, 5, [e]);
	};
	return n.value = e, n.attached = ho(), n;
}
var _o = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123, vo = (e, t, n, r, i, s) => {
	let c = i === "svg";
	t === "class" ? Wa(e, r, c) : t === "style" ? Ya(e, n, r) : a(t) ? o(t) || co(e, t, n, r, s) : (t[0] === "." ? (t = t.slice(1), 1) : t[0] === "^" ? (t = t.slice(1), 0) : yo(e, t, r, c)) ? (io(e, t, r), !e.tagName.includes("-") && (t === "value" || t === "checked" || t === "selected") && ro(e, t, r, c, s, t !== "value")) : e._isVueCE && (bo(e, t) || e._def.__asyncLoader && (/[A-Z]/.test(t) || !g(r))) ? io(e, O(t), r, s, t) : (t === "true-value" ? e._trueValue = r : t === "false-value" && (e._falseValue = r), ro(e, t, r, c));
};
function yo(e, t, n, r) {
	if (r) return !!(t === "innerHTML" || t === "textContent" || t in e && _o(t) && h(n));
	if (t === "spellcheck" || t === "draggable" || t === "translate" || t === "autocorrect" || t === "sandbox" && e.tagName === "IFRAME" || t === "form" || t === "list" && e.tagName === "INPUT" || t === "type" && e.tagName === "TEXTAREA") return !1;
	if (t === "width" || t === "height") {
		let t = e.tagName;
		if (t === "IMG" || t === "VIDEO" || t === "CANVAS" || t === "SOURCE") return !1;
	}
	return _o(t) && g(n) ? !1 : t in e;
}
function bo(e, t) {
	let n = e._def.props;
	if (!n) return !1;
	let r = O(t);
	return Array.isArray(n) ? n.some((e) => O(e) === r) : Object.keys(n).some((e) => O(e) === r);
}
var xo = /* @__PURE__ */ new WeakMap(), So = /* @__PURE__ */ new WeakMap(), Co = /* @__PURE__ */ Symbol("_moveCb"), wo = /* @__PURE__ */ Symbol("_enterCb"), To = /* @__PURE__ */ ((e) => (delete e.props.mode, e))({
	name: "TransitionGroup",
	props: /* @__PURE__ */ s({}, Oa, {
		tag: String,
		moveClass: String
	}),
	setup(e, { slots: t }) {
		let n = ea(), r = Jn(), i, a;
		return Sr(() => {
			if (!i.length) return;
			let t = e.moveClass || `${e.name || "v"}-move`;
			if (!Ao(i[0].el, n.vnode.el, t)) {
				i = [];
				return;
			}
			i.forEach(Eo), i.forEach(Do);
			let r = i.filter(Oo);
			Ua(n.vnode.el), r.forEach((e) => {
				let n = e.el, r = n.style;
				Fa(n, t), r.transform = r.webkitTransform = r.transitionDuration = "";
				let i = n[Co] = (e) => {
					e && e.target !== n || (!e || e.propertyName.endsWith("transform")) && (n.removeEventListener("transitionend", i), n[Co] = null, Ia(n, t));
				};
				n.addEventListener("transitionend", i);
			}), i = [];
		}), () => {
			let o = /* @__PURE__ */ M(e), s = Ma(o), c = o.tag || Ci;
			if (i = [], a) for (let e = 0; e < a.length; e++) {
				let t = a[e];
				t.el && t.el instanceof Element && !t.el[Ka] && (i.push(t), ar(t, nr(t, s, r, n)), xo.set(t, ko(t.el)));
			}
			a = t.default ? or(t.default()) : [];
			for (let e = 0; e < a.length; e++) {
				let t = a[e];
				t.key != null && ar(t, nr(t, s, r, n));
			}
			return zi(c, null, a);
		};
	}
});
function Eo(e) {
	let t = e.el;
	t[Co] && t[Co](), t[wo] && t[wo]();
}
function Do(e) {
	So.set(e, ko(e.el));
}
function Oo(e) {
	let t = xo.get(e), n = So.get(e), r = t.left - n.left, i = t.top - n.top;
	if (r || i) {
		let t = e.el, n = t.style, a = t.getBoundingClientRect(), o = 1, s = 1;
		return t.offsetWidth && (o = a.width / t.offsetWidth), t.offsetHeight && (s = a.height / t.offsetHeight), (!Number.isFinite(o) || o === 0) && (o = 1), (!Number.isFinite(s) || s === 0) && (s = 1), Math.abs(o - 1) < .01 && (o = 1), Math.abs(s - 1) < .01 && (s = 1), n.transform = n.webkitTransform = `translate(${r / o}px,${i / s}px)`, n.transitionDuration = "0s", e;
	}
}
function ko(e) {
	let t = e.getBoundingClientRect();
	return {
		left: t.left,
		top: t.top
	};
}
function Ao(e, t, n) {
	let r = e.cloneNode(), i = e[Ea];
	i && i.forEach((e) => {
		e.split(/\s+/).forEach((e) => e && r.classList.remove(e));
	}), n.split(/\s+/).forEach((e) => e && r.classList.add(e)), r.style.display = "none";
	let a = t.nodeType === 1 ? t : t.parentNode;
	a.appendChild(r);
	let { hasTransform: o } = Ba(r);
	return a.removeChild(r), o;
}
var jo = /* @__PURE__ */ s({ patchProp: vo }, Ca), Mo;
function No() {
	return Mo ||= di(jo);
}
var Po = ((...e) => {
	let t = No().createApp(...e), { mount: n } = t;
	return t.mount = (e) => {
		let r = Io(e);
		if (!r) return;
		let i = t._component;
		!h(i) && !i.render && !i.template && (i.template = r.innerHTML), r.nodeType === 1 && (r.textContent = "");
		let a = n(r, !1, Fo(r));
		return r instanceof Element && (r.removeAttribute("v-cloak"), r.setAttribute("data-v-app", "")), a;
	}, t;
});
function Fo(e) {
	if (e instanceof SVGElement) return "svg";
	if (typeof MathMLElement == "function" && e instanceof MathMLElement) return "mathml";
}
function Io(e) {
	return g(e) ? document.querySelector(e) : e;
}
//#endregion
//#region node_modules/@css-render/plugin-bem/esm/index.js
function Lo(e) {
	let t = ".", n = "__", r = "--", i;
	if (e) {
		let i = e.blockPrefix;
		i && (t = i), i = e.elementPrefix, i && (n = i), i = e.modifierPrefix, i && (r = i);
	}
	let a = { install(e) {
		i = e.c;
		let t = e.context;
		t.bem = {}, t.bem.b = null, t.bem.els = null;
	} };
	function o(e) {
		let n, r;
		return {
			before(e) {
				n = e.bem.b, r = e.bem.els, e.bem.els = null;
			},
			after(e) {
				e.bem.b = n, e.bem.els = r;
			},
			$({ context: n, props: r }) {
				return e = typeof e == "string" ? e : e({
					context: n,
					props: r
				}), n.bem.b = e, `${r?.bPrefix || t}${n.bem.b}`;
			}
		};
	}
	function s(e) {
		let r;
		return {
			before(e) {
				r = e.bem.els;
			},
			after(e) {
				e.bem.els = r;
			},
			$({ context: r, props: i }) {
				return e = typeof e == "string" ? e : e({
					context: r,
					props: i
				}), r.bem.els = e.split(",").map((e) => e.trim()), r.bem.els.map((e) => `${i?.bPrefix || t}${r.bem.b}${n}${e}`).join(", ");
			}
		};
	}
	function c(e) {
		return { $({ context: i, props: a }) {
			e = typeof e == "string" ? e : e({
				context: i,
				props: a
			});
			let o = e.split(",").map((e) => e.trim());
			function s(e) {
				return o.map((o) => `&${a?.bPrefix || t}${i.bem.b}${e === void 0 ? "" : `${n}${e}`}${r}${o}`).join(", ");
			}
			let c = i.bem.els;
			return c === null ? s() : s(c[0]);
		} };
	}
	function l(e) {
		return { $({ context: i, props: a }) {
			e = typeof e == "string" ? e : e({
				context: i,
				props: a
			});
			let o = i.bem.els;
			return `&:not(${a?.bPrefix || t}${i.bem.b}${o !== null && o.length > 0 ? `${n}${o[0]}` : ""}${r}${e})`;
		} };
	}
	return Object.assign(a, {
		cB: ((...e) => i(o(e[0]), e[1], e[2])),
		cE: ((...e) => i(s(e[0]), e[1], e[2])),
		cM: ((...e) => i(c(e[0]), e[1], e[2])),
		cNotM: ((...e) => i(l(e[0]), e[1], e[2]))
	}), a;
}
//#endregion
//#region node_modules/css-render/esm/parse.js
function Ro(e) {
	let t = 0;
	for (let n = 0; n < e.length; ++n) e[n] === "&" && ++t;
	return t;
}
var zo = /\s*,(?![^(]*\))\s*/g, Bo = /\s+/g;
function Vo(e, t) {
	let n = [];
	return t.split(zo).forEach((t) => {
		let r = Ro(t);
		if (!r) {
			e.forEach((e) => {
				n.push((e && e + " ") + t);
			});
			return;
		}
		if (r === 1) {
			e.forEach((e) => {
				n.push(t.replace("&", e));
			});
			return;
		}
		let i = [t];
		for (; r--;) {
			let t = [];
			i.forEach((n) => {
				e.forEach((e) => {
					t.push(n.replace("&", e));
				});
			}), i = t;
		}
		i.forEach((e) => n.push(e));
	}), n;
}
function Ho(e, t) {
	let n = [];
	return t.split(zo).forEach((t) => {
		e.forEach((e) => {
			n.push((e && e + " ") + t);
		});
	}), n;
}
function Uo(e) {
	let t = [""];
	return e.forEach((e) => {
		e &&= e.trim(), e && (t = e.includes("&") ? Vo(t, e) : Ho(t, e));
	}), t.join(", ").replace(Bo, " ");
}
//#endregion
//#region node_modules/css-render/esm/utils.js
function Wo(e) {
	/* istanbul ignore if */
	if (!e) return;
	let t = e.parentElement;
	/* istanbul ignore else */
	t && t.removeChild(e);
}
function Go(e, t) {
	return (t ?? document.head).querySelector(`style[cssr-id="${e}"]`);
}
function Ko(e) {
	let t = document.createElement("style");
	return t.setAttribute("cssr-id", e), t;
}
function qo(e) {
	return e ? /^\s*@(s|m)/.test(e) : !1;
}
//#endregion
//#region node_modules/css-render/esm/render.js
var Jo = /[A-Z]/g;
function Yo(e) {
	return e.replace(Jo, (e) => "-" + e.toLowerCase());
}
function Xo(e, t = "  ") {
	return typeof e == "object" && e ? " {\n" + Object.entries(e).map((e) => t + `  ${Yo(e[0])}: ${e[1]};`).join("\n") + "\n" + t + "}" : `: ${e};`;
}
function Zo(e, t, n) {
	return typeof e == "function" ? e({
		context: t.context,
		props: n
	}) : e;
}
function Qo(e, t, n, r) {
	if (!t) return "";
	let i = Zo(t, n, r);
	if (!i) return "";
	if (typeof i == "string") return `${e} {\n${i}\n}`;
	let a = Object.keys(i);
	if (a.length === 0) return n.config.keepEmptyBlock ? e + " {\n}" : "";
	let o = e ? [e + " {"] : [];
	return a.forEach((e) => {
		let t = i[e];
		if (e === "raw") {
			o.push("\n" + t + "\n");
			return;
		}
		e = Yo(e), t != null && o.push(`  ${e}${Xo(t)}`);
	}), e && o.push("}"), o.join("\n");
}
function $o(e, t, n) {
	/* istanbul ignore if */
	e && e.forEach((e) => {
		if (Array.isArray(e)) $o(e, t, n);
		else if (typeof e == "function") {
			let r = e(t);
			Array.isArray(r) ? $o(r, t, n) : r && n(r);
		} else e && n(e);
	});
}
function es(e, t, n, r, i) {
	let a = e.$, o = "";
	if (!a || typeof a == "string") qo(a) ? o = a : t.push(a);
	else if (typeof a == "function") {
		let e = a({
			context: r.context,
			props: i
		});
		qo(e) ? o = e : t.push(e);
	} else if (a.before && a.before(r.context), !a.$ || typeof a.$ == "string") qo(a.$) ? o = a.$ : t.push(a.$);
	else if (a.$) {
		let e = a.$({
			context: r.context,
			props: i
		});
		qo(e) ? o = e : t.push(e);
	}
	let s = Uo(t), c = Qo(s, e.props, r, i);
	o ? n.push(`${o} {`) : c.length && n.push(c), e.children && $o(e.children, {
		context: r.context,
		props: i
	}, (e) => {
		if (typeof e == "string") {
			let t = Qo(s, { raw: e }, r, i);
			n.push(t);
		} else es(e, t, n, r, i);
	}), t.pop(), o && n.push("}"), a && a.after && a.after(r.context);
}
function ts(e, t, n) {
	let r = [];
	return es(e, [], r, t, n), r.join("\n\n");
}
//#endregion
//#region node_modules/@emotion/hash/dist/hash.browser.esm.js
function ns(e) {
	for (var t = 0, n, r = 0, i = e.length; i >= 4; ++r, i -= 4) n = e.charCodeAt(r) & 255 | (e.charCodeAt(++r) & 255) << 8 | (e.charCodeAt(++r) & 255) << 16 | (e.charCodeAt(++r) & 255) << 24, n = (n & 65535) * 1540483477 + ((n >>> 16) * 59797 << 16), n ^= n >>> 24, t = (n & 65535) * 1540483477 + ((n >>> 16) * 59797 << 16) ^ (t & 65535) * 1540483477 + ((t >>> 16) * 59797 << 16);
	switch (i) {
		case 3: t ^= (e.charCodeAt(r + 2) & 255) << 16;
		case 2: t ^= (e.charCodeAt(r + 1) & 255) << 8;
		case 1: t ^= e.charCodeAt(r) & 255, t = (t & 65535) * 1540483477 + ((t >>> 16) * 59797 << 16);
	}
	return t ^= t >>> 13, t = (t & 65535) * 1540483477 + ((t >>> 16) * 59797 << 16), ((t ^ t >>> 15) >>> 0).toString(36);
}
//#endregion
//#region node_modules/css-render/esm/mount.js
typeof window < "u" && (window.__cssrContext = {});
function rs(e, t, n, r) {
	let { els: i } = t;
	if (n === void 0) i.forEach(Wo), t.els = [];
	else {
		let e = Go(n, r);
		e && i.includes(e) && (Wo(e), t.els = i.filter((t) => t !== e));
	}
}
function is(e, t) {
	e.push(t);
}
function as(e, t, n, r, i, a, o, s, c) {
	let l;
	if (n === void 0 && (l = t.render(r), n = ns(l)), c) {
		c.adapter(n, l ?? t.render(r));
		return;
	}
	s === void 0 && (s = document.head);
	let u = Go(n, s);
	if (u !== null && !a) return u;
	let d = u ?? Ko(n);
	if (l === void 0 && (l = t.render(r)), d.textContent = l, u !== null) return u;
	if (o) {
		let e = s.querySelector(`meta[name="${o}"]`);
		if (e) return s.insertBefore(d, e), is(t.els, d), d;
	}
	return i ? s.insertBefore(d, s.querySelector("style, link")) : s.appendChild(d), is(t.els, d), d;
}
//#endregion
//#region node_modules/css-render/esm/c.js
function os(e) {
	return ts(this, this.instance, e);
}
function ss(e = {}) {
	let { id: t, ssr: n, props: r, head: i = !1, force: a = !1, anchorMetaName: o, parent: s } = e;
	return as(this.instance, this, t, r, i, a, o, s, n);
}
function cs(e = {}) {
	/* istanbul ignore next */
	let { id: t, parent: n } = e;
	rs(this.instance, this, t, n);
}
var ls = function(e, t, n, r) {
	return {
		instance: e,
		$: t,
		props: n,
		children: r,
		els: [],
		render: os,
		mount: ss,
		unmount: cs
	};
}, us = function(e, t, n, r) {
	return Array.isArray(t) ? ls(e, { $: null }, null, t) : Array.isArray(n) ? ls(e, t, null, n) : Array.isArray(r) ? ls(e, t, n, r) : ls(e, t, n, null);
};
//#endregion
//#region node_modules/css-render/esm/CssRender.js
function ds(e = {}) {
	let t = {
		c: ((...e) => us(t, ...e)),
		use: (e, ...n) => e.install(t, ...n),
		find: Go,
		context: {},
		config: e
	};
	return t;
}
//#endregion
//#region node_modules/css-render/esm/exists.js
function fs(e, t) {
	if (e === void 0) return !1;
	if (t) {
		let { context: { ids: n } } = t;
		return n.has(e);
	}
	return Go(e) !== null;
}
//#endregion
//#region node_modules/naive-ui/es/_utils/cssr/index.mjs
var ps = ".n-", ms = "__", hs = "--", gs = ds(), _s = Lo({
	blockPrefix: ps,
	elementPrefix: ms,
	modifierPrefix: hs
});
gs.use(_s);
var { c: z, find: vs } = gs, { cB: B, cE: V, cM: H, cNotM: ys } = _s;
function bs(e) {
	return z(({ props: { bPrefix: e } }) => `${e || ps}modal, ${e || ps}drawer`, [e]);
}
function xs(e) {
	return z(({ props: { bPrefix: e } }) => `${e || ps}popover`, [e]);
}
function Ss(e) {
	return z(({ props: { bPrefix: e } }) => `&${e || ps}modal`, e);
}
function U(e, t) {
	return e + (t === "default" ? "" : t.replace(/^[a-z]/, (e) => e.toUpperCase()));
}
//#endregion
//#region node_modules/naive-ui/es/locales/common/enUS.mjs
var Cs = {
	name: "en-US",
	global: {
		undo: "Undo",
		redo: "Redo",
		confirm: "Confirm",
		clear: "Clear"
	},
	Popconfirm: {
		positiveText: "Confirm",
		negativeText: "Cancel"
	},
	Cascader: {
		placeholder: "Please Select",
		loading: "Loading",
		loadingRequiredMessage: (e) => `Please load all ${e}'s descendants before checking it.`
	},
	Time: {
		dateFormat: "yyyy-MM-dd",
		dateTimeFormat: "yyyy-MM-dd HH:mm:ss"
	},
	DatePicker: {
		yearFormat: "yyyy",
		monthFormat: "MMM",
		dayFormat: "eeeeee",
		yearTypeFormat: "yyyy",
		monthTypeFormat: "yyyy-MM",
		dateFormat: "yyyy-MM-dd",
		dateTimeFormat: "yyyy-MM-dd HH:mm:ss",
		quarterFormat: "yyyy-qqq",
		weekFormat: "YYYY-w",
		clear: "Clear",
		now: "Now",
		confirm: "Confirm",
		selectTime: "Select Time",
		selectDate: "Select Date",
		datePlaceholder: "Select Date",
		datetimePlaceholder: "Select Date and Time",
		monthPlaceholder: "Select Month",
		yearPlaceholder: "Select Year",
		quarterPlaceholder: "Select Quarter",
		weekPlaceholder: "Select Week",
		startDatePlaceholder: "Start Date",
		endDatePlaceholder: "End Date",
		startDatetimePlaceholder: "Start Date and Time",
		endDatetimePlaceholder: "End Date and Time",
		startMonthPlaceholder: "Start Month",
		endMonthPlaceholder: "End Month",
		monthBeforeYear: !0,
		firstDayOfWeek: 6,
		today: "Today"
	},
	DataTable: {
		checkTableAll: "Select all in the table",
		uncheckTableAll: "Unselect all in the table",
		confirm: "Confirm",
		clear: "Clear"
	},
	LegacyTransfer: {
		sourceTitle: "Source",
		targetTitle: "Target"
	},
	Transfer: {
		selectAll: "Select all",
		unselectAll: "Unselect all",
		clearAll: "Clear",
		total: (e) => `Total ${e} items`,
		selected: (e) => `${e} items selected`
	},
	Empty: { description: "No Data" },
	Select: { placeholder: "Please Select" },
	TimePicker: {
		placeholder: "Select Time",
		positiveText: "OK",
		negativeText: "Cancel",
		now: "Now",
		clear: "Clear"
	},
	Pagination: {
		goto: "Goto",
		selectionSuffix: "page"
	},
	DynamicTags: { add: "Add" },
	Log: { loading: "Loading" },
	Input: { placeholder: "Please Input" },
	InputNumber: { placeholder: "Please Input" },
	DynamicInput: { create: "Create" },
	ThemeEditor: {
		title: "Theme Editor",
		clearAllVars: "Clear All Variables",
		clearSearch: "Clear Search",
		filterCompName: "Filter Component Name",
		filterVarName: "Filter Variable Name",
		import: "Import",
		export: "Export",
		restore: "Reset to Default"
	},
	Image: {
		tipPrevious: "Previous picture (←)",
		tipNext: "Next picture (→)",
		tipCounterclockwise: "Counterclockwise",
		tipClockwise: "Clockwise",
		tipZoomOut: "Zoom out",
		tipZoomIn: "Zoom in",
		tipDownload: "Download",
		tipClose: "Close (Esc)",
		tipOriginalSize: "Zoom to original size"
	},
	Heatmap: {
		less: "less",
		more: "more",
		monthFormat: "MMM",
		weekdayFormat: "eee"
	}
}, ws = {
	name: "zh-CN",
	global: {
		undo: "撤销",
		redo: "重做",
		confirm: "确认",
		clear: "清除"
	},
	Popconfirm: {
		positiveText: "确认",
		negativeText: "取消"
	},
	Cascader: {
		placeholder: "请选择",
		loading: "加载中",
		loadingRequiredMessage: (e) => `加载全部 ${e} 的子节点后才可选中`
	},
	Time: {
		dateFormat: "yyyy-MM-dd",
		dateTimeFormat: "yyyy-MM-dd HH:mm:ss"
	},
	DatePicker: {
		yearFormat: "yyyy年",
		monthFormat: "MMM",
		dayFormat: "eeeeee",
		yearTypeFormat: "yyyy",
		monthTypeFormat: "yyyy-MM",
		dateFormat: "yyyy-MM-dd",
		dateTimeFormat: "yyyy-MM-dd HH:mm:ss",
		quarterFormat: "yyyy-qqq",
		weekFormat: "YYYY-w周",
		clear: "清除",
		now: "此刻",
		confirm: "确认",
		selectTime: "选择时间",
		selectDate: "选择日期",
		datePlaceholder: "选择日期",
		datetimePlaceholder: "选择日期时间",
		monthPlaceholder: "选择月份",
		yearPlaceholder: "选择年份",
		quarterPlaceholder: "选择季度",
		weekPlaceholder: "选择周",
		startDatePlaceholder: "开始日期",
		endDatePlaceholder: "结束日期",
		startDatetimePlaceholder: "开始日期时间",
		endDatetimePlaceholder: "结束日期时间",
		startMonthPlaceholder: "开始月份",
		endMonthPlaceholder: "结束月份",
		monthBeforeYear: !1,
		firstDayOfWeek: 0,
		today: "今天"
	},
	DataTable: {
		checkTableAll: "选择全部表格数据",
		uncheckTableAll: "取消选择全部表格数据",
		confirm: "确认",
		clear: "重置"
	},
	LegacyTransfer: {
		sourceTitle: "源项",
		targetTitle: "目标项"
	},
	Transfer: {
		selectAll: "全选",
		clearAll: "清除",
		unselectAll: "取消全选",
		total: (e) => `共 ${e} 项`,
		selected: (e) => `已选 ${e} 项`
	},
	Empty: { description: "无数据" },
	Select: { placeholder: "请选择" },
	TimePicker: {
		placeholder: "请选择时间",
		positiveText: "确认",
		negativeText: "取消",
		now: "此刻",
		clear: "清除"
	},
	Pagination: {
		goto: "跳至",
		selectionSuffix: "页"
	},
	DynamicTags: { add: "添加" },
	Log: { loading: "加载中" },
	Input: { placeholder: "请输入" },
	InputNumber: { placeholder: "请输入" },
	DynamicInput: { create: "添加" },
	ThemeEditor: {
		title: "主题编辑器",
		clearAllVars: "清除全部变量",
		clearSearch: "清除搜索",
		filterCompName: "过滤组件名",
		filterVarName: "过滤变量名",
		import: "导入",
		export: "导出",
		restore: "恢复默认"
	},
	Image: {
		tipPrevious: "上一张（←）",
		tipNext: "下一张（→）",
		tipCounterclockwise: "向左旋转",
		tipClockwise: "向右旋转",
		tipZoomOut: "缩小",
		tipZoomIn: "放大",
		tipDownload: "下载",
		tipClose: "关闭（Esc）",
		tipOriginalSize: "缩放到原始尺寸"
	},
	Heatmap: {
		less: "少",
		more: "多",
		monthFormat: "MMM",
		weekdayFormat: "eeeeee"
	}
};
//#endregion
//#region node_modules/date-fns/locale/_lib/buildFormatLongFn.js
function Ts(e) {
	return (t = {}) => {
		let n = t.width ? String(t.width) : e.defaultWidth;
		return e.formats[n] || e.formats[e.defaultWidth];
	};
}
//#endregion
//#region node_modules/date-fns/locale/_lib/buildLocalizeFn.js
function Es(e) {
	return (t, n) => {
		let r = n?.context ? String(n.context) : "standalone", i;
		if (r === "formatting" && e.formattingValues) {
			let t = e.defaultFormattingWidth || e.defaultWidth, r = n?.width ? String(n.width) : t;
			i = e.formattingValues[r] || e.formattingValues[t];
		} else {
			let t = e.defaultWidth, r = n?.width ? String(n.width) : e.defaultWidth;
			i = e.values[r] || e.values[t];
		}
		let a = e.argumentCallback ? e.argumentCallback(t) : t;
		return i[a];
	};
}
//#endregion
//#region node_modules/date-fns/locale/_lib/buildMatchFn.js
function Ds(e) {
	return (t, n = {}) => {
		let r = n.width, i = r && e.matchPatterns[r] || e.matchPatterns[e.defaultMatchWidth], a = t.match(i);
		if (!a) return null;
		let o = a[0], s = r && e.parsePatterns[r] || e.parsePatterns[e.defaultParseWidth], c = Array.isArray(s) ? ks(s, (e) => e.test(o)) : Os(s, (e) => e.test(o)), l;
		l = e.valueCallback ? e.valueCallback(c) : c, l = n.valueCallback ? n.valueCallback(l) : l;
		let u = t.slice(o.length);
		return {
			value: l,
			rest: u
		};
	};
}
function Os(e, t) {
	for (let n in e) if (Object.prototype.hasOwnProperty.call(e, n) && t(e[n])) return n;
}
function ks(e, t) {
	for (let n = 0; n < e.length; n++) if (t(e[n])) return n;
}
//#endregion
//#region node_modules/date-fns/locale/_lib/buildMatchPatternFn.js
function As(e) {
	return (t, n = {}) => {
		let r = t.match(e.matchPattern);
		if (!r) return null;
		let i = r[0], a = t.match(e.parsePattern);
		if (!a) return null;
		let o = e.valueCallback ? e.valueCallback(a[0]) : a[0];
		o = n.valueCallback ? n.valueCallback(o) : o;
		let s = t.slice(i.length);
		return {
			value: o,
			rest: s
		};
	};
}
//#endregion
//#region node_modules/date-fns/constants.js
var js = 365.2425, Ms = 86400;
Ms * 7, Ms * js / 12 * 3;
var Ns = Symbol.for("constructDateFrom");
//#endregion
//#region node_modules/date-fns/constructFrom.js
function Ps(e, t) {
	return typeof e == "function" ? e(t) : e && typeof e == "object" && Ns in e ? e[Ns](t) : e instanceof Date ? new e.constructor(t) : new Date(t);
}
//#endregion
//#region node_modules/date-fns/_lib/normalizeDates.js
function Fs(e, ...t) {
	let n = Ps.bind(null, e || t.find((e) => typeof e == "object"));
	return t.map(n);
}
//#endregion
//#region node_modules/date-fns/_lib/defaultOptions.js
var Is = {};
function Ls() {
	return Is;
}
//#endregion
//#region node_modules/date-fns/toDate.js
function Rs(e, t) {
	return Ps(t || e, e);
}
//#endregion
//#region node_modules/date-fns/startOfWeek.js
function zs(e, t) {
	let n = Ls(), r = t?.weekStartsOn ?? t?.locale?.options?.weekStartsOn ?? n.weekStartsOn ?? n.locale?.options?.weekStartsOn ?? 0, i = Rs(e, t?.in), a = i.getDay(), o = (a < r ? 7 : 0) + a - r;
	return i.setDate(i.getDate() - o), i.setHours(0, 0, 0, 0), i;
}
//#endregion
//#region node_modules/date-fns/isSameWeek.js
function Bs(e, t, n) {
	let [r, i] = Fs(n?.in, e, t);
	return +zs(r, n) == +zs(i, n);
}
//#endregion
//#region node_modules/date-fns/locale/en-US/_lib/formatDistance.js
var Vs = {
	lessThanXSeconds: {
		one: "less than a second",
		other: "less than {{count}} seconds"
	},
	xSeconds: {
		one: "1 second",
		other: "{{count}} seconds"
	},
	halfAMinute: "half a minute",
	lessThanXMinutes: {
		one: "less than a minute",
		other: "less than {{count}} minutes"
	},
	xMinutes: {
		one: "1 minute",
		other: "{{count}} minutes"
	},
	aboutXHours: {
		one: "about 1 hour",
		other: "about {{count}} hours"
	},
	xHours: {
		one: "1 hour",
		other: "{{count}} hours"
	},
	xDays: {
		one: "1 day",
		other: "{{count}} days"
	},
	aboutXWeeks: {
		one: "about 1 week",
		other: "about {{count}} weeks"
	},
	xWeeks: {
		one: "1 week",
		other: "{{count}} weeks"
	},
	aboutXMonths: {
		one: "about 1 month",
		other: "about {{count}} months"
	},
	xMonths: {
		one: "1 month",
		other: "{{count}} months"
	},
	aboutXYears: {
		one: "about 1 year",
		other: "about {{count}} years"
	},
	xYears: {
		one: "1 year",
		other: "{{count}} years"
	},
	overXYears: {
		one: "over 1 year",
		other: "over {{count}} years"
	},
	almostXYears: {
		one: "almost 1 year",
		other: "almost {{count}} years"
	}
}, Hs = (e, t, n) => {
	let r, i = Vs[e];
	return r = typeof i == "string" ? i : t === 1 ? i.one : i.other.replace("{{count}}", t.toString()), n?.addSuffix ? n.comparison && n.comparison > 0 ? "in " + r : r + " ago" : r;
}, Us = {
	lastWeek: "'last' eeee 'at' p",
	yesterday: "'yesterday at' p",
	today: "'today at' p",
	tomorrow: "'tomorrow at' p",
	nextWeek: "eeee 'at' p",
	other: "P"
}, Ws = (e, t, n, r) => Us[e], Gs = {
	ordinalNumber: (e, t) => {
		let n = Number(e), r = n % 100;
		if (r > 20 || r < 10) switch (r % 10) {
			case 1: return n + "st";
			case 2: return n + "nd";
			case 3: return n + "rd";
		}
		return n + "th";
	},
	era: Es({
		values: {
			narrow: ["B", "A"],
			abbreviated: ["BC", "AD"],
			wide: ["Before Christ", "Anno Domini"]
		},
		defaultWidth: "wide"
	}),
	quarter: Es({
		values: {
			narrow: [
				"1",
				"2",
				"3",
				"4"
			],
			abbreviated: [
				"Q1",
				"Q2",
				"Q3",
				"Q4"
			],
			wide: [
				"1st quarter",
				"2nd quarter",
				"3rd quarter",
				"4th quarter"
			]
		},
		defaultWidth: "wide",
		argumentCallback: (e) => e - 1
	}),
	month: Es({
		values: {
			narrow: [
				"J",
				"F",
				"M",
				"A",
				"M",
				"J",
				"J",
				"A",
				"S",
				"O",
				"N",
				"D"
			],
			abbreviated: [
				"Jan",
				"Feb",
				"Mar",
				"Apr",
				"May",
				"Jun",
				"Jul",
				"Aug",
				"Sep",
				"Oct",
				"Nov",
				"Dec"
			],
			wide: [
				"January",
				"February",
				"March",
				"April",
				"May",
				"June",
				"July",
				"August",
				"September",
				"October",
				"November",
				"December"
			]
		},
		defaultWidth: "wide"
	}),
	day: Es({
		values: {
			narrow: [
				"S",
				"M",
				"T",
				"W",
				"T",
				"F",
				"S"
			],
			short: [
				"Su",
				"Mo",
				"Tu",
				"We",
				"Th",
				"Fr",
				"Sa"
			],
			abbreviated: [
				"Sun",
				"Mon",
				"Tue",
				"Wed",
				"Thu",
				"Fri",
				"Sat"
			],
			wide: [
				"Sunday",
				"Monday",
				"Tuesday",
				"Wednesday",
				"Thursday",
				"Friday",
				"Saturday"
			]
		},
		defaultWidth: "wide"
	}),
	dayPeriod: Es({
		values: {
			narrow: {
				am: "a",
				pm: "p",
				midnight: "mi",
				noon: "n",
				morning: "morning",
				afternoon: "afternoon",
				evening: "evening",
				night: "night"
			},
			abbreviated: {
				am: "AM",
				pm: "PM",
				midnight: "midnight",
				noon: "noon",
				morning: "morning",
				afternoon: "afternoon",
				evening: "evening",
				night: "night"
			},
			wide: {
				am: "a.m.",
				pm: "p.m.",
				midnight: "midnight",
				noon: "noon",
				morning: "morning",
				afternoon: "afternoon",
				evening: "evening",
				night: "night"
			}
		},
		defaultWidth: "wide",
		formattingValues: {
			narrow: {
				am: "a",
				pm: "p",
				midnight: "mi",
				noon: "n",
				morning: "in the morning",
				afternoon: "in the afternoon",
				evening: "in the evening",
				night: "at night"
			},
			abbreviated: {
				am: "AM",
				pm: "PM",
				midnight: "midnight",
				noon: "noon",
				morning: "in the morning",
				afternoon: "in the afternoon",
				evening: "in the evening",
				night: "at night"
			},
			wide: {
				am: "a.m.",
				pm: "p.m.",
				midnight: "midnight",
				noon: "noon",
				morning: "in the morning",
				afternoon: "in the afternoon",
				evening: "in the evening",
				night: "at night"
			}
		},
		defaultFormattingWidth: "wide"
	})
}, Ks = {
	ordinalNumber: As({
		matchPattern: /^(\d+)(th|st|nd|rd)?/i,
		parsePattern: /\d+/i,
		valueCallback: (e) => parseInt(e, 10)
	}),
	era: Ds({
		matchPatterns: {
			narrow: /^(b|a)/i,
			abbreviated: /^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,
			wide: /^(before christ|before common era|anno domini|common era)/i
		},
		defaultMatchWidth: "wide",
		parsePatterns: { any: [/^b/i, /^(a|c)/i] },
		defaultParseWidth: "any"
	}),
	quarter: Ds({
		matchPatterns: {
			narrow: /^[1234]/i,
			abbreviated: /^q[1234]/i,
			wide: /^[1234](th|st|nd|rd)? quarter/i
		},
		defaultMatchWidth: "wide",
		parsePatterns: { any: [
			/1/i,
			/2/i,
			/3/i,
			/4/i
		] },
		defaultParseWidth: "any",
		valueCallback: (e) => e + 1
	}),
	month: Ds({
		matchPatterns: {
			narrow: /^[jfmasond]/i,
			abbreviated: /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,
			wide: /^(january|february|march|april|may|june|july|august|september|october|november|december)/i
		},
		defaultMatchWidth: "wide",
		parsePatterns: {
			narrow: [
				/^j/i,
				/^f/i,
				/^m/i,
				/^a/i,
				/^m/i,
				/^j/i,
				/^j/i,
				/^a/i,
				/^s/i,
				/^o/i,
				/^n/i,
				/^d/i
			],
			any: [
				/^ja/i,
				/^f/i,
				/^mar/i,
				/^ap/i,
				/^may/i,
				/^jun/i,
				/^jul/i,
				/^au/i,
				/^s/i,
				/^o/i,
				/^n/i,
				/^d/i
			]
		},
		defaultParseWidth: "any"
	}),
	day: Ds({
		matchPatterns: {
			narrow: /^[smtwf]/i,
			short: /^(su|mo|tu|we|th|fr|sa)/i,
			abbreviated: /^(sun|mon|tue|wed|thu|fri|sat)/i,
			wide: /^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i
		},
		defaultMatchWidth: "wide",
		parsePatterns: {
			narrow: [
				/^s/i,
				/^m/i,
				/^t/i,
				/^w/i,
				/^t/i,
				/^f/i,
				/^s/i
			],
			any: [
				/^su/i,
				/^m/i,
				/^tu/i,
				/^w/i,
				/^th/i,
				/^f/i,
				/^sa/i
			]
		},
		defaultParseWidth: "any"
	}),
	dayPeriod: Ds({
		matchPatterns: {
			narrow: /^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,
			any: /^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i
		},
		defaultMatchWidth: "any",
		parsePatterns: { any: {
			am: /^a/i,
			pm: /^p/i,
			midnight: /^mi/i,
			noon: /^no/i,
			morning: /morning/i,
			afternoon: /afternoon/i,
			evening: /evening/i,
			night: /night/i
		} },
		defaultParseWidth: "any"
	})
}, qs = {
	code: "en-US",
	formatDistance: Hs,
	formatLong: {
		date: Ts({
			formats: {
				full: "EEEE, MMMM do, y",
				long: "MMMM do, y",
				medium: "MMM d, y",
				short: "MM/dd/yyyy"
			},
			defaultWidth: "full"
		}),
		time: Ts({
			formats: {
				full: "h:mm:ss a zzzz",
				long: "h:mm:ss a z",
				medium: "h:mm:ss a",
				short: "h:mm a"
			},
			defaultWidth: "full"
		}),
		dateTime: Ts({
			formats: {
				full: "{{date}} 'at' {{time}}",
				long: "{{date}} 'at' {{time}}",
				medium: "{{date}}, {{time}}",
				short: "{{date}}, {{time}}"
			},
			defaultWidth: "full"
		})
	},
	formatRelative: Ws,
	localize: Gs,
	match: Ks,
	options: {
		weekStartsOn: 0,
		firstWeekContainsDate: 1
	}
}, Js = {
	lessThanXSeconds: {
		one: "不到 1 秒",
		other: "不到 {{count}} 秒"
	},
	xSeconds: {
		one: "1 秒",
		other: "{{count}} 秒"
	},
	halfAMinute: "半分钟",
	lessThanXMinutes: {
		one: "不到 1 分钟",
		other: "不到 {{count}} 分钟"
	},
	xMinutes: {
		one: "1 分钟",
		other: "{{count}} 分钟"
	},
	xHours: {
		one: "1 小时",
		other: "{{count}} 小时"
	},
	aboutXHours: {
		one: "大约 1 小时",
		other: "大约 {{count}} 小时"
	},
	xDays: {
		one: "1 天",
		other: "{{count}} 天"
	},
	aboutXWeeks: {
		one: "大约 1 个星期",
		other: "大约 {{count}} 个星期"
	},
	xWeeks: {
		one: "1 个星期",
		other: "{{count}} 个星期"
	},
	aboutXMonths: {
		one: "大约 1 个月",
		other: "大约 {{count}} 个月"
	},
	xMonths: {
		one: "1 个月",
		other: "{{count}} 个月"
	},
	aboutXYears: {
		one: "大约 1 年",
		other: "大约 {{count}} 年"
	},
	xYears: {
		one: "1 年",
		other: "{{count}} 年"
	},
	overXYears: {
		one: "超过 1 年",
		other: "超过 {{count}} 年"
	},
	almostXYears: {
		one: "将近 1 年",
		other: "将近 {{count}} 年"
	}
}, Ys = (e, t, n) => {
	let r, i = Js[e];
	return r = typeof i == "string" ? i : t === 1 ? i.one : i.other.replace("{{count}}", String(t)), n?.addSuffix ? n.comparison && n.comparison > 0 ? r + "内" : r + "前" : r;
}, Xs = {
	date: Ts({
		formats: {
			full: "y'年'M'月'd'日' EEEE",
			long: "y'年'M'月'd'日'",
			medium: "yyyy-MM-dd",
			short: "yy-MM-dd"
		},
		defaultWidth: "full"
	}),
	time: Ts({
		formats: {
			full: "zzzz a h:mm:ss",
			long: "z a h:mm:ss",
			medium: "a h:mm:ss",
			short: "a h:mm"
		},
		defaultWidth: "full"
	}),
	dateTime: Ts({
		formats: {
			full: "{{date}} {{time}}",
			long: "{{date}} {{time}}",
			medium: "{{date}} {{time}}",
			short: "{{date}} {{time}}"
		},
		defaultWidth: "full"
	})
};
//#endregion
//#region node_modules/date-fns/locale/zh-CN/_lib/formatRelative.js
function Zs(e, t, n) {
	return Bs(e, t, n) ? "eeee p" : e.getTime() > t.getTime() ? "'下个'eeee p" : "'上个'eeee p";
}
var Qs = {
	lastWeek: Zs,
	yesterday: "'昨天' p",
	today: "'今天' p",
	tomorrow: "'明天' p",
	nextWeek: Zs,
	other: "PP p"
}, $s = {
	code: "zh-CN",
	formatDistance: Ys,
	formatLong: Xs,
	formatRelative: (e, t, n, r) => {
		let i = Qs[e];
		return typeof i == "function" ? i(t, n, r) : i;
	},
	localize: {
		ordinalNumber: (e, t) => {
			let n = Number(e);
			switch (t?.unit) {
				case "date": return n.toString() + "日";
				case "hour": return n.toString() + "时";
				case "minute": return n.toString() + "分";
				case "second": return n.toString() + "秒";
				default: return "第 " + n.toString();
			}
		},
		era: Es({
			values: {
				narrow: ["前", "公元"],
				abbreviated: ["前", "公元"],
				wide: ["公元前", "公元"]
			},
			defaultWidth: "wide"
		}),
		quarter: Es({
			values: {
				narrow: [
					"1",
					"2",
					"3",
					"4"
				],
				abbreviated: [
					"第一季",
					"第二季",
					"第三季",
					"第四季"
				],
				wide: [
					"第一季度",
					"第二季度",
					"第三季度",
					"第四季度"
				]
			},
			defaultWidth: "wide",
			argumentCallback: (e) => e - 1
		}),
		month: Es({
			values: {
				narrow: [
					"一",
					"二",
					"三",
					"四",
					"五",
					"六",
					"七",
					"八",
					"九",
					"十",
					"十一",
					"十二"
				],
				abbreviated: [
					"1月",
					"2月",
					"3月",
					"4月",
					"5月",
					"6月",
					"7月",
					"8月",
					"9月",
					"10月",
					"11月",
					"12月"
				],
				wide: [
					"一月",
					"二月",
					"三月",
					"四月",
					"五月",
					"六月",
					"七月",
					"八月",
					"九月",
					"十月",
					"十一月",
					"十二月"
				]
			},
			defaultWidth: "wide"
		}),
		day: Es({
			values: {
				narrow: [
					"日",
					"一",
					"二",
					"三",
					"四",
					"五",
					"六"
				],
				short: [
					"日",
					"一",
					"二",
					"三",
					"四",
					"五",
					"六"
				],
				abbreviated: [
					"周日",
					"周一",
					"周二",
					"周三",
					"周四",
					"周五",
					"周六"
				],
				wide: [
					"星期日",
					"星期一",
					"星期二",
					"星期三",
					"星期四",
					"星期五",
					"星期六"
				]
			},
			defaultWidth: "wide"
		}),
		dayPeriod: Es({
			values: {
				narrow: {
					am: "上",
					pm: "下",
					midnight: "凌晨",
					noon: "午",
					morning: "早",
					afternoon: "下午",
					evening: "晚",
					night: "夜"
				},
				abbreviated: {
					am: "上午",
					pm: "下午",
					midnight: "凌晨",
					noon: "中午",
					morning: "早晨",
					afternoon: "中午",
					evening: "晚上",
					night: "夜间"
				},
				wide: {
					am: "上午",
					pm: "下午",
					midnight: "凌晨",
					noon: "中午",
					morning: "早晨",
					afternoon: "中午",
					evening: "晚上",
					night: "夜间"
				}
			},
			defaultWidth: "wide",
			formattingValues: {
				narrow: {
					am: "上",
					pm: "下",
					midnight: "凌晨",
					noon: "午",
					morning: "早",
					afternoon: "下午",
					evening: "晚",
					night: "夜"
				},
				abbreviated: {
					am: "上午",
					pm: "下午",
					midnight: "凌晨",
					noon: "中午",
					morning: "早晨",
					afternoon: "中午",
					evening: "晚上",
					night: "夜间"
				},
				wide: {
					am: "上午",
					pm: "下午",
					midnight: "凌晨",
					noon: "中午",
					morning: "早晨",
					afternoon: "中午",
					evening: "晚上",
					night: "夜间"
				}
			},
			defaultFormattingWidth: "wide"
		})
	},
	match: {
		ordinalNumber: As({
			matchPattern: /^(第\s*)?\d+(日|时|分|秒)?/i,
			parsePattern: /\d+/i,
			valueCallback: (e) => parseInt(e, 10)
		}),
		era: Ds({
			matchPatterns: {
				narrow: /^(前)/i,
				abbreviated: /^(前)/i,
				wide: /^(公元前|公元)/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: { any: [/^(前)/i, /^(公元)/i] },
			defaultParseWidth: "any"
		}),
		quarter: Ds({
			matchPatterns: {
				narrow: /^[1234]/i,
				abbreviated: /^第[一二三四]刻/i,
				wide: /^第[一二三四]刻钟/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: { any: [
				/(1|一)/i,
				/(2|二)/i,
				/(3|三)/i,
				/(4|四)/i
			] },
			defaultParseWidth: "any",
			valueCallback: (e) => e + 1
		}),
		month: Ds({
			matchPatterns: {
				narrow: /^(一|二|三|四|五|六|七|八|九|十[二一]?)/i,
				abbreviated: /^(一|二|三|四|五|六|七|八|九|十[二一]?|\d|1[0-2])月/i,
				wide: /^(一|二|三|四|五|六|七|八|九|十[二一]?)月/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: {
				narrow: [
					/^一/i,
					/^二/i,
					/^三/i,
					/^四/i,
					/^五/i,
					/^六/i,
					/^七/i,
					/^八/i,
					/^九/i,
					/^十(?!(一|二))/i,
					/^十一/i,
					/^十二/i
				],
				any: [
					/^(一|1(?!\d))/i,
					/^(二|2)/i,
					/^(三|3)/i,
					/^(四|4)/i,
					/^(五|5)/i,
					/^(六|6)/i,
					/^(七|7)/i,
					/^(八|8)/i,
					/^(九|9)/i,
					/^(十(?!(一|二))|10)/i,
					/^(十一|11)/i,
					/^(十二|12)/i
				]
			},
			defaultParseWidth: "any"
		}),
		day: Ds({
			matchPatterns: {
				narrow: /^[一二三四五六日]/i,
				short: /^[一二三四五六日]/i,
				abbreviated: /^周[一二三四五六日]/i,
				wide: /^星期[一二三四五六日]/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: { any: [
				/日/i,
				/一/i,
				/二/i,
				/三/i,
				/四/i,
				/五/i,
				/六/i
			] },
			defaultParseWidth: "any"
		}),
		dayPeriod: Ds({
			matchPatterns: { any: /^(上午?|下午?|午夜|[中正]午|早上?|下午|晚上?|凌晨|)/i },
			defaultMatchWidth: "any",
			parsePatterns: { any: {
				am: /^上午?/i,
				pm: /^下午?/i,
				midnight: /^午夜/i,
				noon: /^[中正]午/i,
				morning: /^早上/i,
				afternoon: /^下午/i,
				evening: /^晚上?/i,
				night: /^凌晨/i
			} },
			defaultParseWidth: "any"
		})
	},
	options: {
		weekStartsOn: 1,
		firstWeekContainsDate: 4
	}
}, ec = {
	name: "en-US",
	locale: qs
}, tc = {
	name: "zh-CN",
	locale: $s
}, nc = typeof global == "object" && global && global.Object === Object && global, rc = typeof self == "object" && self && self.Object === Object && self, ic = nc || rc || Function("return this")(), ac = ic.Symbol, oc = Object.prototype, sc = oc.hasOwnProperty, cc = oc.toString, lc = ac ? ac.toStringTag : void 0;
function uc(e) {
	var t = sc.call(e, lc), n = e[lc];
	try {
		e[lc] = void 0;
		var r = !0;
	} catch {}
	var i = cc.call(e);
	return r && (t ? e[lc] = n : delete e[lc]), i;
}
//#endregion
//#region node_modules/lodash-es/_objectToString.js
var dc = Object.prototype.toString;
function fc(e) {
	return dc.call(e);
}
//#endregion
//#region node_modules/lodash-es/_baseGetTag.js
var pc = "[object Null]", mc = "[object Undefined]", hc = ac ? ac.toStringTag : void 0;
function gc(e) {
	return e == null ? e === void 0 ? mc : pc : hc && hc in Object(e) ? uc(e) : fc(e);
}
//#endregion
//#region node_modules/lodash-es/isObjectLike.js
function _c(e) {
	return typeof e == "object" && !!e;
}
//#endregion
//#region node_modules/lodash-es/isSymbol.js
var vc = "[object Symbol]";
function yc(e) {
	return typeof e == "symbol" || _c(e) && gc(e) == vc;
}
//#endregion
//#region node_modules/lodash-es/_arrayMap.js
function bc(e, t) {
	for (var n = -1, r = e == null ? 0 : e.length, i = Array(r); ++n < r;) i[n] = t(e[n], n, e);
	return i;
}
//#endregion
//#region node_modules/lodash-es/isArray.js
var xc = Array.isArray, Sc = 1 / 0, Cc = ac ? ac.prototype : void 0, wc = Cc ? Cc.toString : void 0;
function Tc(e) {
	if (typeof e == "string") return e;
	if (xc(e)) return bc(e, Tc) + "";
	if (yc(e)) return wc ? wc.call(e) : "";
	var t = e + "";
	return t == "0" && 1 / e == -Sc ? "-0" : t;
}
//#endregion
//#region node_modules/lodash-es/isObject.js
function Ec(e) {
	var t = typeof e;
	return e != null && (t == "object" || t == "function");
}
//#endregion
//#region node_modules/lodash-es/identity.js
function Dc(e) {
	return e;
}
//#endregion
//#region node_modules/lodash-es/isFunction.js
var Oc = "[object AsyncFunction]", kc = "[object Function]", Ac = "[object GeneratorFunction]", jc = "[object Proxy]";
function Mc(e) {
	if (!Ec(e)) return !1;
	var t = gc(e);
	return t == kc || t == Ac || t == Oc || t == jc;
}
//#endregion
//#region node_modules/lodash-es/_coreJsData.js
var Nc = ic["__core-js_shared__"], Pc = function() {
	var e = /[^.]+$/.exec(Nc && Nc.keys && Nc.keys.IE_PROTO || "");
	return e ? "Symbol(src)_1." + e : "";
}();
function Fc(e) {
	return !!Pc && Pc in e;
}
//#endregion
//#region node_modules/lodash-es/_toSource.js
var Ic = Function.prototype.toString;
function Lc(e) {
	if (e != null) {
		try {
			return Ic.call(e);
		} catch {}
		try {
			return e + "";
		} catch {}
	}
	return "";
}
//#endregion
//#region node_modules/lodash-es/_baseIsNative.js
var Rc = /[\\^$.*+?()[\]{}|]/g, zc = /^\[object .+?Constructor\]$/, Bc = Function.prototype, Vc = Object.prototype, Hc = Bc.toString, Uc = Vc.hasOwnProperty, Wc = RegExp("^" + Hc.call(Uc).replace(Rc, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$");
function Gc(e) {
	return !Ec(e) || Fc(e) ? !1 : (Mc(e) ? Wc : zc).test(Lc(e));
}
//#endregion
//#region node_modules/lodash-es/_getValue.js
function Kc(e, t) {
	return e?.[t];
}
//#endregion
//#region node_modules/lodash-es/_getNative.js
function qc(e, t) {
	var n = Kc(e, t);
	return Gc(n) ? n : void 0;
}
//#endregion
//#region node_modules/lodash-es/_baseCreate.js
var Jc = Object.create, Yc = function() {
	function e() {}
	return function(t) {
		if (!Ec(t)) return {};
		if (Jc) return Jc(t);
		e.prototype = t;
		var n = new e();
		return e.prototype = void 0, n;
	};
}();
//#endregion
//#region node_modules/lodash-es/_apply.js
function Xc(e, t, n) {
	switch (n.length) {
		case 0: return e.call(t);
		case 1: return e.call(t, n[0]);
		case 2: return e.call(t, n[0], n[1]);
		case 3: return e.call(t, n[0], n[1], n[2]);
	}
	return e.apply(t, n);
}
//#endregion
//#region node_modules/lodash-es/_copyArray.js
function Zc(e, t) {
	var n = -1, r = e.length;
	for (t ||= Array(r); ++n < r;) t[n] = e[n];
	return t;
}
//#endregion
//#region node_modules/lodash-es/_shortOut.js
var Qc = 800, $c = 16, el = Date.now;
function tl(e) {
	var t = 0, n = 0;
	return function() {
		var r = el(), i = $c - (r - n);
		if (n = r, i > 0) {
			if (++t >= Qc) return arguments[0];
		} else t = 0;
		return e.apply(void 0, arguments);
	};
}
//#endregion
//#region node_modules/lodash-es/constant.js
function nl(e) {
	return function() {
		return e;
	};
}
//#endregion
//#region node_modules/lodash-es/_defineProperty.js
var rl = function() {
	try {
		var e = qc(Object, "defineProperty");
		return e({}, "", {}), e;
	} catch {}
}(), il = tl(rl ? function(e, t) {
	return rl(e, "toString", {
		configurable: !0,
		enumerable: !1,
		value: nl(t),
		writable: !0
	});
} : Dc), al = 9007199254740991, ol = /^(?:0|[1-9]\d*)$/;
function sl(e, t) {
	var n = typeof e;
	return t ??= al, !!t && (n == "number" || n != "symbol" && ol.test(e)) && e > -1 && e % 1 == 0 && e < t;
}
//#endregion
//#region node_modules/lodash-es/_baseAssignValue.js
function cl(e, t, n) {
	t == "__proto__" && rl ? rl(e, t, {
		configurable: !0,
		enumerable: !0,
		value: n,
		writable: !0
	}) : e[t] = n;
}
//#endregion
//#region node_modules/lodash-es/eq.js
function ll(e, t) {
	return e === t || e !== e && t !== t;
}
//#endregion
//#region node_modules/lodash-es/_assignValue.js
var ul = Object.prototype.hasOwnProperty;
function dl(e, t, n) {
	var r = e[t];
	(!(ul.call(e, t) && ll(r, n)) || n === void 0 && !(t in e)) && cl(e, t, n);
}
//#endregion
//#region node_modules/lodash-es/_copyObject.js
function fl(e, t, n, r) {
	var i = !n;
	n ||= {};
	for (var a = -1, o = t.length; ++a < o;) {
		var s = t[a], c = r ? r(n[s], e[s], s, n, e) : void 0;
		c === void 0 && (c = e[s]), i ? cl(n, s, c) : dl(n, s, c);
	}
	return n;
}
//#endregion
//#region node_modules/lodash-es/_overRest.js
var pl = Math.max;
function ml(e, t, n) {
	return t = pl(t === void 0 ? e.length - 1 : t, 0), function() {
		for (var r = arguments, i = -1, a = pl(r.length - t, 0), o = Array(a); ++i < a;) o[i] = r[t + i];
		i = -1;
		for (var s = Array(t + 1); ++i < t;) s[i] = r[i];
		return s[t] = n(o), Xc(e, this, s);
	};
}
//#endregion
//#region node_modules/lodash-es/_baseRest.js
function hl(e, t) {
	return il(ml(e, t, Dc), e + "");
}
//#endregion
//#region node_modules/lodash-es/isLength.js
var gl = 9007199254740991;
function _l(e) {
	return typeof e == "number" && e > -1 && e % 1 == 0 && e <= gl;
}
//#endregion
//#region node_modules/lodash-es/isArrayLike.js
function vl(e) {
	return e != null && _l(e.length) && !Mc(e);
}
//#endregion
//#region node_modules/lodash-es/_isIterateeCall.js
function yl(e, t, n) {
	if (!Ec(n)) return !1;
	var r = typeof t;
	return (r == "number" ? vl(n) && sl(t, n.length) : r == "string" && t in n) ? ll(n[t], e) : !1;
}
//#endregion
//#region node_modules/lodash-es/_createAssigner.js
function bl(e) {
	return hl(function(t, n) {
		var r = -1, i = n.length, a = i > 1 ? n[i - 1] : void 0, o = i > 2 ? n[2] : void 0;
		for (a = e.length > 3 && typeof a == "function" ? (i--, a) : void 0, o && yl(n[0], n[1], o) && (a = i < 3 ? void 0 : a, i = 1), t = Object(t); ++r < i;) {
			var s = n[r];
			s && e(t, s, r, a);
		}
		return t;
	});
}
//#endregion
//#region node_modules/lodash-es/_isPrototype.js
var xl = Object.prototype;
function Sl(e) {
	var t = e && e.constructor;
	return e === (typeof t == "function" && t.prototype || xl);
}
//#endregion
//#region node_modules/lodash-es/_baseTimes.js
function Cl(e, t) {
	for (var n = -1, r = Array(e); ++n < e;) r[n] = t(n);
	return r;
}
//#endregion
//#region node_modules/lodash-es/_baseIsArguments.js
var wl = "[object Arguments]";
function Tl(e) {
	return _c(e) && gc(e) == wl;
}
//#endregion
//#region node_modules/lodash-es/isArguments.js
var El = Object.prototype, Dl = El.hasOwnProperty, Ol = El.propertyIsEnumerable, kl = Tl(function() {
	return arguments;
}()) ? Tl : function(e) {
	return _c(e) && Dl.call(e, "callee") && !Ol.call(e, "callee");
};
//#endregion
//#region node_modules/lodash-es/stubFalse.js
function Al() {
	return !1;
}
//#endregion
//#region node_modules/lodash-es/isBuffer.js
var jl = typeof exports == "object" && exports && !exports.nodeType && exports, Ml = jl && typeof module == "object" && module && !module.nodeType && module, Nl = Ml && Ml.exports === jl ? ic.Buffer : void 0, Pl = (Nl ? Nl.isBuffer : void 0) || Al, Fl = "[object Arguments]", Il = "[object Array]", Ll = "[object Boolean]", Rl = "[object Date]", zl = "[object Error]", Bl = "[object Function]", Vl = "[object Map]", Hl = "[object Number]", Ul = "[object Object]", Wl = "[object RegExp]", Gl = "[object Set]", Kl = "[object String]", ql = "[object WeakMap]", Jl = "[object ArrayBuffer]", Yl = "[object DataView]", Xl = "[object Float32Array]", Zl = "[object Float64Array]", Ql = "[object Int8Array]", $l = "[object Int16Array]", eu = "[object Int32Array]", tu = "[object Uint8Array]", nu = "[object Uint8ClampedArray]", ru = "[object Uint16Array]", iu = "[object Uint32Array]", W = {};
W[Xl] = W[Zl] = W[Ql] = W[$l] = W[eu] = W[tu] = W[nu] = W[ru] = W[iu] = !0, W[Fl] = W[Il] = W[Jl] = W[Ll] = W[Yl] = W[Rl] = W[zl] = W[Bl] = W[Vl] = W[Hl] = W[Ul] = W[Wl] = W[Gl] = W[Kl] = W[ql] = !1;
function au(e) {
	return _c(e) && _l(e.length) && !!W[gc(e)];
}
//#endregion
//#region node_modules/lodash-es/_baseUnary.js
function ou(e) {
	return function(t) {
		return e(t);
	};
}
//#endregion
//#region node_modules/lodash-es/_nodeUtil.js
var su = typeof exports == "object" && exports && !exports.nodeType && exports, cu = su && typeof module == "object" && module && !module.nodeType && module, lu = cu && cu.exports === su && nc.process, uu = function() {
	try {
		return cu && cu.require && cu.require("util").types || lu && lu.binding && lu.binding("util");
	} catch {}
}(), du = uu && uu.isTypedArray, fu = du ? ou(du) : au, pu = Object.prototype.hasOwnProperty;
function mu(e, t) {
	var n = xc(e), r = !n && kl(e), i = !n && !r && Pl(e), a = !n && !r && !i && fu(e), o = n || r || i || a, s = o ? Cl(e.length, String) : [], c = s.length;
	for (var l in e) (t || pu.call(e, l)) && !(o && (l == "length" || i && (l == "offset" || l == "parent") || a && (l == "buffer" || l == "byteLength" || l == "byteOffset") || sl(l, c))) && s.push(l);
	return s;
}
//#endregion
//#region node_modules/lodash-es/_overArg.js
function hu(e, t) {
	return function(n) {
		return e(t(n));
	};
}
//#endregion
//#region node_modules/lodash-es/_nativeKeysIn.js
function gu(e) {
	var t = [];
	if (e != null) for (var n in Object(e)) t.push(n);
	return t;
}
//#endregion
//#region node_modules/lodash-es/_baseKeysIn.js
var _u = Object.prototype.hasOwnProperty;
function vu(e) {
	if (!Ec(e)) return gu(e);
	var t = Sl(e), n = [];
	for (var r in e) (r != "constructor" || !t && _u.call(e, r)) && n.push(r);
	return n;
}
//#endregion
//#region node_modules/lodash-es/keysIn.js
function yu(e) {
	return vl(e) ? mu(e, !0) : vu(e);
}
//#endregion
//#region node_modules/lodash-es/_nativeCreate.js
var bu = qc(Object, "create");
//#endregion
//#region node_modules/lodash-es/_hashClear.js
function xu() {
	this.__data__ = bu ? bu(null) : {}, this.size = 0;
}
//#endregion
//#region node_modules/lodash-es/_hashDelete.js
function Su(e) {
	var t = this.has(e) && delete this.__data__[e];
	return this.size -= +!!t, t;
}
//#endregion
//#region node_modules/lodash-es/_hashGet.js
var Cu = "__lodash_hash_undefined__", wu = Object.prototype.hasOwnProperty;
function Tu(e) {
	var t = this.__data__;
	if (bu) {
		var n = t[e];
		return n === Cu ? void 0 : n;
	}
	return wu.call(t, e) ? t[e] : void 0;
}
//#endregion
//#region node_modules/lodash-es/_hashHas.js
var Eu = Object.prototype.hasOwnProperty;
function Du(e) {
	var t = this.__data__;
	return bu ? t[e] !== void 0 : Eu.call(t, e);
}
//#endregion
//#region node_modules/lodash-es/_hashSet.js
var Ou = "__lodash_hash_undefined__";
function ku(e, t) {
	var n = this.__data__;
	return this.size += +!this.has(e), n[e] = bu && t === void 0 ? Ou : t, this;
}
//#endregion
//#region node_modules/lodash-es/_Hash.js
function Au(e) {
	var t = -1, n = e == null ? 0 : e.length;
	for (this.clear(); ++t < n;) {
		var r = e[t];
		this.set(r[0], r[1]);
	}
}
Au.prototype.clear = xu, Au.prototype.delete = Su, Au.prototype.get = Tu, Au.prototype.has = Du, Au.prototype.set = ku;
//#endregion
//#region node_modules/lodash-es/_listCacheClear.js
function ju() {
	this.__data__ = [], this.size = 0;
}
//#endregion
//#region node_modules/lodash-es/_assocIndexOf.js
function Mu(e, t) {
	for (var n = e.length; n--;) if (ll(e[n][0], t)) return n;
	return -1;
}
//#endregion
//#region node_modules/lodash-es/_listCacheDelete.js
var Nu = Array.prototype.splice;
function Pu(e) {
	var t = this.__data__, n = Mu(t, e);
	return n < 0 ? !1 : (n == t.length - 1 ? t.pop() : Nu.call(t, n, 1), --this.size, !0);
}
//#endregion
//#region node_modules/lodash-es/_listCacheGet.js
function Fu(e) {
	var t = this.__data__, n = Mu(t, e);
	return n < 0 ? void 0 : t[n][1];
}
//#endregion
//#region node_modules/lodash-es/_listCacheHas.js
function Iu(e) {
	return Mu(this.__data__, e) > -1;
}
//#endregion
//#region node_modules/lodash-es/_listCacheSet.js
function Lu(e, t) {
	var n = this.__data__, r = Mu(n, e);
	return r < 0 ? (++this.size, n.push([e, t])) : n[r][1] = t, this;
}
//#endregion
//#region node_modules/lodash-es/_ListCache.js
function Ru(e) {
	var t = -1, n = e == null ? 0 : e.length;
	for (this.clear(); ++t < n;) {
		var r = e[t];
		this.set(r[0], r[1]);
	}
}
Ru.prototype.clear = ju, Ru.prototype.delete = Pu, Ru.prototype.get = Fu, Ru.prototype.has = Iu, Ru.prototype.set = Lu;
//#endregion
//#region node_modules/lodash-es/_Map.js
var zu = qc(ic, "Map");
//#endregion
//#region node_modules/lodash-es/_mapCacheClear.js
function Bu() {
	this.size = 0, this.__data__ = {
		hash: new Au(),
		map: new (zu || Ru)(),
		string: new Au()
	};
}
//#endregion
//#region node_modules/lodash-es/_isKeyable.js
function Vu(e) {
	var t = typeof e;
	return t == "string" || t == "number" || t == "symbol" || t == "boolean" ? e !== "__proto__" : e === null;
}
//#endregion
//#region node_modules/lodash-es/_getMapData.js
function Hu(e, t) {
	var n = e.__data__;
	return Vu(t) ? n[typeof t == "string" ? "string" : "hash"] : n.map;
}
//#endregion
//#region node_modules/lodash-es/_mapCacheDelete.js
function Uu(e) {
	var t = Hu(this, e).delete(e);
	return this.size -= +!!t, t;
}
//#endregion
//#region node_modules/lodash-es/_mapCacheGet.js
function Wu(e) {
	return Hu(this, e).get(e);
}
//#endregion
//#region node_modules/lodash-es/_mapCacheHas.js
function Gu(e) {
	return Hu(this, e).has(e);
}
//#endregion
//#region node_modules/lodash-es/_mapCacheSet.js
function Ku(e, t) {
	var n = Hu(this, e), r = n.size;
	return n.set(e, t), this.size += n.size == r ? 0 : 1, this;
}
//#endregion
//#region node_modules/lodash-es/_MapCache.js
function qu(e) {
	var t = -1, n = e == null ? 0 : e.length;
	for (this.clear(); ++t < n;) {
		var r = e[t];
		this.set(r[0], r[1]);
	}
}
qu.prototype.clear = Bu, qu.prototype.delete = Uu, qu.prototype.get = Wu, qu.prototype.has = Gu, qu.prototype.set = Ku;
//#endregion
//#region node_modules/lodash-es/toString.js
function Ju(e) {
	return e == null ? "" : Tc(e);
}
//#endregion
//#region node_modules/lodash-es/_getPrototype.js
var Yu = hu(Object.getPrototypeOf, Object), Xu = "[object Object]", Zu = Function.prototype, Qu = Object.prototype, $u = Zu.toString, ed = Qu.hasOwnProperty, td = $u.call(Object);
function nd(e) {
	if (!_c(e) || gc(e) != Xu) return !1;
	var t = Yu(e);
	if (t === null) return !0;
	var n = ed.call(t, "constructor") && t.constructor;
	return typeof n == "function" && n instanceof n && $u.call(n) == td;
}
//#endregion
//#region node_modules/lodash-es/_baseSlice.js
function rd(e, t, n) {
	var r = -1, i = e.length;
	t < 0 && (t = -t > i ? 0 : i + t), n = n > i ? i : n, n < 0 && (n += i), i = t > n ? 0 : n - t >>> 0, t >>>= 0;
	for (var a = Array(i); ++r < i;) a[r] = e[r + t];
	return a;
}
//#endregion
//#region node_modules/lodash-es/_castSlice.js
function id(e, t, n) {
	var r = e.length;
	return n = n === void 0 ? r : n, !t && n >= r ? e : rd(e, t, n);
}
//#endregion
//#region node_modules/lodash-es/_hasUnicode.js
var ad = RegExp("[\\u200d\\ud800-\\udfff\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff\\ufe0e\\ufe0f]");
function od(e) {
	return ad.test(e);
}
//#endregion
//#region node_modules/lodash-es/_asciiToArray.js
function sd(e) {
	return e.split("");
}
//#endregion
//#region node_modules/lodash-es/_unicodeToArray.js
var cd = "\\ud800-\\udfff", ld = "\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff", ud = "\\ufe0e\\ufe0f", dd = "[" + cd + "]", fd = "[" + ld + "]", pd = "\\ud83c[\\udffb-\\udfff]", md = "(?:" + fd + "|" + pd + ")", hd = "[^" + cd + "]", gd = "(?:\\ud83c[\\udde6-\\uddff]){2}", _d = "[\\ud800-\\udbff][\\udc00-\\udfff]", vd = "\\u200d", yd = md + "?", bd = "[" + ud + "]?", xd = "(?:" + vd + "(?:" + [
	hd,
	gd,
	_d
].join("|") + ")" + bd + yd + ")*", Sd = bd + yd + xd, Cd = "(?:" + [
	hd + fd + "?",
	fd,
	gd,
	_d,
	dd
].join("|") + ")", wd = RegExp(pd + "(?=" + pd + ")|" + Cd + Sd, "g");
function Td(e) {
	return e.match(wd) || [];
}
//#endregion
//#region node_modules/lodash-es/_stringToArray.js
function Ed(e) {
	return od(e) ? Td(e) : sd(e);
}
//#endregion
//#region node_modules/lodash-es/_createCaseFirst.js
function Dd(e) {
	return function(t) {
		t = Ju(t);
		var n = od(t) ? Ed(t) : void 0, r = n ? n[0] : t.charAt(0), i = n ? id(n, 1).join("") : t.slice(1);
		return r[e]() + i;
	};
}
//#endregion
//#region node_modules/lodash-es/upperFirst.js
var Od = Dd("toUpperCase");
//#endregion
//#region node_modules/lodash-es/_stackClear.js
function kd() {
	this.__data__ = new Ru(), this.size = 0;
}
//#endregion
//#region node_modules/lodash-es/_stackDelete.js
function Ad(e) {
	var t = this.__data__, n = t.delete(e);
	return this.size = t.size, n;
}
//#endregion
//#region node_modules/lodash-es/_stackGet.js
function jd(e) {
	return this.__data__.get(e);
}
//#endregion
//#region node_modules/lodash-es/_stackHas.js
function Md(e) {
	return this.__data__.has(e);
}
//#endregion
//#region node_modules/lodash-es/_stackSet.js
var Nd = 200;
function Pd(e, t) {
	var n = this.__data__;
	if (n instanceof Ru) {
		var r = n.__data__;
		if (!zu || r.length < Nd - 1) return r.push([e, t]), this.size = ++n.size, this;
		n = this.__data__ = new qu(r);
	}
	return n.set(e, t), this.size = n.size, this;
}
//#endregion
//#region node_modules/lodash-es/_Stack.js
function Fd(e) {
	var t = this.__data__ = new Ru(e);
	this.size = t.size;
}
Fd.prototype.clear = kd, Fd.prototype.delete = Ad, Fd.prototype.get = jd, Fd.prototype.has = Md, Fd.prototype.set = Pd;
//#endregion
//#region node_modules/lodash-es/_cloneBuffer.js
var Id = typeof exports == "object" && exports && !exports.nodeType && exports, Ld = Id && typeof module == "object" && module && !module.nodeType && module, Rd = Ld && Ld.exports === Id ? ic.Buffer : void 0, zd = Rd ? Rd.allocUnsafe : void 0;
function Bd(e, t) {
	if (t) return e.slice();
	var n = e.length, r = zd ? zd(n) : new e.constructor(n);
	return e.copy(r), r;
}
//#endregion
//#region node_modules/lodash-es/_Uint8Array.js
var Vd = ic.Uint8Array;
//#endregion
//#region node_modules/lodash-es/_cloneArrayBuffer.js
function Hd(e) {
	var t = new e.constructor(e.byteLength);
	return new Vd(t).set(new Vd(e)), t;
}
//#endregion
//#region node_modules/lodash-es/_cloneTypedArray.js
function Ud(e, t) {
	var n = t ? Hd(e.buffer) : e.buffer;
	return new e.constructor(n, e.byteOffset, e.length);
}
//#endregion
//#region node_modules/lodash-es/_initCloneObject.js
function Wd(e) {
	return typeof e.constructor == "function" && !Sl(e) ? Yc(Yu(e)) : {};
}
//#endregion
//#region node_modules/lodash-es/_createBaseFor.js
function Gd(e) {
	return function(t, n, r) {
		for (var i = -1, a = Object(t), o = r(t), s = o.length; s--;) {
			var c = o[e ? s : ++i];
			if (n(a[c], c, a) === !1) break;
		}
		return t;
	};
}
//#endregion
//#region node_modules/lodash-es/_baseFor.js
var Kd = Gd();
//#endregion
//#region node_modules/lodash-es/_assignMergeValue.js
function qd(e, t, n) {
	(n !== void 0 && !ll(e[t], n) || n === void 0 && !(t in e)) && cl(e, t, n);
}
//#endregion
//#region node_modules/lodash-es/isArrayLikeObject.js
function Jd(e) {
	return _c(e) && vl(e);
}
//#endregion
//#region node_modules/lodash-es/_safeGet.js
function Yd(e, t) {
	if ((t !== "constructor" || typeof e[t] != "function") && t != "__proto__") return e[t];
}
//#endregion
//#region node_modules/lodash-es/toPlainObject.js
function Xd(e) {
	return fl(e, yu(e));
}
//#endregion
//#region node_modules/lodash-es/_baseMergeDeep.js
function Zd(e, t, n, r, i, a, o) {
	var s = Yd(e, n), c = Yd(t, n), l = o.get(c);
	if (l) {
		qd(e, n, l);
		return;
	}
	var u = a ? a(s, c, n + "", e, t, o) : void 0, d = u === void 0;
	if (d) {
		var f = xc(c), p = !f && Pl(c), m = !f && !p && fu(c);
		u = c, f || p || m ? xc(s) ? u = s : Jd(s) ? u = Zc(s) : p ? (d = !1, u = Bd(c, !0)) : m ? (d = !1, u = Ud(c, !0)) : u = [] : nd(c) || kl(c) ? (u = s, kl(s) ? u = Xd(s) : (!Ec(s) || Mc(s)) && (u = Wd(c))) : d = !1;
	}
	d && (o.set(c, u), i(u, c, r, a, o), o.delete(c)), qd(e, n, u);
}
//#endregion
//#region node_modules/lodash-es/_baseMerge.js
function Qd(e, t, n, r, i) {
	e !== t && Kd(t, function(a, o) {
		if (i ||= new Fd(), Ec(a)) Zd(e, t, o, n, Qd, r, i);
		else {
			var s = r ? r(Yd(e, o), a, o + "", e, t, i) : void 0;
			s === void 0 && (s = a), qd(e, o, s);
		}
	}, yu);
}
//#endregion
//#region node_modules/lodash-es/merge.js
var $d = bl(function(e, t, n) {
	Qd(e, t, n);
});
//#endregion
//#region node_modules/naive-ui/es/_utils/naive/warn.mjs
function ef(e, t) {
	console.error(`[naive/${e}]: ${t}`);
}
function tf(e, t) {
	throw Error(`[naive/${e}]: ${t}`);
}
//#endregion
//#region node_modules/naive-ui/es/_utils/vue/keysOf.mjs
function nf(e) {
	return Object.keys(e);
}
//#endregion
//#region node_modules/naive-ui/es/_utils/vue/create-injection-key.mjs
function rf(e) {
	return e;
}
//#endregion
//#region node_modules/naive-ui/es/config-provider/src/context.mjs
var af = rf("n-config-provider");
//#endregion
//#region node_modules/naive-ui/es/_mixins/use-config.mjs
function of(e = {}, t = { defaultBordered: !0 }) {
	let n = Rn(af, null);
	return {
		inlineThemeDisabled: n?.inlineThemeDisabled,
		mergedRtlRef: n?.mergedRtlRef,
		mergedComponentPropsRef: n?.mergedComponentPropsRef,
		mergedBreakpointsRef: n?.mergedBreakpointsRef,
		mergedBorderedRef: L(() => {
			let { bordered: r } = e;
			return r === void 0 ? n?.mergedBorderedRef.value ?? t.defaultBordered ?? !0 : r;
		}),
		mergedClsPrefixRef: n ? n.mergedClsPrefixRef : /* @__PURE__ */ qt("n"),
		namespaceRef: L(() => n?.mergedNamespaceRef.value)
	};
}
//#endregion
//#region node_modules/naive-ui/es/_mixins/common.mjs
var sf = "naive-ui-style", cf = {
	fontFamily: "v-sans, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\"",
	fontFamilyMono: "v-mono, SFMono-Regular, Menlo, Consolas, Courier, monospace",
	fontWeight: "400",
	fontWeightStrong: "500",
	cubicBezierEaseInOut: "cubic-bezier(.4, 0, .2, 1)",
	cubicBezierEaseOut: "cubic-bezier(0, 0, .2, 1)",
	cubicBezierEaseIn: "cubic-bezier(.4, 0, 1, 1)",
	borderRadius: "3px",
	borderRadiusSmall: "2px",
	fontSize: "14px",
	fontSizeMini: "12px",
	fontSizeTiny: "12px",
	fontSizeSmall: "14px",
	fontSizeMedium: "14px",
	fontSizeLarge: "15px",
	fontSizeHuge: "16px",
	lineHeight: "1.6",
	heightMini: "16px",
	heightTiny: "22px",
	heightSmall: "28px",
	heightMedium: "34px",
	heightLarge: "40px",
	heightHuge: "46px"
}, { fontSize: lf, fontFamily: uf, lineHeight: df } = cf, ff = z("body", `
 margin: 0;
 font-size: ${lf};
 font-family: ${uf};
 line-height: ${df};
 -webkit-text-size-adjust: 100%;
 -webkit-tap-highlight-color: transparent;
`, [z("input", "\n font-family: inherit;\n font-size: inherit;\n ")]), pf = "@css-render/vue3-ssr";
function mf(e, t) {
	return `<style cssr-id="${e}">\n${t}\n</style>`;
}
function hf(e, t, n) {
	let { styles: r, ids: i } = n;
	i.has(e) || r !== null && (i.add(e), r.push(mf(e, t)));
}
var gf = typeof document < "u";
function _f() {
	if (gf) return;
	let e = Rn(pf, null);
	if (e !== null) return {
		adapter: (t, n) => hf(t, n, e),
		context: e
	};
}
//#endregion
//#region node_modules/naive-ui/es/_mixins/use-style.mjs
function vf(e, t, n) {
	if (!t) return;
	let r = _f(), i = Rn(af, null), a = () => {
		let a = n.value;
		t.mount({
			id: a === void 0 ? e : a + e,
			head: !0,
			anchorMetaName: sf,
			props: { bPrefix: a ? `.${a}-` : void 0 },
			ssr: r,
			parent: i?.styleMountTarget
		}), i?.preflightStyleDisabled || ff.mount({
			id: "n-global",
			head: !0,
			anchorMetaName: sf,
			ssr: r,
			parent: i?.styleMountTarget
		});
	};
	r ? a() : br(a);
}
//#endregion
//#region node_modules/naive-ui/es/vue-jsx-vapor/vdom.mjs
var yf = /* @__PURE__ */ new WeakMap();
function bf(e) {
	let t = ea();
	if (t) {
		yf.has(t) || yf.set(t, {});
		let n = yf.get(t);
		return n[e] || (n[e] = []);
	}
	return [];
}
function G(e, t = 1) {
	let n = zi, r = !1;
	return typeof e == "function" && (r = !0, F(), n = Ni, e = e()), Pi(e) ? r ? Ni(xf(e)) : xf(e) : Array.isArray(e) ? r ? I(Ci, null, e.map((e) => G(() => e)), -2) : Ri(Ci, null, e.slice()) : e == null || typeof e == "boolean" ? n(Ti) : n(wi, null, String(e), t);
}
function xf(e) {
	return e.el === null && e.patchFlag !== -1 || e.memo ? e : Hi(e);
}
var Sf = (e) => typeof e == "function" || Object.prototype.toString.call(e) === "[object Object]" && !Pi(e) ? e : { default: Fn(() => [G(() => e)]) }, K = (e) => he(e) || null;
//#endregion
//#region node_modules/seemly/es/dom/get-precise-event-target.js
function Cf(e) {
	return e.composedPath()[0] || null;
}
//#endregion
//#region node_modules/seemly/es/css/index.js
function wf(e) {
	return typeof e == "string" ? e.endsWith("px") ? Number(e.slice(0, e.length - 2)) : Number(e) : e;
}
function Tf(e) {
	if (e != null) return typeof e == "number" ? `${e}px` : e.endsWith("px") ? e : `${e}px`;
}
function Ef(e, t) {
	let n = e.trim().split(/\s+/g), r = { top: n[0] };
	switch (n.length) {
		case 1:
			r.right = n[0], r.bottom = n[0], r.left = n[0];
			break;
		case 2:
			r.right = n[1], r.left = n[1], r.bottom = n[0];
			break;
		case 3:
			r.right = n[1], r.bottom = n[2], r.left = n[1];
			break;
		case 4:
			r.right = n[1], r.bottom = n[2], r.left = n[3];
			break;
		default: throw Error("[seemly/getMargin]:" + e + " is not a valid value.");
	}
	return t === void 0 ? r : r[t];
}
//#endregion
//#region node_modules/seemly/es/color/colors.js
var Df = {
	aliceblue: "#F0F8FF",
	antiquewhite: "#FAEBD7",
	aqua: "#0FF",
	aquamarine: "#7FFFD4",
	azure: "#F0FFFF",
	beige: "#F5F5DC",
	bisque: "#FFE4C4",
	black: "#000",
	blanchedalmond: "#FFEBCD",
	blue: "#00F",
	blueviolet: "#8A2BE2",
	brown: "#A52A2A",
	burlywood: "#DEB887",
	cadetblue: "#5F9EA0",
	chartreuse: "#7FFF00",
	chocolate: "#D2691E",
	coral: "#FF7F50",
	cornflowerblue: "#6495ED",
	cornsilk: "#FFF8DC",
	crimson: "#DC143C",
	cyan: "#0FF",
	darkblue: "#00008B",
	darkcyan: "#008B8B",
	darkgoldenrod: "#B8860B",
	darkgray: "#A9A9A9",
	darkgrey: "#A9A9A9",
	darkgreen: "#006400",
	darkkhaki: "#BDB76B",
	darkmagenta: "#8B008B",
	darkolivegreen: "#556B2F",
	darkorange: "#FF8C00",
	darkorchid: "#9932CC",
	darkred: "#8B0000",
	darksalmon: "#E9967A",
	darkseagreen: "#8FBC8F",
	darkslateblue: "#483D8B",
	darkslategray: "#2F4F4F",
	darkslategrey: "#2F4F4F",
	darkturquoise: "#00CED1",
	darkviolet: "#9400D3",
	deeppink: "#FF1493",
	deepskyblue: "#00BFFF",
	dimgray: "#696969",
	dimgrey: "#696969",
	dodgerblue: "#1E90FF",
	firebrick: "#B22222",
	floralwhite: "#FFFAF0",
	forestgreen: "#228B22",
	fuchsia: "#F0F",
	gainsboro: "#DCDCDC",
	ghostwhite: "#F8F8FF",
	gold: "#FFD700",
	goldenrod: "#DAA520",
	gray: "#808080",
	grey: "#808080",
	green: "#008000",
	greenyellow: "#ADFF2F",
	honeydew: "#F0FFF0",
	hotpink: "#FF69B4",
	indianred: "#CD5C5C",
	indigo: "#4B0082",
	ivory: "#FFFFF0",
	khaki: "#F0E68C",
	lavender: "#E6E6FA",
	lavenderblush: "#FFF0F5",
	lawngreen: "#7CFC00",
	lemonchiffon: "#FFFACD",
	lightblue: "#ADD8E6",
	lightcoral: "#F08080",
	lightcyan: "#E0FFFF",
	lightgoldenrodyellow: "#FAFAD2",
	lightgray: "#D3D3D3",
	lightgrey: "#D3D3D3",
	lightgreen: "#90EE90",
	lightpink: "#FFB6C1",
	lightsalmon: "#FFA07A",
	lightseagreen: "#20B2AA",
	lightskyblue: "#87CEFA",
	lightslategray: "#778899",
	lightslategrey: "#778899",
	lightsteelblue: "#B0C4DE",
	lightyellow: "#FFFFE0",
	lime: "#0F0",
	limegreen: "#32CD32",
	linen: "#FAF0E6",
	magenta: "#F0F",
	maroon: "#800000",
	mediumaquamarine: "#66CDAA",
	mediumblue: "#0000CD",
	mediumorchid: "#BA55D3",
	mediumpurple: "#9370DB",
	mediumseagreen: "#3CB371",
	mediumslateblue: "#7B68EE",
	mediumspringgreen: "#00FA9A",
	mediumturquoise: "#48D1CC",
	mediumvioletred: "#C71585",
	midnightblue: "#191970",
	mintcream: "#F5FFFA",
	mistyrose: "#FFE4E1",
	moccasin: "#FFE4B5",
	navajowhite: "#FFDEAD",
	navy: "#000080",
	oldlace: "#FDF5E6",
	olive: "#808000",
	olivedrab: "#6B8E23",
	orange: "#FFA500",
	orangered: "#FF4500",
	orchid: "#DA70D6",
	palegoldenrod: "#EEE8AA",
	palegreen: "#98FB98",
	paleturquoise: "#AFEEEE",
	palevioletred: "#DB7093",
	papayawhip: "#FFEFD5",
	peachpuff: "#FFDAB9",
	peru: "#CD853F",
	pink: "#FFC0CB",
	plum: "#DDA0DD",
	powderblue: "#B0E0E6",
	purple: "#800080",
	rebeccapurple: "#663399",
	red: "#F00",
	rosybrown: "#BC8F8F",
	royalblue: "#4169E1",
	saddlebrown: "#8B4513",
	salmon: "#FA8072",
	sandybrown: "#F4A460",
	seagreen: "#2E8B57",
	seashell: "#FFF5EE",
	sienna: "#A0522D",
	silver: "#C0C0C0",
	skyblue: "#87CEEB",
	slateblue: "#6A5ACD",
	slategray: "#708090",
	slategrey: "#708090",
	snow: "#FFFAFA",
	springgreen: "#00FF7F",
	steelblue: "#4682B4",
	tan: "#D2B48C",
	teal: "#008080",
	thistle: "#D8BFD8",
	tomato: "#FF6347",
	turquoise: "#40E0D0",
	violet: "#EE82EE",
	wheat: "#F5DEB3",
	white: "#FFF",
	whitesmoke: "#F5F5F5",
	yellow: "#FF0",
	yellowgreen: "#9ACD32",
	transparent: "#0000"
};
//#endregion
//#region node_modules/seemly/es/color/convert.js
function Of(e, t, n) {
	t /= 100, n /= 100;
	let r = (r, i = (r + e / 60) % 6) => n - n * t * Math.max(Math.min(i, 4 - i, 1), 0);
	return [
		r(5) * 255,
		r(3) * 255,
		r(1) * 255
	];
}
function kf(e, t, n) {
	t /= 100, n /= 100;
	let r = t * Math.min(n, 1 - n), i = (t, i = (t + e / 30) % 12) => n - r * Math.max(Math.min(i - 3, 9 - i, 1), -1);
	return [
		i(0) * 255,
		i(8) * 255,
		i(4) * 255
	];
}
//#endregion
//#region node_modules/seemly/es/color/index.js
var Af = "^\\s*", jf = "\\s*$", Mf = "\\s*((\\.\\d+)|(\\d+(\\.\\d*)?))%\\s*", Nf = "\\s*((\\.\\d+)|(\\d+(\\.\\d*)?))\\s*", Pf = "([0-9A-Fa-f])", Ff = "([0-9A-Fa-f]{2})", If = RegExp(`${Af}hsl\\s*\\(${Nf},${Mf},${Mf}\\)${jf}`), Lf = RegExp(`${Af}hsv\\s*\\(${Nf},${Mf},${Mf}\\)${jf}`), Rf = RegExp(`${Af}hsla\\s*\\(${Nf},${Mf},${Mf},${Nf}\\)${jf}`), zf = RegExp(`${Af}hsva\\s*\\(${Nf},${Mf},${Mf},${Nf}\\)${jf}`), Bf = RegExp(`${Af}rgb\\s*\\(${Nf},${Nf},${Nf}\\)${jf}`), Vf = RegExp(`${Af}rgba\\s*\\(${Nf},${Nf},${Nf},${Nf}\\)${jf}`), Hf = RegExp(`${Af}#${Pf}${Pf}${Pf}${jf}`), Uf = RegExp(`${Af}#${Ff}${Ff}${Ff}${jf}`), Wf = RegExp(`${Af}#${Pf}${Pf}${Pf}${Pf}${jf}`), Gf = RegExp(`${Af}#${Ff}${Ff}${Ff}${Ff}${jf}`);
function Kf(e) {
	return parseInt(e, 16);
}
function qf(e) {
	try {
		let t;
		if (t = Rf.exec(e)) return [
			ep(t[1]),
			np(t[5]),
			np(t[9]),
			$f(t[13])
		];
		if (t = If.exec(e)) return [
			ep(t[1]),
			np(t[5]),
			np(t[9]),
			1
		];
		throw Error(`[seemly/hsla]: Invalid color value ${e}.`);
	} catch (e) {
		throw e;
	}
}
function Jf(e) {
	try {
		let t;
		if (t = zf.exec(e)) return [
			ep(t[1]),
			np(t[5]),
			np(t[9]),
			$f(t[13])
		];
		if (t = Lf.exec(e)) return [
			ep(t[1]),
			np(t[5]),
			np(t[9]),
			1
		];
		throw Error(`[seemly/hsva]: Invalid color value ${e}.`);
	} catch (e) {
		throw e;
	}
}
function Yf(e) {
	try {
		let t;
		if (t = Uf.exec(e)) return [
			Kf(t[1]),
			Kf(t[2]),
			Kf(t[3]),
			1
		];
		if (t = Bf.exec(e)) return [
			tp(t[1]),
			tp(t[5]),
			tp(t[9]),
			1
		];
		if (t = Vf.exec(e)) return [
			tp(t[1]),
			tp(t[5]),
			tp(t[9]),
			$f(t[13])
		];
		if (t = Hf.exec(e)) return [
			Kf(t[1] + t[1]),
			Kf(t[2] + t[2]),
			Kf(t[3] + t[3]),
			1
		];
		if (t = Gf.exec(e)) return [
			Kf(t[1]),
			Kf(t[2]),
			Kf(t[3]),
			$f(Kf(t[4]) / 255)
		];
		if (t = Wf.exec(e)) return [
			Kf(t[1] + t[1]),
			Kf(t[2] + t[2]),
			Kf(t[3] + t[3]),
			$f(Kf(t[4] + t[4]) / 255)
		];
		if (e in Df) return Yf(Df[e]);
		if (If.test(e) || Rf.test(e)) {
			let [t, n, r, i] = qf(e);
			return [...kf(t, n, r), i];
		}
		if (Lf.test(e) || zf.test(e)) {
			let [t, n, r, i] = Jf(e);
			return [...Of(t, n, r), i];
		}
		throw Error(`[seemly/rgba]: Invalid color value ${e}.`);
	} catch (e) {
		throw e;
	}
}
function Xf(e) {
	return e > 1 ? 1 : e < 0 ? 0 : e;
}
function Zf(e, t, n, r) {
	return `rgba(${tp(e)}, ${tp(t)}, ${tp(n)}, ${Xf(r)})`;
}
function Qf(e, t, n, r, i) {
	return tp((e * t * (1 - r) + n * r) / i);
}
function q(e, t) {
	Array.isArray(e) || (e = Yf(e)), Array.isArray(t) || (t = Yf(t));
	let n = e[3], r = t[3], i = $f(n + r - n * r);
	return Zf(Qf(e[0], n, t[0], r, i), Qf(e[1], n, t[1], r, i), Qf(e[2], n, t[2], r, i), i);
}
function J(e, t) {
	let [n, r, i, a = 1] = Array.isArray(e) ? e : Yf(e);
	return typeof t.alpha == "number" ? Zf(n, r, i, t.alpha) : Zf(n, r, i, a);
}
function Y(e, t) {
	let [n, r, i, a = 1] = Array.isArray(e) ? e : Yf(e), { lightness: o = 1, alpha: s = 1 } = t;
	return rp([
		n * o,
		r * o,
		i * o,
		a * s
	]);
}
function $f(e) {
	let t = Math.round(Number(e) * 100) / 100;
	return t > 1 ? 1 : t < 0 ? 0 : t;
}
function ep(e) {
	let t = Math.round(Number(e));
	return t >= 360 || t < 0 ? 0 : t;
}
function tp(e) {
	let t = Math.round(Number(e));
	return t > 255 ? 255 : t < 0 ? 0 : t;
}
function np(e) {
	let t = Math.round(Number(e));
	return t > 100 ? 100 : t < 0 ? 0 : t;
}
function rp(e) {
	let [t, n, r] = e;
	return 3 in e ? `rgba(${tp(t)}, ${tp(n)}, ${tp(r)}, ${$f(e[3])})` : `rgba(${tp(t)}, ${tp(n)}, ${tp(r)}, 1)`;
}
//#endregion
//#region node_modules/naive-ui/es/_styles/common/dark.mjs
var X = {
	neutralBase: "#000",
	neutralInvertBase: "#fff",
	neutralTextBase: "#fff",
	neutralPopover: "rgb(72, 72, 78)",
	neutralCard: "rgb(24, 24, 28)",
	neutralModal: "rgb(44, 44, 50)",
	neutralBody: "rgb(16, 16, 20)",
	alpha1: "0.9",
	alpha2: "0.82",
	alpha3: "0.52",
	alpha4: "0.38",
	alpha5: "0.28",
	alphaClose: "0.52",
	alphaDisabled: "0.38",
	alphaDisabledInput: "0.06",
	alphaPending: "0.09",
	alphaTablePending: "0.06",
	alphaTableStriped: "0.05",
	alphaPressed: "0.05",
	alphaAvatar: "0.18",
	alphaRail: "0.2",
	alphaProgressRail: "0.12",
	alphaBorder: "0.24",
	alphaDivider: "0.09",
	alphaInput: "0.1",
	alphaAction: "0.06",
	alphaTab: "0.04",
	alphaScrollbar: "0.2",
	alphaScrollbarHover: "0.3",
	alphaCode: "0.12",
	alphaTag: "0.2",
	primaryHover: "#7fe7c4",
	primaryDefault: "#63e2b7",
	primaryActive: "#5acea7",
	primarySuppl: "rgb(42, 148, 125)",
	infoHover: "#8acbec",
	infoDefault: "#70c0e8",
	infoActive: "#66afd3",
	infoSuppl: "rgb(56, 137, 197)",
	errorHover: "#e98b8b",
	errorDefault: "#e88080",
	errorActive: "#e57272",
	errorSuppl: "rgb(208, 58, 82)",
	warningHover: "#f5d599",
	warningDefault: "#f2c97d",
	warningActive: "#e6c260",
	warningSuppl: "rgb(240, 138, 0)",
	successHover: "#7fe7c4",
	successDefault: "#63e2b7",
	successActive: "#5acea7",
	successSuppl: "rgb(42, 148, 125)"
}, ip = Yf(X.neutralBase), ap = Yf(X.neutralInvertBase), op = `rgba(${ap.slice(0, 3).join(", ")}, `;
function Z(e) {
	return `${op + String(e)})`;
}
function sp(e) {
	let t = Array.from(ap);
	return t[3] = Number(e), q(ip, t);
}
var Q = {
	name: "common",
	...cf,
	baseColor: X.neutralBase,
	primaryColor: X.primaryDefault,
	primaryColorHover: X.primaryHover,
	primaryColorPressed: X.primaryActive,
	primaryColorSuppl: X.primarySuppl,
	infoColor: X.infoDefault,
	infoColorHover: X.infoHover,
	infoColorPressed: X.infoActive,
	infoColorSuppl: X.infoSuppl,
	successColor: X.successDefault,
	successColorHover: X.successHover,
	successColorPressed: X.successActive,
	successColorSuppl: X.successSuppl,
	warningColor: X.warningDefault,
	warningColorHover: X.warningHover,
	warningColorPressed: X.warningActive,
	warningColorSuppl: X.warningSuppl,
	errorColor: X.errorDefault,
	errorColorHover: X.errorHover,
	errorColorPressed: X.errorActive,
	errorColorSuppl: X.errorSuppl,
	textColorBase: X.neutralTextBase,
	textColor1: Z(X.alpha1),
	textColor2: Z(X.alpha2),
	textColor3: Z(X.alpha3),
	textColorDisabled: Z(X.alpha4),
	placeholderColor: Z(X.alpha4),
	placeholderColorDisabled: Z(X.alpha5),
	iconColor: Z(X.alpha4),
	iconColorDisabled: Z(X.alpha5),
	iconColorHover: Z(Number(X.alpha4) * 1.25),
	iconColorPressed: Z(Number(X.alpha4) * .8),
	opacity1: X.alpha1,
	opacity2: X.alpha2,
	opacity3: X.alpha3,
	opacity4: X.alpha4,
	opacity5: X.alpha5,
	dividerColor: Z(X.alphaDivider),
	borderColor: Z(X.alphaBorder),
	closeIconColorHover: Z(Number(X.alphaClose)),
	closeIconColor: Z(Number(X.alphaClose)),
	closeIconColorPressed: Z(Number(X.alphaClose)),
	closeColorHover: "rgba(255, 255, 255, .12)",
	closeColorPressed: "rgba(255, 255, 255, .08)",
	clearColor: Z(X.alpha4),
	clearColorHover: Y(Z(X.alpha4), { alpha: 1.25 }),
	clearColorPressed: Y(Z(X.alpha4), { alpha: .8 }),
	scrollbarColor: Z(X.alphaScrollbar),
	scrollbarColorHover: Z(X.alphaScrollbarHover),
	scrollbarWidth: "5px",
	scrollbarHeight: "5px",
	scrollbarBorderRadius: "5px",
	progressRailColor: Z(X.alphaProgressRail),
	railColor: Z(X.alphaRail),
	popoverColor: X.neutralPopover,
	tableColor: X.neutralCard,
	cardColor: X.neutralCard,
	modalColor: X.neutralModal,
	bodyColor: X.neutralBody,
	tagColor: sp(X.alphaTag),
	avatarColor: Z(X.alphaAvatar),
	invertedColor: X.neutralBase,
	inputColor: Z(X.alphaInput),
	codeColor: Z(X.alphaCode),
	tabColor: Z(X.alphaTab),
	actionColor: Z(X.alphaAction),
	tableHeaderColor: Z(X.alphaAction),
	hoverColor: Z(X.alphaPending),
	tableColorHover: Z(X.alphaTablePending),
	tableColorStriped: Z(X.alphaTableStriped),
	pressedColor: Z(X.alphaPressed),
	opacityDisabled: X.alphaDisabled,
	inputColorDisabled: Z(X.alphaDisabledInput),
	buttonColor2: "rgba(255, 255, 255, .08)",
	buttonColor2Hover: "rgba(255, 255, 255, .12)",
	buttonColor2Pressed: "rgba(255, 255, 255, .08)",
	boxShadow1: "0 1px 2px -2px rgba(0, 0, 0, .24), 0 3px 6px 0 rgba(0, 0, 0, .18), 0 5px 12px 4px rgba(0, 0, 0, .12)",
	boxShadow2: "0 3px 6px -4px rgba(0, 0, 0, .24), 0 6px 12px 0 rgba(0, 0, 0, .16), 0 9px 18px 8px rgba(0, 0, 0, .10)",
	boxShadow3: "0 6px 16px -9px rgba(0, 0, 0, .08), 0 9px 28px 0 rgba(0, 0, 0, .05), 0 12px 48px 16px rgba(0, 0, 0, .03)"
}, $ = {
	neutralBase: "#FFF",
	neutralInvertBase: "#000",
	neutralTextBase: "#000",
	neutralPopover: "#fff",
	neutralCard: "#fff",
	neutralModal: "#fff",
	neutralBody: "#fff",
	alpha1: "0.82",
	alpha2: "0.72",
	alpha3: "0.38",
	alpha4: "0.24",
	alpha5: "0.18",
	alphaClose: "0.6",
	alphaDisabled: "0.5",
	alphaDisabledInput: "0.02",
	alphaPending: "0.05",
	alphaTablePending: "0.02",
	alphaPressed: "0.07",
	alphaAvatar: "0.2",
	alphaRail: "0.14",
	alphaProgressRail: ".08",
	alphaBorder: "0.12",
	alphaDivider: "0.06",
	alphaInput: "0",
	alphaAction: "0.02",
	alphaTab: "0.04",
	alphaScrollbar: "0.25",
	alphaScrollbarHover: "0.4",
	alphaCode: "0.05",
	alphaTag: "0.02",
	primaryHover: "#36ad6a",
	primaryDefault: "#18a058",
	primaryActive: "#0c7a43",
	primarySuppl: "#36ad6a",
	infoHover: "#4098fc",
	infoDefault: "#2080f0",
	infoActive: "#1060c9",
	infoSuppl: "#4098fc",
	errorHover: "#de576d",
	errorDefault: "#d03050",
	errorActive: "#ab1f3f",
	errorSuppl: "#de576d",
	warningHover: "#fcb040",
	warningDefault: "#f0a020",
	warningActive: "#c97c10",
	warningSuppl: "#fcb040",
	successHover: "#36ad6a",
	successDefault: "#18a058",
	successActive: "#0c7a43",
	successSuppl: "#36ad6a"
}, cp = Yf($.neutralBase), lp = Yf($.neutralInvertBase), up = `rgba(${lp.slice(0, 3).join(", ")}, `;
function dp(e) {
	return `${up + String(e)})`;
}
function fp(e) {
	let t = Array.from(lp);
	return t[3] = Number(e), q(cp, t);
}
var pp = {
	name: "common",
	...cf,
	baseColor: $.neutralBase,
	primaryColor: $.primaryDefault,
	primaryColorHover: $.primaryHover,
	primaryColorPressed: $.primaryActive,
	primaryColorSuppl: $.primarySuppl,
	infoColor: $.infoDefault,
	infoColorHover: $.infoHover,
	infoColorPressed: $.infoActive,
	infoColorSuppl: $.infoSuppl,
	successColor: $.successDefault,
	successColorHover: $.successHover,
	successColorPressed: $.successActive,
	successColorSuppl: $.successSuppl,
	warningColor: $.warningDefault,
	warningColorHover: $.warningHover,
	warningColorPressed: $.warningActive,
	warningColorSuppl: $.warningSuppl,
	errorColor: $.errorDefault,
	errorColorHover: $.errorHover,
	errorColorPressed: $.errorActive,
	errorColorSuppl: $.errorSuppl,
	textColorBase: $.neutralTextBase,
	textColor1: "rgb(31, 34, 37)",
	textColor2: "rgb(51, 54, 57)",
	textColor3: "rgb(118, 124, 130)",
	textColorDisabled: fp($.alpha4),
	placeholderColor: fp($.alpha4),
	placeholderColorDisabled: fp($.alpha5),
	iconColor: fp($.alpha4),
	iconColorHover: Y(fp($.alpha4), { lightness: .75 }),
	iconColorPressed: Y(fp($.alpha4), { lightness: .9 }),
	iconColorDisabled: fp($.alpha5),
	opacity1: $.alpha1,
	opacity2: $.alpha2,
	opacity3: $.alpha3,
	opacity4: $.alpha4,
	opacity5: $.alpha5,
	dividerColor: "rgb(239, 239, 245)",
	borderColor: "rgb(224, 224, 230)",
	closeIconColor: fp(Number($.alphaClose)),
	closeIconColorHover: fp(Number($.alphaClose)),
	closeIconColorPressed: fp(Number($.alphaClose)),
	closeColorHover: "rgba(0, 0, 0, .09)",
	closeColorPressed: "rgba(0, 0, 0, .13)",
	clearColor: fp($.alpha4),
	clearColorHover: Y(fp($.alpha4), { lightness: .75 }),
	clearColorPressed: Y(fp($.alpha4), { lightness: .9 }),
	scrollbarColor: dp($.alphaScrollbar),
	scrollbarColorHover: dp($.alphaScrollbarHover),
	scrollbarWidth: "5px",
	scrollbarHeight: "5px",
	scrollbarBorderRadius: "5px",
	progressRailColor: fp($.alphaProgressRail),
	railColor: "rgb(219, 219, 223)",
	popoverColor: $.neutralPopover,
	tableColor: $.neutralCard,
	cardColor: $.neutralCard,
	modalColor: $.neutralModal,
	bodyColor: $.neutralBody,
	tagColor: "#eee",
	avatarColor: fp($.alphaAvatar),
	invertedColor: "rgb(0, 20, 40)",
	inputColor: fp($.alphaInput),
	codeColor: "rgb(244, 244, 248)",
	tabColor: "rgb(247, 247, 250)",
	actionColor: "rgb(250, 250, 252)",
	tableHeaderColor: "rgb(250, 250, 252)",
	hoverColor: "rgb(243, 243, 245)",
	tableColorHover: "rgba(0, 0, 100, 0.03)",
	tableColorStriped: "rgba(0, 0, 100, 0.02)",
	pressedColor: "rgb(237, 237, 239)",
	opacityDisabled: $.alphaDisabled,
	inputColorDisabled: "rgb(250, 250, 252)",
	buttonColor2: "rgba(46, 51, 56, .05)",
	buttonColor2Hover: "rgba(46, 51, 56, .09)",
	buttonColor2Pressed: "rgba(46, 51, 56, .13)",
	boxShadow1: "0 1px 2px -2px rgba(0, 0, 0, .08), 0 3px 6px 0 rgba(0, 0, 0, .06), 0 5px 12px 4px rgba(0, 0, 0, .04)",
	boxShadow2: "0 3px 6px -4px rgba(0, 0, 0, .12), 0 6px 16px 0 rgba(0, 0, 0, .08), 0 9px 28px 8px rgba(0, 0, 0, .05)",
	boxShadow3: "0 6px 16px -9px rgba(0, 0, 0, .08), 0 9px 28px 0 rgba(0, 0, 0, .05), 0 12px 48px 16px rgba(0, 0, 0, .03)"
}, mp = {
	railInsetHorizontalBottom: "auto 2px 4px 2px",
	railInsetHorizontalTop: "4px 2px auto 2px",
	railInsetVerticalRight: "2px 4px 2px auto",
	railInsetVerticalLeft: "2px auto 2px 4px",
	railColor: "transparent"
};
//#endregion
//#region node_modules/naive-ui/es/_internal/scrollbar/styles/light.mjs
function hp(e) {
	let { scrollbarColor: t, scrollbarColorHover: n, scrollbarHeight: r, scrollbarWidth: i, scrollbarBorderRadius: a } = e;
	return {
		...mp,
		height: r,
		width: i,
		borderRadius: a,
		color: t,
		colorHover: n
	};
}
var gp = {
	name: "Scrollbar",
	common: pp,
	self: hp
}, _p = {
	name: "Scrollbar",
	common: Q,
	self: hp
}, vp = {
	iconSizeTiny: "28px",
	iconSizeSmall: "34px",
	iconSizeMedium: "40px",
	iconSizeLarge: "46px",
	iconSizeHuge: "52px"
};
//#endregion
//#region node_modules/naive-ui/es/empty/styles/light.mjs
function yp(e) {
	let { textColorDisabled: t, iconColor: n, textColor2: r, fontSizeTiny: i, fontSizeSmall: a, fontSizeMedium: o, fontSizeLarge: s, fontSizeHuge: c } = e;
	return {
		...vp,
		fontSizeTiny: i,
		fontSizeSmall: a,
		fontSizeMedium: o,
		fontSizeLarge: s,
		fontSizeHuge: c,
		textColor: t,
		iconColor: n,
		extraTextColor: r
	};
}
var bp = {
	name: "Empty",
	common: pp,
	self: yp
}, xp = {
	name: "Empty",
	common: Q,
	self: yp
};
//#endregion
//#region node_modules/naive-ui/es/_mixins/use-css-vars-class.mjs
function Sp(e, t, n, r) {
	n || tf("useThemeClass", "cssVarsRef is not passed");
	let i = Rn(af, null), a = i?.mergedThemeHashRef, o = i?.styleMountTarget, s = /* @__PURE__ */ N(""), c = _f(), l, u = `__${e}`, d = () => {
		let e = u, i = t ? t.value : void 0, d = a?.value;
		d && (e += `-${d}`), i && (e += `-${i}`);
		let { themeOverrides: f, builtinThemeOverrides: p } = r;
		f && (e += `-${ns(JSON.stringify(f))}`), p && (e += `-${ns(JSON.stringify(p))}`), s.value = e, l = () => {
			let t = n.value, r = "";
			for (let e in t) r += `${e}: ${t[e]};`;
			z(`.${e}`, r).mount({
				id: e,
				ssr: c,
				parent: o
			}), l = void 0;
		};
	};
	return Vn(() => {
		d();
	}), {
		themeClass: s,
		onRender: () => {
			l?.();
		}
	};
}
//#endregion
//#region node_modules/naive-ui/es/_mixins/use-theme.mjs
function Cp(e) {
	return e;
}
function wp(e, t, n, r, i, a) {
	let o = _f(), s = Rn(af, null);
	if (n) {
		let e = () => {
			let e = a?.value;
			n.mount({
				id: e === void 0 ? t : e + t,
				head: !0,
				props: { bPrefix: e ? `.${e}-` : void 0 },
				anchorMetaName: sf,
				ssr: o,
				parent: s?.styleMountTarget
			}), s?.preflightStyleDisabled || ff.mount({
				id: "n-global",
				head: !0,
				anchorMetaName: sf,
				ssr: o,
				parent: s?.styleMountTarget
			});
		};
		o ? e() : br(e);
	}
	return L(() => {
		let { theme: { common: t, self: n, peers: a = {} } = {}, themeOverrides: o = {}, builtinThemeOverrides: c = {} } = i, { common: l, peers: u } = o, { common: d = void 0, [e]: { common: f = void 0, self: p = void 0, peers: m = {} } = {} } = s?.mergedThemeRef.value || {}, { common: h = void 0, [e]: g = {} } = s?.mergedThemeOverridesRef.value || {}, { common: _, peers: v = {} } = g, y = $d({}, t || f || d || r.common, h, _, l);
		return {
			common: y,
			self: $d((n || p || r.self)?.(y), c, g, o),
			peers: $d({}, r.peers, m, a),
			peerOverrides: $d({}, c.peers, v, u)
		};
	});
}
wp.props = {
	theme: Object,
	themeOverrides: Object,
	builtinThemeOverrides: Object
};
//#endregion
//#region node_modules/naive-ui/es/_internal/icon/src/styles/index.cssr.mjs
var Tp = B("base-icon", "\n height: 1em;\n width: 1em;\n line-height: 1em;\n text-align: center;\n display: inline-block;\n position: relative;\n fill: currentColor;\n", [z("svg", "\n height: 1em;\n width: 1em;\n ")]), Ep = [
	"onClick",
	"onMousedown",
	"onMouseup",
	"role",
	"aria-label",
	"aria-hidden",
	"aria-disabled"
], Dp = /* @__PURE__ */ P({
	name: "BaseIcon",
	props: {
		role: String,
		ariaLabel: String,
		ariaDisabled: {
			type: Boolean,
			default: void 0
		},
		ariaHidden: {
			type: Boolean,
			default: void 0
		},
		clsPrefix: {
			type: String,
			required: !0
		},
		onClick: Function,
		onMousedown: Function,
		onMouseup: Function
	},
	setup(e) {
		vf("-base-icon", Tp, /* @__PURE__ */ tn(e, "clsPrefix"));
	},
	render() {
		return F(), I("i", {
			class: K(`${this.clsPrefix}-base-icon`),
			onClick: this.onClick,
			onMousedown: this.onMousedown,
			onMouseup: this.onMouseup,
			role: this.role,
			"aria-label": this.ariaLabel,
			"aria-hidden": this.ariaHidden,
			"aria-disabled": this.ariaDisabled
		}, [G(() => this.$slots.default?.())], 42, Ep);
	}
}), Op = {
	height: "calc(var(--n-option-height) * 7.6)",
	paddingTiny: "4px 0",
	paddingSmall: "4px 0",
	paddingMedium: "4px 0",
	paddingLarge: "4px 0",
	paddingHuge: "4px 0",
	optionPaddingTiny: "0 12px",
	optionPaddingSmall: "0 12px",
	optionPaddingMedium: "0 12px",
	optionPaddingLarge: "0 12px",
	optionPaddingHuge: "0 12px",
	loadingSize: "18px"
};
//#endregion
//#region node_modules/naive-ui/es/_internal/select-menu/styles/light.mjs
function kp(e) {
	let { borderRadius: t, popoverColor: n, textColor3: r, dividerColor: i, textColor2: a, primaryColorPressed: o, textColorDisabled: s, primaryColor: c, opacityDisabled: l, hoverColor: u, fontSizeTiny: d, fontSizeSmall: f, fontSizeMedium: p, fontSizeLarge: m, fontSizeHuge: h, heightTiny: g, heightSmall: _, heightMedium: v, heightLarge: y, heightHuge: b } = e;
	return {
		...Op,
		optionFontSizeTiny: d,
		optionFontSizeSmall: f,
		optionFontSizeMedium: p,
		optionFontSizeLarge: m,
		optionFontSizeHuge: h,
		optionHeightTiny: g,
		optionHeightSmall: _,
		optionHeightMedium: v,
		optionHeightLarge: y,
		optionHeightHuge: b,
		borderRadius: t,
		color: n,
		groupHeaderTextColor: r,
		actionDividerColor: i,
		optionTextColor: a,
		optionTextColorPressed: o,
		optionTextColorDisabled: s,
		optionTextColorActive: c,
		optionOpacityDisabled: l,
		optionCheckColor: c,
		optionColorPending: u,
		optionColorActive: "rgba(0, 0, 0, 0)",
		optionColorActivePending: u,
		actionTextColor: a,
		loadingColor: c
	};
}
var Ap = {
	name: "InternalSelectMenu",
	common: Q,
	peers: {
		Scrollbar: _p,
		Empty: xp
	},
	self: kp
}, jp = {
	space: "6px",
	spaceArrow: "10px",
	arrowOffset: "10px",
	arrowOffsetVertical: "10px",
	arrowHeight: "6px",
	padding: "8px 14px"
};
//#endregion
//#region node_modules/naive-ui/es/popover/styles/light.mjs
function Mp(e) {
	let { boxShadow2: t, popoverColor: n, textColor2: r, borderRadius: i, fontSize: a, dividerColor: o } = e;
	return {
		...jp,
		fontSize: a,
		borderRadius: i,
		color: n,
		dividerColor: o,
		textColor: r,
		boxShadow: t
	};
}
var Np = {
	name: "Popover",
	common: Q,
	peers: { Scrollbar: _p },
	self: Mp
};
//#endregion
//#region node_modules/evtd/es/utils.js
function Pp(e) {
	return e.composedPath()[0];
}
//#endregion
//#region node_modules/evtd/es/traps.js
var Fp = {
	mousemoveoutside: /* @__PURE__ */ new WeakMap(),
	clickoutside: /* @__PURE__ */ new WeakMap()
};
function Ip(e, t, n) {
	if (e === "mousemoveoutside") {
		let e = (e) => {
			t.contains(Pp(e)) || n(e);
		};
		return {
			mousemove: e,
			touchstart: e
		};
	}
	if (e === "clickoutside") {
		let e = !1, r = (n) => {
			e = !t.contains(Pp(n));
		}, i = (r) => {
			e && (t.contains(Pp(r)) || n(r));
		};
		return {
			mousedown: r,
			mouseup: i,
			touchstart: r,
			touchend: i
		};
	}
	return console.error(`[evtd/create-trap-handler]: name \`${e}\` is invalid. This could be a bug of evtd.`), {};
}
function Lp(e, t, n) {
	let r = Fp[e], i = r.get(t);
	i === void 0 && r.set(t, i = /* @__PURE__ */ new WeakMap());
	let a = i.get(n);
	return a === void 0 && i.set(n, a = Ip(e, t, n)), a;
}
function Rp(e, t, n, r) {
	if (e === "mousemoveoutside" || e === "clickoutside") {
		let i = Lp(e, t, n);
		return Object.keys(i).forEach((e) => {
			Vp(e, document, i[e], r);
		}), !0;
	}
	return !1;
}
function zp(e, t, n, r) {
	if (e === "mousemoveoutside" || e === "clickoutside") {
		let i = Lp(e, t, n);
		return Object.keys(i).forEach((e) => {
			Hp(e, document, i[e], r);
		}), !0;
	}
	return !1;
}
//#endregion
//#region node_modules/evtd/es/delegate.js
function Bp() {
	if (typeof window > "u") return {
		on: () => {},
		off: () => {}
	};
	let e = /* @__PURE__ */ new WeakMap(), t = /* @__PURE__ */ new WeakMap();
	function n() {
		e.set(this, !0);
	}
	function r() {
		e.set(this, !0), t.set(this, !0);
	}
	function i(e, t, n) {
		let r = e[t];
		return e[t] = function() {
			return n.apply(e, arguments), r.apply(e, arguments);
		}, e;
	}
	function a(e, t) {
		e[t] = Event.prototype[t];
	}
	let o = /* @__PURE__ */ new WeakMap(), s = Object.getOwnPropertyDescriptor(Event.prototype, "currentTarget");
	function c() {
		return o.get(this) ?? null;
	}
	function l(e, t) {
		s !== void 0 && Object.defineProperty(e, "currentTarget", {
			configurable: !0,
			enumerable: !0,
			get: t ?? s.get
		});
	}
	let u = {
		bubble: {},
		capture: {}
	}, d = {};
	function f() {
		let s = function(s) {
			let { type: d, eventPhase: f, bubbles: p } = s, m = Pp(s);
			if (f === 2) return;
			let h = f === 1 ? "capture" : "bubble", g = m, _ = [];
			for (; g === null && (g = window), _.push(g), g !== window;) g = g.parentNode || null;
			let v = u.capture[d], y = u.bubble[d];
			if (i(s, "stopPropagation", n), i(s, "stopImmediatePropagation", r), l(s, c), h === "capture") {
				if (v === void 0) return;
				for (let n = _.length - 1; n >= 0 && !e.has(s); --n) {
					let e = _[n], r = v.get(e);
					if (r !== void 0) {
						o.set(s, e);
						for (let e of r) {
							if (t.has(s)) break;
							e(s);
						}
					}
					if (n === 0 && !p && y !== void 0) {
						let n = y.get(e);
						if (n !== void 0) for (let e of n) {
							if (t.has(s)) break;
							e(s);
						}
					}
				}
			} else if (h === "bubble") {
				if (y === void 0) return;
				for (let n = 0; n < _.length && !e.has(s); ++n) {
					let e = _[n], r = y.get(e);
					if (r !== void 0) {
						o.set(s, e);
						for (let e of r) {
							if (t.has(s)) break;
							e(s);
						}
					}
				}
			}
			a(s, "stopPropagation"), a(s, "stopImmediatePropagation"), l(s);
		};
		return s.displayName = "evtdUnifiedHandler", s;
	}
	function p() {
		let e = function(e) {
			let { type: t, eventPhase: n } = e;
			if (n !== 2) return;
			let r = d[t];
			r !== void 0 && r.forEach((t) => t(e));
		};
		return e.displayName = "evtdUnifiedWindowEventHandler", e;
	}
	let m = f(), h = p();
	function g(e, t) {
		let n = u[e];
		return n[t] === void 0 && (n[t] = /* @__PURE__ */ new Map(), window.addEventListener(t, m, e === "capture")), n[t];
	}
	function _(e) {
		return d[e] === void 0 && (d[e] = /* @__PURE__ */ new Set(), window.addEventListener(e, h)), d[e];
	}
	function v(e, t) {
		let n = e.get(t);
		return n === void 0 && e.set(t, n = /* @__PURE__ */ new Set()), n;
	}
	function y(e, t, n, r) {
		let i = u[t][n];
		if (i !== void 0) {
			let t = i.get(e);
			if (t !== void 0 && t.has(r)) return !0;
		}
		return !1;
	}
	function b(e, t) {
		let n = d[e];
		return !!(n !== void 0 && n.has(t));
	}
	function x(e, t, n, r) {
		let i;
		if (i = typeof r == "object" && r.once === !0 ? (a) => {
			S(e, t, i, r), n(a);
		} : n, Rp(e, t, i, r)) return;
		let a = v(g(r === !0 || typeof r == "object" && r.capture === !0 ? "capture" : "bubble", e), t);
		if (a.has(i) || a.add(i), t === window) {
			let t = _(e);
			t.has(i) || t.add(i);
		}
	}
	function S(e, t, n, r) {
		if (zp(e, t, n, r)) return;
		let i = r === !0 || typeof r == "object" && r.capture === !0, a = i ? "capture" : "bubble", o = g(a, e), s = v(o, t);
		if (t === window && !y(t, i ? "bubble" : "capture", e, n) && b(e, n)) {
			let t = d[e];
			t.delete(n), t.size === 0 && (window.removeEventListener(e, h), d[e] = void 0);
		}
		s.has(n) && s.delete(n), s.size === 0 && o.delete(t), o.size === 0 && (window.removeEventListener(e, m, a === "capture"), u[a][e] = void 0);
	}
	return {
		on: x,
		off: S
	};
}
var { on: Vp, off: Hp } = Bp();
//#endregion
//#region node_modules/vooks/es/use-memo.js
function Up(e) {
	let t = L(e), n = /* @__PURE__ */ N(t.value);
	return Hn(t, (e) => {
		n.value = e;
	}), typeof e == "function" ? n : {
		__v_isRef: !0,
		get value() {
			return n.value;
		},
		set value(t) {
			e.set(t);
		}
	};
}
//#endregion
//#region node_modules/vooks/es/life-cycle/use-is-mounted.js
function Wp() {
	let e = /* @__PURE__ */ N(!1);
	return xr(() => {
		e.value = !0;
	}), /* @__PURE__ */ Lt(e);
}
//#endregion
//#region node_modules/vooks/es/use-is-ios.js
var Gp = (typeof window > "u" ? !1 : /iPad|iPhone|iPod/.test(navigator.platform) || navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1) && !window.MSStream;
function Kp() {
	return Gp;
}
//#endregion
//#region node_modules/naive-ui/es/_utils/vue/call.mjs
function qp(e, ...t) {
	if (Array.isArray(e)) e.forEach((e) => qp(e, ...t));
	else return e(...t);
}
//#endregion
//#region node_modules/naive-ui/es/_utils/vue/resolve-slot.mjs
function Jp(e) {
	return e.some((e) => !Pi(e) || !(e.type === Ti || e.type === Ci && !Jp(e.children))) ? e : null;
}
function Yp(e, t) {
	return t(e && Jp(e()) || null);
}
function Xp(e) {
	return !(e && Jp(e()));
}
//#endregion
//#region node_modules/naive-ui/es/_mixins/use-rtl.mjs
function Zp(e, t, n) {
	if (!t) return;
	let r = _f(), i = L(() => {
		let { value: n } = t;
		if (!n) return;
		let r = n[e];
		if (r) return r;
	}), a = Rn(af, null), o = () => {
		Vn(() => {
			let { value: t } = n, o = `${t}${e}Rtl`;
			if (fs(o, r)) return;
			let { value: s } = i;
			s && s.style.mount({
				id: o,
				head: !0,
				anchorMetaName: sf,
				props: { bPrefix: t ? `.${t}-` : void 0 },
				ssr: r,
				parent: a?.styleMountTarget
			});
		});
	};
	return r ? o() : br(o), i;
}
//#endregion
//#region node_modules/naive-ui/es/_utils/composable/use-reactivated.mjs
function Qp(e) {
	let t = { isDeactivated: !1 }, n = !1;
	return mr(() => {
		if (t.isDeactivated = !1, !n) {
			n = !0;
			return;
		}
		e();
	}), hr(() => {
		t.isDeactivated = !0, n ||= !0;
	}), t;
}
//#endregion
//#region node_modules/naive-ui/es/_utils/css/rtl-inset.mjs
function $p(e) {
	let { left: t, right: n, top: r, bottom: i } = Ef(e);
	return `${r} ${t} ${i} ${n}`;
}
//#endregion
//#region node_modules/naive-ui/es/_utils/vue/wrapper.mjs
var em = /* @__PURE__ */ P({ render() {
	return this.$slots.default?.();
} }), { cubicBezierEaseInOut: tm } = cf;
function nm({ name: e = "fade-in", enterDuration: t = "0.2s", leaveDuration: n = "0.2s", enterCubicBezier: r = tm, leaveCubicBezier: i = tm } = {}) {
	return [
		z(`&.${e}-transition-enter-active`, { transition: `all ${t} ${r}!important` }),
		z(`&.${e}-transition-leave-active`, { transition: `all ${n} ${i}!important` }),
		z(`&.${e}-transition-enter-from, &.${e}-transition-leave-to`, { opacity: 0 }),
		z(`&.${e}-transition-leave-from, &.${e}-transition-enter-to`, { opacity: 1 })
	];
}
//#endregion
//#region node_modules/naive-ui/es/_internal/scrollbar/src/styles/index.cssr.mjs
var rm = B("scrollbar", "\n overflow: hidden;\n position: relative;\n z-index: auto;\n height: 100%;\n width: 100%;\n", [z(">", [B("scrollbar-container", "\n width: 100%;\n overflow: scroll;\n height: 100%;\n min-height: inherit;\n max-height: inherit;\n scrollbar-width: none;\n ", [z("&::-webkit-scrollbar, &::-webkit-scrollbar-track-piece, &::-webkit-scrollbar-thumb", "\n width: 0;\n height: 0;\n display: none;\n "), z(">", [B("scrollbar-content", "\n box-sizing: border-box;\n min-width: 100%;\n ")])])]), z(">, +", [B("scrollbar-rail", "\n position: absolute;\n pointer-events: none;\n user-select: none;\n background: var(--n-scrollbar-rail-color);\n -webkit-user-select: none;\n ", [
	H("horizontal", "\n height: var(--n-scrollbar-height);\n ", [z(">", [V("scrollbar", "\n height: var(--n-scrollbar-height);\n border-radius: var(--n-scrollbar-border-radius);\n right: 0;\n ")])]),
	H("horizontal--top", "\n top: var(--n-scrollbar-rail-top-horizontal-top); \n right: var(--n-scrollbar-rail-right-horizontal-top); \n bottom: var(--n-scrollbar-rail-bottom-horizontal-top); \n left: var(--n-scrollbar-rail-left-horizontal-top); \n "),
	H("horizontal--bottom", "\n top: var(--n-scrollbar-rail-top-horizontal-bottom); \n right: var(--n-scrollbar-rail-right-horizontal-bottom); \n bottom: var(--n-scrollbar-rail-bottom-horizontal-bottom); \n left: var(--n-scrollbar-rail-left-horizontal-bottom); \n "),
	H("vertical", "\n width: var(--n-scrollbar-width);\n ", [z(">", [V("scrollbar", "\n width: var(--n-scrollbar-width);\n border-radius: var(--n-scrollbar-border-radius);\n bottom: 0;\n ")])]),
	H("vertical--left", "\n top: var(--n-scrollbar-rail-top-vertical-left); \n right: var(--n-scrollbar-rail-right-vertical-left); \n bottom: var(--n-scrollbar-rail-bottom-vertical-left); \n left: var(--n-scrollbar-rail-left-vertical-left); \n "),
	H("vertical--right", "\n top: var(--n-scrollbar-rail-top-vertical-right); \n right: var(--n-scrollbar-rail-right-vertical-right); \n bottom: var(--n-scrollbar-rail-bottom-vertical-right); \n left: var(--n-scrollbar-rail-left-vertical-right); \n "),
	H("disabled", [z(">", [V("scrollbar", "pointer-events: none;")])]),
	z(">", [V("scrollbar", "\n z-index: 1;\n position: absolute;\n cursor: pointer;\n pointer-events: all;\n background-color: var(--n-scrollbar-color);\n transition: background-color .2s var(--n-scrollbar-bezier);\n ", [nm(), z("&:hover", "background-color: var(--n-scrollbar-color-hover);")])])
])])]);
//#endregion
//#region node_modules/vueuc/es/shared/warn.js
function im(e, t) {
	console.error(`[vueuc/${e}]: ${t}`);
}
//#endregion
//#region node_modules/@juggle/resize-observer/lib/utils/resizeObservers.js
var am = [], om = function() {
	return am.some(function(e) {
		return e.activeTargets.length > 0;
	});
}, sm = function() {
	return am.some(function(e) {
		return e.skippedTargets.length > 0;
	});
}, cm = "ResizeObserver loop completed with undelivered notifications.", lm = function() {
	var e;
	typeof ErrorEvent == "function" ? e = new ErrorEvent("error", { message: cm }) : (e = document.createEvent("Event"), e.initEvent("error", !1, !1), e.message = cm), window.dispatchEvent(e);
}, um;
(function(e) {
	e.BORDER_BOX = "border-box", e.CONTENT_BOX = "content-box", e.DEVICE_PIXEL_CONTENT_BOX = "device-pixel-content-box";
})(um ||= {});
//#endregion
//#region node_modules/@juggle/resize-observer/lib/utils/freeze.js
var dm = function(e) {
	return Object.freeze(e);
}, fm = function() {
	function e(e, t) {
		this.inlineSize = e, this.blockSize = t, dm(this);
	}
	return e;
}(), pm = function() {
	function e(e, t, n, r) {
		return this.x = e, this.y = t, this.width = n, this.height = r, this.top = this.y, this.left = this.x, this.bottom = this.top + this.height, this.right = this.left + this.width, dm(this);
	}
	return e.prototype.toJSON = function() {
		var e = this;
		return {
			x: e.x,
			y: e.y,
			top: e.top,
			right: e.right,
			bottom: e.bottom,
			left: e.left,
			width: e.width,
			height: e.height
		};
	}, e.fromRect = function(t) {
		return new e(t.x, t.y, t.width, t.height);
	}, e;
}(), mm = function(e) {
	return e instanceof SVGElement && "getBBox" in e;
}, hm = function(e) {
	if (mm(e)) {
		var t = e.getBBox(), n = t.width, r = t.height;
		return !n && !r;
	}
	var i = e, a = i.offsetWidth, o = i.offsetHeight;
	return !(a || o || e.getClientRects().length);
}, gm = function(e) {
	if (e instanceof Element) return !0;
	var t = e?.ownerDocument?.defaultView;
	return !!(t && e instanceof t.Element);
}, _m = function(e) {
	switch (e.tagName) {
		case "INPUT": if (e.type !== "image") break;
		case "VIDEO":
		case "AUDIO":
		case "EMBED":
		case "OBJECT":
		case "CANVAS":
		case "IFRAME":
		case "IMG": return !0;
	}
	return !1;
}, vm = typeof window < "u" ? window : {}, ym = /* @__PURE__ */ new WeakMap(), bm = /auto|scroll/, xm = /^tb|vertical/, Sm = /msie|trident/i.test(vm.navigator && vm.navigator.userAgent), Cm = function(e) {
	return parseFloat(e || "0");
}, wm = function(e, t, n) {
	return e === void 0 && (e = 0), t === void 0 && (t = 0), n === void 0 && (n = !1), new fm((n ? t : e) || 0, (n ? e : t) || 0);
}, Tm = dm({
	devicePixelContentBoxSize: wm(),
	borderBoxSize: wm(),
	contentBoxSize: wm(),
	contentRect: new pm(0, 0, 0, 0)
}), Em = function(e, t) {
	if (t === void 0 && (t = !1), ym.has(e) && !t) return ym.get(e);
	if (hm(e)) return ym.set(e, Tm), Tm;
	var n = getComputedStyle(e), r = mm(e) && e.ownerSVGElement && e.getBBox(), i = !Sm && n.boxSizing === "border-box", a = xm.test(n.writingMode || ""), o = !r && bm.test(n.overflowY || ""), s = !r && bm.test(n.overflowX || ""), c = r ? 0 : Cm(n.paddingTop), l = r ? 0 : Cm(n.paddingRight), u = r ? 0 : Cm(n.paddingBottom), d = r ? 0 : Cm(n.paddingLeft), f = r ? 0 : Cm(n.borderTopWidth), p = r ? 0 : Cm(n.borderRightWidth), m = r ? 0 : Cm(n.borderBottomWidth), h = r ? 0 : Cm(n.borderLeftWidth), g = d + l, _ = c + u, v = h + p, y = f + m, b = s ? e.offsetHeight - y - e.clientHeight : 0, x = o ? e.offsetWidth - v - e.clientWidth : 0, S = i ? g + v : 0, C = i ? _ + y : 0, w = r ? r.width : Cm(n.width) - S - x, T = r ? r.height : Cm(n.height) - C - b, E = w + g + x + v, D = T + _ + b + y, O = dm({
		devicePixelContentBoxSize: wm(Math.round(w * devicePixelRatio), Math.round(T * devicePixelRatio), a),
		borderBoxSize: wm(E, D, a),
		contentBoxSize: wm(w, T, a),
		contentRect: new pm(d, c, w, T)
	});
	return ym.set(e, O), O;
}, Dm = function(e, t, n) {
	var r = Em(e, n), i = r.borderBoxSize, a = r.contentBoxSize, o = r.devicePixelContentBoxSize;
	switch (t) {
		case um.DEVICE_PIXEL_CONTENT_BOX: return o;
		case um.BORDER_BOX: return i;
		default: return a;
	}
}, Om = function() {
	function e(e) {
		var t = Em(e);
		this.target = e, this.contentRect = t.contentRect, this.borderBoxSize = dm([t.borderBoxSize]), this.contentBoxSize = dm([t.contentBoxSize]), this.devicePixelContentBoxSize = dm([t.devicePixelContentBoxSize]);
	}
	return e;
}(), km = function(e) {
	if (hm(e)) return Infinity;
	for (var t = 0, n = e.parentNode; n;) t += 1, n = n.parentNode;
	return t;
}, Am = function() {
	var e = Infinity, t = [];
	am.forEach(function(n) {
		if (n.activeTargets.length !== 0) {
			var r = [];
			n.activeTargets.forEach(function(t) {
				var n = new Om(t.target), i = km(t.target);
				r.push(n), t.lastReportedSize = Dm(t.target, t.observedBox), i < e && (e = i);
			}), t.push(function() {
				n.callback.call(n.observer, r, n.observer);
			}), n.activeTargets.splice(0, n.activeTargets.length);
		}
	});
	for (var n = 0, r = t; n < r.length; n++) {
		var i = r[n];
		i();
	}
	return e;
}, jm = function(e) {
	am.forEach(function(t) {
		t.activeTargets.splice(0, t.activeTargets.length), t.skippedTargets.splice(0, t.skippedTargets.length), t.observationTargets.forEach(function(n) {
			n.isActive() && (km(n.target) > e ? t.activeTargets.push(n) : t.skippedTargets.push(n));
		});
	});
}, Mm = function() {
	var e = 0;
	for (jm(e); om();) e = Am(), jm(e);
	return sm() && lm(), e > 0;
}, Nm, Pm = [], Fm = function() {
	return Pm.splice(0).forEach(function(e) {
		return e();
	});
}, Im = function(e) {
	if (!Nm) {
		var t = 0, n = document.createTextNode("");
		new MutationObserver(function() {
			return Fm();
		}).observe(n, { characterData: !0 }), Nm = function() {
			n.textContent = `${t ? t-- : t++}`;
		};
	}
	Pm.push(e), Nm();
}, Lm = function(e) {
	Im(function() {
		requestAnimationFrame(e);
	});
}, Rm = 0, zm = function() {
	return !!Rm;
}, Bm = 250, Vm = {
	attributes: !0,
	characterData: !0,
	childList: !0,
	subtree: !0
}, Hm = [
	"resize",
	"load",
	"transitionend",
	"animationend",
	"animationstart",
	"animationiteration",
	"keyup",
	"keydown",
	"mouseup",
	"mousedown",
	"mouseover",
	"mouseout",
	"blur",
	"focus"
], Um = function(e) {
	return e === void 0 && (e = 0), Date.now() + e;
}, Wm = !1, Gm = new (function() {
	function e() {
		var e = this;
		this.stopped = !0, this.listener = function() {
			return e.schedule();
		};
	}
	return e.prototype.run = function(e) {
		var t = this;
		if (e === void 0 && (e = Bm), !Wm) {
			Wm = !0;
			var n = Um(e);
			Lm(function() {
				var r = !1;
				try {
					r = Mm();
				} finally {
					if (Wm = !1, e = n - Um(), !zm()) return;
					r ? t.run(1e3) : e > 0 ? t.run(e) : t.start();
				}
			});
		}
	}, e.prototype.schedule = function() {
		this.stop(), this.run();
	}, e.prototype.observe = function() {
		var e = this, t = function() {
			return e.observer && e.observer.observe(document.body, Vm);
		};
		document.body ? t() : vm.addEventListener("DOMContentLoaded", t);
	}, e.prototype.start = function() {
		var e = this;
		this.stopped && (this.stopped = !1, this.observer = new MutationObserver(this.listener), this.observe(), Hm.forEach(function(t) {
			return vm.addEventListener(t, e.listener, !0);
		}));
	}, e.prototype.stop = function() {
		var e = this;
		this.stopped ||= (this.observer && this.observer.disconnect(), Hm.forEach(function(t) {
			return vm.removeEventListener(t, e.listener, !0);
		}), !0);
	}, e;
}())(), Km = function(e) {
	!Rm && e > 0 && Gm.start(), Rm += e, !Rm && Gm.stop();
}, qm = function(e) {
	return !mm(e) && !_m(e) && getComputedStyle(e).display === "inline";
}, Jm = function() {
	function e(e, t) {
		this.target = e, this.observedBox = t || um.CONTENT_BOX, this.lastReportedSize = {
			inlineSize: 0,
			blockSize: 0
		};
	}
	return e.prototype.isActive = function() {
		var e = Dm(this.target, this.observedBox, !0);
		return qm(this.target) && (this.lastReportedSize = e), this.lastReportedSize.inlineSize !== e.inlineSize || this.lastReportedSize.blockSize !== e.blockSize;
	}, e;
}(), Ym = function() {
	function e(e, t) {
		this.activeTargets = [], this.skippedTargets = [], this.observationTargets = [], this.observer = e, this.callback = t;
	}
	return e;
}(), Xm = /* @__PURE__ */ new WeakMap(), Zm = function(e, t) {
	for (var n = 0; n < e.length; n += 1) if (e[n].target === t) return n;
	return -1;
}, Qm = function() {
	function e() {}
	return e.connect = function(e, t) {
		var n = new Ym(e, t);
		Xm.set(e, n);
	}, e.observe = function(e, t, n) {
		var r = Xm.get(e), i = r.observationTargets.length === 0;
		Zm(r.observationTargets, t) < 0 && (i && am.push(r), r.observationTargets.push(new Jm(t, n && n.box)), Km(1), Gm.schedule());
	}, e.unobserve = function(e, t) {
		var n = Xm.get(e), r = Zm(n.observationTargets, t), i = n.observationTargets.length === 1;
		r >= 0 && (i && am.splice(am.indexOf(n), 1), n.observationTargets.splice(r, 1), Km(-1));
	}, e.disconnect = function(e) {
		var t = this, n = Xm.get(e);
		n.observationTargets.slice().forEach(function(n) {
			return t.unobserve(e, n.target);
		}), n.activeTargets.splice(0, n.activeTargets.length);
	}, e;
}(), $m = function() {
	function e(e) {
		if (arguments.length === 0) throw TypeError("Failed to construct 'ResizeObserver': 1 argument required, but only 0 present.");
		if (typeof e != "function") throw TypeError("Failed to construct 'ResizeObserver': The callback provided as parameter 1 is not a function.");
		Qm.connect(this, e);
	}
	return e.prototype.observe = function(e, t) {
		if (arguments.length === 0) throw TypeError("Failed to execute 'observe' on 'ResizeObserver': 1 argument required, but only 0 present.");
		if (!gm(e)) throw TypeError("Failed to execute 'observe' on 'ResizeObserver': parameter 1 is not of type 'Element");
		Qm.observe(this, e, t);
	}, e.prototype.unobserve = function(e) {
		if (arguments.length === 0) throw TypeError("Failed to execute 'unobserve' on 'ResizeObserver': 1 argument required, but only 0 present.");
		if (!gm(e)) throw TypeError("Failed to execute 'unobserve' on 'ResizeObserver': parameter 1 is not of type 'Element");
		Qm.unobserve(this, e);
	}, e.prototype.disconnect = function() {
		Qm.disconnect(this);
	}, e.toString = function() {
		return "function ResizeObserver () { [polyfill code] }";
	}, e;
}(), eh = new class {
	constructor() {
		this.handleResize = this.handleResize.bind(this), this.observer = new (typeof window < "u" && window.ResizeObserver || $m)(this.handleResize), this.elHandlersMap = /* @__PURE__ */ new Map();
	}
	handleResize(e) {
		for (let t of e) {
			let e = this.elHandlersMap.get(t.target);
			e !== void 0 && e(t);
		}
	}
	registerHandler(e, t) {
		this.elHandlersMap.set(e, t), this.observer.observe(e);
	}
	unregisterHandler(e) {
		this.elHandlersMap.has(e) && (this.elHandlersMap.delete(e), this.observer.unobserve(e));
	}
}(), th = /* @__PURE__ */ P({
	name: "ResizeObserver",
	props: { onResize: Function },
	setup(e) {
		let t = !1, n = ea().proxy;
		function r(t) {
			let { onResize: n } = e;
			n !== void 0 && n(t);
		}
		xr(() => {
			let e = n.$el;
			if (e === void 0) {
				im("resize-observer", "$el does not exist.");
				return;
			}
			if (e.nextElementSibling !== e.nextSibling && e.nodeType === 3 && e.nodeValue !== "") {
				im("resize-observer", "$el can not be observed (it may be a text node).");
				return;
			}
			e.nextElementSibling !== null && (eh.registerHandler(e.nextElementSibling, r), t = !0);
		}), Cr(() => {
			t && eh.unregisterHandler(n.$el.nextElementSibling);
		});
	},
	render() {
		return Er(this.$slots, "default");
	}
}), nh = ["onMousedown"], rh = ["onScroll", "onWheel"], ih = ["onMousedown"], ah = /* @__PURE__ */ P({
	name: "Scrollbar",
	props: {
		...wp.props,
		duration: {
			type: Number,
			default: 0
		},
		scrollable: {
			type: Boolean,
			default: !0
		},
		xScrollable: Boolean,
		trigger: {
			type: String,
			default: "hover"
		},
		useUnifiedContainer: Boolean,
		triggerDisplayManually: Boolean,
		container: Function,
		content: Function,
		containerClass: String,
		containerStyle: [String, Object],
		contentClass: [String, Array],
		contentStyle: [String, Object],
		horizontalRailStyle: [String, Object],
		verticalRailStyle: [String, Object],
		onScroll: Function,
		onWheel: Function,
		onResize: Function,
		internalOnUpdateScrollLeft: Function,
		internalHoistYRail: Boolean,
		internalExposeWidthCssVar: Boolean,
		yPlacement: {
			type: String,
			default: "right"
		},
		xPlacement: {
			type: String,
			default: "bottom"
		}
	},
	inheritAttrs: !1,
	setup(e) {
		let { mergedClsPrefixRef: t, inlineThemeDisabled: n, mergedRtlRef: r } = of(e), i = Zp("Scrollbar", r, t), a = /* @__PURE__ */ N(null), o = /* @__PURE__ */ N(null), s = /* @__PURE__ */ N(null), c = /* @__PURE__ */ N(null), l = /* @__PURE__ */ N(null), u = /* @__PURE__ */ N(null), d = /* @__PURE__ */ N(null), f = /* @__PURE__ */ N(null), p = /* @__PURE__ */ N(null), m = /* @__PURE__ */ N(null), h = /* @__PURE__ */ N(null), g = /* @__PURE__ */ N(0), _ = /* @__PURE__ */ N(0), v = /* @__PURE__ */ N(!1), y = /* @__PURE__ */ N(!1), b = !1, x = !1, S, C, w = 0, T = 0, E = 0, D = 0, O = Kp(), ee = wp("Scrollbar", "-scrollbar", rm, gp, e, t), te = L(() => {
			let { value: e } = f, { value: t } = u, { value: n } = m;
			return e === null || t === null || n === null ? 0 : Math.min(e, n * e / t + wf(ee.value.self.width) * 1.5);
		}), ne = L(() => `${te.value}px`), re = L(() => {
			let { value: e } = p, { value: t } = d, { value: n } = h;
			return e === null || t === null || n === null ? 0 : n * e / t + wf(ee.value.self.height) * 1.5;
		}), ie = L(() => `${re.value}px`), ae = L(() => {
			let { value: e } = f, { value: t } = g, { value: n } = u, { value: r } = m;
			if (e === null || n === null || r === null) return 0;
			{
				let i = n - e;
				return i ? t / i * (r - te.value) : 0;
			}
		}), oe = L(() => `${ae.value}px`), se = L(() => {
			let { value: e } = p, { value: t } = _, { value: n } = d, { value: r } = h;
			if (e === null || n === null || r === null) return 0;
			{
				let i = n - e;
				return i ? t / i * (r - re.value) : 0;
			}
		}), ce = L(() => `${se.value}px`), le = L(() => {
			let { value: e } = f, { value: t } = u;
			return e !== null && t !== null && t > e;
		}), ue = L(() => {
			let { value: e } = p, { value: t } = d;
			return e !== null && t !== null && t > e;
		}), k = L(() => {
			let { trigger: t } = e;
			return t === "none" || v.value;
		}), de = L(() => {
			let { trigger: t } = e;
			return t === "none" || y.value;
		}), fe = L(() => {
			let { container: t } = e;
			return t ? t() : o.value;
		}), pe = L(() => {
			let { content: t } = e;
			return t ? t() : s.value;
		}), me = (t, n) => {
			if (!e.scrollable) return;
			if (typeof t == "number") {
				ye(t, n ?? 0, 0, !1, "auto");
				return;
			}
			let { left: r, top: i, index: a, elSize: o, position: s, behavior: c, el: l, debounce: u = !0 } = t;
			(r !== void 0 || i !== void 0) && ye(r ?? 0, i ?? 0, 0, !1, c), l === void 0 ? a !== void 0 && o !== void 0 ? ye(0, a * o, o, u, c) : s === "bottom" ? ye(0, 2 ** 53 - 1, 0, !1, c) : s === "top" && ye(0, 0, 0, !1, c) : ye(0, l.offsetTop, l.offsetHeight, u, c);
		}, he = Qp(() => {
			e.container || me({
				top: g.value,
				left: _.value
			});
		}), ge = () => {
			he.isDeactivated || ke();
		}, _e = (t) => {
			if (he.isDeactivated) return;
			let { onResize: n } = e;
			n && n(t), ke();
		}, ve = (t, n) => {
			if (!e.scrollable) return;
			let { value: r } = fe;
			r && (typeof t == "object" ? r.scrollBy(t) : r.scrollBy(t, n || 0));
		};
		function ye(e, t, n, r, i) {
			let { value: a } = fe;
			if (a) {
				if (r) {
					let { scrollTop: r, offsetHeight: o } = a;
					if (t > r) {
						t + n <= r + o || a.scrollTo({
							left: e,
							top: t + n - o,
							behavior: i
						});
						return;
					}
				}
				a.scrollTo({
					left: e,
					top: t,
					behavior: i
				});
			}
		}
		function be() {
			we(), Te(), ke();
		}
		function xe() {
			Se();
		}
		function Se() {
			Ce(), A();
		}
		function Ce() {
			C !== void 0 && window.clearTimeout(C), C = window.setTimeout(() => {
				y.value = !1;
			}, e.duration);
		}
		function A() {
			S !== void 0 && window.clearTimeout(S), S = window.setTimeout(() => {
				v.value = !1;
			}, e.duration);
		}
		function we() {
			S !== void 0 && window.clearTimeout(S), v.value = !0;
		}
		function Te() {
			C !== void 0 && window.clearTimeout(C), y.value = !0;
		}
		function j(t) {
			let { onScroll: n } = e;
			n && n(t), Ee();
		}
		function Ee() {
			let { value: e } = fe;
			e && (g.value = e.scrollTop, _.value = e.scrollLeft * (i?.value ? -1 : 1));
		}
		function De() {
			let { value: e } = pe;
			e && (u.value = e.offsetHeight, d.value = e.offsetWidth);
			let { value: t } = fe;
			t && (f.value = t.offsetHeight, p.value = t.offsetWidth);
			let { value: n } = l, { value: r } = c;
			n && (h.value = n.offsetWidth), r && (m.value = r.offsetHeight);
		}
		function Oe() {
			let { value: e } = fe;
			e && (g.value = e.scrollTop, _.value = e.scrollLeft * (i?.value ? -1 : 1), f.value = e.offsetHeight, p.value = e.offsetWidth, u.value = e.scrollHeight, d.value = e.scrollWidth);
			let { value: t } = l, { value: n } = c;
			t && (h.value = t.offsetWidth), n && (m.value = n.offsetHeight);
		}
		function ke() {
			e.scrollable && (e.useUnifiedContainer ? Oe() : (De(), Ee()));
		}
		function Ae(e) {
			return !a.value?.contains(Cf(e));
		}
		function je(e) {
			e.preventDefault(), e.stopPropagation(), x = !0, Vp("mousemove", window, Me, !0), Vp("mouseup", window, Ne, !0), T = _.value, E = i?.value ? window.innerWidth - e.clientX : e.clientX;
		}
		function Me(t) {
			if (!x) return;
			S !== void 0 && window.clearTimeout(S), C !== void 0 && window.clearTimeout(C);
			let { value: n } = p, { value: r } = d, { value: a } = re;
			if (n === null || r === null) return;
			let o = (i?.value ? window.innerWidth - t.clientX - E : t.clientX - E) * (r - n) / (n - a), s = r - n, c = T + o;
			c = Math.min(s, c), c = Math.max(c, 0);
			let { value: l } = fe;
			if (l) {
				l.scrollLeft = c * (i?.value ? -1 : 1);
				let { internalOnUpdateScrollLeft: t } = e;
				t && t(c);
			}
		}
		function Ne(e) {
			e.preventDefault(), e.stopPropagation(), Hp("mousemove", window, Me, !0), Hp("mouseup", window, Ne, !0), x = !1, ke(), Ae(e) && Se();
		}
		function Pe(e) {
			e.preventDefault(), e.stopPropagation(), b = !0, Vp("mousemove", window, Fe, !0), Vp("mouseup", window, Ie, !0), w = g.value, D = e.clientY;
		}
		function Fe(e) {
			if (!b) return;
			S !== void 0 && window.clearTimeout(S), C !== void 0 && window.clearTimeout(C);
			let { value: t } = f, { value: n } = u, { value: r } = te;
			if (t === null || n === null) return;
			let i = (e.clientY - D) * (n - t) / (t - r), a = n - t, o = w + i;
			o = Math.min(a, o), o = Math.max(o, 0);
			let { value: s } = fe;
			s && (s.scrollTop = o);
		}
		function Ie(e) {
			e.preventDefault(), e.stopPropagation(), Hp("mousemove", window, Fe, !0), Hp("mouseup", window, Ie, !0), b = !1, ke(), Ae(e) && Se();
		}
		Vn(() => {
			let { value: e } = ue, { value: n } = le, { value: r } = t, { value: i } = l, { value: a } = c;
			i && (e ? i.classList.remove(`${r}-scrollbar-rail--disabled`) : i.classList.add(`${r}-scrollbar-rail--disabled`)), a && (n ? a.classList.remove(`${r}-scrollbar-rail--disabled`) : a.classList.add(`${r}-scrollbar-rail--disabled`));
		}), xr(() => {
			e.container || ke();
		}), Cr(() => {
			S !== void 0 && window.clearTimeout(S), C !== void 0 && window.clearTimeout(C), Hp("mousemove", window, Fe, !0), Hp("mouseup", window, Ie, !0);
		});
		let Le = L(() => {
			let { common: { cubicBezierEaseInOut: e }, self: { color: t, colorHover: n, height: r, width: a, borderRadius: o, railInsetHorizontalTop: s, railInsetHorizontalBottom: c, railInsetVerticalRight: l, railInsetVerticalLeft: u, railColor: d } } = ee.value, { top: f, right: p, bottom: m, left: h } = Ef(s), { top: g, right: _, bottom: v, left: y } = Ef(c), { top: b, right: x, bottom: S, left: C } = Ef(i?.value ? $p(l) : l), { top: w, right: T, bottom: E, left: D } = Ef(i?.value ? $p(u) : u);
			return {
				"--n-scrollbar-bezier": e,
				"--n-scrollbar-color": t,
				"--n-scrollbar-color-hover": n,
				"--n-scrollbar-border-radius": o,
				"--n-scrollbar-width": a,
				"--n-scrollbar-height": r,
				"--n-scrollbar-rail-top-horizontal-top": f,
				"--n-scrollbar-rail-right-horizontal-top": p,
				"--n-scrollbar-rail-bottom-horizontal-top": m,
				"--n-scrollbar-rail-left-horizontal-top": h,
				"--n-scrollbar-rail-top-horizontal-bottom": g,
				"--n-scrollbar-rail-right-horizontal-bottom": _,
				"--n-scrollbar-rail-bottom-horizontal-bottom": v,
				"--n-scrollbar-rail-left-horizontal-bottom": y,
				"--n-scrollbar-rail-top-vertical-right": b,
				"--n-scrollbar-rail-right-vertical-right": x,
				"--n-scrollbar-rail-bottom-vertical-right": S,
				"--n-scrollbar-rail-left-vertical-right": C,
				"--n-scrollbar-rail-top-vertical-left": w,
				"--n-scrollbar-rail-right-vertical-left": T,
				"--n-scrollbar-rail-bottom-vertical-left": E,
				"--n-scrollbar-rail-left-vertical-left": D,
				"--n-scrollbar-rail-color": d
			};
		}), Re = n ? Sp("scrollbar", void 0, Le, e) : void 0;
		return {
			scrollTo: me,
			scrollBy: ve,
			sync: ke,
			syncUnifiedContainer: Oe,
			handleMouseEnterWrapper: be,
			handleMouseLeaveWrapper: xe,
			mergedClsPrefix: t,
			rtlEnabled: i,
			containerScrollTop: g,
			wrapperRef: a,
			containerRef: o,
			contentRef: s,
			yRailRef: c,
			xRailRef: l,
			needYBar: le,
			needXBar: ue,
			yBarSizePx: ne,
			xBarSizePx: ie,
			yBarTopPx: oe,
			xBarLeftPx: ce,
			isShowXBar: k,
			isShowYBar: de,
			isIos: O,
			handleScroll: j,
			handleContentResize: ge,
			handleContainerResize: _e,
			handleYScrollMouseDown: Pe,
			handleXScrollMouseDown: je,
			containerWidth: p,
			cssVars: n ? void 0 : Le,
			themeClass: Re?.themeClass,
			onRender: Re?.onRender
		};
	},
	render() {
		let { $slots: e, mergedClsPrefix: t, triggerDisplayManually: n, rtlEnabled: r, internalHoistYRail: i, yPlacement: a, xPlacement: o, xScrollable: s } = this;
		if (!this.scrollable) return e.default?.();
		let c = this.trigger === "none", l = (e, n) => (F(), I("div", {
			ref: "yRailRef",
			class: K([
				`${t}-scrollbar-rail`,
				`${t}-scrollbar-rail--vertical`,
				`${t}-scrollbar-rail--vertical--${a}`,
				e
			]),
			"data-scrollbar-rail": !0,
			style: k([n || "", this.verticalRailStyle]),
			"aria-hidden": !0
		}, [G(() => R(c ? em : ka, c ? null : { name: "fade-in-transition" }, { default: () => this.needYBar && this.isShowYBar && !this.isIos ? (F(), I("div", {
			key: 1,
			class: K(`${t}-scrollbar-rail__scrollbar`),
			style: k({
				height: this.yBarSizePx,
				top: this.yBarTopPx
			}),
			onMousedown: this.handleYScrollMouseDown
		}, null, 46, nh)) : null }))], 6)), u = () => (this.onRender?.(), R("div", Ji(this.$attrs, {
			role: "none",
			ref: "wrapperRef",
			class: [
				`${t}-scrollbar`,
				this.themeClass,
				r && `${t}-scrollbar--rtl`
			],
			style: this.cssVars,
			onMouseenter: n ? void 0 : this.handleMouseEnterWrapper,
			onMouseleave: n ? void 0 : this.handleMouseLeaveWrapper
		}), [
			this.container ? e.default?.() : (F(), I("div", {
				key: 2,
				role: "none",
				ref: "containerRef",
				class: K([`${t}-scrollbar-container`, this.containerClass]),
				style: k([this.containerStyle, this.internalExposeWidthCssVar ? { "--n-scrollbar-current-width": Tf(this.containerWidth) } : void 0]),
				onScroll: this.handleScroll,
				onWheel: this.onWheel
			}, [(F(), Ni(th, { onResize: this.handleContentResize }, { default: () => (F(), I("div", {
				ref: "contentRef",
				role: "none",
				style: k([{ width: this.xScrollable ? "fit-content" : null }, this.contentStyle]),
				class: K([`${t}-scrollbar-content`, this.contentClass])
			}, [G(() => e.default?.())], 6)) }, 1032, ["onResize"]))], 46, rh)),
			i ? null : l(void 0, void 0),
			s && (F(), I("div", {
				ref: "xRailRef",
				class: K([
					`${t}-scrollbar-rail`,
					`${t}-scrollbar-rail--horizontal`,
					`${t}-scrollbar-rail--horizontal--${o}`
				]),
				style: k(this.horizontalRailStyle),
				"data-scrollbar-rail": !0,
				"aria-hidden": !0
			}, [G(() => R(c ? em : ka, c ? null : { name: "fade-in-transition" }, { default: () => this.needXBar && this.isShowXBar && !this.isIos ? (F(), I("div", {
				key: 3,
				class: K(`${t}-scrollbar-rail__scrollbar`),
				style: k({
					width: this.xBarSizePx,
					right: r ? this.xBarLeftPx : void 0,
					left: r ? void 0 : this.xBarLeftPx
				}),
				onMousedown: this.handleXScrollMouseDown
			}, null, 46, ih)) : null }))], 6))
		])), d = this.container ? u() : (F(), Ni(th, {
			key: 4,
			onResize: this.handleContainerResize
		}, { default: u }, 1032, ["onResize"]));
		return i ? (F(), I(Ci, { key: 5 }, [G(() => d), G(() => l(this.themeClass, this.cssVars))], 64)) : d;
	}
}), oh = {
	closeIconSizeTiny: "12px",
	closeIconSizeSmall: "12px",
	closeIconSizeMedium: "14px",
	closeIconSizeLarge: "14px",
	closeSizeTiny: "16px",
	closeSizeSmall: "16px",
	closeSizeMedium: "18px",
	closeSizeLarge: "18px",
	padding: "0 7px",
	closeMargin: "0 0 0 4px"
}, sh = {
	name: "Tag",
	common: Q,
	self(e) {
		let { textColor2: t, primaryColorHover: n, primaryColorPressed: r, primaryColor: i, infoColor: a, successColor: o, warningColor: s, errorColor: c, baseColor: l, borderColor: u, tagColor: d, opacityDisabled: f, closeIconColor: p, closeIconColorHover: m, closeIconColorPressed: h, closeColorHover: g, closeColorPressed: _, borderRadiusSmall: v, fontSizeMini: y, fontSizeTiny: b, fontSizeSmall: x, fontSizeMedium: S, heightMini: C, heightTiny: w, heightSmall: T, heightMedium: E, buttonColor2Hover: D, buttonColor2Pressed: O, fontWeightStrong: ee } = e;
		return {
			...oh,
			closeBorderRadius: v,
			heightTiny: C,
			heightSmall: w,
			heightMedium: T,
			heightLarge: E,
			borderRadius: v,
			opacityDisabled: f,
			fontSizeTiny: y,
			fontSizeSmall: b,
			fontSizeMedium: x,
			fontSizeLarge: S,
			fontWeightStrong: ee,
			textColorCheckable: t,
			textColorHoverCheckable: t,
			textColorPressedCheckable: t,
			textColorChecked: l,
			colorCheckable: "#0000",
			colorHoverCheckable: D,
			colorPressedCheckable: O,
			colorChecked: i,
			colorCheckedHover: n,
			colorCheckedPressed: r,
			border: `1px solid ${u}`,
			textColor: t,
			color: d,
			colorBordered: "#0000",
			closeIconColor: p,
			closeIconColorHover: m,
			closeIconColorPressed: h,
			closeColorHover: g,
			closeColorPressed: _,
			borderPrimary: `1px solid ${J(i, { alpha: .3 })}`,
			textColorPrimary: i,
			colorPrimary: J(i, { alpha: .16 }),
			colorBorderedPrimary: "#0000",
			closeIconColorPrimary: Y(i, { lightness: .7 }),
			closeIconColorHoverPrimary: Y(i, { lightness: .7 }),
			closeIconColorPressedPrimary: Y(i, { lightness: .7 }),
			closeColorHoverPrimary: J(i, { alpha: .16 }),
			closeColorPressedPrimary: J(i, { alpha: .12 }),
			borderInfo: `1px solid ${J(a, { alpha: .3 })}`,
			textColorInfo: a,
			colorInfo: J(a, { alpha: .16 }),
			colorBorderedInfo: "#0000",
			closeIconColorInfo: Y(a, { alpha: .7 }),
			closeIconColorHoverInfo: Y(a, { alpha: .7 }),
			closeIconColorPressedInfo: Y(a, { alpha: .7 }),
			closeColorHoverInfo: J(a, { alpha: .16 }),
			closeColorPressedInfo: J(a, { alpha: .12 }),
			borderSuccess: `1px solid ${J(o, { alpha: .3 })}`,
			textColorSuccess: o,
			colorSuccess: J(o, { alpha: .16 }),
			colorBorderedSuccess: "#0000",
			closeIconColorSuccess: Y(o, { alpha: .7 }),
			closeIconColorHoverSuccess: Y(o, { alpha: .7 }),
			closeIconColorPressedSuccess: Y(o, { alpha: .7 }),
			closeColorHoverSuccess: J(o, { alpha: .16 }),
			closeColorPressedSuccess: J(o, { alpha: .12 }),
			borderWarning: `1px solid ${J(s, { alpha: .3 })}`,
			textColorWarning: s,
			colorWarning: J(s, { alpha: .16 }),
			colorBorderedWarning: "#0000",
			closeIconColorWarning: Y(s, { alpha: .7 }),
			closeIconColorHoverWarning: Y(s, { alpha: .7 }),
			closeIconColorPressedWarning: Y(s, { alpha: .7 }),
			closeColorHoverWarning: J(s, { alpha: .16 }),
			closeColorPressedWarning: J(s, { alpha: .11 }),
			borderError: `1px solid ${J(c, { alpha: .3 })}`,
			textColorError: c,
			colorError: J(c, { alpha: .16 }),
			colorBorderedError: "#0000",
			closeIconColorError: Y(c, { alpha: .7 }),
			closeIconColorHoverError: Y(c, { alpha: .7 }),
			closeIconColorPressedError: Y(c, { alpha: .7 }),
			closeColorHoverError: J(c, { alpha: .16 }),
			closeColorPressedError: J(c, { alpha: .12 })
		};
	}
};
//#endregion
//#region node_modules/naive-ui/es/_utils/css/color-to-class.mjs
function ch(e) {
	return e.replace(/#|\(|\)|,|\s|\./g, "_");
}
//#endregion
//#region node_modules/naive-ui/es/_internal/icons/replaceable.mjs
function lh(e, t) {
	let n = /* @__PURE__ */ P({ render() {
		return t();
	} });
	return /* @__PURE__ */ P({
		name: Od(e),
		setup() {
			let t = Rn(af, null)?.mergedIconsRef;
			return () => {
				let r = t?.value?.[e];
				return r ? r() : (F(), Ni(n, { key: 1 }));
			};
		}
	});
}
//#endregion
//#region node_modules/naive-ui/es/_internal/icons/Close.mjs
var uh = lh("close", () => (() => {
	let e = bf("6b30a2290cd08d4");
	return e[0] ||= Ri("svg", {
		viewBox: "0 0 12 12",
		version: "1.1",
		xmlns: "http://www.w3.org/2000/svg",
		"aria-hidden": !0
	}, [Ri("g", {
		stroke: "none",
		"stroke-width": "1",
		fill: "none",
		"fill-rule": "evenodd"
	}, [Ri("g", {
		fill: "currentColor",
		"fill-rule": "nonzero"
	}, [Ri("path", { d: "M2.08859116,2.2156945 L2.14644661,2.14644661 C2.32001296,1.97288026 2.58943736,1.95359511 2.7843055,2.08859116 L2.85355339,2.14644661 L6,5.293 L9.14644661,2.14644661 C9.34170876,1.95118446 9.65829124,1.95118446 9.85355339,2.14644661 C10.0488155,2.34170876 10.0488155,2.65829124 9.85355339,2.85355339 L6.707,6 L9.85355339,9.14644661 C10.0271197,9.32001296 10.0464049,9.58943736 9.91140884,9.7843055 L9.85355339,9.85355339 C9.67998704,10.0271197 9.41056264,10.0464049 9.2156945,9.91140884 L9.14644661,9.85355339 L6,6.707 L2.85355339,9.85355339 C2.65829124,10.0488155 2.34170876,10.0488155 2.14644661,9.85355339 C1.95118446,9.65829124 1.95118446,9.34170876 2.14644661,9.14644661 L5.293,6 L2.14644661,2.85355339 C1.97288026,2.67998704 1.95359511,2.41056264 2.08859116,2.2156945 L2.14644661,2.14644661 L2.08859116,2.2156945 Z" })])])], -1);
})()), dh = B("base-close", "\n display: flex;\n align-items: center;\n justify-content: center;\n cursor: pointer;\n background-color: transparent;\n color: var(--n-close-icon-color);\n border-radius: var(--n-close-border-radius);\n height: var(--n-close-size);\n width: var(--n-close-size);\n font-size: var(--n-close-icon-size);\n outline: none;\n border: none;\n position: relative;\n padding: 0;\n", [
	H("absolute", "\n height: var(--n-close-icon-size);\n width: var(--n-close-icon-size);\n "),
	z("&::before", "\n content: \"\";\n position: absolute;\n width: var(--n-close-size);\n height: var(--n-close-size);\n left: 50%;\n top: 50%;\n transform: translateY(-50%) translateX(-50%);\n transition: inherit;\n border-radius: inherit;\n "),
	ys("disabled", [
		z("&:hover", "\n color: var(--n-close-icon-color-hover);\n "),
		z("&:hover::before", "\n background-color: var(--n-close-color-hover);\n "),
		z("&:focus::before", "\n background-color: var(--n-close-color-hover);\n "),
		z("&:active", "\n color: var(--n-close-icon-color-pressed);\n "),
		z("&:active::before", "\n background-color: var(--n-close-color-pressed);\n ")
	]),
	H("disabled", "\n cursor: not-allowed;\n color: var(--n-close-icon-color-disabled);\n background-color: transparent;\n "),
	H("round", [z("&::before", "\n border-radius: 50%;\n ")])
]), fh = /* @__PURE__ */ P({
	name: "BaseClose",
	props: {
		isButtonTag: {
			type: Boolean,
			default: !0
		},
		clsPrefix: {
			type: String,
			required: !0
		},
		disabled: {
			type: Boolean,
			default: void 0
		},
		focusable: {
			type: Boolean,
			default: !0
		},
		round: Boolean,
		onClick: Function,
		absolute: Boolean
	},
	setup(e) {
		return vf("-base-close", dh, /* @__PURE__ */ tn(e, "clsPrefix")), () => {
			let { clsPrefix: t, disabled: n, absolute: r, round: i, isButtonTag: a } = e, o = a ? "button" : "div";
			return (() => {
				let s = bf("b5bdc9fe09f5ae00");
				return F(), Ni(o, {
					type: a ? "button" : void 0,
					tabindex: n || !e.focusable ? -1 : 0,
					"aria-disabled": n,
					"aria-label": "close",
					role: a ? void 0 : "button",
					disabled: n,
					class: K([
						`${t}-base-close`,
						r && `${t}-base-close--absolute`,
						n && `${t}-base-close--disabled`,
						i && `${t}-base-close--round`
					]),
					onMousedown: s[0] ||= (t) => {
						e.focusable || t.preventDefault();
					},
					onClick: e.onClick
				}, {
					default: Fn(() => [(F(), Ni(Dp, { clsPrefix: t }, { default: () => (F(), Ni(uh)) }, 1032, ["clsPrefix"]))]),
					_: 2
				}, 1032, [
					"type",
					"tabindex",
					"aria-disabled",
					"role",
					"disabled",
					"class",
					"onClick"
				]);
			})();
		};
	}
}), ph = {
	paddingSingle: "0 26px 0 12px",
	paddingMultiple: "3px 26px 0 12px",
	clearSize: "16px",
	arrowSize: "16px"
}, mh = {
	name: "InternalSelection",
	common: Q,
	peers: { Popover: Np },
	self(e) {
		let { borderRadius: t, textColor2: n, textColorDisabled: r, inputColor: i, inputColorDisabled: a, primaryColor: o, primaryColorHover: s, warningColor: c, warningColorHover: l, errorColor: u, errorColorHover: d, iconColor: f, iconColorDisabled: p, clearColor: m, clearColorHover: h, clearColorPressed: g, placeholderColor: _, placeholderColorDisabled: v, fontSizeTiny: y, fontSizeSmall: b, fontSizeMedium: x, fontSizeLarge: S, heightTiny: C, heightSmall: w, heightMedium: T, heightLarge: E, fontWeight: D } = e;
		return {
			...ph,
			fontWeight: D,
			fontSizeTiny: y,
			fontSizeSmall: b,
			fontSizeMedium: x,
			fontSizeLarge: S,
			heightTiny: C,
			heightSmall: w,
			heightMedium: T,
			heightLarge: E,
			borderRadius: t,
			textColor: n,
			textColorDisabled: r,
			placeholderColor: _,
			placeholderColorDisabled: v,
			color: i,
			colorDisabled: a,
			colorActive: J(o, { alpha: .1 }),
			border: "1px solid #0000",
			borderHover: `1px solid ${s}`,
			borderActive: `1px solid ${o}`,
			borderFocus: `1px solid ${s}`,
			boxShadowHover: "none",
			boxShadowActive: `0 0 8px 0 ${J(o, { alpha: .4 })}`,
			boxShadowFocus: `0 0 8px 0 ${J(o, { alpha: .4 })}`,
			caretColor: o,
			arrowColor: f,
			arrowColorDisabled: p,
			loadingColor: o,
			borderWarning: `1px solid ${c}`,
			borderHoverWarning: `1px solid ${l}`,
			borderActiveWarning: `1px solid ${c}`,
			borderFocusWarning: `1px solid ${l}`,
			boxShadowHoverWarning: "none",
			boxShadowActiveWarning: `0 0 8px 0 ${J(c, { alpha: .4 })}`,
			boxShadowFocusWarning: `0 0 8px 0 ${J(c, { alpha: .4 })}`,
			colorActiveWarning: J(c, { alpha: .1 }),
			caretColorWarning: c,
			borderError: `1px solid ${u}`,
			borderHoverError: `1px solid ${d}`,
			borderActiveError: `1px solid ${u}`,
			borderFocusError: `1px solid ${d}`,
			boxShadowHoverError: "none",
			boxShadowActiveError: `0 0 8px 0 ${J(u, { alpha: .4 })}`,
			boxShadowFocusError: `0 0 8px 0 ${J(u, { alpha: .4 })}`,
			colorActiveError: J(u, { alpha: .1 }),
			caretColorError: u,
			clearColor: m,
			clearColorHover: h,
			clearColorPressed: g
		};
	}
}, hh = {
	iconMargin: "11px 8px 0 12px",
	iconMarginRtl: "11px 12px 0 8px",
	iconSize: "24px",
	closeIconSize: "16px",
	closeSize: "20px",
	closeMargin: "13px 14px 0 0",
	closeMarginRtl: "13px 0 0 14px",
	padding: "13px"
}, gh = {
	name: "Alert",
	common: Q,
	self(e) {
		let { lineHeight: t, borderRadius: n, fontWeightStrong: r, dividerColor: i, inputColor: a, textColor1: o, textColor2: s, closeColorHover: c, closeColorPressed: l, closeIconColor: u, closeIconColorHover: d, closeIconColorPressed: f, infoColorSuppl: p, successColorSuppl: m, warningColorSuppl: h, errorColorSuppl: g, fontSize: _ } = e;
		return {
			...hh,
			fontSize: _,
			lineHeight: t,
			titleFontWeight: r,
			borderRadius: n,
			border: `1px solid ${i}`,
			color: a,
			titleTextColor: o,
			iconColor: s,
			contentTextColor: s,
			closeBorderRadius: n,
			closeColorHover: c,
			closeColorPressed: l,
			closeIconColor: u,
			closeIconColorHover: d,
			closeIconColorPressed: f,
			borderInfo: `1px solid ${J(p, { alpha: .35 })}`,
			colorInfo: J(p, { alpha: .25 }),
			titleTextColorInfo: o,
			iconColorInfo: p,
			contentTextColorInfo: s,
			closeColorHoverInfo: c,
			closeColorPressedInfo: l,
			closeIconColorInfo: u,
			closeIconColorHoverInfo: d,
			closeIconColorPressedInfo: f,
			borderSuccess: `1px solid ${J(m, { alpha: .35 })}`,
			colorSuccess: J(m, { alpha: .25 }),
			titleTextColorSuccess: o,
			iconColorSuccess: m,
			contentTextColorSuccess: s,
			closeColorHoverSuccess: c,
			closeColorPressedSuccess: l,
			closeIconColorSuccess: u,
			closeIconColorHoverSuccess: d,
			closeIconColorPressedSuccess: f,
			borderWarning: `1px solid ${J(h, { alpha: .35 })}`,
			colorWarning: J(h, { alpha: .25 }),
			titleTextColorWarning: o,
			iconColorWarning: h,
			contentTextColorWarning: s,
			closeColorHoverWarning: c,
			closeColorPressedWarning: l,
			closeIconColorWarning: u,
			closeIconColorHoverWarning: d,
			closeIconColorPressedWarning: f,
			borderError: `1px solid ${J(g, { alpha: .35 })}`,
			colorError: J(g, { alpha: .25 }),
			titleTextColorError: o,
			iconColorError: g,
			contentTextColorError: s,
			closeColorHoverError: c,
			closeColorPressedError: l,
			closeIconColorError: u,
			closeIconColorHoverError: d,
			closeIconColorPressedError: f
		};
	}
}, _h = /* @__PURE__ */ P({
	name: "FadeInExpandTransition",
	props: {
		appear: Boolean,
		group: Boolean,
		mode: String,
		onLeave: Function,
		onAfterLeave: Function,
		onAfterEnter: Function,
		width: Boolean,
		reverse: Boolean
	},
	setup(e, { slots: t }) {
		function n(t) {
			e.width ? t.style.maxWidth = `${t.offsetWidth}px` : t.style.maxHeight = `${t.offsetHeight}px`, t.offsetWidth;
		}
		function r(t) {
			e.width ? t.style.maxWidth = "0" : t.style.maxHeight = "0", t.offsetWidth;
			let { onLeave: n } = e;
			n && n();
		}
		function i(t) {
			e.width ? t.style.maxWidth = "" : t.style.maxHeight = "";
			let { onAfterLeave: n } = e;
			n && n();
		}
		function a(t) {
			if (t.style.transition = "none", e.width) {
				let e = t.offsetWidth;
				t.style.maxWidth = "0", t.offsetWidth, t.style.transition = "", t.style.maxWidth = `${e}px`;
			} else if (e.reverse) t.style.maxHeight = `${t.offsetHeight}px`, t.offsetHeight, t.style.transition = "", t.style.maxHeight = "0";
			else {
				let e = t.offsetHeight;
				t.style.maxHeight = "0", t.offsetWidth, t.style.transition = "", t.style.maxHeight = `${e}px`;
			}
			t.offsetWidth;
		}
		function o(t) {
			e.width ? t.style.maxWidth = "" : e.reverse || (t.style.maxHeight = ""), e.onAfterEnter?.();
		}
		return () => {
			let { group: s, width: c, appear: l, mode: u } = e, d = s ? To : ka, f = {
				name: c ? "fade-in-width-expand-transition" : "fade-in-height-expand-transition",
				appear: l,
				onEnter: a,
				onAfterEnter: o,
				onBeforeLeave: n,
				onLeave: r,
				onAfterLeave: i
			};
			return s || (f.mode = u), R(d, f, t);
		};
	}
}), vh = {
	linkFontSize: "13px",
	linkPadding: "0 0 0 16px",
	railWidth: "4px"
};
//#endregion
//#region node_modules/naive-ui/es/anchor/styles/light.mjs
function yh(e) {
	let { borderRadius: t, railColor: n, primaryColor: r, primaryColorHover: i, primaryColorPressed: a, textColor2: o } = e;
	return {
		...vh,
		borderRadius: t,
		railColor: n,
		railColorActive: r,
		linkColor: J(r, { alpha: .15 }),
		linkTextColor: o,
		linkTextColorHover: i,
		linkTextColorPressed: a,
		linkTextColorActive: r
	};
}
//#endregion
//#region node_modules/naive-ui/es/anchor/styles/dark.mjs
var bh = {
	name: "Anchor",
	common: Q,
	self: yh
}, xh = {
	paddingTiny: "0 8px",
	paddingSmall: "0 10px",
	paddingMedium: "0 12px",
	paddingLarge: "0 14px",
	clearSize: "16px"
};
//#endregion
//#region node_modules/naive-ui/es/input/styles/dark.mjs
function Sh(e) {
	let { textColor2: t, textColor3: n, textColorDisabled: r, primaryColor: i, primaryColorHover: a, inputColor: o, inputColorDisabled: s, warningColor: c, warningColorHover: l, errorColor: u, errorColorHover: d, borderRadius: f, lineHeight: p, fontSizeTiny: m, fontSizeSmall: h, fontSizeMedium: g, fontSizeLarge: _, heightTiny: v, heightSmall: y, heightMedium: b, heightLarge: x, clearColor: S, clearColorHover: C, clearColorPressed: w, placeholderColor: T, placeholderColorDisabled: E, iconColor: D, iconColorDisabled: O, iconColorHover: ee, iconColorPressed: te, fontWeight: ne } = e;
	return {
		...xh,
		fontWeight: ne,
		countTextColorDisabled: r,
		countTextColor: n,
		heightTiny: v,
		heightSmall: y,
		heightMedium: b,
		heightLarge: x,
		fontSizeTiny: m,
		fontSizeSmall: h,
		fontSizeMedium: g,
		fontSizeLarge: _,
		lineHeight: p,
		lineHeightTextarea: p,
		borderRadius: f,
		iconSize: "16px",
		groupLabelColor: o,
		textColor: t,
		textColorDisabled: r,
		textDecorationColor: t,
		groupLabelTextColor: t,
		caretColor: i,
		placeholderColor: T,
		placeholderColorDisabled: E,
		color: o,
		colorHover: o,
		colorDisabled: s,
		colorFocus: J(i, { alpha: .1 }),
		groupLabelBorder: "1px solid #0000",
		border: "1px solid #0000",
		borderHover: `1px solid ${a}`,
		borderDisabled: "1px solid #0000",
		borderFocus: `1px solid ${a}`,
		boxShadowFocus: `0 0 8px 0 ${J(i, { alpha: .3 })}`,
		loadingColor: i,
		loadingColorWarning: c,
		borderWarning: `1px solid ${c}`,
		borderHoverWarning: `1px solid ${l}`,
		colorFocusWarning: J(c, { alpha: .1 }),
		borderFocusWarning: `1px solid ${l}`,
		boxShadowFocusWarning: `0 0 8px 0 ${J(c, { alpha: .3 })}`,
		caretColorWarning: c,
		loadingColorError: u,
		borderError: `1px solid ${u}`,
		borderHoverError: `1px solid ${d}`,
		colorFocusError: J(u, { alpha: .1 }),
		borderFocusError: `1px solid ${d}`,
		boxShadowFocusError: `0 0 8px 0 ${J(u, { alpha: .3 })}`,
		caretColorError: u,
		clearColor: S,
		clearColorHover: C,
		clearColorPressed: w,
		iconColor: D,
		iconColorDisabled: O,
		iconColorHover: ee,
		iconColorPressed: te,
		suffixTextColor: t
	};
}
var Ch = Cp({
	name: "Input",
	common: Q,
	peers: { Scrollbar: _p },
	self: Sh
}), wh = rf("n-form-item");
function Th(e, { defaultSize: t = "medium", mergedSize: n, mergedDisabled: r } = {}) {
	let i = Rn(wh, null);
	Ln(wh, null);
	let a = L(n ? () => n(i) : () => {
		let { size: n } = e;
		if (n) return n;
		if (i) {
			let { mergedSize: e } = i;
			if (e.value !== void 0) return e.value;
		}
		return t;
	}), o = L(r ? () => r(i) : () => {
		let { disabled: t } = e;
		return t === void 0 ? i ? i.disabled.value : !1 : t;
	}), s = L(() => {
		let { status: t } = e;
		return t || i?.mergedValidationStatus.value;
	});
	return Cr(() => {
		i && i.restoreValidation();
	}), {
		mergedSizeRef: a,
		mergedDisabledRef: o,
		mergedStatusRef: s,
		nTriggerFormBlur() {
			i && i.handleContentBlur();
		},
		nTriggerFormChange() {
			i && i.handleContentChange();
		},
		nTriggerFormFocus() {
			i && i.handleContentFocus();
		},
		nTriggerFormInput() {
			i && i.handleContentInput();
		}
	};
}
//#endregion
//#region node_modules/naive-ui/es/_internal/icon-switch-transition/src/IconSwitchTransition.mjs
var Eh = /* @__PURE__ */ P({
	name: "BaseIconSwitchTransition",
	setup(e, { slots: t }) {
		let n = Wp();
		return () => (F(), Ni(ka, {
			name: "icon-switch-transition",
			appear: n.value
		}, Sf(t), 1032, ["appear"]));
	}
}), { cubicBezierEaseInOut: Dh } = cf;
function Oh({ originalTransform: e = "", left: t = 0, top: n = 0, transition: r = `all .3s ${Dh} !important` } = {}) {
	return [
		z("&.icon-switch-transition-enter-from, &.icon-switch-transition-leave-to", {
			transform: `${e} scale(0.75)`,
			left: t,
			top: n,
			opacity: 0
		}),
		z("&.icon-switch-transition-enter-to, &.icon-switch-transition-leave-from", {
			transform: `scale(1) ${e}`,
			left: t,
			top: n,
			opacity: 1
		}),
		z("&.icon-switch-transition-enter-active, &.icon-switch-transition-leave-active", {
			transformOrigin: "center",
			position: "absolute",
			left: t,
			top: n,
			transition: r
		})
	];
}
//#endregion
//#region node_modules/naive-ui/es/_internal/loading/src/styles/index.cssr.mjs
var kh = z([z("@keyframes rotator", "\n 0% {\n -webkit-transform: rotate(0deg);\n transform: rotate(0deg);\n }\n 100% {\n -webkit-transform: rotate(360deg);\n transform: rotate(360deg);\n }"), B("base-loading", "\n position: relative;\n line-height: 0;\n width: 1em;\n height: 1em;\n ", [
	V("transition-wrapper", "\n position: absolute;\n width: 100%;\n height: 100%;\n ", [Oh()]),
	V("placeholder", "\n position: absolute;\n left: 50%;\n top: 50%;\n transform: translateX(-50%) translateY(-50%);\n ", [Oh({
		left: "50%",
		top: "50%",
		originalTransform: "translateX(-50%) translateY(-50%)"
	})]),
	V("container", "\n animation: rotator 3s linear infinite both;\n ", [V("icon", "\n height: 1em;\n width: 1em;\n ")])
])]), Ah = ["viewBox"], jh = ["values", "dur"], Mh = [
	"stroke-width",
	"cx",
	"cy",
	"r",
	"stroke-dasharray",
	"stroke-dashoffset"
], Nh = ["values", "dur"], Ph = ["values", "dur"], Fh = "1.6s", Ih = /* @__PURE__ */ P({
	name: "BaseLoading",
	props: {
		clsPrefix: {
			type: String,
			required: !0
		},
		show: {
			type: Boolean,
			default: !0
		},
		strokeWidth: {
			type: Number,
			default: 28
		},
		stroke: {
			type: String,
			default: void 0
		},
		scale: {
			type: Number,
			default: 1
		},
		radius: {
			type: Number,
			default: 100
		}
	},
	setup(e) {
		vf("-base-loading", kh, /* @__PURE__ */ tn(e, "clsPrefix"));
	},
	render() {
		let { clsPrefix: e, radius: t, strokeWidth: n, stroke: r, scale: i } = this, a = t / i;
		return F(), I("div", {
			class: K(`${e}-base-loading`),
			role: "img",
			"aria-label": "loading"
		}, [zi(Eh, null, { default: () => this.show ? (F(), I("div", {
			key: "icon",
			class: K(`${e}-base-loading__transition-wrapper`)
		}, [Ri("div", { class: K(`${e}-base-loading__container`) }, [(F(), I("svg", {
			class: K(`${e}-base-loading__icon`),
			viewBox: `0 0 ${2 * a} ${2 * a}`,
			xmlns: "http://www.w3.org/2000/svg",
			style: k({ color: r })
		}, [Ri("g", null, [Ri("animateTransform", {
			attributeName: "transform",
			type: "rotate",
			values: `0 ${a} ${a};270 ${a} ${a}`,
			begin: "0s",
			dur: Fh,
			fill: "freeze",
			repeatCount: "indefinite"
		}, null, 8, jh), Ri("circle", {
			class: K(`${e}-base-loading__icon`),
			fill: "none",
			stroke: "currentColor",
			"stroke-width": n,
			"stroke-linecap": "round",
			cx: a,
			cy: a,
			r: t - n / 2,
			"stroke-dasharray": 5.67 * t,
			"stroke-dashoffset": 18.48 * t
		}, [Ri("animateTransform", {
			attributeName: "transform",
			type: "rotate",
			values: `0 ${a} ${a};135 ${a} ${a};450 ${a} ${a}`,
			begin: "0s",
			dur: Fh,
			fill: "freeze",
			repeatCount: "indefinite"
		}, null, 8, Nh), Ri("animate", {
			attributeName: "stroke-dashoffset",
			values: `${5.67 * t};${1.42 * t};${5.67 * t}`,
			begin: "0s",
			dur: Fh,
			fill: "freeze",
			repeatCount: "indefinite"
		}, null, 8, Ph)], 10, Mh)])], 14, Ah))], 2)], 2)) : (F(), I("div", {
			key: "placeholder",
			class: K(`${e}-base-loading__placeholder`)
		}, [G(() => this.$slots.default?.())], 2)) }, 1024)], 2);
	}
}), Lh = typeof document < "u" && typeof window < "u", Rh = Lh && "chrome" in window;
Lh && navigator.userAgent.includes("Firefox");
var zh = Lh && navigator.userAgent.includes("Safari") && !Rh;
//#endregion
//#region node_modules/naive-ui/es/auto-complete/styles/light.mjs
function Bh(e) {
	let { boxShadow2: t } = e;
	return { menuBoxShadow: t };
}
//#endregion
//#region node_modules/naive-ui/es/auto-complete/styles/dark.mjs
var Vh = {
	name: "AutoComplete",
	common: Q,
	peers: {
		InternalSelectMenu: Ap,
		Input: Ch
	},
	self: Bh
};
//#endregion
//#region node_modules/naive-ui/es/avatar/styles/light.mjs
function Hh(e) {
	let { borderRadius: t, avatarColor: n, cardColor: r, fontSize: i, heightTiny: a, heightSmall: o, heightMedium: s, heightLarge: c, heightHuge: l, modalColor: u, popoverColor: d } = e;
	return {
		borderRadius: t,
		fontSize: i,
		border: `2px solid ${r}`,
		heightTiny: a,
		heightSmall: o,
		heightMedium: s,
		heightLarge: c,
		heightHuge: l,
		color: q(r, n),
		colorModal: q(u, n),
		colorPopover: q(d, n)
	};
}
var Uh = {
	name: "Avatar",
	common: Q,
	self: Hh
};
//#endregion
//#region node_modules/naive-ui/es/avatar-group/styles/light.mjs
function Wh() {
	return { gap: "-12px" };
}
//#endregion
//#region node_modules/naive-ui/es/back-top/styles/_common.mjs
var Gh = {
	width: "44px",
	height: "44px",
	borderRadius: "22px",
	iconSize: "26px"
}, Kh = {
	name: "BackTop",
	common: Q,
	self(e) {
		let { popoverColor: t, textColor2: n, primaryColorHover: r, primaryColorPressed: i } = e;
		return {
			...Gh,
			color: t,
			textColor: n,
			iconColor: n,
			iconColorHover: r,
			iconColorPressed: i,
			boxShadow: "0 2px 8px 0px rgba(0, 0, 0, .12)",
			boxShadowHover: "0 2px 12px 0px rgba(0, 0, 0, .18)",
			boxShadowPressed: "0 2px 12px 0px rgba(0, 0, 0, .18)"
		};
	}
}, qh = {
	name: "Badge",
	common: Q,
	self(e) {
		let { errorColorSuppl: t, infoColorSuppl: n, successColorSuppl: r, warningColorSuppl: i, fontFamily: a } = e;
		return {
			color: t,
			colorInfo: n,
			colorSuccess: r,
			colorError: t,
			colorWarning: i,
			fontSize: "12px",
			fontFamily: a
		};
	}
}, { cubicBezierEaseInOut: Jh } = cf;
function Yh({ duration: e = ".2s", delay: t = ".1s" } = {}) {
	return [
		z("&.fade-in-width-expand-transition-leave-from, &.fade-in-width-expand-transition-enter-to", { opacity: 1 }),
		z("&.fade-in-width-expand-transition-leave-to, &.fade-in-width-expand-transition-enter-from", "\n opacity: 0!important;\n margin-left: 0!important;\n margin-right: 0!important;\n "),
		z("&.fade-in-width-expand-transition-leave-active", `
 overflow: hidden;
 transition:
 opacity ${e} ${Jh},
 max-width ${e} ${Jh} ${t},
 margin-left ${e} ${Jh} ${t},
 margin-right ${e} ${Jh} ${t};
 `),
		z("&.fade-in-width-expand-transition-enter-active", `
 overflow: hidden;
 transition:
 opacity ${e} ${Jh} ${t},
 max-width ${e} ${Jh},
 margin-left ${e} ${Jh},
 margin-right ${e} ${Jh};
 `)
	];
}
//#endregion
//#region node_modules/naive-ui/es/_internal/wave/src/styles/index.cssr.mjs
var Xh = B("base-wave", "\n position: absolute;\n left: 0;\n right: 0;\n top: 0;\n bottom: 0;\n border-radius: inherit;\n"), Zh = /* @__PURE__ */ P({
	name: "BaseWave",
	props: { clsPrefix: {
		type: String,
		required: !0
	} },
	setup(e) {
		vf("-base-wave", Xh, /* @__PURE__ */ tn(e, "clsPrefix"));
		let t = /* @__PURE__ */ N(null), n = /* @__PURE__ */ N(!1), r = null;
		return Cr(() => {
			r !== null && window.clearTimeout(r);
		}), {
			active: n,
			selfRef: t,
			play() {
				r !== null && (window.clearTimeout(r), n.value = !1, r = null), Cn(() => {
					t.value?.offsetHeight, n.value = !0, r = window.setTimeout(() => {
						n.value = !1, r = null;
					}, 1e3);
				});
			}
		};
	},
	render() {
		let { clsPrefix: e } = this;
		return F(), I("div", {
			ref: "selfRef",
			"aria-hidden": !0,
			class: K([`${e}-base-wave`, this.active && `${e}-base-wave--active`])
		}, null, 2);
	}
}), Qh = { fontWeightActive: "400" };
//#endregion
//#region node_modules/naive-ui/es/breadcrumb/styles/light.mjs
function $h(e) {
	let { fontSize: t, textColor3: n, textColor2: r, borderRadius: i, buttonColor2Hover: a, buttonColor2Pressed: o } = e;
	return {
		...Qh,
		fontSize: t,
		itemLineHeight: "1.25",
		itemTextColor: n,
		itemTextColorHover: r,
		itemTextColorPressed: r,
		itemTextColorActive: r,
		itemBorderRadius: i,
		itemColorHover: a,
		itemColorPressed: o,
		separatorColor: n
	};
}
//#endregion
//#region node_modules/naive-ui/es/breadcrumb/styles/dark.mjs
var eg = {
	name: "Breadcrumb",
	common: Q,
	self: $h
}, tg = {
	paddingTiny: "0 6px",
	paddingSmall: "0 10px",
	paddingMedium: "0 14px",
	paddingLarge: "0 18px",
	paddingRoundTiny: "0 10px",
	paddingRoundSmall: "0 14px",
	paddingRoundMedium: "0 18px",
	paddingRoundLarge: "0 22px",
	iconMarginTiny: "6px",
	iconMarginSmall: "6px",
	iconMarginMedium: "6px",
	iconMarginLarge: "6px",
	iconSizeTiny: "14px",
	iconSizeSmall: "18px",
	iconSizeMedium: "18px",
	iconSizeLarge: "20px",
	rippleDuration: ".6s"
};
//#endregion
//#region node_modules/naive-ui/es/button/styles/light.mjs
function ng(e) {
	let { heightTiny: t, heightSmall: n, heightMedium: r, heightLarge: i, borderRadius: a, fontSizeTiny: o, fontSizeSmall: s, fontSizeMedium: c, fontSizeLarge: l, opacityDisabled: u, textColor2: d, textColor3: f, primaryColorHover: p, primaryColorPressed: m, borderColor: h, primaryColor: g, baseColor: _, infoColor: v, infoColorHover: y, infoColorPressed: b, successColor: x, successColorHover: S, successColorPressed: C, warningColor: w, warningColorHover: T, warningColorPressed: E, errorColor: D, errorColorHover: O, errorColorPressed: ee, fontWeight: te, buttonColor2: ne, buttonColor2Hover: re, buttonColor2Pressed: ie, fontWeightStrong: ae } = e;
	return {
		...tg,
		heightTiny: t,
		heightSmall: n,
		heightMedium: r,
		heightLarge: i,
		borderRadiusTiny: a,
		borderRadiusSmall: a,
		borderRadiusMedium: a,
		borderRadiusLarge: a,
		fontSizeTiny: o,
		fontSizeSmall: s,
		fontSizeMedium: c,
		fontSizeLarge: l,
		opacityDisabled: u,
		colorOpacitySecondary: "0.16",
		colorOpacitySecondaryHover: "0.22",
		colorOpacitySecondaryPressed: "0.28",
		colorSecondary: ne,
		colorSecondaryHover: re,
		colorSecondaryPressed: ie,
		colorTertiary: ne,
		colorTertiaryHover: re,
		colorTertiaryPressed: ie,
		colorQuaternary: "#0000",
		colorQuaternaryHover: re,
		colorQuaternaryPressed: ie,
		color: "#0000",
		colorHover: "#0000",
		colorPressed: "#0000",
		colorFocus: "#0000",
		colorDisabled: "#0000",
		textColor: d,
		textColorTertiary: f,
		textColorHover: p,
		textColorPressed: m,
		textColorFocus: p,
		textColorDisabled: d,
		textColorText: d,
		textColorTextHover: p,
		textColorTextPressed: m,
		textColorTextFocus: p,
		textColorTextDisabled: d,
		textColorGhost: d,
		textColorGhostHover: p,
		textColorGhostPressed: m,
		textColorGhostFocus: p,
		textColorGhostDisabled: d,
		border: `1px solid ${h}`,
		borderHover: `1px solid ${p}`,
		borderPressed: `1px solid ${m}`,
		borderFocus: `1px solid ${p}`,
		borderDisabled: `1px solid ${h}`,
		rippleColor: g,
		colorPrimary: g,
		colorHoverPrimary: p,
		colorPressedPrimary: m,
		colorFocusPrimary: p,
		colorDisabledPrimary: g,
		textColorPrimary: _,
		textColorHoverPrimary: _,
		textColorPressedPrimary: _,
		textColorFocusPrimary: _,
		textColorDisabledPrimary: _,
		textColorTextPrimary: g,
		textColorTextHoverPrimary: p,
		textColorTextPressedPrimary: m,
		textColorTextFocusPrimary: p,
		textColorTextDisabledPrimary: d,
		textColorGhostPrimary: g,
		textColorGhostHoverPrimary: p,
		textColorGhostPressedPrimary: m,
		textColorGhostFocusPrimary: p,
		textColorGhostDisabledPrimary: g,
		borderPrimary: `1px solid ${g}`,
		borderHoverPrimary: `1px solid ${p}`,
		borderPressedPrimary: `1px solid ${m}`,
		borderFocusPrimary: `1px solid ${p}`,
		borderDisabledPrimary: `1px solid ${g}`,
		rippleColorPrimary: g,
		colorInfo: v,
		colorHoverInfo: y,
		colorPressedInfo: b,
		colorFocusInfo: y,
		colorDisabledInfo: v,
		textColorInfo: _,
		textColorHoverInfo: _,
		textColorPressedInfo: _,
		textColorFocusInfo: _,
		textColorDisabledInfo: _,
		textColorTextInfo: v,
		textColorTextHoverInfo: y,
		textColorTextPressedInfo: b,
		textColorTextFocusInfo: y,
		textColorTextDisabledInfo: d,
		textColorGhostInfo: v,
		textColorGhostHoverInfo: y,
		textColorGhostPressedInfo: b,
		textColorGhostFocusInfo: y,
		textColorGhostDisabledInfo: v,
		borderInfo: `1px solid ${v}`,
		borderHoverInfo: `1px solid ${y}`,
		borderPressedInfo: `1px solid ${b}`,
		borderFocusInfo: `1px solid ${y}`,
		borderDisabledInfo: `1px solid ${v}`,
		rippleColorInfo: v,
		colorSuccess: x,
		colorHoverSuccess: S,
		colorPressedSuccess: C,
		colorFocusSuccess: S,
		colorDisabledSuccess: x,
		textColorSuccess: _,
		textColorHoverSuccess: _,
		textColorPressedSuccess: _,
		textColorFocusSuccess: _,
		textColorDisabledSuccess: _,
		textColorTextSuccess: x,
		textColorTextHoverSuccess: S,
		textColorTextPressedSuccess: C,
		textColorTextFocusSuccess: S,
		textColorTextDisabledSuccess: d,
		textColorGhostSuccess: x,
		textColorGhostHoverSuccess: S,
		textColorGhostPressedSuccess: C,
		textColorGhostFocusSuccess: S,
		textColorGhostDisabledSuccess: x,
		borderSuccess: `1px solid ${x}`,
		borderHoverSuccess: `1px solid ${S}`,
		borderPressedSuccess: `1px solid ${C}`,
		borderFocusSuccess: `1px solid ${S}`,
		borderDisabledSuccess: `1px solid ${x}`,
		rippleColorSuccess: x,
		colorWarning: w,
		colorHoverWarning: T,
		colorPressedWarning: E,
		colorFocusWarning: T,
		colorDisabledWarning: w,
		textColorWarning: _,
		textColorHoverWarning: _,
		textColorPressedWarning: _,
		textColorFocusWarning: _,
		textColorDisabledWarning: _,
		textColorTextWarning: w,
		textColorTextHoverWarning: T,
		textColorTextPressedWarning: E,
		textColorTextFocusWarning: T,
		textColorTextDisabledWarning: d,
		textColorGhostWarning: w,
		textColorGhostHoverWarning: T,
		textColorGhostPressedWarning: E,
		textColorGhostFocusWarning: T,
		textColorGhostDisabledWarning: w,
		borderWarning: `1px solid ${w}`,
		borderHoverWarning: `1px solid ${T}`,
		borderPressedWarning: `1px solid ${E}`,
		borderFocusWarning: `1px solid ${T}`,
		borderDisabledWarning: `1px solid ${w}`,
		rippleColorWarning: w,
		colorError: D,
		colorHoverError: O,
		colorPressedError: ee,
		colorFocusError: O,
		colorDisabledError: D,
		textColorError: _,
		textColorHoverError: _,
		textColorPressedError: _,
		textColorFocusError: _,
		textColorDisabledError: _,
		textColorTextError: D,
		textColorTextHoverError: O,
		textColorTextPressedError: ee,
		textColorTextFocusError: O,
		textColorTextDisabledError: d,
		textColorGhostError: D,
		textColorGhostHoverError: O,
		textColorGhostPressedError: ee,
		textColorGhostFocusError: O,
		textColorGhostDisabledError: D,
		borderError: `1px solid ${D}`,
		borderHoverError: `1px solid ${O}`,
		borderPressedError: `1px solid ${ee}`,
		borderFocusError: `1px solid ${O}`,
		borderDisabledError: `1px solid ${D}`,
		rippleColorError: D,
		waveOpacity: "0.6",
		fontWeight: te,
		fontWeightStrong: ae
	};
}
var rg = {
	name: "Button",
	common: pp,
	self: ng
}, ig = {
	name: "Button",
	common: Q,
	self(e) {
		let t = ng(e);
		return t.waveOpacity = "0.8", t.colorOpacitySecondary = "0.16", t.colorOpacitySecondaryHover = "0.2", t.colorOpacitySecondaryPressed = "0.12", t;
	}
};
//#endregion
//#region node_modules/naive-ui/es/_utils/color/index.mjs
function ag(e) {
	return q(e, [
		255,
		255,
		255,
		.16
	]);
}
function og(e) {
	return q(e, [
		0,
		0,
		0,
		.12
	]);
}
//#endregion
//#region node_modules/naive-ui/es/button-group/src/context.mjs
var sg = rf("n-button-group"), cg = z([
	B("button", "\n margin: 0;\n font-weight: var(--n-font-weight);\n line-height: 1;\n font-family: inherit;\n padding: var(--n-padding);\n height: var(--n-height);\n font-size: var(--n-font-size);\n border-radius: var(--n-border-radius);\n color: var(--n-text-color);\n background-color: var(--n-color);\n width: var(--n-width);\n white-space: nowrap;\n outline: none;\n position: relative;\n z-index: auto;\n border: none;\n display: inline-flex;\n flex-wrap: nowrap;\n flex-shrink: 0;\n align-items: center;\n justify-content: center;\n user-select: none;\n -webkit-user-select: none;\n text-align: center;\n cursor: pointer;\n text-decoration: none;\n transition:\n color .3s var(--n-bezier),\n background-color .3s var(--n-bezier),\n opacity .3s var(--n-bezier),\n border-color .3s var(--n-bezier);\n ", [
		H("color", [
			V("border", { borderColor: "var(--n-border-color)" }),
			H("disabled", [V("border", { borderColor: "var(--n-border-color-disabled)" })]),
			ys("disabled", [
				z("&:focus", [V("state-border", { borderColor: "var(--n-border-color-focus)" })]),
				z("&:hover", [V("state-border", { borderColor: "var(--n-border-color-hover)" })]),
				z("&:active", [V("state-border", { borderColor: "var(--n-border-color-pressed)" })]),
				H("pressed", [V("state-border", { borderColor: "var(--n-border-color-pressed)" })])
			])
		]),
		H("disabled", {
			backgroundColor: "var(--n-color-disabled)",
			color: "var(--n-text-color-disabled)"
		}, [V("border", { border: "var(--n-border-disabled)" })]),
		ys("disabled", [
			z("&:focus", {
				backgroundColor: "var(--n-color-focus)",
				color: "var(--n-text-color-focus)"
			}, [V("state-border", { border: "var(--n-border-focus)" })]),
			z("&:hover", {
				backgroundColor: "var(--n-color-hover)",
				color: "var(--n-text-color-hover)"
			}, [V("state-border", { border: "var(--n-border-hover)" })]),
			z("&:active", {
				backgroundColor: "var(--n-color-pressed)",
				color: "var(--n-text-color-pressed)"
			}, [V("state-border", { border: "var(--n-border-pressed)" })]),
			H("pressed", {
				backgroundColor: "var(--n-color-pressed)",
				color: "var(--n-text-color-pressed)"
			}, [V("state-border", { border: "var(--n-border-pressed)" })])
		]),
		H("loading", "cursor: wait;"),
		B("base-wave", "\n pointer-events: none;\n top: 0;\n right: 0;\n bottom: 0;\n left: 0;\n animation-iteration-count: 1;\n animation-duration: var(--n-ripple-duration);\n animation-timing-function: var(--n-bezier-ease-out), var(--n-bezier-ease-out);\n ", [H("active", {
			zIndex: 1,
			animationName: "button-wave-spread, button-wave-opacity"
		})]),
		Lh && "MozBoxSizing" in document.createElement("div").style ? z("&::moz-focus-inner", { border: 0 }) : null,
		V("border, state-border", "\n position: absolute;\n left: 0;\n top: 0;\n right: 0;\n bottom: 0;\n border-radius: inherit;\n transition: border-color .3s var(--n-bezier);\n pointer-events: none;\n "),
		V("border", "\n border: var(--n-border);\n "),
		V("state-border", "\n border: var(--n-border);\n border-color: #0000;\n z-index: 1;\n "),
		V("icon", "\n margin: var(--n-icon-margin);\n margin-left: 0;\n height: var(--n-icon-size);\n width: var(--n-icon-size);\n max-width: var(--n-icon-size);\n font-size: var(--n-icon-size);\n position: relative;\n flex-shrink: 0;\n ", [B("icon-slot", "\n height: var(--n-icon-size);\n width: var(--n-icon-size);\n position: absolute;\n left: 0;\n top: 50%;\n transform: translateY(-50%);\n display: flex;\n align-items: center;\n justify-content: center;\n ", [Oh({
			top: "50%",
			originalTransform: "translateY(-50%)"
		})]), Yh()]),
		V("content", "\n display: flex;\n align-items: center;\n flex-wrap: nowrap;\n min-width: 0;\n ", [z("~", [V("icon", {
			margin: "var(--n-icon-margin)",
			marginRight: 0
		})])]),
		H("block", "\n display: flex;\n width: 100%;\n "),
		H("dashed", [V("border, state-border", { borderStyle: "dashed !important" })]),
		H("disabled", {
			cursor: "not-allowed",
			opacity: "var(--n-opacity-disabled)"
		})
	]),
	z("@keyframes button-wave-spread", {
		from: { boxShadow: "0 0 0.5px 0 var(--n-ripple-color)" },
		to: { boxShadow: "0 0 0.5px 4.5px var(--n-ripple-color)" }
	}),
	z("@keyframes button-wave-opacity", {
		from: { opacity: "var(--n-wave-opacity)" },
		to: { opacity: 0 }
	})
]), lg = /* @__PURE__ */ P({
	name: "Button",
	props: {
		...wp.props,
		color: String,
		textColor: String,
		text: Boolean,
		block: Boolean,
		loading: Boolean,
		disabled: Boolean,
		circle: Boolean,
		size: String,
		ghost: Boolean,
		round: Boolean,
		secondary: Boolean,
		tertiary: Boolean,
		quaternary: Boolean,
		strong: Boolean,
		focusable: {
			type: Boolean,
			default: !0
		},
		keyboard: {
			type: Boolean,
			default: !0
		},
		tag: {
			type: String,
			default: "button"
		},
		type: {
			type: String,
			default: "default"
		},
		dashed: Boolean,
		renderIcon: Function,
		iconPlacement: {
			type: String,
			default: "left"
		},
		attrType: {
			type: String,
			default: "button"
		},
		bordered: {
			type: Boolean,
			default: !0
		},
		onClick: [Function, Array],
		nativeFocusBehavior: {
			type: Boolean,
			default: !zh
		},
		spinProps: Object
	},
	slots: Object,
	setup(e) {
		let t = /* @__PURE__ */ N(null), n = /* @__PURE__ */ N(null), r = /* @__PURE__ */ N(!1), i = Up(() => !e.quaternary && !e.tertiary && !e.secondary && !e.text && (!e.color || e.ghost || e.dashed) && e.bordered), a = Rn(sg, {}), { inlineThemeDisabled: o, mergedClsPrefixRef: s, mergedRtlRef: c, mergedComponentPropsRef: l } = of(e), { mergedSizeRef: u } = Th({}, {
			defaultSize: "medium",
			mergedSize: (t) => {
				let { size: n } = e;
				if (n) return n;
				let { size: r } = a;
				if (r) return r;
				let { mergedSize: i } = t || {};
				return i ? i.value : l?.value?.Button?.size || "medium";
			}
		}), d = L(() => e.focusable && !e.disabled), f = (n) => {
			d.value || n.preventDefault(), !e.nativeFocusBehavior && (n.preventDefault(), !e.disabled && d.value && t.value?.focus({ preventScroll: !0 }));
		}, p = (t) => {
			if (!e.disabled && !e.loading) {
				let { onClick: r } = e;
				r && qp(r, t), e.text || n.value?.play();
			}
		}, m = (t) => {
			if (t.key === "Enter") {
				if (!e.keyboard) return;
				r.value = !1;
			}
		}, h = (t) => {
			if (t.key === "Enter") {
				if (!e.keyboard || e.loading) {
					t.preventDefault();
					return;
				}
				r.value = !0;
			}
		}, g = () => {
			r.value = !1;
		}, _ = wp("Button", "-button", cg, rg, e, s), v = Zp("Button", c, s), y = L(() => {
			let { common: { cubicBezierEaseInOut: t, cubicBezierEaseOut: n }, self: r } = _.value, { rippleDuration: i, opacityDisabled: a, fontWeight: o, fontWeightStrong: s } = r, c = u.value, { dashed: l, type: d, ghost: f, text: p, color: m, round: h, circle: g, textColor: v, secondary: y, tertiary: b, quaternary: x, strong: S } = e, C = { "--n-font-weight": S ? s : o }, w = {
				"--n-color": "initial",
				"--n-color-hover": "initial",
				"--n-color-pressed": "initial",
				"--n-color-focus": "initial",
				"--n-color-disabled": "initial",
				"--n-ripple-color": "initial",
				"--n-text-color": "initial",
				"--n-text-color-hover": "initial",
				"--n-text-color-pressed": "initial",
				"--n-text-color-focus": "initial",
				"--n-text-color-disabled": "initial"
			}, T = d === "tertiary", E = d === "default", D = T ? "default" : d;
			if (p) {
				let e = v || m;
				w = {
					"--n-color": "#0000",
					"--n-color-hover": "#0000",
					"--n-color-pressed": "#0000",
					"--n-color-focus": "#0000",
					"--n-color-disabled": "#0000",
					"--n-ripple-color": "#0000",
					"--n-text-color": e || r[U("textColorText", D)],
					"--n-text-color-hover": e ? ag(e) : r[U("textColorTextHover", D)],
					"--n-text-color-pressed": e ? og(e) : r[U("textColorTextPressed", D)],
					"--n-text-color-focus": e ? ag(e) : r[U("textColorTextHover", D)],
					"--n-text-color-disabled": e || r[U("textColorTextDisabled", D)]
				};
			} else if (f || l) {
				let e = v || m;
				w = {
					"--n-color": "#0000",
					"--n-color-hover": "#0000",
					"--n-color-pressed": "#0000",
					"--n-color-focus": "#0000",
					"--n-color-disabled": "#0000",
					"--n-ripple-color": m || r[U("rippleColor", D)],
					"--n-text-color": e || r[U("textColorGhost", D)],
					"--n-text-color-hover": e ? ag(e) : r[U("textColorGhostHover", D)],
					"--n-text-color-pressed": e ? og(e) : r[U("textColorGhostPressed", D)],
					"--n-text-color-focus": e ? ag(e) : r[U("textColorGhostHover", D)],
					"--n-text-color-disabled": e || r[U("textColorGhostDisabled", D)]
				};
			} else if (y) {
				let e = E ? r.textColor : T ? r.textColorTertiary : r[U("color", D)], t = m || e, n = d !== "default" && d !== "tertiary";
				w = {
					"--n-color": n ? J(t, { alpha: Number(r.colorOpacitySecondary) }) : r.colorSecondary,
					"--n-color-hover": n ? J(t, { alpha: Number(r.colorOpacitySecondaryHover) }) : r.colorSecondaryHover,
					"--n-color-pressed": n ? J(t, { alpha: Number(r.colorOpacitySecondaryPressed) }) : r.colorSecondaryPressed,
					"--n-color-focus": n ? J(t, { alpha: Number(r.colorOpacitySecondaryHover) }) : r.colorSecondaryHover,
					"--n-color-disabled": r.colorSecondary,
					"--n-ripple-color": "#0000",
					"--n-text-color": t,
					"--n-text-color-hover": t,
					"--n-text-color-pressed": t,
					"--n-text-color-focus": t,
					"--n-text-color-disabled": t
				};
			} else if (b || x) {
				let e = E ? r.textColor : T ? r.textColorTertiary : r[U("color", D)], t = m || e;
				b ? (w["--n-color"] = r.colorTertiary, w["--n-color-hover"] = r.colorTertiaryHover, w["--n-color-pressed"] = r.colorTertiaryPressed, w["--n-color-focus"] = r.colorSecondaryHover, w["--n-color-disabled"] = r.colorTertiary) : (w["--n-color"] = r.colorQuaternary, w["--n-color-hover"] = r.colorQuaternaryHover, w["--n-color-pressed"] = r.colorQuaternaryPressed, w["--n-color-focus"] = r.colorQuaternaryHover, w["--n-color-disabled"] = r.colorQuaternary), w["--n-ripple-color"] = "#0000", w["--n-text-color"] = t, w["--n-text-color-hover"] = t, w["--n-text-color-pressed"] = t, w["--n-text-color-focus"] = t, w["--n-text-color-disabled"] = t;
			} else w = {
				"--n-color": m || r[U("color", D)],
				"--n-color-hover": m ? ag(m) : r[U("colorHover", D)],
				"--n-color-pressed": m ? og(m) : r[U("colorPressed", D)],
				"--n-color-focus": m ? ag(m) : r[U("colorFocus", D)],
				"--n-color-disabled": m || r[U("colorDisabled", D)],
				"--n-ripple-color": m || r[U("rippleColor", D)],
				"--n-text-color": v || (m ? r.textColorPrimary : T ? r.textColorTertiary : r[U("textColor", D)]),
				"--n-text-color-hover": v || (m ? r.textColorHoverPrimary : r[U("textColorHover", D)]),
				"--n-text-color-pressed": v || (m ? r.textColorPressedPrimary : r[U("textColorPressed", D)]),
				"--n-text-color-focus": v || (m ? r.textColorFocusPrimary : r[U("textColorFocus", D)]),
				"--n-text-color-disabled": v || (m ? r.textColorDisabledPrimary : r[U("textColorDisabled", D)])
			};
			let O = {
				"--n-border": "initial",
				"--n-border-hover": "initial",
				"--n-border-pressed": "initial",
				"--n-border-focus": "initial",
				"--n-border-disabled": "initial"
			};
			O = p ? {
				"--n-border": "none",
				"--n-border-hover": "none",
				"--n-border-pressed": "none",
				"--n-border-focus": "none",
				"--n-border-disabled": "none"
			} : {
				"--n-border": r[U("border", D)],
				"--n-border-hover": r[U("borderHover", D)],
				"--n-border-pressed": r[U("borderPressed", D)],
				"--n-border-focus": r[U("borderFocus", D)],
				"--n-border-disabled": r[U("borderDisabled", D)]
			};
			let { [U("height", c)]: ee, [U("fontSize", c)]: te, [U("padding", c)]: ne, [U("paddingRound", c)]: re, [U("iconSize", c)]: ie, [U("borderRadius", c)]: ae, [U("iconMargin", c)]: oe, waveOpacity: se } = r, ce = {
				"--n-width": g && !p ? ee : "initial",
				"--n-height": p ? "initial" : ee,
				"--n-font-size": te,
				"--n-padding": g || p ? "initial" : h ? re : ne,
				"--n-icon-size": ie,
				"--n-icon-margin": oe,
				"--n-border-radius": p ? "initial" : g || h ? ee : ae
			};
			return {
				"--n-bezier": t,
				"--n-bezier-ease-out": n,
				"--n-ripple-duration": i,
				"--n-opacity-disabled": a,
				"--n-wave-opacity": se,
				...C,
				...w,
				...O,
				...ce
			};
		}), b = o ? Sp("button", L(() => {
			let t = "", { dashed: n, type: r, ghost: i, text: a, color: o, round: s, circle: c, textColor: l, secondary: d, tertiary: f, quaternary: p, strong: m } = e;
			n && (t += "a"), i && (t += "b"), a && (t += "c"), s && (t += "d"), c && (t += "e"), d && (t += "f"), f && (t += "g"), p && (t += "h"), m && (t += "i"), o && (t += `j${ch(o)}`), l && (t += `k${ch(l)}`);
			let { value: h } = u;
			return t += `l${h[0]}`, t += `m${r[0]}`, t;
		}), y, e) : void 0;
		return {
			selfElRef: t,
			waveElRef: n,
			mergedClsPrefix: s,
			mergedFocusable: d,
			mergedSize: u,
			showBorder: i,
			enterPressed: r,
			rtlEnabled: v,
			handleMousedown: f,
			handleKeydown: h,
			handleBlur: g,
			handleKeyup: m,
			handleClick: p,
			customColorCssVars: L(() => {
				let { color: t } = e;
				if (!t) return null;
				let n = ag(t);
				return {
					"--n-border-color": t,
					"--n-border-color-hover": n,
					"--n-border-color-pressed": og(t),
					"--n-border-color-focus": n,
					"--n-border-color-disabled": t
				};
			}),
			cssVars: o ? void 0 : y,
			themeClass: b?.themeClass,
			onRender: b?.onRender
		};
	},
	render() {
		let { mergedClsPrefix: e, tag: t, onRender: n } = this;
		n?.();
		let r = Yp(this.$slots.default, (t) => t && (F(), I("span", { class: K(`${e}-button__content`) }, [G(() => t)], 2)));
		return F(), Ni(t, {
			ref: "selfElRef",
			class: K([
				this.themeClass,
				`${e}-button`,
				`${e}-button--${this.type}-type`,
				`${e}-button--${this.mergedSize}-type`,
				this.rtlEnabled && `${e}-button--rtl`,
				this.disabled && `${e}-button--disabled`,
				this.block && `${e}-button--block`,
				this.enterPressed && `${e}-button--pressed`,
				!this.text && this.dashed && `${e}-button--dashed`,
				this.color && `${e}-button--color`,
				this.secondary && `${e}-button--secondary`,
				this.loading && `${e}-button--loading`,
				this.ghost && `${e}-button--ghost`
			]),
			tabindex: this.mergedFocusable ? 0 : -1,
			type: this.attrType,
			style: k(this.cssVars),
			disabled: this.disabled,
			onClick: this.handleClick,
			onBlur: this.handleBlur,
			onMousedown: this.handleMousedown,
			onKeyup: this.handleKeyup,
			onKeydown: this.handleKeydown
		}, {
			default: Fn(() => [
				G(() => this.iconPlacement === "right" && r),
				zi(_h, { width: !0 }, { default: () => Yp(this.$slots.icon, (t) => (this.loading || this.renderIcon || t) && (F(), I("span", {
					class: K(`${e}-button__icon`),
					style: k({ margin: Xp(this.$slots.default) ? "0" : "" })
				}, [zi(Eh, null, { default: () => this.loading ? (F(), Ni(Ih, Ji({
					clsPrefix: e,
					key: "loading",
					class: `${e}-icon-slot`,
					strokeWidth: 20
				}, this.spinProps), null, 16, ["clsPrefix", "class"])) : (F(), I("div", {
					key: "icon",
					class: K(`${e}-icon-slot`),
					role: "none"
				}, [this.renderIcon ? (F(), I(Ci, { key: 0 }, [G(() => this.renderIcon())], 64)) : (F(), I(Ci, { key: 1 }, [G(() => t)], 64))], 2)) }, 1024)], 6))) }, 1024),
				G(() => this.iconPlacement === "left" && r),
				this.text ? G(() => null) : (F(), Ni(Zh, {
					key: 0,
					ref: "waveElRef",
					clsPrefix: e
				}, null, 8, ["clsPrefix"])),
				this.showBorder ? (F(), I("div", {
					key: 2,
					"aria-hidden": !0,
					class: K(`${e}-button__border`),
					style: k(this.customColorCssVars)
				}, null, 6)) : G(() => null),
				this.showBorder ? (F(), I("div", {
					key: 4,
					"aria-hidden": !0,
					class: K(`${e}-button__state-border`),
					style: k(this.customColorCssVars)
				}, null, 6)) : G(() => null)
			]),
			_: 2
		}, 1032, [
			"class",
			"tabindex",
			"type",
			"style",
			"disabled",
			"onClick",
			"onBlur",
			"onMousedown",
			"onKeyup",
			"onKeydown"
		]);
	}
}), ug = { titleFontSize: "22px" };
//#endregion
//#region node_modules/naive-ui/es/calendar/styles/light.mjs
function dg(e) {
	let { borderRadius: t, fontSize: n, lineHeight: r, textColor2: i, textColor1: a, textColorDisabled: o, dividerColor: s, fontWeightStrong: c, primaryColor: l, baseColor: u, hoverColor: d, cardColor: f, modalColor: p, popoverColor: m } = e;
	return {
		...ug,
		borderRadius: t,
		borderColor: q(f, s),
		borderColorModal: q(p, s),
		borderColorPopover: q(m, s),
		textColor: i,
		titleFontWeight: c,
		titleTextColor: a,
		dayTextColor: o,
		fontSize: n,
		lineHeight: r,
		dateColorCurrent: l,
		dateTextColorCurrent: u,
		cellColorHover: q(f, d),
		cellColorHoverModal: q(p, d),
		cellColorHoverPopover: q(m, d),
		cellColor: f,
		cellColorModal: p,
		cellColorPopover: m,
		barColor: l
	};
}
//#endregion
//#region node_modules/naive-ui/es/card/styles/_common.mjs
var fg = {
	paddingSmall: "12px 16px 12px",
	paddingMedium: "19px 24px 20px",
	paddingLarge: "23px 32px 24px",
	paddingHuge: "27px 40px 28px",
	titleFontSizeSmall: "16px",
	titleFontSizeMedium: "18px",
	titleFontSizeLarge: "18px",
	titleFontSizeHuge: "18px",
	closeIconSize: "18px",
	closeSize: "22px"
};
//#endregion
//#region node_modules/naive-ui/es/card/styles/light.mjs
function pg(e) {
	let { primaryColor: t, borderRadius: n, lineHeight: r, fontSize: i, cardColor: a, textColor2: o, textColor1: s, dividerColor: c, fontWeightStrong: l, closeIconColor: u, closeIconColorHover: d, closeIconColorPressed: f, closeColorHover: p, closeColorPressed: m, modalColor: h, boxShadow1: g, popoverColor: _, actionColor: v } = e;
	return {
		...fg,
		lineHeight: r,
		color: a,
		colorModal: h,
		colorPopover: _,
		colorTarget: t,
		colorEmbedded: v,
		colorEmbeddedModal: v,
		colorEmbeddedPopover: v,
		textColor: o,
		titleTextColor: s,
		borderColor: c,
		actionColor: v,
		titleFontWeight: l,
		closeColorHover: p,
		closeColorPressed: m,
		closeBorderRadius: n,
		closeIconColor: u,
		closeIconColorHover: d,
		closeIconColorPressed: f,
		fontSizeSmall: i,
		fontSizeMedium: i,
		fontSizeLarge: i,
		fontSizeHuge: i,
		boxShadow: g,
		borderRadius: n
	};
}
var mg = {
	name: "Card",
	common: pp,
	self: pg
}, hg = {
	name: "Card",
	common: Q,
	self(e) {
		let t = pg(e), { cardColor: n, modalColor: r, popoverColor: i } = e;
		return t.colorEmbedded = n, t.colorEmbeddedModal = r, t.colorEmbeddedPopover = i, t;
	}
}, gg = B("card-content", "\n flex: 1;\n min-width: 0;\n box-sizing: border-box;\n padding: 0 var(--n-padding-left) var(--n-padding-bottom) var(--n-padding-left);\n font-size: var(--n-font-size);\n"), _g = z([
	B("card", "\n font-size: var(--n-font-size);\n line-height: var(--n-line-height);\n display: flex;\n flex-direction: column;\n width: 100%;\n box-sizing: border-box;\n position: relative;\n border-radius: var(--n-border-radius);\n background-color: var(--n-color);\n color: var(--n-text-color);\n word-break: break-word;\n transition: \n color .3s var(--n-bezier),\n background-color .3s var(--n-bezier),\n box-shadow .3s var(--n-bezier),\n border-color .3s var(--n-bezier);\n ", [
		Ss({ background: "var(--n-color-modal)" }),
		H("hoverable", [z("&:hover", "box-shadow: var(--n-box-shadow);")]),
		H("content-segmented", [z(">", [B("card-content", "\n padding-top: var(--n-padding-bottom);\n "), V("content-scrollbar", [z(">", [B("scrollbar-container", [z(">", [B("card-content", "\n padding-top: var(--n-padding-bottom);\n ")])])])])])]),
		H("content-soft-segmented", [z(">", [B("card-content", "\n margin: 0 var(--n-padding-left);\n padding: var(--n-padding-bottom) 0;\n "), V("content-scrollbar", [z(">", [B("scrollbar-container", [z(">", [B("card-content", "\n margin: 0 var(--n-padding-left);\n padding: var(--n-padding-bottom) 0;\n ")])])])])])]),
		H("footer-segmented", [z(">", [V("footer", "\n padding-top: var(--n-padding-bottom);\n ")])]),
		H("footer-soft-segmented", [z(">", [V("footer", "\n padding: var(--n-padding-bottom) 0;\n margin: 0 var(--n-padding-left);\n ")])]),
		z(">", [
			B("card-header", "\n box-sizing: border-box;\n display: flex;\n align-items: center;\n font-size: var(--n-title-font-size);\n padding:\n var(--n-padding-top)\n var(--n-padding-left)\n var(--n-padding-bottom)\n var(--n-padding-left);\n ", [
				V("main", "\n font-weight: var(--n-title-font-weight);\n transition: color .3s var(--n-bezier);\n flex: 1;\n min-width: 0;\n color: var(--n-title-text-color);\n "),
				V("extra", "\n display: flex;\n align-items: center;\n font-size: var(--n-font-size);\n font-weight: 400;\n transition: color .3s var(--n-bezier);\n color: var(--n-text-color);\n "),
				V("close", "\n margin: 0 0 0 8px;\n transition:\n background-color .3s var(--n-bezier),\n color .3s var(--n-bezier);\n ")
			]),
			V("action", "\n box-sizing: border-box;\n transition:\n background-color .3s var(--n-bezier),\n border-color .3s var(--n-bezier);\n background-clip: padding-box;\n background-color: var(--n-action-color);\n "),
			gg,
			B("card-content", [z("&:first-child", "\n padding-top: var(--n-padding-bottom);\n ")]),
			V("content-scrollbar", "\n display: flex;\n flex-direction: column;\n ", [z(">", [B("scrollbar-container", [z(">", [gg])])]), z("&:first-child >", [B("scrollbar-container", [z(">", [B("card-content", "\n padding-top: var(--n-padding-bottom);\n ")])])])]),
			V("footer", "\n box-sizing: border-box;\n padding: 0 var(--n-padding-left) var(--n-padding-bottom) var(--n-padding-left);\n font-size: var(--n-font-size);\n ", [z("&:first-child", "\n padding-top: var(--n-padding-bottom);\n ")]),
			V("action", "\n background-color: var(--n-action-color);\n padding: var(--n-padding-bottom) var(--n-padding-left);\n border-bottom-left-radius: var(--n-border-radius);\n border-bottom-right-radius: var(--n-border-radius);\n ")
		]),
		B("card-cover", "\n overflow: hidden;\n width: 100%;\n border-radius: var(--n-border-radius) var(--n-border-radius) 0 0;\n ", [z("img", "\n display: block;\n width: 100%;\n ")]),
		H("bordered", "\n border: 1px solid var(--n-border-color);\n ", [z("&:target", "border-color: var(--n-color-target);")]),
		H("action-segmented", [z(">", [V("action", [z("&:not(:first-child)", "\n border-top: 1px solid var(--n-border-color);\n ")])])]),
		H("content-segmented, content-soft-segmented", [z(">", [B("card-content", "\n transition: border-color 0.3s var(--n-bezier);\n ", [z("&:not(:first-child)", "\n border-top: 1px solid var(--n-border-color);\n ")]), V("content-scrollbar", "\n transition: border-color 0.3s var(--n-bezier);\n ", [z("&:not(:first-child)", "\n border-top: 1px solid var(--n-border-color);\n ")])])]),
		H("footer-segmented, footer-soft-segmented", [z(">", [V("footer", "\n transition: border-color 0.3s var(--n-bezier);\n ", [z("&:not(:first-child)", "\n border-top: 1px solid var(--n-border-color);\n ")])])]),
		H("embedded", "\n background-color: var(--n-color-embedded);\n ")
	]),
	bs(B("card", "\n background: var(--n-color-modal);\n ", [H("embedded", "\n background-color: var(--n-color-embedded-modal);\n ")])),
	xs(B("card", "\n background: var(--n-color-popover);\n ", [H("embedded", "\n background-color: var(--n-color-embedded-popover);\n ")]))
]), vg = {
	title: [String, Function],
	contentClass: String,
	contentStyle: [Object, String],
	contentScrollable: Boolean,
	headerClass: String,
	headerStyle: [Object, String],
	headerExtraClass: String,
	headerExtraStyle: [Object, String],
	footerClass: String,
	footerStyle: [Object, String],
	embedded: Boolean,
	segmented: {
		type: [Boolean, Object],
		default: !1
	},
	size: String,
	bordered: {
		type: Boolean,
		default: !0
	},
	closable: Boolean,
	hoverable: Boolean,
	role: String,
	onClose: [Function, Array],
	tag: {
		type: String,
		default: "div"
	},
	cover: Function,
	content: [String, Function],
	footer: Function,
	action: Function,
	headerExtra: Function,
	closeFocusable: Boolean
};
nf(vg);
var yg = /* @__PURE__ */ P({
	name: "Card",
	props: {
		...wp.props,
		...vg
	},
	slots: Object,
	setup(e) {
		let t = () => {
			let { onClose: t } = e;
			t && qp(t);
		}, { inlineThemeDisabled: n, mergedClsPrefixRef: r, mergedRtlRef: i, mergedComponentPropsRef: a } = of(e), o = wp("Card", "-card", _g, mg, e, r), s = Zp("Card", i, r), c = L(() => e.size || a?.value?.Card?.size || "medium"), l = L(() => {
			let e = c.value, { self: { color: t, colorModal: n, colorTarget: r, textColor: i, titleTextColor: a, titleFontWeight: s, borderColor: l, actionColor: u, borderRadius: d, lineHeight: f, closeIconColor: p, closeIconColorHover: m, closeIconColorPressed: h, closeColorHover: g, closeColorPressed: _, closeBorderRadius: v, closeIconSize: y, closeSize: b, boxShadow: x, colorPopover: S, colorEmbedded: C, colorEmbeddedModal: w, colorEmbeddedPopover: T, [U("padding", e)]: E, [U("fontSize", e)]: D, [U("titleFontSize", e)]: O }, common: { cubicBezierEaseInOut: ee } } = o.value, { top: te, left: ne, bottom: re } = Ef(E);
			return {
				"--n-bezier": ee,
				"--n-border-radius": d,
				"--n-color": t,
				"--n-color-modal": n,
				"--n-color-popover": S,
				"--n-color-embedded": C,
				"--n-color-embedded-modal": w,
				"--n-color-embedded-popover": T,
				"--n-color-target": r,
				"--n-text-color": i,
				"--n-line-height": f,
				"--n-action-color": u,
				"--n-title-text-color": a,
				"--n-title-font-weight": s,
				"--n-close-icon-color": p,
				"--n-close-icon-color-hover": m,
				"--n-close-icon-color-pressed": h,
				"--n-close-color-hover": g,
				"--n-close-color-pressed": _,
				"--n-border-color": l,
				"--n-box-shadow": x,
				"--n-padding-top": te,
				"--n-padding-bottom": re,
				"--n-padding-left": ne,
				"--n-font-size": D,
				"--n-title-font-size": O,
				"--n-close-size": b,
				"--n-close-icon-size": y,
				"--n-close-border-radius": v
			};
		}), u = n ? Sp("card", L(() => c.value[0]), l, e) : void 0;
		return {
			rtlEnabled: s,
			mergedClsPrefix: r,
			mergedTheme: o,
			handleCloseClick: t,
			cssVars: n ? void 0 : l,
			themeClass: u?.themeClass,
			onRender: u?.onRender
		};
	},
	render() {
		let { segmented: e, bordered: t, hoverable: n, mergedClsPrefix: r, rtlEnabled: i, onRender: a, embedded: o, tag: s, $slots: c } = this;
		return a?.(), F(), Ni(s, {
			class: K([
				`${r}-card`,
				this.themeClass,
				o && `${r}-card--embedded`,
				{
					[`${r}-card--rtl`]: i,
					[`${r}-card--content-scrollable`]: this.contentScrollable,
					[`${r}-card--content${typeof e != "boolean" && e.content === "soft" ? "-soft" : ""}-segmented`]: e === !0 || e !== !1 && e.content,
					[`${r}-card--footer${typeof e != "boolean" && e.footer === "soft" ? "-soft" : ""}-segmented`]: e === !0 || e !== !1 && e.footer,
					[`${r}-card--action-segmented`]: e === !0 || e !== !1 && e.action,
					[`${r}-card--bordered`]: t,
					[`${r}-card--hoverable`]: n
				}
			]),
			style: k(this.cssVars),
			role: this.role
		}, {
			default: Fn(() => [
				G(() => Yp(c.cover, (e) => {
					let t = this.cover ? Jp([this.cover()]) : e;
					return t && (F(), I("div", {
						class: K(`${r}-card-cover`),
						role: "none"
					}, [G(() => t)], 2));
				})),
				G(() => Yp(c.header, (e) => {
					let { title: t } = this, n = t ? Jp(typeof t == "function" ? [t()] : [t]) : e;
					return n || this.closable ? (F(), I("div", {
						key: 1,
						class: K([`${r}-card-header`, this.headerClass]),
						style: k(this.headerStyle),
						role: "heading"
					}, [
						Ri("div", {
							class: K(`${r}-card-header__main`),
							role: "heading"
						}, [G(() => n)], 2),
						G(() => Yp(c["header-extra"], (e) => {
							let t = this.headerExtra ? Jp([this.headerExtra()]) : e;
							return t && (F(), I("div", {
								class: K([`${r}-card-header__extra`, this.headerExtraClass]),
								style: k(this.headerExtraStyle)
							}, [G(() => t)], 6));
						})),
						G(() => this.closable && (F(), Ni(fh, {
							clsPrefix: r,
							class: K(`${r}-card-header__close`),
							onClick: this.handleCloseClick,
							focusable: this.closeFocusable,
							absolute: !0
						}, null, 8, [
							"clsPrefix",
							"class",
							"onClick",
							"focusable"
						])))
					], 6)) : null;
				})),
				G(() => Yp(c.default, (e) => {
					let { content: t } = this, n = t ? Jp(typeof t == "function" ? [t()] : [t]) : e;
					return n ? this.contentScrollable ? (F(), Ni(ah, {
						key: 2,
						class: K(`${r}-card__content-scrollbar`),
						contentClass: [`${r}-card-content`, this.contentClass],
						contentStyle: this.contentStyle
					}, { default: () => n }, 1032, [
						"class",
						"contentClass",
						"contentStyle"
					])) : (F(), I("div", {
						key: 3,
						class: K([`${r}-card-content`, this.contentClass]),
						style: k(this.contentStyle),
						role: "none"
					}, [G(() => n)], 6)) : null;
				})),
				G(() => Yp(c.footer, (e) => {
					let t = this.footer ? Jp([this.footer()]) : e;
					return t && (F(), I("div", {
						class: K([`${r}-card__footer`, this.footerClass]),
						style: k(this.footerStyle),
						role: "none"
					}, [G(() => t)], 6));
				})),
				G(() => Yp(c.action, (e) => {
					let t = this.action ? Jp([this.action()]) : e;
					return t && (F(), I("div", {
						class: K(`${r}-card__action`),
						role: "none"
					}, [G(() => t)], 2));
				}))
			]),
			_: 2
		}, 1032, [
			"class",
			"style",
			"role"
		]);
	}
});
//#endregion
//#region node_modules/naive-ui/es/carousel/styles/light.mjs
function bg() {
	return {
		dotSize: "8px",
		dotColor: "rgba(255, 255, 255, .3)",
		dotColorActive: "rgba(255, 255, 255, 1)",
		dotColorFocus: "rgba(255, 255, 255, .5)",
		dotLineWidth: "16px",
		dotLineWidthActive: "24px",
		arrowColor: "#eee"
	};
}
//#endregion
//#region node_modules/naive-ui/es/checkbox/styles/_common.mjs
var xg = {
	sizeSmall: "14px",
	sizeMedium: "16px",
	sizeLarge: "18px",
	labelPadding: "0 8px",
	labelFontWeight: "400"
};
//#endregion
//#region node_modules/naive-ui/es/checkbox/styles/light.mjs
function Sg(e) {
	let { baseColor: t, inputColorDisabled: n, cardColor: r, modalColor: i, popoverColor: a, textColorDisabled: o, borderColor: s, primaryColor: c, textColor2: l, fontSizeSmall: u, fontSizeMedium: d, fontSizeLarge: f, borderRadiusSmall: p, lineHeight: m } = e;
	return {
		...xg,
		labelLineHeight: m,
		fontSizeSmall: u,
		fontSizeMedium: d,
		fontSizeLarge: f,
		borderRadius: p,
		color: t,
		colorChecked: c,
		colorDisabled: n,
		colorDisabledChecked: n,
		colorTableHeader: r,
		colorTableHeaderModal: i,
		colorTableHeaderPopover: a,
		checkMarkColor: t,
		checkMarkColorDisabled: o,
		checkMarkColorDisabledChecked: o,
		border: `1px solid ${s}`,
		borderDisabled: `1px solid ${s}`,
		borderDisabledChecked: `1px solid ${s}`,
		borderChecked: `1px solid ${c}`,
		borderFocus: `1px solid ${c}`,
		boxShadowFocus: `0 0 0 2px ${J(c, { alpha: .3 })}`,
		textColor: l,
		textColorDisabled: o
	};
}
var Cg = {
	name: "Checkbox",
	common: Q,
	self(e) {
		let { cardColor: t } = e, n = Sg(e);
		return n.color = "#0000", n.checkMarkColor = t, n;
	}
};
//#endregion
//#region node_modules/naive-ui/es/cascader/styles/light.mjs
function wg(e) {
	let { borderRadius: t, boxShadow2: n, popoverColor: r, textColor2: i, textColor3: a, primaryColor: o, textColorDisabled: s, dividerColor: c, hoverColor: l, fontSizeMedium: u, heightMedium: d } = e;
	return {
		menuBorderRadius: t,
		menuColor: r,
		menuBoxShadow: n,
		menuDividerColor: c,
		menuHeight: "calc(var(--n-option-height) * 6.6)",
		optionArrowColor: a,
		optionHeight: d,
		optionFontSize: u,
		optionColorHover: l,
		optionTextColor: i,
		optionTextColorActive: o,
		optionTextColorDisabled: s,
		optionCheckMarkColor: o,
		loadingColor: o,
		columnWidth: "180px"
	};
}
//#endregion
//#region node_modules/naive-ui/es/cascader/styles/dark.mjs
var Tg = {
	name: "Cascader",
	common: Q,
	peers: {
		InternalSelectMenu: Ap,
		InternalSelection: mh,
		Scrollbar: _p,
		Checkbox: Cg,
		Empty: bp
	},
	self: wg
}, Eg = {
	name: "Code",
	common: Q,
	self(e) {
		let { textColor2: t, fontSize: n, fontWeightStrong: r, textColor3: i } = e;
		return {
			textColor: t,
			fontSize: n,
			fontWeightStrong: r,
			"mono-3": "#5c6370",
			"hue-1": "#56b6c2",
			"hue-2": "#61aeee",
			"hue-3": "#c678dd",
			"hue-4": "#98c379",
			"hue-5": "#e06c75",
			"hue-5-2": "#be5046",
			"hue-6": "#d19a66",
			"hue-6-2": "#e6c07b",
			lineNumberTextColor: i
		};
	}
};
//#endregion
//#region node_modules/naive-ui/es/collapse/styles/light.mjs
function Dg(e) {
	let { fontWeight: t, textColor1: n, textColor2: r, textColorDisabled: i, dividerColor: a, fontSize: o } = e;
	return {
		titleFontSize: o,
		titleFontWeight: t,
		dividerColor: a,
		titleTextColor: n,
		titleTextColorDisabled: i,
		fontSize: o,
		textColor: r,
		arrowColor: r,
		arrowColorDisabled: i,
		itemMargin: "16px 0 0 0",
		titlePadding: "16px 0 0 0"
	};
}
//#endregion
//#region node_modules/naive-ui/es/collapse/styles/dark.mjs
var Og = {
	name: "Collapse",
	common: Q,
	self: Dg
};
//#endregion
//#region node_modules/naive-ui/es/collapse-transition/styles/light.mjs
function kg(e) {
	let { cubicBezierEaseInOut: t } = e;
	return { bezier: t };
}
//#endregion
//#region node_modules/naive-ui/es/color-picker/styles/light.mjs
function Ag(e) {
	let { fontSize: t, boxShadow2: n, popoverColor: r, textColor2: i, borderRadius: a, borderColor: o, heightSmall: s, heightMedium: c, heightLarge: l, fontSizeSmall: u, fontSizeMedium: d, fontSizeLarge: f, dividerColor: p } = e;
	return {
		panelFontSize: t,
		boxShadow: n,
		color: r,
		textColor: i,
		borderRadius: a,
		border: `1px solid ${o}`,
		heightSmall: s,
		heightMedium: c,
		heightLarge: l,
		fontSizeSmall: u,
		fontSizeMedium: d,
		fontSizeLarge: f,
		dividerColor: p
	};
}
var jg = /* @__PURE__ */ P({
	name: "ConfigProvider",
	alias: ["App"],
	props: {
		abstract: Boolean,
		bordered: {
			type: Boolean,
			default: void 0
		},
		clsPrefix: String,
		locale: Object,
		dateLocale: Object,
		namespace: String,
		rtl: Array,
		tag: {
			type: String,
			default: "div"
		},
		hljs: Object,
		katex: Object,
		theme: Object,
		themeOverrides: Object,
		componentOptions: Object,
		icons: Object,
		breakpoints: Object,
		preflightStyleDisabled: Boolean,
		styleMountTarget: Object,
		inlineThemeDisabled: {
			type: Boolean,
			default: void 0
		},
		as: {
			type: String,
			validator: () => (ef("config-provider", "`as` is deprecated, please use `tag` instead."), !0),
			default: void 0
		}
	},
	setup(e) {
		let t = Rn(af, null), n = L(() => {
			let { theme: n } = e;
			if (n === null) return;
			let r = t?.mergedThemeRef.value;
			return n === void 0 ? r : r === void 0 ? n : Object.assign({}, r, n);
		}), r = L(() => {
			let { themeOverrides: n } = e;
			if (n !== null) {
				if (n === void 0) return t?.mergedThemeOverridesRef.value;
				{
					let e = t?.mergedThemeOverridesRef.value;
					return e === void 0 ? n : $d({}, e, n);
				}
			}
		}), i = Up(() => {
			let { namespace: n } = e;
			return n === void 0 ? t?.mergedNamespaceRef.value : n;
		}), a = Up(() => {
			let { bordered: n } = e;
			return n === void 0 ? t?.mergedBorderedRef.value : n;
		}), o = L(() => {
			let { icons: n } = e;
			return n === void 0 ? t?.mergedIconsRef.value : n;
		}), s = L(() => {
			let { componentOptions: n } = e;
			return n === void 0 ? t?.mergedComponentPropsRef.value : n;
		}), c = L(() => {
			let { clsPrefix: n } = e;
			return n === void 0 ? t ? t.mergedClsPrefixRef.value : "n" : n;
		}), l = L(() => {
			let { rtl: n } = e;
			if (n === void 0) return t?.mergedRtlRef.value;
			let r = {};
			for (let e of n) r[e.name] = Ut(e), e.peers?.forEach((e) => {
				e.name in r || (r[e.name] = Ut(e));
			});
			return r;
		}), u = L(() => e.breakpoints || t?.mergedBreakpointsRef.value), d = e.inlineThemeDisabled || t?.inlineThemeDisabled, f = e.preflightStyleDisabled || t?.preflightStyleDisabled, p = e.styleMountTarget || t?.styleMountTarget;
		return Ln(af, {
			mergedThemeHashRef: L(() => {
				let { value: e } = n, { value: t } = r, i = t && Object.keys(t).length !== 0, a = e?.name;
				return a ? i ? `${a}-${ns(JSON.stringify(r.value))}` : a : i ? ns(JSON.stringify(r.value)) : "";
			}),
			mergedBreakpointsRef: u,
			mergedRtlRef: l,
			mergedIconsRef: o,
			mergedComponentPropsRef: s,
			mergedBorderedRef: a,
			mergedNamespaceRef: i,
			mergedClsPrefixRef: c,
			mergedLocaleRef: L(() => {
				let { locale: n } = e;
				if (n !== null) return n === void 0 ? t?.mergedLocaleRef.value : n;
			}),
			mergedDateLocaleRef: L(() => {
				let { dateLocale: n } = e;
				if (n !== null) return n === void 0 ? t?.mergedDateLocaleRef.value : n;
			}),
			mergedHljsRef: L(() => {
				let { hljs: n } = e;
				return n === void 0 ? t?.mergedHljsRef.value : n;
			}),
			mergedKatexRef: L(() => {
				let { katex: n } = e;
				return n === void 0 ? t?.mergedKatexRef.value : n;
			}),
			mergedThemeRef: n,
			mergedThemeOverridesRef: r,
			inlineThemeDisabled: d || !1,
			preflightStyleDisabled: f || !1,
			styleMountTarget: p
		}), {
			mergedClsPrefix: c,
			mergedBordered: a,
			mergedNamespace: i,
			mergedTheme: n,
			mergedThemeOverrides: r
		};
	},
	render() {
		return this.abstract ? this.$slots.default?.() : R(this.as || this.tag, { class: `${this.mergedClsPrefix || "n"}-config-provider` }, this.$slots.default?.());
	}
}), Mg = {
	name: "Popselect",
	common: Q,
	peers: {
		Popover: Np,
		InternalSelectMenu: Ap
	}
};
//#endregion
//#region node_modules/naive-ui/es/select/styles/light.mjs
function Ng(e) {
	let { boxShadow2: t } = e;
	return { menuBoxShadow: t };
}
var Pg = {
	name: "Select",
	common: Q,
	peers: {
		InternalSelection: mh,
		InternalSelectMenu: Ap
	},
	self: Ng
}, Fg = {
	itemPaddingSmall: "0 4px",
	itemMarginSmall: "0 0 0 8px",
	itemMarginSmallRtl: "0 8px 0 0",
	itemPaddingMedium: "0 4px",
	itemMarginMedium: "0 0 0 8px",
	itemMarginMediumRtl: "0 8px 0 0",
	itemPaddingLarge: "0 4px",
	itemMarginLarge: "0 0 0 8px",
	itemMarginLargeRtl: "0 8px 0 0",
	buttonIconSizeSmall: "14px",
	buttonIconSizeMedium: "16px",
	buttonIconSizeLarge: "18px",
	inputWidthSmall: "60px",
	selectWidthSmall: "unset",
	inputMarginSmall: "0 0 0 8px",
	inputMarginSmallRtl: "0 8px 0 0",
	selectMarginSmall: "0 0 0 8px",
	prefixMarginSmall: "0 8px 0 0",
	suffixMarginSmall: "0 0 0 8px",
	inputWidthMedium: "60px",
	selectWidthMedium: "unset",
	inputMarginMedium: "0 0 0 8px",
	inputMarginMediumRtl: "0 8px 0 0",
	selectMarginMedium: "0 0 0 8px",
	prefixMarginMedium: "0 8px 0 0",
	suffixMarginMedium: "0 0 0 8px",
	inputWidthLarge: "60px",
	selectWidthLarge: "unset",
	inputMarginLarge: "0 0 0 8px",
	inputMarginLargeRtl: "0 8px 0 0",
	selectMarginLarge: "0 0 0 8px",
	prefixMarginLarge: "0 8px 0 0",
	suffixMarginLarge: "0 0 0 8px"
};
//#endregion
//#region node_modules/naive-ui/es/pagination/styles/light.mjs
function Ig(e) {
	let { textColor2: t, primaryColor: n, primaryColorHover: r, primaryColorPressed: i, inputColorDisabled: a, textColorDisabled: o, borderColor: s, borderRadius: c, fontSizeTiny: l, fontSizeSmall: u, fontSizeMedium: d, heightTiny: f, heightSmall: p, heightMedium: m } = e;
	return {
		...Fg,
		buttonColor: "#0000",
		buttonColorHover: "#0000",
		buttonColorPressed: "#0000",
		buttonBorder: `1px solid ${s}`,
		buttonBorderHover: `1px solid ${s}`,
		buttonBorderPressed: `1px solid ${s}`,
		buttonIconColor: t,
		buttonIconColorHover: t,
		buttonIconColorPressed: t,
		itemTextColor: t,
		itemTextColorHover: r,
		itemTextColorPressed: i,
		itemTextColorActive: n,
		itemTextColorDisabled: o,
		itemColor: "#0000",
		itemColorHover: "#0000",
		itemColorPressed: "#0000",
		itemColorActive: "#0000",
		itemColorActiveHover: "#0000",
		itemColorDisabled: a,
		itemBorder: "1px solid #0000",
		itemBorderHover: "1px solid #0000",
		itemBorderPressed: "1px solid #0000",
		itemBorderActive: `1px solid ${n}`,
		itemBorderDisabled: `1px solid ${s}`,
		itemBorderRadius: c,
		itemSizeSmall: f,
		itemSizeMedium: p,
		itemSizeLarge: m,
		itemFontSizeSmall: l,
		itemFontSizeMedium: u,
		itemFontSizeLarge: d,
		jumperFontSizeSmall: l,
		jumperFontSizeMedium: u,
		jumperFontSizeLarge: d,
		jumperTextColor: t,
		jumperTextColorDisabled: o
	};
}
var Lg = {
	name: "Pagination",
	common: Q,
	peers: {
		Select: Pg,
		Input: Ch,
		Popselect: Mg
	},
	self(e) {
		let { primaryColor: t, opacity3: n } = e, r = J(t, { alpha: Number(n) }), i = Ig(e);
		return i.itemBorderActive = `1px solid ${r}`, i.itemBorderDisabled = "1px solid #0000", i;
	}
}, Rg = {
	padding: "4px 0",
	optionIconSizeSmall: "14px",
	optionIconSizeMedium: "16px",
	optionIconSizeLarge: "16px",
	optionIconSizeHuge: "18px",
	optionSuffixWidthSmall: "14px",
	optionSuffixWidthMedium: "14px",
	optionSuffixWidthLarge: "16px",
	optionSuffixWidthHuge: "16px",
	optionIconSuffixWidthSmall: "32px",
	optionIconSuffixWidthMedium: "32px",
	optionIconSuffixWidthLarge: "36px",
	optionIconSuffixWidthHuge: "36px",
	optionPrefixWidthSmall: "14px",
	optionPrefixWidthMedium: "14px",
	optionPrefixWidthLarge: "16px",
	optionPrefixWidthHuge: "16px",
	optionIconPrefixWidthSmall: "36px",
	optionIconPrefixWidthMedium: "36px",
	optionIconPrefixWidthLarge: "40px",
	optionIconPrefixWidthHuge: "40px"
};
//#endregion
//#region node_modules/naive-ui/es/dropdown/styles/light.mjs
function zg(e) {
	let { primaryColor: t, textColor2: n, dividerColor: r, hoverColor: i, popoverColor: a, invertedColor: o, borderRadius: s, fontSizeSmall: c, fontSizeMedium: l, fontSizeLarge: u, fontSizeHuge: d, heightSmall: f, heightMedium: p, heightLarge: m, heightHuge: h, textColor3: g, opacityDisabled: _ } = e;
	return {
		...Rg,
		optionHeightSmall: f,
		optionHeightMedium: p,
		optionHeightLarge: m,
		optionHeightHuge: h,
		borderRadius: s,
		fontSizeSmall: c,
		fontSizeMedium: l,
		fontSizeLarge: u,
		fontSizeHuge: d,
		optionTextColor: n,
		optionTextColorHover: n,
		optionTextColorActive: t,
		optionTextColorChildActive: t,
		color: a,
		dividerColor: r,
		suffixColor: n,
		prefixColor: n,
		optionColorHover: i,
		optionColorActive: J(t, { alpha: .1 }),
		groupHeaderTextColor: g,
		optionTextColorInverted: "#BBB",
		optionTextColorHoverInverted: "#FFF",
		optionTextColorActiveInverted: "#FFF",
		optionTextColorChildActiveInverted: "#FFF",
		colorInverted: o,
		dividerColorInverted: "#BBB",
		suffixColorInverted: "#BBB",
		prefixColorInverted: "#BBB",
		optionColorHoverInverted: t,
		optionColorActiveInverted: t,
		groupHeaderTextColorInverted: "#AAA",
		optionOpacityDisabled: _
	};
}
var Bg = {
	name: "Dropdown",
	common: Q,
	peers: { Popover: Np },
	self(e) {
		let { primaryColorSuppl: t, primaryColor: n, popoverColor: r } = e, i = zg(e);
		return i.colorInverted = r, i.optionColorActive = J(n, { alpha: .15 }), i.optionColorActiveInverted = t, i.optionColorHoverInverted = t, i;
	}
}, Vg = { padding: "8px 14px" }, Hg = {
	name: "Tooltip",
	common: Q,
	peers: { Popover: Np },
	self(e) {
		let { borderRadius: t, boxShadow2: n, popoverColor: r, textColor2: i } = e;
		return {
			...Vg,
			borderRadius: t,
			boxShadow: n,
			color: r,
			textColor: i
		};
	}
}, Ug = {
	radioSizeSmall: "14px",
	radioSizeMedium: "16px",
	radioSizeLarge: "18px",
	labelPadding: "0 8px",
	labelFontWeight: "400"
}, Wg = {
	name: "Radio",
	common: Q,
	self(e) {
		let { borderColor: t, primaryColor: n, baseColor: r, textColorDisabled: i, inputColorDisabled: a, textColor2: o, opacityDisabled: s, borderRadius: c, fontSizeSmall: l, fontSizeMedium: u, fontSizeLarge: d, heightSmall: f, heightMedium: p, heightLarge: m, lineHeight: h } = e;
		return {
			...Ug,
			labelLineHeight: h,
			buttonHeightSmall: f,
			buttonHeightMedium: p,
			buttonHeightLarge: m,
			fontSizeSmall: l,
			fontSizeMedium: u,
			fontSizeLarge: d,
			boxShadow: `inset 0 0 0 1px ${t}`,
			boxShadowActive: `inset 0 0 0 1px ${n}`,
			boxShadowFocus: `inset 0 0 0 1px ${n}, 0 0 0 2px ${J(n, { alpha: .3 })}`,
			boxShadowHover: `inset 0 0 0 1px ${n}`,
			boxShadowDisabled: `inset 0 0 0 1px ${t}`,
			color: "#0000",
			colorDisabled: a,
			colorActive: "#0000",
			textColor: o,
			textColorDisabled: i,
			dotColorActive: n,
			dotColorDisabled: t,
			buttonBorderColor: t,
			buttonBorderColorActive: n,
			buttonBorderColorHover: n,
			buttonColor: "#0000",
			buttonColorActive: n,
			buttonTextColor: o,
			buttonTextColorActive: r,
			buttonTextColorHover: n,
			opacityDisabled: s,
			buttonBoxShadowFocus: `inset 0 0 0 1px ${n}, 0 0 0 2px ${J(n, { alpha: .3 })}`,
			buttonBoxShadowHover: `inset 0 0 0 1px ${n}`,
			buttonBoxShadow: "inset 0 0 0 1px #0000",
			buttonBorderRadius: c
		};
	}
}, Gg = {
	name: "Ellipsis",
	common: Q,
	peers: { Tooltip: Hg }
}, Kg = {
	thPaddingSmall: "8px",
	thPaddingMedium: "12px",
	thPaddingLarge: "12px",
	tdPaddingSmall: "8px",
	tdPaddingMedium: "12px",
	tdPaddingLarge: "12px",
	sorterSize: "15px",
	resizableContainerSize: "8px",
	resizableSize: "2px",
	filterSize: "15px",
	paginationMargin: "12px 0 0 0",
	emptyPadding: "48px 0",
	actionPadding: "8px 12px",
	actionButtonMargin: "0 8px 0 0"
};
//#endregion
//#region node_modules/naive-ui/es/data-table/styles/light.mjs
function qg(e) {
	let { cardColor: t, modalColor: n, popoverColor: r, textColor2: i, textColor1: a, tableHeaderColor: o, tableColorHover: s, iconColor: c, primaryColor: l, fontWeightStrong: u, borderRadius: d, lineHeight: f, fontSizeSmall: p, fontSizeMedium: m, fontSizeLarge: h, dividerColor: g, heightSmall: _, opacityDisabled: v, tableColorStriped: y } = e;
	return {
		...Kg,
		actionDividerColor: g,
		lineHeight: f,
		borderRadius: d,
		fontSizeSmall: p,
		fontSizeMedium: m,
		fontSizeLarge: h,
		borderColor: q(t, g),
		tdColorHover: q(t, s),
		tdColorSorting: q(t, s),
		tdColorStriped: q(t, y),
		thColor: q(t, o),
		thColorHover: q(q(t, o), s),
		thColorSorting: q(q(t, o), s),
		tdColor: t,
		tdTextColor: i,
		thTextColor: a,
		thFontWeight: u,
		thButtonColorHover: s,
		thIconColor: c,
		thIconColorActive: l,
		borderColorModal: q(n, g),
		tdColorHoverModal: q(n, s),
		tdColorSortingModal: q(n, s),
		tdColorStripedModal: q(n, y),
		thColorModal: q(n, o),
		thColorHoverModal: q(q(n, o), s),
		thColorSortingModal: q(q(n, o), s),
		tdColorModal: n,
		borderColorPopover: q(r, g),
		tdColorHoverPopover: q(r, s),
		tdColorSortingPopover: q(r, s),
		tdColorStripedPopover: q(r, y),
		thColorPopover: q(r, o),
		thColorHoverPopover: q(q(r, o), s),
		thColorSortingPopover: q(q(r, o), s),
		tdColorPopover: r,
		boxShadowBefore: "inset -12px 0 8px -12px rgba(0, 0, 0, .18)",
		boxShadowAfter: "inset 12px 0 8px -12px rgba(0, 0, 0, .18)",
		loadingColor: l,
		loadingSize: _,
		opacityLoading: v
	};
}
//#endregion
//#region node_modules/naive-ui/es/data-table/styles/dark.mjs
var Jg = {
	name: "DataTable",
	common: Q,
	peers: {
		Button: ig,
		Checkbox: Cg,
		Radio: Wg,
		Pagination: Lg,
		Scrollbar: _p,
		Empty: xp,
		Popover: Np,
		Ellipsis: Gg,
		Dropdown: Bg
	},
	self(e) {
		let t = qg(e);
		return t.boxShadowAfter = "inset 12px 0 8px -12px rgba(0, 0, 0, .36)", t.boxShadowBefore = "inset -12px 0 8px -12px rgba(0, 0, 0, .36)", t;
	}
};
//#endregion
//#region node_modules/naive-ui/es/icon/styles/light.mjs
function Yg(e) {
	let { textColorBase: t, opacity1: n, opacity2: r, opacity3: i, opacity4: a, opacity5: o } = e;
	return {
		color: t,
		opacity1Depth: n,
		opacity2Depth: r,
		opacity3Depth: i,
		opacity4Depth: a,
		opacity5Depth: o
	};
}
//#endregion
//#region node_modules/naive-ui/es/icon/styles/dark.mjs
var Xg = {
	name: "Icon",
	common: Q,
	self: Yg
}, Zg = {
	itemFontSize: "12px",
	itemHeight: "36px",
	itemWidth: "52px",
	panelActionPadding: "8px 0"
};
//#endregion
//#region node_modules/naive-ui/es/time-picker/styles/light.mjs
function Qg(e) {
	let { popoverColor: t, textColor2: n, primaryColor: r, hoverColor: i, dividerColor: a, opacityDisabled: o, boxShadow2: s, borderRadius: c, iconColor: l, iconColorDisabled: u } = e;
	return {
		...Zg,
		panelColor: t,
		panelBoxShadow: s,
		panelDividerColor: a,
		itemTextColor: n,
		itemTextColorActive: r,
		itemColorHover: i,
		itemOpacityDisabled: o,
		itemBorderRadius: c,
		borderRadius: c,
		iconColor: l,
		iconColorDisabled: u
	};
}
var $g = {
	name: "TimePicker",
	common: Q,
	peers: {
		Scrollbar: _p,
		Button: ig,
		Input: Ch
	},
	self: Qg
}, e_ = {
	itemSize: "24px",
	itemCellWidth: "38px",
	itemCellHeight: "32px",
	scrollItemWidth: "80px",
	scrollItemHeight: "40px",
	panelExtraFooterPadding: "8px 12px",
	panelActionPadding: "8px 12px",
	calendarTitlePadding: "0",
	calendarTitleHeight: "28px",
	arrowSize: "14px",
	panelHeaderPadding: "8px 12px",
	calendarDaysHeight: "32px",
	calendarTitleGridTempateColumns: "28px 28px 1fr 28px 28px",
	calendarLeftPaddingDate: "6px 12px 4px 12px",
	calendarLeftPaddingDatetime: "4px 12px",
	calendarLeftPaddingDaterange: "6px 12px 4px 12px",
	calendarLeftPaddingDatetimerange: "4px 12px",
	calendarLeftPaddingMonth: "0",
	calendarLeftPaddingYear: "0",
	calendarLeftPaddingQuarter: "0",
	calendarLeftPaddingMonthrange: "0",
	calendarLeftPaddingQuarterrange: "0",
	calendarLeftPaddingYearrange: "0",
	calendarLeftPaddingWeek: "6px 12px 4px 12px",
	calendarRightPaddingDate: "6px 12px 4px 12px",
	calendarRightPaddingDatetime: "4px 12px",
	calendarRightPaddingDaterange: "6px 12px 4px 12px",
	calendarRightPaddingDatetimerange: "4px 12px",
	calendarRightPaddingMonth: "0",
	calendarRightPaddingYear: "0",
	calendarRightPaddingQuarter: "0",
	calendarRightPaddingMonthrange: "0",
	calendarRightPaddingQuarterrange: "0",
	calendarRightPaddingYearrange: "0",
	calendarRightPaddingWeek: "0"
};
//#endregion
//#region node_modules/naive-ui/es/date-picker/styles/light.mjs
function t_(e) {
	let { hoverColor: t, fontSize: n, textColor2: r, textColorDisabled: i, popoverColor: a, primaryColor: o, borderRadiusSmall: s, iconColor: c, iconColorDisabled: l, textColor1: u, dividerColor: d, boxShadow2: f, borderRadius: p, fontWeightStrong: m } = e;
	return {
		...e_,
		itemFontSize: n,
		calendarDaysFontSize: n,
		calendarTitleFontSize: n,
		itemTextColor: r,
		itemTextColorDisabled: i,
		itemTextColorActive: a,
		itemTextColorCurrent: o,
		itemColorIncluded: J(o, { alpha: .1 }),
		itemColorHover: t,
		itemColorDisabled: t,
		itemColorActive: o,
		itemBorderRadius: s,
		panelColor: a,
		panelTextColor: r,
		arrowColor: c,
		calendarTitleTextColor: u,
		calendarTitleColorHover: t,
		calendarDaysTextColor: r,
		panelHeaderDividerColor: d,
		calendarDaysDividerColor: d,
		calendarDividerColor: d,
		panelActionDividerColor: d,
		panelBoxShadow: f,
		panelBorderRadius: p,
		calendarTitleFontWeight: m,
		scrollItemBorderRadius: p,
		iconColor: c,
		iconColorDisabled: l
	};
}
//#endregion
//#region node_modules/naive-ui/es/date-picker/styles/dark.mjs
var n_ = {
	name: "DatePicker",
	common: Q,
	peers: {
		Input: Ch,
		Button: ig,
		TimePicker: $g,
		Scrollbar: _p
	},
	self(e) {
		let { popoverColor: t, hoverColor: n, primaryColor: r } = e, i = t_(e);
		return i.itemColorDisabled = q(t, n), i.itemColorIncluded = J(r, { alpha: .15 }), i.itemColorHover = q(t, n), i;
	}
}, r_ = {
	thPaddingBorderedSmall: "8px 12px",
	thPaddingBorderedMedium: "12px 16px",
	thPaddingBorderedLarge: "16px 24px",
	thPaddingSmall: "0",
	thPaddingMedium: "0",
	thPaddingLarge: "0",
	tdPaddingBorderedSmall: "8px 12px",
	tdPaddingBorderedMedium: "12px 16px",
	tdPaddingBorderedLarge: "16px 24px",
	tdPaddingSmall: "0 0 8px 0",
	tdPaddingMedium: "0 0 12px 0",
	tdPaddingLarge: "0 0 16px 0"
};
//#endregion
//#region node_modules/naive-ui/es/descriptions/styles/light.mjs
function i_(e) {
	let { tableHeaderColor: t, textColor2: n, textColor1: r, cardColor: i, modalColor: a, popoverColor: o, dividerColor: s, borderRadius: c, fontWeightStrong: l, lineHeight: u, fontSizeSmall: d, fontSizeMedium: f, fontSizeLarge: p } = e;
	return {
		...r_,
		lineHeight: u,
		fontSizeSmall: d,
		fontSizeMedium: f,
		fontSizeLarge: p,
		titleTextColor: r,
		thColor: q(i, t),
		thColorModal: q(a, t),
		thColorPopover: q(o, t),
		thTextColor: r,
		thFontWeight: l,
		tdTextColor: n,
		tdColor: i,
		tdColorModal: a,
		tdColorPopover: o,
		borderColor: q(i, s),
		borderColorModal: q(a, s),
		borderColorPopover: q(o, s),
		borderRadius: c
	};
}
//#endregion
//#region node_modules/naive-ui/es/descriptions/styles/dark.mjs
var a_ = {
	name: "Descriptions",
	common: Q,
	self: i_
}, o_ = {
	titleFontSize: "18px",
	padding: "16px 28px 20px 28px",
	iconSize: "28px",
	actionSpace: "12px",
	contentMargin: "8px 0 16px 0",
	iconMargin: "0 4px 0 0",
	iconMarginIconTop: "4px 0 8px 0",
	closeSize: "22px",
	closeIconSize: "18px",
	closeMargin: "20px 26px 0 0",
	closeMarginIconTop: "10px 16px 0 0"
};
//#endregion
//#region node_modules/naive-ui/es/dialog/styles/light.mjs
function s_(e) {
	let { textColor1: t, textColor2: n, modalColor: r, closeIconColor: i, closeIconColorHover: a, closeIconColorPressed: o, closeColorHover: s, closeColorPressed: c, infoColor: l, successColor: u, warningColor: d, errorColor: f, primaryColor: p, dividerColor: m, borderRadius: h, fontWeightStrong: g, lineHeight: _, fontSize: v } = e;
	return {
		...o_,
		fontSize: v,
		lineHeight: _,
		border: `1px solid ${m}`,
		titleTextColor: t,
		textColor: n,
		color: r,
		closeColorHover: s,
		closeColorPressed: c,
		closeIconColor: i,
		closeIconColorHover: a,
		closeIconColorPressed: o,
		closeBorderRadius: h,
		iconColor: p,
		iconColorInfo: l,
		iconColorSuccess: u,
		iconColorWarning: d,
		iconColorError: f,
		borderRadius: h,
		titleFontWeight: g
	};
}
var c_ = {
	name: "Dialog",
	common: Q,
	peers: { Button: ig },
	self: s_
};
//#endregion
//#region node_modules/naive-ui/es/modal/styles/light.mjs
function l_(e) {
	let { modalColor: t, textColor2: n, boxShadow3: r } = e;
	return {
		color: t,
		textColor: n,
		boxShadow: r
	};
}
//#endregion
//#region node_modules/naive-ui/es/modal/styles/dark.mjs
var u_ = {
	name: "Modal",
	common: Q,
	peers: {
		Scrollbar: _p,
		Dialog: c_,
		Card: hg
	},
	self: l_
}, d_ = {
	name: "LoadingBar",
	common: Q,
	self(e) {
		let { primaryColor: t } = e;
		return {
			colorError: "red",
			colorLoading: t,
			height: "2px"
		};
	}
}, f_ = {
	margin: "0 0 8px 0",
	padding: "10px 20px",
	maxWidth: "720px",
	minWidth: "420px",
	iconMargin: "0 10px 0 0",
	closeMargin: "0 0 0 10px",
	closeSize: "20px",
	closeIconSize: "16px",
	iconSize: "20px",
	fontSize: "14px"
};
//#endregion
//#region node_modules/naive-ui/es/message/styles/light.mjs
function p_(e) {
	let { textColor2: t, closeIconColor: n, closeIconColorHover: r, closeIconColorPressed: i, infoColor: a, successColor: o, errorColor: s, warningColor: c, popoverColor: l, boxShadow2: u, primaryColor: d, lineHeight: f, borderRadius: p, closeColorHover: m, closeColorPressed: h } = e;
	return {
		...f_,
		closeBorderRadius: p,
		textColor: t,
		textColorInfo: t,
		textColorSuccess: t,
		textColorError: t,
		textColorWarning: t,
		textColorLoading: t,
		color: l,
		colorInfo: l,
		colorSuccess: l,
		colorError: l,
		colorWarning: l,
		colorLoading: l,
		boxShadow: u,
		boxShadowInfo: u,
		boxShadowSuccess: u,
		boxShadowError: u,
		boxShadowWarning: u,
		boxShadowLoading: u,
		iconColor: t,
		iconColorInfo: a,
		iconColorSuccess: o,
		iconColorWarning: c,
		iconColorError: s,
		iconColorLoading: d,
		closeColorHover: m,
		closeColorPressed: h,
		closeIconColor: n,
		closeIconColorHover: r,
		closeIconColorPressed: i,
		closeColorHoverInfo: m,
		closeColorPressedInfo: h,
		closeIconColorInfo: n,
		closeIconColorHoverInfo: r,
		closeIconColorPressedInfo: i,
		closeColorHoverSuccess: m,
		closeColorPressedSuccess: h,
		closeIconColorSuccess: n,
		closeIconColorHoverSuccess: r,
		closeIconColorPressedSuccess: i,
		closeColorHoverError: m,
		closeColorPressedError: h,
		closeIconColorError: n,
		closeIconColorHoverError: r,
		closeIconColorPressedError: i,
		closeColorHoverWarning: m,
		closeColorPressedWarning: h,
		closeIconColorWarning: n,
		closeIconColorHoverWarning: r,
		closeIconColorPressedWarning: i,
		closeColorHoverLoading: m,
		closeColorPressedLoading: h,
		closeIconColorLoading: n,
		closeIconColorHoverLoading: r,
		closeIconColorPressedLoading: i,
		loadingColor: d,
		lineHeight: f,
		borderRadius: p,
		border: "0"
	};
}
//#endregion
//#region node_modules/naive-ui/es/message/styles/dark.mjs
var m_ = {
	name: "Message",
	common: Q,
	self: p_
}, h_ = {
	closeMargin: "16px 12px",
	closeSize: "20px",
	closeIconSize: "16px",
	width: "365px",
	padding: "16px",
	titleFontSize: "16px",
	metaFontSize: "12px",
	descriptionFontSize: "12px"
};
//#endregion
//#region node_modules/naive-ui/es/notification/styles/light.mjs
function g_(e) {
	let { textColor2: t, successColor: n, infoColor: r, warningColor: i, errorColor: a, popoverColor: o, closeIconColor: s, closeIconColorHover: c, closeIconColorPressed: l, closeColorHover: u, closeColorPressed: d, textColor1: f, textColor3: p, borderRadius: m, fontWeightStrong: h, boxShadow2: g, lineHeight: _, fontSize: v } = e;
	return {
		...h_,
		borderRadius: m,
		lineHeight: _,
		fontSize: v,
		headerFontWeight: h,
		iconColor: t,
		iconColorSuccess: n,
		iconColorInfo: r,
		iconColorWarning: i,
		iconColorError: a,
		color: o,
		textColor: t,
		closeIconColor: s,
		closeIconColorHover: c,
		closeIconColorPressed: l,
		closeBorderRadius: m,
		closeColorHover: u,
		closeColorPressed: d,
		headerTextColor: f,
		descriptionTextColor: p,
		actionTextColor: t,
		boxShadow: g
	};
}
//#endregion
//#region node_modules/naive-ui/es/notification/styles/dark.mjs
var __ = {
	name: "Notification",
	common: Q,
	peers: { Scrollbar: _p },
	self: g_
};
//#endregion
//#region node_modules/naive-ui/es/divider/styles/light.mjs
function v_(e) {
	let { textColor1: t, dividerColor: n, fontWeightStrong: r } = e;
	return {
		textColor: t,
		color: n,
		fontWeight: r
	};
}
//#endregion
//#region node_modules/naive-ui/es/divider/styles/dark.mjs
var y_ = {
	name: "Divider",
	common: Q,
	self: v_
};
//#endregion
//#region node_modules/naive-ui/es/drawer/styles/light.mjs
function b_(e) {
	let { modalColor: t, textColor1: n, textColor2: r, boxShadow3: i, lineHeight: a, fontWeightStrong: o, dividerColor: s, closeColorHover: c, closeColorPressed: l, closeIconColor: u, closeIconColorHover: d, closeIconColorPressed: f, borderRadius: p, primaryColorHover: m } = e;
	return {
		bodyPadding: "16px 24px",
		borderRadius: p,
		headerPadding: "16px 24px",
		footerPadding: "16px 24px",
		color: t,
		textColor: r,
		titleTextColor: n,
		titleFontSize: "18px",
		titleFontWeight: o,
		boxShadow: i,
		lineHeight: a,
		headerBorderBottom: `1px solid ${s}`,
		footerBorderTop: `1px solid ${s}`,
		closeIconColor: u,
		closeIconColorHover: d,
		closeIconColorPressed: f,
		closeSize: "22px",
		closeIconSize: "18px",
		closeColorHover: c,
		closeColorPressed: l,
		closeBorderRadius: p,
		resizableTriggerColorHover: m
	};
}
//#endregion
//#region node_modules/naive-ui/es/drawer/styles/dark.mjs
var x_ = {
	name: "Drawer",
	common: Q,
	peers: { Scrollbar: _p },
	self: b_
}, S_ = {
	actionMargin: "0 0 0 20px",
	actionMarginRtl: "0 20px 0 0"
}, C_ = {
	name: "DynamicInput",
	common: Q,
	peers: {
		Input: Ch,
		Button: ig
	},
	self() {
		return S_;
	}
}, w_ = {
	gapSmall: "4px 8px",
	gapMedium: "8px 12px",
	gapLarge: "12px 16px"
}, T_ = {
	name: "Space",
	self() {
		return w_;
	}
}, E_ = {
	name: "DynamicTags",
	common: Q,
	peers: {
		Input: Ch,
		Button: ig,
		Tag: sh,
		Space: T_
	},
	self() {
		return { inputWidth: "64px" };
	}
}, D_ = {
	name: "Element",
	common: Q
}, O_ = {
	gapSmall: "4px 8px",
	gapMedium: "8px 12px",
	gapLarge: "12px 16px"
}, k_ = {
	name: "Flex",
	self() {
		return O_;
	}
}, A_ = {
	name: "ButtonGroup",
	common: Q
}, j_ = {
	feedbackPadding: "4px 0 0 2px",
	feedbackHeightSmall: "24px",
	feedbackHeightMedium: "24px",
	feedbackHeightLarge: "26px",
	feedbackFontSizeSmall: "13px",
	feedbackFontSizeMedium: "14px",
	feedbackFontSizeLarge: "14px",
	labelFontSizeLeftSmall: "14px",
	labelFontSizeLeftMedium: "14px",
	labelFontSizeLeftLarge: "15px",
	labelFontSizeTopSmall: "13px",
	labelFontSizeTopMedium: "14px",
	labelFontSizeTopLarge: "14px",
	labelHeightSmall: "24px",
	labelHeightMedium: "26px",
	labelHeightLarge: "28px",
	labelPaddingVertical: "0 0 6px 2px",
	labelPaddingHorizontal: "0 12px 0 0",
	labelTextAlignVertical: "left",
	labelTextAlignHorizontal: "right",
	labelFontWeight: "400"
};
//#endregion
//#region node_modules/naive-ui/es/form/styles/light.mjs
function M_(e) {
	let { heightSmall: t, heightMedium: n, heightLarge: r, textColor1: i, errorColor: a, warningColor: o, lineHeight: s, textColor3: c } = e;
	return {
		...j_,
		blankHeightSmall: t,
		blankHeightMedium: n,
		blankHeightLarge: r,
		lineHeight: s,
		labelTextColor: i,
		asteriskColor: a,
		feedbackTextColorError: a,
		feedbackTextColorWarning: o,
		feedbackTextColor: c
	};
}
//#endregion
//#region node_modules/naive-ui/es/form/styles/dark.mjs
var N_ = {
	name: "Form",
	common: Q,
	self: M_
}, P_ = {
	name: "GradientText",
	common: Q,
	self(e) {
		let { primaryColor: t, successColor: n, warningColor: r, errorColor: i, infoColor: a, primaryColorSuppl: o, successColorSuppl: s, warningColorSuppl: c, errorColorSuppl: l, infoColorSuppl: u, fontWeightStrong: d } = e;
		return {
			fontWeight: d,
			rotate: "252deg",
			colorStartPrimary: t,
			colorEndPrimary: o,
			colorStartInfo: a,
			colorEndInfo: u,
			colorStartWarning: r,
			colorEndWarning: c,
			colorStartError: i,
			colorEndError: l,
			colorStartSuccess: n,
			colorEndSuccess: s
		};
	}
}, F_ = {
	name: "InputNumber",
	common: Q,
	peers: {
		Button: ig,
		Input: Ch
	},
	self(e) {
		let { textColorDisabled: t } = e;
		return { iconColorDisabled: t };
	}
};
//#endregion
//#region node_modules/naive-ui/es/input-otp/styles/light.mjs
function I_() {
	return {
		inputWidthSmall: "24px",
		inputWidthMedium: "30px",
		inputWidthLarge: "36px",
		gapSmall: "8px",
		gapMedium: "8px",
		gapLarge: "8px"
	};
}
//#endregion
//#region node_modules/naive-ui/es/input-otp/styles/dark.mjs
var L_ = {
	name: "InputOtp",
	common: Q,
	peers: { Input: Ch },
	self: I_
}, R_ = {
	name: "Layout",
	common: Q,
	peers: { Scrollbar: _p },
	self(e) {
		let { textColor2: t, bodyColor: n, popoverColor: r, cardColor: i, dividerColor: a, scrollbarColor: o, scrollbarColorHover: s } = e;
		return {
			textColor: t,
			textColorInverted: t,
			color: n,
			colorEmbedded: n,
			headerColor: i,
			headerColorInverted: i,
			footerColor: i,
			footerColorInverted: i,
			headerBorderColor: a,
			headerBorderColorInverted: a,
			footerBorderColor: a,
			footerBorderColorInverted: a,
			siderBorderColor: a,
			siderBorderColorInverted: a,
			siderColor: i,
			siderColorInverted: i,
			siderToggleButtonBorder: "1px solid transparent",
			siderToggleButtonColor: r,
			siderToggleButtonIconColor: t,
			siderToggleButtonIconColorInverted: t,
			siderToggleBarColor: q(n, o),
			siderToggleBarColorHover: q(n, s),
			__invertScrollbar: "false"
		};
	}
};
//#endregion
//#region node_modules/naive-ui/es/list/styles/light.mjs
function z_(e) {
	let { textColor2: t, cardColor: n, modalColor: r, popoverColor: i, dividerColor: a, borderRadius: o, fontSize: s, hoverColor: c } = e;
	return {
		textColor: t,
		color: n,
		colorHover: c,
		colorModal: r,
		colorHoverModal: q(r, c),
		colorPopover: i,
		colorHoverPopover: q(i, c),
		borderColor: a,
		borderColorModal: q(r, a),
		borderColorPopover: q(i, a),
		borderRadius: o,
		fontSize: s
	};
}
//#endregion
//#region node_modules/naive-ui/es/list/styles/dark.mjs
var B_ = {
	name: "List",
	common: Q,
	self: z_
}, V_ = {
	name: "Log",
	common: Q,
	peers: {
		Scrollbar: _p,
		Code: Eg
	},
	self(e) {
		let { textColor2: t, inputColor: n, fontSize: r, primaryColor: i } = e;
		return {
			loaderFontSize: r,
			loaderTextColor: t,
			loaderColor: n,
			loaderBorder: "1px solid #0000",
			loadingColor: i
		};
	}
}, H_ = {
	name: "Mention",
	common: Q,
	peers: {
		InternalSelectMenu: Ap,
		Input: Ch
	},
	self(e) {
		let { boxShadow2: t } = e;
		return { menuBoxShadow: t };
	}
};
//#endregion
//#region node_modules/naive-ui/es/menu/styles/light.mjs
function U_(e, t, n, r) {
	return {
		itemColorHoverInverted: "#0000",
		itemColorActiveInverted: t,
		itemColorActiveHoverInverted: t,
		itemColorActiveCollapsedInverted: t,
		itemTextColorInverted: e,
		itemTextColorHoverInverted: n,
		itemTextColorChildActiveInverted: n,
		itemTextColorChildActiveHoverInverted: n,
		itemTextColorActiveInverted: n,
		itemTextColorActiveHoverInverted: n,
		itemTextColorHorizontalInverted: e,
		itemTextColorHoverHorizontalInverted: n,
		itemTextColorChildActiveHorizontalInverted: n,
		itemTextColorChildActiveHoverHorizontalInverted: n,
		itemTextColorActiveHorizontalInverted: n,
		itemTextColorActiveHoverHorizontalInverted: n,
		itemIconColorInverted: e,
		itemIconColorHoverInverted: n,
		itemIconColorActiveInverted: n,
		itemIconColorActiveHoverInverted: n,
		itemIconColorChildActiveInverted: n,
		itemIconColorChildActiveHoverInverted: n,
		itemIconColorCollapsedInverted: e,
		itemIconColorHorizontalInverted: e,
		itemIconColorHoverHorizontalInverted: n,
		itemIconColorActiveHorizontalInverted: n,
		itemIconColorActiveHoverHorizontalInverted: n,
		itemIconColorChildActiveHorizontalInverted: n,
		itemIconColorChildActiveHoverHorizontalInverted: n,
		arrowColorInverted: e,
		arrowColorHoverInverted: n,
		arrowColorActiveInverted: n,
		arrowColorActiveHoverInverted: n,
		arrowColorChildActiveInverted: n,
		arrowColorChildActiveHoverInverted: n,
		groupTextColorInverted: r
	};
}
function W_(e) {
	let { borderRadius: t, textColor3: n, primaryColor: r, textColor2: i, textColor1: a, fontSize: o, dividerColor: s, hoverColor: c, primaryColorHover: l } = e;
	return {
		borderRadius: t,
		color: "#0000",
		groupTextColor: n,
		itemColorHover: c,
		itemColorActive: J(r, { alpha: .1 }),
		itemColorActiveHover: J(r, { alpha: .1 }),
		itemColorActiveCollapsed: J(r, { alpha: .1 }),
		itemTextColor: i,
		itemTextColorHover: i,
		itemTextColorActive: r,
		itemTextColorActiveHover: r,
		itemTextColorChildActive: r,
		itemTextColorChildActiveHover: r,
		itemTextColorHorizontal: i,
		itemTextColorHoverHorizontal: l,
		itemTextColorActiveHorizontal: r,
		itemTextColorActiveHoverHorizontal: r,
		itemTextColorChildActiveHorizontal: r,
		itemTextColorChildActiveHoverHorizontal: r,
		itemIconColor: a,
		itemIconColorHover: a,
		itemIconColorActive: r,
		itemIconColorActiveHover: r,
		itemIconColorChildActive: r,
		itemIconColorChildActiveHover: r,
		itemIconColorCollapsed: a,
		itemIconColorHorizontal: a,
		itemIconColorHoverHorizontal: l,
		itemIconColorActiveHorizontal: r,
		itemIconColorActiveHoverHorizontal: r,
		itemIconColorChildActiveHorizontal: r,
		itemIconColorChildActiveHoverHorizontal: r,
		itemHeight: "42px",
		arrowColor: i,
		arrowColorHover: i,
		arrowColorActive: r,
		arrowColorActiveHover: r,
		arrowColorChildActive: r,
		arrowColorChildActiveHover: r,
		colorInverted: "#0000",
		borderColorHorizontal: "#0000",
		fontSize: o,
		dividerColor: s,
		...U_("#BBB", r, "#FFF", "#AAA")
	};
}
//#endregion
//#region node_modules/naive-ui/es/menu/styles/dark.mjs
var G_ = {
	name: "Menu",
	common: Q,
	peers: {
		Tooltip: Hg,
		Dropdown: Bg
	},
	self(e) {
		let { primaryColor: t, primaryColorSuppl: n } = e, r = W_(e);
		return r.itemColorActive = J(t, { alpha: .15 }), r.itemColorActiveHover = J(t, { alpha: .15 }), r.itemColorActiveCollapsed = J(t, { alpha: .15 }), r.itemColorActiveInverted = n, r.itemColorActiveHoverInverted = n, r.itemColorActiveCollapsedInverted = n, r;
	}
}, K_ = { iconSize: "22px" };
//#endregion
//#region node_modules/naive-ui/es/popconfirm/styles/light.mjs
function q_(e) {
	let { fontSize: t, warningColor: n } = e;
	return {
		...K_,
		fontSize: t,
		iconColor: n
	};
}
//#endregion
//#region node_modules/naive-ui/es/popconfirm/styles/dark.mjs
var J_ = {
	name: "Popconfirm",
	common: Q,
	peers: {
		Button: ig,
		Popover: Np
	},
	self: q_
};
//#endregion
//#region node_modules/naive-ui/es/progress/styles/light.mjs
function Y_(e) {
	let { infoColor: t, successColor: n, warningColor: r, errorColor: i, textColor2: a, progressRailColor: o, fontSize: s, fontWeight: c } = e;
	return {
		fontSize: s,
		fontSizeCircle: "28px",
		fontWeightCircle: c,
		railColor: o,
		railHeight: "8px",
		iconSizeCircle: "36px",
		iconSizeLine: "18px",
		iconColor: t,
		iconColorInfo: t,
		iconColorSuccess: n,
		iconColorWarning: r,
		iconColorError: i,
		textColorCircle: a,
		textColorLineInner: "rgb(255, 255, 255)",
		textColorLineOuter: a,
		fillColor: t,
		fillColorInfo: t,
		fillColorSuccess: n,
		fillColorWarning: r,
		fillColorError: i,
		lineBgProcessing: "linear-gradient(90deg, rgba(255, 255, 255, .3) 0%, rgba(255, 255, 255, .5) 100%)"
	};
}
var X_ = {
	name: "Progress",
	common: Q,
	self(e) {
		let t = Y_(e);
		return t.textColorLineInner = "rgb(0, 0, 0)", t.lineBgProcessing = "linear-gradient(90deg, rgba(255, 255, 255, .3) 0%, rgba(255, 255, 255, .5) 100%)", t;
	}
}, Z_ = {
	name: "Rate",
	common: Q,
	self(e) {
		let { railColor: t } = e;
		return {
			itemColor: t,
			itemColorActive: "#CCAA33",
			itemSize: "20px",
			sizeSmall: "16px",
			sizeMedium: "20px",
			sizeLarge: "24px"
		};
	}
}, Q_ = {
	titleFontSizeSmall: "26px",
	titleFontSizeMedium: "32px",
	titleFontSizeLarge: "40px",
	titleFontSizeHuge: "48px",
	fontSizeSmall: "14px",
	fontSizeMedium: "14px",
	fontSizeLarge: "15px",
	fontSizeHuge: "16px",
	iconSizeSmall: "64px",
	iconSizeMedium: "80px",
	iconSizeLarge: "100px",
	iconSizeHuge: "125px",
	iconColor418: void 0,
	iconColor404: void 0,
	iconColor403: void 0,
	iconColor500: void 0
};
//#endregion
//#region node_modules/naive-ui/es/result/styles/light.mjs
function $_(e) {
	let { textColor2: t, textColor1: n, errorColor: r, successColor: i, infoColor: a, warningColor: o, lineHeight: s, fontWeightStrong: c } = e;
	return {
		...Q_,
		lineHeight: s,
		titleFontWeight: c,
		titleTextColor: n,
		textColor: t,
		iconColorError: r,
		iconColorSuccess: i,
		iconColorInfo: a,
		iconColorWarning: o
	};
}
//#endregion
//#region node_modules/naive-ui/es/result/styles/dark.mjs
var ev = {
	name: "Result",
	common: Q,
	self: $_
}, tv = {
	railHeight: "4px",
	railWidthVertical: "4px",
	handleSize: "18px",
	dotHeight: "8px",
	dotWidth: "8px",
	dotBorderRadius: "4px"
}, nv = {
	name: "Slider",
	common: Q,
	self(e) {
		let { railColor: t, modalColor: n, primaryColorSuppl: r, popoverColor: i, textColor2: a, cardColor: o, borderRadius: s, fontSize: c, opacityDisabled: l } = e;
		return {
			...tv,
			fontSize: c,
			markFontSize: c,
			railColor: t,
			railColorHover: t,
			fillColor: r,
			fillColorHover: r,
			opacityDisabled: l,
			handleColor: "#FFF",
			dotColor: o,
			dotColorModal: n,
			dotColorPopover: i,
			handleBoxShadow: "0px 2px 4px 0 rgba(0, 0, 0, 0.4)",
			handleBoxShadowHover: "0px 2px 4px 0 rgba(0, 0, 0, 0.4)",
			handleBoxShadowActive: "0px 2px 4px 0 rgba(0, 0, 0, 0.4)",
			handleBoxShadowFocus: "0px 2px 4px 0 rgba(0, 0, 0, 0.4)",
			indicatorColor: i,
			indicatorBoxShadow: "0 2px 8px 0 rgba(0, 0, 0, 0.12)",
			indicatorTextColor: a,
			indicatorBorderRadius: s,
			dotBorder: `2px solid ${t}`,
			dotBorderActive: `2px solid ${r}`,
			dotBoxShadow: ""
		};
	}
};
//#endregion
//#region node_modules/naive-ui/es/spin/styles/light.mjs
function rv(e) {
	let { opacityDisabled: t, heightTiny: n, heightSmall: r, heightMedium: i, heightLarge: a, heightHuge: o, primaryColor: s, fontSize: c } = e;
	return {
		fontSize: c,
		textColor: s,
		sizeTiny: n,
		sizeSmall: r,
		sizeMedium: i,
		sizeLarge: a,
		sizeHuge: o,
		color: s,
		opacitySpinning: t
	};
}
//#endregion
//#region node_modules/naive-ui/es/spin/styles/dark.mjs
var iv = {
	name: "Spin",
	common: Q,
	self: rv
};
//#endregion
//#region node_modules/naive-ui/es/statistic/styles/light.mjs
function av(e) {
	let { textColor2: t, textColor3: n, fontSize: r, fontWeight: i } = e;
	return {
		labelFontSize: r,
		labelFontWeight: i,
		valueFontWeight: i,
		valueFontSize: "24px",
		labelTextColor: n,
		valuePrefixTextColor: t,
		valueSuffixTextColor: t,
		valueTextColor: t
	};
}
//#endregion
//#region node_modules/naive-ui/es/statistic/styles/dark.mjs
var ov = {
	name: "Statistic",
	common: Q,
	self: av
}, sv = {
	stepHeaderFontSizeSmall: "14px",
	stepHeaderFontSizeMedium: "16px",
	indicatorIndexFontSizeSmall: "14px",
	indicatorIndexFontSizeMedium: "16px",
	indicatorSizeSmall: "22px",
	indicatorSizeMedium: "28px",
	indicatorIconSizeSmall: "14px",
	indicatorIconSizeMedium: "18px"
};
//#endregion
//#region node_modules/naive-ui/es/steps/styles/light.mjs
function cv(e) {
	let { fontWeightStrong: t, baseColor: n, textColorDisabled: r, primaryColor: i, errorColor: a, textColor1: o, textColor2: s } = e;
	return {
		...sv,
		stepHeaderFontWeight: t,
		indicatorTextColorProcess: n,
		indicatorTextColorWait: r,
		indicatorTextColorFinish: i,
		indicatorTextColorError: a,
		indicatorBorderColorProcess: i,
		indicatorBorderColorWait: r,
		indicatorBorderColorFinish: i,
		indicatorBorderColorError: a,
		indicatorColorProcess: i,
		indicatorColorWait: "#0000",
		indicatorColorFinish: "#0000",
		indicatorColorError: "#0000",
		splitorColorProcess: r,
		splitorColorWait: r,
		splitorColorFinish: i,
		splitorColorError: r,
		headerTextColorProcess: o,
		headerTextColorWait: r,
		headerTextColorFinish: r,
		headerTextColorError: a,
		descriptionTextColorProcess: s,
		descriptionTextColorWait: r,
		descriptionTextColorFinish: r,
		descriptionTextColorError: a
	};
}
//#endregion
//#region node_modules/naive-ui/es/steps/styles/dark.mjs
var lv = {
	name: "Steps",
	common: Q,
	self: cv
}, uv = {
	buttonHeightSmall: "14px",
	buttonHeightMedium: "18px",
	buttonHeightLarge: "22px",
	buttonWidthSmall: "14px",
	buttonWidthMedium: "18px",
	buttonWidthLarge: "22px",
	buttonWidthPressedSmall: "20px",
	buttonWidthPressedMedium: "24px",
	buttonWidthPressedLarge: "28px",
	railHeightSmall: "18px",
	railHeightMedium: "22px",
	railHeightLarge: "26px",
	railWidthSmall: "32px",
	railWidthMedium: "40px",
	railWidthLarge: "48px"
}, dv = {
	name: "Switch",
	common: Q,
	self(e) {
		let { primaryColorSuppl: t, opacityDisabled: n, borderRadius: r, primaryColor: i, textColor2: a, baseColor: o } = e;
		return {
			...uv,
			iconColor: o,
			textColor: a,
			loadingColor: t,
			opacityDisabled: n,
			railColor: "rgba(255, 255, 255, .20)",
			railColorActive: t,
			buttonBoxShadow: "0px 2px 4px 0 rgba(0, 0, 0, 0.4)",
			buttonColor: "#FFF",
			railBorderRadiusSmall: r,
			railBorderRadiusMedium: r,
			railBorderRadiusLarge: r,
			buttonBorderRadiusSmall: r,
			buttonBorderRadiusMedium: r,
			buttonBorderRadiusLarge: r,
			boxShadowFocus: `0 0 8px 0 ${J(i, { alpha: .3 })}`
		};
	}
}, fv = {
	thPaddingSmall: "6px",
	thPaddingMedium: "12px",
	thPaddingLarge: "12px",
	tdPaddingSmall: "6px",
	tdPaddingMedium: "12px",
	tdPaddingLarge: "12px"
};
//#endregion
//#region node_modules/naive-ui/es/table/styles/light.mjs
function pv(e) {
	let { dividerColor: t, cardColor: n, modalColor: r, popoverColor: i, tableHeaderColor: a, tableColorStriped: o, textColor1: s, textColor2: c, borderRadius: l, fontWeightStrong: u, lineHeight: d, fontSizeSmall: f, fontSizeMedium: p, fontSizeLarge: m } = e;
	return {
		...fv,
		fontSizeSmall: f,
		fontSizeMedium: p,
		fontSizeLarge: m,
		lineHeight: d,
		borderRadius: l,
		borderColor: q(n, t),
		borderColorModal: q(r, t),
		borderColorPopover: q(i, t),
		tdColor: n,
		tdColorModal: r,
		tdColorPopover: i,
		tdColorStriped: q(n, o),
		tdColorStripedModal: q(r, o),
		tdColorStripedPopover: q(i, o),
		thColor: q(n, a),
		thColorModal: q(r, a),
		thColorPopover: q(i, a),
		thTextColor: s,
		tdTextColor: c,
		thFontWeight: u
	};
}
//#endregion
//#region node_modules/naive-ui/es/table/styles/dark.mjs
var mv = {
	name: "Table",
	common: Q,
	self: pv
}, hv = {
	tabFontSizeSmall: "14px",
	tabFontSizeMedium: "14px",
	tabFontSizeLarge: "16px",
	tabGapSmallLine: "36px",
	tabGapMediumLine: "36px",
	tabGapLargeLine: "36px",
	tabGapSmallLineVertical: "8px",
	tabGapMediumLineVertical: "8px",
	tabGapLargeLineVertical: "8px",
	tabPaddingSmallLine: "6px 0",
	tabPaddingMediumLine: "10px 0",
	tabPaddingLargeLine: "14px 0",
	tabPaddingVerticalSmallLine: "6px 12px",
	tabPaddingVerticalMediumLine: "8px 16px",
	tabPaddingVerticalLargeLine: "10px 20px",
	tabGapSmallBar: "36px",
	tabGapMediumBar: "36px",
	tabGapLargeBar: "36px",
	tabGapSmallBarVertical: "8px",
	tabGapMediumBarVertical: "8px",
	tabGapLargeBarVertical: "8px",
	tabPaddingSmallBar: "4px 0",
	tabPaddingMediumBar: "6px 0",
	tabPaddingLargeBar: "10px 0",
	tabPaddingVerticalSmallBar: "6px 12px",
	tabPaddingVerticalMediumBar: "8px 16px",
	tabPaddingVerticalLargeBar: "10px 20px",
	tabGapSmallCard: "4px",
	tabGapMediumCard: "4px",
	tabGapLargeCard: "4px",
	tabGapSmallCardVertical: "4px",
	tabGapMediumCardVertical: "4px",
	tabGapLargeCardVertical: "4px",
	tabPaddingSmallCard: "8px 16px",
	tabPaddingMediumCard: "10px 20px",
	tabPaddingLargeCard: "12px 24px",
	tabPaddingSmallSegment: "4px 0",
	tabPaddingMediumSegment: "6px 0",
	tabPaddingLargeSegment: "8px 0",
	tabPaddingVerticalLargeSegment: "0 8px",
	tabPaddingVerticalSmallCard: "8px 12px",
	tabPaddingVerticalMediumCard: "10px 16px",
	tabPaddingVerticalLargeCard: "12px 20px",
	tabPaddingVerticalSmallSegment: "0 4px",
	tabPaddingVerticalMediumSegment: "0 6px",
	tabGapSmallSegment: "0",
	tabGapMediumSegment: "0",
	tabGapLargeSegment: "0",
	tabGapSmallSegmentVertical: "0",
	tabGapMediumSegmentVertical: "0",
	tabGapLargeSegmentVertical: "0",
	panePaddingSmall: "8px 0 0 0",
	panePaddingMedium: "12px 0 0 0",
	panePaddingLarge: "16px 0 0 0",
	closeSize: "18px",
	closeIconSize: "14px"
};
//#endregion
//#region node_modules/naive-ui/es/tabs/styles/light.mjs
function gv(e) {
	let { textColor2: t, primaryColor: n, textColorDisabled: r, closeIconColor: i, closeIconColorHover: a, closeIconColorPressed: o, closeColorHover: s, closeColorPressed: c, tabColor: l, baseColor: u, dividerColor: d, fontWeight: f, textColor1: p, borderRadius: m, fontSize: h, fontWeightStrong: g } = e;
	return {
		...hv,
		colorSegment: l,
		tabFontSizeCard: h,
		tabTextColorLine: p,
		tabTextColorActiveLine: n,
		tabTextColorHoverLine: n,
		tabTextColorDisabledLine: r,
		tabTextColorSegment: p,
		tabTextColorActiveSegment: t,
		tabTextColorHoverSegment: t,
		tabTextColorDisabledSegment: r,
		tabTextColorBar: p,
		tabTextColorActiveBar: n,
		tabTextColorHoverBar: n,
		tabTextColorDisabledBar: r,
		tabTextColorCard: p,
		tabTextColorHoverCard: p,
		tabTextColorActiveCard: n,
		tabTextColorDisabledCard: r,
		barColor: n,
		closeIconColor: i,
		closeIconColorHover: a,
		closeIconColorPressed: o,
		closeColorHover: s,
		closeColorPressed: c,
		closeBorderRadius: m,
		tabColor: l,
		tabColorSegment: u,
		tabBorderColor: d,
		tabFontWeightActive: f,
		tabFontWeight: f,
		tabBorderRadius: m,
		paneTextColor: t,
		fontWeightStrong: g
	};
}
//#endregion
//#region node_modules/naive-ui/es/tabs/styles/dark.mjs
var _v = {
	name: "Tabs",
	common: Q,
	peers: { Button: ig },
	self(e) {
		let t = gv(e), { inputColor: n } = e;
		return t.colorSegment = n, t.tabColorSegment = n, t;
	}
};
//#endregion
//#region node_modules/naive-ui/es/thing/styles/light.mjs
function vv(e) {
	let { textColor1: t, textColor2: n, fontWeightStrong: r, fontSize: i } = e;
	return {
		fontSize: i,
		titleTextColor: t,
		textColor: n,
		titleFontWeight: r
	};
}
//#endregion
//#region node_modules/naive-ui/es/thing/styles/dark.mjs
var yv = {
	name: "Thing",
	common: Q,
	self: vv
}, bv = {
	titleMarginMedium: "0 0 6px 0",
	titleMarginLarge: "-2px 0 6px 0",
	titleFontSizeMedium: "14px",
	titleFontSizeLarge: "16px",
	iconSizeMedium: "14px",
	iconSizeLarge: "14px"
}, xv = {
	name: "Timeline",
	common: Q,
	self(e) {
		let { textColor3: t, infoColorSuppl: n, errorColorSuppl: r, successColorSuppl: i, warningColorSuppl: a, textColor1: o, textColor2: s, railColor: c, fontWeightStrong: l, fontSize: u } = e;
		return {
			...bv,
			contentFontSize: u,
			titleFontWeight: l,
			circleBorder: `2px solid ${t}`,
			circleBorderInfo: `2px solid ${n}`,
			circleBorderError: `2px solid ${r}`,
			circleBorderSuccess: `2px solid ${i}`,
			circleBorderWarning: `2px solid ${a}`,
			iconColor: t,
			iconColorInfo: n,
			iconColorError: r,
			iconColorSuccess: i,
			iconColorWarning: a,
			titleTextColor: o,
			contentTextColor: s,
			metaTextColor: t,
			lineColor: c
		};
	}
}, Sv = {
	extraFontSizeSmall: "12px",
	extraFontSizeMedium: "12px",
	extraFontSizeLarge: "14px",
	titleFontSizeSmall: "14px",
	titleFontSizeMedium: "16px",
	titleFontSizeLarge: "16px",
	closeSize: "20px",
	closeIconSize: "16px",
	headerHeightSmall: "44px",
	headerHeightMedium: "44px",
	headerHeightLarge: "50px"
}, Cv = {
	name: "Transfer",
	common: Q,
	peers: {
		Checkbox: Cg,
		Scrollbar: _p,
		Input: Ch,
		Empty: xp,
		Button: ig
	},
	self(e) {
		let { fontWeight: t, fontSizeLarge: n, fontSizeMedium: r, fontSizeSmall: i, heightLarge: a, heightMedium: o, borderRadius: s, inputColor: c, tableHeaderColor: l, textColor1: u, textColorDisabled: d, textColor2: f, textColor3: p, hoverColor: m, closeColorHover: h, closeColorPressed: g, closeIconColor: _, closeIconColorHover: v, closeIconColorPressed: y, dividerColor: b } = e;
		return {
			...Sv,
			itemHeightSmall: o,
			itemHeightMedium: o,
			itemHeightLarge: a,
			fontSizeSmall: i,
			fontSizeMedium: r,
			fontSizeLarge: n,
			borderRadius: s,
			dividerColor: b,
			borderColor: "#0000",
			listColor: c,
			headerColor: l,
			titleTextColor: u,
			titleTextColorDisabled: d,
			extraTextColor: p,
			extraTextColorDisabled: d,
			itemTextColor: f,
			itemTextColorDisabled: d,
			itemColorPending: m,
			titleFontWeight: t,
			closeColorHover: h,
			closeColorPressed: g,
			closeIconColor: _,
			closeIconColorHover: v,
			closeIconColorPressed: y
		};
	}
};
//#endregion
//#region node_modules/naive-ui/es/tree/styles/light.mjs
function wv(e) {
	let { borderRadiusSmall: t, dividerColor: n, hoverColor: r, pressedColor: i, primaryColor: a, textColor3: o, textColor2: s, textColorDisabled: c, fontSize: l } = e;
	return {
		fontSize: l,
		lineHeight: "1.5",
		nodeHeight: "30px",
		nodeWrapperPadding: "3px 0",
		nodeBorderRadius: t,
		nodeColorHover: r,
		nodeColorPressed: i,
		nodeColorActive: J(a, { alpha: .1 }),
		arrowColor: o,
		nodeTextColor: s,
		nodeTextColorDisabled: c,
		loadingColor: a,
		dropMarkColor: a,
		lineColor: n
	};
}
//#endregion
//#region node_modules/naive-ui/es/tree/styles/dark.mjs
var Tv = {
	name: "Tree",
	common: Q,
	peers: {
		Checkbox: Cg,
		Scrollbar: _p,
		Empty: xp
	},
	self(e) {
		let { primaryColor: t } = e, n = wv(e);
		return n.nodeColorActive = J(t, { alpha: .15 }), n;
	}
}, Ev = {
	name: "TreeSelect",
	common: Q,
	peers: {
		Tree: Tv,
		Empty: xp,
		InternalSelection: mh
	}
}, Dv = {
	headerFontSize1: "30px",
	headerFontSize2: "22px",
	headerFontSize3: "18px",
	headerFontSize4: "16px",
	headerFontSize5: "16px",
	headerFontSize6: "16px",
	headerMargin1: "28px 0 20px 0",
	headerMargin2: "28px 0 20px 0",
	headerMargin3: "28px 0 20px 0",
	headerMargin4: "28px 0 18px 0",
	headerMargin5: "28px 0 18px 0",
	headerMargin6: "28px 0 18px 0",
	headerPrefixWidth1: "16px",
	headerPrefixWidth2: "16px",
	headerPrefixWidth3: "12px",
	headerPrefixWidth4: "12px",
	headerPrefixWidth5: "12px",
	headerPrefixWidth6: "12px",
	headerBarWidth1: "4px",
	headerBarWidth2: "4px",
	headerBarWidth3: "3px",
	headerBarWidth4: "3px",
	headerBarWidth5: "3px",
	headerBarWidth6: "3px",
	pMargin: "16px 0 16px 0",
	liMargin: ".25em 0 0 0",
	olPadding: "0 0 0 2em",
	ulPadding: "0 0 0 2em"
};
//#endregion
//#region node_modules/naive-ui/es/typography/styles/light.mjs
function Ov(e) {
	let { primaryColor: t, textColor2: n, borderColor: r, lineHeight: i, fontSize: a, borderRadiusSmall: o, dividerColor: s, fontWeightStrong: c, textColor1: l, textColor3: u, infoColor: d, warningColor: f, errorColor: p, successColor: m, codeColor: h } = e;
	return {
		...Dv,
		aTextColor: t,
		blockquoteTextColor: n,
		blockquotePrefixColor: r,
		blockquoteLineHeight: i,
		blockquoteFontSize: a,
		codeBorderRadius: o,
		liTextColor: n,
		liLineHeight: i,
		liFontSize: a,
		hrColor: s,
		headerFontWeight: c,
		headerTextColor: l,
		pTextColor: n,
		pTextColor1Depth: l,
		pTextColor2Depth: n,
		pTextColor3Depth: u,
		pLineHeight: i,
		pFontSize: a,
		headerBarColor: t,
		headerBarColorPrimary: t,
		headerBarColorInfo: d,
		headerBarColorError: p,
		headerBarColorWarning: f,
		headerBarColorSuccess: m,
		textColor: n,
		textColor1Depth: l,
		textColor2Depth: n,
		textColor3Depth: u,
		textColorPrimary: t,
		textColorInfo: d,
		textColorSuccess: m,
		textColorWarning: f,
		textColorError: p,
		codeTextColor: n,
		codeColor: h,
		codeBorder: "1px solid #0000"
	};
}
//#endregion
//#region node_modules/naive-ui/es/typography/styles/dark.mjs
var kv = {
	name: "Typography",
	common: Q,
	self: Ov
};
//#endregion
//#region node_modules/naive-ui/es/upload/styles/light.mjs
function Av(e) {
	let { iconColor: t, primaryColor: n, errorColor: r, textColor2: i, successColor: a, opacityDisabled: o, actionColor: s, borderColor: c, hoverColor: l, lineHeight: u, borderRadius: d, fontSize: f } = e;
	return {
		fontSize: f,
		lineHeight: u,
		borderRadius: d,
		draggerColor: s,
		draggerBorder: `1px dashed ${c}`,
		draggerBorderHover: `1px dashed ${n}`,
		itemColorHover: l,
		itemColorHoverError: J(r, { alpha: .06 }),
		itemTextColor: i,
		itemTextColorError: r,
		itemTextColorSuccess: a,
		itemIconColor: t,
		itemDisabledOpacity: o,
		itemBorderImageCardError: `1px solid ${r}`,
		itemBorderImageCard: `1px solid ${c}`
	};
}
//#endregion
//#region node_modules/naive-ui/es/upload/styles/dark.mjs
var jv = {
	name: "Upload",
	common: Q,
	peers: {
		Button: ig,
		Progress: X_
	},
	self(e) {
		let { errorColor: t } = e, n = Av(e);
		return n.itemColorHoverError = J(t, { alpha: .09 }), n;
	}
}, Mv = {
	name: "Watermark",
	common: Q,
	self(e) {
		let { fontFamily: t } = e;
		return { fontFamily: t };
	}
};
//#endregion
//#region node_modules/naive-ui/es/heatmap/styles/light.mjs
function Nv(e) {
	let { borderRadius: t, fontSizeMini: n, fontSizeTiny: r, fontSizeSmall: i, fontWeight: a, textColor2: o, cardColor: s, buttonColor2Hover: c } = e;
	return {
		activeColors: [
			"#9be9a8",
			"#40c463",
			"#30a14e",
			"#216e39"
		],
		borderRadius: t,
		borderColor: s,
		textColor: o,
		mininumColor: c,
		fontWeight: a,
		loadingColorStart: "rgba(0, 0, 0, 0.06)",
		loadingColorEnd: "rgba(0, 0, 0, 0.12)",
		rectSizeSmall: "10px",
		rectSizeMedium: "11px",
		rectSizeLarge: "12px",
		borderRadiusSmall: "2px",
		borderRadiusMedium: "2px",
		borderRadiusLarge: "2px",
		xGapSmall: "2px",
		xGapMedium: "3px",
		xGapLarge: "3px",
		yGapSmall: "2px",
		yGapMedium: "3px",
		yGapLarge: "3px",
		fontSizeSmall: r,
		fontSizeMedium: n,
		fontSizeLarge: i
	};
}
//#endregion
//#region node_modules/naive-ui/es/icon-wrapper/styles/light.mjs
function Pv(e) {
	let { primaryColor: t, baseColor: n } = e;
	return {
		color: t,
		iconColor: n
	};
}
//#endregion
//#region node_modules/naive-ui/es/legacy-transfer/styles/_common.mjs
var Fv = {
	extraFontSize: "12px",
	width: "440px"
};
//#endregion
//#region node_modules/naive-ui/es/marquee/styles/light.mjs
function Iv() {
	return {};
}
//#endregion
//#region node_modules/naive-ui/es/page-header/styles/_common.mjs
var Lv = {
	titleFontSize: "18px",
	backSize: "22px"
};
//#endregion
//#region node_modules/naive-ui/es/page-header/styles/light.mjs
function Rv(e) {
	let { textColor1: t, textColor2: n, textColor3: r, fontSize: i, fontWeightStrong: a, primaryColorHover: o, primaryColorPressed: s } = e;
	return {
		...Lv,
		titleFontWeight: a,
		fontSize: i,
		titleTextColor: t,
		backColor: n,
		backColorHover: o,
		backColorPressed: s,
		subtitleTextColor: r
	};
}
//#endregion
//#region node_modules/naive-ui/es/themes/dark.mjs
var zv = {
	name: "dark",
	common: Q,
	Alert: gh,
	Anchor: bh,
	AutoComplete: Vh,
	Avatar: Uh,
	AvatarGroup: {
		name: "AvatarGroup",
		common: Q,
		peers: { Avatar: Uh },
		self: Wh
	},
	BackTop: Kh,
	Badge: qh,
	Breadcrumb: eg,
	Button: ig,
	ButtonGroup: A_,
	Calendar: {
		name: "Calendar",
		common: Q,
		peers: { Button: ig },
		self: dg
	},
	Card: hg,
	Carousel: {
		name: "Carousel",
		common: Q,
		self: bg
	},
	Cascader: Tg,
	Checkbox: Cg,
	Code: Eg,
	Collapse: Og,
	CollapseTransition: {
		name: "CollapseTransition",
		common: Q,
		self: kg
	},
	ColorPicker: {
		name: "ColorPicker",
		common: Q,
		peers: {
			Input: Ch,
			Button: ig
		},
		self: Ag
	},
	DataTable: Jg,
	DatePicker: n_,
	Descriptions: a_,
	Dialog: c_,
	Divider: y_,
	Drawer: x_,
	Dropdown: Bg,
	DynamicInput: C_,
	DynamicTags: E_,
	Element: D_,
	Empty: xp,
	Ellipsis: Gg,
	Equation: {
		name: "Equation",
		common: Q,
		self: () => ({})
	},
	Flex: k_,
	Form: N_,
	GradientText: P_,
	Heatmap: {
		name: "Heatmap",
		common: Q,
		self(e) {
			return {
				...Nv(e),
				activeColors: [
					"#0d4429",
					"#006d32",
					"#26a641",
					"#39d353"
				],
				mininumColor: "rgba(255, 255, 255, 0.1)",
				loadingColorStart: "rgba(255, 255, 255, 0.12)",
				loadingColorEnd: "rgba(255, 255, 255, 0.18)"
			};
		}
	},
	Icon: Xg,
	IconWrapper: {
		name: "IconWrapper",
		common: Q,
		self: Pv
	},
	Image: {
		name: "Image",
		common: Q,
		peers: { Tooltip: Hg },
		self: (e) => {
			let { textColor2: t } = e;
			return {
				toolbarIconColor: t,
				toolbarColor: "rgba(0, 0, 0, .35)",
				toolbarBoxShadow: "none",
				toolbarBorderRadius: "24px"
			};
		}
	},
	Input: Ch,
	InputNumber: F_,
	InputOtp: L_,
	LegacyTransfer: {
		name: "Transfer",
		common: Q,
		peers: {
			Checkbox: Cg,
			Scrollbar: _p,
			Input: Ch,
			Empty: xp,
			Button: ig
		},
		self(e) {
			let { iconColorDisabled: t, iconColor: n, fontWeight: r, fontSizeLarge: i, fontSizeMedium: a, fontSizeSmall: o, heightLarge: s, heightMedium: c, heightSmall: l, borderRadius: u, inputColor: d, tableHeaderColor: f, textColor1: p, textColorDisabled: m, textColor2: h, hoverColor: g } = e;
			return {
				...Fv,
				itemHeightSmall: l,
				itemHeightMedium: c,
				itemHeightLarge: s,
				fontSizeSmall: o,
				fontSizeMedium: a,
				fontSizeLarge: i,
				borderRadius: u,
				borderColor: "#0000",
				listColor: d,
				headerColor: f,
				titleTextColor: p,
				titleTextColorDisabled: m,
				extraTextColor: h,
				filterDividerColor: "#0000",
				itemTextColor: h,
				itemTextColorDisabled: m,
				itemColorPending: g,
				titleFontWeight: r,
				iconColor: n,
				iconColorDisabled: t
			};
		}
	},
	Layout: R_,
	List: B_,
	LoadingBar: d_,
	Log: V_,
	Menu: G_,
	Mention: H_,
	Message: m_,
	Modal: u_,
	Notification: __,
	PageHeader: {
		name: "PageHeader",
		common: Q,
		self: Rv
	},
	Pagination: Lg,
	Popconfirm: J_,
	Popover: Np,
	Popselect: Mg,
	Progress: X_,
	QrCode: {
		name: "QrCode",
		common: Q,
		self: (e) => ({ borderRadius: e.borderRadius })
	},
	Radio: Wg,
	Rate: Z_,
	Result: ev,
	Row: {
		name: "Row",
		common: Q
	},
	Scrollbar: _p,
	Select: Pg,
	Skeleton: {
		name: "Skeleton",
		common: Q,
		self(e) {
			let { heightSmall: t, heightMedium: n, heightLarge: r, borderRadius: i } = e;
			return {
				color: "rgba(255, 255, 255, 0.12)",
				colorEnd: "rgba(255, 255, 255, 0.18)",
				borderRadius: i,
				heightSmall: t,
				heightMedium: n,
				heightLarge: r
			};
		}
	},
	Slider: nv,
	Space: T_,
	Spin: iv,
	Statistic: ov,
	Steps: lv,
	Switch: dv,
	Table: mv,
	Tabs: _v,
	Tag: sh,
	Thing: yv,
	TimePicker: $g,
	Timeline: xv,
	Tooltip: Hg,
	Transfer: Cv,
	Tree: Tv,
	TreeSelect: Ev,
	Typography: kv,
	Upload: jv,
	Watermark: Mv,
	Split: {
		name: "Split",
		common: Q
	},
	FloatButton: {
		name: "FloatButton",
		common: Q,
		self(e) {
			let { popoverColor: t, textColor2: n, buttonColor2Hover: r, buttonColor2Pressed: i, primaryColor: a, primaryColorHover: o, primaryColorPressed: s, baseColor: c, borderRadius: l } = e;
			return {
				color: t,
				textColor: n,
				boxShadow: "0 2px 8px 0px rgba(0, 0, 0, .12)",
				boxShadowHover: "0 2px 12px 0px rgba(0, 0, 0, .18)",
				boxShadowPressed: "0 2px 12px 0px rgba(0, 0, 0, .18)",
				colorHover: r,
				colorPressed: i,
				colorPrimary: a,
				colorPrimaryHover: o,
				colorPrimaryPressed: s,
				textColorPrimary: c,
				borderRadiusSquare: l
			};
		}
	},
	FloatButtonGroup: {
		name: "FloatButtonGroup",
		common: Q,
		self(e) {
			let { popoverColor: t, dividerColor: n, borderRadius: r } = e;
			return {
				color: t,
				buttonBorderColor: n,
				borderRadiusSquare: r,
				boxShadow: "0 2px 8px 0px rgba(0, 0, 0, .12)"
			};
		}
	},
	Marquee: {
		name: "Marquee",
		common: Q,
		self: Iv
	}
}, Bv = /* @__PURE__ */ P({
	props: {
		theme: {
			type: String,
			default: "light"
		},
		locale: {
			type: String,
			default: "zh-CN"
		},
		styleMountTarget: {
			type: Object,
			required: !0
		}
	},
	setup(e, { slots: t }) {
		return () => {
			let n = e.theme === "dark", r = e.locale.startsWith("en");
			return R(jg, {
				theme: n ? zv : null,
				locale: r ? Cs : ws,
				dateLocale: r ? ec : tc,
				styleMountTarget: e.styleMountTarget,
				preflightStyleDisabled: !0,
				inlineThemeDisabled: !0,
				themeOverrides: { common: {
					heightMedium: "40px",
					borderRadius: "2px",
					primaryColor: n ? "#c4ad78" : "#655071",
					primaryColorHover: n ? "#d7c497" : "#796087",
					primaryColorPressed: n ? "#ae9460" : "#503d5c",
					bodyColor: n ? "#211e26" : "#f7f4ed",
					cardColor: n ? "#2a2630" : "#efebe4",
					textColorBase: n ? "#eae6df" : "#302c30"
				} }
			}, { default: () => R("div", {
				class: "ui-page",
				"data-theme": e.theme
			}, t.default?.()) });
		};
	}
}), Vv = /* @__PURE__ */ P({ setup(e, { slots: t }) {
	return () => R("div", {
		class: "ui-settings-layout",
		"data-has-aside": !!t.aside
	}, [R("div", { class: "ui-settings-main" }, t.default?.()), t.aside ? R("aside", { class: "ui-settings-aside" }, t.aside()) : null]);
} }), Hv = /* @__PURE__ */ P({
	props: {
		title: String,
		eyebrow: String
	},
	setup(e, { slots: t }) {
		return () => R("section", { class: "ui-surface" }, [
			e.eyebrow ? R("p", { class: "ui-eyebrow" }, e.eyebrow) : null,
			e.title ? R("h2", e.title) : null,
			t.default?.()
		]);
	}
}), Uv = /* @__PURE__ */ P({
	props: {
		title: {
			type: String,
			required: !0
		},
		titleId: String,
		eyebrow: String,
		subtitle: String
	},
	setup(e, { slots: t }) {
		return () => R("header", { class: "ui-page-header" }, [R("div", [
			e.eyebrow ? R("p", { class: "ui-eyebrow" }, e.eyebrow) : null,
			R("h1", { id: e.titleId }, e.title),
			e.subtitle ? R("p", { class: "ui-subtitle" }, e.subtitle) : null
		]), t.default?.()]);
	}
}), Wv = /* @__PURE__ */ P({
	props: {
		title: {
			type: String,
			required: !0
		},
		fieldset: Boolean,
		number: String
	},
	setup(e, { slots: t }) {
		return () => R(e.fieldset ? "fieldset" : "section", { class: "ui-settings-group" }, [e.fieldset ? R("legend", { class: "ui-group-legend" }, e.title) : R("header", { class: "ui-group-heading" }, [R("h2", [e.number ? R("span", {
			class: "ui-section-number",
			"aria-hidden": "true"
		}, e.number) : null, e.title]), t.heading?.()]), t.default?.()]);
	}
}), Gv = /* @__PURE__ */ P({ setup(e, { slots: t }) {
	return () => R("div", { class: "ui-action-bar" }, t.default?.());
} }), Kv = /* @__PURE__ */ P({
	props: {
		tone: {
			type: String,
			default: "neutral"
		},
		role: {
			type: String,
			default: "status"
		}
	},
	setup(e, { slots: t }) {
		return () => R("p", {
			class: "ui-status-hint",
			"data-tone": e.tone,
			role: e.role === "none" ? void 0 : e.role,
			"aria-live": e.role === "none" ? void 0 : e.role === "alert" ? "assertive" : "polite"
		}, t.default?.());
	}
}), qv = /* @__PURE__ */ P({
	props: {
		controlId: {
			type: String,
			required: !0
		},
		label: {
			type: String,
			required: !0
		},
		labelId: String,
		hint: String,
		error: String,
		hintId: String,
		errorId: String,
		layout: {
			type: String,
			default: "stacked"
		}
	},
	slots: Object,
	setup(e, { slots: t }) {
		return () => {
			let n = e.labelId || e.controlId + "-label", r = e.hintId || e.controlId + "-hint", i = e.errorId || e.controlId + "-error", a = [e.hint ? r : null, e.error ? i : null].filter(Boolean).join(" ") || void 0;
			return R("div", { class: ["ui-form-field", e.layout === "row" ? "ui-settings-row" : "ui-form-field-stacked"] }, [
				R("label", {
					id: n,
					for: e.controlId,
					onClick: (t) => t.currentTarget.ownerDocument.getElementById(e.controlId)?.focus()
				}, e.label),
				t.default?.({ controlAttrs: {
					id: e.controlId,
					"aria-labelledby": n,
					"aria-describedby": a,
					"aria-invalid": !!e.error
				} }),
				t.actions?.(),
				e.hint ? R("p", {
					id: r,
					class: "ui-field-hint field-hint"
				}, e.hint) : null,
				R("p", {
					id: i,
					class: "ui-field-error field-detail",
					hidden: !e.error
				}, e.error || "")
			]);
		};
	}
}), Jv = /* @__PURE__ */ P({
	props: { columns: {
		type: Number,
		default: 2
	} },
	setup(e, { slots: t }) {
		return () => R("div", {
			class: "ui-form-grid",
			"data-columns": e.columns
		}, t.default?.());
	}
});
//#endregion
//#region src/confirmation.ts
function Yv(e) {
	let t = /* @__PURE__ */ qt(null), n = 0, r = !1, i = null;
	function a(a, o, s = !1) {
		if (t.value !== a) return;
		let c = !!i?.contains(e.activeElement);
		t.value = null, a.resolve(o && a.isCurrent()), s && c && Cn().then(() => Cn()).then(() => {
			!r && n === a.id && !t.value && (a.canRestoreFocus ?? a.isCurrent)() && e.activeElement === e.body && a.trigger?.isConnected && a.trigger.focus({ preventScroll: !0 });
		});
	}
	function o(e = !1) {
		t.value && a(t.value, !1, e);
	}
	return {
		ask(a) {
			return o(), r || !a.isCurrent() ? Promise.resolve(!1) : new Promise((r) => {
				let o = {
					...a,
					id: ++n,
					trigger: a.trigger ?? e.activeElement,
					resolve: r
				};
				t.value = o, Cn().then(() => {
					t.value === o && o.isCurrent() && i?.querySelector("[data-confirm-cancel]")?.focus({ preventScroll: !0 });
				});
			});
		},
		cancel: o,
		invalidate() {
			t.value && !t.value.isCurrent() && o();
		},
		dispose() {
			o(), r = !0;
		},
		render() {
			let e = t.value;
			return e ? R("section", {
				key: e.id,
				role: "group",
				"aria-label": e.title,
				"data-unload-confirm": e.kind === "unload" ? e.owner : void 0,
				"data-confirmation": e.kind,
				ref: (e) => {
					i = e;
				},
				onKeydown: (t) => {
					t.key === "Escape" && (t.preventDefault(), a(e, !1, !0));
				}
			}, [R(yg, { title: e.title }, { default: () => [
				R("p", e.message),
				R(lg, {
					"data-action": "confirm-" + e.kind,
					onClick: () => a(e, !0)
				}, () => e.confirmLabel),
				R(lg, {
					"data-action": "cancel-" + e.kind,
					"data-confirm-cancel": "",
					onClick: () => a(e, !1, !0)
				}, () => "取消")
			] })]) : null;
		}
	};
}
//#endregion
//#region src/alert-config.js
var Xv = (e) => typeof e == "object" && !!e && !Array.isArray(e) && [Object.prototype, null].includes(Object.getPrototypeOf(e)), Zv = /[\p{Cc}\p{Cf}\p{Cs}]/u, Qv = /^[1-9][0-9]{0,19}$/, $v = () => ({
	enabled: !1,
	check_interval_minutes: 15,
	metric: "",
	unit: "",
	threshold: null,
	recovery_threshold: null,
	repeat_minutes: 0
}), ey = () => ({ enabled: !0 });
function ty(e) {
	return e.type === "alibaba_bailian" ? "AvailableAmount" : e.type === "deepseek" ? "total_balance" : e.type === "grsai" || e.type === "openai_compatible" && e.service_profile === "grsai" ? "credit" : e.type === "meinianda" ? "site_credit" : e.type === "openai_compatible" ? "mapped_balance" : "";
}
function ny(e) {
	return e.type === "alibaba_bailian" ? [
		"AvailableAmount",
		"AvailableCashAmount",
		"CreditAmount"
	] : e.type === "deepseek" ? [
		"total_balance",
		"granted_balance",
		"topped_up_balance"
	] : e.type === "grsai" || e.type === "openai_compatible" && e.service_profile === "grsai" ? ["credit"] : e.type === "meinianda" ? ["site_credit"] : e.type === "openai_compatible" ? ["mapped_balance"] : [];
}
var ry = {
	AvailableAmount: "可用额度",
	AvailableCashAmount: "现金余额",
	CreditAmount: "信用额度",
	total_balance: "总余额",
	granted_balance: "赠送余额",
	topped_up_balance: "充值余额",
	credit: "积分",
	site_credit: "站内额度",
	mapped_balance: "已配置映射余额"
}, iy = {
	credit: "积分",
	site_credit: "站内额度"
}, ay = (e) => Object.hasOwn(iy, e) ? iy[e] : e, oy = (e) => Object.hasOwn(ry, e) ? ry[e] : "监测余额";
function sy(e, t = "zh-CN") {
	let n = new Date(e);
	if (!Number.isFinite(n.getTime())) return "时间不可用";
	let r = {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		hourCycle: "h23",
		timeZoneName: "short"
	};
	try {
		return new Intl.DateTimeFormat(t, r).format(n);
	} catch {
		return new Intl.DateTimeFormat("zh-CN", r).format(n);
	}
}
var cy = {
	session_disabled: "目标会话已停用，请在 AstrBot 中启用会话。",
	session_check_failed: "无法核对目标会话状态，请检查 AstrBot 会话设置与日志。",
	fixed_hint: "已使用固定提示。",
	target_invalid: "推送目标格式无效，请在全局设置中核对 UMO。",
	platform_not_found: "未找到目标平台实例，请核对 UMO 的平台实例 ID。",
	platform_unavailable: "目标平台实例暂不可用，请检查连接状态与宿主日志。",
	platform_unsupported: "目标平台不支持此主动发送方式，请改用支持的推送目标。",
	mention_unsupported: "目标不支持 QQ 提及，请移除 @ 后缀或使用支持的 QQ 群目标。",
	mention_invalid: "QQ 提及格式无效，请核对群会话与 @QQ 号。",
	transport_unavailable: "宿主主动发送接口不可用，请检查 AstrBot 版本与日志。",
	message_components_unavailable: "消息组件无法构造，请检查宿主组件与日志。"
}, ly = (e) => Object.hasOwn(cy, e) ? cy[e] : "暂无明确阻止原因，请核对全局推送目标、平台连接与宿主预警日志。";
function uy(e) {
	let t = ty(e);
	return t === "credit" ? "credit" : t === "site_credit" ? "site_credit" : null;
}
function dy(e) {
	let t = (e, t) => typeof e == "string" && e.length > 0 && [...e].length <= t && !Zv.test(e), n = (e) => t(e, 32) && !/\s/u.test(e), r = (e) => e === null || typeof e == "string" && e.length <= 64 && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(e) && Number.isFinite(Date.parse(e));
	if (!Xv(e) || !Array.isArray(e.accounts) || e.accounts.length > 100) throw Error("invalid_response");
	let i = /* @__PURE__ */ new Set();
	return { accounts: e.accounts.map((e) => {
		if (!Xv(e) || !t(e.account_id, 128) || i.has(e.account_id) || ![
			"unidentified",
			"verified",
			"ambiguous",
			"changed",
			"stale"
		].includes(e.unit_state) || !(e.unit === null || n(e.unit)) || !r(e.observed_at) || !Array.isArray(e.choices) || e.choices.length > 20 || e.unit_state === "verified" && !e.unit) throw Error("invalid_response");
		i.add(e.account_id);
		let a = /* @__PURE__ */ new Set();
		for (let n of ["metric", "binding_metric"]) if (e[n] !== void 0 && (n !== "binding_metric" || e[n] !== null) && (!t(e[n], 64) || /\s/u.test(e[n]))) throw Error("invalid_response");
		if (e.change_reason !== void 0 && ![
			"",
			"metric_changed",
			"query_identity_changed",
			"unit_changed"
		].includes(e.change_reason) || e.choices_state !== void 0 && ![
			"fresh",
			"expired",
			"unavailable"
		].includes(e.choices_state) || e.choices_observed_at !== void 0 && !r(e.choices_observed_at) || e.choices_state && e.choices_state !== "fresh" && e.choices.length) throw Error("invalid_response");
		return {
			account_id: e.account_id,
			unit_state: e.unit_state,
			unit: e.unit,
			observed_at: e.observed_at,
			...Object.fromEntries([
				"metric",
				"binding_metric",
				"change_reason",
				"choices_state",
				"choices_observed_at"
			].filter((t) => e[t] !== void 0).map((t) => [t, e[t]])),
			choices: e.choices.map((e) => {
				if (!Xv(e) || typeof e.id != "string" || !/^[0-9a-f]{64}$/.test(e.id) || a.has(e.id) || !t(e.metric, 64) || /\s/u.test(e.metric) || !n(e.unit)) throw Error("invalid_response");
				return a.add(e.id), {
					id: e.id,
					metric: e.metric,
					unit: e.unit
				};
			})
		};
	}) };
}
function fy(e) {
	if (typeof e != "string" || Zv.test(e)) throw Error("UMO 不允许控制字符或不可见字符。");
	let t = e.trim(), n = t.indexOf(":"), r = t.indexOf(":", n + 1);
	if ([...t].length > 512 || /\s/u.test(t) || n <= 0 || r <= n + 1 || r === t.length - 1) throw Error("请填写完整 UMO：平台实例:消息类型:会话 ID。");
	let i = t.slice(n + 1, r), a = t.slice(r + 1);
	if (![
		"FriendMessage",
		"GroupMessage",
		"OtherMessage"
	].includes(i)) throw Error("消息类型需为 FriendMessage、GroupMessage 或 OtherMessage。");
	return {
		umo: t,
		type: i,
		session: a
	};
}
function py(e, t = 100) {
	if (!Array.isArray(e) || e.length > t) throw Error(`QQ 号最多 ${t} 项。`);
	let n = [];
	for (let t of e) {
		if (typeof t != "string" || Zv.test(t) || !Qv.test(t.trim())) throw Error("QQ 号须为 1 至 20 位 ASCII 正整数字串；不支持 @all、昵称或 CQ 码。");
		let e = t.trim();
		n.includes(e) || n.push(e);
	}
	return n;
}
function my(e) {
	if (!Array.isArray(e) || e.length > 20) throw Error("推送目标最多 20 个。");
	let t = /* @__PURE__ */ new Set();
	return e.map((e) => {
		if (!Xv(e) || Object.keys(e).some((e) => !["umo", "mentions"].includes(e)) || !Object.hasOwn(e, "umo") || !Object.hasOwn(e, "mentions")) throw Error("每个目标须包含 UMO 和提及列表。");
		let n = fy(e.umo), r = py(e.mentions, 20);
		if (r.length && (n.type !== "GroupMessage" || !Qv.test(n.session.split("_").at(-1)))) throw Error("仅数字 QQ 群会话可附加 @QQ 号；私聊或其他会话请删除 @ 后缀。");
		if (t.has(n.umo)) throw Error("UMO 重复，请合并为一行。");
		return t.add(n.umo), {
			umo: n.umo,
			mentions: r
		};
	});
}
function hy(e) {
	if (typeof e != "string") throw Error("请输入推送目标。");
	let t = [], n = /* @__PURE__ */ new Set();
	for (let [r, i] of e.split(/\r\n|\r|\n/).entries()) try {
		if (/[\p{Cc}\p{Cf}\p{Cs}]/u.test(i.replaceAll("	", ""))) throw Error("不允许控制字符或不可见字符。");
		if (!i.trim()) continue;
		let [e, ...r] = i.trim().split(/\s+/u);
		if (r.some((e) => !e.startsWith("@"))) throw Error("UMO 后请使用空格分隔的 @QQ号。");
		let a = my([{
			umo: e,
			mentions: r.map((e) => e.slice(1))
		}])[0];
		if (n.has(a.umo)) throw Error("UMO 重复，请合并为一行。");
		if (n.add(a.umo), t.push(a), t.length > 20) throw Error("推送目标最多 20 个。");
	} catch (e) {
		throw Error(`第 ${r + 1} 行：${e.message}`);
	}
	return t;
}
function gy(e) {
	return Array.isArray(e) ? e.map((e) => [e.umo, ...e.mentions.map((e) => "@" + e)].join(" ")).join("\n") : "";
}
function _y(e) {
	if (typeof e != "string" || Zv.test(e)) throw Error("阈值须为不含指数的有限十进制字符串。");
	let t = e.trim();
	if (t.length > 50 || !/^-?(?:0|[1-9][0-9]{0,29})(?:\.[0-9]{1,18})?$/.test(t)) throw Error("阈值最多 30 位整数、18 位小数，不支持指数形式。");
	return /^-?0(?:\.0+)?$/.test(t) ? "0" : t;
}
function vy(e) {
	let t = _y(e), [n, r = ""] = t.split(".");
	return {
		n: BigInt(n.replace("-", "") + r) * (t.startsWith("-") ? -1n : 1n),
		scale: r.length
	};
}
function yy(e, t) {
	let n = vy(e), r = vy(t), i = Math.max(n.scale, r.scale);
	return n.n * 10n ** BigInt(i - n.scale) - r.n * 10n ** BigInt(i - r.scale);
}
function by(e, t) {
	if (e === void 0) return {
		...$v(),
		metric: ty(t)
	};
	if (!Xv(e) || Object.keys(e).some((e) => !Object.hasOwn($v(), e))) throw Error("预警配置字段无效。");
	let n = {
		...$v(),
		...e
	};
	if (typeof n.enabled != "boolean" || !Number.isInteger(n.check_interval_minutes) || n.check_interval_minutes < 1 || n.check_interval_minutes > 4320) throw Error("检查间隔须为 1 至 4320 的整数分钟。");
	if (!Number.isInteger(n.repeat_minutes) || n.repeat_minutes < 0 || n.repeat_minutes > 4320) throw Error("重复提醒须为 0 至 4320 的整数分钟；0 表示不重复。");
	if (typeof n.metric != "string" || Zv.test(n.metric) || n.metric.trim() && !ny(t).includes(n.metric.trim())) throw Error("请选择该供应商支持的预警指标。");
	if (n.metric = n.metric.trim() || ty(t), typeof n.unit != "string" || [...n.unit.trim()].length > 32 || Zv.test(n.unit) || /\s/u.test(n.unit.trim())) throw Error("单位须为不超过 32 字的明确文本。");
	n.unit = n.unit.trim();
	for (let e of ["threshold", "recovery_threshold"]) n[e] !== null && (n[e] = _y(n[e]));
	if (n.recovery_threshold !== null && (n.threshold === null || yy(n.recovery_threshold, n.threshold) <= 0n)) throw Error("恢复阈值须严格大于触发阈值。");
	return n;
}
function xy(e) {
	if (e === void 0) return ey();
	if (!Xv(e) || Object.keys(e).some((e) => ![
		"enabled",
		"provider_id",
		"persona_id"
	].includes(e))) throw Error("提示模型配置无效。");
	let t = {
		...ey(),
		...e
	};
	if (typeof t.enabled != "boolean") throw Error("提示模型开关无效。");
	for (let e of ["provider_id", "persona_id"]) if (Object.hasOwn(t, e)) {
		if (typeof t[e] != "string" || [...t[e].trim()].length > 128 || Zv.test(t[e])) throw Error("模型与人格 ID 须为不超过 128 字的文本。");
		t[e] = t[e].trim();
	}
	return t;
}
function Sy(e) {
	let t = [], n = [];
	try {
		n = my(e.balance_alert_targets === void 0 ? [] : e.balance_alert_targets);
	} catch (e) {
		t.push(e.message);
	}
	try {
		py(e.balance_alert_admin_qq_ids === void 0 ? [] : e.balance_alert_admin_qq_ids);
	} catch (e) {
		t.push(e.message);
	}
	try {
		xy(e.balance_alert_llm);
	} catch (e) {
		t.push(e.message);
	}
	for (let r of e.providers || []) try {
		let e = by(r.balance_alert, r);
		if (e.enabled && (r.enabled !== void 0 && r.enabled !== !0 || e.threshold === null || !e.metric || n.length === 0)) throw Error("启用预警前，请启用账户并填写阈值和至少一个全局推送目标。");
	} catch (e) {
		t.push(`${r.display_name || r.id}：${e.message}`);
	}
	return t;
}
function Cy(e) {
	if (!Xv(e) || typeof e.running != "boolean" || typeof e.storage_available != "boolean" || !Array.isArray(e.accounts) || e.accounts.length > 100) throw Error("invalid_response");
	return {
		running: e.running,
		storage_available: e.storage_available,
		accounts: e.accounts.map((e) => {
			if (!Xv(e) || typeof e.account_id != "string" || e.account_id.length > 128 || typeof e.status != "string" || !/^[a-z_]{1,64}$/.test(e.status) || e.detail_code !== void 0 && (typeof e.detail_code != "string" || !/^[a-z_]{0,64}$/.test(e.detail_code))) throw Error("invalid_response");
			return {
				account_id: e.account_id,
				status: e.status,
				...e.detail_code ? { detail_code: e.detail_code } : {},
				...Object.fromEntries(["last_checked_at", "last_sent_at"].filter((t) => typeof e[t] == "string" && e[t].length <= 64 && !Zv.test(e[t])).map((t) => [t, e[t]]))
			};
		})
	};
}
var wy = {
	timeout_seconds: {
		description: "单个账户查询的最长等待秒数",
		type: "float",
		default: 8,
		invisible: !0
	},
	total_timeout_seconds: {
		description: "一次查询所有目标的最长等待秒数",
		type: "float",
		default: 30,
		invisible: !0
	},
	cache_ttl_seconds: {
		description: "成功查询结果的缓存秒数",
		type: "float",
		default: 60,
		invisible: !0
	},
	max_concurrency: {
		description: "同时查询的账户数上限",
		type: "int",
		default: 4,
		invisible: !0
	},
	command_admin_only: {
		description: "仅管理员可查询额度",
		type: "bool",
		default: !0,
		invisible: !0
	},
	private_allowed_user_ids: {
		description: "私聊白名单",
		type: "list",
		default: [],
		hint: "填写完整 平台名:用户ID，例如 aiocqhttp:123456；管理员无需加入。/yql 余额查询还受上方管理员开关限制。",
		invisible: !0
	},
	allow_group_queries: {
		description: "是否允许在群聊查询",
		type: "bool",
		default: !1,
		invisible: !0
	},
	group_allowed_user_ids: {
		description: "群聊查询白名单用户 ID",
		type: "list",
		default: [],
		invisible: !0
	},
	providers: /* @__PURE__ */ JSON.parse("{\"description\":\"查询账户\",\"type\":\"template_list\",\"default\":[],\"templates\":{\"deepseek\":{\"name\":\"DeepSeek\",\"hint\":\"官方余额\",\"display_item\":\"display_name\",\"hide_hint_in_list\":true,\"items\":{\"id\":{\"description\":\"账户唯一 ID\",\"type\":\"string\",\"default\":\"\"},\"display_name\":{\"description\":\"显示名称\",\"type\":\"string\",\"default\":\"\"},\"aliases\":{\"description\":\"用于命令和自然语言匹配的其他名称\",\"type\":\"list\",\"default\":[]},\"enabled\":{\"description\":\"启用此账户\",\"type\":\"bool\",\"default\":true},\"timeout_seconds\":{\"description\":\"账户查询超时秒数\",\"type\":\"float\",\"default\":8.0},\"cache_ttl_seconds\":{\"description\":\"账户成功结果缓存秒数\",\"type\":\"float\",\"default\":60.0},\"type\":{\"description\":\"供应商类型\",\"type\":\"string\",\"default\":\"deepseek\",\"invisible\":true},\"auth\":{\"description\":\"余额查询 API Key\",\"type\":\"object\",\"items\":{\"api_key\":{\"description\":\"DeepSeek API Key\",\"type\":\"string\",\"default\":\"\",\"secret\":true}}},\"balance_alert\":{\"description\":\"账户额度预警\",\"type\":\"object\",\"items\":{\"enabled\":{\"description\":\"启用预警\",\"type\":\"bool\",\"default\":false},\"check_interval_minutes\":{\"description\":\"检查间隔（1–4320 分钟）\",\"type\":\"int\",\"default\":15},\"metric\":{\"description\":\"指标 ID（空为供应商默认）\",\"type\":\"string\",\"default\":\"\"},\"unit\":{\"description\":\"旧版单位参考（自动识别后验证）\",\"type\":\"string\",\"default\":\"\",\"invisible\":true},\"threshold\":{\"description\":\"触发阈值\",\"type\":\"string\",\"default\":null,\"hint\":\"填写普通十进制文本；未设置为 null，启用前必须明确设置。\"},\"recovery_threshold\":{\"description\":\"恢复阈值（空为自动滞回）\",\"type\":\"string\",\"default\":null},\"repeat_minutes\":{\"description\":\"持续低额重复间隔（0 表示不重复）\",\"type\":\"int\",\"default\":0}}}}},\"alibaba_bailian\":{\"name\":\"阿里云百炼\",\"hint\":\"账户现金余额\",\"display_item\":\"display_name\",\"hide_hint_in_list\":true,\"items\":{\"id\":{\"description\":\"账户唯一 ID\",\"type\":\"string\",\"default\":\"\"},\"display_name\":{\"description\":\"显示名称\",\"type\":\"string\",\"default\":\"\"},\"aliases\":{\"description\":\"用于命令和自然语言匹配的其他名称\",\"type\":\"list\",\"default\":[]},\"enabled\":{\"description\":\"启用此账户\",\"type\":\"bool\",\"default\":true},\"timeout_seconds\":{\"description\":\"账户查询超时秒数\",\"type\":\"float\",\"default\":8.0},\"cache_ttl_seconds\":{\"description\":\"账户成功结果缓存秒数\",\"type\":\"float\",\"default\":60.0},\"type\":{\"description\":\"供应商类型\",\"type\":\"string\",\"default\":\"alibaba_bailian\",\"invisible\":true},\"auth\":{\"description\":\"阿里云 RAM 只读查询凭据\",\"type\":\"object\",\"items\":{\"access_key_id\":{\"description\":\"RAM AccessKey ID\",\"hint\":\"查询阿里云 BSS 现金余额、可用额度、信用额度。RAM 身份至少需 AliyunBSSReadOnlyAccess；不能用 DashScope 模型 API Key。\",\"type\":\"string\",\"default\":\"\",\"secret\":true},\"access_key_secret\":{\"description\":\"RAM AccessKey Secret\",\"type\":\"string\",\"default\":\"\",\"secret\":true},\"security_token\":{\"description\":\"STS Security Token\",\"hint\":\"可选；仅临时凭据需要。\",\"type\":\"string\",\"default\":\"\",\"secret\":true}}},\"balance_alert\":{\"description\":\"账户额度预警\",\"type\":\"object\",\"items\":{\"enabled\":{\"description\":\"启用预警\",\"type\":\"bool\",\"default\":false},\"check_interval_minutes\":{\"description\":\"检查间隔（1–4320 分钟）\",\"type\":\"int\",\"default\":15},\"metric\":{\"description\":\"指标 ID（空为供应商默认）\",\"type\":\"string\",\"default\":\"\"},\"unit\":{\"description\":\"旧版单位参考（自动识别后验证）\",\"type\":\"string\",\"default\":\"\",\"invisible\":true},\"threshold\":{\"description\":\"触发阈值\",\"type\":\"string\",\"default\":null,\"hint\":\"填写普通十进制文本；未设置为 null，启用前必须明确设置。\"},\"recovery_threshold\":{\"description\":\"恢复阈值（空为自动滞回）\",\"type\":\"string\",\"default\":null},\"repeat_minutes\":{\"description\":\"持续低额重复间隔（0 表示不重复）\",\"type\":\"int\",\"default\":0}}}}},\"grsai\":{\"name\":\"Grsai\",\"hint\":\"账户积分\",\"display_item\":\"display_name\",\"hide_hint_in_list\":true,\"items\":{\"id\":{\"description\":\"账户唯一 ID\",\"type\":\"string\",\"default\":\"\"},\"display_name\":{\"description\":\"显示名称\",\"type\":\"string\",\"default\":\"\"},\"aliases\":{\"description\":\"用于命令和自然语言匹配的其他名称\",\"type\":\"list\",\"default\":[]},\"enabled\":{\"description\":\"启用此账户\",\"type\":\"bool\",\"default\":true},\"timeout_seconds\":{\"description\":\"账户查询超时秒数\",\"type\":\"float\",\"default\":8.0},\"cache_ttl_seconds\":{\"description\":\"账户成功结果缓存秒数\",\"type\":\"float\",\"default\":60.0},\"type\":{\"description\":\"供应商类型\",\"type\":\"string\",\"default\":\"grsai\",\"invisible\":true},\"service_profile\":{\"description\":\"Grsai 账户积分预设\",\"type\":\"string\",\"default\":\"grsai\",\"invisible\":true},\"balance_scope\":{\"description\":\"账户积分\",\"type\":\"string\",\"default\":\"account\",\"invisible\":true},\"auth\":{\"description\":\"Grsai 账户积分请求令牌\",\"type\":\"object\",\"items\":{\"token\":{\"description\":\"请求令牌 token\",\"hint\":\"从 Grsai 用户信息栏取得请求令牌 token；请勿填写模型 API Key 或 Bearer 令牌。插件固定 POST /client/openapi/getCredits，读取 data.credits。\",\"type\":\"string\",\"default\":\"\",\"secret\":true}}},\"region\":{\"description\":\"连接区域\",\"hint\":\"国内与海外均使用内置官方节点，无需手填服务器地址。\",\"type\":\"string\",\"default\":\"china\",\"options\":[\"china\",\"global\"],\"labels\":[\"国内直连\",\"海外节点\"]},\"balance_alert\":{\"description\":\"账户额度预警\",\"type\":\"object\",\"items\":{\"enabled\":{\"description\":\"启用预警\",\"type\":\"bool\",\"default\":false},\"check_interval_minutes\":{\"description\":\"检查间隔（1–4320 分钟）\",\"type\":\"int\",\"default\":15},\"metric\":{\"description\":\"指标 ID（空为供应商默认）\",\"type\":\"string\",\"default\":\"\"},\"unit\":{\"description\":\"旧版单位参考（自动识别后验证）\",\"type\":\"string\",\"default\":\"\",\"invisible\":true},\"threshold\":{\"description\":\"触发阈值\",\"type\":\"string\",\"default\":null,\"hint\":\"填写普通十进制文本；未设置为 null，启用前必须明确设置。\"},\"recovery_threshold\":{\"description\":\"恢复阈值（空为自动滞回）\",\"type\":\"string\",\"default\":null},\"repeat_minutes\":{\"description\":\"持续低额重复间隔（0 表示不重复）\",\"type\":\"int\",\"default\":0}}}}},\"meinianda\":{\"name\":\"Meinianda\",\"hint\":\"账户站内额度\",\"display_item\":\"display_name\",\"hide_hint_in_list\":true,\"items\":{\"id\":{\"description\":\"账户唯一 ID\",\"type\":\"string\",\"default\":\"\"},\"display_name\":{\"description\":\"显示名称\",\"type\":\"string\",\"default\":\"\"},\"aliases\":{\"description\":\"用于命令和自然语言匹配的其他名称\",\"type\":\"list\",\"default\":[]},\"enabled\":{\"description\":\"启用此账户\",\"type\":\"bool\",\"default\":true},\"timeout_seconds\":{\"description\":\"账户查询超时秒数\",\"type\":\"float\",\"default\":8.0},\"cache_ttl_seconds\":{\"description\":\"账户成功结果缓存秒数\",\"hint\":\"站点建议每分钟查询一次，默认缓存 60 秒。\",\"type\":\"float\",\"default\":60.0},\"type\":{\"description\":\"供应商类型\",\"type\":\"string\",\"default\":\"meinianda\",\"invisible\":true},\"auth\":{\"description\":\"余额查询 API Key\",\"type\":\"object\",\"items\":{\"api_key\":{\"description\":\"Meinianda API Key\",\"hint\":\"查询 meinianda.top 的账户站内额度（site_credit）。地址与解析已内置，无需填写。\",\"type\":\"string\",\"default\":\"\",\"secret\":true}}},\"balance_alert\":{\"description\":\"账户额度预警\",\"type\":\"object\",\"items\":{\"enabled\":{\"description\":\"启用预警\",\"type\":\"bool\",\"default\":false},\"check_interval_minutes\":{\"description\":\"检查间隔（1–4320 分钟）\",\"type\":\"int\",\"default\":15},\"metric\":{\"description\":\"指标 ID（空为供应商默认）\",\"type\":\"string\",\"default\":\"\"},\"unit\":{\"description\":\"旧版单位参考（自动识别后验证）\",\"type\":\"string\",\"default\":\"\",\"invisible\":true},\"threshold\":{\"description\":\"触发阈值\",\"type\":\"string\",\"default\":null,\"hint\":\"填写普通十进制文本；未设置为 null，启用前必须明确设置。\"},\"recovery_threshold\":{\"description\":\"恢复阈值（空为自动滞回）\",\"type\":\"string\",\"default\":null},\"repeat_minutes\":{\"description\":\"持续低额重复间隔（0 表示不重复）\",\"type\":\"int\",\"default\":0}}}}},\"openai_compatible\":{\"name\":\"其他兼容服务\",\"hint\":\"自定义余额接口\",\"display_item\":\"display_name\",\"hide_hint_in_list\":true,\"items\":{\"id\":{\"description\":\"账户唯一 ID\",\"type\":\"string\",\"default\":\"\"},\"display_name\":{\"description\":\"显示名称\",\"type\":\"string\",\"default\":\"\"},\"aliases\":{\"description\":\"用于命令和自然语言匹配的其他名称\",\"type\":\"list\",\"default\":[]},\"enabled\":{\"description\":\"启用此账户\",\"type\":\"bool\",\"default\":true},\"timeout_seconds\":{\"description\":\"账户查询超时秒数\",\"type\":\"float\",\"default\":8.0},\"cache_ttl_seconds\":{\"description\":\"账户成功结果缓存秒数\",\"type\":\"float\",\"default\":60.0},\"type\":{\"description\":\"供应商类型\",\"type\":\"string\",\"default\":\"openai_compatible\",\"invisible\":true},\"service_profile\":{\"description\":\"服务类型\",\"hint\":\"余额查询使用服务商专属接口。新 Grsai 账户请直接添加 Grsai 模板；本模板旧条目可切换账户积分预设。\",\"type\":\"string\",\"default\":\"generic\",\"options\":[\"generic\",\"grsai\"],\"labels\":[\"OpenAI 兼容服务 / 第三方服务\",\"Grsai\"]},\"balance_scope\":{\"description\":\"积分范围\",\"hint\":\"账户积分已支持；API Key 积分暂不可查询。\",\"type\":\"string\",\"default\":\"generic\",\"options\":[\"generic\",\"account\",\"api_key\"],\"labels\":[\"请选择积分范围\",\"账户积分（已支持预设）\",\"API Key 积分（暂不可查询）\"],\"condition\":{\"service_profile\":\"grsai\"}},\"auth\":{\"description\":\"余额查询凭据\",\"hint\":\"Grsai 账户积分填请求令牌 token；其他兼容服务按余额文档填写 API Key。\",\"type\":\"object\",\"items\":{\"token\":{\"description\":\"Grsai 请求令牌 token\",\"hint\":\"从 Grsai 用户信息栏取得请求令牌 token；请勿填写模型 API Key 或 Bearer 令牌。\",\"type\":\"string\",\"default\":\"\",\"secret\":true,\"condition\":{\"service_profile\":\"grsai\",\"balance_scope\":\"account\"}},\"api_key\":{\"description\":\"兼容服务 API Key\",\"hint\":\"Grsai 账户积分预设忽略此栏；旧 Key 不会用于账户积分请求。\",\"type\":\"string\",\"default\":\"\",\"secret\":true}}},\"endpoint\":{\"description\":\"余额接口\",\"hint\":\"余额查询使用服务商专属接口，请依据其余额文档填写。\",\"type\":\"object\",\"items\":{\"base_url\":{\"description\":\"服务地址\",\"hint\":\"HTTPS 服务根地址，不含 API 路径。https://api.example.invalid 仅为不可访问的格式示例。\",\"type\":\"string\",\"default\":\"\"},\"path\":{\"description\":\"接口路径\",\"hint\":\"通用服务按文档填写。Grsai 账户积分留空或填 /client/openapi/getCredits；旧条目切换时清除原路径。/account/balance 仅为占位示例。\",\"type\":\"string\",\"default\":\"\"},\"method\":{\"description\":\"请求方法\",\"hint\":\"通用服务按文档填写。Grsai 账户积分固定 POST；旧条目切换时清除原 GET。\",\"type\":\"string\",\"default\":\"\",\"options\":[\"GET\",\"POST\"],\"condition\":{\"advanced_options\":true}},\"auth_mode\":{\"description\":\"认证方式\",\"hint\":\"按余额文档确认；Grsai 账户积分忽略此栏，token 固定放入 JSON 请求体。\",\"type\":\"string\",\"default\":\"\",\"options\":[\"bearer\",\"header\",\"query\"],\"labels\":[\"Bearer 令牌\",\"请求头\",\"查询参数\"],\"condition\":{\"advanced_options\":true}},\"auth_name\":{\"description\":\"认证参数名\",\"hint\":\"仅认证方式为「请求头」或「查询参数」时使用。\",\"type\":\"string\",\"default\":\"\",\"condition\":{\"advanced_options\":true}},\"json_body\":{\"description\":\"静态 JSON 请求体\",\"hint\":\"仅供通用服务使用，不支持模板或凭据。Grsai 账户积分留空；旧条目切换时清除旧请求体。\",\"type\":\"dict\",\"items\":{},\"default\":{},\"condition\":{\"advanced_options\":true}}}},\"advanced_options\":{\"description\":\"高级设置\",\"hint\":\"通用服务配置认证、方法与响应映射；Grsai 账户积分使用固定协议并忽略旧映射。\",\"type\":\"bool\",\"default\":false},\"response_mapping\":{\"description\":\"响应映射\",\"hint\":\"通用服务按文档填写 JSON Pointer，amount_path 必需；Grsai 账户积分忽略旧映射，固定解析 code=0 与 data.credits。\",\"type\":\"dict\",\"items\":{\"amount_path\":{\"description\":\"主余额路径\",\"hint\":\"必需的 JSON Pointer，例如 /data/remaining。\",\"type\":\"string\",\"default\":\"\"},\"total_path\":{\"description\":\"可选总量路径\",\"type\":\"string\",\"default\":\"\"},\"remaining_path\":{\"description\":\"可选剩余量路径\",\"type\":\"string\",\"default\":\"\"},\"used_path\":{\"description\":\"可选已用量路径\",\"type\":\"string\",\"default\":\"\"},\"unit\":{\"description\":\"固定单位\",\"hint\":\"可用 CNY/USD/JPY/credit/credits/tokens/requests/custom；设置 unit_path 时必填。\",\"type\":\"string\",\"default\":\"custom\"},\"unit_path\":{\"description\":\"单位路径\",\"hint\":\"可选 JSON Pointer；运行时值必须与固定 unit 一致。\",\"type\":\"string\",\"default\":\"\"},\"kind\":{\"description\":\"固定余额类别\",\"type\":\"string\",\"default\":\"custom\"},\"kind_path\":{\"description\":\"余额类别路径\",\"hint\":\"可选 JSON Pointer；仅接受 cash/quota/free_quota/subscription/credits/usage/custom。\",\"type\":\"string\",\"default\":\"\"},\"status_path\":{\"description\":\"可选账户状态 JSON Pointer\",\"type\":\"string\",\"default\":\"\"},\"status_values\":{\"description\":\"状态值映射\",\"hint\":\"将供应商状态值映射到 available/unavailable/partial/unknown。\",\"type\":\"dict\",\"items\":{},\"default\":{}},\"expires_at_path\":{\"description\":\"可选到期时间 JSON Pointer\",\"type\":\"string\",\"default\":\"\"},\"expiry_path\":{\"description\":\"到期时间别名\",\"hint\":\"兼容旧版 expires_at_path。\",\"type\":\"string\",\"default\":\"\"},\"success_path\":{\"description\":\"可选业务成功字段路径\",\"type\":\"string\",\"default\":\"\"},\"success_value\":{\"description\":\"success_path 对应的成功值\",\"type\":\"string\",\"default\":\"\"},\"failure_path\":{\"description\":\"可选业务失败字段路径\",\"type\":\"string\",\"default\":\"\"},\"failure_value\":{\"description\":\"failure_path 对应的失败值\",\"type\":\"string\",\"default\":\"\"}},\"default\":{},\"condition\":{\"advanced_options\":true}},\"balance_alert\":{\"description\":\"账户额度预警\",\"type\":\"object\",\"items\":{\"enabled\":{\"description\":\"启用预警\",\"type\":\"bool\",\"default\":false},\"check_interval_minutes\":{\"description\":\"检查间隔（1–4320 分钟）\",\"type\":\"int\",\"default\":15},\"metric\":{\"description\":\"指标 ID（空为供应商默认）\",\"type\":\"string\",\"default\":\"\"},\"unit\":{\"description\":\"旧版单位参考（自动识别后验证）\",\"type\":\"string\",\"default\":\"\",\"invisible\":true},\"threshold\":{\"description\":\"触发阈值\",\"type\":\"string\",\"default\":null,\"hint\":\"填写普通十进制文本；未设置为 null，启用前必须明确设置。\"},\"recovery_threshold\":{\"description\":\"恢复阈值（空为自动滞回）\",\"type\":\"string\",\"default\":null},\"repeat_minutes\":{\"description\":\"持续低额重复间隔（0 表示不重复）\",\"type\":\"int\",\"default\":0}}}}},\"provider_account\":{\"name\":\"旧版通用账户\",\"hint\":\"仅供旧配置编辑\",\"display_item\":\"display_name\",\"items\":{\"id\":{\"description\":\"账户唯一 ID\",\"type\":\"string\",\"default\":\"\"},\"type\":{\"description\":\"供应商类型\",\"hint\":\"本旧模板没有 Grsai 账户积分的切换字段。迁移时请新建 Grsai 条目并禁用旧条目。\",\"type\":\"string\",\"default\":\"deepseek\",\"options\":[\"alibaba_bailian\",\"deepseek\",\"openai_compatible\"]},\"display_name\":{\"description\":\"显示名称\",\"type\":\"string\",\"default\":\"\"},\"aliases\":{\"description\":\"用于命令和自然语言匹配的其他名称\",\"type\":\"list\",\"default\":[]},\"enabled\":{\"description\":\"启用此账户\",\"type\":\"bool\",\"default\":true},\"timeout_seconds\":{\"description\":\"账户查询超时秒数\",\"type\":\"float\",\"default\":8.0},\"cache_ttl_seconds\":{\"description\":\"账户成功结果缓存秒数\",\"type\":\"float\",\"default\":60.0},\"auth\":{\"description\":\"账户凭据\",\"type\":\"object\",\"items\":{\"api_key\":{\"description\":\"余额 API Key\",\"hint\":\"用于 DeepSeek 或兼容余额接口，不用于阿里云 BSS。\",\"type\":\"string\",\"default\":\"\",\"secret\":true},\"access_key_id\":{\"description\":\"RAM AccessKey ID\",\"hint\":\"与 DashScope 模型 API Key 不同。\",\"type\":\"string\",\"default\":\"\",\"secret\":true},\"access_key_secret\":{\"description\":\"RAM AccessKey Secret\",\"type\":\"string\",\"default\":\"\",\"secret\":true},\"security_token\":{\"description\":\"STS Security Token\",\"hint\":\"可选；仅临时凭据需要。\",\"type\":\"string\",\"default\":\"\",\"secret\":true}}},\"endpoint\":{\"description\":\"余额接口\",\"hint\":\"只读余额端点，必须使用 HTTPS。\",\"type\":\"object\",\"items\":{\"url\":{\"description\":\"余额 URL\",\"hint\":\"完整 HTTPS 地址，不含 query、凭据或 fragment。\",\"type\":\"string\",\"default\":\"\"},\"base_url\":{\"description\":\"服务地址\",\"hint\":\"HTTPS 服务根地址，可与接口路径配合。\",\"type\":\"string\",\"default\":\"\"},\"path\":{\"description\":\"经文档确认的只读余额路径\",\"type\":\"string\",\"default\":\"\"},\"method\":{\"description\":\"请求方法\",\"hint\":\"只允许 GET 或已确认无副作用的 POST。\",\"type\":\"string\",\"default\":\"GET\",\"options\":[\"GET\",\"POST\"]},\"auth_mode\":{\"description\":\"API Key 认证位置\",\"type\":\"string\",\"default\":\"bearer\",\"options\":[\"bearer\",\"header\",\"query\"],\"labels\":[\"Bearer 令牌\",\"请求头\",\"查询参数\"]},\"auth_name\":{\"description\":\"认证参数名\",\"hint\":\"仅认证方式为「请求头」或「查询参数」时使用。\",\"type\":\"string\",\"default\":\"\"},\"json_body\":{\"description\":\"静态 JSON 请求体\",\"hint\":\"仅用于有文档依据的只读 POST，不支持模板或凭据。\",\"type\":\"dict\",\"items\":{},\"default\":{}}}},\"response_mapping\":{\"description\":\"响应映射\",\"hint\":\"使用 JSON Pointer 映射余额和可选状态字段；amount_path 必需。\",\"type\":\"dict\",\"items\":{\"amount_path\":{\"description\":\"主余额路径\",\"hint\":\"必需的 JSON Pointer，例如 /data/remaining。\",\"type\":\"string\",\"default\":\"\"},\"total_path\":{\"description\":\"可选总量路径\",\"type\":\"string\",\"default\":\"\"},\"remaining_path\":{\"description\":\"可选剩余量路径\",\"type\":\"string\",\"default\":\"\"},\"used_path\":{\"description\":\"可选已用量路径\",\"type\":\"string\",\"default\":\"\"},\"unit\":{\"description\":\"固定单位\",\"hint\":\"可用 CNY/USD/JPY/credit/credits/tokens/requests/custom；设置 unit_path 时必填。\",\"type\":\"string\",\"default\":\"custom\"},\"unit_path\":{\"description\":\"单位路径\",\"hint\":\"可选 JSON Pointer；运行时值必须与固定 unit 一致。\",\"type\":\"string\",\"default\":\"\"},\"kind\":{\"description\":\"固定余额类别\",\"type\":\"string\",\"default\":\"custom\"},\"kind_path\":{\"description\":\"余额类别路径\",\"hint\":\"可选 JSON Pointer；仅接受 cash/quota/free_quota/subscription/credits/usage/custom。\",\"type\":\"string\",\"default\":\"\"},\"status_path\":{\"description\":\"可选账户状态 JSON Pointer\",\"type\":\"string\",\"default\":\"\"},\"status_values\":{\"description\":\"状态值映射\",\"hint\":\"将供应商状态值映射到 available/unavailable/partial/unknown。\",\"type\":\"dict\",\"items\":{},\"default\":{}},\"expires_at_path\":{\"description\":\"可选到期时间 JSON Pointer\",\"type\":\"string\",\"default\":\"\"},\"expiry_path\":{\"description\":\"到期时间别名\",\"hint\":\"兼容旧版 expires_at_path。\",\"type\":\"string\",\"default\":\"\"},\"success_path\":{\"description\":\"可选业务成功字段路径\",\"type\":\"string\",\"default\":\"\"},\"success_value\":{\"description\":\"success_path 对应的成功值\",\"type\":\"string\",\"default\":\"\"},\"failure_path\":{\"description\":\"可选业务失败字段路径\",\"type\":\"string\",\"default\":\"\"},\"failure_value\":{\"description\":\"failure_path 对应的失败值\",\"type\":\"string\",\"default\":\"\"}},\"default\":{}},\"balance_alert\":{\"description\":\"账户额度预警\",\"type\":\"object\",\"items\":{\"enabled\":{\"description\":\"启用预警\",\"type\":\"bool\",\"default\":false},\"check_interval_minutes\":{\"description\":\"检查间隔（1–4320 分钟）\",\"type\":\"int\",\"default\":15},\"metric\":{\"description\":\"指标 ID（空为供应商默认）\",\"type\":\"string\",\"default\":\"\"},\"unit\":{\"description\":\"旧版单位参考（自动识别后验证）\",\"type\":\"string\",\"default\":\"\",\"invisible\":true},\"threshold\":{\"description\":\"触发阈值\",\"type\":\"string\",\"default\":null,\"hint\":\"填写普通十进制文本；未设置为 null，启用前必须明确设置。\"},\"recovery_threshold\":{\"description\":\"恢复阈值（空为自动滞回）\",\"type\":\"string\",\"default\":null},\"repeat_minutes\":{\"description\":\"持续低额重复间隔（0 表示不重复）\",\"type\":\"int\",\"default\":0}}}},\"hide_hint_in_list\":true}},\"invisible\":true}"),
	balance_alert_targets: {
		description: "额度预警推送目标",
		type: "list",
		default: [],
		hint: "由插件页面管理，每项含 umo 与 mentions；不会自动测试发送。",
		invisible: !0
	},
	balance_alert_admin_qq_ids: {
		description: "预警管理 QQ 白名单",
		type: "list",
		default: [],
		hint: "可信 QQ 身份命中此列表或 AstrBot 内置管理员可管理预警；推送目标不赋予管理权限。",
		invisible: !0
	},
	balance_alert_llm: {
		description: "智能提示",
		type: "object",
		invisible: !0,
		items: {
			enabled: {
				description: "智能提示",
				type: "bool",
				default: !0
			},
			provider_id: {
				description: "旧版配置（不再使用）",
				type: "string",
				default: "",
				invisible: !0
			},
			persona_id: {
				description: "旧版配置（不再使用）",
				type: "string",
				default: "",
				invisible: !0
			}
		}
	}
}, Ty = wy.providers.templates, Ey = [
	"deepseek",
	"alibaba_bailian",
	"grsai",
	"meinianda",
	"openai_compatible"
], Dy = Object.fromEntries(Object.entries(wy).filter(([e]) => e !== "providers")), Oy = [{
	title: "查询与缓存",
	number: "01",
	keys: [
		"timeout_seconds",
		"total_timeout_seconds",
		"cache_ttl_seconds",
		"max_concurrency"
	]
}, {
	title: "查询权限",
	number: "02",
	keys: [
		"command_admin_only",
		"private_allowed_user_ids",
		"allow_group_queries",
		"group_allowed_user_ids"
	]
}];
function ky(e) {
	return JSON.parse(JSON.stringify(e));
}
function Ay(e) {
	return Object.fromEntries(Object.entries(e).filter(([e, t]) => e !== "auth" && !t.secret && !(["provider_id", "persona_id"].includes(e) && t.invisible)).map(([e, t]) => [e, t.items && t.type === "object" ? Ay(t.items) : ky(Object.hasOwn(t, "default") ? t.default : "")]));
}
function jy(e) {
	let t = {
		...Ay(Ty[e].items),
		__template_key: e,
		id: "",
		display_name: Ty[e].name
	};
	return t.balance_alert = by(t.balance_alert, t), t;
}
function My(e) {
	return (Object.hasOwn(Ty, e?.__template_key) ? Ty[e.__template_key] : null) || (Object.hasOwn(Ty, e?.type) ? Ty[e.type] : null) || Ty.provider_account;
}
function Ny(e) {
	return e?.type === "alibaba_bailian" ? [
		{
			key: "access_key_id",
			label: "RAM AccessKey ID"
		},
		{
			key: "access_key_secret",
			label: "RAM AccessKey Secret"
		},
		{
			key: "security_token",
			label: "STS Security Token（可选）"
		}
	] : e?.type === "grsai" || e?.service_profile === "grsai" && e?.balance_scope === "account" ? [{
		key: "token",
		label: "Grsai 请求令牌 token"
	}] : [{
		key: "api_key",
		label: e?.type === "deepseek" ? "DeepSeek API Key" : e?.type === "meinianda" ? "Meinianda API Key" : "余额查询 API Key"
	}];
}
var Py = {
	timeout_seconds: "账户超时（秒）",
	cache_ttl_seconds: "成功结果缓存（秒）",
	id: "账户 ID",
	display_name: "显示名称",
	aliases: "查询别名",
	enabled: "启用账户",
	type: "供应商",
	base_url: "服务地址",
	path: "接口路径",
	url: "旧版完整 URL",
	method: "请求方法",
	auth_mode: "认证方式",
	auth_name: "认证参数名",
	json_body: "静态 JSON 请求体",
	amount_path: "主余额路径",
	total_path: "总量路径",
	remaining_path: "剩余量路径",
	used_path: "已用量路径",
	unit: "固定单位",
	unit_path: "单位路径",
	kind: "余额类别",
	kind_path: "类别路径",
	status_path: "状态路径",
	status_values: "状态值映射",
	expires_at_path: "到期时间路径",
	expiry_path: "旧版到期路径",
	success_path: "业务成功路径",
	success_value: "业务成功值",
	failure_path: "业务失败路径",
	failure_value: "业务失败值",
	service_profile: "服务类型",
	balance_scope: "积分范围",
	region: "连接区域",
	advanced_options: "显示高级设置"
}, Fy = {
	timeout_seconds: "单账户超时（秒）",
	total_timeout_seconds: "整次查询超时（秒）",
	cache_ttl_seconds: "成功结果缓存（秒）",
	max_concurrency: "最大并发数",
	command_admin_only: "余额查询命令仅管理员",
	private_allowed_user_ids: "私聊白名单",
	allow_group_queries: "允许群聊查询",
	group_allowed_user_ids: "群聊用户白名单"
}, Iy = /* @__PURE__ */ new Set(["__template_key", ...Object.values(Ty).flatMap((e) => Object.keys(e.items).filter((e) => e !== "auth"))]), Ly = new Set(Object.keys(Ty.provider_account.items.endpoint.items)), Ry = new Set(Object.keys(Ty.provider_account.items.response_mapping.items)), zy = /* @__PURE__ */ new Set([
	"auth",
	"api_key",
	"access_key_id",
	"access_key_secret",
	"security_token",
	"token",
	"secret",
	"password",
	"credentials"
]), By = (e) => typeof e == "object" && !!e && !Array.isArray(e) && [Object.prototype, null].includes(Object.getPrototypeOf(e));
function Vy(e, t = 0) {
	if (t > 12) throw Error("invalid_response");
	if (e !== null && typeof e != "boolean" && typeof e != "string" && !(typeof e == "number" && Number.isFinite(e))) {
		if (Array.isArray(e)) {
			e.forEach((e) => Vy(e, t + 1));
			return;
		}
		if (!By(e)) throw Error("invalid_response");
		for (let [n, r] of Object.entries(e)) {
			if (zy.has(n.toLowerCase()) || [
				"__proto__",
				"prototype",
				"constructor"
			].includes(n)) throw Error("invalid_response");
			Vy(r, t + 1);
		}
	}
}
function Hy(e) {
	if (!By(e) || e.providers !== void 0 && !Array.isArray(e.providers) || Array.isArray(e.providers) && e.providers.length > 100 || Object.keys(e).some((e) => e !== "providers" && !Object.hasOwn(Dy, e))) throw Error("invalid_response");
	Vy(e), e = ky({
		...Ay(Dy),
		...e,
		providers: e.providers || []
	});
	for (let t of e.providers) if (By(t) && t.type === void 0 && Ey.includes(t.__template_key) && (t.type = t.__template_key), !By(t) || typeof t.id != "string" || typeof t.type != "string" || Object.keys(t).some((e) => !Iy.has(e)) || t.endpoint && (!By(t.endpoint) || Object.keys(t.endpoint).some((e) => !Ly.has(e))) || t.response_mapping && (!By(t.response_mapping) || Object.keys(t.response_mapping).some((e) => !Ry.has(e)))) throw Error("invalid_response");
	e.balance_alert_targets = my(e.balance_alert_targets), e.balance_alert_admin_qq_ids = py(e.balance_alert_admin_qq_ids), e.balance_alert_llm = xy(e.balance_alert_llm);
	for (let t of e.providers) t.balance_alert = by(t.balance_alert, t);
	return ky(e);
}
function Uy(e) {
	if (!By(e) || !Number.isSafeInteger(e.revision) || e.revision < 0) throw Error("invalid_response");
	let t = Hy(e.config);
	if (!By(e.credentials) || !By(e.encryption) || typeof e.encryption.ready != "boolean" || !By(e.migration) || typeof e.migration.pending != "boolean") throw Error("invalid_response");
	let n = Object.create(null);
	for (let [t, r] of Object.entries(e.credentials)) {
		if (!By(r)) throw Error("invalid_response");
		n[t] = Object.create(null);
		for (let [e, i] of Object.entries(r)) {
			if (![
				"api_key",
				"token",
				"access_key_id",
				"access_key_secret",
				"security_token",
				"secret",
				"key"
			].includes(e) || !By(i) || typeof i.configured != "boolean" || ![
				"encrypted",
				"environment",
				"missing"
			].includes(i.source) || i.configured !== (i.source !== "missing") || Object.keys(i).some((e) => !["configured", "source"].includes(e))) throw Error("invalid_response");
			n[t][e] = {
				configured: i.configured,
				source: i.source
			};
		}
	}
	return {
		revision: e.revision,
		config: t,
		credentials: n,
		encryption: {
			ready: e.encryption.ready,
			state: typeof e.encryption.state == "string" ? e.encryption.state : "unknown",
			reason_code: typeof e.encryption.reason_code == "string" ? e.encryption.reason_code : null
		},
		migration: {
			pending: e.migration.pending,
			account_count: Number.isSafeInteger(e.migration.account_count) ? e.migration.account_count : 0,
			cleanup_pending: e.migration.cleanup_pending === !0,
			legacy_conflict: e.migration.legacy_conflict === !0
		}
	};
}
function Wy(e) {
	if (!By(e) || typeof e.pending != "boolean" || typeof e.plan_id != "string" || !e.plan_id || ![
		"account_count",
		"plaintext_count",
		"environment_count"
	].every((t) => Number.isSafeInteger(e[t]) && e[t] >= 0)) throw Error("invalid_response");
	return {
		plan_id: e.plan_id,
		pending: e.pending,
		cleanup_pending: e.cleanup_pending === !0,
		legacy_conflict: e.legacy_conflict === !0,
		account_count: e.account_count,
		plaintext_count: e.plaintext_count,
		environment_count: e.environment_count
	};
}
function Gy(e) {
	let t = [];
	for (let n of [
		"timeout_seconds",
		"total_timeout_seconds",
		"cache_ttl_seconds",
		"max_concurrency"
	]) (!(typeof e[n] == "number" && Number.isFinite(e[n]) && e[n] > 0) || n === "max_concurrency" && !Number.isInteger(e[n])) && t.push("请填写有效的查询参数。");
	let n = /* @__PURE__ */ new Set();
	for (let r of e.providers) {
		(!r.id?.trim() || n.has(r.id.trim())) && t.push("账户 ID 不能为空或重复。"), n.add(r.id?.trim()), r.display_name?.trim() || t.push("请填写账户显示名称。");
		for (let e of ["timeout_seconds", "cache_ttl_seconds"]) r[e] !== void 0 && !(typeof r[e] == "number" && Number.isFinite(r[e]) && r[e] > 0) && t.push("账户超时和缓存必须为正数。");
	}
	return e.private_allowed_user_ids?.some((e) => !/^\S+:\S+$/.test(e)) && t.push("私聊白名单需使用 平台名:用户ID。"), (e.timeout_seconds > 120 || e.total_timeout_seconds > 300 || e.cache_ttl_seconds > 86400 || e.max_concurrency > 32) && t.push("全局参数超出允许范围。"), e.providers.some((e) => e.timeout_seconds > 120 || e.cache_ttl_seconds > 86400) && t.push("账户超时最多 120 秒，缓存最多 86400 秒。"), [.../* @__PURE__ */ new Set([...t, ...Sy(e)])];
}
//#endregion
//#region src/controller.js
var Ky = /* @__PURE__ */ new Set([
	"isDark",
	"theme",
	"locale",
	"i18n",
	"displayName",
	"pageTitle"
]), qy = /* @__PURE__ */ new Set([
	"read",
	"update",
	"credential-status",
	"credential-replace",
	"credential-clear",
	"legacy-config-plan",
	"legacy-config-execute"
]), Jy = (e) => {
	let t = [
		e?.code,
		e?.error_code,
		e?.message,
		e?.error?.code
	];
	return [e?.status, e?.response?.status].some((e) => e === 401 || e === 403) || t.some((e) => [
		"admin_authorization_denied",
		"page_revoked",
		"asset_revoked",
		"stale_context",
		"unauthorized",
		"forbidden"
	].includes(e)) ? "auth" : [e?.status, e?.response?.status].includes(409) || t.some((e) => [
		"revision_conflict",
		"stale_revision",
		"conflict"
	].includes(e)) ? "conflict" : [e?.status, e?.response?.status].includes(400) || t.some((e) => [
		"validation_error",
		"invalid_config",
		"invalid_request",
		"invalid_credential",
		"invalid_environment",
		"invalid_field",
		"invalid_account"
	].includes(e)) ? "validation" : "unknown";
};
function Yy(e) {
	if (!e || typeof e != "object" || Array.isArray(e) || e.pluginName !== "astrbot_plugin_yomihime_quota_link" || e.pageName !== "00-quota-link") throw Error("invalid_context");
	let t = (e, n = 0) => {
		if (n > 16) throw Error("invalid_context");
		if (e === null || ["string", "boolean"].includes(typeof e) || typeof e == "number" && Number.isFinite(e)) return e;
		if (Array.isArray(e)) return e.map((e) => t(e, n + 1));
		if (e && typeof e == "object" && [Object.prototype, null].includes(Object.getPrototypeOf(e))) return Object.fromEntries(Object.keys(e).sort().map((r) => [r, t(e[r], n + 1)]));
		throw Error("invalid_context");
	};
	return JSON.stringify(t(Object.fromEntries(Object.entries(e).filter(([e]) => !Ky.has(e)))));
}
function Xy(e, t = () => {}) {
	let n = {
		units: null,
		unitsBusy: !1,
		unitsUnknown: !1,
		unitsNotice: "",
		alertStatus: null,
		alertBusy: !1,
		alertNotice: "",
		ready: !1,
		theme: "light",
		locale: "zh-CN",
		snapshot: null,
		draft: null,
		secret: null,
		plan: null,
		busy: !1,
		stale: !0,
		unknown: !1,
		notice: "正在连接宿主管理会话…",
		tone: "neutral",
		edit: 0,
		route: "accounts",
		selected: null
	}, r = 0, i = 0, a = 0, o = 0, s = null, c = !1, l = !1, u, d = null, f = () => t(), p = (e, t = "neutral") => {
		n.notice = e, n.tone = t;
	}, m = () => !!n.snapshot && !!n.draft && JSON.stringify(n.snapshot.config) !== JSON.stringify(n.draft);
	function h() {
		n.snapshot && (n.draft = ky(n.snapshot.config));
	}
	function g() {
		n.secret && (n.secret.value = "", n.secret.environment = ""), n.secret = null;
	}
	function _() {
		r++, i++, n.units = null, n.unitsBusy = !1, n.unitsUnknown = !1, n.unitsNotice = "", n.alertStatus = null, n.alertBusy = !1, n.alertNotice = "", g(), n.plan = null, n.draft = null, n.edit++;
	}
	function v(e) {
		a++, d = null, n.busy = !1, _(), n.snapshot = null, n.ready = !1, n.stale = !0, s = null, p(e, "error"), f();
	}
	let y = (e) => !l && n.ready && e.epoch === a && d === e;
	function b(e) {
		r++, i++, n.alertBusy = !1, n.units = null, n.unitsBusy = !1, n.unitsUnknown = !1, n.unitsNotice = "", n.alertStatus = null, n.alertNotice = "", n.snapshot = e, h(), n.stale = !1, n.unknown = !1, n.plan = null, n.edit++;
	}
	async function x(t, n, r) {
		if (!qy.has(t) || !y(r)) throw Error("stale_context");
		let i = await e.apiPost("admin/" + t, n);
		if (!y(r)) throw Error("stale_context");
		return i;
	}
	async function S(e, t, { write: r = !1, plan: i = !1 } = {}) {
		if (l || !n.ready || n.busy || r && (n.stale || !n.snapshot || n.snapshot.migration.pending && e !== "legacy-config-execute")) return !1;
		let s = {
			epoch: a,
			serial: ++o,
			write: r
		};
		d = s, n.busy = !0, g(), n.plan = null, p(r ? "正在提交，请勿重复操作…" : "正在读取最新状态…"), f();
		try {
			let a = await x(e, t, s);
			if (!y(s)) return !1;
			if (i) n.plan = Wy(a), p(n.plan.legacy_conflict ? "旧配置与当前存储不一致。不会覆盖现有存储或清理新的旧配置。" : n.plan.cleanup_pending ? "迁移已保存，可重试清理原来的宿主旧字段。" : n.plan.pending ? "迁移预览已就绪。执行前请核对下方范围。" : "没有待迁移的旧配置。");
			else {
				let n = Uy(a);
				if (r && (n.revision < t.revision || e !== "legacy-config-execute" && n.revision === t.revision)) throw Error("invalid_response");
				b(n), p(n.migration.cleanup_pending ? "配置已迁移，但宿主旧字段清理尚未完成，请在配置维护中重新预览并完成清理。" : r ? "已保存，当前状态已重新核对。" : "已读取最新配置。", n.migration.cleanup_pending ? "warning" : "success");
			}
			return !0;
		} catch (e) {
			if (!y(s)) return !1;
			let t = Jy(e);
			return g(), t === "auth" ? (v("管理授权已失效。所有草稿已清空，请从 AstrBot 插件管理重新打开。"), !1) : (t === "conflict" ? (n.stale = !0, n.unknown = !1, p("配置已被其他页面修改。请重新读取，再核对并提交；不会自动重试。", "warning")) : t === "validation" ? p("提交未通过校验。请检查字段和凭据类型；敏感输入已清空。", "error") : (n.stale = !0, n.unknown = r, p(r ? "提交结果尚未确认，敏感输入已清空。请重新读取状态后再决定，切勿直接重复提交。" : "无法读取可信的配置状态。请重新读取，或从宿主重新打开。", "warning")), !1);
		} finally {
			y(s) && (n.busy = !1, d = null, f());
		}
	}
	async function C() {
		return !n.ready || n.busy ? !1 : (g(), S("read", {}));
	}
	async function w() {
		if (l || !n.ready || n.busy || n.alertBusy) return !1;
		let t = {
			epoch: a,
			revision: n.snapshot?.revision,
			serial: ++i
		};
		n.alertBusy = !0, n.alertNotice = "正在读取预警运行状态…", f();
		let r = () => !l && n.ready && t.epoch === a && t.revision === n.snapshot?.revision && t.serial === i;
		try {
			let t = await e.apiPost("admin/alert-status", {});
			return r() ? (n.alertStatus = Cy(t), n.alertNotice = "", !0) : !1;
		} catch (e) {
			return r() ? Jy(e) === "auth" ? (v("管理授权已失效。所有草稿已清空，请从 AstrBot 插件管理重新打开。"), !1) : (n.alertStatus = null, n.alertNotice = "无法读取可信的预警运行状态，请稍后重试。", !1) : !1;
		} finally {
			r() && (n.alertBusy = !1, f());
		}
	}
	async function T() {
		if (l || !n.ready || !n.snapshot || n.busy || n.unitsBusy) return !1;
		let t = {
			epoch: a,
			revision: n.snapshot.revision,
			serial: ++r,
			selected: n.selected
		};
		n.unitsBusy = !0, n.unitsNotice = "", f();
		let i = () => !l && n.ready && t.epoch === a && t.serial === r && t.revision === n.snapshot?.revision && t.selected === n.selected;
		try {
			let t = await e.apiPost("admin/alert-units", {});
			return i() ? (n.units = dy(t), n.unitsUnknown = !1, !0) : !1;
		} catch (e) {
			return i() ? (n.units = null, Jy(e) === "auth" ? v("管理授权已失效，请重新打开。") : n.unitsNotice = "单位获取失败，请刷新。", !1) : !1;
		} finally {
			i() && (n.unitsBusy = !1, f());
		}
	}
	async function E(t) {
		if (l || !n.ready || n.stale || n.busy || n.unitsBusy || !n.snapshot || m() || n.secret || n.snapshot.migration.pending || n.route !== "accounts" || n.selected !== t || !n.snapshot.config.providers.some((e) => e.id === t)) return !1;
		let i = {
			epoch: a,
			serial: ++o,
			write: !1
		};
		d = i, r++, n.busy = !0, n.unitsBusy = !0, n.unitsNotice = "正在查询余额以获取最新单位…", f();
		try {
			let r = await e.apiPost("admin/alert-refresh-units", {
				revision: n.snapshot.revision,
				account_id: t
			});
			if (!y(i)) return !1;
			n.units = dy(r), n.unitsUnknown = !1;
			let a = n.units.accounts.find((e) => e.account_id === t);
			return n.unitsNotice = a?.unit_state === "verified" ? "已读取最新单位状态，已确认的单位仍有效。" : a?.choices.length ? "已获取最新候选，请核对后确认。" : "暂未取得可确认候选，请检查凭据、接口配置或查询退避状态后再查询。", !0;
		} catch (e) {
			if (!y(i)) return !1;
			n.units = null;
			let t = Jy(e);
			return t === "auth" ? v("管理授权已失效，请重新打开。") : t === "conflict" ? (n.stale = !0, n.unitsNotice = "配置已改变，请重新读取。", p("配置已改变，请重新读取。", "warning")) : n.unitsNotice = "未取得可信的新候选。请检查凭据、接口与查询状态后重新查询。", !1;
		} finally {
			y(i) && (n.busy = !1, n.unitsBusy = !1, d = null, f());
		}
	}
	async function D(t, i) {
		if (l || !n.ready || n.stale || n.busy || n.unitsBusy || n.unitsUnknown || !n.snapshot || m() || n.route !== "accounts" || n.selected !== t) return !1;
		let s = n.snapshot.config.providers.find((e) => e.id === t), c = n.units?.accounts.find((e) => e.account_id === t), u = c?.choices.find((e) => e.id === i && e.metric === s?.balance_alert?.metric);
		if (!c || c.choices_state && c.choices_state !== "fresh" || !(["ambiguous", "changed"].includes(c.unit_state) || c.unit_state === "unidentified" && c.choices.filter((e) => e.metric === s?.balance_alert?.metric).length === 1) || !u || n.snapshot.migration.pending) return !1;
		let h = {
			epoch: a,
			serial: ++o,
			write: !0
		};
		d = h, r++, n.busy = !0, n.unitsBusy = !0, n.unitsNotice = "", g(), f();
		try {
			let r = await e.apiPost("admin/alert-bind-unit", {
				revision: n.snapshot.revision,
				account_id: t,
				choice_id: u.id
			});
			return y(h) ? (n.units = dy(r), n.unitsUnknown = !1, n.unitsNotice = "单位已确认。", !0) : !1;
		} catch (e) {
			if (!y(h)) return !1;
			n.units = null;
			let t = Jy(e);
			return t === "auth" ? (v("管理授权已失效，请重新打开。"), !1) : (t === "conflict" ? (n.stale = !0, n.unitsNotice = "配置已改变，请重新读取。", p("配置已改变，请重新读取。", "warning")) : t === "validation" ? n.unitsNotice = "候选已变化或过期，请重新查询后确认。" : (n.unitsUnknown = !0, n.unitsNotice = "确认结果未知，请刷新单位后再操作。"), !1);
		} finally {
			y(h) && (n.busy = !1, n.unitsBusy = !1, d = null, f());
		}
	}
	function O(e) {
		if (l) return;
		c = !0, n.theme = e?.isDark === !0 || e?.theme === "dark" ? "dark" : "light", n.locale = typeof e?.locale == "string" ? e.locale : "zh-CN";
		let t;
		try {
			t = Yy(e);
		} catch {
			v("宿主管理上下文无效。请从 AstrBot 插件管理打开此页。");
			return;
		}
		if (n.ready && t === s) {
			f();
			return;
		}
		a++, d = null, n.busy = !1, _(), n.snapshot = null, n.stale = !0, n.unknown = !1, n.ready = !0, s = t, f(), C();
	}
	function ee(e) {
		n.ready && !n.stale && !n.busy && n.draft && (e(n.draft), n.edit++, n.plan = null, f());
	}
	function te(e, t = null) {
		let o = d?.write;
		a++, r++, i++, n.units = null, n.unitsBusy = !1, n.unitsNotice = "", n.alertBusy = !1, d = null, n.busy = !1, g(), n.plan = null, n.edit++, n.route = e, n.selected = t, h(), o && (n.stale = !0, n.unknown = !0, p("已离开原设置。已发出的请求无法撤回，请重新读取确认结果。", "warning")), f();
	}
	async function ne() {
		if (!n.draft) return !1;
		let e = Gy(n.draft);
		return e.length ? (p(e.join(" "), "error"), f(), !1) : S("update", {
			revision: n.snapshot?.revision,
			config: ky(n.draft)
		}, { write: !0 });
	}
	function re(e, t, r = "value") {
		!n.stale && !n.busy && n.ready && n.snapshot && (g(), n.secret = {
			account: e,
			field: t,
			mode: r,
			value: "",
			environment: ""
		}, n.edit++, f());
	}
	function ie(e, t) {
		n.secret && !n.busy && (n.secret[e] = t, n.edit++, f());
	}
	async function ae() {
		let e = n.secret;
		if (!e || m()) return !1;
		let t = e.mode === "environment" ? e.environment : e.value;
		return !t.trim() || e.mode === "environment" && !/^[A-Za-z_][A-Za-z0-9_]*$/.test(t) ? (p(e.mode === "environment" ? "请输入有效的环境变量名，不要填写变量的值。" : "请输入新凭据；留空不会执行清除。", "error"), f(), !1) : S("credential-replace", {
			revision: n.snapshot.revision,
			account_id: e.account,
			field: e.field,
			...e.mode === "environment" ? { environment: t } : { value: t }
		}, { write: !0 });
	}
	async function oe(e, t) {
		return !m() && S("credential-clear", {
			revision: n.snapshot?.revision,
			account_id: e,
			field: t
		}, { write: !0 });
	}
	function se() {
		g(), n.edit++, f();
	}
	function ce() {
		g(), n.plan = null, h(), n.edit++, p("未保存的草稿已丢弃。"), f();
	}
	function le() {
		l || (l = !0, a++, d = null, n.busy = !1, _(), n.snapshot = null, n.ready = !1, u?.(), f());
	}
	function ue() {
		if (!e || typeof e.apiPost != "function" || typeof e.ready != "function" || typeof e.onContext != "function") {
			p("请从 AstrBot 插件管理页面打开此页。", "warning"), f();
			return;
		}
		u = e.onContext(O), Promise.resolve(e.ready()).then((e) => {
			c || O(e);
		}).catch(() => {
			!c && !l && v("宿主管理会话不可用，请重新打开此页。");
		});
	}
	return {
		state: n,
		start: ue,
		accept: O,
		close: le,
		refresh: C,
		refreshUnits: T,
		queryUnits: E,
		bindUnit: D,
		refreshAlerts: w,
		save: ne,
		dirty: m,
		edit: ee,
		navigate: te,
		beginSecret: re,
		changeSecret: ie,
		replace: ae,
		clear: oe,
		cancelSecret: se,
		discard: ce,
		interactionKey: () => JSON.stringify([
			a,
			n.edit,
			n.route,
			n.selected,
			n.snapshot?.revision,
			n.busy,
			n.ready,
			n.stale,
			r
		]),
		plan: () => S("legacy-config-plan", {}, { plan: !0 }),
		migrate: () => (n.plan?.pending || n.plan?.cleanup_pending) && !n.plan?.legacy_conflict && !m() ? S("legacy-config-execute", {
			revision: n.snapshot?.revision,
			plan_id: n.plan.plan_id,
			confirm: !0
		}, { write: !0 }) : Promise.resolve(!1)
	};
}
var Zy = Po(/* @__PURE__ */ P({ setup() {
	let e = /* @__PURE__ */ N(0), t = /* @__PURE__ */ N(null), n = /* @__PURE__ */ N(null), r = /* @__PURE__ */ N("deepseek"), i = /* @__PURE__ */ N({}), a = /* @__PURE__ */ N({}), o = /* @__PURE__ */ N({}), s = Yv(document), c = /* @__PURE__ */ N(Object.create(null)), l, u, d = Xy(window.AstrBotPluginView, () => {
		l !== d.state.draft && (i.value = {}, a.value = {}, o.value = {}, l = d.state.draft), u !== d.state.units && (c.value = Object.create(null), u = d.state.units), s.invalidate(), e.value++;
	}), f = d.state, p = (e, t = {}) => R(lg, {
		size: "large",
		...t
	}, () => e), m = () => !f.ready || f.busy || f.stale || !!f.snapshot?.migration.pending, h = () => m() || d.dirty() || !f.snapshot?.encryption.ready, g = async (e, t, n, r, i) => {
		let a = d.interactionKey();
		await s.ask({
			kind: e,
			title: t,
			message: n,
			confirmLabel: r,
			isCurrent: () => a === d.interactionKey() && f.ready
		}) && await i();
	}, _ = async (e, t = null) => {
		let n = () => {
			d.navigate(e, t), e === "accounts" && t && f.snapshot?.config.providers.some((e) => e.id === t) && d.refreshUnits();
		};
		d.dirty() || f.secret || f.busy ? await g("navigation", "离开当前设置？", "未保存的设置和凭据输入将清空。已发出的请求无法撤回，结果不明时需重新读取，不会自动重试。", "放弃草稿并离开", n) : n();
	}, v = async () => {
		let e = async () => {
			await d.refresh() && f.route === "accounts" && f.selected && await d.refreshUnits();
		};
		d.dirty() || f.secret ? await g("navigation", "重新读取配置？", "这会清空当前未保存的设置和凭据输入。", "丢弃草稿并读取", e) : await e();
	}, y = (e) => R("svg", {
		class: "shell-icon",
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		"stroke-width": 1.5,
		"aria-hidden": "true"
	}, e === "account" ? [R("rect", {
		x: 3,
		y: 5,
		width: 18,
		height: 14,
		rx: 2
	}), R("path", { d: "M3 10h18M7 15h4" })] : e === "settings" ? [R("circle", {
		cx: 12,
		cy: 12,
		r: 4
	}), R("path", { d: "M12 2v3m0 14v3M2 12h3m14 0h3M5 5l2 2m10 10 2 2M5 19l2-2M17 7l2-2" })] : [R("path", { d: "M4 12a8 8 0 1 1 2 6M4 12V5m0 7h7" })]), b = (e, t, n) => R("a", {
		href: "#/" + t,
		"aria-current": f.route === t ? "page" : void 0,
		onClick: (e) => {
			e.preventDefault(), _(t);
		}
	}, [y(n), R("span", e)]), x = () => R("div", { class: "shell-brand" }, [R("span", {
		class: "shell-brand-mark",
		"aria-hidden": "true"
	}, "✧"), R("span", [R("span", { class: "shell-brand-line" }, "如月怜的"), R("span", { class: "shell-brand-line" }, "额度连结")])]), S = (e, t) => t.reduce((e, t) => e?.[t], e), C = (e, t, n) => d.edit((r) => {
		let i = n === null ? r : r.providers[n];
		for (let t of e.slice(0, -1)) (!i[t] || typeof i[t] != "object") && (i[t] = {}), i = i[t];
		i[e.at(-1)] = t, n !== null && e.length === 1 && e[0] === "id" && (f.selected = String(t));
	}), w = async (e, t) => {
		let n = f.draft?.providers[e];
		if (!n || t === n.service_profile) return;
		let r = n.balance_alert, i = r?.threshold !== null && r?.threshold !== void 0 || r?.recovery_threshold !== null && r?.recovery_threshold !== void 0 || r?.enabled, a = () => d.edit((n) => {
			let r = n.providers[e];
			r.service_profile = t, r.balance_alert = {
				...r.balance_alert,
				enabled: !1,
				metric: ty(r),
				threshold: null,
				recovery_threshold: null
			};
		});
		i ? await g("maintenance", "更换服务类型并重设预警？", "将清空阈值并关闭预警，单位会重新识别。", "更换并清空阈值", a) : a();
	};
	function T(e, t, n, r = [e], o = {}) {
		let s = n === null ? f.draft : f.draft?.providers[n];
		if (!s) return null;
		let c = "field-" + (n === null ? "global" : n) + "-" + r.join("-"), l = S(s, r) ?? t.default ?? "", u = (n === null ? Fy : Py)[e] || t.description, d = o.locked || m(), p = (t) => {
			if (delete a.value[c], n !== null && r.length === 1 && e === "service_profile") {
				w(n, String(t));
				return;
			}
			C(r, t, n);
		}, h;
		return h = t.type === "bool" ? (e) => R("label", { class: "ui-check-label" }, [R("input", {
			...e,
			type: "checkbox",
			checked: !!l,
			disabled: d,
			onChange: (e) => p(e.target.checked)
		}), R("span", l ? "已开启" : "已关闭")]) : t.options ? (e) => R("select", {
			...e,
			class: "ui-control",
			value: l,
			disabled: d,
			onChange: (e) => p(e.target.value)
		}, [t.options.includes(l) ? [] : [R("option", { value: l }, l || "请选择")], ...t.options.map((e, n) => R("option", { value: e }, t.labels?.[n] || e))]) : t.type === "list" ? (e) => R("textarea", {
			...e,
			class: "ui-control",
			rows: 3,
			value: i.value[c] ?? (Array.isArray(l) ? l.join("\n") : ""),
			disabled: d,
			placeholder: "每行一项",
			onInput: (e) => {
				let t = e.target.value;
				i.value[c] = t, p(t.split("\n").map((e) => e.trim()).filter(Boolean));
			}
		}) : t.type === "dict" ? (e) => R("textarea", {
			...e,
			class: "ui-control quota-json",
			rows: 4,
			value: i.value[c] ?? JSON.stringify(l || {}, null, 2),
			disabled: d,
			spellcheck: !1,
			onInput: (e) => {
				let t = e.target.value;
				i.value[c] = t;
				try {
					let e = JSON.parse(t || "{}");
					if (!e || typeof e != "object" || Array.isArray(e)) throw Error();
					p(e);
				} catch {
					a.value[c] = "请输入有效的 JSON 对象，不要填写凭据。";
				}
			}
		}) : (n) => R("input", {
			...n,
			class: "ui-control",
			type: ["float", "int"].includes(t.type) ? "number" : "text",
			min: t.type === "int" ? 1 : t.type === "float" ? .001 : void 0,
			max: e === "max_concurrency" ? 32 : e === "total_timeout_seconds" ? 300 : e === "timeout_seconds" ? 120 : e === "cache_ttl_seconds" ? 86400 : void 0,
			step: t.type === "int" ? 1 : t.type === "float" ? "any" : void 0,
			value: l,
			disabled: d,
			autocomplete: "off",
			onInput: (e) => {
				let n = e.target.value;
				p(["float", "int"].includes(t.type) ? n === "" ? "" : Number(n) : n);
			}
		}), R(qv, {
			key: c,
			controlId: c,
			label: u,
			hint: o.hint ?? t.hint,
			error: a.value[c],
			class: t.type === "list" || t.type === "dict" ? "ui-field-wide" : void 0
		}, { default: ({ controlAttrs: e }) => h(e) });
	}
	let E = (e) => f.snapshot?.config.providers.find((t) => t.id === e), D = () => R(Gv, {}, () => [
		p("保存设置", {
			type: "primary",
			"data-action": "save",
			disabled: m() || !d.dirty() || Object.keys(a.value).length > 0,
			onClick: async () => {
				await d.save() && f.route === "accounts" && f.selected && await d.refreshUnits();
			}
		}),
		p("放弃修改", {
			disabled: m() || !d.dirty(),
			onClick: () => d.discard()
		}),
		d.dirty() ? R("span", { class: "dirty-indicator" }, "有未保存修改") : R("span", { class: "quota-muted" }, "普通设置与凭据分别保存")
	]), O = (e) => R(Hv, {
		title: "查询凭据",
		eyebrow: "SOURCE ACCESS"
	}, { default: () => [
		R(Kv, {}, () => "凭据单独保存。"),
		E(e.id) ? null : R(Kv, { tone: "warning" }, () => "请先保存新账户，再配置凭据。"),
		d.dirty() ? R(Kv, { tone: "warning" }, () => "请先保存或放弃普通设置修改，再操作凭据。") : null,
		...[...Ny(e), ...Object.entries(f.snapshot?.credentials[e.id] || {}).filter(([t, n]) => n.configured && !Ny(e).some((e) => e.key === t)).map(([e]) => ({
			key: e,
			label: "旧版凭据（" + e + "）"
		}))].map(({ key: t, label: n }) => {
			let r = f.snapshot?.credentials[e.id]?.[t], i = f.secret?.account === e.id && f.secret?.field === t;
			return R("section", {
				class: "quota-credential",
				key: t
			}, [
				R("h3", n),
				R("p", {
					class: "ui-badge",
					"data-testid": "credential-status"
				}, r ? r.configured ? r.source === "environment" ? "已配置 · 环境变量引用" : "已配置 · 加密存储" : "未配置" : "状态未读取"),
				r?.configured ? R(Kv, {}, () => "凭据已保存，将在余额查询时验证有效性。") : null,
				i ? R("form", {
					autocomplete: "off",
					onSubmit: (e) => {
						e.preventDefault(), d.replace();
					}
				}, [
					R("div", {
						class: "ui-segmented",
						"aria-label": "新凭据来源"
					}, [p("输入新凭据", {
						"aria-pressed": f.secret?.mode === "value",
						disabled: f.busy,
						onClick: () => d.beginSecret(e.id, t, "value")
					}), p("引用环境变量", {
						"aria-pressed": f.secret?.mode === "environment",
						disabled: f.busy,
						onClick: () => d.beginSecret(e.id, t, "environment")
					})]),
					R(qv, {
						controlId: "credential-new-value",
						label: f.secret?.mode === "environment" ? "环境变量名" : "新凭据",
						hint: f.secret?.mode === "environment" ? "仅填写环境变量名，例如 QUOTA_API_KEY；凭据值由运行环境提供。" : "空值不会清除已有凭据。提交后立即清空输入。"
					}, { default: ({ controlAttrs: e }) => R("input", {
						...e,
						class: "ui-control",
						type: f.secret?.mode === "environment" ? "text" : "password",
						value: f.secret?.mode === "environment" ? f.secret?.environment : f.secret?.value,
						autocomplete: "new-password",
						spellcheck: !1,
						autocapitalize: "none",
						maxlength: 8192,
						disabled: h(),
						onInput: (e) => d.changeSecret(f.secret?.mode === "environment" ? "environment" : "value", e.target.value)
					}) }),
					R(Gv, {}, () => [p("保存新凭据", {
						type: "primary",
						attrType: "submit",
						"data-action": "credential-save",
						disabled: h()
					}), p("取消输入", {
						disabled: f.busy,
						onClick: () => d.cancelSecret()
					})])
				]) : R(Gv, {}, () => [p("更换凭据", {
					"data-action": "credential-replace",
					disabled: h() || !E(e.id),
					onClick: () => d.beginSecret(e.id, t)
				}), p("清除凭据", {
					"data-action": "credential-clear",
					disabled: m() || d.dirty() || !r?.configured,
					onClick: () => void g("credential-clear", "清除 " + n + "？", "将移除账户「" + e.display_name + "」的此项凭据或引用。账户设置保留；之后需重新配置才能查询。", "确认清除", () => d.clear(e.id, t))
				})])
			]);
		}),
		R("p", { class: "quota-muted" }, "")
	] }), ee = {
		unit_unidentified: "等待识别单位",
		units_ambiguous: "多个单位待确认",
		unit_changed: "监测项或单位已变化，请确认",
		waiting_budget: "等待同一推送目标的发送间隔（至少 300 秒 / 5 分钟）；将在后续有效检查中重试",
		disabled: "预警已关闭",
		waiting: "等待下次检查",
		monitoring: "余额监测中",
		recovering: "额度已回升，尚未达到恢复阈值",
		submitted: "已提交平台；不代表最终送达",
		storage_unavailable: "告警状态存储不可用，预警未运行",
		ready: "等待下次检查",
		normal: "余额在阈值以上",
		low: "低于或等于阈值，当前告警持续中",
		recovered: "余额已恢复",
		pending: "等待检查",
		pending_send: "等待合并提醒",
		sent: "发送请求已受理（不代表送达）",
		accepted: "发送请求已受理（不代表送达）",
		unknown: "发送结果未知；不会盲目重试",
		send_unknown: "发送结果未知；不会盲目重试",
		failed: "发送失败",
		send_failed: "发送失败",
		paused: "认证或权限校验失败；修正配置或手动重试后恢复检查",
		auth_paused: "凭据被拒绝，检查已暂停",
		blocked: "预警发送已暂停，请检查下方原因",
		incomplete: "配置不完整，未启动",
		error: "检查失败，保留上次告警状态",
		stale: "结果过期或指标、单位不匹配，不用于预警判断"
	}, te = (e) => {
		let t = f.alertStatus, n = e ? t?.accounts.find((t) => t.account_id === e) : null;
		return R("div", { class: "quota-alert-runtime" }, [
			R("div", { class: "quota-alert-runtime-heading" }, [R("strong", "运行状态"), p(f.alertBusy ? "读取中…" : "刷新预警状态", {
				text: !0,
				"data-action": "alert-status",
				disabled: !f.ready || f.busy || f.alertBusy,
				onClick: () => void d.refreshAlerts()
			})]),
			f.alertNotice ? R("p", { class: "quota-muted" }, f.alertNotice) : null,
			t ? R(Kv, { tone: !t.storage_available || n?.status === "storage_unavailable" || n?.status === "failed" ? "error" : !t.running || n && [
				"low",
				"recovering",
				"unknown",
				"error",
				"stale",
				"blocked",
				"paused",
				"units_ambiguous",
				"unit_changed",
				"waiting_budget"
			].includes(n.status) ? "warning" : "neutral" }, () => t.storage_available ? t.running ? e ? n ? ee[n.status] || "状态已更新，请通过预警命令查看详情。" : "此账户尚无运行记录。" : "检查任务已运行；仅配置完整且单独开启的账户参与。" : "检查任务未运行。" : "告警状态存储不可用，预警未运行。") : null,
			n?.detail_code || n?.status === "blocked" ? R(Kv, { tone: "warning" }, () => ly(n?.detail_code)) : null,
			n?.last_checked_at ? R("p", { class: "quota-muted" }, ["最近检查：", R("time", { datetime: n.last_checked_at }, sy(n.last_checked_at, f.locale))]) : null,
			n?.last_sent_at ? R("p", { class: "quota-muted" }, ["最近发送尝试：", R("time", { datetime: n.last_sent_at }, sy(n.last_sent_at, f.locale))]) : null
		]);
	}, ne = (e, t) => {
		let n = E(e.id), r = !!n && [
			"type",
			"service_profile",
			"balance_scope",
			"prefer_split_endpoint",
			"response_mapping",
			"endpoint",
			"region"
		].every((t) => JSON.stringify(e[t]) === JSON.stringify(n[t])) && e.balance_alert?.metric === n.balance_alert?.metric, i = r ? f.units?.accounts.find((t) => t.account_id === e.id) : void 0, a = i?.choices.filter((t) => t.metric === (e.balance_alert?.metric || ty(e))) || [], o = !!i && (["ambiguous", "changed"].includes(i.unit_state) || i.unit_state === "unidentified" && a.length === 1), l = i?.unit || uy(e), u = c.value[e.id] || "", h = a.find((e) => e.id === u), _ = i?.unit_state === "ambiguous" ? "发现多个单位，请选择。" : i?.unit_state === "changed" ? i.change_reason === "metric_changed" ? "监测项已变化：" + oy(i.binding_metric) + " → " + oy(i.metric) + "。请重新确认单位和阈值。" : i.change_reason === "query_identity_changed" ? "查询账户或接口已变化，请重新确认单位和阈值。" : i.change_reason === "unit_changed" ? "查询单位已变化，请重新确认。" : "监测项或单位已变化，请重新确认。" : i?.unit_state === "stale" ? "查询候选已过期，请重新查询。已确认的单位记录仍保留。" : null, v = m() || f.unitsBusy || !n || !r || d.dirty() || !!f.secret;
		return R("section", {
			class: "quota-alert-unit",
			"aria-label": "预警单位"
		}, [
			R("div", { class: "quota-alert-runtime-heading" }, [R("strong", { "data-testid": "alert-unit" }, "单位：" + (l ? ay(l) : "待获取")), p(f.unitsBusy ? "处理中…" : "读取单位状态", {
				text: !0,
				"data-action": "alert-units",
				disabled: !f.ready || f.busy || f.unitsBusy || !n,
				onClick: () => void d.refreshUnits()
			})]),
			i?.unit_state === "verified" ? R("p", { class: "quota-muted" }, i.choices_state === "expired" ? "单位已验证。查询候选已过期，已确认的单位仍有效。" : "单位已验证。") : null,
			!l && !_ ? R("p", { class: "quota-muted" }, r ? o ? "请确认查询到的单位。" : "查询余额后自动识别。" : n ? "保存设置后重新识别。" : "保存账户后自动识别。") : null,
			n && !r ? R("p", { class: "quota-muted" }, e.balance_alert?.metric === n.balance_alert?.metric ? "查询配置已修改，保存后重新识别单位。" : "监测项已改为“" + oy(e.balance_alert?.metric) + "”，保存后重新查询并确认。") : null,
			i?.observed_at ? R("p", { class: "quota-muted" }, ["单位记录：", R("time", { datetime: i.observed_at }, sy(i.observed_at, f.locale))]) : null,
			_ ? R(Kv, { tone: "warning" }, () => _) : null,
			o && !a.length ? R("p", { class: "quota-muted" }, i?.choices_state === "expired" ? "可确认候选已过期，重新查询后再选择。" : "当前没有可确认候选，重新查询后再选择。") : null,
			f.unitsNotice ? R(Kv, { tone: f.unitsUnknown ? "warning" : "neutral" }, () => f.unitsNotice) : null,
			o && a.length ? R(qv, {
				controlId: "field-" + t + "-unit-choice",
				label: "选择单位",
				hint: d.dirty() ? "请先保存设置。" : void 0
			}, { default: ({ controlAttrs: t }) => R("div", { class: "quota-unit-choice" }, [R("select", {
				...t,
				class: "ui-control",
				value: u,
				disabled: m() || f.unitsBusy || d.dirty() || f.unitsUnknown,
				onChange: (t) => {
					s.cancel(), c.value[e.id] = t.target.value;
				}
			}, [R("option", { value: "" }, "请选择"), ...a.map((e) => R("option", { value: e.id }, ay(e.unit)))]), p("确认单位", {
				"data-action": "alert-bind-unit",
				disabled: m() || f.unitsBusy || f.unitsUnknown || d.dirty() || !h,
				onClick: () => void g("maintenance", "确认单位 " + ay(h?.unit) + "？", e.balance_alert?.threshold !== null && e.balance_alert?.threshold !== void 0 ? "改用 " + ay(h?.unit) + "，按阈值 " + e.balance_alert.threshold + " 比较？" : "改用 " + ay(h?.unit) + "？阈值尚未设置。", "确认单位", () => d.bindUnit(e.id, u))
			})]) }) : null,
			n ? R("div", { class: "quota-unit-query" }, [p("重新查询单位", {
				"data-action": "alert-refresh-units",
				disabled: v,
				onClick: () => void d.queryUnits(e.id)
			}), R("p", { class: "quota-muted" }, d.dirty() ? "保存设置后可重新查询单位。" : f.secret ? "完成或取消凭据输入后可重新查询。" : "请求此账户的余额接口，获取新候选；不发送预警。")]) : null
		]);
	}, re = (e, t) => {
		let n = {
			...$v(),
			...e.balance_alert
		}, r = "field-" + t + "-balance_alert-", i = m(), s = (e, n) => C(["balance_alert", e], n, t), c = (t, o, c, l = "") => R(qv, {
			controlId: r + t,
			label: o,
			hint: c,
			error: a.value[r + t]
		}, { default: ({ controlAttrs: o }) => R("input", {
			...o,
			class: "ui-control",
			type: "text",
			inputmode: t.includes("threshold") ? "decimal" : void 0,
			value: n[t] ?? "",
			placeholder: l,
			disabled: i,
			autocomplete: "off",
			spellcheck: !1,
			onInput: (i) => {
				let o = i.target.value;
				s(t, t.includes("threshold") && o === "" ? null : o);
				for (let e of ["threshold", "recovery_threshold"]) delete a.value[r + e];
				try {
					by({
						...n,
						[t]: t.includes("threshold") && o === "" ? null : o
					}, e);
				} catch (e) {
					a.value[r + t] = e.message;
				}
			}
		}) }), l = n.check_interval_minutes, u = Number.isInteger(l) && l >= 1 && l <= 4320;
		u && (o.value[r] = l);
		let d = u ? l : o.value[r] ?? 15, h = (e) => {
			let t = /^[0-9]+$/.test(e) ? Number(e) : NaN;
			Number.isInteger(t) && t >= 1 && t <= 4320 ? (s("check_interval_minutes", t), delete a.value[r + "check_interval_minutes"]) : (s("check_interval_minutes", e), a.value[r + "check_interval_minutes"] = "请输入 1 至 4320 的整数分钟；不会自动截断或夹值。");
		}, g = Sy({
			...f.draft,
			providers: [e]
		});
		return R(Wv, {
			title: "额度预警",
			number: "03"
		}, { default: () => [
			R(qv, {
				controlId: r + "enabled",
				label: "启用此账户预警",
				hint: "保存后生效。"
			}, { default: ({ controlAttrs: e }) => R("label", { class: "ui-check-label" }, [R("input", {
				...e,
				type: "checkbox",
				checked: n.enabled === !0,
				disabled: i,
				onChange: (e) => s("enabled", e.target.checked)
			}), R("span", n.enabled ? "已开启" : "已关闭")]) }),
			g.length ? R(Kv, { tone: "warning" }, () => g.join(" ")) : null,
			R(qv, {
				controlId: r + "check_interval_minutes",
				label: "检查间隔（分钟）",
				hint: "1–4320 分钟，默认 15。",
				error: a.value[r + "check_interval_minutes"]
			}, { default: ({ controlAttrs: e }) => R("div", { class: "quota-alert-interval" }, [R("div", { class: "quota-alert-interval-controls" }, [
				R("input", {
					type: "range",
					id: r + "interval-slider",
					"aria-label": "检查间隔滑条（分钟）",
					min: 1,
					max: 4320,
					step: 1,
					value: d,
					disabled: i,
					onInput: (e) => h(e.target.value)
				}),
				R("input", {
					...e,
					class: "ui-control",
					type: "number",
					min: 1,
					max: 4320,
					step: 1,
					value: l,
					disabled: i,
					onInput: (e) => h(e.target.value)
				}),
				R("span", "分钟")
			]), R("div", {
				class: "quota-alert-quick-values",
				role: "group",
				"aria-label": "检查间隔快捷设置"
			}, [R("span", { class: "quota-muted" }, "快捷设置："), ...[
				1,
				15,
				60,
				1440,
				4320
			].map((e) => p(e >= 1440 ? `${e / 1440} 天` : `${e} 分钟`, {
				size: "small",
				"aria-label": `设为 ${e} 分钟`,
				"aria-pressed": l === e,
				disabled: i,
				onClick: () => h(String(e))
			}))])]) }),
			R(Jv, {}, () => [
				R(qv, {
					controlId: r + "metric",
					label: "预警指标",
					hint: "选择需要监测的余额。"
				}, { default: ({ controlAttrs: t }) => R("select", {
					...t,
					class: "ui-control",
					value: n.metric || ty(e),
					disabled: i,
					onChange: (e) => s("metric", e.target.value)
				}, ny(e).map((e) => R("option", { value: e }, oy(e)))) }),
				ne(e, t),
				c("threshold", "触发阈值", "余额低于或等于此值时提醒。", "填写触发阈值"),
				c("recovery_threshold", "恢复阈值（可选）", "留空自动设置，须高于触发阈值。", "留空自动设置"),
				R(qv, {
					controlId: r + "repeat_minutes",
					label: "持续低额重复提醒（分钟）",
					hint: "0 不重复，最多 4320 分钟。",
					error: a.value[r + "repeat_minutes"]
				}, { default: ({ controlAttrs: e }) => R("input", {
					...e,
					class: "ui-control",
					type: "number",
					min: 0,
					max: 4320,
					step: 1,
					value: n.repeat_minutes,
					disabled: i,
					onInput: (e) => {
						let t = e.target.value, n = /^[0-9]+$/.test(t) ? Number(t) : NaN;
						s("repeat_minutes", Number.isInteger(n) ? n : t), !Number.isInteger(n) || n < 0 || n > 4320 ? a.value[r + "repeat_minutes"] = "请输入 0 至 4320 的整数分钟。" : delete a.value[r + "repeat_minutes"];
					}
				}) })
			]),
			te(e.id)
		] });
	}, ie = () => R(Wv, {
		title: "额度预警推送目标",
		number: "03"
	}, { default: () => [R(qv, {
		controlId: "field-global-balance_alert_targets",
		label: "目标 UMO（每行一个）",
		hint: "每行一个 UMO，群聊可追加 @QQ号。",
		error: a.value["field-global-balance_alert_targets"]
	}, { default: ({ controlAttrs: e }) => R("textarea", {
		...e,
		class: "ui-control quota-targets",
		rows: 5,
		spellcheck: !1,
		autocomplete: "off",
		value: i.value["field-global-balance_alert_targets"] ?? gy(f.draft?.balance_alert_targets),
		placeholder: "Synthetic-QQ:FriendMessage:10001\nSynthetic-QQ:GroupMessage:10002 @10003 @10004",
		disabled: m(),
		onInput: (e) => {
			let t = e.target.value;
			i.value["field-global-balance_alert_targets"] = t;
			try {
				C(["balance_alert_targets"], hy(t), null), delete a.value["field-global-balance_alert_targets"];
			} catch (e) {
				C(["balance_alert_targets"], t, null), a.value["field-global-balance_alert_targets"] = e.message;
			}
		}
	}) }), te()] }), ae = () => R(Wv, {
		title: "预警管理权限",
		number: "04"
	}, { default: () => [R(qv, {
		controlId: "field-global-balance_alert_admin_qq_ids",
		label: "预警管理 QQ 白名单",
		hint: "每行一个 QQ 号；名单成员或 AstrBot 管理员可管理预警。",
		error: a.value["field-global-balance_alert_admin_qq_ids"]
	}, { default: ({ controlAttrs: e }) => R("textarea", {
		...e,
		class: "ui-control",
		rows: 3,
		value: i.value["field-global-balance_alert_admin_qq_ids"] ?? (Array.isArray(f.draft?.balance_alert_admin_qq_ids) ? f.draft?.balance_alert_admin_qq_ids.join("\n") : ""),
		placeholder: "每行一个 QQ 号",
		disabled: m(),
		onInput: (e) => {
			let t = e.target.value;
			i.value["field-global-balance_alert_admin_qq_ids"] = t;
			try {
				if (/[\p{Cc}\p{Cf}\p{Cs}]/u.test(t.replace(/[\r\n\t]/g, ""))) throw Error("不允许控制字符或不可见字符。");
				let e = py(t.split(/\s+/u).filter(Boolean));
				C(["balance_alert_admin_qq_ids"], e, null), delete a.value["field-global-balance_alert_admin_qq_ids"];
			} catch (e) {
				C(["balance_alert_admin_qq_ids"], t, null), a.value["field-global-balance_alert_admin_qq_ids"] = e.message;
			}
		}
	}) })] }), oe = () => R(Wv, {
		title: "预警提示",
		number: "05"
	}, { default: () => [R(qv, {
		controlId: "field-global-balance_alert_llm-enabled",
		label: "智能提示",
		hint: "使用目标会话的模型与人格。"
	}, { default: ({ controlAttrs: e }) => R("label", { class: "ui-check-label" }, [R("input", {
		...e,
		type: "checkbox",
		checked: f.draft?.balance_alert_llm?.enabled !== !1,
		disabled: m(),
		onChange: (e) => C(["balance_alert_llm", "enabled"], e.target.checked, null)
	}), R("span", f.draft?.balance_alert_llm?.enabled === !1 ? "已关闭" : "已开启")]) })] });
	function se(t, n) {
		let r = My(t).items, i = !!E(t.id), a = t.type === "openai_compatible", o = r.endpoint?.items || Ty.provider_account.items.endpoint.items, s = Ty.provider_account.items.response_mapping.items;
		return R(Vv, {}, {
			default: () => [
				R(Wv, {
					title: "账户设置",
					number: "01"
				}, { default: () => R(Jv, {}, () => [
					T("id", r.id, n, void 0, {
						locked: i,
						hint: i ? "已有账户 ID 不可修改，避免凭据误绑定。" : "使用稳定、唯一的 ID；保存后不可更改。"
					}),
					T("display_name", r.display_name, n),
					T("aliases", r.aliases, n, void 0, { hint: "命令与自然语言使用这些别名。每行一项，避免与其他账户重名。" }),
					T("enabled", r.enabled, n),
					R("div", { class: "quota-provider-readonly" }, [R("span", "供应商"), R("strong", Ty[t.type]?.name || t.type)]),
					T("timeout_seconds", r.timeout_seconds, n),
					T("cache_ttl_seconds", r.cache_ttl_seconds, n)
				]) }),
				R(Wv, {
					title: "供应商设置",
					number: "02"
				}, { default: () => [R(Kv, {}, () => t.type === "deepseek" ? "DeepSeek 官方账户余额，查询地址与解析规则已内置。" : t.type === "alibaba_bailian" ? "阿里云 BSS：现金余额、可用额度和信用额度。" : t.type === "meinianda" ? "查询 Meinianda 账户站内额度。建议缓存至少 60 秒。" : t.type === "grsai" ? "Grsai 账户积分使用请求令牌 token。固定 POST /client/openapi/getCredits，不使用模型 API Key。" : "余额查询使用供应商专属接口，请按其文档配置只读余额接口。"), R(Jv, {}, () => [...r.region ? [T("region", r.region, n)] : [], ...a ? [
					T("service_profile", Ty.openai_compatible.items.service_profile, n),
					...t.service_profile === "grsai" ? [T("balance_scope", Ty.openai_compatible.items.balance_scope, n)] : [],
					...t.endpoint?.url ? [T("url", Ty.provider_account.items.endpoint.items.url, n, ["endpoint", "url"])] : [],
					T("base_url", o.base_url, n, ["endpoint", "base_url"]),
					T("path", o.path, n, ["endpoint", "path"])
				] : []])] }),
				re(t, n),
				a ? R(Wv, {
					title: "高级接口与响应映射",
					number: "04"
				}, { default: () => [T("advanced_options", Ty.openai_compatible.items.advanced_options, n), t.advanced_options ? R("div", { class: "quota-advanced" }, [
					R("h3", "请求协议"),
					R(Jv, {}, () => [
						"method",
						"auth_mode",
						"auth_name",
						"json_body"
					].map((e) => T(e, o[e], n, ["endpoint", e]))),
					R("h3", "余额响应映射"),
					R(Kv, {}, () => "使用 JSON Pointer，例如 /data/remaining。静态请求体和映射中不允许放入凭据。"),
					R(Jv, {}, () => Object.keys(s).map((e) => T(e, s[e], n, ["response_mapping", e])))
				]) : null] }) : null,
				D(),
				R("div", { class: "quota-danger-row" }, [p("移除账户", {
					disabled: m(),
					onClick: () => void g("maintenance", "移除账户「" + t.display_name + "」？", "将从草稿移除此账户。保存设置后才会生效，并移除其已保存凭据；其他账户不受影响。", "从草稿移除", () => {
						d.cancelSecret(), d.edit((e) => e.providers.splice(n, 1)), f.selected = null, e.value++;
					})
				}), R("span", { class: "quota-muted" }, "移除操作在保存设置后生效。")])
			],
			aside: () => O(t)
		});
	}
	let ce = () => {
		let e = f.draft?.providers || [], t = f.selected === null ? -1 : e.findIndex((e) => e.id === f.selected), n = e[t];
		return n ? se(n, t) : R("section", { class: "workspace-index quota-directory" }, [R("div", { class: "workspace-catalog" }, [
			R("div", { class: "workspace-index-heading" }, [R("h2", { class: "shell-eyebrow" }, "查询账户"), R("span", { class: "workspace-count" }, e.length + " 个账户")]),
			e.length ? null : R("div", { class: "shell-empty" }, [R("h2", "还没有查询账户"), R("p", "选择供应商添加账户，再单独配置加密凭据。")]),
			R("div", { class: "workspace-package-grid" }, e.map((e) => R("article", {
				class: "workspace-module",
				key: e.id
			}, [R("div", { class: "workspace-module-heading" }, [R("span", {
				class: "workspace-emblem",
				"aria-hidden": "true"
			}, "◈"), R("div", [R("div", { class: "workspace-module-title" }, [R("h2", [R("a", {
				href: "#/accounts/" + encodeURIComponent(e.id),
				onClick: (t) => {
					t.preventDefault(), _("accounts", e.id);
				}
			}, e.display_name || e.id)]), R("span", { class: "workspace-state" }, e.enabled === !1 ? "已停用" : "已启用")]), R("p", { class: "workspace-module-summary" }, (Ty[e.type]?.name || e.type) + " · " + e.id)])]), R("div", { class: "quota-account-meta" }, [R("span", Ny(e).every(({ key: t }) => f.snapshot?.credentials[e.id]?.[t]?.configured || t === "security_token") ? "凭据已配置" : "待配置凭据"), p("账户设置", {
				text: !0,
				disabled: !f.ready,
				onClick: () => void _("accounts", e.id)
			})])]))),
			d.dirty() ? D() : null
		]), R("aside", {
			class: "workspace-aside",
			"aria-label": "添加查询账户"
		}, [
			R("h2", { class: "shell-eyebrow" }, "新建账户"),
			R("label", { for: "new-provider" }, "供应商"),
			R("select", {
				id: "new-provider",
				class: "ui-control",
				value: r.value,
				disabled: m(),
				onChange: (e) => r.value = e.target.value
			}, Ey.map((e) => R("option", { value: e }, Ty[e].name))),
			p("添加账户", {
				type: "primary",
				disabled: m() || d.dirty(),
				onClick: () => {
					if (d.dirty()) return;
					let t = jy(r.value), n = 1;
					for (; e.some((e) => e.id === r.value + "-" + n);) n++;
					t.id = r.value + "-" + n, d.navigate("accounts", t.id), d.edit((e) => e.providers.push(t));
				}
			}),
			R("p", { class: "workspace-scope-note" }, "各供应商使用自己的余额协议和查询凭据，不复用模型聊天配置。")
		])]);
	}, le = () => R(Vv, {}, {
		default: () => [
			...Oy.map((e) => R(Wv, {
				title: e.title,
				number: e.number
			}, { default: () => R(Jv, {}, () => e.keys.map((e) => T(e, Dy[e], null))) })),
			ie(),
			ae(),
			oe(),
			D()
		],
		aside: () => R(Hv, {
			title: "权限边界",
			eyebrow: "QUERY ACCESS"
		}, { default: () => [
			R("p", "此页面仅供 AstrBot 管理员配置。查询权限不会授予管理页面访问权。"),
			R("ul", { class: "quota-guidance" }, [
				R("li", "管理员不需要加入私聊白名单。"),
				R("li", "私聊白名单使用完整 平台名:用户ID。"),
				R("li", "/yql 余额查询命令受管理员开关限制；预警命令按独立规则。"),
				R("li", "群聊查询需开启允许群聊，并满足用户白名单限制。")
			]),
			R(Kv, {}, () => "各账户可单独开启预警。")
		] })
	}), ue = () => R(Vv, {}, {
		default: () => R(Wv, {
			title: "旧配置迁移",
			number: "01"
		}, { default: () => [
			R("p", "将旧版插件配置中的普通设置、凭据和环境变量引用迁移到独立管理存储。凭据加密保存，不会在页面显示。"),
			R(Kv, { tone: f.snapshot?.migration.pending || f.snapshot?.migration.cleanup_pending || f.snapshot?.migration.legacy_conflict ? "warning" : "success" }, () => f.snapshot?.migration.legacy_conflict ? "发现与当前加密存储不同的旧配置。不会自动覆盖现有存储，也不会清理这份新出现的旧配置。请人工核对来源。" : f.snapshot?.migration.cleanup_pending ? "迁移已保存，但宿主旧字段尚未清理完成。请重新预览后重试清理。" : f.snapshot?.migration.pending ? "检测到旧版配置，迁移完成前不能保存新设置。" : "没有待迁移的旧版配置。"),
			p("读取迁移预览", {
				disabled: !f.ready || f.busy || f.stale || d.dirty(),
				onClick: () => void d.plan()
			}),
			f.plan ? R("div", { class: "quota-migration-plan" }, [
				R("h3", "本次迁移范围"),
				R("dl", [
					R("dt", "账户"),
					R("dd", String(f.plan.account_count)),
					R("dt", "需要加密的凭据"),
					R("dd", String(f.plan.plaintext_count)),
					R("dt", "环境变量引用"),
					R("dd", String(f.plan.environment_count))
				]),
				R("p", "仅在迁移成功后清理宿主中的旧配置。若源配置变化，将拒绝执行，请重新预览。"),
				p(f.plan.cleanup_pending ? "重试清理旧字段" : "确认迁移旧配置", {
					type: "primary",
					disabled: !f.plan.pending && !f.plan.cleanup_pending || f.plan.legacy_conflict || !f.snapshot?.encryption.ready || f.busy,
					onClick: () => void g("legacy-config", "迁移旧配置？", "将迁移预览中的 " + f.plan.account_count + " 个账户；明文凭据加密后保存，并清理旧版插件字段。不会展示或发送凭据到其他服务。", "执行迁移", () => d.migrate())
				})
			]) : null
		] }),
		aside: () => R(Hv, {
			title: "存储安全",
			eyebrow: "LOCAL ENCRYPTION"
		}, { default: () => [
			R("p", { class: "ui-badge" }, f.snapshot?.encryption.ready ? "加密存储就绪" : "加密存储不可用"),
			R("p", "主密钥由运行环境管理，不在此页面输入、导出或恢复。"),
			R(Kv, {}, () => "遇到存储故障请检查宿主日志中的安全错误代码。不要在公开日志或截图中粘贴密钥。")
		] })
	}), k = () => {
		let e = window.location.hash;
		window.history.replaceState(null, "", window.location.pathname + window.location.search);
		let t = /^#\/(accounts|global|maintenance)(?:\/([^/]+))?$/.exec(e);
		t && _(t[1], t[2] ? decodeURIComponent(t[2]) : null);
	}, de = () => d.close(), fe = (e) => {
		(d.dirty() || f.secret || f.busy) && (e.preventDefault(), e.returnValue = "");
	};
	return xr(() => {
		d.start(), window.addEventListener("pagehide", de), window.addEventListener("beforeunload", fe), window.addEventListener("hashchange", k);
	}), Cr(() => {
		s.dispose(), d.close(), window.removeEventListener("pagehide", de), window.removeEventListener("beforeunload", fe), window.removeEventListener("hashchange", k);
	}), () => {
		e.value, document.documentElement.dataset.theme = f.theme, document.documentElement.lang = f.locale;
		let r = f.draft?.providers.find((e) => e.id === f.selected), i = f.route === "global" ? "全局设置" : f.route === "maintenance" ? "配置维护" : r ? r.display_name : "账户管理";
		return R(Bv, {
			theme: f.theme,
			locale: f.locale,
			styleMountTarget: document.head
		}, { default: () => R("div", {
			ref: t,
			class: "game-shell quota-shell",
			"data-theme": f.theme
		}, [
			R("button", {
				class: "ui-button skip-button",
				onClick: () => n.value?.focus()
			}, "跳到主要内容"),
			R("aside", { class: "shell-sidebar" }, [
				x(),
				R("p", { class: "shell-nav-label" }, "QUOTA LINK"),
				R("nav", { "aria-label": "主导航" }, [b("账户管理", "accounts", "account"), b("全局设置", "global", "settings")]),
				R("div", { class: "shell-settings-slot" }, [b("配置维护", "maintenance", "maintenance"), R("p", { class: "shell-note" }, [
					"统一查询 · 独立凭据",
					R("br"),
					"YOMIHIME SERIES"
				])])
			]),
			R("div", { class: "shell-content" }, [
				R("div", { class: "shell-mobile" }, [x(), R("nav", { "aria-label": "移动端导航" }, [
					b("账户管理", "accounts", "account"),
					b("全局设置", "global", "settings"),
					b("配置维护", "maintenance", "maintenance")
				])]),
				R("div", { class: "shell-topbar" }, [
					R("span", "额度连结"),
					R("span", "/"),
					R("span", i),
					R("span", { class: "quota-revision" }, f.snapshot ? "配置版本 " + f.snapshot.revision : "等待管理会话")
				]),
				R("main", {
					ref: n,
					id: "main",
					tabindex: -1
				}, [
					R(Uv, {
						class: "shell-heading",
						title: i,
						eyebrow: "YOMIHIME QUOTA LINK / ADMIN",
						subtitle: f.route === "accounts" ? r ? "配置查询参数与来源凭据。" : "管理 AI 服务的余额、用量与额度查询账户。" : void 0
					}, { default: () => R("div", { class: "quota-header-actions" }, [r ? p("返回账户", { onClick: () => void _("accounts") }) : null, p("重新读取状态", {
						disabled: !f.ready || f.busy,
						onClick: () => void v()
					})]) }),
					R(Kv, {
						tone: f.tone,
						role: f.tone === "error" ? "alert" : "status",
						class: "shell-status",
						"data-testid": "status"
					}, () => f.notice),
					s.render(),
					f.snapshot && !f.snapshot.encryption.ready ? R("div", {
						class: "quota-warning",
						role: "status"
					}, "加密存储不可用。新的明文凭据不能保存，请先检查运行环境；不会改用明文存储。") : null,
					f.snapshot?.migration.pending && f.route !== "maintenance" ? R("div", { class: "quota-warning" }, [R("span", "有旧版配置等待迁移。普通设置与凭据操作暂时锁定。"), p("前往迁移", { onClick: () => void _("maintenance") })]) : null,
					f.snapshot ? f.route === "global" ? le() : f.route === "maintenance" ? ue() : ce() : R("section", { class: "shell-empty" }, [R("h2", f.ready ? "正在读取配置" : "需要宿主管理授权"), R("p", "请先登录 AstrBot，再从插件详情页打开「额度查询」。")])
				]),
				R("footer", { class: "shell-footer" }, [R("a", {
					class: "shell-project-link",
					href: "https://github.com/yomihime/astrbot_plugin_yomihime_quota_link",
					target: "_blank",
					rel: "noopener noreferrer"
				}, [R("span", "如月怜的额度连结"), R("span", { class: "shell-project-english" }, [" / Yomihime Quota Link ", R("span", {
					class: "shell-project-spark",
					"aria-hidden": "true"
				}, "✧")])])])
			])
		]) });
	};
} }));
Zy.mount("#app"), window.addEventListener("pagehide", () => Zy.unmount(), { once: !0 });
//#endregion
