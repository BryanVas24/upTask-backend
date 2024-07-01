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
      <a href="">Confirmar cuenta</a>
      <p>Ingresa el código ${user.token}</b></p>
      <p>Este token expira en 10 minutos</p>`,
    });
  };
}
