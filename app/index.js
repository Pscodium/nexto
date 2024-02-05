/* eslint-disable no-sync */
require('dotenv').config();
process.env.PRE_SYNC_DATABASE = true;
const disabled_logs = process.env.DISABLED_LOGS;
const { db } = require('./database/connection');
const express = require('express');
const https = require('https');
const fs = require('fs');
const { Router } = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const routeInitialization = require('./routes/config');
const logger = require('./services/logs.service');
const { logs } = require('./middleware/logs');
const authentication = require('./middleware/authentication');
const app = express();
const privateKey = fs.readFileSync('app/ssl/server.key');
const certificate = fs.readFileSync('app/ssl/server.cert');

function start() {
    try {
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

                    https
                        .createServer({
                            key: privateKey,
                            cert: certificate
                        }, app)
                        .listen(8000);
                    app.listen(3000);

                    if (!disabled_logs) {
                        console.log(logger.success("Connection established!"));
                    }
                })
                .catch((err) => {
                    console.error(logger.alert("Error authenticating database: ", err));
                });

        }
    } catch (err) {
        console.error(`[Server Error] - ${err.message}`);
    }
}

start();
exports.start = start;
module.exports = app;