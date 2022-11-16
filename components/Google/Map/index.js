
import _ from "lodash";
import { createContext, useEffect, useRef, useState } from "react";
import googleLoader from "../../../shared/googleMapApiLoader.js";
import usePrevious from "../../../shared/hooks/usePrevious.js";

import GoogleMarkup from "../Markup/index.js";

const MINIMUM_CENTER_CHANGE = 0.00001;
const DEFAULT_OPTIONS = {
  backgroundColor: "rgb(240 240 255)"
};

export const MapContext = createContext({});

export default function GoogleMap({
  boundStyle = "focus",
  defaultCenter,
  center,
  defaultZoom,
  zoom,
  defaultHeading,
  heading,
  defaultOptions,
  options,
  listeners = {},
  markup = {},
  ...props
}) {
  const [map, setMap] = useState(null);

  const previousListeners = usePrevious(listeners);
  const previousCenter = usePrevious(center);
  const previousZoom = usePrevious(zoom);
  const previousHeading = usePrevious(heading);
  const previousOptions = usePrevious(options);
  const previousMarkup = usePrevious(markup);

  const ref = useRef();

  // Initialization
  useEffect(
    () => {
      let isMounted = true;

      (async () => {
        const g = await googleLoader;
        const newMap = new g.maps.Map(ref.current, {
          center: center || defaultCenter,
          zoom: zoom || defaultZoom,
          heading: heading || defaultHeading,
          ..._.defaults({}, options || defaultOptions, DEFAULT_OPTIONS)
        });
        if (isMounted) setMap(newMap);
      })()

      return () => isMounted = false;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // Listeners
  useEffect(
    () => {
      if (!map || (previousListeners && _.isEqual(listeners, previousListeners))) return;
      _.forEach(listeners, (func, name) => {
        map.addListener(name, e => {
          func(map, e);
        });
      });
    },
    [map, listeners, previousListeners]
  );

  // Map options
  useEffect(() => {
    if (!map || !center) return;
    if (previousCenter && Math.abs(center.lat - previousCenter.lat) + Math.abs(center.lng - previousCenter.lng) <= MINIMUM_CENTER_CHANGE) return;

    map.panTo(_.pick(center, "lat", "lng"));
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
    if (previousOptions && _.isEqual(options, previousOptions)) return;

    map.setOptions(options);
  }, [map, options, previousOptions]);


  // Autofocus map markup
  useEffect(
    () => {
      if (!map || !markup.items.length || _.isEqual(markup, previousMarkup)) return;

      (async () => {
        const g = await googleLoader;

        const newBounds = new g.maps.LatLngBounds();
        if (boundStyle === "extend") newBounds.union(map.getBounds());

        const extendFunctions = {
          marker: m => newBounds.extend(m.position),
          polyline: p => _.forEach(p.path, c => newBounds.extend(c))
        };

        _.forEach(markup.items, m => extendFunctions[m.type](m));

        map.setZoom(20);
        map.setCenter(newBounds.getCenter());
        map.fitBounds(newBounds, 20);
        if (boundStyle === "focus" && map.getZoom() > 15) map.setZoom(15);
      })();
    },
    [map, boundStyle, markup, previousMarkup]
  );

  return (
    <MapContext.Provider value={{ map }}>
      <div
        {...props}
        ref={ref}
      >
        {markup.items.map(m => <GoogleMarkup key={m.id} listeners={markup.listeners} {...m} />)}
      </div>
    </MapContext.Provider>
  );
}
