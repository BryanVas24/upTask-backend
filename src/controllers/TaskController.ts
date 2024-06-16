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
    } catch (error) {
      res.status(500).json({ error: `Ocurrio el siguiente error: ${error}` });
    }
  };

  static getTaskById = async (req: Request, res: Response) => {
    try {
      const { taskId } = req.params;
      const task = await Task.findById(taskId);
      if (!task) {
        const error = new Error("Tarea no encontrada");
        return res.status(404).json({ error: error.message });
      }
      if (task.proyect.toString() !== req.project.id) {
        return res.status(400).json({ error: "Acción invalida" });
      }
      res.json(task);
    } catch (error) {
      res.status(500).json({ error: `Ocurrio el siguiente error: ${error}` });
    }
  };

  static updateTask = async (req: Request, res: Response) => {
    try {
      const { taskId } = req.params;
      const task = await Task.findByIdAndUpdate(taskId, req.body);
      if (!task) {
        const error = new Error("Tarea no encontrada");
        return res.status(404).json({ error: error.message });
      }
      if (task.proyect.toString() !== req.project.id) {
        return res.status(400).json({ error: "Acción invalida" });
      }
      res.send("Tarea actualizada correctamente");
    } catch (error) {
      res.status(500).json({ error: `Ocurrio el siguiente error: ${error}` });
    }
  };
}
