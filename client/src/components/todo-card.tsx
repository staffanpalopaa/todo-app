import { format } from "date-fns";
import { MoreVertical, Edit, CheckCircle2, Trash2, Clock, ListFilter } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Todo } from "@/schema/todo";

interface TodoCardProps {
  todo: Todo;
  onEdit: (todo: Todo) => void;
  onComplete: (todo: Todo) => void;
  onDelete: (todo: Todo) => void;
}

export const TodoCard: React.FC<TodoCardProps> = ({
  todo,
  onEdit,
  onComplete,
  onDelete,
}) => {
  const isCompleted = !!todo.completionDate;

  const getPriorityColor = (priority?: string) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "bg-rose-500 text-white";
      case "medium":
        return "bg-amber-500 text-white";
      case "low":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  return (
    <Card className={cn("relative flex flex-col transition-all duration-200", isCompleted && "opacity-70 grayscale")}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-100 flex-grow">
            {todo.todoTitle}
          </CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {!isCompleted && (
                <>
                  <DropdownMenuItem onClick={() => onEdit(todo)}>
                    <Edit className="mr-2 h-4 w-4" /> Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onComplete(todo)}>
                    <CheckCircle2 className="mr-2 h-4 w-4" /> Mark Complete
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuItem onClick={() => onDelete(todo)} className="text-rose-600 focus:text-rose-700 focus:bg-rose-50">
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {todo.category && (
          <Badge variant="secondary" className="w-fit">
            <ListFilter className="w-3 h-3 mr-1" /> {todo.category}
          </Badge>
        )}
      </CardHeader>
      <CardContent className="flex-grow space-y-2 text-sm text-gray-700 dark:text-gray-300">
        {todo.description && (
          <CardDescription className="text-sm line-clamp-3">
            {todo.description}
          </CardDescription>
        )}
        {todo.dueDate && (
          <p className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-400">
            <Clock className="w-4 h-4 mr-1.5" /> Due: {format(new Date(todo.dueDate), "PPP")}
          </p>
        )}
        {todo.priority && (
          <Badge className={cn("text-xs uppercase px-2 py-0.5 font-bold", getPriorityColor(todo.priority))}>
            {todo.priority}
          </Badge>
        )}
      </CardContent>
      {isCompleted && (
        <CardFooter className="flex flex-col items-start gap-1 text-xs text-gray-500 dark:text-gray-400 pt-3 border-t">
          <p className="font-medium text-emerald-600 dark:text-emerald-400 flex items-center">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Completed: {todo.completionDate ? format(new Date(todo.completionDate), "PPP") : "N/A"}
          </p>
          {todo.completionNotes && (
            <p className="text-xs italic line-clamp-1">Notes: {todo.completionNotes}</p>
          )}
        </CardFooter>
      )}
    </Card>
  );
};