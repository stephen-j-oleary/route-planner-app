import { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/react";
import React from "react";

import { CircularProgress, Stack, Typography } from "@mui/material";

import { useGetUser } from "@/reactQuery/useUsers";
import createAbsoluteUrl from "@/utils/createAbsoluteUrl";


export type AuthGuardProps = {
  requireVerified?: boolean,
  children: React.ReactNode,
};

export default function AuthGuard({
  requireVerified = false,
  children,
}: AuthGuardProps) {
  const router = useRouter();
  const session = useSession();
  const user = useGetUser();


  React.useEffect(
    () => {
      if (session.status === "unauthenticated") signIn();
    },
    [session.status]
  );

  React.useEffect(
    () => {
      if (requireVerified && user.data && !user.data.emailVerified) router.replace({
        pathname: "/account/verify",
        query: {
          callbackUrl: createAbsoluteUrl(router.asPath),
        },
      });
    },
    [requireVerified, user.data, router]
  );

  if (session.status !== "authenticated" || (requireVerified && !user.data)) {
    return (
      <Stack
        color="text.primary"
        justifyContent="center"
        alignItems="center"
        spacing={1}
        height="100%"
        flexGrow={1}
      >
        <CircularProgress color="inherit" />
        <Typography component="p" variant="body1">Loading</Typography>
      </Stack>
    );
  }

  return <>{children}</>;
}