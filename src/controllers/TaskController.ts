import type { Request, Response } from "express";
import Project from "../models/project";
import { Task } from "../models/task";

export class TaskController {
  static createTask = async (req: Request, res: Response) => {
    try {
      const task = new Task(req.body);
      //obtenes el id del proyecto al que se le va a asignar la tarea
      task.proyect = req.project.id;
      //acá le metes datos al array de project
      req.project.tasks.push(task.id);

      await task.save();
      await req.project.save();
      res.send("Tarea creada exitosamente");
    } catch (error) {
      console.error("Ocurrio el siguiente error:", error);
    }
  };
}
