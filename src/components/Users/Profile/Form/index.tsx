"use client";

import Link from "next/link";
import { useActionState } from "react";

import { LoadingButton } from "@mui/lab";
import { Alert, Autocomplete, Button, createFilterOptions, Stack, TextField } from "@mui/material";

import profileFormSubmit from "./action";
import FormSubmit from "@/components/ui/FormSubmit";
import { IUser } from "@/models/User";
import pages from "@/pages";
import { FromMongoose } from "@/utils/mongoose";
import { getCountryCodes, getCountryName } from "@/utils/Radar/utils";


export type ProfileFormProps = {
  user: FromMongoose<IUser> | undefined | null,
};

export default function ProfileForm({
  user,
}: ProfileFormProps) {
  const [lastResult, formAction] = useActionState(
    profileFormSubmit,
    null,
  );

  const filterOptions = createFilterOptions<string>({
    stringify: opt => getCountryName(opt) ?? "",
  });


  return (
    <form action={formAction}>
      <Stack
        width="100%"
        padding={1}
        spacing={2}
      >
        <TextField
          name="id"
          value={user?.id ?? ""}
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
          value={user?.email ?? ""}
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

        <Autocomplete
          options={getCountryCodes()}
          defaultValue={user?.countryCode ?? ""}
          renderOption={({ key, ...params }, o) => <li key={key} {...params}>{getCountryName(o) ?? ""}</li>}
          filterOptions={filterOptions}
          renderInput={params => (
            <TextField
              name="countryCode"
              label="Country"
              {...params}
            />
          )}
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
            replace
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