const users = require("../controllers/user.controller");

/**
 *
 * @param {import('../index')} app
 * @param {import('../middleware/authentication')} auth
 */
exports.init = function(app, auth) {
    app.get('/login', users.login);
    app.post('/session/login', users.session);
    app.post('/register', users.register);
    app.get('/data/user', auth.sessionOrJwt, users.getUserData);
};
