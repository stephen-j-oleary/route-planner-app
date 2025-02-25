"use client";

import { createContext, Dispatch, ReactNode, SetStateAction, useState } from "react";


type TCookieConsentContext = {
  ready: boolean,
  setReady: Dispatch<SetStateAction<boolean>>,
  show: boolean,
  setShow: Dispatch<SetStateAction<boolean>>,
  customize: boolean,
  setCustomize: Dispatch<SetStateAction<boolean>>,
  consent: string[] | undefined,
  setConsent: Dispatch<SetStateAction<string[] | undefined>>,
};

export const CookieConsentContext = createContext<TCookieConsentContext>({
  ready: false,
  setReady: () => {},
  show: false,
  setShow: () => {},
  customize: false,
  setCustomize: () => {},
  consent: undefined,
  setConsent: () => {},
});


export default function CookieConsentProvider({
  children,
}: {
  children: ReactNode,
}) {
  const [ready, setReady] = useState(false);
  const [show, setShow] = useState(false);
  const [customize, setCustomize] = useState(false);
  const [consent, setConsent] = useState<string[] | undefined>();

  return (
    <CookieConsentContext.Provider
      value={{
        ready,
        setReady,
        show,
        setShow,
        customize,
        setCustomize,
        consent,
        setConsent,
      }}
    >
      {children}
    </CookieConsentContext.Provider>
  );
}