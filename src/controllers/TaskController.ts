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
      //obtenes el id del proyecto al que se le va a asignar la tarea
      task.proyect = project.id;
      //acá le metes datos al array de project
      project.tasks.push(task.id);

      await task.save();
      await project.save();
      res.send("Tarea creada exitosamente");
    } catch (error) {
      console.error("Ocurrio el siguiente error:", error);
    }
  };
}
