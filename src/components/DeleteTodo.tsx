import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "./ui/use-toast";
import { useDispatch } from "react-redux";
import axios, { AxiosError } from "axios";
import { deleteTodo } from "@/app/Reducers/todoReducer";

export function DeleteTodo({ id }: { id: string }) {
  const { toast } = useToast();
  const dispatch = useDispatch();

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`/api/delete-todo/${id}`);
      const data = response.data;

      if (data.success) {
        dispatch(deleteTodo(id));
        toast({
          title: "Success",
          description: data.message,
          duration: 3000,
        });
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.log("error to delete todo", error);
      const axiosErr = error as AxiosError<any>;
      toast({
        title: "Failed",
        description: axiosErr.response?.data.message || "An error occurred",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Delete</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete your Todo and remove your data from our
            servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-500 hover:bg-red-600"
            onClick={handleDelete}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
