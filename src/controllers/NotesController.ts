import type { Request, Response } from "express";
import Note, { INote } from "../models/Note";
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
}
