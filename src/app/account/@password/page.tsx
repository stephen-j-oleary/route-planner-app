"use client";

import { useRouter } from "next/navigation";

import Toast from "@/components/ui/Toast";
import { PageProps } from "@/types/next";
import pages from "pages";


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