import { QueryClient, QueryClientProvider as RQQueryClientProvider } from "react-query";


const client = new QueryClient();

export default function QueryClientProvider(props) {
  return (
    <RQQueryClientProvider
      client={client}
      {...props}
    />
  )
}