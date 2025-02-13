import "client-only";

import { useContext, useEffect } from "react";

import { getConsentRecord } from "./actions";
import { CONSENT_RECORD_NAME } from "./constants";
import { CookieConsentContext } from "./Provider";


export function useConsent() {
  const { consent, setConsent } = useContext(CookieConsentContext);

  useEffect(
    () => {
      const checkConsent = () => {
        const _consent = getConsentRecord();
        setConsent(_consent?.categories);
      };

      // Check immediately
      checkConsent();

      // Create event listener to check any time local storage is updated
      const storageListener = (event: StorageEvent) => {
        if (event.key === CONSENT_RECORD_NAME) checkConsent();
      };

      window.addEventListener("storage", storageListener);
      return () => {
        window.removeEventListener("storage", storageListener);
      };
    },
    [setConsent]
  );

  return consent;
}