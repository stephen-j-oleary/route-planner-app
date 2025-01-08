"use client";

import { createContext, ReactNode, useContext, useState } from "react";


export type TTilesContext = {
  loaded: boolean,
  tilesLoaded?: () => void,
};

export const TilesContext = createContext<TTilesContext>({
  loaded: false,
});


export function useTiles() {
  const ctx = useContext(TilesContext);

  return ctx;
}


export default function TilesProvider(props: {
  children: ReactNode,
}) {
  const [loaded, setLoaded] = useState(false);

  const tilesLoaded = () => setLoaded(true);

  return (
    <TilesContext.Provider
      value={{ loaded, tilesLoaded }}
      {...props}
    />
  );
}