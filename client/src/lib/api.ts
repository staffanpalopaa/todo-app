import {
  Todo,
  CreateTodoRequest,
  UpdateTodoRequest,
  CompleteTodoRequest,
  DeleteTodoRequest,
  ErrorResponse,
} from "@/schema/todo";

const API_BASE_URL = "/api/v1";

interface ApiResponse<T> {
  data?: T;
  error?: ErrorResponse;
  status: number;
}

async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  const status = response.status;
  if (response.ok) {
    const data = await response.json();
    return { data, status };
  } else {
    try {
      const error = await response.json();
      return { error, status };
    } catch (e) {
      return {
        error: { message: `HTTP Error: ${status}` },
        status,
      };
    }
  }
}

export const todoApi = {
  fetchTodoList: async (): Promise<ApiResponse<Todo[]>> => {
    const response = await fetch(`${API_BASE_URL}/fetch-todo-list`);
    return handleResponse<Todo[]>(response);
  },

  getTodoDetails: async (): Promise<ApiResponse<Todo>> => {
    // NOTE: The OpenAPI spec for getTodoDetails does not define any parameters.
    // This implementation strictly follows that, meaning it won't fetch a specific todo by ID.
    // If the API were intended to fetch by ID, the OpenAPI spec would need to be updated.
    const response = await fetch(`${API_BASE_URL}/get-todo-details`);
    return handleResponse<Todo>(response);
  },

  createTodo: async (
    data: CreateTodoRequest
  ): Promise<ApiResponse<Todo>> => {
    const response = await fetch(`${API_BASE_URL}/create-todo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return handleResponse<Todo>(response);
  },

  updateTodo: async (
    data: UpdateTodoRequest
  ): Promise<ApiResponse<Todo>> => {
    const response = await fetch(`${API_BASE_URL}/update-todo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return handleResponse<Todo>(response);
  },

  completeTodo: async (
    data: CompleteTodoRequest
  ): Promise<ApiResponse<Todo>> => {
    const response = await fetch(`${API_BASE_URL}/complete-todo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return handleResponse<Todo>(response);
  },

  deleteTodo: async (
    data: DeleteTodoRequest
  ): Promise<ApiResponse<Todo>> => {
    const response = await fetch(`${API_BASE_URL}/delete-todo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return handleResponse<Todo>(response);
  },
};