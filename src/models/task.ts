import mongoose, { Document, Schema, Types } from "mongoose";
//el as const al final de el taskStatus hace que las propiedades sean read Only
const taskStatus = {
  PENDING: "pending",
  ON_HOLD: "onHold",
  IN_PROGRESS: "inProgress",
  UNDER_REVIEW: "underReview",
  COMPLETED: "completed",
} as const;
//lo de los corchetes es para extraer solo los valores
export type TaskStatus = (typeof taskStatus)[keyof typeof taskStatus];
/*si te preguntas por que la s de string en la interface 
es minuscula y la de el TaskSchema es mayuscula es por que en la
interfaz se usa ts y en el schema es mongo*/
export interface ITask extends Document {
  name: string;
  description: string;
  //types sirve para acceder a los tipos que tambien brinda mongoo
  project: Types.ObjectId;
  status: TaskStatus;
}

export const TaskSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    project: {
      type: Types.ObjectId,
      //basicamente lo va a buscar al otro modelo llamado Project
      ref: "Project",
    },
    status: {
      type: String,
      enum: Object.values(taskStatus),
      default: taskStatus.PENDING,
    },
  },
  //esto sirve para que cambie la fecha cuando se crea y se actualiza dinamicamente
  { timestamps: true }
);

//esto conecta el schema con la interfaz
const Task = mongoose.model<ITask>("Task", TaskSchema);
export default Task;
