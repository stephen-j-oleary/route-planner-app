import "client-only";

import { forEach, isEqual } from "lodash";
import React from "react";

import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import GoogleMarkup, { GoogleMarkupProps } from "../Markup";
import useEvent from "@/hooks/useEvent";
import connectGoogleMapsApi from "@/utils/connectGoogleMapsApi";


const MINIMUM_CENTER_CHANGE = 0.00001;


type TMarkupCoordinatesDispatch = { type: "add" | "remove", coordinates: [number, number] };
type IMapContext = {
  map?: google.maps.Map,
  markupCoordinates?: [number, number][],
  markupCoordinatesDispatch?: React.Dispatch<TMarkupCoordinatesDispatch>,
};
export const MapContext = React.createContext<IMapContext>({});


export type GoogleMapProps = {
  /** Default: 'focus' */
  boundStyle?: "extend" | "focus",
  defaultCenter?: [number, number],
  center?: [number, number],
  defaultZoom?: number,
  zoom?: number,
  defaultHeading?: number,
  heading?: number,
  /** Default: false */
  mapTypeControl?: boolean,
  /** Default: false */
  fullscreenControl?: boolean,
  /** Default: false */
  streetViewControl?: boolean,
  /** Default: 'cooperative' */
  gestureHandling?: "cooperative",
  /** Default: 'rgb(240 240 255) */
  backgroundColor?: string,
  defaultOptions?: object,
  options?: object,
  onLoad?: (map: google.maps.Map) => void,
  markupItems?: ({ id: string } & GoogleMarkupProps)[],
  RootProps?: object,
  children?: React.ReactNode,
};

export default function GoogleMap({
  boundStyle = "focus",
  defaultCenter,
  center,
  defaultZoom,
  zoom,
  defaultHeading,
  heading,
  mapTypeControl = false,
  fullscreenControl = false,
  streetViewControl = false,
  gestureHandling = "cooperative",
  backgroundColor = "rgb(240 240 255)",
  defaultOptions,
  options,
  onLoad = () => {},
  markupItems = [],
  RootProps = {},
  children,
}: GoogleMapProps) {
  const _defaultCenter = React.useRef(defaultCenter);
  const _defaultZoom = React.useRef(defaultZoom);
  const _defaultHeading = React.useRef(defaultHeading);
  const _defaultOptions = React.useRef(defaultOptions);

  const theme = useTheme();
  const [map, setMap] = React.useState<google.maps.Map | undefined>(undefined);
  const [markupCoordinates, markupCoordinatesDispatch] = React.useReducer<React.Reducer<[number, number][], TMarkupCoordinatesDispatch>>((state, action) => {
    return (action.type === "remove")
      ? state.filter((_, i) => i !== state.findIndex(v => v[0] === action.coordinates[0] && v[1] === action.coordinates[1]))
      : [...state, action.coordinates];
  }, []);

  const onLoadRef = useEvent(onLoad);

  const previousCenter = React.useRef<[number, number] | null>(null);
  const previousZoom = React.useRef<number | null>(null);
  const previousHeading = React.useRef<number | null>(null);
  const previousOptions = React.useRef<object | null>(null);

  const mapBox = React.useRef<HTMLDivElement | null>(null);

  const focusMarkup = React.useCallback(
    async () => {
      if (!map || !markupCoordinates?.length) return;

      const g = await connectGoogleMapsApi();

      const newBounds = new g.maps.LatLngBounds();
      const mapBounds = map.getBounds();
      if (boundStyle === "extend" && mapBounds) newBounds.union(mapBounds);

      forEach(markupCoordinates, ([lat, lng]) => newBounds.extend({ lat, lng }));

      map.setZoom(20);
      map.setCenter(newBounds.getCenter());
      map.fitBounds(newBounds, 20);
      if (boundStyle === "focus" && (map.getZoom() || 0) > 15) map.setZoom(15);
    },
    [map, boundStyle, markupCoordinates]
  );

  // Initialization
  React.useEffect(
    () => {
      let isMounted = true;

      (async () => {
        const g = await connectGoogleMapsApi();

        if (!mapBox.current) return;

        const newMap = new g.maps.Map(mapBox.current, {
          center: _defaultCenter.current && { lat: _defaultCenter.current[0], lng: _defaultCenter.current[1] },
          zoom: _defaultZoom.current,
          heading: _defaultHeading.current,
          mapTypeControl,
          fullscreenControl,
          streetViewControl,
          gestureHandling,
          backgroundColor,
          styles: theme.components?.Map?.defaultProps.styles,
          ..._defaultOptions.current,
        });
        if (isMounted) setMap(newMap);
      })()

      return () => { isMounted = false };
    },
    [theme, mapTypeControl, fullscreenControl, streetViewControl, gestureHandling, backgroundColor]
  );

  // Focus markup on resize
  React.useEffect(
    () => {
      if (!mapBox.current) return;

      const observer = new ResizeObserver(() => focusMarkup());
      observer.observe(mapBox.current);
      return () => observer.disconnect();
    },
    [focusMarkup]
  );

  // Add onLoad listener
  React.useEffect(
    () => void map?.addListener("tilesloaded", () => onLoadRef.current(map)),
    [map, onLoadRef]
  );

  // Map options
  React.useEffect(
    () => {
      if (!map || !center) return;
      if (previousCenter.current && Math.abs(center[0] - previousCenter.current[0]) <= MINIMUM_CENTER_CHANGE && Math.abs(center[1] - previousCenter.current[1]) <= MINIMUM_CENTER_CHANGE) return;

      previousCenter.current = center;
      map.panTo({ lat: center[0], lng: center[1] });
    },
    [map, center, previousCenter]
  );

  React.useEffect(() => {
    if (!map || !zoom) return;
    if (previousZoom.current && Math.abs(zoom - previousZoom.current) <= 0) return;

    previousZoom.current = zoom;
    map.setZoom(zoom);
  }, [map, zoom, previousZoom]);

  React.useEffect(
    () => {
      if (!map || !heading) return;
      if (previousHeading.current && Math.abs(heading - previousHeading.current) <= 0) return;

      previousHeading.current = heading;
      map.setHeading(heading);
    },
    [map, heading, previousHeading]
  );

  React.useEffect(
    () => {
      if (!map || !options) return;
      if (previousOptions.current && isEqual(options, previousOptions.current)) return;

      previousOptions.current = options;
      map.setOptions(options);
    },
    [map, options, previousOptions]
  );


  React.useEffect(
    () => void focusMarkup(),
    [focusMarkup]
  );


  return (
    <MapContext.Provider value={{ map, markupCoordinates, markupCoordinatesDispatch }}>
      <Box
        ref={mapBox}
        {...RootProps}
      >
        {children}
        {markupItems.map(({ id, ...m }) => <GoogleMarkup key={id} {...m} />)}
      </Box>
    </MapContext.Provider>
  );
}