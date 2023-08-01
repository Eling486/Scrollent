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
        window.addEventListener(this.options.startEvent, (event) => {
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

        document.querySelectorAll(`[data-scrollent]:not(.scrollent-init)`).forEach((dom) => {
            let el = {
                dom: dom,
                events: new DOMEvents(),
                params: {}
            }
            let attrName = this.options.attrName

            let param = dom.getAttribute(`data-scrollent`)
            let symX = 0
            let symY = 0
            let fadeReg = /(fade)?-?((left)|(right)|(down)|(up))((-left)|(-right)|(-down)|(-up))?/g
            let allowedX = ['left', 'right']
            let allowedY = ['up', 'down']
            let symXList = [1, -1]
            let symYList = [1, -1]
            let result = param.match(fadeReg)

            if (result) {
                let dashIndex = result[0].indexOf('-')
                if (dashIndex == 0) result = null
                if (dashIndex !== 0) result = result[0].substring(dashIndex + 1, result.Length)
            }
            if (result) {
                let resultArr = result.split('-')
                resultArr.forEach(key => {
                    let indexX = allowedX.indexOf(key)
                    let indexY = allowedY.indexOf(key)
                    if (indexX >= 0) symX = symXList[indexX]
                    if (indexY >= 0) symY = symYList[indexY]
                })
            }

            let distance = dom.getAttribute(`${attrName}-distance`) || this.options.distance
            let distanceArr = distance.split(' ')
            el.params.distance = {
                x: distanceArr[0],
                symX: symX,
                y: distanceArr[1] || distanceArr[0],
                symY: symY
            }

            let rotate = dom.getAttribute(`${attrName}-rotate`) || this.options.rotate
            let rotateArr = rotate.split(' ')
            if(rotateArr[0] == '-') rotateArr[0] = '0'
            if(rotateArr[1] == '-') rotateArr[1] = '0'
            el.params.rotate = {
                x: rotateArr[0] || rotateArr[1] || rotateArr[2],
                y: rotateArr[1] || rotateArr[0] || rotateArr[2],
                z: rotateArr[2] || rotateArr[0] || rotateArr[1]
            }

            let attrList = ['scale', 'easing', 'perspective', 'flip', 'zoom']

            for(let i = 0; i < attrList.length; i++){
                let attr = attrList[i]
                el.params[attr] = dom.getAttribute(`${attrName}-${attr}`) || this.options[attr]
            }

            if(param.indexOf('zoom') >= 0){
                el.params.scale = el.params.zoom
            }
            
            let flipSymX = 0
            let flipSymY = 0
            let flipReg = /(flip-)((left)|(right)|(down)|(up))/
            let resultFlip = param.match(flipReg)
            if(resultFlip) {
                let key =resultFlip[0].split('-')[1]
                let indexX = allowedX.indexOf(key)
                let indexY = allowedY.indexOf(key)
                if (indexX >= 0) {
                    flipSymX = symXList[indexX]
                    el.params.rotate.x = flipSymX * this.options.flip
                }
                if (indexY >= 0) {
                    flipSymY = symYList[indexY]
                    el.params.rotate.y = flipSymY * this.options.flip
                }
            }

            /** While reach the percent -> Animation */
            let percent = dom.getAttribute(`${attrName}-percent`)
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
            let offset = dom.getAttribute(`${attrName}-offset`)
            if (offset || offset === '') {
                el.offset = parseInt(offset) || this.options.offset
            }

            /** Default percent */
            if (!el.offset && !el.percent) {
                el.percent = this.options.percent
            }

            /** Has [data-scrollent-delay] and dalay > 0 */
            let delay = dom.getAttribute(`${attrName}-delay`) || this.options.delay;
            if (typeof delay == 'string') delay = parseInt(delay);
            if (delay <= 0) delay = false;
            el.delay = delay;

            /** Has [data-scrollent-once] or options.once ([data-scrollent-once] is not false) */
            el.once = false
            let once = dom.getAttribute(`${attrName}-once`)
            if ((once || once === '' || this.options.once) && !(once === 'false')) {
                el.once = true
            };

            /** Has [data-scrollent-reentrant] or options.reentrant ([data-scrollent-reentrant] is not false) */
            el.reentrant = false
            let reentrant = dom.getAttribute(`${attrName}-reentrant`)
            if ((reentrant || reentrant === '' || this.options.reentrant) && !(reentrant === 'false')) {
                el.reentrant = true
            };

            /** Has [data-scrollent-duration] */
            el.params.duration = dom.getAttribute(`${attrName}-duration`) || this.options.duration
            if (typeof el.params.duration == 'string') el.params.duration = parseInt(el.params.duration);

            
            /** Has [data-scrollent-ref] */
            let refQuery = dom.getAttribute(`${attrName}-ref`)
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
        if (force) {
            this.scan();
        }
        this.render.initStyle(this.options);
        setTimeout(() => {
            this.listener.updatePercentage()
            this.render.updateClass(this.options);
        }, delay)
    }
}

export default Scrollent;