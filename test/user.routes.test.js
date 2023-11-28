require('dotenv').config();
const {
    expect,
    agent,
    anotherAgent
} = require('./config/app');
let res;

describe('Users Tests', () => {
    before(async () => {
        this.another_agent = anotherAgent();

        res = await agent.post('/session/login').send({
            "email": "nexto@email.com",
            "password": "123"
        });
        expect(res.statusCode).equals(200);
        this.user = res.body;
    });

    it('Login test', async () => {
        res = await this.another_agent.post('/session/login').send({
            "email": "test@email.com",
            "password": "123"
        });
        expect(res.statusCode).equals(200);
        expect(res.body.email).equals("test@email.com");
        expect(res.body.token).to.not.equals(null);
    });

    it('User data test', async () => {
        res = await agent.get('/data/user');
        expect(res.statusCode).equals(200);
        expect(res.body.email).equals("nexto@email.com");

        res = await this.another_agent.get('/data/user');
        expect(res.statusCode).equals(200);
        expect(res.body.email).equals("test@email.com");
    });

    it('Get users test', async () => {
        res = await agent.get('/users');
        expect(res.statusCode).equals(200);
        expect(res.body.length).to.be.greaterThan(0);
    });

    it('Get user by ID test', async () => {
        const testUserId = 2;
        res = await agent.get('/user/' + testUserId);
        expect(res.statusCode).equals(200);
        expect(res.body.id).equals(testUserId);
    });

    it('Trying to get non-existent user by ID', async () => {
        res = await agent.get('/user/-1');
        expect(res.statusCode).equals(404);
    });

    it('Register and delete Test', async () => {
        res = await this.another_agent.post('/register').send({
            "email": "user_to_delete@gmail.com",
            "firstName": "Delete",
            "lastName": "This User",
            "nickname": "Deleted",
            "password": "123"
        });
        expect(res.statusCode).equals(200);
        const user_to_delete = res.body;

        res = await agent.delete('/user/' + user_to_delete.id);
        expect(res.statusCode).equals(200);
        expect(res.body.success).equals(true);
    });

    it('Logout and try to use authenticated routes', async () => {
        res = await this.another_agent.post('/session/login').send({
            "email": "test@email.com",
            "password": "123"
        });
        expect(res.statusCode).equals(200);

        res = await this.another_agent.get('/session/logout');
        expect(res.statusCode).equals(200);

        res = await this.another_agent.get('/data/user');
        expect(res.statusCode).equals(401);
    });

    it('Trying to login with wrong password', async () => {
        res = await this.another_agent.post('/session/login').send({
            "email": "test@email.com",
            "password": "wrongpassword"
        });
        expect(res.statusCode).equals(404);
    });

    it("Trying to login with wrong email", async () => {
        res = await this.another_agent.post('/session/login').send({
            "email": "wrong_email@email.com",
            "password": "123"
        });
        expect(res.statusCode).equals(404);
    });

    it("Tring to register an existing user", async () => {
        res = await this.another_agent.post('/register').send({
            "email": "test@email.com",
            "password": '12312412341'
        });
        expect(res.statusCode).equals(409);
    });

    after(async () => {
        res = await agent.get('/session/logout');
        expect(res.statusCode).equals(200);
    });
});