import { QueryClient, QueryClientProviderProps, QueryClientProvider as RQQueryClientProvider } from "react-query";


const client = new QueryClient();

export default function QueryClientProvider(props: Omit<QueryClientProviderProps, "client">) {
  return (
    <RQQueryClientProvider
      client={client}
      {...props}
    />
  )
}