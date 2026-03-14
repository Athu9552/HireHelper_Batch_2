const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  connectionTimeout: 8000,
  greetingTimeout: 8000,
  socketTimeout: 8000
});

const sendEmail = async (to, subject, text) => {
  console.log('Attempting to send email to:', to);
  console.log('EMAIL_USER:', process.env.EMAIL_USER);
  console.log('EMAIL_PASS set:', !!process.env.EMAIL_PASS);
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text
    });
    console.log('Email sent successfully:', info.response);
  } catch (err) {
    console.error('Email error:', err.message);
    throw err;
  }
};

module.exports = sendEmail;
