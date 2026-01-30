import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { errorService } from "./error";

class ApiService {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request Interceptor
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // Auth token will be handled by Clerk middleware or added here if needed
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );

    // Response Interceptor
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response.data;
      },
      (error: AxiosError) => {
        const handledError = errorService.handleApiError(error);
        return Promise.reject(handledError);
      }
    );
  }

  public async get<T>(url: string, config?: InternalAxiosRequestConfig): Promise<T> {
    return this.instance.get(url, config);
  }

  public async post<T>(url: string, data?: unknown, config?: InternalAxiosRequestConfig): Promise<T> {
    return this.instance.post(url, data, config);
  }

  public async put<T>(url: string, data?: unknown, config?: InternalAxiosRequestConfig): Promise<T> {
    return this.instance.put(url, data, config);
  }

  public async patch<T>(url: string, data?: unknown, config?: InternalAxiosRequestConfig): Promise<T> {
    return this.instance.patch(url, data, config);
  }

  public async delete<T>(url: string, config?: InternalAxiosRequestConfig): Promise<T> {
    return this.instance.delete(url, config);
  }
}

export const apiService = new ApiService();
