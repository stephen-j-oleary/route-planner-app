
import { defaultsDeep, isEqual, forEach } from "lodash";
import googleLoader from "../../../shared/googleMapApiLoader.js";
import { useContext, useEffect, useRef, useState } from "react";
import { MapContext } from "../Map";

export const ICON_CONSTANTS = {
  "marker": {
    path: "M384 192c0 87.4-117 243-168.3 307.2c-12.3 15.3-35.1 15.3-47.4 0C117 435 0 279.4 0 192C0 86 86 0 192 0S384 86 384 192z",
    anchor: { x: 200, y: 500 },
    labelOrigin: { x: 200, y: 200 }
  },
  "current-location": {
    path: "M429.6 92.1c4.9-11.9 2.1-25.6-7-34.7s-22.8-11.9-34.7-7l-352 144c-14.2 5.8-22.2 20.8-19.3 35.8s16.1 25.8 31.4 25.8H224V432c0 15.3 10.8 28.4 25.8 31.4s30-5.1 35.8-19.3l144-352z",
    anchor: { x: 250, y: 200 },
    labelOrigin: { x: 280, y: 220 }
  }
}
const DEFAULT_OPTIONS = {
  marker: {
    optimized: false,
    icon: {
      ...ICON_CONSTANTS["marker"],
      scale: .06,
      strokeColor: "rgb(0 0 0)",
      strokeWeight: 1,
      fillColor: "rgb(255 100 110)",
      fillOpacity: 1
    }
  },
  polyline: {
    strokeColor: "rgb(100 120 245)",
    strokeOpacity: 1.0,
    strokeWeight: 4
  }
}

export default function GoogleMarkup({ type = "marker", listeners = {}, ...props }) {
  const { map } = useContext(MapContext);
  const [markup, setMarkup] = useState(null);

  const previousListeners = useRef(null);

  // Initialization
  useEffect(
    () => {
      let isMounted = true;

      (async () => {
        const g = await googleLoader.load();
        const newMarkup = (type === "marker")
          ? new g.maps.Marker()
          : (type === "polyline")
          ? new g.maps.Polyline()
          : null;
        if (newMarkup && isMounted) setMarkup(newMarkup);
      })();

      return () => isMounted = false;
    },
    [type]
  );

  // Options
  useEffect(
    () => {
      if (!markup) return;
      markup.setOptions(defaultsDeep({}, props, DEFAULT_OPTIONS[type]));
    },
    [markup, type, props]
  );

  // Map
  useEffect(
    () => {
      if (!markup || !map) return;
      markup.setMap(map);
      return () => markup.setMap(null);
    },
    [markup, map]
  );

  // Listeners
  useEffect(
    () => {
      if (!markup || (previousListeners && isEqual(listeners, previousListeners))) return;
      previousListeners.current = listeners;

      forEach(listeners, (func, name) => {
        markup.addListener(name, e => {
          func(markup, e);
        });
      });
    },
    [markup, listeners, previousListeners]
  );

  return null;
}
