// Can only access the Google Api Key on the server
import "server-only";

import React from "react";

import APIProvider from "./APIProvider";
import TilesProvider from "./Tiles";
import env from "@/utils/env";


export default function MapProvider({
  children,
}: {
  children: React.ReactNode,
}) {
  const apiKey = env("LOOP_GOOGLE_API_KEY");
  if (!apiKey) throw new Error("Mising google api key");


  return (
    <APIProvider apiKey={apiKey}>
      <TilesProvider>
        {children}
      </TilesProvider>
    </APIProvider>
  );
}