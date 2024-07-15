"use client";

import { GoogleMapsContext, useMapsLibrary } from "@vis.gl/react-google-maps";
import React from "react";


type PolylineEventProps = {
  onClick?: (e: google.maps.MapMouseEvent) => void;
  onDrag?: (e: google.maps.MapMouseEvent) => void;
  onDragStart?: (e: google.maps.MapMouseEvent) => void;
  onDragEnd?: (e: google.maps.MapMouseEvent) => void;
  onMouseOver?: (e: google.maps.MapMouseEvent) => void;
  onMouseOut?: (e: google.maps.MapMouseEvent) => void;
};

type PolylineCustomProps = {
  /** this is an encoded string for the path, will be decoded and used as a path */
  encodedPath?: string;
};

export type PolylineProps =
  & google.maps.PolylineOptions
  & PolylineEventProps
  & PolylineCustomProps;


function usePolyline(props: PolylineProps) {
  const {
    onClick,
    onDrag,
    onDragStart,
    onDragEnd,
    onMouseOver,
    onMouseOut,
    encodedPath,
    ...polylineOptions
  } = props;
  // This is here to avoid triggering the useEffect below when the callbacks change (which happen if the user didn't memoize them)
  const callbacks = React.useRef<Record<string, (e: unknown) => void>>({});
  Object.assign(callbacks.current, {
    onClick,
    onDrag,
    onDragStart,
    onDragEnd,
    onMouseOver,
    onMouseOut
  });

  const geometryLibrary = useMapsLibrary("geometry");

  const polyline = React.useRef(new google.maps.Polyline()).current;
  // update PolylineOptions (note the dependencies aren't properly checked
  // here, we just assume that setOptions is smart enough to not waste a
  // lot of time updating values that didn't change)
  React.useMemo(
    () => polyline.setOptions(polylineOptions),
    [polyline, polylineOptions]
  );

  const map = React.useContext(GoogleMapsContext)?.map;

  // update the path with the encodedPath
  React.useMemo(
    () => {
      if (!encodedPath || !geometryLibrary) return;
      const path = geometryLibrary.encoding.decodePath(encodedPath);
      polyline.setPath(path);
    },
    [polyline, encodedPath, geometryLibrary]
  );

  // create polyline instance and add to the map once the map is available
  React.useEffect(
    () => {
      if (!map) {
        if (map === undefined)
          console.error("<Polyline> has to be inside a Map component.");

        return;
      }

      polyline.setMap(map);

      return () => {
        polyline.setMap(null);
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [map]
  );

  // attach and re-attach event-handlers when any of the properties change
  React.useEffect(
    () => {
      if (!polyline) return;

      // Add event listeners
      const gme = google.maps.event;
      [
        ["click", "onClick"],
        ["drag", "onDrag"],
        ["dragstart", "onDragStart"],
        ["dragend", "onDragEnd"],
        ["mouseover", "onMouseOver"],
        ["mouseout", "onMouseOut"]
      ].forEach(([eventName, eventCallback]) => {
        gme.addListener(polyline, eventName as string, (e: google.maps.MapMouseEvent) => {
          const callback = callbacks.current[eventCallback as string];
          if (callback) callback(e);
        });
      });

      return () => {
        gme.clearInstanceListeners(polyline);
      };
    },
    [polyline]
  );

  return polyline;
}

/**
 * Component to render a polyline on a map
 */
export const Polyline = React.forwardRef<google.maps.Polyline | null, PolylineProps>(
  function Polyline(props, ref) {
    const polyline = usePolyline(props);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    React.useImperativeHandle(ref, () => polyline, []);

    return null;
  }
);