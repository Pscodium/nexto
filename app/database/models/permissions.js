const { DataTypes } = require("sequelize");
const enums = require("../../utils/enums/index");

/**
 * @typedef Permissions
 * @type {object}
 * @property {number} id
 */

/**
 *
 * @param {import('sequelize').Sequelize} sequelize
 * @returns
 */
const permissions_model = {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    }
};

/**
 *
 * @param {import('sequelize').Sequelize} sequelize
 * @returns
 */
module.exports = function Permissions(sequelize) {
    Object.keys(enums.Permissions).forEach(key => {
        permissions_model[enums.Permissions[key]] = {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        };
    });

    const Permissions = sequelize.define("permissions", permissions_model, {
        timestamps: false,
        associate: function (models) {
            Permissions.belongsTo(models.Users);
        }
    });

    return Permissions;
};
