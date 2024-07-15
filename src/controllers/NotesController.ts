import type { Request, Response } from "express";
import Note, { INote } from "../models/Note";
export class NoteController {
  /*el generic de request: el primer obj es para un parametro, 
  el segundo es para el res.body y el tercero es el req.body, hay un cuarto que se llama req.query */
  static createNote = async (req: Request<{}, {}, INote>, res: Response) => {
    console.log(req.body);
  };
}
