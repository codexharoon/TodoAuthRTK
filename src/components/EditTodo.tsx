"use client";

import { Todo } from "@/app/models/todo";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { todoSchema } from "@/app/ZodSchemas/todoSchema";
import { Checkbox } from "./ui/checkbox";
import axios, { AxiosError } from "axios";
import { useToast } from "./ui/use-toast";
import { useDispatch } from "react-redux";
import { updateTodo } from "@/app/Reducers/todoReducer";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export function EditTodo({ todo }: { todo: Todo }) {
  const { toast } = useToast();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof todoSchema>>({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      title: todo.title,
      isCompleted: todo.isCompleted,
    },
  });

  async function onSubmit(values: z.infer<typeof todoSchema>) {
    setLoading(true);
    try {
      const response = await axios.post(`/api/update-todo/${todo._id}`, values);
      const data = response.data;

      if (data.success) {
        dispatch(
          updateTodo({
            _id: todo._id,
            title: values.title,
            isCompleted: values.isCompleted,
          })
        );
        toast({
          title: "Success",
          description: data.message,
          duration: 3000,
        });
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.log("error to update todo", error);
      const axiosErr = error as AxiosError<any>;
      toast({
        title: "Failed",
        description: axiosErr.response?.data.message || "Error to update todo",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Edit</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Todo</DialogTitle>
          <DialogDescription>
            Make changes to your Todo here. Click save when you are done.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Todo</FormLabel>
                  <FormControl>
                    <Input placeholder="Edit your TODO here..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isCompleted"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                  <FormLabel>is Completed</FormLabel>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />{" "}
                    <span>Saving chnages...</span>
                  </span>
                ) : (
                  "Save changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
