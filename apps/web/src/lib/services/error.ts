import { AxiosError } from 'axios';
import { toast } from '@/hooks/use-toast';

export interface AppError {
  message: string;
  code?: string;
  status?: number;
  originalError?: unknown;
}

class ErrorService {
  public handleApiError(error: AxiosError | unknown): AppError {
    const axiosError = error as AxiosError;
    const status = axiosError.response?.status;
    const data = axiosError.response?.data as { message?: string } | undefined;

    let message = 'An unexpected error occurred. Please try again.';
    let code = 'UNKNOWN_ERROR';

    if (data?.message) {
      message = data.message;
    } else if (status === 401) {
      message = 'You are not authorized to perform this action.';
      code = 'UNAUTHORIZED';
    } else if (status === 403) {
      message = 'You do not have permission to access this resource.';
      code = 'FORBIDDEN';
    } else if (status === 404) {
      message = 'The requested resource was not found.';
      code = 'NOT_FOUND';
    } else if (status === 500) {
      message = 'Internal server error. Please contact support if the issue persists.';
      code = 'SERVER_ERROR';
    }

    const appError: AppError = {
      message,
      code,
      status,
      originalError: error,
    };

    // Show toast for non-silent errors
    this.notify(appError);

    return appError;
  }

  public notify(error: AppError) {
    toast({
      title: 'Error',
      description: error.message,
      variant: 'destructive',
    });
  }

  public logError(error: Error | unknown, context?: string) {
    // In production, send to error tracking service like Sentry
    console.error(`[ErrorService] ${context || 'Error'}:`, error);
  }
}

export const errorService = new ErrorService();
