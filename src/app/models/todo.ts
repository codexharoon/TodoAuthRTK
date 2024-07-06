import { Schema, Document } from "mongoose";

export interface Todo extends Document {
  title: string;
  isCompleted: boolean;
}

export const todoSchema = new Schema<Todo>({
  title: {
    type: String,
    required: [true, "Title is required"],
  },
  isCompleted: {
    type: Boolean,
    required: [true, "isCompleted is required"],
    default: false,
  },
});
