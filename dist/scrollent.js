(function(){"use strict";try{if(typeof document<"u"){var a=document.createElement("style");a.id="scrollent",a.appendChild(document.createTextNode("[data-scrollent]{opacity:0;transition-duration:calc(var(--sl-dur) * 1ms)}[data-scrollent^=none]{opacity:1}[data-scrollent^=fade]{opacity:0;transition-property:opacity,transform}[data-scrollent^=fade].scrollent-show{opacity:1;transform:none}[data-scrollent^=fade-right]{transform:translate3d(var(--sl-dx),0,0)}[data-scrollent^=fade-left]{transform:translate3d(calc(-1 * var(--sl-dx)),0,0)}[data-scrollent^=fade-left-top]{transform:translate3d(calc(-1 * var(--sl-dx)),calc(-1 * var(--sl-dy)),0)}[data-scrollent^=fade-right-top]{transform:translate3d(var(--sl-dx),calc(-1 * var(--sl-dy)),0)}[data-scrollent^=fade-top]{transform:translate3d(0,calc(-1 * var(--sl-dy)),0)}[data-scrollent^=fade-left-bottom]{transform:translate3d(calc(-1 * var(--sl-dx)),var(--sl-dy),0)}[data-scrollent^=fade-right-bottom]{transform:translate3d(var(--sl-dx),var(--sl-dy),0)}[data-scrollent^=fade-bottom]{transform:translate3d(0,var(--sl-dx),0)}")),document.head.appendChild(a)}}catch(t){console.error("vite-plugin-css-injected-by-js",t)}})();
const p = (i) => {
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
  if (!i)
    return t;
  for (const e in t)
    t.hasOwnProperty(e) && !i.hasOwnProperty(e) && (i[e] = t[e]);
  return i;
}, d = {
  cShow: "scrollent-show",
  cReady: "scrollent-ready-to-show",
  updateClass(i) {
    i.refs.forEach((t) => {
      for (let e = 0; e < t.children.length; e++) {
        let s = t.children[e], r = s.percent, n = s.offset, l = s.delay;
        if (n) {
          let o = window.innerHeight;
          r = n / o;
        }
        if (r) {
          if (t.percentage > r) {
            if (s.once && t.children.splice(e, 1), t.percentage > 1 && s.reentrant) {
              s.dom.classList.remove(this.cReady, this.cShow);
              continue;
            }
            if (s.dom.classList.contains(this.cShow))
              continue;
            if (l) {
              if (s.dom.classList.contains(this.cReady))
                continue;
              s.dom.classList.add(this.cReady), s.delayTimer && clearTimeout(s.delayTimer), s.delayTimer = setTimeout(() => {
                (t.percentage > r || s.once) && s.dom.classList.add(this.cShow), s.dom.classList.remove(this.cReady);
              }, l);
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
  initStyle(i) {
    i.targets.forEach((t) => {
      t.dom.classList.remove(this.cReady, this.cShow), t.dom.style.setProperty("--sl-dur", t.duration), t.dom.style.transitionTimingFunction = i.easing, t.dom.style.setProperty("--sl-dx", t.distance.x), t.dom.style.setProperty("--sl-dy", t.distance.y), t.dom.classList.add("scrollent-init");
    });
  }
};
class u {
  constructor(t) {
    this.options = t, this.scrollTimer, t.root.addEventListener("scroll", () => {
      this.handleScroll();
    });
  }
  handleScroll() {
    this.scrollTimer || (this.scrollTimer = setTimeout(() => {
      this.updatePercentage(), d.updateClass(this.options), clearTimeout(this.scrollTimer), this.scrollTimer = null;
    }, 50));
  }
  updatePercentage() {
    for (let t = 0; t < this.options.refs.length; t++) {
      let e = this.options.refs[t].ref, s = window.innerHeight, r = e.getBoundingClientRect(), n = 1 - (r.top + r.height) / (s + r.height);
      n !== this.options.refs[t].percentage && (this.options.refs[t].events.trigger("percentageChanged", {
        from: this.options.refs[t].percentage,
        to: n
      }), this.options.refs[t].percentage = n);
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
        events: new a()
      }, r = (t.getAttribute("data-scrollent-distance") || this.options.distance).split(" ");
      e.distance = {
        x: r[0],
        y: r[1]
      }, e.distance.y || (e.distance.y = e.distance.x);
      let n = t.getAttribute("data-scrollent-percent");
      n === "" && (e.percent = this.options.percent), n && (e.percent = parseFloat(n), n.includes("%") && (e.percent = parseFloat(n) / 100));
      let l = t.getAttribute("data-scrollent-offset");
      (l || l === "") && (e.offset = parseInt(l) || this.options.offset), !e.offset && !e.percent && (e.percent = this.options.percent);
      let o = t.getAttribute("data-scrollent-delay") || this.options.delay;
      typeof o == "string" && (o = parseInt(o)), o <= 0 && (o = !1), e.delay = o, e.once = !1;
      let h = t.getAttribute("data-scrollent-once");
      (h || h === "" || this.options.once) && h !== "false" && (e.once = !0), e.reentrant = !1;
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
        events: new a(),
        children: [t]
      });
    });
  }
  refresh(t = !1, e = this.options.duration) {
    t && (console.log("force"), this.scan()), this.render.initStyle(this.options), setTimeout(() => {
      this.listener.updatePercentage(), this.render.updateClass(this.options);
    }, e);
  }
}
export {
  y as default
};
