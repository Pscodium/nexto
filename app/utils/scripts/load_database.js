const { db } = require('../../database/connection');

async function load() {


    var bulkPins = [];

    for (var i = 0; i < 10000; i++) {

        var minLat = -31.480274;
        var maxLat = 4.928630;

        var minLng = -75.175824;
        var maxLng = -31.855095;

        var lat = Math.random() * (maxLat - minLat) + minLat;
        var lng = Math.random() * (maxLng - minLng) + minLng;

        bulkPins.push({
            title: `Camera test ${i}`,
            color: "red",
            latitude: lat,
            longitude: lng,
            userId: 1
        });
    }

    await db.Map.bulkCreate(bulkPins);

    console.log('Database sucessfully loaded');

}

db.sequelize.authenticate()
    .then(async () => {
        load();
    })
    .catch((err) => {
        console.error(err);
    });

