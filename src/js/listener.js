import Render from "./render"

class Listener {
    constructor(options) {
        this.options = options
        this.scrollTimer;
        options.root.addEventListener('scroll', () => {
            this.handleScroll()
        })
    }

    handleScroll() {
        if(this.scrollTimer) return;
        this.scrollTimer = setTimeout(() => {
            this.updatePercentage()
            Render.updateClass(this.options)
            clearTimeout(this.scrollTimer);
            this.scrollTimer = null;
        }, 50)
    }

    updatePercentage() {
        for (let i = 0; i < this.options.refs.length; i++) {
            let ref = this.options.refs[i].ref
            let windowHeight = window.innerHeight;
            let refRect = ref.getBoundingClientRect();
            /*if (refRect.top > windowHeight) {
                this.options.refs[i].percentage = 0
                continue;
            }
            if ((refRect.top + refRect.height) < 0) {
                this.options.refs[i].percentage = 1
                continue;
            }*/
            let percentage = 1 - (refRect.top + refRect.height) / (windowHeight + refRect.height)
            if (percentage !== this.options.refs[i].percentage) {
                this.options.refs[i].events.trigger('percentageChanged', {
                    from: this.options.refs[i].percentage,
                    to: percentage
                })
                this.options.refs[i].percentage = percentage
            }
        }
    }

    destroy() {
        options.root.removeEventListener('scroll', () => {
            this.handleScroll()
        })
    }
}

export default Listener