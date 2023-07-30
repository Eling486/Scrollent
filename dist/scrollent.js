(function(){"use strict";try{if(typeof document<"u"){var a=document.createElement("style");a.id="scrollent",a.appendChild(document.createTextNode("[data-scrollent]{opacity:0;transition-duration:calc(var(--sl-dur) * 1ms)}[data-scrollent^=none]{opacity:1}[data-scrollent^=fade]{opacity:0;transition-property:opacity,transform}[data-scrollent^=fade].scrollent-show{opacity:1;transform:none}[data-scrollent^=fade-right]{transform:translate3d(var(--sl-dx),0,0)}[data-scrollent^=fade-left]{transform:translate3d(calc(-1 * var(--sl-dx)),0,0)}[data-scrollent^=fade-left-top]{transform:translate3d(calc(-1 * var(--sl-dx)),calc(-1 * var(--sl-dy)),0)}[data-scrollent^=fade-right-top]{transform:translate3d(var(--sl-dx),calc(-1 * var(--sl-dy)),0)}[data-scrollent^=fade-top]{transform:translate3d(0,calc(-1 * var(--sl-dy)),0)}[data-scrollent^=fade-left-bottom]{transform:translate3d(calc(-1 * var(--sl-dx)),var(--sl-dy),0)}[data-scrollent^=fade-right-bottom]{transform:translate3d(var(--sl-dx),var(--sl-dy),0)}[data-scrollent^=fade-bottom]{transform:translate3d(0,var(--sl-dx),0)}")),document.head.appendChild(a)}}catch(t){console.error("vite-plugin-css-injected-by-js",t)}})();
const p = (n) => {
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
    offset: 120,
    // Number (in px)
    distance: "20px",
    // CSS
    delay: 0
    // Number (in ms)
  };
  if (!n)
    return t;
  for (const e in t)
    t.hasOwnProperty(e) && !n.hasOwnProperty(e) && (n[e] = t[e]);
  return n;
}, d = {
  cShow: "scrollent-show",
  cReady: "scrollent-ready-to-show",
  updateClass(n) {
    n.refs.forEach((t) => {
      for (let e = 0; e < t.children.length; e++) {
        let s = t.children[e], r = s.percent, i = s.offset, h = s.delay;
        if (i) {
          let o = window.innerHeight;
          r = i / o;
        }
        if (r) {
          if (t.percentage > r) {
            if (s.once && t.children.splice(e, 1), t.percentage > 1 && s.reentrant) {
              s.dom.classList.remove(this.cReady, this.cShow);
              continue;
            }
            if (s.dom.classList.contains(this.cShow))
              continue;
            if (h) {
              if (s.dom.classList.contains(this.cReady))
                continue;
              s.dom.classList.add(this.cReady), setTimeout(() => {
                (t.percentage > r || s.once) && s.dom.classList.add(this.cShow), s.dom.classList.remove(this.cReady);
              }, h);
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
  initStyle(n) {
    n.targets.forEach((t) => {
      t.dom.classList.remove(this.cReady, this.cShow), t.dom.style.setProperty("--sl-dur", t.duration), t.dom.style.transitionTimingFunction = n.easing, t.dom.style.setProperty("--sl-dx", t.distance.x), t.dom.style.setProperty("--sl-dy", t.distance.y), t.dom.classList.add("scrollent-init");
    });
  }
};
class u {
  constructor(t) {
    this.options = t, t.root.addEventListener("scroll", () => {
      this.handleScroll();
    });
  }
  handleScroll() {
    this.updatePercentage(), d.updateClass(this.options);
  }
  updatePercentage() {
    for (let t = 0; t < this.options.refs.length; t++) {
      let e = this.options.refs[t].ref, s = window.innerHeight, r = e.getBoundingClientRect(), i = 1 - (r.top + r.height) / (s + r.height);
      i !== this.options.refs[t].percentage && (this.options.refs[t].events.trigger("percentageChanged", {
        from: this.options.refs[t].percentage,
        to: i
      }), this.options.refs[t].percentage = i);
    }
  }
  destroy() {
    options.root.removeEventListener("scroll", () => {
      this.handleScroll();
    });
  }
}
class g {
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
        this.options.targets[s].dom == t.target && this.options.targets[s].events.on(t.event, e);
      return;
    }
    console.error(`[Scrollent] Unknown event name: ${t.event}`);
  }
  trigger(t, e) {
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
class a {
  constructor(t = "target") {
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
class y {
  constructor(t) {
    this.options = p(t);
  }
  init() {
    return this.scan(), this.refs = this.options.refs, this.targets = this.options.targets, this.render = d, this.events = new g(this.options), this.listener = new u(this.options), window.addEventListener(this.options.startEvent, (t) => {
      this.refresh();
    }), this.refresh(), this;
  }
  scan() {
    this.options.targets = [], this.options.refs = [], document.querySelectorAll("[data-scrollent]").forEach((t) => {
      let e = {
        dom: t,
        events: new a("target")
      }, r = (t.getAttribute("data-scrollent-distance") || this.options.distance).split(" ");
      e.distance = {
        x: r[0],
        y: r[1]
      }, e.distance.y || (e.distance.y = e.distance.x);
      let i = t.getAttribute("data-scrollent-percent");
      i === "" && (e.percent = this.options.percent), i && (e.percent = parseFloat(i), i.includes("%") && (e.percent = parseFloat(i) / 100));
      let h = t.getAttribute("data-scrollent-offset");
      (h || h === "") && (e.offset = parseInt(h) || this.options.offset), !e.offset && !e.percent && (e.percent = this.options.percent);
      let o = t.getAttribute("data-scrollent-delay") || this.options.delay;
      typeof o == "string" && (o = parseInt(o)), o <= 0 && (o = !1), e.delay = o, e.once = !1;
      let l = t.getAttribute("data-scrollent-once");
      (l || l === "" || this.options.once) && l !== "false" && (e.once = !0), e.reentrant = !1;
      let c = t.getAttribute("data-scrollent-reentrant");
      (c || c === "" || this.options.reentrant) && c !== "false" && (e.reentrant = !0), e.duration = t.getAttribute("data-scrollent-duration") || this.options.duration, typeof e.duration == "string" && (e.duration = parseInt(e.duration));
      let f = t.getAttribute("data-scrollent-ref");
      f && (e.ref = document.querySelector(f)), e.ref || (e.ref = t), this.options.targets.push(e);
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
  refresh(t = !1, e = this.options.duration) {
    t && this.scan(), this.render.initStyle(this.options), setTimeout(() => {
      this.listener.updatePercentage(), this.render.updateClass(this.options);
    }, e);
  }
}
export {
  y as default
};
