const { db } = require('../../app/database/connection');
require('dotenv').config();

async function loadDatabase() {
    await db.sequelize.authenticate();
    console.log('Database synchronised.');
}

loadDatabase().then(() => {
    console.log("Pre load database completed! \n\n");
    process.exit(0);
}).catch((err) => {
    console.log(err);
    process.exit(1);
});