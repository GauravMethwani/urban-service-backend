import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// ===============================
// CREATE SMTP TRANSPORTER
// ===============================

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",

  port:  465,

  secure: false,

  // FORCE IPV4
  family: 4,

  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },

  connectionTimeout: 20000,
  greetingTimeout: 20000,
  socketTimeout: 20000,

  tls: {
    rejectUnauthorized: false,
  },
});

// ===============================
// VERIFY SMTP CONNECTION
// ===============================

const verifySMTP = async () => {
  try {
    await transporter.verify();

    console.log("=================================");
    console.log("SMTP SERVER READY ✅");
    console.log("=================================");
  } catch (error) {
    console.log("=================================");
    console.log("SMTP CONNECTION ERROR ❌");
    console.log(error.message);
    console.log("=================================");
  }
};

verifySMTP();

// ===============================
// SEND OTP EMAIL
// ===============================

export const sendOTPEmail = async (email, otp) => {
  try {
    const info = await transporter.sendMail({
      from: `"MakeMyTrip Clone" <${process.env.SMTP_USER}>`,

      to: email,

      subject: "Your OTP Verification Code",

      html: `
        <div
          style="
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: auto;
            padding: 20px;
            border: 1px solid #e5e5e5;
            border-radius: 10px;
          "
        >
          <h2
            style="
              color: #008cff;
              text-align: center;
            "
          >
            MakeMyTrip Clone
          </h2>

          <p>Hello User,</p>

          <p>
            Your OTP for account verification is:
          </p>

          <div
            style="
              text-align: center;
              margin: 30px 0;
            "
          >
            <span
              style="
                display: inline-block;
                font-size: 32px;
                font-weight: bold;
                letter-spacing: 5px;
                color: #ff4f17;
                background: #fff5f2;
                padding: 12px 24px;
                border-radius: 8px;
                border: 2px dashed #ff4f17;
              "
            >
              ${otp}
            </span>
          </div>

          <p>
            This OTP is valid for 10 minutes.
          </p>

          <p>
            Please do not share this OTP with anyone.
          </p>

          <hr
            style="
              border: none;
              border-top: 1px solid #eee;
              margin: 20px 0;
            "
          />

          <p
            style="
              font-size: 12px;
              color: #888;
              text-align: center;
            "
          >
            If you didn't request this email,
            please ignore it.
          </p>
        </div>
      `,
    });

    console.log("=================================");
    console.log("EMAIL SENT SUCCESSFULLY ✅");
    console.log(`TO: ${email}`);
    console.log(info.response);
    console.log("=================================");

    return true;
  } catch (error) {
    console.log("=================================");
    console.log("EMAIL SENDING FAILED ❌");
    console.log(error.message);
    console.log("=================================");

    // FALLBACK OTP LOG
    console.log("\n=================================");
    console.log(`[FALLBACK OTP FOR ${email}] : ${otp}`);
    console.log("=================================\n");

    return false;
  }
};