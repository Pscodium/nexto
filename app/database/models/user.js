const { DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");


/**
 * @typedef User
 * @type {object}
 * @property {number} id
 * @property {boolean} isActivated
 * @property {string} email
 * @property {string} name
 * @property {Date} createdAt
 * @property {Date} updatedAt
 * @property {(plainText: string) => string} authenticate
 */

/**
 *
 * @param {import('sequelize').Sequelize} sequelize
 * @returns
 */
module.exports = function User(sequelize) {
    const User = sequelize.define("user", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    User.encryptPassword = function (password) {
        // eslint-disable-next-line no-sync
        this.password = bcrypt.hashSync(password, 8);
        return this.password;
    };

    User.prototype.authenticate = async function (requestPassword, currentPassword) {
        return await bcrypt.compare(requestPassword, currentPassword);
    };

    return User;
};
