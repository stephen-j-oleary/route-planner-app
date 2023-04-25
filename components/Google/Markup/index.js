import { forEach, isEqual } from "lodash";
import { useContext, useEffect, useRef, useState } from "react";

import Marker from "./Marker.js";
import { MapContext } from "../Map";


export default function GoogleMarkup({ component: Component = Marker, listeners = {}, ...props }) {
  const { map } = useContext(MapContext);
  const [markup, setMarkup] = useState(null);

  const previousListeners = useRef(null);

  useEffect(
    function updateListeners() {
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

  useEffect(
    function addToMap() {
      if (!markup || !map) return;
      markup.setMap(map);
      return () => markup.setMap(null);
    },
    [markup, map]
  );

  return (
    <Component
      markup={markup}
      setMarkup={setMarkup}
      {...props}
    />
  );
}