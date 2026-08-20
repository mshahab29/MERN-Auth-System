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

transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP CONNECTION FAILED:", error);
  } else {
    console.log("SMTP SERVER IS READY");
  }
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

module.exports = {
  sendVerificationEmail,
};
