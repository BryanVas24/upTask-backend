import { NextFunction, Request, Response } from "express";

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
  next();
};
