import React from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useCompleteTodo } from "@/api/todos";
import { Todo } from "@/lib/validators";

interface CompleteTodoButtonProps {
  todo: Todo;
}

export const CompleteTodoButton: React.FC<CompleteTodoButtonProps> = ({ todo }) => {
  const { mutate: completeTodo, isPending } = useCompleteTodo();

  const handleComplete = () => {
    completeTodo({ id: todo.id });
  };

  if (todo.isCompleted === "true") {
    return (
      <Button variant="ghost" size="icon" disabled className="text-green-500">
        <Check className="h-4 w-4" />
        <span className="sr-only">Completed</span>
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleComplete}
      disabled={isPending}
      title="Mark as complete"
    >
      <Check className="h-4 w-4" />
      <span className="sr-only">Mark as complete</span>
    </Button>
  );
};