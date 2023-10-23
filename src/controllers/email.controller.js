import nodemailer from 'nodemailer';
import { GMAIL_ACCOUNT_NODEMAILER, GMAIL_PASS_NODEMAILER } from '../config/config.js';
import __dirname from '../utils.js';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: GMAIL_ACCOUNT_NODEMAILER,
        pass: GMAIL_PASS_NODEMAILER
    }
});

transporter.verify(function (error, success) {
    if (error) {
        console.error(error);
    } else {
        console.log("Server is ready to take our messages")
    }
});

const mailOptions = {
    from: 'Test' + GMAIL_ACCOUNT_NODEMAILER,
    to: GMAIL_ACCOUNT_NODEMAILER, /* ESTO O VAMOS A MODIFICAR EN UN FUTURO */
    subject: 'Correo de prueba',
    html: `<div><h1>Esto es un Test de envio de Correos por medio de Nodemailer!</h1></div>`,
    attachments: []
};

const mailOptionsWithAttachments = {
    from: 'Test' + GMAIL_ACCOUNT_NODEMAILER,
    to: GMAIL_ACCOUNT_NODEMAILER, /* ESTO O VAMOS A MODIFICAR EN UN FUTURO */
    subject: 'Correo de prueba',
    html: `<div>
                <h1>Esto es un Test de envio de Correos por medio de Nodemailer!</h1>
                <p>Usando imagen:</p>
                <img src='cid:pepe'>
            </div>`,
    attachments: [
        {
            filename: 'pepe',
            path: __dirname + '/public/images/pepe.png',
            cid: 'pepe'
        }
    ]
};

export const sendEmail = (req, res) => {
    try {
        let result = transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                res.status(400).send({ message: 'Error', payload: error });
            }
            console.log('Message Sent: %s', info.messageId);
            res.send({ message: 'Success', payload: info });
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({ error: error, message: 'No se pudo enviar el correo desde' + GMAIL_ACCOUNT_NODEMAILER });
    }
};

export const sendEmailWithAttachments = (req, res) => {
    try {
        let result = transporter.sendMail(mailOptionsWithAttachments, (error, info) => {
            if (error) {
                console.log(error);
                res.status(400).send({ message: 'Error', payload: error });
            }
            console.log('Message Sent: %s', info.messageId);
            res.send({ message: 'Success', payload: info });
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({ error: error, message: 'No se pudo enviar el correo desde' + GMAIL_ACCOUNT_NODEMAILER });
    }
};