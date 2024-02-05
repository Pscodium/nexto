const permissions = require('../controllers/permissions.controller');
const enums = require('../utils/enums');

/**
 *
 * @param {import('../index')} app
 * @param {import('../middleware/authentication')} auth
 */
exports.init = function(app, auth) {
    app.post('/permission/insert/:id', auth.sessionOrJwt, auth.hasPermissions([enums.Permissions.CAN_MANAGE_USERS_PERMISSIONS]), permissions.updatePermission);
};