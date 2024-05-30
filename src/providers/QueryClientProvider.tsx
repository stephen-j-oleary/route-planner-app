"use client";

import { QueryClient, QueryClientProviderProps, QueryClientProvider as RQQueryClientProvider } from "@tanstack/react-query";

function makeQueryClient() {
  return new QueryClient();
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (typeof window === "undefined") {
    // Server: always make a new query client
    return makeQueryClient();
  }
  else {
    // Browser: make a new query client if we don't already have one
    browserQueryClient ??= makeQueryClient();
    return browserQueryClient;
  }
}

export default function QueryClientProvider(props: Omit<QueryClientProviderProps, "client">) {
  const queryClient = getQueryClient();

  return (
    <RQQueryClientProvider
      client={queryClient}
      {...props}
    />
  );
}