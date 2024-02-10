const logger = require('../services/logs.service');

class EventTrigger {
    constructor() {
        this.timeouts = {};
        this.event = {};
    }

    /**
     * @typedef {Object} EventClass
     * @property {() => void} start
     * @property {() => void} stop
     * @property {() => void} reset
     */

    /**
     *
     * @param {string} name
     * @param {EventClass} event
     * @param {number} time
     * @returns
     */
    createEvent(name, event, time) {
        if (this.timeouts[name]) {
            console.log(logger.alert(`Event "${name}" is triggering.`));
            return;
        }
        this.event = event;
        console.log(logger.available(`Event "${name}" was triggered to activate in ${time} milisseconds.`));
        this.timeouts[name] = setInterval(() => {
            console.log(logger.success(`Event "${name}" triggered!`));
            event.start();
        }, time);
    }

    removeEvent(name) {
        if (this.timeouts[name]) {
            clearInterval(this.timeouts[name]);
            delete this.timeouts[name];
            this.event.stop();
            console.log(logger.warning(`Event "${name}" stopped.`));
        } else {
            console.log(`Event "${name}" is no longer triggering.`);
        }
    }
}
exports.EventTrigger = EventTrigger;