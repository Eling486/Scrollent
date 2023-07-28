(function(){"use strict";try{if(typeof document<"u"){var t=document.createElement("style");t.appendChild(document.createTextNode("[data-scrollent]{opacity:0}[data-scrollent].scrollent-show{opacity:1;transform:translate(0) translateY(0)}[data-scrollent^=invariant]{opacity:1}[data-scrollent^=fade]{transition-property:opacity}[data-scrollent^=fade-right]{transition-property:opacity,transform;transform:translate(var(--sl-tlx))}[data-scrollent^=fade-left]{transition-property:opacity,transform;transform:translate(calc(-1 * var(--sl-tlx)))}[data-scrollent^=fade-left-top]{transition-property:opacity,transform;transform:translate(calc(-1 * var(--sl-tlx))) translateY(calc(-1 * var(--sl-tly)))}[data-scrollent^=fade-right-top]{transition-property:opacity,transform;transform:translate(var(--sl-tlx)) translateY(calc(-1 * var(--sl-tly)))}[data-scrollent^=fade-top]{transition-property:opacity,transform;transform:translateY(calc(-1 * var(--sl-tly)))}[data-scrollent^=fade-left-bottom]{transition-property:opacity,transform;transform:translate(calc(-1 * var(--sl-tlx))) translateY(var(--sl-tly))}[data-scrollent^=fade-right-bottom]{transition-property:opacity,transform;transform:translate(var(--sl-tlx)) translateY(var(--sl-tly))}[data-scrollent^=fade-bottom]{transition-property:opacity,transform;transform:translateY(var(--sl-tlx))}")),document.head.appendChild(t)}}catch(a){console.error("vite-plugin-css-injected-by-js",a)}})();
const d = (n) => {
  const t = {
    root: document,
    // DOM
    reentrant: !1,
    // Boolean
    once: !1,
    // Boolean
    duration: "0.5s",
    // CSS
    easing: "ease-out",
    // CSS
    percent: 0.4,
    // Float(0-1)
    offset: 120,
    // Number (in px)
    translate: "10px",
    // CSS
    delay: 0
    // Number (in ms)
  };
  if (!n)
    return t;
  for (const e in t)
    t.hasOwnProperty(e) && !n.hasOwnProperty(e) && (n[e] = t[e]);
  return n;
}, p = {
  cShow: "scrollent-show",
  cReady: "scrollent-ready-to-show",
  updateClass(n) {
    n.refs.forEach((t) => {
      for (let e = 0; e < t.children.length; e++) {
        let s = t.children[e], r = s.percent, i = s.offset, o = s.delay;
        if (i) {
          let l = window.innerHeight;
          r = i / l;
        }
        if (r) {
          if (t.percentage > r) {
            if (t.percentage > 1 && s.reentrant) {
              s.dom.classList.remove(this.cReady), s.dom.classList.remove(this.cShow);
              continue;
            }
            if (o) {
              if (s.dom.classList.contains(this.cReady) || s.dom.classList.contains(this.cShow))
                continue;
              s.dom.classList.add(this.cReady), setTimeout(() => {
                s.dom.classList.add(this.cShow), s.dom.classList.remove(this.cReady);
              }, o), s.once && t.children.splice(e, 1);
              continue;
            }
            s.once && t.children.splice(e, 1), s.dom.classList.add(this.cShow);
            continue;
          }
          s.dom.classList.remove(this.cReady), s.dom.classList.remove(this.cShow);
          continue;
        }
      }
    });
  },
  initStyle(n) {
    n.targets.forEach((t) => {
      t.dom.style.transitionDuration = t.duration, t.dom.style.transitionTimingFunction = n.easing, t.dom.style.setProperty("--sl-tlx", t.translate.x), t.dom.style.setProperty("--sl-tly", t.translate.y), t.dom.classList.add("scrollent-init");
    });
  }
};
class u {
  constructor(t) {
    this.options = t, t.root.addEventListener("scroll", () => {
      this.handleScroll();
    }), this.handleScroll();
  }
  handleScroll() {
    for (let t = 0; t < this.options.refs.length; t++) {
      let e = this.options.refs[t].ref, s = window.innerHeight, r = e.getBoundingClientRect();
      if (r.top > s) {
        this.options.refs[t].percentage = 0;
        continue;
      }
      let i = 1 - (r.top + r.height) / (s + r.height);
      i !== this.options.refs[t].percentage && (this.options.refs[t].events.trigger("percentageChanged", {
        from: this.options.refs[t].percentage,
        to: i
      }), this.options.refs[t].percentage = i);
    }
    p.updateClass(this.options);
  }
  destroy() {
    options.root.removeEventListener("scroll", () => {
      this.handleScroll();
    });
  }
}
class g {
  constructor(t) {
    this.events = {}, this.options = t, this.allowedEvents = [
      "destroy"
    ];
  }
  on(t, e) {
    if (typeof t == "string") {
      this.test(t) && typeof e == "function" && (this.events[t] || (this.events[t] = []), this.events[t].push(e));
      return;
    }
  }
  refOn(t, e) {
    if (Array.isArray(t) && (t = {
      event: t[0],
      ref: t[1]
    }), this.isDOM(t.ref) && typeof e == "function")
      for (let s = 0; s < this.options.refs.length; s++)
        this.options.refs[s].ref == t.ref && this.options.refs[s].events.on(t.event, e);
  }
  targetOn(t, e) {
    if (Array.isArray(t) && (t = {
      event: t[0],
      target: t[1]
    }), this.isDOM(t.target) && typeof e == "function")
      for (let s = 0; s < this.options.targets.length; s++)
        this.options.targets[s].dom == t.target && this.options.targets[s].events.on(t.event, e);
  }
  trigger(t, e) {
    if (this.events[t] && this.events[t].length)
      for (let s = 0; s < this.events[t].length; s++)
        this.events[t][s](e);
  }
  isDOM(t) {
    return typeof t == "object" && t.nodeType === 1 && typeof t.nodeName == "string";
  }
  test(t) {
    return this.selectorEvents.indexOf(t) !== -1 ? !0 : (console.error(`Unknown event name: ${t}`), null);
  }
}
class a {
  constructor(t = "target") {
    this.events = {}, t == "ref" && (this.allowedEvents = [
      "percentageChanged"
    ]), t == "target" && (this.allowedEvents = [
      "in",
      "out"
    ]);
  }
  on(t, e) {
    this.test(t) && typeof e == "function" && (this.events[t] || (this.events[t] = []), this.events[t].push(e));
  }
  trigger(t, e) {
    if (this.events[t] && this.events[t].length)
      for (let s = 0; s < this.events[t].length; s++)
        this.events[t][s](e);
  }
  test(t) {
    return this.allowedEvents.indexOf(t) !== -1 ? !0 : (console.error(`Unknown event name: ${t}`), null);
  }
}
class y {
  constructor(t) {
    this.options = d(t);
  }
  init() {
    return this.scan(), this.refs = this.options.refs, this.targets = this.options.targets, this.events = new g(this.options), this.listener = new u(this.options), this.render = p, this.render.initStyle(this.options), this;
  }
  scan() {
    this.options.targets = [], this.options.refs = [], document.querySelectorAll("[data-scrollent]").forEach((t) => {
      let e = {
        dom: t,
        events: new a("target")
      }, r = (t.getAttribute("data-scrollent-translate") || this.options.translate).split(" ");
      e.translate = {
        x: r[0],
        y: r[1]
      }, e.translate.y || (e.translate.y = e.translate.x);
      let i = t.getAttribute("data-scrollent-percent");
      i === "" && (e.percent = this.options.percent), i && (e.percent = parseFloat(i), i.includes("%") && (e.percent = parseFloat(i) / 100));
      let o = t.getAttribute("data-scrollent-offset");
      (o || o === "") && (e.offset = parseInt(o) || this.options.offset), !e.offset && !e.percent && (e.percent = this.options.percent);
      let l = t.getAttribute("data-scrollent-delay");
      (l && parseInt(l) > 0 || l === "" && this.options.delay > 0) && (e.delay = parseInt(l) || this.options.delay), e.once = !1;
      let h = t.getAttribute("data-scrollent-once");
      (h || h === "" || h !== "false" && this.options.once) && (e.once = !0), e.reentrant = !1;
      let f = t.getAttribute("data-scrollent-reentrant");
      (f || f === "" || f !== "false" && this.options.reentrant) && (e.reentrant = !0), e.duration = t.getAttribute("data-scrollent-duration") || this.options.duration;
      let c = t.getAttribute("data-scrollent-ref");
      c && (e.ref = document.querySelector(c)), e.ref || (e.ref = t), this.options.targets.push(e);
    }), this.options.targets.forEach((t) => {
      for (let e = 0; e < this.options.refs.length; e++)
        if (this.options.refs[e].ref == t.ref)
          return this.options.refs[e].children.push(t);
      return this.options.refs.push({
        ref: t.ref,
        events: new a("ref"),
        children: [t]
      });
    });
  }
}
export {
  y as default
};
