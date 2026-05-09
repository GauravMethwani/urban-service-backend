import nodemailer from "nodemailer";
import dotenv from 'dotenv';

// Local config to ensure variables are available in this module
dotenv.config();

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_PORT == 465, 
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

let transporter = createTransporter();

// Verify connection on startup
const verifyConnection = () => {
  transporter.verify((error, success) => {
    if (error) {
      console.log("[SMTP CONNECTION ERROR]:", error.message);
      console.log("Using Host:", process.env.SMTP_HOST || "smtp.gmail.com");
      // Try to re-initialize if it fails once
      transporter = createTransporter();
    } else {
      console.log("[SMTP STATUS]: Server is ready to send emails ✅");
    }
  });
};

verifyConnection();

export const sendOTPEmail = async (email, otp) => {
  try {
    const info = await transporter.sendMail({
      from: `"MakeMyTrip Clone" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Your OTP for Registration",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #008CFF; text-align: center;">MakeMyTrip Clone</h2>
          <p>Hello,</p>
          <p>Your One-Time Password (OTP) for account verification is:</p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #FF4F17; background: #fff5f2; padding: 10px 20px; border-radius: 5px; border: 1px dashed #FF4F17;">
              ${otp}
            </span>
          </div>
          <p>This OTP is valid for 10 minutes. Please do not share it with anyone.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;"/>
          <p style="font-size: 12px; color: #888; text-align: center;">If you didn't request this, please ignore this email.</p>
        </div>
      `,
    });
    console.log(`Email sent successfully to ${email} ✅`);
    return info;
  } catch (error) {
    console.error("Email Sending Error:", error.message);
    // Always log OTP in terminal as fallback so development is not blocked
    console.log(`\n-----------------------------------------`);
    console.log(`[FALLBACK OTP LOG for ${email}]: ${otp}`);
    console.log(`-----------------------------------------\n`);
    return null;
  }
};
