import createEmotionServer from "@emotion/server/create-instance";
import { AppType } from "next/app";
import NextDocument, { DocumentContext, DocumentProps, Head, Html, Main, NextScript } from "next/document";
import Script from "next/script";
import React from "react";

import { MyAppProps } from "@/pages/_app";
import { theme } from "@/styles/theme";
import createEmotionCache from "@/utils/createEmotionCache";


export interface MyDocumentProps extends DocumentProps {
  emotionStyleTags: JSX.Element[];
}

export default function Document(props: MyDocumentProps) {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content={theme.palette.primary.main} />

        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/logo192.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://maps.googleapis.com" />
        <link rel="preconnect" href="https://maps.gstatic.com" />

        {props.emotionStyleTags}

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
      </Head>
      <Main />
      <NextScript />
    </Html>
  )
}

Document.getInitialProps = async (ctx: DocumentContext) => {
  const originalRenderPage = ctx.renderPage;

  const cache = createEmotionCache();
  const { extractCriticalToChunks } = createEmotionServer(cache);

  ctx.renderPage = () => originalRenderPage({
    enhanceApp: (
      App: React.ComponentType<React.ComponentProps<AppType> & Omit<MyAppProps, "pageProps">>
    ) => function EnhanceApp(props) {
      return <App emotionCache={cache} {...props} />;
    },
  });

  const initialProps = await NextDocument.getInitialProps(ctx);

  const emotionStyles = extractCriticalToChunks(initialProps.html);
  const emotionStyleTags = emotionStyles.styles.map((style) => (
    <style
      data-emotion={`${style.key} ${style.ids.join(" ")}`}
      key={style.key}
      dangerouslySetInnerHTML={{ __html: style.css }}
    />
  ));

  return {
    ...initialProps,
    emotionStyleTags,
  };
}