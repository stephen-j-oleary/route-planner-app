
import "../shared/styles/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { store } from "../redux/store.js";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "../components/ErrorFallback";
import { Provider } from "react-redux";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../shared/styles/theme";
import Head from "next/head";
import createEmotionCache from "../shared/utils/createEmotionCache";
import { CacheProvider } from "@emotion/react";

const clientSideEmotionCache = createEmotionCache();

export default function App({
  Component,
  emotionCache = clientSideEmotionCache,
  pageProps
}) {
  return (
    <CacheProvider value={emotionCache}>
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onReset={() => {}}
      >
        <ThemeProvider theme={theme}>
          <Provider store={store}>
            <Head>
              <meta charSet="utf-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1" />
              <meta name="theme-color" content="#FFFFFF" />
              <meta name="description" content="Loop Mapping" />
              <title>Loop Mapping</title>
            </Head>
            <Component {...pageProps} />
          </Provider>
        </ThemeProvider>
      </ErrorBoundary>
    </CacheProvider>
  );
}
