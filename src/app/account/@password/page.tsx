"use client";

import { useRouter } from "next/navigation";

import { PageProps } from "@/types/next";
import pages from "pages";
import Toast from "@/components/ui/Toast";


export default function Page({
  searchParams,
}: PageProps) {
  const router = useRouter();

  const passwordChanged = searchParams["password-changed"] !== undefined;

  const handleCloseToast = () => router.replace(pages.account.root);

  return (
    <Toast
      title="Password changed"
      severity="success"
      open={passwordChanged}
      autoHideDuration={6000}
      onClose={handleCloseToast}
    />
  );
}