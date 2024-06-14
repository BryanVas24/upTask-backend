import mongoose from "mongoose";
import colors from "colors";
import { exit } from "node:process";

export const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.DATABASE_URL);
    const url = `${connection.connection.host}; ${connection.connection.port}`;
    console.log(colors.bgCyan.bold("Mongoose en: " + url));
  } catch (error) {
    console.error("Ocurrio un error...", error.message);
    //esto cierra el codigo si el numero que recibe es el 1
    exit(1);
  }
};
