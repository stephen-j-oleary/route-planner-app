"use client";

import { FunctionComponent } from "react";

import { Link, LinkProps } from "@mui/material";

import CookieConsentTrigger from "@/components/ui/CookieConsent/Trigger";


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function CookieSettings<Component extends FunctionComponent<any>>(props: LinkProps<Component>) {
  return (
    <CookieConsentTrigger
      renderTrigger={params => (
        <Link {...params} {...props} />
      )}
    />
  )
}