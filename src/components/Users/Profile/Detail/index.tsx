"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

import { Alert, Button, List, ListItem, ListItemText, Slide, Snackbar } from "@mui/material";

import { IUser } from "@/models/User";
import { FromMongoose } from "@/utils/mongoose";
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

  const handleCloseToast = () => router.replace(pages.account.root);

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
          secondary={user?.id || ""}
        />
      </ListItem>

      <ListItem disablePadding>
        <ListItemText
          primary="Email"
          secondary={user?.email || ""}
        />
      </ListItem>

      <ListItem disablePadding>
        <ListItemText
          primary="Name"
          secondary={user?.name ?? ""}
        />
      </ListItem>

      <ListItem disablePadding>
        <Button
          component={Link}
          href={pages.account.editProfile}
          variant="text"
          size="medium"
        >
          Edit profile
        </Button>
      </ListItem>

      <Snackbar
        open={profileSaved}
        autoHideDuration={6000}
        onClose={handleCloseToast}
        TransitionComponent={props => <Slide {...props} direction="right" />}
      >
        <Alert
          severity="success"
          onClose={handleCloseToast}
          sx={{ width: "100%" }}
        >
          Profile changes saved
        </Alert>
      </Snackbar>
    </List>
  )
}