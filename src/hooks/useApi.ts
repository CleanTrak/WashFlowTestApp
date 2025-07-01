import { useState, useCallback } from "react";

interface UseApiState<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
}

export function useApi<T>(apiCall: (...args: unknown[]) => Promise<T>) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    error: null,
    isLoading: false,
  });

  const execute = useCallback(
    async (...args: unknown[]) => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const response = await apiCall(...args);
        setState((prev) => ({ ...prev, data: response, isLoading: false }));
        return response;
      } catch (error) {
        const err =
          error instanceof Error ? error : new Error("An error occurred");
        setState((prev) => ({ ...prev, error: err, isLoading: false }));
        throw err;
      }
    },
    [apiCall]
  );

  const reset = useCallback(() => {
    setState({
      data: null,
      error: null,
      isLoading: false,
    });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}

// Utility type for API responses
export type ApiResponse<T> = {
  data: T;
  status: number;
  message?: string;
};

// Custom error class for API errors
export class ApiError extends Error {
  constructor(message: string, public status?: number, public data?: unknown) {
    super(message);
    this.name = "ApiError";
  }
}
