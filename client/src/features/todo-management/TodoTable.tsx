import React from "react";
import { Column, DataTable } from "@/components/shared/DataTable";
import { Todo } from "@/lib/validators";
import { useGetAllTodos } from "@/api/todos";
import { Loader2, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CompleteTodoButton } from "./CompleteTodoButton";
import { DeleteTodoDialog } from "./DeleteTodoDialog";

export const TodoTable: React.FC = () => {
  const { data: todos, isLoading, isError, error } = useGetAllTodos();

  const columns: Column<Todo>[] = [
    {
      header: "Description",
      accessorKey: "description",
      cell: (row) => <span className="font-medium">{row.description}</span>,
      className: "w-[30%]",
    },
    {
      header: "Due Date",
      accessorKey: "dueDate",
      cell: (row) => row.dueDate,
      className: "w-[15%]",
    },
    {
      header: "Priority",
      accessorKey: "priority",
      cell: (row) => {
        let className = "text-white";
        switch (row.priority) {
          case "High":
            className = "bg-red-500 hover:bg-red-600";
            break;
          case "Medium":
            className = "bg-yellow-500 hover:bg-yellow-600";
            break;
          case "Low":
            className = "bg-green-500 hover:bg-green-600";
            break;
        }
        return <Badge className={className}>{row.priority}</Badge>;
      },
      className: "w-[15%]",
    },
    {
      header: "Status",
      accessorKey: "isCompleted",
      cell: (row) => (
        <Badge className={row.isCompleted === "true" ? "bg-green-500 text-white" : "bg-gray-500 text-white"}>
          {row.isCompleted === "true" ? "Completed" : "Pending"}
        </Badge>
      ),
      className: "w-[15%]",
    },
    {
      header: "Actions",
      cell: (row) => (
        <div className="flex items-center justify-end space-x-2">
          <CompleteTodoButton todo={row} />
          <DeleteTodoDialog todo={row} />
        </div>
      ),
      className: "w-[10%] text-right",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="mt-2 text-lg text-muted-foreground">Loading todos...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center p-8 min-h-[200px] text-red-600">
        <XCircle className="h-10 w-10 mb-2" />
        <p className="text-lg">Error loading todos: {error?.message}</p>
      </div>
    );
  }

  return (
    <DataTable
      columns={columns}
      data={todos || []}
      emptyMessage="No todos found. Start by creating one!"
    />
  );
};