import Render from "./render"

class Listener {
    constructor(options) {
        this.options = options
        options.root.addEventListener('scroll', () => {
            this.handleScroll()
        })
        this.handleScroll()
    }

    handleScroll() {
        for (let i = 0; i < this.options.refs.length; i++) {
            let ref = this.options.refs[i].ref
            let windowHeight = window.innerHeight;
            let refRect = ref.getBoundingClientRect();
            if (refRect.top > windowHeight) {
                this.options.refs[i].percentage = 0
                continue;
            }
            /*if ((refRect.top + refRect.height) < 0) {
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
        Render.updateClass(this.options)
    }

    destroy() {
        options.root.removeEventListener('scroll', () => {
            this.handleScroll()
        })
    }
}

export default Listener