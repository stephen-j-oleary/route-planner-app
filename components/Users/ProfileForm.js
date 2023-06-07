import { Controller, useForm } from "react-hook-form";

import { LoadingButton } from "@mui/lab";
import { Alert, Collapse, Skeleton, Stack, TextField } from "@mui/material";

import LoadingPlaceholder from "@/components/LoadingPlaceholder";
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
      <LoadingPlaceholder
        isLoading={form.formState.isLoading}
        placeholder={() => (
          <Skeleton variant="rounded">
            <TextField />
          </Skeleton>
        )}
      >
        <Controller
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <TextField
              label="Name"
              error={fieldState.invalid}
              helperText={fieldState.error?.message}
              {...field}
            />
          )}
        />
      </LoadingPlaceholder>

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