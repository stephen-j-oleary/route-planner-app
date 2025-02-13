import "client-only";

import { ReactNode, useContext } from "react";

import { CookieConsentContext } from "./Provider";


export default function CookieConsentTrigger({
  renderTrigger,
}: {
  renderTrigger: (params: { onClick: () => void }) => ReactNode,
}) {
  const { setCustomize } = useContext(CookieConsentContext);

  return renderTrigger({ onClick: () => setCustomize(true) });
}