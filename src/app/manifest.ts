import { MetadataRoute } from "next";

import pages from "@/pages";
import { backgroundDefault, primaryDefault } from "@/styles/constants";


export default function manifest(): MetadataRoute.Manifest {
  return {
    short_name: "Loop",
    name: "Loop Mapping",
    icons: [
      {
        "src": "/favicon.ico",
        "sizes": "256x256",
        "type": "image/x-icon"
      },
      {
        "src": "/logo192.png",
        "type": "image/png",
        "sizes": "192x192"
      },
      {
        "src": "/logo512.png",
        "type": "image/png",
        "sizes": "512x512"
      },
      {
        "src": "/logo512.png",
        "type": "image/png",
        "sizes": "512x512",
        "purpose": "maskable"
      }
    ],
    scope: process.env.NEXT_PUBLIC_BASE_URL,
    id: pages.routes.root,
    start_url: pages.routes.root,
    display: "standalone",
    theme_color: primaryDefault,
    background_color: backgroundDefault,
  };
}