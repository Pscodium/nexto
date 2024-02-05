const admin = require('firebase-admin');
const serviceAccount = require('../utils/scripts/credentials.json');
const logger = require('../services/logs.service');

class FirebaseService {
    constructor() {

        this.firebase = admin.apps.find(app => {
            return app.name === serviceAccount.project_id;
        });

        if (!this.firebase) {
            this.firebase = admin.initializeApp({
                credential: admin.credential.cert(serviceAccount)
            }, serviceAccount.project_id);
        }

        this.db = this.firebase.firestore();
        this.auth = this.firebase.auth();
    }

    /**
	 * @typedef User
	 * @property {number} id
	 * @property {string} email
	 * @property {string} role
	 * @property {number} permissionId
	 * @property {string} nickname
	 * @property {string} firstName
	 * @property {string} lastName
     * @property {string} password
	 *
	 * @param {User} data
	 */
    async createFirebaseUser(data) {
        const userRecord = await this.auth.createUser({
            email: data.email,
            password: data.password,
            displayName: data.nickname,
            emailVerified: true,
        });
        if (!userRecord) {
            return null;
        }
        data.uid = userRecord.uid;
        delete data.password;
        await this.db.collection('users').add(data);
        return userRecord.uid;
    }

    async removeUsers() {
        const record = await this.auth.listUsers(1000);
        const users = record.users;
        const usersIds = users.map((user) => {
            return user.uid;
        });
        const deletedUsers = await this.auth.deleteUsers(usersIds);
        console.log(logger.warning('Firebase users successfully deleted: ' + deletedUsers.successCount));
        console.log(logger.warning('Firebase users not deleted: ' + deletedUsers.failureCount));

    }


    /**
	 * @param {number} id
	 * @returns {Promise<User>}
	 */
    async getFirebaseUserById(id) {
        const user = await this.db.collection('users').where('id', '==', id).get();
        if (!user) {
            return null;
        }
        return user;
    }

    /**
     * @typedef Message
     * @property {string} text
     * @property {boolean} consecutive
     * @property {string} firstName
     * @property {string} lastName
     * @property {Date} createdAt
     * @property {string} name
     * @property {number} userId
     * @property {number} permissionId
     * @property {string | null} photoUrl
     * @property {string} uid
     *
     * @param {Message} message
     */
    async sendMessage(message) {
        return this.db.collection('messages').add(message);
    }

    /**
	 * @returns {Promise<Message[]>}
	 */
    async getChatMessages() {
        const messages = await this.db.collection("messages").get();
        const data = messages.docs.map(message => {
            return message.data();
        });
        return data;
    }

    async resetFirebaseCollection(collection) {
        const docs = await this.db.collection(collection).listDocuments();
        docs.map(async(doc) => {
            doc.delete();
        });
    }
}

exports.FirebaseService = FirebaseService;