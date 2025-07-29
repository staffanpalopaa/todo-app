import { useMemo, useState } from "react";
import { TodoCard } from "@/components/todo-card";
import { useFetchTodoList } from "@/hooks/use-todo";
import { Todo } from "@/schema/todo";
import { Skeleton } from "@/components/ui/skeleton";
import { CompleteTodoDialog } from "@/components/complete-todo-dialog";
import { DeleteTodoDialog } from "@/components/delete-todo-dialog";
import { UpdateTodoDialog } from "@/components/update-todo-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

export const TodoList: React.FC = () => {
  const { data: todos, isLoading, isError, error } = useFetchTodoList();

  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);

  const handleEdit = (todo: Todo) => {
    setSelectedTodo(todo);
    setIsUpdateDialogOpen(true);
  };

  const handleComplete = (todo: Todo) => {
    setSelectedTodo(todo);
    setIsCompleteDialogOpen(true);
  };

  const handleDelete = (todo: Todo) => {
    setSelectedTodo(todo);
    setIsDeleteDialogOpen(true);
  };

  const sortedTodos = useMemo(() => {
    if (!todos) return [];
    return [...todos].sort((a, b) => {
      // Prioritize incomplete todos
      if (a.completionDate && !b.completionDate) return 1;
      if (!a.completionDate && b.completionDate) return -1;

      // Then by due date if available
      const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
      const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
      return dateA - dateB;
    });
  }, [todos]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-[200px] w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <Terminal className="h-4 w-4" />
        <AlertTitle>Error fetching todos!</AlertTitle>
        <AlertDescription>
          {error?.message || "An unexpected error occurred."}
        </AlertDescription>
      </Alert>
    );
  }

  if (!todos || todos.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        <p className="text-lg font-medium">No todos found.</p>
        <p className="text-sm">Start by creating a new one!</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sortedTodos.map((todo) => (
          <TodoCard
            key={todo.todoID}
            todo={todo}
            onEdit={handleEdit}
            onComplete={handleComplete}
            onDelete={handleDelete}
          />
        ))}
      </div>

      <UpdateTodoDialog
        isOpen={isUpdateDialogOpen}
        onClose={() => setIsUpdateDialogOpen(false)}
        todo={selectedTodo}
      />
      <CompleteTodoDialog
        isOpen={isCompleteDialogOpen}
        onClose={() => setIsCompleteDialogOpen(false)}
        todo={selectedTodo}
      />
      <DeleteTodoDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        todo={selectedTodo}
      />
    </>
  );
};