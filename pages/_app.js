
import "@/shared/styles/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { store } from "../redux/store.js";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "../components/ErrorFallback";
import { Provider } from "react-redux";
import Head from "next/head";

import EmotionCacheProvider from "@/shared/providers/EmotionCacheProvider";
import ThemeProvider from "@/shared/providers/ThemeProvider";

export default function App({
  Component,
  emotionCache,
  pageProps
}) {
  return (
    <EmotionCacheProvider emotionCache={emotionCache}>
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onReset={() => {}}
      >
        <ThemeProvider>
          <Provider store={store}>
            <Head>
              <meta name="viewport" content="width=device-width, initial-scale=1" />
              <title>Loop Mapping</title>
              <meta name="description" content="Loop Mapping" />
            </Head>
            <Component {...pageProps} />
          </Provider>
        </ThemeProvider>
      </ErrorBoundary>
    </EmotionCacheProvider>
  );
}
