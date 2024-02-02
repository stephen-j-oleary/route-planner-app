import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { useQuery } from "react-query";

import useDeferred from "@/hooks/useDeferred";


export const selectUser = (data?: Session) => data?.user;
export const selectCustomerId = (data?: Session) => data?.user?.customerId;


export type UseGetSessionOptions<TSelected> = {
  enabled?: boolean,
  select?: (data: Session | null) => TSelected,
};

export function useGetSession<TSelected = Session | null>(options: UseGetSessionOptions<TSelected> = {}) {
  const session = useSession();
  const deferredSession = useDeferred(
    session.data,
    session.status !== "loading"
  );

  return useQuery({
    queryKey: ["session"],
    queryFn: () => deferredSession.execute(),
    ...options,
  });
}