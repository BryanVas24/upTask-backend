import mongoose, { Schema, Document } from "mongoose";

export interface Iuser extends Document {
  email: string;
  password: string;
  name: string;
  confirmed: boolean;
}
//recorda que esto es para mongoose
const userSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
    lowercase: true,
  },
  confirmed: {
    type: Boolean,
    default: false,
  },
});

const User = mongoose.model<Iuser>("User", userSchema);
export default User;
