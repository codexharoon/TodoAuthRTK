import mongoose, { Schema, Document } from "mongoose";
import { Todo, todoSchema } from "./todo";

export interface User extends Document {
  email: string;
  password: string;
  todos: Todo[];
}

const userSchema = new Schema<User>({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Please enter a valid email address",
    ],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  todos: {
    type: [todoSchema],
  },
});

const USER =
  (mongoose.models.USER as mongoose.Model<User>) ||
  mongoose.model<User>("USER", userSchema);

export default USER;
