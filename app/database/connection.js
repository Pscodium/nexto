/* eslint-disable no-unused-vars */
require('dotenv').config();
const disabled_logs = process.env.DISABLED_LOGS;
const { Sequelize, ModelStatic, Model } = require('sequelize');
const Users = require('./models/user');
const Session = require('./models/session');
const Map = require('./models/map');
const Crash = require('./models/crash');
const Permissions = require('./models/permissions');
const logger = require('../services/logs.service');
const pre_sync_database = process.env.PRE_SYNC_DATABASE;

const sequelize = new Sequelize(String(process.env.DB_NAME), String(process.env.DB_USER), String(process.env.DB_PASSWORD), {
    host: process.env.DB_HOST,
    port: String(process.env.DB_PORT),
    dialect: 'mysql',
    logging: false
});

/**
 * @typedef {object} dbProps
 * @property {Sequelize} sequelize
 *
 * @typedef {Object.<string, ModelStatic<Model<any, any>>>} models
 *
 * @typedef {dbProps & models} db
 */

/**
 *
 * @param {Sequelize} sequelize
 * @returns {db}
 */
function createDbObject(sequelize) {
    return {
        sequelize: sequelize,
        Users: Users(sequelize),
        Session: Session(sequelize),
        Map: Map(sequelize),
        Permissions: Permissions(sequelize),
        Crash: Crash(sequelize)
    };
}
const db = createDbObject(sequelize);

Object.keys(db).forEach(modelName => {
    // eslint-disable-next-line no-prototype-builtins
    if (db[modelName] && db[modelName].hasOwnProperty('options') && db[modelName].options.hasOwnProperty('associate')) {
        db[modelName].options.associate(db);
    }
});

if (pre_sync_database) {
    db.sequelize.sync({ alter: true, logging: false }).then(() => {
        if (!disabled_logs) {
            console.log(logger.available("All tables have been synchronized."));
        }
    });
}

module.exports = { db };
