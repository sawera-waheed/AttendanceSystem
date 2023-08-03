const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 465,
  auth: {
    user: "apikey",
    pass: "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",
  },
});

const sendEmail = (toEmail, subject, emailContent, callback) => {
  var mailOptions = {
    from: "faridullahkhan645@gmail.com",
    to: `${toEmail}`,
    subject: subject,
    html: emailContent,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      callback({ success: false, error });
    } else {
      callback({ success: true, message: info.response });
    }
  });
};

module.exports = sendEmail;
