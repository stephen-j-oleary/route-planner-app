import dynamic from "next/dynamic";

import { Stack, Typography } from "@mui/material";

import SignInFormEmailInput from "./inputs/EmailInput";
import SignInFormPasswordInput from "./inputs/PasswordInput";
import SignInFormSubmit from "@/components/SignInForm/inputs/Submit";
import { SIGN_IN_FORM_FIELD_NAMES } from "@/components/SignInForm/Logic";
import ProvidersList from "@/components/SignInForm/ProvidersList";

const Alert = dynamic(() => import("@mui/material/Alert"), { ssr: false });


export default function SignInFormView({
  message,
  errors,
  formStep,
  getProvidersListProps,
  getInputProps,
  getSubmitProps,
}) {
  return (
    <Stack spacing={4}>
      <Typography
        component="h1"
        variant="h4"
        textAlign="center"
      >
        Sign In
      </Typography>

      <Typography
        component="p"
        variant="body1"
        textAlign="center"
      >
        {message}
      </Typography>

      <ProvidersList
        {...getProvidersListProps()}
      />

      <Typography
        variant="body1"
        textAlign="center"
      >
        - or -
      </Typography>

      <Stack
        spacing={2}
        component="form"
      >
        <SignInFormEmailInput
          {...getInputProps(SIGN_IN_FORM_FIELD_NAMES.email)}
        />

        {
          formStep === 1 && (
            <SignInFormPasswordInput
              {...getInputProps(SIGN_IN_FORM_FIELD_NAMES.password)}
            />
          )
        }
      </Stack>

      {
        errors.map((error, i) => (
          <Alert key={i} severity="error">
            {error}
          </Alert>
        ))
      }

      <SignInFormSubmit
        {...getSubmitProps()}
      />
    </Stack>
  );
}