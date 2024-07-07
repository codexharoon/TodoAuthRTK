"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { todoSchema } from "@/app/ZodSchemas/todoSchema";
import { useState } from "react";
import { useToast } from "./ui/use-toast";
import { useDispatch } from "react-redux";
import axios, { AxiosError } from "axios";
import { addTodo } from "@/app/Reducers/todoReducer";
import { Loader2 } from "lucide-react";

const AddTodo = () => {
  const { toast } = useToast();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof todoSchema>>({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      title: "",
      isCompleted: false,
    },
  });

  async function onSubmit(values: z.infer<typeof todoSchema>) {
    setLoading(true);
    try {
      const response = await axios.post(`/api/add-todo`, values);
      const data = response.data;

      if (data.success) {
        dispatch(addTodo(data.todo));
        toast({
          title: "Success",
          description: data.message,
        });
        form.reset();
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.log("error to add todo", error);
      const axiosErr = error as AxiosError<any>;
      toast({
        title: "Failed",
        description: axiosErr.response?.data.message || "Error to add todo",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Todo</FormLabel>
              <FormControl>
                <Input placeholder="Write your TODO here..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={loading}>
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />{" "}
              <span>Adding...</span>
            </span>
          ) : (
            "Add"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default AddTodo;
