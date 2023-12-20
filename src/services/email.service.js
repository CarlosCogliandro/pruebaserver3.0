import nodemailer from 'nodemailer';
import { GMAIL_ACCOUNT_NODEMAILER, GMAIL_PASS_NODEMAILER } from '../config/config.js';

export default class EmailService {
    static #transporter
    
    constructor() {
        if (!EmailService.#transporter) {
            EmailService.#transporter = nodemailer.createTransport({
                service: 'gmail',
                port: 587,
                auth: {
                    user: GMAIL_ACCOUNT_NODEMAILER,
                    pass: GMAIL_PASS_NODEMAILER,
                },
                tls: {
                    rejectUnauthorized: false
                }
            });
            EmailService.#transporter.verify(function (error, success) {
                if (error) {
                    console.warn(`Transporter verify error:  ${error} `);
                } else {
                    console.info(`Server is ready to take our messages.`);
                }
            });
        }
    };

    #mailOptions = (receiver, title, message) => {
        return {
            from: "Test" + GMAIL_ACCOUNT_NODEMAILER,
            to: receiver,
            subject: title ? title : "Email test",
            html: message ? message : `<div><h1>This is a test</h1></div>`,
            attachments: []
        }
    }

    async sendEmail(email, message, title, callback) {
        let finalEmail = email ? email : GMAIL_ACCOUNT_NODEMAILER;
        EmailService.#transporter.sendMail(this.#mailOptions(finalEmail, title, message), (error, info) => {
            if (error) {
                function doSomething(callback) {
                    callback({
                        message: "Error",
                        payload: error,
                        code: 400
                    });
                }
                function myCallback() {
                    console.log("El callback se ejecutó.");
                }
                doSomething(myCallback);
            }
            else {
                callback(null, { message: "Success!", payload: info })
            }
        });
    };
};
