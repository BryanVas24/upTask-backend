import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const bearer = req.headers.authorization;
  if (!bearer) {
    const error = new Error("No autorizado");
    return res.status(401).json({ error: error.message });
  }
  //esto es porque cuando te envian un header en bearer siempre viene la palabra bearer
  const jwToken = bearer.split(" ")[1];

  try {
    //para verificar el jwt
    const decoded = jwt.verify(jwToken, process.env.JWT_SECRET);
    //esto es porque no aparecia el id en decoded entonces lo verifique
    if (typeof decoded === "object" && decoded.id) {
      const user = await User.findById(decoded.id);
    }

    console.log(decoded);
  } catch (error) {
    res.status(500).json({ error: "Token no valido " + error.message });
  }
  next();
};
