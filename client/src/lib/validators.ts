import { z } from "zod";

export const todoSchema = z.object({
  id: z.string().min(1, "ID is required"),
  description: z.string().min(1, "Description is required"),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Due date must be in YYYY-MM-DD format"),
  priority: z.enum(["Low", "Medium", "High"], {
    errorMap: () => ({ message: "Priority must be Low, Medium, or High" }),
  }),
  isCompleted: z.union([z.literal("true"), z.literal("false")], {
    errorMap: () => ({ message: "isCompleted must be 'true' or 'false'" }),
  }),
});

export type Todo = z.infer<typeof todoSchema>;

// Schema for client-side form input for creating a Todo
// The 'id' is omitted as per instructions "ID will be set on backend, do not include them in the forms."
// A client-side generated ID will be added before sending to the API to match OpenAPI's required 'id' field.
export const createTodoFormSchema = z.object({
  description: z.string().min(1, "Description is required"),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Due date must be in YYYY-MM-DD format"),
  priority: z.enum(["Low", "Medium", "High"], {
    errorMap: () => ({ message: "Priority must be Low, Medium, or High" }),
  }),
});

export type CreateTodoFormValues = z.infer<typeof createTodoFormSchema>;

// Schema for API request to complete a Todo
export const completeTodoRequestSchema = z.object({
  id: z.string().min(1, "Todo ID is required"),
});

export type CompleteTodoRequest = z.infer<typeof completeTodoRequestSchema>;

// Schema for API request to delete a Todo
export const deleteTodoRequestSchema = z.object({
  id: z.string().min(1, "Todo ID is required"),
});

export type DeleteTodoRequest = z.infer<typeof deleteTodoRequestSchema>;