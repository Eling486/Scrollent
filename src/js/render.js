const Render = {
    cShow: 'scrollent-show',
    cReady: 'scrollent-ready-to-show',
    updateClass(options) {
        options.refs.forEach(ref => {
            //ref.ref.setAttribute('data-scrollent-process', ref.percentage);
            for (let i = 0; i < ref.children.length; i++) {
                let target = ref.children[i]
                let percent = target.percent
                let offset = target.offset
                let delay = target.delay
                if (offset) {
                    let windowHeight = window.innerHeight;
                    percent = offset / windowHeight
                }
                if (percent) {
                    if (ref.percentage > percent) {
                        if (ref.percentage > 1 && target.reentrant) {
                            target.dom.classList.remove(this.cReady);
                            target.dom.classList.remove(this.cShow);
                            continue;
                        }
                        if (delay) {
                            if (
                                target.dom.classList.contains(this.cReady) ||
                                target.dom.classList.contains(this.cShow)
                            ) {
                                continue;
                            }
                            target.dom.classList.add(this.cReady);
                            setTimeout(() => {
                                target.dom.classList.add(this.cShow);
                                target.dom.classList.remove(this.cReady);
                                return;
                            }, delay);
                            if(target.once){
                                ref.children.splice(i, 1)
                            }
                            continue;
                        }
                        if(target.once){
                            ref.children.splice(i, 1)
                        }
                        target.dom.classList.add(this.cShow);
                        continue;
                    }
                    target.dom.classList.remove(this.cReady);
                    target.dom.classList.remove(this.cShow);
                    continue;
                }
            }
        });
    },
    initStyle(options) {
        options.targets.forEach(target => {
            target.dom.style.transitionDuration = target.duration
            target.dom.style.transitionTimingFunction = options.easing
            target.dom.style.setProperty('--sl-tlx', target.translate.x);
            target.dom.style.setProperty('--sl-tly', target.translate.y);
            target.dom.classList.add('scrollent-init')
        })
    }
}

export default Render