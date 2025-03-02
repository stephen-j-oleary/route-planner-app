"use client";

import { createContext, Dispatch, ReactNode, SetStateAction, useState } from "react";
import useSWR, { useSWRConfig } from "swr";

import { getConsentRecord } from "./client";
import pages from "@/pages";


type TCookieConsentContext = {
  ready: boolean,
  show: boolean,
  setShow: Dispatch<SetStateAction<boolean>>,
  customize: boolean,
  setCustomize: Dispatch<SetStateAction<boolean>>,
  consent: string[] | undefined,
  revalidateConsent: () => void,
};

export const CookieConsentContext = createContext<TCookieConsentContext>({
  ready: false,
  show: false,
  setShow: () => {},
  customize: false,
  setCustomize: () => {},
  consent: undefined,
  revalidateConsent: () => {},
});


export default function CookieConsentProvider({
  children,
}: {
  children: ReactNode,
}) {
  const [show, setShow] = useState(false);
  const [customize, setCustomize] = useState(false);

  const { isLoading, data: consent } = useSWR(pages.api.consent, () => getConsentRecord().then(res => res.categories));
  const { mutate } = useSWRConfig();
  const revalidateConsent = () => mutate(pages.api.consent);


  return (
    <CookieConsentContext.Provider
      value={{
        ready: !isLoading,
        show,
        setShow,
        customize,
        setCustomize,
        consent,
        revalidateConsent,
      }}
    >
      {children}
    </CookieConsentContext.Provider>
  );
}