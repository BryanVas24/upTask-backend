import { transporter } from "../config/nodeMailer";

interface IEmail {
  email: string;
  name: string;
  token: string;
}
export class AuthEmail {
  static sendConfirmationEmail = async (user: IEmail) => {
    //enviar el email
    await transporter.sendMail({
      from: "UpTask - Confirma tu cuenta",
      to: user.email,
      subject: "UpTask Confirma tu cuenta",
      text: "UpTask Confirma tu cuenta",
      html: `<p>Hola ${user.name} este correo es para que confirmes la creación de tu cuenta en upTask </p>
      <p>Visita el siguiente enlace para confirmar</p>
      <a href="${process.env.FRONTEND_URL}/auth/confirm-account">Confirmar cuenta</a>
      <p>Ingresa el código ${user.token}</b></p>
      <p>Este token expira en 10 minutos</p>`,
    });
  };

  static sendPasswordResetToken = async (user: IEmail) => {
    //enviar el email
    await transporter.sendMail({
      from: "UpTask - Restablecer Password",
      to: user.email,
      subject: "UpTask Restablecer password",
      text: "UpTask Restablecer password",
      html: `<p>Hola ${user.name} este correo es para que puedas restablecer el password de tu cuenta en upTask </p>
      <p>Visita el siguiente enlace para realizar el cambio</p>
      <a href="${process.env.FRONTEND_URL}/auth/new-password">Restablecer password</a>
      <p>Ingresa el código ${user.token}</b></p>
      <p>Este token expira en 15 minutos</p>`,
    });
  };
}
