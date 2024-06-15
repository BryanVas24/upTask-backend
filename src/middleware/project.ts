import type { Request, Response, NextFunction } from "express";
import Project, { IProject } from "../models/project";

//esto es de ts y permite escribir el scope global
declare global {
  namespace Express {
    interface Request {
      project: IProject;
    }
  }
}

export async function validateProjectExist(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    //tomas el id del proyecto
    const { projectId } = req.params;
    //lo buscas
    const project = await Project.findById(projectId);
    //si no existe
    if (!project) {
      return res.status(404).json({ error: "No se encontro el proyecto" });
    }
    //acá se asigna el projecto en el req gracias a declare global
    req.project = project;
    //sigue adelante (al siguiente middleware)
    next();
  } catch (error) {
    res.status(400).json({ error: `Ocurrio un error: ${error}` });
  }
}
