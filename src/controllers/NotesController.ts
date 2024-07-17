import type { Request, Response } from "express";
import Note, { INote } from "../models/Note";
import { Types } from "mongoose";

type NoteParams = {
  noteId: Types.ObjectId;
};
export class NoteController {
  /*el generic de request: el primer obj es para un parametro, 
  el segundo es para el res.body y el tercero es el req.body, hay un cuarto que se llama req.query */
  static createNote = async (req: Request<{}, {}, INote>, res: Response) => {
    const { content } = req.body;
    const note = new Note();
    note.content = content;
    note.createdBy = req.user.id;
    note.task = req.task.id;

    req.task.notes.push(note.id);

    try {
      await Promise.allSettled([note.save(), req.task.save()]);
      res.send("Nota creada correctamente");
    } catch (error) {
      res.status(500).json({ error: "Ocurrio un error" });
    }
  };

  static getTaskNotes = async (req: Request<{}, {}, INote>, res: Response) => {
    try {
      const notes = await Note.find({ task: req.task.id });
      res.json(notes);
    } catch (error) {
      res.status(500).json({ error: "Ocurrio un error" });
    }
  };
  //acá se ve mas a detalle el tipe de los params
  static deleteNote = async (
    req: Request<NoteParams, {}, INote>,
    res: Response
  ) => {
    const { noteId } = req.params;
    //encuentra la nota
    const note = await Note.findById(noteId);
    //si la nota no existe
    if (!note) {
      const error = new Error("Nota no encontrada");
      return res.status(404).json({ error: error.message });
    }
    //si no es el usuario que creo la nota
    if (note.createdBy.toString() !== req.user.id.toString()) {
      const error = new Error("Acción no valida");
      return res.status(409).json({ error: error.message });
    }
    //quita la nota del array de task
    req.task.notes = req.task.notes.filter(
      (note) => note.toString() !== noteId.toString()
    );
  
    try {
      await Promise.allSettled([note.deleteOne(), req.task.save()]);
      res.send("Nota eliminada");
    } catch (error) {
      res.status(500).json({ error: "Ocurrio un error" });
    }
  };
}
