import "@/styles/globals.css";
import { EmotionCache } from "@emotion/cache";
import { NextPage } from "next";
import { AppProps } from "next/app";
import Head from "next/head";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import React from "react";

import ErrorBoundary from "@/components/ui/ErrorBoundary";
import Layout, { LayoutProps } from "@/components/ui/Layout";
import EmotionCacheProvider from "@/providers/EmotionCacheProvider";
import QueryClientProvider from "@/providers/QueryClientProvider";
import ThemeProvider from "@/providers/ThemeProvider";


export type { NextPage } from "next";

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  layoutProps?: LayoutProps,
};

export interface MyAppProps extends AppProps {
  Component: NextPage | NextPageWithLayout;
  emotionCache: EmotionCache;
  pageProps: {
    [x: string]: unknown;
    session: Session;
  };
}

export default function App({
  Component,
  emotionCache,
  pageProps: {
    session,
    ...pageProps
  }
}: MyAppProps) {
  const layoutProps = "layoutProps" in Component ? Component.layoutProps : {};

  return (
    <EmotionCacheProvider emotionCache={emotionCache}>
      <SessionProvider session={session}>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
          <title>Loop Mapping</title>
          <meta name="description" content="Loop Mapping" />
        </Head>
        <ErrorBoundary>
          <ThemeProvider>
            <QueryClientProvider>
              <Layout {...layoutProps}>
                <Component {...pageProps} />
              </Layout>
            </QueryClientProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </SessionProvider>
    </EmotionCacheProvider>
  );
}