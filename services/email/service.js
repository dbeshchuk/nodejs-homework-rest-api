const Mailgen = require("mailgen");

class EmailService {
  constructor(env, sender) {
    this.sender = sender;

    switch (env) {
      case "development":
        this.link = "http://df3b-46-219-214-103.ngrok.io";
        break;

      case "production":
        this.link = "link for production";
        break;

      default:
        break;
    }
  }

  createTemplateEmail(name, verifyToken) {
    const mailGenerator = new Mailgen({
      theme: "default",
      product: {
        name: "Contacts Manager",
        link: this.link,
      },
    });

    const email = {
      body: {
        name,
        intro:
          "Welcome to Contacts Manager We're very excited to have you on board.",
        action: {
          instructions:
            "To get started with Contacts Manager, please click here:",
          button: {
            color: "#22BC66", // Optional action button color
            text: "Confirm your account",
            link: `${this.link}/api/users/verify/${verifyToken}`,
          },
        },
      },
    };

    return mailGenerator.generate(email);
  }

  async sendVerifyEmail(email, name, verifyToken) {
    const emailHTML = this.createTemplateEmail(name, verifyToken);

    const msg = {
      to: email,
      subject: "Verify your email",
      html: emailHTML,
    };

    try {
      const result = await this.sender.send(msg);
      console.log(result);
      return true;
    } catch (error) {
      console.log(error.message);
    }
  }
}

module.exports = EmailService;
