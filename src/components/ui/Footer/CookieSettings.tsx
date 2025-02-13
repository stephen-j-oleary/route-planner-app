"use client";

import { Link, LinkProps } from "@mui/material";

import CookieConsentTrigger from "@/components/ui/CookieConsent/Trigger";


export default function CookieSettings(props: LinkProps) {
  return (
    <CookieConsentTrigger
      renderTrigger={params => (
        <Link href="#" {...params} {...props} />
      )}
    />
  )
}