import { useSession } from "next-auth/react";
import { useQuery } from "react-query";

import useDeferred from "../hooks/useDeferred";


export const selectUser = data => data?.user;

export function useGetSession(options = {}) {
  const session = useSession();
  const deferredSession = useDeferred(
    [session.status !== "loading"],
    session.data
  );

  return useQuery({
    queryKey: ["session"],
    queryFn: () => deferredSession.execute(),
    ...options,
  });
}