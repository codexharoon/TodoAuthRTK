import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Todo } from "../models/todo";

export interface TodoState {
  todos: Todo[];
}

const initialState: TodoState = {
  todos: [],
};

export const TodoSlice = createSlice({
  name: "todo",
  initialState,
  reducers: {
    setTodos: (state, action) => {
      state.todos = action.payload;
    },
    addTodo: (state, action) => {
      state.todos.push(action.payload);
    },
    updateTodo: (state, action) => {
      const { _id, title, isCompleted } = action.payload;
      const existingTodo = state.todos.find((todo) => todo._id === _id);
      if (existingTodo) {
        existingTodo.title = title;
        existingTodo.isCompleted = isCompleted;
      }
    },
    deleteTodo: (state, action) => {
      const index = state.todos.findIndex(
        (todo) => todo._id === action.payload
      );
      if (index !== -1) {
        state.todos.splice(index, 1);
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const { setTodos, addTodo, updateTodo, deleteTodo } = TodoSlice.actions;

export default TodoSlice.reducer;
