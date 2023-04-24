import "@/shared/styles/globals.css";
import { store } from "../redux/store.js";
import { Provider } from "react-redux";
import Head from "next/head";
import { SessionProvider } from "next-auth/react";

import EmotionCacheProvider from "@/shared/providers/EmotionCacheProvider";
import QueryClientProvider from "@/shared/providers/QueryClientProvider";
import ThemeProvider from "@/shared/providers/ThemeProvider";


export default function App({
  Component,
  emotionCache,
  pageProps: {
    session,
    ...pageProps
  }
}) {
  const { getLayout = (page => page) } = Component;

  return (
    <EmotionCacheProvider emotionCache={emotionCache}>
      <SessionProvider session={session}>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Loop Mapping</title>
          <meta name="description" content="Loop Mapping" />
        </Head>
        <ThemeProvider>
          <QueryClientProvider>
            <Provider store={store}>
              {
                getLayout({
                  children: <Component {...pageProps} />,
                })
              }
            </Provider>
          </QueryClientProvider>
        </ThemeProvider>
      </SessionProvider>
    </EmotionCacheProvider>
  );
}