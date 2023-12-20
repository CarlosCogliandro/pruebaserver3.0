import nodemailer from "nodemailer";
import crypto from "crypto";
import userModel from "../dao/mongoDB/models/user.model.js";
import { GMAIL_ACCOUNT_NODEMAILER, GMAIL_PASS_NODEMAILER } from "../config/config.js";

const sendResetPasswordEmail = async (userEmail) => {
  const user = await userModel.findOne({ email: userEmail });
  if (!user) {
    throw new Error("Usuario no encontrado.");
  }
  const resetToken = crypto.randomBytes(20).toString("hex");
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = Date.now() + 3600000; 
  await user.save();
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: GMAIL_ACCOUNT_NODEMAILER,
      pass: GMAIL_PASS_NODEMAILER,
    },
    tls: {
      rejectUnauthorized: false
    }
  });
  const resetUrl = `http://localhost:8080/reset-password/${resetToken}`;
  let mailOptions = {
    from: "carloscogliandro22@gmail.com",
    to: userEmail,
    subject: "Link de restablecimiento de contraseña",
    text: `Por favor, para restablecer tu contraseña haz clic en el siguiente enlace: ${resetUrl}`,
    html: `<p>Por favor, para restablecer tu contraseña haz clic en el siguiente enlace: <a href="${resetUrl}">restablecer contraseña</a></p>`,
  };
  await transporter.sendMail(mailOptions);
};

export default sendResetPasswordEmail;
