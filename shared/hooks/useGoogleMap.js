
import { useEffect, useState } from "react";

export default function useGoogleMap() {
  const [status, setStatus] = useState("WAITING");

  useEffect(() => {
    window.ready = () => setStatus("SUCCESS");
  }, []);

  useEffect(() => {
    if (document.getElementById("gm_script")) return;

    const tag = document.createElement("script");
    tag.id = "gm_script";
    tag.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}&callback=ready`;
    tag.defer = true;
    document.body.appendChild(tag);
  });

  return (status === "SUCCESS");
}
