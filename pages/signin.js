import { useRouter } from "next/router";

import { Box, Container } from "@mui/material";

import ErrorBoundary from "@/components/ErrorBoundary";
import DefaultLayout from "@/components/Layouts/Default";
import SignInForm from "@/components/SignInForm";


export default function SigninPage() {
  const { query } = useRouter();
  const { message, error } = query;

  return (
    <ErrorBoundary>
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
          <SignInForm message={message} error={error && "An error occured. Please try again"} />
        </Box>
      </Container>
    </ErrorBoundary>
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