import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { corsConfig } from "./config/cors";
import { connectDB } from "./config/db";
import projectRoutes from "./routes/projectRoutes";
//sirve para tomar variables de entorno
dotenv.config();

connectDB();
const app = express();
//la config de cors
app.use(cors(corsConfig));
app.use(express.json());

//Rutas
app.use("/api/projects", projectRoutes);

export default app;
