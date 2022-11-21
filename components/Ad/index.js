import { useEffect } from "react"

export default function Ad() {
  useEffect(
    () => {
      const script = document.createElement("script");
      script.async = true;
      script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6577552601434432";
      script.crossOrigin="anonymous";
      document.body.insertBefore(script, document.body.firstChild);
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    }
  )

  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block" }}
      data-ad-client="ca-pub-6577552601434432"
      data-ad-slot="7020400075"
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  )
}
