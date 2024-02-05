require('dotenv').config();
const {
    expect,
    agent,
    anotherAgent
} = require('./config/app');
let res;
let pin;

describe('Map crud tests', () => {
    before(async () => {
        res = await agent.post('/session/login').send({
            "email": "nexto@email.com",
            "password": "123456"
        });
        expect(res.statusCode).equals(200);
        this.user = res.body;
    });

    it('Pin crud', async () => {
        const initialPinTitle = "test pin";
        const newPinTitle = "new pin title";

        // create pin
        res = await agent.post('/api/map/pin/create').send({
            "title": initialPinTitle,
            "color": "#f00",
            "latitude": "-26.26403653",
            "longitude": "-48.85119319",
        });
        pin = res.body;
        expect(res.statusCode).equals(200);
        expect(pin.title).equals(initialPinTitle);
        expect(pin.userId).equals(this.user.id);

        // get pins
        res = await agent.get('/api/map/pins');
        expect(res.statusCode).equals(200);
        expect(res.body).to.has.lengthOf(1);
        expect(res.body[0].title).equals(initialPinTitle);

        // update pin
        res = await agent.put('/api/map/pin/' + pin.id).send({
            "title": newPinTitle
        });
        pin = res.body;
        expect(res.statusCode).equals(200);
        expect(pin.title).equals(newPinTitle);
        expect(pin.userId).equals(this.user.id);

        // get pin by id
        res = await agent.get('/api/map/pin/' + pin.id);
        pin = res.body;
        expect(res.statusCode).equals(200);
        expect(pin.title).equals(newPinTitle);

        // delete pin
        res = await agent.delete('/api/map/pin/' + pin.id);
        expect(res.statusCode).equals(200);

    });

    it('Try to create a pin with invalid request body', async () => {
        res = await agent.post('/api/map/pin/create').send({
            "invalid": "invalid"
        });
        expect(res.statusCode).equals(500);
    });

    it('Trying to get a pin with non-existing ID', async () => {
        res = await agent.get('/api/map/pin/-1');
        expect(res.statusCode).equals(404);
    });

    it('Invalid pin update', async () => {
        res = await agent.put('/api/map/pin/-1').send({
            "invalid": "invalid"
        });
        expect(res.statusCode).equals(404);
    });

    it('Invalid pin delete', async () => {
        res = await agent.delete('/api/map/pin/-1');
        expect(res.statusCode).equals(404);
    });

    it('Testing map permissions', async() => {
        const another_agent = anotherAgent();
        res = await another_agent.post('/register').send({
            "email": "userpermissions@example.com",
            "firstName": "test",
            "lastName": "user",
            "nickname": "UserTest",
            "password": "UserTest123@"
        });
        expect(res.statusCode).equals(200);

        res = await another_agent.post('/session/login').send({
            "email": "userpermissions@example.com",
            "password": "UserTest123@"
        });
        const user = res.body;
        expect(res.statusCode).equals(200);

        // without permissions (expected 401)
        res = await another_agent.get('/api/map/pins');
        expect(res.statusCode).equals(401);

        res = await agent.post('/permission/insert/' + user.id).send({
            "can_see_map": true
        });
        expect(res.statusCode).equals(200);

        // with permissions (expected 200)
        res = await another_agent.get('/api/map/pins');
        expect(res.statusCode).equals(200);

        res = await another_agent.get('/session/logout');
        expect(res.statusCode).equals(200);

        res = await agent.delete('/user/' + user.id);
        expect(res.statusCode).equals(200);
    });

    after(async() => {
        res = await agent.get('/session/logout');
        expect(res.statusCode).equals(200);
    });
});