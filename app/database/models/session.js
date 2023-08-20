const { DataTypes } = require("sequelize");

/**
 * @typedef Session
 * @type {object}
 * @property {number} sessionId
 * @property {string} jwt
 * @property {number} userId
 */

/**
 *
 * @param {import('sequelize').Sequelize} sequelize
 * @param {import('sequelize')} Sequelize
 * @returns
 */
module.exports = function Session(sequelize) {
    const Session = sequelize.define("session", {
        sessionId: {
            type: DataTypes.UUID,
            defaultValue: sequelize.Sequelize.UUIDV4,
            primaryKey: true
        },
        jwt: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
    }, {
        associate: function(models) {
            Session.belongsTo(models.User, {
                foreignKey: 'userId',
                onDelete: "cascade"
            });
        }
    });


    return Session;
};
