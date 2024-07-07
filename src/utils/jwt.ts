import jwt from "jsonwebtoken";
import { Types } from "mongoose";

type generateJWTProps = {
  id: Types.ObjectId;
};
export const generateJWT = (payload: generateJWTProps) => {
  const data = {};
  /*sign crea el token
  payload es la info que vas a pasar
  el segundo es una palabra secreta que sirve para generar y verificar el jwt
  y el ultimo argumento es para cuanto tiempo va a ser valido ese jwt, en este caso son 6 meses */
  const jwToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "6m",
  });
};
