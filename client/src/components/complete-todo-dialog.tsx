import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CheckCircle2, CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useCompleteTodo } from "@/hooks/use-todo";
import { Todo, CompleteTodoRequest, completeTodoRequestSchema } from "@/schema/todo";

interface CompleteTodoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  todo: Todo | null;
}

export const CompleteTodoDialog: React.FC<CompleteTodoDialogProps> = ({
  isOpen,
  onClose,
  todo,
}) => {
  const form = useForm<CompleteTodoRequest>({
    resolver: zodResolver(completeTodoRequestSchema),
    defaultValues: {
      todoID: "",
      completionDate: format(new Date(), "yyyy-MM-dd"), // Default to today
      completionNotes: "",
    },
  });

  useEffect(() => {
    if (todo) {
      form.reset({
        todoID: todo.todoID,
        completionDate: todo.completionDate || format(new Date(), "yyyy-MM-dd"),
        completionNotes: todo.completionNotes || "",
      });
    }
  }, [todo, form]);

  const { mutate: completeTodo, isPending } = useCompleteTodo();

  const onSubmit = (values: CompleteTodoRequest) => {
    completeTodo(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" /> Complete Todo
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            Confirm completion for: <span className="font-semibold">{todo?.todoTitle}</span>
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="completionDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Completion Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(new Date(field.value), "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value ? new Date(field.value) : undefined}
                        onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="completionNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add any notes about completing this task..."
                      className="resize-none"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
                Cancel
              </Button>
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700" disabled={isPending}>
                {isPending ? "Completing..." : "Mark as Complete"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};