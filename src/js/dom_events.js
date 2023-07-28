class DOMEvents {
    constructor(type = 'target') {
        this.events = {}

        if (type == 'ref') {
            this.allowedEvents = [
                'percentageChanged',
            ]
        }
        if (type == 'target') {
            this.allowedEvents = [
                'in',
                'out'
            ]
        }
    }

    on(name, callback) {
        if (this.test(name) && typeof callback === 'function') {
            if (!this.events[name]) {
                this.events[name] = [];
            }
            this.events[name].push(callback);
        }
    }

    trigger(name, data) {
        if (this.events[name] && this.events[name].length) {
            for (let i = 0; i < this.events[name].length; i++) {
                this.events[name][i](data);
            }
        }
    }

    test(name) {
        if (this.allowedEvents.indexOf(name) !== -1) {
            return true;
        } else {
            console.error(`Unknown event name: ${name}`);
            return null;
        }
    }
}

export default DOMEvents;
