// Can only access these hooks on the client
import "client-only";

import { useMapsLibrary, useMap as useVisglMap } from "@vis.gl/react-google-maps";
import React from "react";

import { TTilesContext, useTiles } from "./Tiles";


export function useMap(id?: string | null | undefined) {
  const map = useVisglMap(id) as (google.maps.Map & { tiles: TTilesContext }) | null;
  const tilesCtx = useTiles();

  if (map) map.tiles = tilesCtx;

  return map;
}


export function useMapFocus(coordinates: (google.maps.LatLngLiteral | null)[], boundStyle: "extend" | "focus" = "extend") {
  const mapsLibrary = useMapsLibrary("core");
  const map = useMap();
  const { loaded = false } = map?.tiles || {};

  const _coords = React.useMemo(
    () => coordinates.filter((coord): coord is google.maps.LatLngLiteral => !!coord),
    [coordinates]
  );

  React.useEffect(
    () => {
      if (!loaded || !_coords.length || !mapsLibrary || !map) return;

      const newBounds = new mapsLibrary.LatLngBounds();
      const mapBounds = map.getBounds();
      if (boundStyle === "extend" && mapBounds) newBounds.union(mapBounds);

      _coords.forEach(coord => newBounds.extend(coord));

      map.setZoom(20);
      map.setCenter(newBounds.getCenter());
      map.fitBounds(newBounds, 0);
      if (boundStyle === "focus" && (map.getZoom() || 0) > 15) map.setZoom(15);
    },
    [_coords, loaded, mapsLibrary, map]
  );
}