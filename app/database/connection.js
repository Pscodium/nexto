const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
const User = require('./models/user');
const Session = require('./models/session');
const Map = require('./models/map');

dotenv.config();

const sequelize = new Sequelize(String(process.env.DB_NAME), String(process.env.DB_USER), String(process.env.DB_PASSWORD), {
    host: process.env.DB_HOST,
    dialect: 'mysql',
});

const db = {
    sequelize: sequelize,
    User: User(sequelize),
    Session: Session(sequelize),
    Map: Map(sequelize)
};

Object.keys(db).forEach(modelName => {
    // eslint-disable-next-line no-prototype-builtins
    if (db[modelName] && db[modelName].hasOwnProperty('options') && db[modelName].options.hasOwnProperty('associate')) {
        db[modelName].options.associate(db);
    }
});

sequelize.sync({ alter: true }).then(() => {
    console.log("All tables have been synchronized.");
});

module.exports = { sequelize, db };
