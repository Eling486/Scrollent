class Events {
    constructor(options) {
        this.events = {};
        this.options = options;

        this.allowedEvents = [
            'destroy'
        ]
    }

    on(data, callback) {
        if (typeof data == 'string') {
            if (this.test(data) && typeof callback === 'function') {
                if (!this.events[data]) {
                    this.events[data] = [];
                }
                this.events[data].push(callback);
            }
            return;
        }
    }

    refOn(data, callback) {
        if (Array.isArray(data)) {
            data = {
                event: data[0],
                ref: data[1]
            }
        }
        if (this.isDOM(data.ref) && typeof callback === 'function') {
            for (let i = 0; i < this.options.refs.length; i++) {
                if (this.options.refs[i].ref == data.ref) {
                    this.options.refs[i].events.on(data.event, callback)
                }
            }
        }
    }

    targetOn(data, callback) {
        if (Array.isArray(data)) {
            data = {
                event: data[0],
                target: data[1]
            }
        }
        if (this.isDOM(data.target) && typeof callback === 'function') {
            for (let i = 0; i < this.options.targets.length; i++) {
                if (this.options.targets[i].dom == data.target) {
                    this.options.targets[i].events.on(data.event, callback)
                }
            }
        }
    }

    trigger(name, data) {
        if (this.events[name] && this.events[name].length) {
            for (let i = 0; i < this.events[name].length; i++) {
                this.events[name][i](data);
            }
        }
    }

    isDOM (dom) {
        return (typeof dom === 'object' && dom.nodeType === 1 && typeof dom.nodeName === 'string')
    }

    test(name) {
        if (this.selectorEvents.indexOf(name) !== -1) {
            return true;
        } else {
            console.error(`Unknown event name: ${name}`);
            return null;
        }
    }
}

export default Events;
