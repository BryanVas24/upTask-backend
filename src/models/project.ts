//un populet es como un join en bases relacionales
import mongoose, { Document, Schema, PopulatedDoc, Types } from "mongoose";
import { ITask } from "./task";

//Este type es para ts
//Documente & hereda todo el tipado de Document
export interface IProject extends Document {
  projectName: string;
  clientName: string;
  description: string;
  //lo de la sintaxis de arreglo al final es para que sepa que es un array
  //y lo de ITask es para que sepa lo que va a recibir y el & Document para heredar del Document
  tasks: PopulatedDoc<ITask & Document>[];
}

//esto es para mongoose, es lo mismo pero esto es el modelo
const ProjectSchema: Schema = new Schema(
  {
    projectName: {
      type: String,
      required: true,
      trim: true,
    },
    clientName: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    tasks: [
      {
        type: Types.ObjectId,
        ref: "Task",
      },
    ],
  },
  { timestamps: true }
);

//asi se agrega un modelo y debe tener un nombre unico y el esquema del que va a crearlo
const Project = mongoose.model<IProject>("Project", ProjectSchema);

export default Project;
