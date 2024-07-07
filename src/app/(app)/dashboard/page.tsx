"use client";

import { Separator } from "@/components/ui/separator";
import React, { useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/app/store";
import { setTodos } from "@/app/Reducers/todoReducer";
import { useToast } from "@/components/ui/use-toast";
import { DeleteTodo } from "@/components/DeleteTodo";
import { Loader2 } from "lucide-react";
import { EditTodo } from "@/components/EditTodo";
import AddTodo from "@/components/AddTodo";

const page = () => {
  const todos = useSelector((state: RootState) => state.todos.todos);
  const [fetchTodosLoading, setFetchTodosLoading] = React.useState<boolean>();
  const dispatch = useDispatch();
  const { toast } = useToast();

  const fetchTodos = async () => {
    setFetchTodosLoading(true);
    try {
      const response = await axios.get("/api/get-todos");

      const data = response.data;

      if (data.success) {
        dispatch(setTodos(data.data));
      }
    } catch (error) {
      console.log("error to fetch todos", error);
    } finally {
      setFetchTodosLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, [dispatch]);
  return (
    <div className="flex items-start justify-center min-h-screen bg-slate-50">
      <div className="max-w-6xl w-full p-10 mx-6 lg:mx-auto">
        <h1 className="text-4xl text-center font-bold mt-16">
          CodexHaroon - Todo
        </h1>
        <div className="mt-5 mb-10 w-full">
          <AddTodo />
        </div>

        <Separator className="mb-5" />

        {fetchTodosLoading ? (
          <div className="flex items-center justify-center min-h-48">
            <Loader2 className="h-10 w-10 animate-spin" />
          </div>
        ) : (
          <div>
            {todos.map((todo) => (
              <div
                key={todo.id}
                className="flex items-center justify-between p-2 my-2 bg-slate-100 rounded-lg"
              >
                {todo.isCompleted ? (
                  <p className="line-through">{todo.title}</p>
                ) : (
                  <p>{todo.title}</p>
                )}
                <div className="flex gap-2">
                  <EditTodo todo={todo} />
                  <DeleteTodo id={todo._id as string} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default page;
