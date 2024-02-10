const { DataTypes } = require("sequelize");

/**
 * @typedef Crash
 * @type {object}
 * @property {string} id
 * @property {number} prob
 * @property {boolean} marked
 * @property {number} winners
 * @property {number} losers
 */

/**
 *
 * @param {import('sequelize').Sequelize} sequelize
 * @returns
 */
module.exports = function Crash(sequelize) {
    const Crash = sequelize.define('crash', {
        id: {
            type: DataTypes.UUID,
            defaultValue: sequelize.Sequelize.UUIDV4,
            primaryKey: true
        },
        prob: {
            type: DataTypes.DECIMAL(20, 2),
            defaultValue: 0
        },
        marked: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        winners: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        losers: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    }, {
        tableName: 'crash',
        timestamps: true
    });
    return Crash;
};
