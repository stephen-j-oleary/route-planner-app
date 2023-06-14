import { Controller, useForm } from "react-hook-form";

import { LoadingButton } from "@mui/lab";
import { Alert, Collapse, Stack, TextField } from "@mui/material";

import useDeferred from "@/shared/hooks/useDeferred";
import { selectUser, useGetSession } from "@/shared/reactQuery/useSession";
import { useUpdateUserById } from "@/shared/reactQuery/useUsers";


export default function UserProfileForm() {
  const authUser = useGetSession({ select: selectUser });

  const defaultValues = useDeferred(
    [!!authUser.data],
    {
      id: authUser.data?._id ?? "",
      name: authUser.data?.name ?? "",
    }
  );

  const form = useForm({
    defaultValues: defaultValues.execute,
  });

  const handleSubmit = useUpdateUserById();


  return (
    <Stack
      component="form"
      onSubmit={form.handleSubmit(handleSubmit.mutate)}
      spacing={2}
      alignItems="flex-start"
      width="100%"
      paddingX={1}
    >
      <Controller
        control={form.control}
        name="name"
        render={({ field: { ref, value, ...field }, fieldState }) => (
          <TextField
            inputRef={ref}
            value={value ?? ""}
            label="Name"
            disabled={form.formState.isLoading}
            error={fieldState.invalid}
            helperText={fieldState.error?.message}
            {...field}
          />
        )}
      />

      {
        handleSubmit.isSuccess && (
          <Alert severity="success">
            Changes saved
          </Alert>
        )
      }

      {
        handleSubmit.isError && (
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
          loading={handleSubmit.isLoading}
          disabled={form.formState.isLoading}
        >
          Save Changes
        </LoadingButton>
      </Collapse>
    </Stack>
  );
}