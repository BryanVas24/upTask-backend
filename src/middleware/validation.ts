import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
export const handleInputErrors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  //esto hace que pase a la siguiente función en el codigo normal
  next();
};
