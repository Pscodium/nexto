const chalk = require("chalk");

exports.alert = function(message) {
    return chalk.red(message);
};

exports.success = function(message) {
    return chalk.green(message);
};

exports.warning = function(message) {
    return chalk.hex("#FFB302")(message);
};

exports.caution = function(message) {
    return chalk.hex("#FCE83A")(message);
};

exports.waiting = function(message) {
    return chalk.hex("#87a2c7")(message);
};

exports.changed = function(message) {
    return chalk.hex("#3865a3")(message);
};

exports.available = function(message) {
    return chalk.hex("#2DCCFF")(message);
};

exports.unavailable = function(message) {
    return chalk.hex("#A4ABB6")(message);
};