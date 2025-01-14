"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-toastify";

import { Alert } from "@mui/material";

import { PageProps } from "@/types/next";
import pages from "pages";


export default function Page({
  searchParams,
}: PageProps) {
  const router = useRouter();
  const passwordChanged = "password-changed" in searchParams;

  useEffect(
    () => {
      if (!passwordChanged) return;

      const id = toast(
        ({ closeToast }) => (
          <Alert severity="success" onClose={() => closeToast()}>
            Password changed
          </Alert>
        ),
        {
          autoClose: 5000,
          onClose: () => router.replace(pages.account.root),
        }
      );

      return () => toast.dismiss(id);
    },
    [passwordChanged, router]
  );

  return null;
}