import { useSession } from "next-auth/react";

import { CircularProgress, Dialog, DialogContent, Stack, Typography } from "@mui/material";

import LoginForm from "@/components/LoginForm";


export default function AuthGuard({ children }) {
  const session = useSession();

  if (session.status === "loading") {
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

  if (session.status === "unauthenticated") {
    return (
      <Dialog
        open={true}
        fullWidth
        maxWidth="xs"
        sx={{ zIndex: theme => theme.zIndex.appBar - 1 }}
      >
        <DialogContent>
          <LoginForm />
        </DialogContent>
      </Dialog>
    );
  }

  return children;
}