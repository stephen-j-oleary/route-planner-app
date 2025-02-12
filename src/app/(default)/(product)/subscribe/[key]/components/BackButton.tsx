"use client";

import { useRouter } from "next/navigation";

import { KeyboardArrowLeftRounded } from "@mui/icons-material";
import { Button } from "@mui/material";


export default function BackButton() {
  const router = useRouter();

  return (
    <Button
      size="medium"
      onClick={() => router.back()}
      startIcon={<KeyboardArrowLeftRounded />}
    >
      Back to plans
    </Button>
  );
}