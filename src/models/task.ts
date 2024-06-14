import mongoose, { Document, Schema, Types } from "mongoose";

/*si te preguntas por que la s de string en la interface 
es minuscula y la de el TaskSchema es mayuscula es por que en la
interfaz se usa ts y en el schema es mongo*/
export interface ITask extends Document {
  name: string;
  description: string;
  //types sirve para acceder a los tipos que tambien brinda mongoo
  proyect: Types.ObjectId;
}

export const TaskSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    clientName: {
      type: String,
      required: true,
      trim: true,
    },
    proyect: {
      type: Types.ObjectId,
      //basicamente lo va a buscar al otro modelo llamado Project
      ref: "Project",
    },
  },
  //esto sirve para que cambie la fecha cuando se crea y se actualiza dinamicamente
  { timestamps: true }
);

//esto conecta el schema con la interfaz
const Task = mongoose.model<ITask>("Task", TaskSchema);
