require('dotenv').config();
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
            this.loggingEvent(logger.alert(`Event "${name}" is triggering.`));
            return;
        }
        this.event = event;
        this.loggingEvent(logger.available(`Event "${name}" was triggered to activate in ${time} milisseconds.`));
        this.timeouts[name] = setInterval(() => {
            this.loggingEvent(logger.success(`Event "${name}" triggered!`));
            event.start();
        }, time);
    }

    /**
     *
     * @param {string} log
     */
    loggingEvent(log) {
        const logMid = process.env.LOG_MIDDLEWARE;
        if (logMid) {
            return;
        }
        console.log(log);
    }

    /**
     *
     * @param {string} name
     */
    removeEvent(name) {
        if (this.timeouts[name]) {
            clearInterval(this.timeouts[name]);
            delete this.timeouts[name];
            this.event.stop();
            this.loggingEvent(logger.warning(`Event "${name}" stopped.`));
        } else {
            this.loggingEvent(`Event "${name}" is no longer triggering.`);
        }
    }
}
exports.EventTrigger = EventTrigger;