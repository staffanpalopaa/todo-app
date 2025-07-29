import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast"; // Correct path for toast
import {
  Todo,
  CreateTodoRequest,
  UpdateTodoRequest,
  CompleteTodoRequest,
  DeleteTodoRequest,
} from "@/schema/todo";
import { todoApi } from "@/lib/api";

const TODO_LIST_QUERY_KEY = ["todoList"];

export function useFetchTodoList() {
  return useQuery<Todo[], Error>({
    queryKey: TODO_LIST_QUERY_KEY,
    queryFn: async () => {
      const response = await todoApi.fetchTodoList();
      if (response.error) {
        throw new Error(response.error.message || "Failed to fetch todo list.");
      }
      return response.data || [];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true,
  });
}

export function useGetTodoDetails() {
  return useQuery<Todo, Error>({
    queryKey: ["todoDetails"],
    queryFn: async () => {
      const response = await todoApi.getTodoDetails();
      if (response.error) {
        throw new Error(response.error.message || "Failed to fetch todo details.");
      }
      return response.data!;
    },
    enabled: false, // This query is not intended for fetching specific todo by ID based on current OpenAPI spec.
                    // Enable it if you intend to fetch some default/active todo without parameters.
  });
}

export function useCreateTodo() {
  const queryClient = useQueryClient();
  return useMutation<Todo, Error, CreateTodoRequest, unknown>({
    mutationFn: async (newTodoData) => {
      const response = await todoApi.createTodo(newTodoData);
      if (response.error) {
        throw new Error(response.error.message || "Failed to create todo.");
      }
      return response.data!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TODO_LIST_QUERY_KEY });
      toast({
        title: "Success!",
        description: "Todo created successfully.",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error!",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useUpdateTodo() {
  const queryClient = useQueryClient();
  return useMutation<Todo, Error, UpdateTodoRequest, unknown>({
    mutationFn: async (updatedTodoData) => {
      const response = await todoApi.updateTodo(updatedTodoData);
      if (response.error) {
        throw new Error(response.error.message || "Failed to update todo.");
      }
      return response.data!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TODO_LIST_QUERY_KEY });
      toast({
        title: "Success!",
        description: "Todo updated successfully.",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error!",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useCompleteTodo() {
  const queryClient = useQueryClient();
  return useMutation<Todo, Error, CompleteTodoRequest, unknown>({
    mutationFn: async (completeTodoData) => {
      const response = await todoApi.completeTodo(completeTodoData);
      if (response.error) {
        throw new Error(response.error.message || "Failed to complete todo.");
      }
      return response.data!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TODO_LIST_QUERY_KEY });
      toast({
        title: "Success!",
        description: "Todo marked as complete.",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error!",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useDeleteTodo() {
  const queryClient = useQueryClient();
  return useMutation<Todo, Error, DeleteTodoRequest, unknown>({
    mutationFn: async (deleteTodoData) => {
      const response = await todoApi.deleteTodo(deleteTodoData);
      if (response.error) {
        throw new Error(response.error.message || "Failed to delete todo.");
      }
      return response.data!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TODO_LIST_QUERY_KEY });
      toast({
        title: "Success!",
        description: "Todo deleted successfully.",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error!",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}