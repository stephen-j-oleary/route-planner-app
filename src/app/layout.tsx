import "@/styles/globals.css";
import { Viewport } from "next";
import Script from "next/script";

import { Box } from "@mui/material";

import Footer from "@/components/ui/Footer";
import Header from "@/components/ui/Header";
import QueryClientProvider from "@/providers/QueryClientProvider";
import ThemeProvider from "@/providers/ThemeProvider";
import themeConstants from "@/styles/constants";


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_ANALYTICS_MEASUREMENT_ID}`}
        />
        <Script
          id="googleAnalytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag("js", new Date());

              gtag("config", "${process.env.NEXT_PUBLIC_ANALYTICS_MEASUREMENT_ID}");
            `
          }}
        />
      </head>

      <body>
        <ThemeProvider>
          <QueryClientProvider>
            <Box
              display="table"
              width="100%"
              height="100%"
            >
              <Header />

              <Box
                component="main"
                display="table-row"
                height="100%"
                sx={{ backgroundColor: "background.default" }}
              >
                {children}
              </Box>

              <Footer />
            </Box>
          </QueryClientProvider>
        </ThemeProvider>
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