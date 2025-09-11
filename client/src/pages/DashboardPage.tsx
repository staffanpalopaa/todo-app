import React from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { TodoTable } from "@/features/todo-management/TodoTable";
import { CreateTodoDialog } from "@/features/todo-management/CreateTodoDialog";

const DashboardPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Todo Dashboard"
        description="Manage your daily tasks and keep track of your progress."
      >
        <CreateTodoDialog />
      </PageHeader>

      <div className="mt-6">
        <TodoTable />
      </div>
    </div>
  );
};

export default DashboardPage;