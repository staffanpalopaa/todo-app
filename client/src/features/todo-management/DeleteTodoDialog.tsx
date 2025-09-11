import React, { useState } from "react";
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
import { Trash2 } from "lucide-react";
import { useDeleteTodo } from "@/api/todos";
import { Todo } from "@/lib/validators";

interface DeleteTodoDialogProps {
  todo: Todo;
}

export const DeleteTodoDialog: React.FC<DeleteTodoDialogProps> = ({ todo }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { mutate: deleteTodo, isPending } = useDeleteTodo();

  const handleDelete = () => {
    deleteTodo({ id: todo.id }, {
      onSuccess: () => setIsOpen(false),
    });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" title="Delete todo">
          <Trash2 className="h-4 w-4 text-red-500" />
          <span className="sr-only">Delete todo</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the todo
            <span className="font-semibold px-1">&quot;{todo.description}&quot;</span>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isPending} className="bg-red-500 hover:bg-red-600">
            {isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};