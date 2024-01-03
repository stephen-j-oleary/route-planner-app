import React from "react";
import { Controller, useForm } from "react-hook-form";

import { LoadingButton } from "@mui/lab";
import { Alert, Collapse, List, ListItem, ListItemText, TextField } from "@mui/material";

import useDeferred from "@/hooks/useDeferred";
import { selectUser, useGetSession } from "@/reactQuery/useSession";
import { useGetUserById, useUpdateUserById } from "@/reactQuery/useUsers";


export default function UserProfileForm() {
  const userId = useGetSession({ select: data => selectUser(data).id });
  const user = useGetUserById(userId.data);

  const defaultValues = useDeferred(
    {
      id: user.data?._id ?? "",
      name: user.data?.name ?? "",
    },
    !!user.data
  );

  const form = useForm({
    defaultValues: defaultValues.execute,
  });

  const submitMutation = useUpdateUserById();

  React.useEffect(
    () => void form.register("id"),
    [form]
  );


  return (
    <List
      component="form"
      onSubmit={form.handleSubmit(data => submitMutation.mutate(data))}
      sx={{
        width: "100%",
        paddingX: 1,
      }}
    >
      <ListItem disablePadding>
        <ListItemText
          primary="User id"
          secondary={user.data?._id.toString()}
        />
      </ListItem>

      <ListItem disablePadding>
        <ListItemText
          primary="Email"
          secondary={user.data?.email}
        />
      </ListItem>

      <ListItem disableGutters>
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
      </ListItem>

      {
        submitMutation.isSuccess && (
          <ListItem disableGutters>
            <Alert severity="success">
              Profile changes saved
            </Alert>
          </ListItem>
        )
      }

      {
        submitMutation.isError && (
          <ListItem disableGutters>
            <Alert severity="error">
              An error occurred. Please try again
            </Alert>
          </ListItem>
        )
      }

      <Collapse in={form.formState.isDirty}>
        <ListItem disableGutters>
          <LoadingButton
            type="submit"
            variant="contained"
            size="medium"
            loading={submitMutation.isLoading}
            disabled={form.formState.isLoading}
          >
            Save profile
          </LoadingButton>
        </ListItem>
      </Collapse>
    </List>
  );
}