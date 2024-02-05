
module.exports = function routeInitialization(app, authenticate) {
    require('./user.routes').init(app, authenticate);
    require('./game.routes').init(app, authenticate);
    require('./map.routes').init(app, authenticate);
    require('./chat.routes').init(app, authenticate);
    require('./permissions.routes').init(app, authenticate);
    return app;
};

