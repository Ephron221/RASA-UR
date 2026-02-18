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
    from: process.env.EMAIL_USER,
    to,
    subject: 'Your RASA-NYG Password Reset Token',
    html: `
      <div style="font-family: sans-serif; text-align: center; padding: 40px;">
        <h2 style="color: #333;">RASA-NYG Password Reset</h2>
        <p>You requested a password reset. Use the token below to reset your password.</p>
        <p style="font-size: 24px; font-weight: bold; letter-spacing: 5px; background: #f0f0f0; padding: 15px; border-radius: 10px; display: inline-block;">
          ${token}
        </p>
        <p style="color: #666; font-size: 12px;">If you did not request this, please ignore this email.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export const sendVerificationEmail = async (to: string, token: string) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject: 'Verify Your RASA-NYG Account',
        html: `
            <div style="font-family: sans-serif; text-align: center; padding: 40px;">
                <h2 style="color: #333;">Welcome to RASA-NYG!</h2>
                <p>Please use the following token to verify your email address and activate your account.</p>
                <p style="font-size: 24px; font-weight: bold; letter-spacing: 5px; background: #f0f0f0; padding: 15px; border-radius: 10px; display: inline-block;">
                    ${token}
                </p>
                <p style="color: #666; font-size: 12px;">If you did not create this account, you can safely ignore this email.</p>
            </div>
        `,
    };

    await transporter.sendMail(mailOptions);
};