import { Request, Response } from "express";

import Project from "../models/project";
export class ProjectController {
  //toma todos los proyectos
  static getAllProjects = async (req: Request, res: Response) => {
    try {
      //or sirve para agregar multiples condiciones
      const projects = await Project.find({
        $or: [
          //toma solo los proyectos del usuario autenticasdo
          { manager: { $in: req.user.id } },
        ],
      });
      res.json(projects);
    } catch (error) {
      console.error(error);
    }
  };
  //toma un  proyecto
  static getOneProject = async (req: Request, res: Response) => {
    // Destructuración del id que viene en la url
    const { id } = req.params;
    try {
      // Encuentra el proyecto y luego realiza populate en tasks
      const project = await Project.findById(id).populate("tasks");
      // Si no lo encuentra tira error
      if (!project) {
        return res.status(404).json({ error: "No se encontró el proyecto" });
      }
      if (project.manager.toString() !== req.user.id.toString()) {
        return res.status(404).json({ error: "Acción no valida" });
      }
      // Envías los datos del proyecto encontrado
      res.json(project);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al obtener el proyecto" });
    }
  };
  //actualiza el producto

  static updateProject = async (req: Request, res: Response) => {
    //destructuración del id que viene en la url
    const { id } = req.params;
    try {
      //busca y actualiza el proyecto, primero recibe el id y luego los nuevos datos const project = await Project.findByIdAndUpdate(id,req.body);
      const project = await Project.findById(id);
      //sino lo encuentra regresa un error
      if (!project) {
        return res.status(404).json({ error: "No se encontro el proyecto" });
      }
      if (project.manager.toString() !== req.user.id.toString()) {
        return res
          .status(404)
          .json({ error: "Solo el manager puede actualizar un proyecto" });
      }
      project.clientName = req.body.clientName;
      project.projectName = req.body.projectName;
      project.description = req.body.description;
      //esperas a que se guarden los nuevos datos
      await project.save();
      //respuesta del servidor
      res.send("Proyecto Actualizado");
    } catch (error) {
      console.error(error);
    }
  };
  //crea proyectos
  static createProject = async (req: Request, res: Response) => {
    const project = new Project(req.body);
    project.manager = req.user.id;
    try {
      await project.save();
      res.send("Proyecto creado correctamente");
    } catch (error) {
      console.log(error);
    }
  };
  static deleteProject = async (req: Request, res: Response) => {
    //destructuración del id que viene en la url
    const { id } = req.params;
    try {
      //busca  el proyecto en base al id
      const project = await Project.findById(id);
      //sino lo encuentra regresa un error
      if (!project) {
        return res.status(404).json({ error: "No se encontro el proyecto" });
      }
      if (project.manager.toString() !== req.user.id.toString()) {
        return res
          .status(404)
          .json({ error: "Solo el manager puede eliminar el proyecto" });
      }
      //va a borrar el que encuentre arriba
      await project.deleteOne();
      //respuesta del servidor
      res.send("Proyecto eliminado de manera exitosa");
    } catch (error) {
      console.error(error);
    }
  };
}
