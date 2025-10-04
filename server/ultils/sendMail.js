const nodemailer = require("nodemailer");
const asyncHandler = require("express-async-handler");

const sendMail = asyncHandler(async ({ email: userEmail, html }) => {
  let transporter = nodemailer.createTransport({
    host: "smtp@gmai.com",
    service: "gmail",
    auth: {
      user: process.env.EMAIL_NAME,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });

  let info = await transporter.sendMail({
    from: '"Dieu Hieu Electric E-commerce" <no-reply@electric.com>',
    to: userEmail,
    subject: "Forgot Password",
    html: html,
  });
  return info;
});

module.exports = {
  sendMail,
};
