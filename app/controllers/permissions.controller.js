const { db } = require("../database/connection");

exports.updatePermission = async (req, res) => {
    try {
        const { id } = req.params;

        if (!req.is_master_admin) {
            delete req.body.master_admin_level;
        }

        const userExists = await db.Users.findOne({
            where: {
                id: id
            }
        });
        if (!userExists) {
            return res.status(404).json({ message: "User does not exist" });
        }
        const updatedPermission = await db.Permissions.update(req.body, {
            where: {
                userId: id
            }
        });

        if (updatedPermission[0] === 0) {
            return res.status(404).json({ success: false });
        }

        const permissions = await db.Permissions.findOne({
            where: {
                userId: id
            },
            attributes: {
                exclude: ['userId', 'id']
            }
        });

        return res.status(200).json(permissions);
    } catch (err) {
        console.error(err);
        return res.sendStatus(500);
    }
};