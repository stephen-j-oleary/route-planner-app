"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-toastify";

import { Alert, Button, List, ListItem, ListItemText } from "@mui/material";

import { IUser } from "@/models/User";
import { FromMongoose } from "@/utils/mongoose";
import { getCountryFlag, getCountryName } from "@/utils/Radar/utils";
import pages from "pages";


export type ProfileDetailProps = {
  user: FromMongoose<IUser> | undefined | null,
};

export default function ProfileDetail({
  user,
}: ProfileDetailProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const profileSaved = searchParams.has("profile-saved");

  useEffect(
    () => {
      if (!profileSaved) return;

      // Handle the toast
      const id = toast(
        ({ closeToast }) => (
          <Alert severity="success" onClose={() => closeToast()}>
            Profile changes saved
          </Alert>
        ),
        {
          autoClose: 5000,
          onClose: () => router.replace(pages.account.root),
        }
      );

      // Dismiss the toast if useEffect runs again before profileSaved is removed
      return () => {
        if (id) toast.dismiss(id);
      }
    },
    [profileSaved, router]
  );

  return (
    <List
      sx={{
        width: "100%",
        padding: 1,
      }}
    >
      <ListItem disablePadding>
        <ListItemText
          primary="User id"
          secondary={user?.id || "Not Set"}
        />
      </ListItem>

      <ListItem disablePadding>
        <ListItemText
          primary="Email"
          secondary={user?.email || "Not Set"}
        />
      </ListItem>

      <ListItem disablePadding>
        <ListItemText
          primary="Name"
          secondary={user?.name ?? "Not Set"}
        />
      </ListItem>

      <ListItem disablePadding>
        <ListItemText
          primary="Country"
          secondary={user?.countryCode ? `${getCountryFlag(user.countryCode)} ${getCountryName(user.countryCode)}` : "Not Set"}
        />
      </ListItem>

      <ListItem disablePadding>
        <Button
          component={Link}
          href={pages.account.editProfile}
          replace
          variant="text"
          size="medium"
        >
          Edit profile
        </Button>
      </ListItem>
    </List>
  );
}