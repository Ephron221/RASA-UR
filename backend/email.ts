import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendPasswordResetEmail = async (to: string, token: string) => {
  const mailOptions = {
    from: `"RASA-UR Support" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Your RASA-UR Password Reset Code',
    html: `
      <div style="font-family: sans-serif; text-align: center; padding: 40px; border: 1px solid #eee; border-radius: 10px; max-width: 500px; margin: auto;">
        <h2 style="color: #2c3e50;">RASA-UR Password Reset</h2>
        <p style="color: #7f8c8d;">You requested a password reset. Use the code below to reset your password. This code is valid for 1 hour.</p>
        <p style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #2980b9; background: #f8f9fa; padding: 20px; border-radius: 8px; display: inline-block; margin: 20px 0;">
          ${token}
        </p>
        <p style="color: #95a5a6; font-size: 12px;">If you did not request this, please ignore this email or contact support if you have concerns.</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="color: #bdc3c7; font-size: 11px;">&copy; ${new Date().getFullYear()} RASA-UR Nyarugenge. All rights reserved.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export const sendVerificationEmail = async (to: string, token: string) => {
    const mailOptions = {
        from: `"RASA-UR Account" <${process.env.EMAIL_USER}>`,
        to,
        subject: 'Verify Your RASA-UR Account',
        html: `
            <div style="font-family: sans-serif; text-align: center; padding: 40px; border: 1px solid #eee; border-radius: 10px; max-width: 500px; margin: auto;">
                <h2 style="color: #2c3e50;">Welcome to RASA-UR!</h2>
                <p style="color: #7f8c8d;">Thank you for joining us. Please use the following code to verify your email address and activate your account.</p>
                <p style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #27ae60; background: #f8f9fa; padding: 20px; border-radius: 8px; display: inline-block; margin: 20px 0;">
                    ${token}
                </p>
                <p style="color: #95a5a6; font-size: 12px;">If you did not create this account, you can safely ignore this email.</p>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;">
                <p style="color: #bdc3c7; font-size: 11px;">&copy; ${new Date().getFullYear()} RASA-UR Nyarugenge. All rights reserved.</p>
            </div>
        `,
    };

    await transporter.sendMail(mailOptions);
};