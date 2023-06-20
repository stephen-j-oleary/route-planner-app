import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import YupPassword from "yup-password";

import { LoadingButton } from "@mui/lab";
import { Alert, Collapse, Stack, TextField } from "@mui/material";

import ChangePassword from "@/components/Users/ChangePassword";
import LinkProvider from "@/components/Users/LinkProvider";
import UnlinkProvider from "@/components/Users/UnlinkProvider";
import useDeferred from "@/shared/hooks/useDeferred";
import { selectUser, useGetSession } from "@/shared/reactQuery/useSession";
import { useUpdateUserById } from "@/shared/reactQuery/useUsers";

YupPassword(yup);


export default function UserAuthForm() {
  const authUser = useGetSession({ select: selectUser });

  const defaultValues = useDeferred(
    !!authUser.data,
    {
      id: authUser.data?._id ?? "",
      email: authUser.data?.email ?? "",
    }
  );

  const form = useForm({
    defaultValues: defaultValues.execute,
  });

  const submitMutation = useUpdateUserById();


  return (
    <Stack
      spacing={3}
      alignItems="flex-start"
      width="100%"
      paddingX={1}
    >
      <Stack
        component="form"
        onSubmit={form.handleSubmit(submitMutation.mutate)}
        spacing={2}
        alignItems="flex-start"
      >
        <Alert severity="info">
          {`Your account email cannot be changed at this time. We're working on getting this feature up and running.`}
        </Alert>

        <Controller
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <TextField
              label="Email"
              disabled={
                form.formState.isLoading
                  || true // Keep disabled until this feature is available
              }
              error={fieldState.invalid}
              helperText={fieldState.error?.message}
              inputProps={{
                style: { cursor: "not-allowed" },
              }}
              {...field}
            />
          )}
        />

        {
          submitMutation.isSuccess && (
            <Alert severity="success">
              Changes saved
            </Alert>
          )
        }

        {
          submitMutation.isError && (
            <Alert severity="error">
              An error occurred. Please try again
            </Alert>
          )
        }

        <Collapse in={form.formState.isDirty}>
          <LoadingButton
            type="submit"
            variant="contained"
            size="medium"
            loading={submitMutation.isLoading}
            disabled={form.formState.isLoading}
          >
            Save Changes
          </LoadingButton>
        </Collapse>
      </Stack>

      <ChangePassword
        type="button"
        variant="outlined"
        size="medium"
      />

      <LinkProvider
        type="button"
        variant="outlined"
        size="medium"
      />

      <UnlinkProvider
        type="button"
        variant="outlined"
        size="medium"
      />
    </Stack>
  );
}