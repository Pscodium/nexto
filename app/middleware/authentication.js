
const jwt = require('jsonwebtoken');
const { db } = require('../database/connection');

exports.jwt = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.sendStatus(401);
    }

    const token = authorization.replace("Bearer", '').trim();

    try {
        const data = jwt.verify(token, String(process.env.JWT_SECRET_KEY));

        const { id } = data;

        const user = await db.User.findOne({ where: { id: id }});
        if (!user) {
            throw new Error("User not found");
        }

        delete user.dataValues.password;

        req.user = user;
        req.userId = id;

        return next();

    } catch (err) {
        return res.sendStatus(401);
    }
};

exports.uuid = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.sendStatus(401);
    }

    const token = authorization.replace("Bearer", '').trim();

    try {
        const data = await db.Session.findOne({ where: { sessionId: token }});

        if (!data) {
            return res.status(401).json({ error: "Invalid sessionId." });
        }

        const user = await db.User.findOne({ where: { id: data.userId }});
        if (!user) {
            throw new Error("User not found");
        }

        delete user.dataValues.password;

        req.user = user;
        req.userId = user.id;

        return next();

    } catch (err) {
        return res.sendStatus(401);
    }
};

exports.sessionOrJwt = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.sendStatus(401);
    }

    const token = authorization.replace("Bearer", '').trim();
    const tokenLength = token.length;

    if (tokenLength <= 36) {
        try {
            const data = await db.Session.findOne({ where: { sessionId: token }});

            if (!data) {
                return res.status(401).json({ error: "Invalid sessionId." });
            }

            const user = await db.User.findOne({ where: { id: data.userId }});
            if (!user) {
                throw new Error("User not found");
            }

            delete user.dataValues.password;

            req.user = user;
            req.userId = user.id;

            return next();

        } catch (err) {
            return res.sendStatus(401);
        }
    } else {
        try {
            const data = jwt.verify(token, String(process.env.JWT_SECRET_KEY));

            const { id } = data;

            const user = await db.User.findOne({ where: { id: id }});
            if (!user) {
                throw new Error("User not found");
            }

            delete user.dataValues.password;

            req.user = user;
            req.userId = id;

            return next();

        } catch (err) {
            return res.sendStatus(401);
        }
    }
};
