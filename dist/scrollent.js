(function(){"use strict";try{if(typeof document<"u"){var a=document.createElement("style");a.id="scrollent",a.appendChild(document.createTextNode("[data-scrollent]{opacity:1;transition-duration:calc(var(--sl-dur) * 1ms);transition-timing-function:var(--sl-eas);transform-origin:center}[data-scrollent].scrollent-show{opacity:1;transform:none}[data-scrollent^=none]{opacity:1}[data-scrollent^=fade]{opacity:0}[data-scrollent]{transform:perspective(var(--sl-per)) translate3d(calc(var(--sl-dsx) * var(--sl-dx)),calc(var(--sl-dsy) * var(--sl-dy)),0) scale(var(--sl-s)) rotateX(calc(1deg * var(--sl-rx))) rotateY(calc(1deg * var(--sl-ry))) rotate(calc(1deg * var(--sl-rz)))}")),document.head.appendChild(a)}}catch(t){console.error("vite-plugin-css-injected-by-js",t)}})();
const D = (r) => {
  const t = {
    root: document,
    // DOM
    reentrant: !1,
    // Boolean
    startEvent: "load",
    // String (Window Event name)
    once: !1,
    // Boolean
    duration: 500,
    // CSS
    easing: "ease-out",
    // CSS
    percent: 0.4,
    // Float(0-1)
    percentOut: 1,
    // Float(0-1)
    offset: 120,
    // Number (in px)
    offsetOut: null,
    // Number (in px)
    distance: "20px",
    // CSS
    rotate: "0",
    scale: 1,
    delay: 0,
    // Number (in ms)
    debounce: 10,
    flip: 90,
    perspective: "2000px",
    attrName: "data-scrollent"
  };
  if (!r)
    return t;
  for (const e in t)
    t.hasOwnProperty(e) && !r.hasOwnProperty(e) && (r[e] = t[e]);
  return r;
}, z = {
  cShow: "scrollent-show",
  cReady: "scrollent-ready-to-show",
  updateClass(r) {
    r.refs.forEach((t) => {
      for (let e = 0; e < t.children.length; e++) {
        let s = t.children[e], o = s.percent, l = s.percentOut, d = s.delay;
        if (s.offset) {
          let p = window.innerHeight;
          o = s.offset / p;
        }
        if (s.offsetOut) {
          let p = window.innerHeight;
          l = (p - s.offsetOut) / p;
        }
        if (o) {
          if (t.percentage > o) {
            if (s.once && t.children.splice(e, 1), t.percentage > l && s.reentrant) {
              s.dom.classList.contains(this.cShow) && s.events.trigger("out"), s.dom.classList.remove(this.cReady, this.cShow);
              continue;
            }
            if (s.dom.classList.contains(this.cShow))
              continue;
            if (d) {
              if (s.dom.classList.contains(this.cReady))
                continue;
              s.dom.classList.add(this.cReady), s.delayTimer && clearTimeout(s.delayTimer), s.delayTimer = setTimeout(() => {
                (t.percentage > o || s.once) && (s.events.trigger("in"), s.dom.classList.add(this.cShow)), s.dom.classList.remove(this.cReady);
              }, d);
              continue;
            }
            s.dom.classList.contains(this.cReady) || s.events.trigger("in"), s.dom.classList.add(this.cShow);
            continue;
          }
          s.dom.classList.contains(this.cShow) && s.events.trigger("out"), s.dom.classList.remove(this.cReady, this.cShow);
          continue;
        }
      }
    });
  },
  initStyle(r) {
    r.targets.forEach((t) => {
      t.dom.classList.remove(this.cReady, this.cShow), t.dom.style.setProperty("--sl-dur", t.params.duration), t.dom.style.setProperty("--sl-eas", t.params.easing), t.dom.style.setProperty("--sl-dsx", t.params.distance.symX), t.dom.style.setProperty("--sl-dsy", t.params.distance.symY), t.dom.style.setProperty("--sl-dx", t.params.distance.x), t.dom.style.setProperty("--sl-dy", t.params.distance.y), t.dom.style.setProperty("--sl-rx", t.params.rotate.x), t.dom.style.setProperty("--sl-ry", t.params.rotate.y), t.dom.style.setProperty("--sl-rz", t.params.rotate.z), t.dom.style.setProperty("--sl-s", t.params.scale), t.dom.style.setProperty("--sl-per", t.params.perspective), t.dom.classList.add("scrollent-init");
    });
  }
};
class H {
  constructor(t) {
    this.options = t, this.scrollTimer, this.options.root.addEventListener("scroll", (e) => {
      this.handleScroll();
    });
  }
  handleScroll() {
    this.scrollTimer || (this.scrollTimer = setTimeout(() => {
      this.updatePercentage(), z.updateClass(this.options), clearTimeout(this.scrollTimer), this.scrollTimer = null;
    }, this.options.debounce));
  }
  updatePercentage() {
    for (let t = 0; t < this.options.refs.length; t++) {
      let e = this.options.refs[t].ref, s = window.innerHeight, o = e.getBoundingClientRect(), l = 1 - (o.top + o.height) / (s + o.height);
      l !== this.options.refs[t].percentage && (this.options.refs[t].events.trigger("percentageChanged", {
        from: this.options.refs[t].percentage,
        to: l
      }), this.options.refs[t].percentage = l);
    }
  }
  destroy() {
    options.root.removeEventListener("scroll", () => {
      this.handleScroll();
    });
  }
}
class M {
  constructor(t) {
    this.events = {}, this.options = t, this.allowedEvents = {
      instance: ["destroy"],
      ref: ["percentageChanged"],
      target: [
        "in",
        "out"
      ]
    };
  }
  on(t, e) {
    if (typeof t == "string")
      return this.test(t) && typeof e == "function" ? (this.events[t] || (this.events[t] = []), this.events[t].push(e)) : void 0;
    if (Array.isArray(t) && (t = {
      event: t[0],
      dom: t[1]
    }), !this.isDOM(t.dom))
      return console.error("[Scrollent] the ref or target event needs to provide a DOM");
    if (this.test(t.event, "ref") && this.isDOM(t.dom) && typeof e == "function") {
      for (let s = 0; s < this.options.refs.length; s++)
        this.options.refs[s].ref == t.dom && this.options.refs[s].events.on(t.event, e);
      return;
    }
    if (this.test(t.event, "target") && this.isDOM(t.dom) && typeof e == "function") {
      for (let s = 0; s < this.options.targets.length; s++)
        this.options.targets[s].dom == t.dom && this.options.targets[s].events.on(t.event, e);
      return;
    }
    console.error(`[Scrollent] Unknown event name: ${t.event}`);
  }
  trigger(t, e = null) {
    if (this.events[t] && this.events[t].length)
      for (let s = 0; s < this.events[t].length; s++)
        this.events[t][s](e);
  }
  isDOM(t) {
    return typeof t == "object" && t.nodeType === 1 && typeof t.nodeName == "string";
  }
  test(t, e = "instance") {
    return this.allowedEvents[e].indexOf(t) !== -1 ? !0 : (e == "instance" && console.error(`[Scrollent] Unknown event name: ${t}`), !1);
  }
}
class Y {
  constructor() {
    this.events = {};
  }
  on(t, e) {
    this.events[t] || (this.events[t] = []), this.events[t].push(e);
  }
  trigger(t, e) {
    if (this.events[t] && this.events[t].length)
      for (let s = 0; s < this.events[t].length; s++)
        this.events[t][s](e);
  }
}
class F {
  constructor(t) {
    this.options = D(t);
  }
  init() {
    return this.scan(), this.refs = this.options.refs, this.targets = this.options.targets, this.render = z, this.events = new M(this.options), this.listener = new H(this.options), window.addEventListener(this.options.startEvent, (t) => {
      this.refresh();
    }), this.refresh(), this;
  }
  scan() {
    this.options.targets = [], this.options.refs = [], document.querySelectorAll("[data-scrollent]:not(.scrollent-init)").forEach((t) => {
      let e = {
        dom: t,
        events: new Y(),
        params: {}
      }, s = this.options.attrName, o = t.getAttribute("data-scrollent"), l = 0, d = 0, p = /(fade)?-?((left)|(right)|(down)|(up))((-left)|(-right)|(-down)|(-up))?/g, x = ["left", "right"], S = ["up", "down"], L = [1, -1], A = [1, -1], h = o.match(p);
      if (h) {
        let i = h[0].indexOf("-");
        i == 0 && (h = null), i !== 0 && (h = h[0].substring(i + 1, h.Length));
      }
      h && h.split("-").forEach((f) => {
        let u = x.indexOf(f), X = S.indexOf(f);
        u >= 0 && (l = L[u]), X >= 0 && (d = A[X]);
      });
      let y = (t.getAttribute(`${s}-distance`) || this.options.distance).split(" ");
      e.params.distance = {
        x: y[0],
        symX: l,
        y: y[1] || y[0],
        symY: d
      };
      let n = (t.getAttribute(`${s}-rotate`) || this.options.rotate).split(" ");
      n[0] == "-" && (n[0] = "0"), n[1] == "-" && (n[1] = "0"), e.params.rotate = {
        x: n[0] || n[1] || n[2],
        y: n[1] || n[0] || n[2],
        z: n[2] || n[0] || n[1]
      };
      let P = ["scale", "easing", "perspective", "flip", "zoom"];
      for (let i = 0; i < P.length; i++) {
        let f = P[i];
        e.params[f] = t.getAttribute(`${s}-${f}`) || this.options[f];
      }
      o.indexOf("zoom") >= 0 && (e.params.scale = e.params.zoom);
      let $ = 0, E = 0, C = /(flip-)((left)|(right)|(down)|(up))/, T = o.match(C);
      if (T) {
        let i = T[0].split("-")[1], f = x.indexOf(i), u = S.indexOf(i);
        f >= 0 && ($ = L[f], e.params.rotate.x = $ * this.options.flip), u >= 0 && (E = A[u], e.params.rotate.y = E * this.options.flip);
      }
      let c = t.getAttribute(`${s}-percent`), m = t.getAttribute(`${s}-percent-out`);
      c === "" && (e.percent = this.options.percent), m === "" && (e.percentOut = this.options.percentOut);
      function R(i) {
        return c = parseFloat(i), i.includes("%") && (c = parseFloat(i) / 100), c;
      }
      c && (e.percent = R(c)), m && (e.percentOut = R(m));
      let g = t.getAttribute(`${s}-offset`);
      (g || g === "") && (e.offset = parseInt(g) || this.options.offset);
      let v = t.getAttribute(`${s}-offset-out`);
      (v || v === "") && (e.offsetOut = parseInt(v) || this.options.offsetOut), !e.offset && !e.percent && (e.percent = this.options.percent), !e.offsetOut && !e.percentOut && (e.percentOut = this.options.percentOut);
      let a = t.getAttribute(`${s}-delay`) || this.options.delay;
      typeof a == "string" && (a = parseInt(a)), a <= 0 && (a = !1), e.delay = a, e.once = !1;
      let w = t.getAttribute(`${s}-once`);
      (w || w === "" || this.options.once) && w !== "false" && (e.once = !0), e.reentrant = !1;
      let O = t.getAttribute(`${s}-reentrant`);
      (O || O === "" || this.options.reentrant) && O !== "false" && (e.reentrant = !0), e.params.duration = t.getAttribute(`${s}-duration`) || this.options.duration, typeof e.params.duration == "string" && (e.params.duration = parseInt(e.params.duration));
      let b = t.getAttribute(`${s}-ref`);
      b && (e.ref = document.querySelector(b)), e.ref || (e.ref = t), this.options.targets.push(e);
    }), this.options.targets.forEach((t) => {
      for (let e = 0; e < this.options.refs.length; e++)
        if (this.options.refs[e].ref == t.ref)
          return this.options.refs[e].children.push(t);
      return this.options.refs.push({
        ref: t.ref,
        events: new Y(),
        children: [t]
      });
    });
  }
  refresh(t = !1, e = this.options.duration) {
    t && this.scan(), this.render.initStyle(this.options), setTimeout(() => {
      this.listener.updatePercentage(), this.render.updateClass(this.options);
    }, e);
  }
}
export {
  F as default
};
