import { useCallback } from "react";

import { selectUser, useGetSession } from "@/reactQuery/useSession";


export default function useUserAvatar({ size = 40 } = {}) {
  const authUser = useGetSession({ select: selectUser });

  const getProps = useCallback(
    () => ({
      src: authUser.data?.image,
      children: authUser.data?.email?.slice(0, 1),
      sx: {
        width: size,
        height: size,
      },
    }),
    [authUser, size]
  );

  return { getProps };
}