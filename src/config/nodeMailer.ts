import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
//Todo este codigo fue sacado de Mailtrap, es para enviar emails pero no funciona en producccion y tiene limite
const config = () => {
  return {
    host: process.env.SMTP_HOST,
    port: +process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  };
};
//todos los valores de esta funcion config estan en el env
export const transporter = nodemailer.createTransport(config());
