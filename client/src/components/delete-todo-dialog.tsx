import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useDeleteTodo } from "@/hooks/use-todo";
import { Todo, DeleteTodoRequest, deleteTodoRequestSchema } from "@/schema/todo";

interface DeleteTodoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  todo: Todo | null;
}

export const DeleteTodoDialog: React.FC<DeleteTodoDialogProps> = ({
  isOpen,
  onClose,
  todo,
}) => {
  const form = useForm<DeleteTodoRequest>({
    resolver: zodResolver(deleteTodoRequestSchema),
    defaultValues: {
      todoID: "",
      deletionReason: "",
    },
  });

  useEffect(() => {
    if (todo) {
      form.reset({
        todoID: todo.todoID,
        deletionReason: todo.deletionReason || "",
      });
    }
  }, [todo, form]);

  const { mutate: deleteTodo, isPending } = useDeleteTodo();

  const onSubmit = () => {
    if (todo?.todoID) {
      deleteTodo(
        { todoID: todo.todoID, deletionReason: form.getValues("deletionReason") || undefined },
        {
          onSuccess: () => {
            onClose();
          },
        }
      );
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="sm:max-w-[425px] p-6">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <Trash2 className="w-6 h-6 text-rose-600" /> Delete Todo
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
            Are you sure you want to delete{" "}
            <span className="font-semibold">{todo?.todoTitle}</span>? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="deletionReason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason for Deletion (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Task no longer needed, duplicated entry"
                      className="resize-none"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <AlertDialogFooter>
              <AlertDialogCancel asChild>
                <Button variant="outline" disabled={isPending}>
                  Cancel
                </Button>
              </AlertDialogCancel>
              <AlertDialogAction asChild>
                <Button
                  onClick={onSubmit}
                  className="bg-rose-600 hover:bg-rose-700"
                  disabled={isPending}
                >
                  {isPending ? "Deleting..." : "Delete"}
                </Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};