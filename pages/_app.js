
import "../shared/styles/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { store } from "../redux/store.js";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "../components/ErrorFallback";
import { Provider } from "react-redux";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../shared/styles/theme";
import Head from "next/head";

export default function App({ Component, pageProps }) {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {}}
    >
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <Head>
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta name="theme-color" content="#000000" />
            <meta name="description" content="Route Planner Website" />
            <title>React App</title>
          </Head>
          <Component {...pageProps} />
        </Provider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
