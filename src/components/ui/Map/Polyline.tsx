"use client";

import { useTheme } from "@mui/material";
import { blueGrey } from "@mui/material/colors";
import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
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
  outlineColor?: google.maps.PolylineOptions["strokeColor"],
  outlineWeight?: number,
};

export type PolylineProps =
  & google.maps.PolylineOptions
  & PolylineEventProps
  & PolylineCustomProps;


function usePolyline({
  onClick,
  onDrag,
  onDragStart,
  onDragEnd,
  onMouseOver,
  onMouseOut,
  ...polylineOptions
}: PolylineProps) {
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
  const mapsLibrary = useMapsLibrary("maps");

  const polyline = React.useRef(mapsLibrary ? new mapsLibrary.Polyline() : null).current;
  // update PolylineOptions (note the dependencies aren't properly checked
  // here, we just assume that setOptions is smart enough to not waste a
  // lot of time updating values that didn't change)
  React.useMemo(
    () => polyline?.setOptions(polylineOptions),
    [polyline, polylineOptions]
  );

  const map = useMap();

  // create polyline instance and add to the map once the map is available
  React.useEffect(
    () => {
      if (!map) {
        if (map === undefined)
          console.error("<Polyline> has to be inside a Map component.");

        return;
      }

      polyline?.setMap(map);

      return () => {
        polyline?.setMap(null);
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
  function Polyline({
    outlineColor,
    outlineWeight = 1,
    strokeColor,
    strokeWeight,
    ...props
  }, ref) {
    const theme = useTheme();

    const _outlineColor = outlineColor || blueGrey[100];
    const _outlineWeight = outlineWeight || 1;
    const _strokeColor = strokeColor || theme.palette.primary.main;
    const _strokeWeight = strokeWeight || 4

    const polyline = usePolyline({
      ...props,
      zIndex: 1,
      strokeColor: _strokeColor,
      strokeWeight: _strokeWeight,
    });

    // Outline
    usePolyline({
      ...props,
      zIndex: 0,
      strokeColor: _outlineColor,
      strokeWeight: _strokeWeight + (_outlineWeight * 2),
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
    React.useImperativeHandle<google.maps.Polyline | null, google.maps.Polyline | null>(ref, () => polyline, []);

    return null;
  }
);