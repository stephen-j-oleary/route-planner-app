"use client";

import Link from "next/link";
import React from "react";

import { LoadingButton } from "@mui/lab";
import { Alert, Button, Stack, TextField } from "@mui/material";

import profileFormSubmit from "./action";
import FormSubmit from "@/components/ui/FormSubmit";
import { IUser } from "@/models/User";
import { FromMongoose } from "@/utils/mongoose";
import pages from "pages";


export type ProfileFormProps = {
  user: FromMongoose<IUser> | undefined | null,
};

export default function ProfileForm({
  user,
}: ProfileFormProps) {
  const [lastResult, formAction] = React.useActionState(
    profileFormSubmit,
    null,
  );


  return (
    <form action={formAction}>
      <Stack
        width="100%"
        padding={1}
        spacing={2}
      >
        <TextField
          name="id"
          defaultValue={user?.id ?? ""}
          label="User id"
          slotProps={{
            htmlInput: {
              readOnly: true,
              sx: { cursor: "not-allowed" },
            },
          }}
        />

        <TextField
          name="email"
          defaultValue={user?.email ?? ""}
          label="Email"
          slotProps={{
            htmlInput: {
              readOnly: true,
              sx: { cursor: "not-allowed" },
            },
          }}
        />

        <TextField
          name="name"
          defaultValue={user?.name ?? ""}
          label="Name"
        />

        {
          lastResult?.error && (
            <Alert severity="error">
              {lastResult.error}
            </Alert>
          )
        }

        <div>
          <Button
            component={Link}
            href={pages.account.root}
            variant="text"
            size="medium"
            sx={{ mr: 2 }}
          >
            Cancel
          </Button>

          <FormSubmit
            renderSubmit={status => (
              <LoadingButton
                type="submit"
                variant="contained"
                size="medium"
                loading={status.pending}
              >
                Save profile
              </LoadingButton>
            )}
          />
        </div>
      </Stack>
    </form>
  );
}