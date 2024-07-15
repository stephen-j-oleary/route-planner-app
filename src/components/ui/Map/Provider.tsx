import React from "react";

import APIProvider from "./APIProvider";


export default function MapProvider({
  children,
}: {
  children: React.ReactNode,
}) {
  const apiKey = process.env.LOOP_GOOGLE_API_KEY;
  if (!apiKey) throw new Error("Mising google api key");


  return (
    <APIProvider apiKey={apiKey}>
      {children}
    </APIProvider>
  );
}