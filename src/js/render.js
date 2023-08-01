const Render = {
    cShow: 'scrollent-show',
    cReady: 'scrollent-ready-to-show',
    updateClass(options) {
        options.refs.forEach(ref => {
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
                        if (target.once) {
                            ref.children.splice(i, 1)
                        }
                        if (ref.percentage > 1 && target.reentrant) {
                            target.dom.classList.remove(this.cReady, this.cShow);
                            continue;
                        }
                        if (target.dom.classList.contains(this.cShow)) continue;
                        if (delay) {
                            if (target.dom.classList.contains(this.cReady)) continue;
                            target.dom.classList.add(this.cReady);
                            if (target.delayTimer) clearTimeout(target.delayTimer);
                            target.delayTimer = setTimeout(() => {
                                if (ref.percentage > percent || target.once) {
                                    target.dom.classList.add(this.cShow);
                                }
                                target.dom.classList.remove(this.cReady);
                                return;
                            }, delay);
                            continue;
                        }
                        target.dom.classList.add(this.cShow);
                        continue;
                    }
                    target.dom.classList.remove(this.cReady, this.cShow);
                    continue;
                }
            }
        });
    },
    initStyle(options) {
        options.targets.forEach(target => {
            target.dom.classList.remove(this.cReady, this.cShow);
            target.dom.style.setProperty('--sl-dur', target.params.duration);
            target.dom.style.setProperty('--sl-eas', target.params.easing);
            target.dom.style.setProperty('--sl-dsx', target.params.distance.symX);
            target.dom.style.setProperty('--sl-dsy', target.params.distance.symY);
            target.dom.style.setProperty('--sl-dx', target.params.distance.x);
            target.dom.style.setProperty('--sl-dy', target.params.distance.y);
            target.dom.style.setProperty('--sl-rx', target.params.rotate.x);
            target.dom.style.setProperty('--sl-ry', target.params.rotate.y);
            target.dom.style.setProperty('--sl-rz', target.params.rotate.z);
            target.dom.style.setProperty('--sl-s', target.params.scale);
            target.dom.style.setProperty('--sl-per', target.params.perspective);
            target.dom.classList.add('scrollent-init')
        })
    }
}

export default Render