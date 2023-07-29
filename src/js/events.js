class Events {
    constructor(options) {
        this.events = {};
        this.options = options;

        this.allowedEvents = {
            instance: ['destroy'],
            ref: ['percentageChanged'],
            target: [
                'in',
                'out'
            ]
        }
    }

    on(data, callback) {
        if (typeof data == 'string') {
            if (this.test(data) && typeof callback === 'function') {
                if (!this.events[data]) {
                    this.events[data] = [];
                }
                return this.events[data].push(callback);
            }
            return;
        }
        if (Array.isArray(data)) {
            data = {
                event: data[0],
                dom: data[1]
            }
        }
        if(!this.isDOM(data.dom)){
            return console.error(`[Scrollent] the ref or target event needs to provide a DOM`);
        }
        if (this.test(data.event, 'ref') && this.isDOM(data.dom) && typeof callback === 'function'){
            for (let i = 0; i < this.options.refs.length; i++) {
                if (this.options.refs[i].ref == data.dom) {
                    this.options.refs[i].events.on(data.event, callback)
                }
            }
            return
        }
        if (this.test(data.event, 'target') && this.isDOM(data.dom) && typeof callback === 'function'){
            for (let i = 0; i < this.options.targets.length; i++) {
                if (this.options.targets[i].dom == data.target) {
                    this.options.targets[i].events.on(data.event, callback)
                }
            }
            return
        }
        console.error(`[Scrollent] Unknown event name: ${data.event}`);
        return
    }

    trigger(name, data) {
        if (this.events[name] && this.events[name].length) {
            for (let i = 0; i < this.events[name].length; i++) {
                this.events[name][i](data);
            }
        }
    }

    isDOM(dom) {
        return (typeof dom === 'object' && dom.nodeType === 1 && typeof dom.nodeName === 'string')
    }

    test(name, type = 'instance') {
        if (this.allowedEvents[type].indexOf(name) !== -1) {
            return true;
        }
        if(type == 'instance'){
            console.error(`[Scrollent] Unknown event name: ${name}`);
        }
        return false
    }
}

export default Events;
