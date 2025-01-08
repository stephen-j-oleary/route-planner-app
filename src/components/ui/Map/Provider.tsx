// Can only access the Google Api Key on the server
import "server-only";

import { ReactNode } from "react";

import APIProvider from "./APIProvider";
import TilesProvider from "./Tiles";


export default function MapProvider({
  children,
}: {
  children: ReactNode,
}) {
  const apiKey = process.env.LOOP_GOOGLE_API_KEY;
  if (!apiKey) throw new Error("Invalid environment: Missing variable 'LOOP_GOOGLE_API_KEY'");


  return (
    <APIProvider apiKey={apiKey}>
      <TilesProvider>
        {children}
      </TilesProvider>
    </APIProvider>
  );
}