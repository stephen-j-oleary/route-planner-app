import { forEach, isEqual, pick } from "lodash";
import { createContext, useCallback, useEffect, useRef, useState } from "react";

import { Box, useTheme } from "@mui/material";

import GoogleMarkup from "../Markup";
import usePrevious from "@/hooks/usePrevious";
import connectGoogleMapsApi from "@/utils/connectGoogleMapsApi";


const MINIMUM_CENTER_CHANGE = 0.00001;


export const MapContext = createContext({});

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
  listeners = {},
  markupItems = [],
  markupListeners = {},
  RootProps = {},
  ...props
}) {
  const theme = useTheme();
  const [map, setMap] = useState(null);

  const [previousListeners, updatePreviousListeners] = usePrevious(null, { watch: false });
  const [previousCenter] = usePrevious(center);
  const [previousZoom] = usePrevious(zoom);
  const [previousHeading] = usePrevious(heading);
  const [previousOptions] = usePrevious(options);
  const [previousMarkupItems] = usePrevious(markupItems, { deepEqual: true });

  const ref = useRef();

  const focusMarkup = useCallback(
    async _markup => {
      if (!map) return;

      const g = await connectGoogleMapsApi();

      const newBounds = new g.maps.LatLngBounds();
      if (boundStyle === "extend") newBounds.union(map.getBounds());

      forEach(_markup, ({ position, path }) => {
        if (position) newBounds.extend(position);
        if (path) forEach(path, item => newBounds.extend(item));
      });

      map.setZoom(20);
      map.setCenter(newBounds.getCenter());
      map.fitBounds(newBounds, 20);
      if (boundStyle === "focus" && map.getZoom() > 15) map.setZoom(15);
    },
    [map, boundStyle]
  );

  // Initialization
  useEffect(
    () => {
      let isMounted = true;

      (async () => {
        const g = await connectGoogleMapsApi();
        const newMap = new g.maps.Map(ref.current, {
          center: center || defaultCenter,
          zoom: zoom || defaultZoom,
          heading: heading || defaultHeading,
          mapTypeControl,
          fullscreenControl,
          streetViewControl,
          gestureHandling,
          backgroundColor,
          styles: theme.components.Map.defaultProps.styles,
          ...props,
          ...(options || defaultOptions)
        });
        if (isMounted) setMap(newMap);
      })()

      return () => isMounted = false;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(
    function addResizeObserver() {
      if (!markupItems.length) return;
      const observer = new ResizeObserver(() => focusMarkup(markupItems));
      observer.observe(ref.current);
      return () => observer.disconnect();
    },
    [focusMarkup, markupItems]
  );

  // Listeners
  useEffect(
    () => {
      if (!map || (previousListeners && isEqual(listeners, previousListeners))) return;
      updatePreviousListeners(listeners);
      forEach(listeners, (func, name) => {
        map.addListener(name, e => {
          func(map, e);
        });
      });
    },
    [map, listeners, previousListeners, updatePreviousListeners]
  );

  // Map options
  useEffect(() => {
    if (!map || !center) return;
    if (previousCenter && Math.abs(center.lat - previousCenter.lat) + Math.abs(center.lng - previousCenter.lng) <= MINIMUM_CENTER_CHANGE) return;

    map.panTo(pick(center, "lat", "lng"));
  }, [map, center, previousCenter]);

  useEffect(() => {
    if (!map || !zoom) return;
    if (previousZoom && Math.abs(zoom - previousZoom) <= 0) return;

    map.setZoom(zoom);
  }, [map, zoom, previousZoom]);

  useEffect(() => {
    if (!map || !heading) return;
    if (previousHeading && Math.abs(heading - previousHeading) <= 0) return;

    map.setHeading(heading);
  }, [map, heading, previousHeading]);

  useEffect(() => {
    if (!map || !options) return;
    if (previousOptions && isEqual(options, previousOptions)) return;

    map.setOptions(options);
  }, [map, options, previousOptions]);


  useEffect(
    () => {
      if (!markupItems.length || (previousMarkupItems && isEqual(markupItems, previousMarkupItems))) return;
      focusMarkup(markupItems);
    },
    [focusMarkup, markupItems, previousMarkupItems]
  );

  return (
    <MapContext.Provider value={{ map }}>
      <Box
        ref={ref}
        {...RootProps}
      >
        {markupItems.map(m => <GoogleMarkup key={m.id} listeners={markupListeners} {...m} />)}
      </Box>
    </MapContext.Provider>
  );
}