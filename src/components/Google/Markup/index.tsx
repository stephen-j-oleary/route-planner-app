import "client-only";

import React from "react";

import { useTheme } from "@mui/material/styles";

import marker from "./icons/marker";
import { MapContext } from "../Map";
import useEvent from "@/hooks/useEvent";
import connectGoogleMapsApi from "@/utils/connectGoogleMapsApi";


type GoogleMarkupMarkerProps = {
  variant: "marker",
  position: [number, number],
  label?: string,
  optimized?: boolean,
  icon?: google.maps.Icon | google.maps.Symbol,
  path?: never,
  strokeColor?: never,
  strokeWeight?: never,
  strokeOpacity?: never,
  onMouseEnter?: (markup: google.maps.Marker) => void,
  onMouseLeave?: (markup: google.maps.Marker) => void,
};

type GoogleMarkupPolylineProps = {
  variant: "polyline",
  position?: never,
  label?: never,
  optimized?: never,
  icon?: never,
  path: [number, number][],
  strokeColor?: string,
  strokeWeight?: number,
  strokeOpacity?: number,
  onMouseEnter?: (markup: google.maps.Polyline) => void,
  onMouseLeave?: (markup: google.maps.Polyline) => void,
};

export type GoogleMarkupProps = GoogleMarkupMarkerProps | GoogleMarkupPolylineProps;

export default function GoogleMarkup({
  variant = "marker",
  onMouseEnter = () => {},
  onMouseLeave = () => {},
  position,
  label,
  optimized,
  icon,
  path,
  strokeColor,
  strokeWeight,
  strokeOpacity,
}: GoogleMarkupProps) {
  const theme = useTheme();
  const { map, markupCoordinatesDispatch } = React.useContext(MapContext);
  const [markup, setMarkup] = React.useState<google.maps.Marker | google.maps.Polyline | null>(null);

  const onMouseEnterRef = useEvent(onMouseEnter);
  const onMouseLeaveRef = useEvent(onMouseLeave);

  React.useEffect(
    function initialize() {
      let isMounted = true;

      (async () => {
        const g = await connectGoogleMapsApi();
        const newMarkup = variant === "polyline"
          ? new g.maps.Polyline()
          : new g.maps.Marker();
        if (isMounted) setMarkup(newMarkup);
      })();

      return () => { isMounted = false };
    },
    [variant, setMarkup]
  );

  // Add onMouseEnter listener
  React.useEffect(
    () => void markup?.addListener("mouseover", () => onMouseEnterRef.current(markup)),
    [markup, onMouseEnterRef]
  );
  // Add onMouseLeave listener
  React.useEffect(
    () => void markup?.addListener("mouseout", () => onMouseLeaveRef.current(markup)),
    [markup, onMouseLeaveRef]
  );

  React.useEffect(
    function addToMap() {
      if (!markup || !map) return;
      markup.setMap(map);
      return () => markup.setMap(null);
    },
    [markup, map]
  );

  React.useEffect(
    function updateOptions() {
      if (!markup) return;

      markup.setOptions({
        position: position && { lat: position[0], lng: position[1] },
        label,
        optimized: optimized ?? variant === "marker" ? true : undefined,
        icon: icon ?? variant === "marker" ? marker : undefined,
        path: path?.map(([lat, lng]) => ({ lat, lng })),
        strokeColor: strokeColor ?? variant === "polyline" ? theme.palette.primary.light : undefined,
        strokeWeight: strokeWeight ?? variant === "polyline" ? 4 : undefined,
        strokeOpacity: strokeOpacity ?? variant === "polyline" ? 1 : undefined,
      });

      if (position) markupCoordinatesDispatch?.({ type: "add", coordinates: position });
      if (path) path.forEach(item => markupCoordinatesDispatch?.({ type: "add", coordinates: item }));

      return () => {
        if (position) markupCoordinatesDispatch?.({ type: "remove", coordinates: position });
        if (path) path.forEach(item => markupCoordinatesDispatch?.({ type: "remove", coordinates: item }));
      }
    },
    [markup, position, label, optimized, icon, path, strokeColor, strokeWeight, strokeOpacity, variant, theme, markupCoordinatesDispatch]
  );

  return null;
}