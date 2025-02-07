"use client";

import { useEffect } from "react";

import { signIn } from "./actions";


export default function SyncAuth() {
  useEffect(
    () => void signIn().catch(console.error),
    []
  );

  return null;
}