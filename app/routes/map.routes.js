const map = require('../controllers/map.controller');
const enums = require('../utils/enums');

/**
 *
 * @param {import('../index')} app
 * @param {import('../middleware/authentication')} auth
 */
exports.init = function(app, auth) {
    app.post('/api/map/pin/create', auth.sessionOrJwt, auth.hasPermissions([enums.Permissions.CAN_EDIT_MAP, enums.Permissions.CAN_EDIT_MAP]), map.createPin);
    app.get('/api/map/pins', auth.sessionOrJwt, auth.hasPermissions([enums.Permissions.CAN_SEE_MAP]), map.allPins);
    app.get('/api/map/pin/:id', auth.sessionOrJwt, auth.hasPermissions([enums.Permissions.CAN_EDIT_MAP]), map.getPinById);
    app.put('/api/map/pin/:id', auth.sessionOrJwt, auth.hasPermissions([enums.Permissions.CAN_EDIT_MAP, enums.Permissions.CAN_EDIT_MAP]), map.updatePinById);
    app.delete('/api/map/pin/:id', auth.sessionOrJwt, auth.hasPermissions([enums.Permissions.CAN_EDIT_MAP, enums.Permissions.CAN_EDIT_MAP]), map.deletePinById);
};