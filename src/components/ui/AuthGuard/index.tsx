import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
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
  const user = useGetUser();

  React.useEffect(
    () => {
      if (!user.isFetched) return;
      if (!user.data) return void signIn();
      if (!user.data.emailVerified && requireVerified) {
        return void router.replace({
          pathname: "/account/verify",
          query: {
            callbackUrl: createAbsoluteUrl(router.asPath),
          },
        });
      }
    },
    [user.isFetched, user.data, requireVerified, router]
  );

  if (!user.isFetched || !user.data) {
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