import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { useQuery } from "react-query";

import useDeferred from "@/hooks/useDeferred";


export const selectUser = (data?: Session) => data?.user;
export const selectCustomerId = (data?: Session) => data?.user?.customerId;


export type UseGetSessionOptions<TData = Session> = {
  enabled?: boolean,
  select?: (data: Session) => TData,
};

export function useGetSession<TData = Session>(options: UseGetSessionOptions<TData> = {}) {
  const session = useSession();
  const deferredSession = useDeferred(
    session.status !== "loading",
    session.data
  );

  return useQuery({
    ...options,
    queryKey: ["session"],
    queryFn: () => deferredSession.execute(),
  });
}