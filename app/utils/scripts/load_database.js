require('dotenv').config();
process.env.PRE_SYNC_DATABASE = true;

const moment = require('moment');
const { db } = require('../../database/connection');

async function load() {

    const reseted = await restartDb();
    if (reseted) {
        await createUser({
            email: 'nexto@email.com',
            firstName: 'Nexto',
            lastName: 'Admin',
            password: '123',
            nickname: 'Nexto Adm',
            isAdmin: true
        });
        await createUser({
            email: 'test@email.com',
            firstName: 'Test',
            lastName: 'Dev',
            password: '123',
            nickname: 'Tester',
            isAdmin: false
        });


        console.log('Database sucessfully loaded');
        process.exit(0);
    }
}

async function createUser({ firstName, lastName, email, password, nickname, isAdmin }) {
    const passwordHashed = db.Users.encryptPassword(password);

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
    await user.save();

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

        console.log("Connection established!");
        return true;


    } catch (err) {
        if (err.name === 'SequelizeDatabaseError' && err.parent && err.parent.code === 'ER_LOCK_DEADLOCK') {
            console.log('Deadlock detectado. Tentando novamente...');
        } else {
            console.error('Erro ao resetar o banco de dados:', err);
        }
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

