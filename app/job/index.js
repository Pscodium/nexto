const { EventTrigger } = require('./trigger');
const { MailSender } = require('./events/mail-sender');
const moment = require('moment');
const trigger = new EventTrigger();

/**
 *
 * @param {"hours" | "minutes" | "seconds"} type - O tipo de tempo ("hours", "minutes" ou "seconds").
 * @param {number} amount - A quantidade correspondente ao tipo de tempo.
 * @returns {number} - O valor convertido para milissegundos.
 */

function timeConverter(type, amount) {
    return moment.duration(amount, type).asMilliseconds();
}

exports.run = async () => {
    trigger.createEvent('mail-sender', new MailSender(), timeConverter('seconds', 10));
};

exports.pause = async () => {
    trigger.removeEvent('mail-sender');
};

this.run();