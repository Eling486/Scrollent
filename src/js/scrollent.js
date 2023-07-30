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
        this.render = Render;
        this.events = new Events(this.options);
        this.listener = new Listener(this.options);
        window.addEventListener(this.options.startEvent , (event) => {
            this.refresh()
        });
        this.refresh()
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
                events: new DOMEvents()
            }
            let distance = dom.getAttribute(`data-scrollent-distance`) || this.options.distance
            let distanceArr = distance.split(' ')
            el.distance = {
                x: distanceArr[0],
                y: distanceArr[1]
            }
            if (!el.distance.y) {
                el.distance.y = el.distance.x
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
            let delay = dom.getAttribute(`data-scrollent-delay`) || this.options.delay;
            if (typeof delay == 'string') delay = parseInt(delay);
            if (delay <= 0) delay = false;
            el.delay = delay;


            /** Has [data-scrollent-once] or options.once ([data-scrollent-once] is not false) */
            el.once = false
            let once = dom.getAttribute(`data-scrollent-once`)
            if ((once || once === '' || this.options.once) && !(once === 'false')) {
                el.once = true
            };

            /** Has [data-scrollent-reentrant] or options.reentrant ([data-scrollent-reentrant] is not false) */
            el.reentrant = false
            let reentrant = dom.getAttribute(`data-scrollent-reentrant`)
            if ((reentrant || reentrant === '' || this.options.reentrant) && !(reentrant === 'false')) {
                el.reentrant = true
            };

            /** Has [data-scrollent-duration] */
            el.duration = dom.getAttribute(`data-scrollent-duration`) || this.options.duration
            if (typeof el.duration == 'string') el.duration = parseInt(el.duration);

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
                events: new DOMEvents(),
                children: [target]
            })
        })
    }

    refresh(force = false, delay = this.options.duration) {
        if(force){
            console.log('force')
            this.scan();
        }
        this.render.initStyle(this.options);
        setTimeout(()=>{
            this.listener.updatePercentage()
            this.render.updateClass(this.options);
        }, delay)
    }
}

export default Scrollent;