import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Todo,
  CreateTodoFormValues,
  CompleteTodoRequest,
  DeleteTodoRequest,
} from "@/lib/validators";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export const useGetAllTodos = () => {
  return useQuery<Todo[]>({
    queryKey: ["todos"],
    queryFn: () => api.get("/get-all-todos"),
  });
};

export const useCreateTodo = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (newTodoData: CreateTodoFormValues): Promise<Todo> => {
      // Generate a client-side ID as required by the OpenAPI spec for CreateTodoRequest.
      // This reconciles the conflicting instruction "ID will be set on backend, do not include them in the forms."
      // with the OpenAPI spec's requirement for 'id' in the POST /create-todo body.
      // Since `uuid` is not in package.json, we generate a unique string using current timestamp and random suffix.
      const id = `${Date.now().toString()}-${Math.random().toString(36).substring(2, 9)}`;
      const payload = { ...newTodoData, id };
      return api.post("/create-todo", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      toast({
        title: "Success!",
        description: "Todo created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create todo: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};

export const useCompleteTodo = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CompleteTodoRequest): Promise<Todo> => {
      return api.post("/complete-todo", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      toast({
        title: "Success!",
        description: "Todo marked as complete.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to complete todo: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteTodo = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: DeleteTodoRequest): Promise<Todo> => {
      return api.post("/delete-todo", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      toast({
        title: "Success!",
        description: "Todo deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete todo: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};