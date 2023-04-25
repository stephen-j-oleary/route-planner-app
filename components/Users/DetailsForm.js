import { useForm } from "react-hook-form";

import { LoadingButton } from "@mui/lab";
import { Alert, Skeleton, Stack, TextField, Tooltip } from "@mui/material";

import LoadingPlaceholder from "@/components/LoadingPlaceholder";
import useDeferred from "@/shared/hooks/useDeferred";
import { selectUser, useGetSession } from "@/shared/reactQuery/useSession";
import { useUpdateUserById } from "@/shared/reactQuery/useUsers";


export default function UserDetailsForm() {
  const authUser = useGetSession({ select: selectUser });

  const defaultValues = useDeferred(
    [authUser.isFetched],
    {
      id: authUser.data?._id,
      name: authUser.data?.name ?? "",
      email: authUser.data?.email ?? "",
    }
  );

  const form = useForm({
    defaultValues: defaultValues.execute,
  });

  const handleSubmit = useUpdateUserById();


  return (
    <Stack
      component="form"
      onSubmit={form.handleSubmit(handleSubmit.mutateAsync)}
      spacing={2}
      alignItems="flex-start"
      width="100%"
      paddingX={1}
    >
      <LoadingPlaceholder
        isLoading={form.formState.isLoading}
        placeholder={() => new Array(2).fill(0).map((_, i) => (
          <Skeleton key={i} variant="rounded">
            <TextField />
          </Skeleton>
        ))}
      >
        <TextField
          label="Name"
          {...form.register("name")}
        />

        <Tooltip
          title="Your account email cannot be changed at this time"
          placement="bottom-start"
        >
          <TextField
            label="Email"
            InputProps={{
              readOnly: true,
            }}
            {...form.register("email")}
          />
        </Tooltip>
      </LoadingPlaceholder>

      {
        form.formState.isSubmitted && (
          <Alert
            severity={handleSubmit.isError ? "error" : "success"}
          >
            {handleSubmit.isError ? "An error occurred. Please try again" : "Changes successfully saved"}
          </Alert>
        )
      }

      <LoadingButton
        type="submit"
        variant="contained"
        size="medium"
        loading={form.formState.isSubmitting}
        disabled={form.formState.isLoading}
      >
        Save Changes
      </LoadingButton>
    </Stack>
  );
}