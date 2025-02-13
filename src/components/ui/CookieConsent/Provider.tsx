"use client";

import { createContext, Dispatch, ReactNode, SetStateAction, useState } from "react";


type TCookieConsentContext = {
  show: boolean,
  setShow: Dispatch<SetStateAction<boolean>>,
  customize: boolean,
  setCustomize: Dispatch<SetStateAction<boolean>>,
  consent: string[] | undefined,
  setConsent: Dispatch<SetStateAction<string[] | undefined>>,
};

export const CookieConsentContext = createContext<TCookieConsentContext>({
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
  const [show, setShow] = useState(false);
  const [customize, setCustomize] = useState(false);
  const [consent, setConsent] = useState<string[] | undefined>();

  return (
    <CookieConsentContext.Provider
      value={{
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