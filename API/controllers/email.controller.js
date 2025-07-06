const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'vb56804@gmail.com',
    pass: 'vhgo acmw ynkx qzvs'
  }
});

const sendVerificationEmail = async (email, verificationToken) => {
  try {
    const mailOptions = {
      from: 'vb56804@gmail.com',
      to: email,
      subject: 'Verify Your Quick Tickets Account',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa; border-radius: 8px;">
          <h1 style="color: #333; text-align: center;">Welcome to Quick Tickets!</h1>
          <p style="color: #666; line-height: 1.6;">Thank you for registering. To complete your registration and activate your account, please click the verification button below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="http://localhost:3000/verify/${verificationToken}" 
               style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 10px 0;">
              Verify Email
            </a>
          </div>
          <p>If you didn't create an account, you can safely ignore this email.</p>
          <p>This verification link will expire in 24 hours.</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Verification email sent:', info.response);
    return true;
  } catch (error) {
    console.error('Error sending verification email:', error);
    return false;
  }
};

module.exports = {
  sendVerificationEmail
};
