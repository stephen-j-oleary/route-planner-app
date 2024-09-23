"use client";

import React from "react";


export type TTilesContext = {
  loaded: boolean,
  tilesLoaded?: () => void,
};

export const TilesContext = React.createContext<TTilesContext>({
  loaded: false,
});


export function useTiles() {
  const ctx = React.useContext(TilesContext);

  return ctx;
}


export default function TilesProvider(props: {
  children: React.ReactNode,
}) {
  const [loaded, setLoaded] = React.useState(false);

  const tilesLoaded = () => setLoaded(true);

  return (
    <TilesContext.Provider
      value={{ loaded, tilesLoaded }}
      {...props}
    />
  );
}