import { useState } from "react";
import { PlusCircle, ListTodo, CheckCircle2, XCircle, BarChart3 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateTodoDialog } from "@/components/create-todo-dialog";
import { TodoList } from "@/components/todo-list";
import { useFetchTodoList } from "@/hooks/use-todo";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { data: todos, isLoading } = useFetchTodoList();
  const isMobile = useIsMobile();

  const totalTodos = todos?.length || 0;
  const completedTodos = todos?.filter(todo => !!todo.completionDate).length || 0;
  const pendingTodos = totalTodos - completedTodos;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-50">
      <header className="sticky top-0 z-40 w-full border-b bg-white/95 dark:bg-gray-950/90 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-950/60 shadow-sm">
        <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <ListTodo className="h-7 w-7 text-primary" /> Todo Dashboard
          </h1>
          <Button
            className="bg-primary hover:bg-primary/90 text-white flex items-center gap-1"
            onClick={() => setIsCreateDialogOpen(true)}
          >
            <PlusCircle className="h-4 w-4" /> {isMobile ? "New" : "New Todo"}
          </Button>
        </div>
      </header>

      <main className="container flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <section className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-secondary" /> Your Progress
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-white dark:bg-gray-900 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Todos</CardTitle>
                <ListTodo className="h-5 w-5 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                  {isLoading ? <Skeleton className="w-12 h-8" /> : totalTodos}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-gray-900 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</CardTitle>
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                  {isLoading ? <Skeleton className="w-12 h-8" /> : completedTodos}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {totalTodos > 0 ? `${((completedTodos / totalTodos) * 100).toFixed(0)}% of total` : "0% of total"}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-gray-900 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</CardTitle>
                <XCircle className="h-5 w-5 text-amber-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                  {isLoading ? <Skeleton className="w-12 h-8" /> : pendingTodos}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator className="my-8 bg-gray-200 dark:bg-gray-800" />

        <section>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center gap-3">
            <ListTodo className="h-8 w-8 text-primary" /> All Todos
          </h2>
          <TodoList />
        </section>
      </main>

      <CreateTodoDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
      />
    </div>
  );
};

export default Index;