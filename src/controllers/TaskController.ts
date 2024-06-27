import type { Request, Response } from "express";
import { Task } from "../models/task";

export class TaskController {
  static createTask = async (req: Request, res: Response) => {
    try {
      const task = new Task(req.body);
      //obtenes el id del proyecto al que se le va a asignar la tarea
      task.proyect = req.project.id;
      //acá le metes datos al array de project
      req.project.tasks.push(task.id);
      //el promise.allSettled sirve para que ambas promesas se cumnplan
      await Promise.allSettled([task.save(), req.project.save()]);
      res.send("Tarea creada exitosamente");
    } catch (error) {
      res.status(500).json({ error: `Ocurrio el siguiente error: ${error}` });
    }
  };
  static getProjectTask = async (req: Request, res: Response) => {
    try {
      //esto es como hacer un where pero el populate te trae todos los datos de ese modelo
      const tasks = await Task.find({ project: req.project.id }).populate(
        "Project"
      );
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: `Ocurrio el siguiente error: ${error}` });
    }
  };

  static getTaskById = async (req: Request, res: Response) => {
    try {
      res.json(req.task);
    } catch (error) {
      res.status(500).json({ error: `Ocurrio el siguiente error: ${error}` });
    }
  };

  static updateTask = async (req: Request, res: Response) => {
    try {
      req.task.name = req.body.name;
      req.task.description = req.body.description;
      await req.task.save();
      res.send("Tarea actualizada correctamente");
    } catch (error) {
      res.status(500).json({ error: `Ocurrio el siguiente error: ${error}` });
    }
  };
  static deleteTask = async (req: Request, res: Response) => {
    try {
      //acá se setean las tareas nuevamente al projecto
      req.project.tasks = req.project.tasks.filter(
        (task) => task.toString() !== req.task.id.toString()
      );
      //borras una tarea y guardas cambios en projecto
      await Promise.allSettled([req.task.deleteOne(), req.project.save()]);
      res.send("Tarea eliminda correctamente");
    } catch (error) {
      res.status(500).json({ error: `Ocurrio el siguiente error: ${error}` });
    }
  };

  static updateStatus = async (req: Request, res: Response) => {
    try {
      const { status } = req.body;
      req.task.status = status;
      await req.task.save();
      res.send("tarea Actualizada");
    } catch (error) {
      res.status(500).json({ error: `Ocurrio el siguiente error: ${error}` });
    }
  };
}
