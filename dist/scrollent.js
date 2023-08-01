(function(){"use strict";try{if(typeof document<"u"){var a=document.createElement("style");a.id="scrollent",a.appendChild(document.createTextNode("[data-scrollent]{opacity:1;transition-duration:calc(var(--sl-dur) * 1ms);transition-timing-function:var(--sl-eas);transform-origin:center}[data-scrollent].scrollent-show{opacity:1;transform:none}[data-scrollent^=none]{opacity:1}[data-scrollent^=fade]{opacity:0}[data-scrollent]{transform:perspective(var(--sl-per)) translate3d(calc(var(--sl-dsx) * var(--sl-dx)),calc(var(--sl-dsy) * var(--sl-dy)),0) scale(var(--sl-s)) rotateX(calc(1deg * var(--sl-rx))) rotateY(calc(1deg * var(--sl-ry))) rotate(calc(1deg * var(--sl-rz)))}")),document.head.appendChild(a)}}catch(t){console.error("vite-plugin-css-injected-by-js",t)}})();
const Y = (r) => {
  const e = {
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
    offset: 120,
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
    return e;
  for (const t in e)
    e.hasOwnProperty(t) && !r.hasOwnProperty(t) && (r[t] = e[t]);
  return r;
}, b = {
  cShow: "scrollent-show",
  cReady: "scrollent-ready-to-show",
  updateClass(r) {
    r.refs.forEach((e) => {
      for (let t = 0; t < e.children.length; t++) {
        let s = e.children[t], n = s.percent, l = s.offset, p = s.delay;
        if (l) {
          let u = window.innerHeight;
          n = l / u;
        }
        if (n) {
          if (e.percentage > n) {
            if (s.once && e.children.splice(t, 1), e.percentage > 1 && s.reentrant) {
              s.dom.classList.remove(this.cReady, this.cShow);
              continue;
            }
            if (s.dom.classList.contains(this.cShow))
              continue;
            if (p) {
              if (s.dom.classList.contains(this.cReady))
                continue;
              s.dom.classList.add(this.cReady), s.delayTimer && clearTimeout(s.delayTimer), s.delayTimer = setTimeout(() => {
                (e.percentage > n || s.once) && s.dom.classList.add(this.cShow), s.dom.classList.remove(this.cReady);
              }, p);
              continue;
            }
            s.dom.classList.add(this.cShow);
            continue;
          }
          s.dom.classList.remove(this.cReady, this.cShow);
          continue;
        }
      }
    });
  },
  initStyle(r) {
    r.targets.forEach((e) => {
      e.dom.classList.remove(this.cReady, this.cShow), e.dom.style.setProperty("--sl-dur", e.params.duration), e.dom.style.setProperty("--sl-eas", e.params.easing), e.dom.style.setProperty("--sl-dsx", e.params.distance.symX), e.dom.style.setProperty("--sl-dsy", e.params.distance.symY), e.dom.style.setProperty("--sl-dx", e.params.distance.x), e.dom.style.setProperty("--sl-dy", e.params.distance.y), e.dom.style.setProperty("--sl-rx", e.params.rotate.x), e.dom.style.setProperty("--sl-ry", e.params.rotate.y), e.dom.style.setProperty("--sl-rz", e.params.rotate.z), e.dom.style.setProperty("--sl-s", e.params.scale), e.dom.style.setProperty("--sl-per", e.params.perspective), e.dom.classList.add("scrollent-init");
    });
  }
};
class z {
  constructor(e) {
    this.options = e, this.scrollTimer, this.options.root.addEventListener("scroll", (t) => {
      this.handleScroll();
    });
  }
  handleScroll() {
    this.scrollTimer || (this.scrollTimer = setTimeout(() => {
      this.updatePercentage(), b.updateClass(this.options), clearTimeout(this.scrollTimer), this.scrollTimer = null;
    }, this.options.debounce));
  }
  updatePercentage() {
    for (let e = 0; e < this.options.refs.length; e++) {
      let t = this.options.refs[e].ref, s = window.innerHeight, n = t.getBoundingClientRect(), l = 1 - (n.top + n.height) / (s + n.height);
      l !== this.options.refs[e].percentage && (this.options.refs[e].events.trigger("percentageChanged", {
        from: this.options.refs[e].percentage,
        to: l
      }), this.options.refs[e].percentage = l);
    }
  }
  destroy() {
    options.root.removeEventListener("scroll", () => {
      this.handleScroll();
    });
  }
}
class C {
  constructor(e) {
    this.events = {}, this.options = e, this.allowedEvents = {
      instance: ["destroy"],
      ref: ["percentageChanged"],
      target: [
        "in",
        "out"
      ]
    };
  }
  on(e, t) {
    if (typeof e == "string")
      return this.test(e) && typeof t == "function" ? (this.events[e] || (this.events[e] = []), this.events[e].push(t)) : void 0;
    if (Array.isArray(e) && (e = {
      event: e[0],
      dom: e[1]
    }), !this.isDOM(e.dom))
      return console.error("[Scrollent] the ref or target event needs to provide a DOM");
    if (this.test(e.event, "ref") && this.isDOM(e.dom) && typeof t == "function") {
      for (let s = 0; s < this.options.refs.length; s++)
        this.options.refs[s].ref == e.dom && this.options.refs[s].events.on(e.event, t);
      return;
    }
    if (this.test(e.event, "target") && this.isDOM(e.dom) && typeof t == "function") {
      for (let s = 0; s < this.options.targets.length; s++)
        this.options.targets[s].dom == e.target && this.options.targets[s].events.on(e.event, t);
      return;
    }
    console.error(`[Scrollent] Unknown event name: ${e.event}`);
  }
  trigger(e, t) {
    if (this.events[e] && this.events[e].length)
      for (let s = 0; s < this.events[e].length; s++)
        this.events[e][s](t);
  }
  isDOM(e) {
    return typeof e == "object" && e.nodeType === 1 && typeof e.nodeName == "string";
  }
  test(e, t = "instance") {
    return this.allowedEvents[t].indexOf(e) !== -1 ? !0 : (t == "instance" && console.error(`[Scrollent] Unknown event name: ${e}`), !1);
  }
}
class R {
  constructor() {
    this.events = {};
  }
  on(e, t) {
    this.events[e] || (this.events[e] = []), this.events[e].push(t);
  }
  trigger(e, t) {
    if (this.events[e] && this.events[e].length)
      for (let s = 0; s < this.events[e].length; s++)
        this.events[e][s](t);
  }
}
class H {
  constructor(e) {
    this.options = Y(e);
  }
  init() {
    return this.scan(), this.refs = this.options.refs, this.targets = this.options.targets, this.render = b, this.events = new C(this.options), this.listener = new z(this.options), window.addEventListener(this.options.startEvent, (e) => {
      this.refresh();
    }), this.refresh(), this;
  }
  scan() {
    this.options.targets = [], this.options.refs = [], document.querySelectorAll("[data-scrollent]:not(.scrollent-init)").forEach((e) => {
      let t = {
        dom: e,
        events: new R(),
        params: {}
      }, s = this.options.attrName, n = e.getAttribute("data-scrollent"), l = 0, p = 0, u = /(fade)?-?((left)|(right)|(down)|(up))((-left)|(-right)|(-down)|(-up))?/g, w = ["left", "right"], x = ["up", "down"], S = [1, -1], A = [1, -1], a = n.match(u);
      if (a) {
        let o = a[0].indexOf("-");
        o == 0 && (a = null), o !== 0 && (a = a[0].substring(o + 1, a.Length));
      }
      a && a.split("-").forEach((h) => {
        let d = w.indexOf(h), $ = x.indexOf(h);
        d >= 0 && (l = S[d]), $ >= 0 && (p = A[$]);
      });
      let y = (e.getAttribute(`${s}-distance`) || this.options.distance).split(" ");
      t.params.distance = {
        x: y[0],
        symX: l,
        y: y[1] || y[0],
        symY: p
      };
      let i = (e.getAttribute(`${s}-rotate`) || this.options.rotate).split(" ");
      i[0] == "-" && (i[0] = "0"), i[1] == "-" && (i[1] = "0"), t.params.rotate = {
        x: i[0] || i[1] || i[2],
        y: i[1] || i[0] || i[2],
        z: i[2] || i[0] || i[1]
      };
      let L = ["scale", "easing", "perspective", "flip", "zoom"];
      for (let o = 0; o < L.length; o++) {
        let h = L[o];
        t.params[h] = e.getAttribute(`${s}-${h}`) || this.options[h];
      }
      n.indexOf("zoom") >= 0 && (t.params.scale = t.params.zoom);
      let O = 0, P = 0, X = /(flip-)((left)|(right)|(down)|(up))/, E = n.match(X);
      if (E) {
        let o = E[0].split("-")[1], h = w.indexOf(o), d = x.indexOf(o);
        h >= 0 && (O = S[h], t.params.rotate.x = O * this.options.flip), d >= 0 && (P = A[d], t.params.rotate.y = P * this.options.flip);
      }
      let c = e.getAttribute(`${s}-percent`);
      c === "" && (t.percent = this.options.percent), c && (t.percent = parseFloat(c), c.includes("%") && (t.percent = parseFloat(c) / 100));
      let m = e.getAttribute(`${s}-offset`);
      (m || m === "") && (t.offset = parseInt(m) || this.options.offset), !t.offset && !t.percent && (t.percent = this.options.percent);
      let f = e.getAttribute(`${s}-delay`) || this.options.delay;
      typeof f == "string" && (f = parseInt(f)), f <= 0 && (f = !1), t.delay = f, t.once = !1;
      let g = e.getAttribute(`${s}-once`);
      (g || g === "" || this.options.once) && g !== "false" && (t.once = !0), t.reentrant = !1;
      let v = e.getAttribute(`${s}-reentrant`);
      (v || v === "" || this.options.reentrant) && v !== "false" && (t.reentrant = !0), t.params.duration = e.getAttribute(`${s}-duration`) || this.options.duration, typeof t.params.duration == "string" && (t.params.duration = parseInt(t.params.duration));
      let T = e.getAttribute(`${s}-ref`);
      T && (t.ref = document.querySelector(T)), t.ref || (t.ref = e), this.options.targets.push(t);
    }), this.options.targets.forEach((e) => {
      for (let t = 0; t < this.options.refs.length; t++)
        if (this.options.refs[t].ref == e.ref)
          return this.options.refs[t].children.push(e);
      return this.options.refs.push({
        ref: e.ref,
        events: new R(),
        children: [e]
      });
    });
  }
  refresh(e = !1, t = this.options.duration) {
    e && this.scan(), this.render.initStyle(this.options), setTimeout(() => {
      this.listener.updatePercentage(), this.render.updateClass(this.options);
    }, t);
  }
}
export {
  H as default
};
