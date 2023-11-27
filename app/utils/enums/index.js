/* eslint-disable no-prototype-builtins */
const ENUMS = {
    UserRoles: {
        "ADMIN": "admin",
        "DEVELOPER": "developer",
        "OWNER": "owner",
        "CUSTOMER": "customer",
        "DEFAULT": "default"
    },
    Permissions: {
        "MASTER_ADMIN_LEVEL": 'master_admin_level',
        "MANAGE_ROLES": 'can_manage_roles',
        "MANAGE_USERS": 'can_manage_users',
        "DASHBOARD_ACCESS": 'can_access_dashboard',
        "CAN_SEE_MAP": "can_see_map",
        "CAN_EDIT_MAP": "can_edit_map",
    },
    values: function (enumObj) {
        return Object.keys(enumObj).map(function (key) {
            return enumObj[key];
        });
    },
    keys: (enumObj) => {
        return Object.keys(enumObj);
    }
};

/**
 * @type {ENUMS}
 */
const enums = {};

for (const enumKey in ENUMS) {
    if (ENUMS.hasOwnProperty(enumKey)) {
        enums[enumKey] = Object.freeze(ENUMS[enumKey]);
    }
}

/**
 * @typedef {ENUMS} enums
 */

module.exports = enums;