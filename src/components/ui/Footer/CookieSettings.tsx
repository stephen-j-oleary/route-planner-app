"use client";

import { Link, LinkProps } from "@mui/material";

import CookieConsentTrigger from "@/components/ui/CookieConsent/Trigger";


export default function CookieSettings(props: Pick<LinkProps, "variant" | "component" | "underline" | "sx" | "children">) {
  return (
    <CookieConsentTrigger
      renderTrigger={params => (
        <Link {...params} {...props} component="button" />
      )}
    />
  )
}