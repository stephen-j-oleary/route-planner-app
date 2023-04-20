
import "@/shared/styles/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { store } from "../redux/store.js";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Provider } from "react-redux";
import Head from "next/head";

import EmotionCacheProvider from "@/shared/providers/EmotionCacheProvider";
import QueryClientProvider from "@/shared/providers/QueryClientProvider";
import ThemeProvider from "@/shared/providers/ThemeProvider";

export default function App({
  Component,
  emotionCache,
  pageProps
}) {
  return (
    <EmotionCacheProvider emotionCache={emotionCache}>
      <ErrorBoundary
        resetApproach={null}
      >
        <ThemeProvider>
          <QueryClientProvider>
            <Provider store={store}>
              <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <title>Loop Mapping</title>
                <meta name="description" content="Loop Mapping" />
              </Head>
              <Component {...pageProps} />
            </Provider>
          </QueryClientProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </EmotionCacheProvider>
  );
}
