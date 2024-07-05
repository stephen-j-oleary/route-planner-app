import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { Box, Container } from "@mui/material";

import LoginForm from "@/components/LoginForm";
import { SearchParams } from "@/types/next";
import { auth } from "@/utils/auth/server";


export default async function LoginPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const { userId } = await auth(cookies());

  let { callbackUrl, linkAccount } = searchParams;

  callbackUrl = typeof callbackUrl === "string" ? callbackUrl : "/account";
  linkAccount = typeof linkAccount === "string" ? linkAccount : undefined;

  if (userId && !linkAccount) return redirect(callbackUrl);


  return (
    <Container
      maxWidth="sm"
      disableGutters
      sx={{ paddingY: 5 }}
    >
      <Box
        paddingY={3}
        paddingX={5}
        sx={{
          borderInline: "1px solid",
          borderColor: "grey.400",
        }}
      >
        <LoginForm
          callbackUrl={callbackUrl}
          defaultValues={linkAccount ? { email: linkAccount } : undefined}
        />
      </Box>
    </Container>
  );
}

export const metadata = {
  title: "Loop Mapping - Login",
};