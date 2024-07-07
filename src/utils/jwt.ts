import jwt from "jsonwebtoken";

export const generateJWT = () => {
  const data = {};
  //sign crea el token
  const token = jwt.sign();
};
