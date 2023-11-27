/* eslint-disable dot-notation */
require('dotenv').config();
const chai = require('chai');
const supertest = require('supertest');
const expect = chai.expect;
const app = require('../../app/index.js');
const { Router } = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const routeInitialization = require('../../app/routes/config.js');
const authentication = require('../../app/middleware/authentication');

const allowedOrigins = [process.env.FRONTEND_ORIGIN];

const options = {
    origin: String(allowedOrigins)
};

const router = Router();
const routes = routeInitialization(router, authentication);

app.use(bodyParser.json());
app.use(cors(options));
app.use(routes);

const agent = supertest.agent(app);
agent.on('response', async (response) => {
    if (response['req'].path === "/session/login") {
        authAgent(agent, response.body.token);
    }
    if (response['req'].path === "/session/logout") {
        logoutAgent(agent);
    }
});

function anotherAgent() {
    const thisAgent = supertest.agent(app);
    thisAgent.on('response', async (response) => {
        if (response['req'].path === "/session/login") {
            authAgent(thisAgent, response.body.token);
        }
        if (response['req'].path === "/session/logout") {
            logoutAgent(thisAgent);
        }
    });
    return thisAgent;
}

function authAgent(agent, token) {
    agent.use((req) => {
        req.set({ "Authorization": "Bearer " + token });
    });
}

function logoutAgent(agent) {
    agent.use((req) => {
        req.unset('Authorization');
    });
}



module.exports = { app, chai, expect, supertest, agent, anotherAgent };