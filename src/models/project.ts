import mongoose, { Document, Schema } from "mongoose";

//Este type es para ts
//Documente & hereda todo el tipado de Document
export type ProjectType = Document & {
  projectName: string;
  clientName: string;
  description: string;
};

//esto es para mongoose, es lo mismo pero esto es el modelo
const ProjectSchema: Schema = new Schema({
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
});

//asi se agrega un modelo y debe tener un nombre unico y el esquema del que va a crearlo
const Project = mongoose.model<ProjectType>("Project", ProjectSchema);

export default Project;
