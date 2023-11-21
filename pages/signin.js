import { useRouter } from "next/router";

import { Box, Container } from "@mui/material";

import DefaultLayout from "@/components/Layouts/Default";
import SignInForm from "@/components/SignInForm";


export default function SigninPage() {
  const router = useRouter();
  const { message, error } = router.query;


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
        <SignInForm
          message={message}
          error={
            error
              && (error === "OAuthAccountNotLinked"
              ? "This account uses a different sign in method"
              : error === "OAuthAccountInUse"
              ? "This account is already in use"
              : "An error occured. Please try again")
          }
        />
      </Box>
    </Container>
  );
}

SigninPage.getLayout = props => (
  <DefaultLayout
    title="Sign In"
    headingComponent="h2"
    hideUserMenu
    {...props}
  />
);