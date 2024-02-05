
const jwt = require('jsonwebtoken');
const { db } = require('../database/connection');
const moment = require('moment');
const permissionsService = require('../services/permissions.service');
const { lResCleaner } = require('../services/request.service');
const { FirebaseService } = require('../services/firebase.service');
require('dotenv').config();

class AuthService {

    /**
     *
     * @param {Request} req
     * @param {Response} req
     * @param {import('express').NextFunction} next
     */
    async jwt(req, res, next) {
        const { authorization } = req.headers;

        if (!authorization) {
            return res.sendStatus(401);
        }

        const token = authorization.replace("Bearer", '').trim();

        try {
            const data = jwt.verify(token, String(process.env.JWT_SECRET_KEY));

            const { id } = data;

            const user = await db.Users.findOne({
                where: { id: id },
                include: {
                    model: db.Permissions,
                    attributes: {
                        exclude: ['createdAt', 'updatedAt', 'id']
                    }
                }
            });
            if (!user) {
                throw new Error("User not found");
            }

            delete user.dataValues.password;

            req.user = user;
            req.userId = id;
            req.is_master_admin = user.permission.master_admin_level;

            return next();

        } catch (err) {
            return res.sendStatus(401);
        }
    }

    /**
     *
     * @param {Request} req
     * @param {Response} req
     * @param {import('express').NextFunction} next
     */
    async uuid(req, res, next) {
        const { authorization } = req.headers;

        if (!authorization) {
            return res.sendStatus(401);
        }

        const token = authorization.replace("Bearer", '').trim();

        try {
            const data = await db.Session.findOne({
                where: {
                    expiration_date: db.sequelize.literal('expiration_date > NOW()'),
                    sessionId: token
                }
            });

            if (!data) {
                return res.status(401).json({ error: "Invalid sessionId." });
            }

            const user = await db.Users.findOne({
                where: { id: data.userId },
                include: {
                    model: db.Permissions,
                    attributes: {
                        exclude: ['createdAt', 'updatedAt', 'id']
                    }
                }
            });
            if (!user) {
                throw new Error("User not found");
            }

            delete user.dataValues.password;

            req.user = user;
            req.userId = user.id;
            req.is_master_admin = user.permission.master_admin_level;

            return next();

        } catch (err) {
            return res.sendStatus(401);
        }
    }

    async login(req, res) {
        const { password, email } = req.body;

        const user = await db.Users.findOne({
            where: { email: email },
            include: {
                model: db.Permissions,
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'id']
                }
            }
        });

        if (!user) {
            return res.sendStatus(404).json({ message: "Email does not exist."});
        }

        try {
            const validatePassword = await user.authenticate(password, user.password);
            if (!validatePassword) {
                return res.status(401).json({ success: false });
            }

            const token = jwt.sign({ id: user.id }, String(process.env.JWT_SECRET_KEY), { expiresIn: '1d' });

            const sessionExists = await db.Session.findOne({
                where: {
                    userId: user.id,
                }
            });
            if (!sessionExists) {
                const newToken = await db.Session.create({
                    expiration_date: moment().add(3, 'day').valueOf(),
                    jwt: token
                });
                newToken.setUser(user);
                await newToken.save();
            } else {
                await db.Session.update({
                    jwt: token
                }, {
                    where: {
                        userId: user.id
                    }
                });
            }

            user.dataValues.token = token;
            delete user.dataValues.password;

            return res.json(user);
        } catch (err) {
            return res.status(500).json({ success: false });
        }
    }

    async register(req, res) {
        try {
            const body = req.body;
            const userExists = await db.Users.findOne({ where: { email: req.body.email }});
            if (userExists) {
                return res.status(409).json({ message: "Email already exists."});
            }
            const passwordValidate = await db.Users.passwordValidate(body.password);
            if (!passwordValidate) {
                return res.status(400).json({ message: "Missing password requirements"});
            }
            const passwordHashed = db.Users.encryptPassword(body.password);

            const permissions = await db.Permissions.create();
            const user = await db.Users.create({
                email: body.email,
                firstName: body.firstName,
                lastName: body.lastName,
                nickname: body.nickname,
                password: passwordHashed,
            });
            await user.setPermission(permissions);
            await permissions.save();
            await permissions.setUser(user);

            const firebaseService = new FirebaseService();

            const uid = await firebaseService.createFirebaseUser({
                email: body.email,
                password: body.password,
                firstName: body.firstName,
                lastName: body.lastName,
                nickname: body.nickname,
                id: user.id,
                permissionId: permissions.id,
                role: user.role
            });

            user.external_id = uid;
            await user.save();

            delete user.dataValues.password;

            return res.json(user);
        } catch (err) {
            console.error(err);
            return res.status(404).json({ success: false, message: "Error creating user. Verify request body to validate this error."});
        }
    }

    async session(req, res) {
        const { password, email } = req.body;
        try {

            const user = await db.Users.findOne({
                where: { email: email },
                attributes: {
                    exclude: ['permissionId']
                },
                include: {
                    model: db.Permissions,
                    attributes: {
                        exclude: ['createdAt', 'updatedAt', 'id', 'userId']
                    }
                }
            });

            if (!user) {
                return res.status(404).json({ Stack: "[AuthenticationError] - E-mail does not exist."});
            }

            const validatePassword = await user.authenticate(password, user.password);
            if (!validatePassword) {
                return res.status(404).json({ success: false });
            }
            await lResCleaner(user.dataValues);

            const sessionExists = await db.Session.findOne({
                where: {
                    userId: user.id
                }
            });

            if (sessionExists) {
                await db.Session.destroy({
                    where: {
                        userId: user.id
                    }
                });
                const session = await db.Session.create({
                    expiration_date: moment().add(3, 'day').valueOf(),
                    jwt: null
                });
                session.setUser(user);
                await session.save();

                user.dataValues.token = session.sessionId;
                return res.json(user);
            }

            const newSession = await db.Session.create({
                expiration_date: moment().add(3, 'day').valueOf(),
                jwt: null
            });
            newSession.setUser(user);
            await newSession.save();

            user.dataValues.token = newSession.sessionId;
            return res.json(user);
        } catch (err) {
            return res.status(500).json({ Stack: `[AuthenticateError] - ${err}`});
        }
    }

    /**
     *
     * @param {Request} req
     * @param {Response} req
     */
    async sessionLogout(req, res) {
        try {
            const deletedSessions = await db.Session.destroy({
                where: {
                    userId: req.userId
                }
            });
            if (deletedSessions > 0) {
                return res.status(200).json({
                    success: true,
                });
            } else {
                return res.status(401).json({ message: "Not Authorized"});
            }
        } catch (err) {
            return res.status(403).json({ message: err.message });
        }
    }

    /**
     *
     * @param {Request} req
     * @param {Response} req
     * @param {import('express').NextFunction} next
     */
    async sessionOrJwt(req, res, next) {
        const { authorization } = req.headers;

        if (!authorization) {
            return res.sendStatus(401);
        }

        const token = authorization.replace("Bearer", '').trim();
        const tokenLength = token.length;

        if (tokenLength <= 36) {
            try {
                const data = await db.Session.findOne({
                    where: {
                        expiration_date: db.sequelize.literal('expiration_date > NOW()'),
                        sessionId: token
                    }
                });

                if (!data) {
                    return res.status(401).json({ error: "Invalid sessionId." });
                }

                const user = await db.Users.findOne({
                    where: { id: data.userId },
                    attributes: {
                        exclude: ['password']
                    },
                    include: {
                        model: db.Permissions,
                        attributes: {
                            exclude: ['createdAt', 'updatedAt', 'id']
                        }
                    }
                });
                if (!user) {
                    throw new Error("User not found");
                }

                req.user = user;
                req.userId = user.id;
                req.is_master_admin = user.permission.master_admin_level;

                return next();

            } catch (err) {
                return res.sendStatus(401);
            }
        } else {
            try {
                const data = jwt.verify(token, String(process.env.JWT_SECRET_KEY));

                const { id } = data;

                const user = await db.Users.findOne({
                    where: { id: id },
                    include: {
                        model: db.Permissions,
                        attributes: {
                            exclude: ['createdAt', 'updatedAt', 'id']
                        }
                    }
                });
                if (!user) {
                    throw new Error("User not found");
                }

                delete user.dataValues.password;

                req.user = user;
                req.userId = id;
                req.is_master_admin = user.permission.master_admin_level;

                return next();

            } catch (err) {
                return res.sendStatus(401);
            }
        }
    }

    hasPermissions(permissions) {
        if (!Array.isArray(permissions)) {
            permissions = [permissions];
        }

        return function(req, res, next) {
            if (!req.user) {
                return res.sendStatus(403);
            } else if (req.is_master_admin) {
                return next();
            }
            permissionsService.hasPermissions(req.userId, permissions)
                .then(function(result) {
                    if (result) {
                        return next();
                    }
                    return res.status(401).json({ permissions: "You don't have permissions for use this route."});
                })
                .catch(function(err) {
                    console.error(err);
                    return res.sendStatus(500);
                });
        };
    }
}

module.exports = new AuthService();