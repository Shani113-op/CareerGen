const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text = '', html = '') => {
  try {
    // ✅ Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // ✅ Compose mail
    const mailOptions = {
      from: `"CareerGenAI Admin" <${process.env.EMAIL_USER}>`, // more professional sender
      to,
      subject,
      text,
      html
    };

    // ✅ Send mail
    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent to ${to}: ${info.messageId}`);
  } catch (error) {
    console.error('❌ Email send error:', error.message);
    throw error;
  }
};

module.exports = sendEmail;
