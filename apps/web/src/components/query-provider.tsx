'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { errorService } from '@/lib/services/error';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            retry: 1,
            refetchOnWindowFocus: false,
            throwOnError: (error: Error | unknown) => {
              errorService.logError(error, 'Query Error');
              return false;
            },
          },
          mutations: {
            onError: (error: Error | unknown) => {
              errorService.logError(error, 'Mutation Error');
            },
          },
        },
      })
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
