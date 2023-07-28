import handleOption from './options';
import Listener from './listener';
import Render from './render';
import Events from './events';
import DOMEvents from './dom_events'

class Scrollent {

    constructor(options) {
        this.options = handleOption(options);
    }

    init() {
        this.scan();
        this.refs = this.options.refs;
        this.targets = this.options.targets;
        this.events = new Events(this.options);
        this.listener = new Listener(this.options);
        this.render = Render;
        this.render.initStyle(this.options);
        return this
    }

    scan() {
        this.options.targets = [];
        this.options.refs = [];

        /**
         * this.options.targets[]:
         * 
         * [{
         *  dom: <DOM>,
         *  ref: <DOM>(ref)
         * }, ...]
         */

        document.querySelectorAll(`[data-scrollent]`).forEach((dom) => {
            let el = {
                dom: dom,
                events: new DOMEvents('target')
            }
            let translate = dom.getAttribute(`data-scrollent-translate`) || this.options.translate
            let translateArr = translate.split(' ')
            el.translate = {
                x: translateArr[0],
                y: translateArr[1]
            }
            if (!el.translate.y) {
                el.translate.y = el.translate.x
            }

            /** While reach the percent -> Animation */
            let percent = dom.getAttribute('data-scrollent-percent')
            if (percent === '') {
                el.percent = this.options.percent
            }
            if (percent) {
                el.percent = parseFloat(percent)
                if (percent.includes('%')) {
                    el.percent = parseFloat(percent) / 100
                }
            }

            /** While reach the offset -> Animation */
            let offset = dom.getAttribute('data-scrollent-offset')
            if (offset || offset === '') {
                el.offset = parseInt(offset) || this.options.offset
            }

            /** Default percent */
            if (!el.offset && !el.percent) {
                el.percent = this.options.percent
            }

            /** Has [data-scrollent-delay] and dalay > 0 */
            let delay = dom.getAttribute(`data-scrollent-delay`)
            if ((delay && parseInt(delay) > 0) || (delay === '' && this.options.delay > 0)) {
                el.delay = parseInt(delay) || this.options.delay
            }

            /** Has [data-scrollent-once] or options.once ([data-scrollent-once] is not false) */
            el.once = false
            let once = dom.getAttribute(`data-scrollent-once`)
            if (once || once === '' || (!(once === 'false') && this.options.once)) {
                el.once = true
            };

            /** Has [data-scrollent-reentrant] or options.reentrant ([data-scrollent-reentrant] is not false) */
            el.reentrant = false
            let reentrant = dom.getAttribute(`data-scrollent-reentrant`)
            if (reentrant || reentrant === '' || (!(reentrant === 'false') && this.options.reentrant)) {
                el.reentrant = true
            };

            /** Has [data-scrollent-duration] */
            el.duration = dom.getAttribute(`data-scrollent-duration`) || this.options.duration

            /** Has [data-scrollent-ref] */
            let refQuery = dom.getAttribute(`data-scrollent-ref`)
            if (refQuery) {
                el.ref = document.querySelector(refQuery)
            }
            if (!el.ref) {
                el.ref = dom
            }
            this.options.targets.push(el)
        })

        /**
         * this.options.refs[]:
         * 
         * [{
         *  ref: <DOM>(ref),
         *  children: [<DOM>, ...]
         * }, ...]
         */

        this.options.targets.forEach((target) => {
            for (let i = 0; i < this.options.refs.length; i++) {
                if (this.options.refs[i].ref == target.ref) {
                    return this.options.refs[i].children.push(target)
                }
            }
            return this.options.refs.push({
                ref: target.ref,
                events: new DOMEvents('ref'),
                children: [target]
            })
        })
    }
}

export default Scrollent;