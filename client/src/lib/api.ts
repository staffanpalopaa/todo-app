const API_BASE_URL = "/api/v1";

interface ApiErrorResponse {
  message: string;
}

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    let errorData: ApiErrorResponse | undefined;
    try {
      errorData = await response.json();
    } catch (e) {
      // If response is not JSON, use status text
      throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
    }
    throw new Error(errorData?.message || `HTTP error! status: ${response.status} - ${response.statusText}`);
  }
  return response.json();
};

export const api = {
  get: async <T>(path: string): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return handleResponse<T>(response);
  },

  post: async <T, U>(path: string, data: U): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return handleResponse<T>(response);
  },
};