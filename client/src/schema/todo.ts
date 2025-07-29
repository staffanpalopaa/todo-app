import { z } from "zod";

// Base OpenAPI Schemas to Zod Schemas
export const todoSchema = z.object({
  todoID: z.string(),
  todoTitle: z.string(),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  priority: z.string().optional(),
  category: z.string().optional(),
  completionDate: z.string().optional(),
  completionNotes: z.string().optional(),
  deletionReason: z.string().optional(),
});

export const createTodoRequestSchema = z.object({
  todoTitle: z.string().min(1, "Todo title is required"),
  description: z.string().optional(),
  dueDate: z.string().optional(), // YYYY-MM-DD
  priority: z.string().optional(),
  category: z.string().optional(),
});

export const updateTodoRequestSchema = z.object({
  todoID: z.string(),
  todoTitle: z.string().min(1, "Todo title is required"),
  description: z.string().optional(),
  dueDate: z.string().optional(), // YYYY-MM-DD
  priority: z.string().optional(),
  category: z.string().optional(),
});

export const completeTodoRequestSchema = z.object({
  todoID: z.string(),
  completionDate: z.string().optional(), // YYYY-MM-DD
  completionNotes: z.string().optional(),
});

export const deleteTodoRequestSchema = z.object({
  todoID: z.string(),
  deletionReason: z.string().optional(),
});

export const errorSchema = z.object({
  message: z.string(),
});

// Type Inference from Zod Schemas
export type Todo = z.infer<typeof todoSchema>;
export type CreateTodoRequest = z.infer<typeof createTodoRequestSchema>;
export type UpdateTodoRequest = z.infer<typeof updateTodoRequestSchema>;
export type CompleteTodoRequest = z.infer<typeof completeTodoRequestSchema>;
export type DeleteTodoRequest = z.infer<typeof deleteTodoRequestSchema>;
export type ErrorResponse = z.infer<typeof errorSchema>;