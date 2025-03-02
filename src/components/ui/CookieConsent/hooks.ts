import "client-only";

import { useContext } from "react";

import { CookieConsentContext } from "./Provider";


export function useConsent() {
  const { ready, consent } = useContext(CookieConsentContext);

  return { ready, consent };
}