import Script from "next/script";

export default function CookieConsent() {
  return (
    <Script
      async
      type="text/javascript"
      src="https://consent.cookiebot.com/uc.js"
      id="Cookiebot"
      data-cbid="4b6b1847-891e-4016-a9ff-2aeadd8941dd"
    />
  );

  /* return (
    <Script
      type="text/javascript"
      data-cmp-ab="1"
      src="https://cdn.consentmanager.net/delivery/autoblocking/15f25cc122296.js"
      data-cmp-host="a.delivery.consentmanager.net"
      data-cmp-cdn="cdn.consentmanager.net"
      data-cmp-codesrc="16"
    />
  ); */
}