const { db } = require('../database/connection');

exports.createPin = async (req, res) => {
    const pin = req.body;

    try {
        const createdPin = await db.Map.create({
            title: pin.title,
            color: pin.color,
            latitude: pin.latitude,
            longitude: pin.longitude,
            area: pin.area,
            userId: req.userId
        });

        return res.status(200).json(createdPin);
    } catch (err) {
        console.error('[ERROR] Create pin on map', err.stack || err);
        return res.sendStatus(500);
    }
};

exports.allPins = async (req, res) => {
    try {
        const pins = await db.Map.findAll({
            where: {
                userId: req.userId
            }
        });

        return res.status(200).json(pins);
    } catch (err) {
        console.error('[ERROR] Get Visual Map pins by userId', err.stack || err);
        return res.sendStatus(500);
    }
};

exports.getPinById = async (req, res) => {
    try {
        const pin = await db.Map.findOne({
            where: {
                id: req.params.id,
                userId: req.userId
            }
        });

        if (!pin) {
            return res.sendStatus(404);
        }

        return res.status(200).json(pin);
    } catch (err) {
        console.error('[ERROR] Get pin by id', err.stack || err);
        return res.sendStatus(500);
    }
};

exports.updatePinById = async (req, res) => {
    const data = req.body;

    try {
        const updated = await db.Map.update(data, {
            where: {
                id: req.params.id,
                userId: req.userId
            }
        });

        if (updated[0] === 0) {
            return res.status(404).json({ success: false });
        }

        const response = await db.Map.findOne({
            where: {
                id: req.params.id,
                userId: req.userId
            }
        });

        return res.status(200).json(response);
    } catch (err) {
        console.error('[ERROR] Update pin on map', err.stack || err);
        return res.sendStatus(500);
    }
};

exports.deletePinById = async (req, res) => {
    try {
        await db.Map.destroy({
            where: {
                id: req.params.id,
                userId: req.userId
            }
        });

        return res.status(200).json({ success: true });
    } catch (err) {
        console.error('[ERROR] Delete pin by id', err.stack || err);
        return res.sendStatus(500);
    }
};