"use client";

import { useMutation } from "@tanstack/react-query";
import React from "react";
import { Controller, useForm } from "react-hook-form";

import { LoadingButton } from "@mui/lab";
import { Alert, Collapse, List, ListItem, ListItemText, TextField } from "@mui/material";

import { patchUser } from "@/app/api/user/actions";
import { IUser } from "@/models/User";


export type UserProfileFormProps = {
  user: (Omit<IUser, "_id"> & { id: string }) | null,
};

export default function UserProfileForm({
  user,
}: UserProfileFormProps) {
  const form = useForm({
    defaultValues: {
      id: user?.id ?? "",
      name: user?.name ?? "",
    },
  });

  const submitMutation = useMutation({
    mutationFn: patchUser,
  });

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
          secondary={user?.id || ""}
        />
      </ListItem>

      <ListItem disablePadding>
        <ListItemText
          primary="Email"
          secondary={user?.email || ""}
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
            loading={submitMutation.isPending}
            disabled={form.formState.isLoading}
          >
            Save profile
          </LoadingButton>
        </ListItem>
      </Collapse>
    </List>
  );
}