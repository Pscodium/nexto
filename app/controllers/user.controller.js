const { db } = require('../database/connection');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const userExists = await db.User.findOne({ where: { email: req.body.email }});
        if (userExists) {
            return res.status(409).json({ message: "Email already exists."});
        }

        const user = db.User.build(req.body);
        user.password = db.User.encryptPassword(req.body.password);
        await user.save();

        delete user.dataValues.password;

        return res.json(user);
    } catch (err) {
        return res.status(404).json({ success: false, message: "Error creating user. Verify request body to validate this error."});
    }
};

exports.login = async (req, res) => {
    const { password, email } = req.body;

    const user = await db.User.findOne({
        where: { email }
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

        user.dataValues.token = token;
        delete user.dataValues.password;

        return res.json(user);
    } catch (err) {
        return res.status(401).json({ success: false });
    }
};

exports.session = async (req, res) => {
    const { password, email } = req.body;

    const user = await db.User.findOne({
        where: { email }
    });

    if (!user) {
        return res.sendStatus(404).json({ message: "Email does not exist."});
    }

    try {
        const validatePassword = await user.authenticate(password, user.password);
        if (!validatePassword) {
            return res.status(401).json({ success: false });
        }

        const sessionExists = await db.Session.findOne({
            where: {
                userId: user.id
            }
        });

        if (sessionExists) {
            user.dataValues.token = sessionExists.sessionId;
            delete user.dataValues.password;

            return res.json(user);
        }

        const newToken = await db.Session.create();
        newToken.setUser(user);
        await newToken.save();

        user.dataValues.token = newToken.sessionId;
        delete user.dataValues.password;

        return res.json(user);
    } catch (err) {
        console.error(err);
        return res.status(401).json({ success: false });
    }
};

exports.test = async (req, res) => {
    return res.json({ user: req.user, userId: req.userId });
};
