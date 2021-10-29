const nodemailer = require("nodemailer");
require("dotenv").config();

class CreateSenderNodemailer {
  async send(msg) {
    const config = {
      host: "smtp.meta.ua",
      port: 465,
      secure: true,
      auth: { user: "dbeshchuk@meta.ua", pass: process.env.META_PASSPORT },
    };

    const transporter = nodemailer.createTransport(config);

    return await transporter.sendMail({ ...msg, from: "dbeshchuk@meta.ua" });
  }
}

module.exports = { CreateSenderNodemailer };
