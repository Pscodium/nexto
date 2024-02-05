const { DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");
const ENUMS = require("../../utils/enums/index");

/**
 * @typedef User
 * @type {object}
 * @property {number} id
 * @property {string} nickname
 * @property {string} external_id
 * @property {ENUMS.UserRoles} role
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
 * @returns {ModelCtor<Model<any, any>>}
 */
module.exports = function Users(sequelize) {
    const Users = sequelize.define("users", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        nickname: {
            type: DataTypes.STRING,
            allowNull: false
        },
        external_id: {
            type: DataTypes.STRING,
            allowNull: true
        },
        role: {
            type: DataTypes.ENUM(ENUMS.values(ENUMS.UserRoles)),
            defaultValue: ENUMS.UserRoles.DEFAULT,
            allowNull: true
        },
        status: {
            type: DataTypes.ENUM(ENUMS.values(ENUMS.UserStatus)),
            defaultValue: ENUMS.UserStatus.ACTIVE,
            allowNull: true
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
    }, {
        associate: function (models) {
            Users.belongsTo(models.Permissions);
        }
    });

    Users.encryptPassword = function (password) {
        // eslint-disable-next-line no-sync
        this.password = bcrypt.hashSync(password, 8);
        return this.password;
    };

    Users.passwordValidate = async function (password) {
        const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/g;
        return regex.test(password);
    };

    Users.prototype.authenticate = async function (requestPassword, currentPassword) {
        return await bcrypt.compare(requestPassword, currentPassword);
    };

    return Users;
};
