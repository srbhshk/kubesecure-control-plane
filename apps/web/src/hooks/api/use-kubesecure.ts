import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/lib/services/api';

type ApiListResponse<T> = T[];
type ApiCreatePayload<T> = T;

export function useEnvironments() {
  return useQuery({
    queryKey: ['environments'],
    queryFn: () => apiService.get<ApiListResponse<unknown>>('/environments'),
  });
}

export function useCreateEnvironment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ApiCreatePayload<unknown>) => apiService.post('/environments', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['environments'] });
    },
  });
}

export function usePromotions() {
  return useQuery({
    queryKey: ['promotions'],
    queryFn: () => apiService.get<ApiListResponse<unknown>>('/promotions'),
  });
}

export function useCreatePromotion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ApiCreatePayload<unknown>) => apiService.post('/promotions/preview', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
    },
  });
}
