import type { Request, Response, NextFunction } from "express";
import Task, { ITask } from "../models/task";

//esto es de ts y permite escribir el scope global
declare global {
  namespace Express {
    interface Request {
      task: ITask;
    }
  }
}

export async function validateTaskExist(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    //tomas el id de la tarea
    const { taskId } = req.params;
    //lo buscas
    const task = await Task.findById(taskId);
    //si no existe
    if (!task) {
      return res.status(404).json({ error: "Tarea no encontrada" });
    }
    //acá se asigna el projecto en el req gracias a declare global
    req.task = task;
    //sigue adelante (al siguiente middleware)
    next();
  } catch (error) {
    res.status(400).json({ error: `Ocurrio un error: ${error}` });
  }
}

export function taskBelongsToProject(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.task.project.toString() !== req.project.id.toString()) {
    return res.status(400).json({ error: "Acción invalida" });
  }
  next();
}
