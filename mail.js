const nodemailer = require('nodemailer');
// Looking to send emails in production? Check out our Email API/SMTP product!
var transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "629bbcb06c3260",
    pass: "9cf03951f0c4a4"
  }
});

module.exports = transporter;