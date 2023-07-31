
module.exports = function routeInitialization(app, authenticate) {
    require('./user.routes').init(app, authenticate);

    return app;
};

