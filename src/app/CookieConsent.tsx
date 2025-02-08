import Script from "next/script";

export default function CookieConsent() {
  //return (<script id="Cookiebot" src="https://consent.cookiebot.com/uc.js" data-cbid="4b6b1847-891e-4016-a9ff-2aeadd8941dd" type="text/javascript" async></script>);

  return (
    <>
      <Script
        type="text/javascript"
        dangerouslySetInnerHTML={{
          __html: `
            var _iub = _iub || [];
            _iub.csConfiguration = {"siteId":3923456,"cookiePolicyId":17663063,"lang":"en","storage":{"useSiteId":true}};
          `,
        }}
      />
      <Script type="text/javascript" src="https://cs.iubenda.com/autoblocking/3923456.js" />
      <Script type="text/javascript" src="//cdn.iubenda.com/cs/gpp/stub.js" />
      <Script type="text/javascript" src="//cdn.iubenda.com/cs/iubenda_cs.js" charSet="UTF-8" async />
    </>
  );
}