import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import projectRoutes from "./routes/projectRoutes";
//sirve para tomar variables de entorno
dotenv.config();

connectDB();
const app = express();
app.use(express.json());

//Rutas
app.use("/api/projects", projectRoutes);

export default app;
