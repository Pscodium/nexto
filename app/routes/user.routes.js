const users = require("../controllers/user.controller");
const enums = require("../utils/enums");

/**
 *
 * @param {import('../index')} app
 * @param {import('../middleware/authentication')} auth
 */
exports.init = function(app, auth) {
    app.post('/register', auth.register);
    app.get('/login', auth.login);
    app.post('/session/login', auth.session);
    app.get('/session/logout', auth.sessionOrJwt, auth.sessionLogout);
    app.get('/data/user', auth.sessionOrJwt, users.getUserData);
    app.get('/users', auth.sessionOrJwt, users.getUsers);
    app.get('/user/:id', auth.sessionOrJwt, users.getUserById);
    app.get('/user/firebase/:uid', auth.sessionOrJwt, users.getUserByExternalId);
    app.delete('/user/:id', auth.sessionOrJwt, users.deleteUser);
    app.put('/user/update', auth.sessionOrJwt, users.userUpdateAccountInfo);
    app.put('/user/update/:id', auth.sessionOrJwt, auth.hasPermissions([enums.Permissions.MANAGE_USERS, enums.Permissions.MANAGE_ROLES]), users.updateUserById);
};
