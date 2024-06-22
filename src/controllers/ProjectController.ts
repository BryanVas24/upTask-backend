import { Request, Response } from "express";

import Project from "../models/project";
export class ProjectController {
  //toma todos los proyectos
  static getAllProjects = async (req: Request, res: Response) => {
    try {
      const projects = await Project.find({});
      res.json(projects);
    } catch (error) {
      console.error(error);
    }
  };
  //toma un  proyecto
  static getOneProject = async (req: Request, res: Response) => {
    //destructuración del id que viene en la url
    const { id } = req.params;
    try {
      //Esperas a que encuentre el proyecto
      const project = (await Project.findById(id)).populated("tasks");
      //si no lo encuentra tira error
      if (!project) {
        return res.status(404).json({ error: "No se encontro el proyecto" });
      }
      //envias los datos del proyecto encontrado
      res.json({ message: "Proyecto con id " + id + " encontrado", project });
    } catch (error) {
      console.error(error);
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
      project.clientName = req.body.clientName;
      project.projectName = req.body.projectName;
      project.description = req.body.description;
      //esperas a que se guarden los nuevos datos
      await project.save;
      //respuesta del servidor
      res.send("Proyecto Actualizado");
    } catch (error) {
      console.error(error);
    }
  };
  //crea proyectos
  static createProject = async (req: Request, res: Response) => {
    try {
      await Project.create(req.body);
      res.send("Projecto creado correctamente");
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
      //va a borrar el que encuentre arriba
      await project.deleteOne();
      //respuesta del servidor
      res.send("Proyecto eliminado de manera exitosa");
    } catch (error) {
      console.error(error);
    }
  };
}
