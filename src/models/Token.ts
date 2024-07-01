import mongoose, { Schema, Document, Types } from "mongoose";

export interface IToken extends Document {
  token: string;
  user: Types.ObjectId;
  created: string;
}

const tokenSchema: Schema = new Schema({
  token: {
    type: String,
    required: true,
  },
  user: {
    type: Types.ObjectId,
    ref: "User",
  },
  created: {
    type: Date,
    default: Date.now(),
    //esto es el tiempo de duración del token, acá dura un dia
    expires: "1d",
    required: true,
  },
});

const Token = mongoose.model<IToken>("Token", tokenSchema);
export default Token;
