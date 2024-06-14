import type { Request, Response } from "express";
import Project from "../models/project";
import { Task } from "../models/task";

export class TaskController {
  static createTask = async (req: Request, res: Response) => {
    //tomas el id del proyecto
    const { projectId } = req.params;
    //lo buscas
    const project = await Project.findById(projectId);
    //si no existe
    if (!project) {
      return res.status(404).json({ error: "No se encontro el proyecto" });
    }
    try {
      const task = new Task(req.body);
      await task.save();
    } catch (error) {
      console.error("Ocurrio el siguiente error:", error);
    }
  };
}
