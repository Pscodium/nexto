const { FirebaseService } = require("../services/firebase.service");
const moment = require("moment");

const firebaseService = new FirebaseService();

exports.getMessages = async (req, res) => {
    try {
        const messages = await firebaseService.getChatMessages();

        if (!messages) {
            return res.status(404).json({ message: "No chat messages"});
        }

        return res.status(200).json(messages);
    } catch (err) {
        console.error(`[Chat Error] - ${err}`);
        return res.status(500).json({ message: err.message });
    }
};

exports.sendMessage = async (req, res) => {
    try {
        const body = req.body;

        if (!body.text || typeof body.consecutive != 'boolean') {
            return res.status(400).json({ message: "Invalid message" });
        }
        const message = await firebaseService.sendMessage({
            consecutive: body.consecutive,
            createdAt: moment(),
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            name: req.user.nickname,
            userId: req.user.id,
            text: body.text,
            permissionId: req.user.permissionId,
            photoUrl: null,
            uid: body.uid
        });
        if (!message) {
            return res.status(500).json({ message: "Invalid message" });
        }
        return res.sendStatus(200);
    } catch (err) {
        console.error(`[Chat Error] - ${err}`);
        return res.status(500).json({ message: err.message });
    }
};