const { db } = require('../database/connection');
const enums = require("../utils/enums");


class Permissions {
    constructor() {
        this.permissions = enums.Permissions;
    }

    getPermissionByKey(key) {
        const permission = this.permissions[key];
        if (!permission) {
            return null;
        }
        return permission;
    }

    async hasPermissions(userId, permissions) {
        if (!Array.isArray(permissions)) {
            permissions = [permissions];
        }

        const user_permissions = await db.Permissions.findOne({
            where: {
                userId: userId
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'id']
            }
        });
        const hasPermissionList = permissions.filter(permission => user_permissions[permission] === true);

        return hasPermissionList.length === permissions.length;
    }

}
module.exports = new Permissions;
