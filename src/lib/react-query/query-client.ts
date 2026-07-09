import {
  isServer,
  QueryClient,
} from "@tanstack/react-query";

const makeQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5,
        refetchInterval: false,
        retry: 1,
      },
    },
  });

let browserQueryClient: QueryClient | undefined;

export const getQueryClient = () => {
  if (isServer) {
    return makeQueryClient();
  }

  browserQueryClient ??= makeQueryClient();

  return browserQueryClient;
};
