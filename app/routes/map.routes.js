const map = require('../controllers/map.controller');

/**
 *
 * @param {import('../index')} app
 * @param {import('../middleware/authentication')} auth
 */
exports.init = function(app, auth) {
    app.post('/api/map/pin/create', auth.sessionOrJwt, map.createPin);
    app.get('/api/map/pins', auth.sessionOrJwt, map.allPins);
    app.get('/api/map/pin/:id', auth.sessionOrJwt, map.getPinById);
    app.put('/api/map/pin/:id', auth.sessionOrJwt, map.updatePinById);
    app.delete('/api/map/pin/:id', auth.sessionOrJwt, map.deletePinById);
};