const nodemailer = require("nodemailer");
const env = require("../config/env");

const transporter = nodemailer.createTransport({
  host: env.SMTP.HOST,
  port: env.SMTP.PORT,
  secure: env.SMTP.PORT === 465,
  auth: {
    user: env.SMTP.USER,
    pass: env.SMTP.PASS,
  },
});

const sendVerificationEmail = async ({ email, name, token }) => {
  const verificationUrl = `${env.CLIENT_URL}/verify-email?token=${token}`;

  await transporter.sendMail({
    from: env.SMTP.FROM,
    to: email,
    subject: "Verify your email address",
    html: `
      <h2>Welcome, ${name}!</h2>

      <p>
        Thanks for creating your account.
        Please verify your email address by clicking the button below.
      </p>

      <p>
        <a
          href="${verificationUrl}"
          style="
            display:inline-block;
            padding:12px 20px;
            background:#007BFF;
            color:white;
            text-decoration:none;
            border-radius:5px;
          "
        >
          Verify Email
        </a>
      </p>

      <p>
        This verification link will expire in 15 minutes.
      </p>
    `,
  });
};

const sendPasswordResetEmail = async ({ email, name, token }) => {
  const resetUrl = `${env.CLIENT_URL}/reset-password?token=${token}`;

  await transporter.sendMail({
    from: env.SMTP.FROM,
    to: email,
    subject: "Reset your password",
    html: `
      <div>
        <h2>Password Reset</h2>

        <p>Hello ${name},</p>

        <p>
          We received a request to reset your password.
        </p>

        <p>
          Click the button below to create a new password:
        </p>

        <a
          href="${resetUrl}"
          style="
            display:inline-block;
            padding:10px 20px;
            background:#007BFF;
            color:white;
            text-decoration:none;
            border-radius:5px;
          "
        >
          Reset Password
        </a>

        <p>
          This link will expire in 15 minutes.
        </p>

        <p>
          If you did not request a password reset, you can safely ignore
          this email.
        </p>
      </div>
    `,
  });
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
};
