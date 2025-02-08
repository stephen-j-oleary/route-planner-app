import "@/styles/globals.css";
import type { Viewport } from "next";
import Script from "next/script";
import { ReactNode } from "react";
import { Slide, ToastContainer } from "react-toastify";

import Theme from "./Theme";
import { GeolocationProvider } from "@/components/ui/Geolocation";
import themeConstants, { font } from "@/styles/constants";
import SyncAuth from "@/utils/auth/Sync";
import { Box } from "@mui/material";


export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  const analyticsId = process.env.NEXT_PUBLIC_ANALYTICS_MEASUREMENT_ID;

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />

        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/logo192.png" />
        <link rel="manifest" href="/manifest.json" crossOrigin="use-credentials" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://maps.googleapis.com" />
        <link rel="preconnect" href="https://maps.gstatic.com" />

        {/* Google Analytics */}
        {
          analyticsId && (
            <>
              <Script
                strategy="afterInteractive"
                src={`https://www.googletagmanager.com/gtag/js?id=${analyticsId}`}
              />
              <Script
                id="googleAnalytics"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                  __html: `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag("js", new Date());

                    gtag("config", "${analyticsId}");
                  `
                }}
              />
            </>
          )
        }
      </head>

      <body className={font.variable}>
        <Theme>
          <GeolocationProvider>
            <Box minHeight="100%" sx={{ backgroundColor: "background.default" }}>
              {children}
            </Box>

            <SyncAuth />

            <ToastContainer
              position="bottom-center"
              transition={Slide}
              hideProgressBar
              closeButton={false}
              autoClose={false}
              toastStyle={{ width: "100%", minHeight: 0, padding: 0 }}
            />
          </GeolocationProvider>
        </Theme>
      </body>
    </html>
  );
}

export const viewport: Viewport = {
  themeColor: themeConstants.backgroundDefault,
  colorScheme: "light",
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};