require('dotenv').config();
const SES = require('aws-sdk/clients/ses');
const logger = require('./logs.service');

/**
 * @typedef {Object} EmailType
 * @property {string} to - Email do destionatário
 * @property {string} subject - Assunto
 * @property {string} html - Aqui você pode de fato utilizar html dentro de uma string
 */

class MailTransfer {
    constructor() {
        this.client = new SES({
            region: 'us-east-2',
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
        });
        this.sentEmails = [];
    }

    /**
     *
     * @param {EmailType} email
     * @returns
     * @memberof Mailer
     */
    async sendMail(email) {
        const emailSent = await this.client
            .sendEmail({
                Source: `Nexto <${process.env.AWS_EMAIL_SENDER}>`,
                Destination: {
                    ToAddresses: [email.to]
                },
                Message: {
                    Subject: {
                        Data: email.subject
                    },
                    Body: {
                        Html: {
                            Data: email.html
                        }
                    }
                }
            }).promise();

        if (emailSent.MessageId) {
            this.sentEmails.push({
                messageId: emailSent.MessageId,
                email: {
                    to: email.to,
                    subject: email.subject,
                    html: email.html
                }
            });
            return console.log(logger.success(`\nEmail successfully sent to ${email.to}\nID: ${emailSent.MessageId}\n`));
        }
    }
}
exports.mailer = new MailTransfer();