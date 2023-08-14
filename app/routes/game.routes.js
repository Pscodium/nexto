const game = require('../controllers/game.controller');

/**
 *
 * @param {import('../index')} app
 * @param {import('../middleware/authentication')} auth
 */
exports.init = function(app, auth) {
    app.get('/api/game/probs', auth.sessionOrJwt, game.shuffleGameProbabilities);
};