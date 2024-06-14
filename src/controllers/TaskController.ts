import type { Request, Response } from "express";

export class TaskController {
  static createProject = async (req: Request, res: Response) => {
    const { projectId } = req.params;
    try {
      console.log(projectId);
    } catch (error) {
      console.error("Ocurrio el siguiente error:", error);
    }
  };
}
