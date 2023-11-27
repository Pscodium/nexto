require('dotenv').config();
process.env.PRE_SYNC_DATABASE = true;
const { db } = require('./database/connection');
const express = require('express');
const { Router } = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const routeInitialization = require('./routes/config');
const { logs } = require('./middleware/logs');
const authentication = require('./middleware/authentication');
let app = express();

if (db.sequelize) {
    db.sequelize.authenticate()
    .then(() => {
        const allowedOrigins = [process.env.FRONTEND_ORIGIN];

        const options = {
            origin: String(allowedOrigins)
        };

        const router = Router();
        const routes = routeInitialization(router, authentication);

        app.use(bodyParser.json());
        app.use(cors(options));
        app.use(logs);
        app.use(routes);

        app.listen(3000);


        console.log("Connection established!");
    })
    .catch((err) => {
        console.error("Error authenticating database: ", err);
    });

}

module.exports = app;