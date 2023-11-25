import "@/shared/styles/globals.css";
import { EmotionCache } from "@emotion/cache";
import { NextPage } from "next";
import Head from "next/head";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import React from "react";

import ErrorBoundary from "@/components/ErrorBoundary";
import EmotionCacheProvider from "@/shared/providers/EmotionCacheProvider";
import QueryClientProvider from "@/shared/providers/QueryClientProvider";
import ThemeProvider from "@/shared/providers/ThemeProvider";


export type { NextPage } from "next";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (layoutProps: { children: React.ReactNode }) => React.ReactNode,
};

export type AppProps = {
  Component: NextPage | NextPageWithLayout,
  emotionCache: EmotionCache,
  pageProps: {
    [x: string]: any,
    session: Session,
  },
};

export default function App({
  Component,
  emotionCache,
  pageProps: {
    session,
    ...pageProps
  }
}: AppProps) {
  const getLayout = ("getLayout" in Component ? Component.getLayout : undefined)
    || (({ children }) => children);

  return (
    <EmotionCacheProvider emotionCache={emotionCache}>
      <SessionProvider session={session}>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Loop Mapping</title>
          <meta name="description" content="Loop Mapping" />
        </Head>
        <ErrorBoundary>
          <ThemeProvider>
            <QueryClientProvider>
              {
                getLayout({
                  children: <Component {...pageProps} />,
                })
              }
            </QueryClientProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </SessionProvider>
    </EmotionCacheProvider>
  );
}