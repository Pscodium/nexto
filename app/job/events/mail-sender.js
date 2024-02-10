const { db } = require('../../database/connection');
const { MailTransfer } = require('../../services/mail.service');
const logger = require('../../services/logs.service');

class MailSender {

    constructor() {
        this.mailer = new MailTransfer();
        this.sending = false;
    }

    async start() {
        try {
            const UserEmails = await db.Users.findAll({
                where: {
                    verifiedEmail: false
                },
                attributes: ['id', 'email']
            });
            if (UserEmails.length === 0 || this.sending) {
                this.sending = false;
                console.log(logger.waiting("There are no emails to be sent..."));
                return;
            }
            this.sending = true;
            console.log(logger.changed(`Sending ${UserEmails.length} emails.`));
            for (const User of UserEmails) {
                setTimeout(async () => {
                    await this.mailer.sendMail({
                        to: User.email,
                        subject: "Email Verification",
                        html: "<p>verifique seu email</p>"
                    });

                    await db.Users.update({
                        verifiedEmail: true
                    }, {
                        where: {
                            id: User.id
                        }
                    });
                }, 3000);
            }
            this.sending = false;
        } catch (err) {
            console.log(err);
            await this.stop();
        }
    }

    async stop() {
        console.log('Event stopped');
    }
}

exports.MailSender = MailSender;