
import "../shared/styles/globals.css";
import "../shared/styles/inputs.scss";
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { store } from "../redux/store.js";
import { Provider } from "react-redux";
import Head from "next/head.js";

export default function App({ Component, pageProps }) {
  return (
    <React.StrictMode>
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
    </React.StrictMode>
  );
}
