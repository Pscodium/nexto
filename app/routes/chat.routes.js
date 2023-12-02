const chat = require("../controllers/chat.controller");

/**
 *
 * @param {import('../index')} app
 * @param {import('../middleware/authentication')} auth
 */
exports.init = function(app, auth) {
    app.get('/chat/messages', auth.sessionOrJwt, chat.getMessages);
    app.post('/chat/message', auth.sessionOrJwt, chat.sendMessage);
};
