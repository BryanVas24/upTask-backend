import type { Request, Response } from "express";
import User from "../models/User";
export class TeamController {
  static findMemberbyEmail = async (req: Request, res: Response) => {
    const { email } = req.user;
    //buscando el usuario
    const user = await User.findOne({ email }).select("id email name");
    if (!user) {
      const error = new Error("Usuario no encontrado");
      return res.status(404).json({ error: error.message });
    }
    res.json(user);
  };

  static AddMemberById = async (req: Request, res: Response) => {
    const { id } = req.body;

    //buscando el usuario
    const user = await User.findById(id).select("id");
    if (!user) {
      const error = new Error("Usuario no encontrado");
      return res.status(404).json({ error: error.message });
    }
    if (
      req.project.team.some((team) => team.toString() === user.id.toString())
    ) {
      const error = new Error("El usuario ya forma parte del proyecto");
      return res.status(409).json({ error: error.message });
    }
    req.project.team.push(user.id);
    await req.project.save();
    res.send("Usuario agregado correctamente");
  };
}
