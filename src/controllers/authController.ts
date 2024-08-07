import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcrypt";
import Token from "../models/Token";
import { generateToken } from "../utils/token";
import { AuthEmail } from "../emails/AuthEmails";
import { token } from "morgan";
import { generateJWT } from "../utils/jwt";

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
      //verifica que exista el token
      const tokenExist = await Token.findOne({ token });
      //si el token no existe arroja error
      if (!tokenExist) {
        const error = new Error("Token no válido");
        return res.status(401).json({ error: error.message });
      }
      // conseguis los datos del usuario al que le enviaron el token
      const user = await User.findById(tokenExist.user);
      //cambias el estado de confirmed de false a true
      user.confirmed = true;
      //agregas lo nuevo al usuario y borras el token
      await Promise.allSettled([user.save(), tokenExist.deleteOne()]);
      await res.send("Cuenta confirmada correctamente");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        const error = new Error("Usuario no encontrado");
        return res.status(404).json({ error: error.message });
      }
      //si la cuenta no esta confirmada se envia un token al correo
      if (!user.confirmed) {
        //instancia de token
        const token = new Token();
        //se asigna un usuario al token
        token.user = user.id;
        //se genera el token
        token.token = generateToken();
        //para enviar el correo
        AuthEmail.sendConfirmationEmail({
          email: user.email,
          name: user.name,
          token: token.token,
        });
        token.save();
        const error = new Error(
          "La cuenta no a sido confirmada, hemos enviado un email"
        );
        return res.status(401).json({ error: error.message });
      }
      //verificar password
      //sirve para las contras hasheadas
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) {
        const error = new Error("Password incorrecta");
        return res.status(401).json({ error: error.message });
      }

      const jwToken = generateJWT({ id: user.id });

      res.send(jwToken);
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static resendEmail = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      //revisa si el usuario existe
      const userExist = await User.findOne({ email });
      if (!userExist) {
        const error = new Error("El usuario no esta registrado");
        return res.status(404).json({ error: error.message });
      }
      //por si el usuario ya esta confirmado
      if (userExist.confirmed) {
        const error = new Error("El usuario ya esta confirmado");
        return res.status(403).json({ error: error.message });
      }

      //Generar el token
      const token = new Token();
      token.token = generateToken();
      token.user = userExist.id;
      //para enviar el correo
      AuthEmail.sendConfirmationEmail({
        email: userExist.email,
        name: userExist.name,
        token: token.token,
      });
      //esperando a que se cumplan ambas promesas
      await Promise.allSettled([userExist.save(), token.save()]);

      await res.send(
        "Se envio un nuevo token, revisa tu email para confirmarlo"
      );
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };
  static forgotPassword = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      //revisa si el usuario existe
      const userExist = await User.findOne({ email });
      if (!userExist) {
        const error = new Error("El usuario no esta registrado");
        return res.status(404).json({ error: error.message });
      }

      //Generar el token
      const token = new Token();
      token.token = generateToken();
      token.user = userExist.id;
      await token.save();
      //para enviar el correo
      AuthEmail.sendPasswordResetToken({
        email: userExist.email,
        name: userExist.name,
        token: token.token,
      });

      await res.send(
        "Se envio un nuevo token, revisa tu email para instrucciones"
      );
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static confirmTokenforpasswordChange = async (
    req: Request,
    res: Response
  ) => {
    try {
      const { token } = req.body;
      //revisa si el usuario existe
      const tokenExist = await Token.findOne({ token });
      if (!tokenExist) {
        const error = new Error("Token no válido");
        return res.status(404).json({ error: error.message });
      }

      await res.send("Token valido, define tu nuevo password");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static passwordChangeWhitToken = async (req: Request, res: Response) => {
    try {
      const { password } = req.body;
      const { token } = req.params;
      //revisa si el token es valido
      const tokenExist = await Token.findOne({ token });
      if (!tokenExist) {
        const error = new Error("Token no válido");
        return res.status(404).json({ error: error.message });
      }
      //hash de la contra
      const user = await User.findById(tokenExist.user);
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      //guardas cambios en usuario y borras token
      Promise.allSettled([user.save(), tokenExist.deleteOne()]);
      await res.send("El password se modifico correctamente");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static user = async (req: Request, res: Response) => {
    return res.json(req.user);
  };

  /*Estos son para el perfil */
  static updateProfile = async (req: Request, res: Response) => {
    const { name, email } = req.body;

    req.user.name = name;
    req.user.email = email;

    const userExist = await User.findOne({ email });
    //verifica que el correo no este registrado y que deje pasar SU correo
    if (userExist && userExist.id.toString() !== req.user.id.toString()) {
      const error = new Error("El correo ya esta registrado");
      return res.status(409).json({ error: error.message });
    }

    try {
      await req.user.save();
      res.send("Perfil actualizado correctamente");
    } catch (error) {
      res.status(500).send("Ups... eso no debio suceder");
    }
  };

  static updatePasswordInprofile = async (req: Request, res: Response) => {
    const { current_password, password } = req.body;
    const user = await User.findById(req.user.id);

    const isCorrectPassword = await bcrypt.compare(
      current_password,
      user.password
    );

    if (!isCorrectPassword) {
      const error = new Error("El password es incorrecto");
      return res.status(401).json({ error: error.message });
    }
    try {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();
      res.send("El password se modificó correctamente");
    } catch (error) {
      res.status(500).send("Hubo un error");
    }
  };
  static checkpassword = async (req: Request, res: Response) => {
    const { password } = req.body;
    const user = await User.findById(req.user.id);

    const isCorrectPassword = await bcrypt.compare(password, user.password);

    if (!isCorrectPassword) {
      const error = new Error("El password es incorrecto");
      return res.status(401).json({ error: error.message });
    }
    res.send("Password correcto");
  };
}
