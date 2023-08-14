const users = require("../controllers/user.controller");

/**
 *
 * @param {import('../index')} app
 * @param {import('../middleware/authentication')} auth
 */
exports.init = function(app, auth) {
    app.get('/login', users.login);
    app.get('/session/login', users.session);
    app.post('/register', users.register);
    app.get('/test', auth.sessionOrJwt, users.test);
};
