import { QueryClient } from "@tanstack/react-query";
import { sileo } from "sileo";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      onError: (error: any) => {
        const message =
          error?.response?.data?.message ||
          "Something went wrong. Please try again.";
        sileo.error({
          title: "Error",
          description: message,
        });
      },
    },
  },
});
