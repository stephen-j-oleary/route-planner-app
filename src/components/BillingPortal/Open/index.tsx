"use client";

import { useActionState, useEffect } from "react";
import { toast } from "react-toastify";

import { LoadingButton, LoadingButtonProps } from "@mui/lab";
import { Alert } from "@mui/material";

import openBillingPortal from "./action";
import FormSubmit from "@/components/ui/FormSubmit";


export type OpenBillingPortalProps =
  & LoadingButtonProps
  & { returnUrl?: string };

export default function OpenBillingPortal({ returnUrl, ...props }: OpenBillingPortalProps) {
  const [result, action] = useActionState(
    openBillingPortal,
    null
  );

  useEffect(
    () => {
      if (!result?.error) return;

      const id = toast(
        ({ closeToast }) => <Alert severity="error" onClose={() => closeToast()}>{result.error}</Alert>,
        { autoClose: 5000 }
      );

      return () => toast.dismiss(id);
    },
    [result]
  );

  return (
    <form action={action}>
      <input type="hidden" name="return_url" value={returnUrl} />

      <FormSubmit renderSubmit={status => <LoadingButton type="submit" loading={status.pending} {...props} />} />
    </form>
  );
}