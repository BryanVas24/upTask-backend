import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcrypt";
import Token from "../models/Token";
import { generateToken } from "../utils/token";
import { AuthEmail } from "../emails/AuthEmails";

export class AuthController {
  static createAccount = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      //revisa si el usuario ya esta registrado
      const userExist = await User.findOne({ email });
      if (userExist) {
        const error = new Error("El usuario ya esta registrado");
        return res.status(409).json({ error: error.message });
      }
      const user = new User(req.body);
      //hash del password
      //el numero del salt es que tan codificada va a estar, entre mas alto el numero mas recursos consume, 10 es algo recomendado
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      //Generar el token
      const token = new Token();
      token.token = generateToken();
      token.user = user.id;
      //para enviar el correo
      AuthEmail.sendConfirmationEmail({
        email: user.email,
        name: user.name,
        token: token.token,
      });
      //esperando a que se cumplan ambas promesas
      await Promise.allSettled([user.save(), token.save()]);

      await res.send("Cuenta creada, revisa tu email para confirmarla");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };
  static confirmAccount = async (req: Request, res: Response) => {
    try {
      const { token } = req.body;
      const tokenExist = await Token.findOne({ token });
      if (!tokenExist) {
        const error = new Error("Token no válido");
        return res.status(401).json({ error: error.message });
      }
      await res.send("Cuenta creada, revisa tu email para confirmarla");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };
}
