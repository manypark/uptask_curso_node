const nodemailer = require('nodemailer');
const pug = require('pug');
const juice = require('juice');
const htmlToText = require('html-to-text');
const util = require('util');
const emailConfig = require('../config/email');

let transport = nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    auth: {
      user: emailConfig.auth.user, // generated ethereal user
      pass: emailConfig.auth.pass, // generated ethereal password
    },
});

// ! generar html

const generaHTML = (archivo, opts = {}) => {
    const html = pug.renderFile(`${__dirname}/../views/email/${archivo}`, opts);
    return juice(html);
}

exports.enviar = async (opts) => {
    const html = generaHTML(opts.archivo, opts);
    const text = htmlToText.fromString(html);

    let mailOptions = {
        from:       'UpTask <no-reply@uptask.com>',
        to:         opts.usuario.email,
        subject:    opts.subject,
        text,
        html
    }

    const enviarEmail = util.promisify(transport.sendMail, transport);
    return enviarEmail.call(transport, mailOptions);

}