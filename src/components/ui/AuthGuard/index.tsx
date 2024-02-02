import { signIn, useSession } from "next-auth/react";
import React from "react";

import { CircularProgress, Stack, Typography } from "@mui/material";


export type AuthGuardProps = {
  children: React.ReactNode,
};

export default function AuthGuard({ children }: AuthGuardProps) {
  const session = useSession();

  React.useEffect(
    () => {
      if (session.status === "unauthenticated") signIn();
    },
    [session.status]
  );

  if (session.status !== "authenticated") {
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