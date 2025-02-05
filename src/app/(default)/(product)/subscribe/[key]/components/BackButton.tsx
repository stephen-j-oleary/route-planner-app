"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { KeyboardArrowLeftRounded } from "@mui/icons-material";
import { Button } from "@mui/material";

import pages from "@/pages";
import { getCallbackUrl } from "@/utils/auth/utils";
import { appendQuery } from "@/utils/url";


export default function BackButton({
  headerStore,
}: {
  headerStore: Record<string, string | string[] | undefined>,
}) {
  const searchParams = useSearchParams();
  const callbackUrl = getCallbackUrl({ searchParams, headerStore });

  return (
    <Button
      size="medium"
      component={Link}
      href={appendQuery(pages.plans, { callbackUrl })}
      startIcon={<KeyboardArrowLeftRounded />}
    >
      Back to plans
    </Button>
  );
}