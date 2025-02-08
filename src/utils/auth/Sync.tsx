"use client";

import { useEffect } from "react";

import { signIn } from "./client";



export default function SyncAuth() {
  useEffect(
    () => void signIn().catch(console.error),
    []
  );

  return null;
}