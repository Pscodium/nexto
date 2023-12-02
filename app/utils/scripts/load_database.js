require('dotenv').config();
process.env.PRE_SYNC_DATABASE = true;

const { db } = require('../../database/connection');
const logger = require('../../services/logs.service');
const { FirebaseService } = require('../../services/firebase.service');
let addedUsers = 0;

async function load() {

    const reseted = await restartDb();
    await restartFirestore();
    if (reseted) {
        await createUser({
            email: 'nexto@email.com',
            firstName: 'Nexto',
            lastName: 'Admin',
            password: '123456',
            nickname: 'Nexto Adm',
            isAdmin: true
        });
        await createUser({
            email: 'test@email.com',
            firstName: 'Test',
            lastName: 'Dev',
            password: '123456',
            nickname: 'Tester',
            isAdmin: false
        });


        console.log(logger.changed('Created users on script: ' + addedUsers))
        console.log(logger.success('\n\nDatabase sucessfully loaded...'));
        process.exit(0);
    }
}

async function createUser({ firstName, lastName, email, password, nickname, isAdmin }) {
    try {
        const passwordHashed = db.Users.encryptPassword(password);
        const firebaseService = new FirebaseService();

        const permissions = await db.Permissions.create({
            master_admin_level: isAdmin
        });
        const user = await db.Users.create({
            email: email,
            firstName: firstName,
            lastName: lastName,
            nickname: nickname,
            password: passwordHashed,
        });
        await user.setPermission(permissions);
        await permissions.save();
        await permissions.setUser(user);


        const uid = await firebaseService.createFirebaseUser({
            email: email,
            password: password,
            firstName: firstName,
            lastName: lastName,
            nickname: nickname,
            id: user.id,
            permissionId: permissions.id,
            role: user.role
        })

        user.external_id = uid;
        await user.save();
        addedUsers++;
        return;
    } catch (err) {
        console.error(`[User Registration Error] - ${err}`)
    }
}

async function restartDb() {
    try {
        if (db.sequelize) {
            await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0')
            const { sequelize, ...models } = db;
            for (const model in models) {
                await models[model].destroy({
                    where: {},
                    truncate: true
                })
            }
            await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1')
        }

        console.log(logger.success("Connection established!"));
        return true;


    } catch (err) {
        if (err.name === 'SequelizeDatabaseError' && err.parent && err.parent.code === 'ER_LOCK_DEADLOCK') {
            console.log(logger.warning('Deadlock detectado. Tentando novamente...'));
        } else {
            console.error(logger.alert('Error when resetting the database:', err));
        }
    }

}

async function restartFirestore() {
    try {
        const firebaseService = new FirebaseService();

        await firebaseService.resetFirebaseCollection('users');
        await firebaseService.resetFirebaseCollection('messages');
        await firebaseService.removeUsers();
    } catch (err) {
        console.error(`[Firestore Error] - ${err}`)
    }
}


load().then(() => {
    console.log("Pre load database completed! \n\n");
    process.exit(0);
})
.catch((err) => {
    console.log(err);
    process.exit(1);
});

