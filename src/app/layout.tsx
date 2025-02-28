import "@/styles/globals.css";
import type { Viewport } from "next";
import { ReactNode } from "react";
import { Slide, ToastContainer } from "react-toastify";

import Theme from "./Theme";
import { CookieConsentBanner, CookieConsentProvider } from "@/components/ui/CookieConsent";
import { GeolocationProvider } from "@/components/ui/Geolocation";
import Gtm, { Analytics } from "@/components/ui/Gtm";
import themeConstants, { font } from "@/styles/constants";
import SyncAuth from "@/utils/auth/Sync";


export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en">
      <CookieConsentProvider>
        <head>
          <meta charSet="utf-8" />

          <link rel="icon" type="image/x-icon" href="/favicon.ico" />
          <link rel="apple-touch-icon" href="/logo192.png" />
          <link rel="manifest" href="/manifest.json" crossOrigin="use-credentials" />
          <link rel="preconnect" href="https://www.googletagmanager.com" />
          <link rel="preconnect" href="https://maps.googleapis.com" />
          <link rel="preconnect" href="https://maps.gstatic.com" />

          <Gtm />
          <Analytics />
        </head>

        <body className={font.variable}>
          <Theme>
            <GeolocationProvider>
              {children}

              <CookieConsentBanner />

              <SyncAuth />

              <ToastContainer
                position="bottom-center"
                transition={Slide}
                hideProgressBar
                closeButton={false}
                autoClose={false}
                style={{ padding: ".25rem" }}
                toastStyle={{ width: "100%", minHeight: 0, padding: 0 }}
              />
            </GeolocationProvider>
          </Theme>
        </body>
      </CookieConsentProvider>
    </html>
  );
}

export const viewport: Viewport = {
  themeColor: themeConstants.backgroundDefault,
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};