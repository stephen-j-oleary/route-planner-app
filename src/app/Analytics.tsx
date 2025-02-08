import Script from "next/script";


export default function Analytics() {
  const analyticsId = process.env.NEXT_PUBLIC_ANALYTICS_MEASUREMENT_ID;

  if (!analyticsId) return;

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${analyticsId}`}
      />
      <Script
        id="googleAnalytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag("js", new Date());

            gtag("config", "${analyticsId}");
          `
        }}
      />
    </>
  );
}