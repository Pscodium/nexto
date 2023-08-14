const { DataTypes } = require("sequelize");

/**
 * @typedef Map
 * @type {object}
 * @property {string} title
 * @property {string} color
 * @property {number} latitude
 * @property {number} longitude
 * @property {object} area
 */

/**
 *
 * @param {import('sequelize').Sequelize} sequelize
 * @returns
 */
module.exports = function Map(sequelize) {
    const Map = sequelize.define('map', {
        title: {
            type: DataTypes.STRING,
            allowNull: true
        },
        color: {
            type: DataTypes.STRING,
            allowNull: false
        },
        latitude: {
            type: DataTypes.DECIMAL(10, 8),
            allowNull: false
        },
        longitude: {
            type: DataTypes.DECIMAL(11, 8),
            allowNull: false
        },
        area: {
            type: DataTypes.GEOMETRY,
            allowNull: true
        }
    }, {
        tableName: 'map',
        timestamps: true,
        associate: function (models) {
            Map.belongsTo(models.User);
        }
    });
    return Map;
};
