"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import { Controller, useForm } from "react-hook-form";

import { LoadingButton } from "@mui/lab";
import { Alert, Collapse, List, ListItem, ListItemText, TextField } from "@mui/material";

import userProfileSubmit from "./action";
import FormSubmit from "@/components/ui/FormSubmit";
import { IUser } from "@/models/User";
import { UserProfileSchema } from "@/models/User/schemas";


export type UserProfileFormProps = {
  user: (Omit<IUser, "_id"> & { id: string }) | undefined | null,
};

export default function UserProfileForm({
  user,
}: UserProfileFormProps) {
  const form = useForm({
    defaultValues: {
      id: user?.id ?? "",
      name: user?.name ?? "",
    },
    resolver: yupResolver(UserProfileSchema),
  });

  const [result, formAction] = React.useActionState(
    userProfileSubmit,
    {}
  );

  React.useEffect(
    () => void form.register("id"),
    [form]
  );


  return (
    <List
      component="form"
      action={formAction}
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
        result.updatedUser && (
          <ListItem disableGutters>
            <Alert severity="success">
              Profile changes saved
            </Alert>
          </ListItem>
        )
      }

      {
        result.error && (
          <ListItem disableGutters>
            <Alert severity="error">
              {result.error}
            </Alert>
          </ListItem>
        )
      }

      <Collapse in={form.formState.isDirty}>
        <ListItem disableGutters>
          <FormSubmit
            renderSubmit={({ pending }) => (
              <LoadingButton
                type="submit"
                variant="contained"
                size="medium"
                loading={pending}
                disabled={form.formState.isLoading}
              >
                Save profile
              </LoadingButton>
            )}
          />
        </ListItem>
      </Collapse>
    </List>
  );
}