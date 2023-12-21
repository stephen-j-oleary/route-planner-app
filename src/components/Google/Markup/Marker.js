import { defaultsDeep } from "lodash";
import { useEffect } from "react";

import { useTheme } from "@mui/material";

import connectGoogleMapsApi from "@/utils/connectGoogleMapsApi";


export default function Marker({ markup, setMarkup, ...props }) {
  const theme = useTheme();

  useEffect(
    function initialize() {
      let isMounted = true;

      (async () => {
        const g = await connectGoogleMapsApi();
        const newMarkup = new g.maps.Marker();
        if (newMarkup && isMounted) setMarkup(newMarkup);
      })();

      return () => isMounted = false;
    },
    [setMarkup]
  );

  useEffect(
    function updateOptions() {
      if (!markup) return;
      markup.setOptions(defaultsDeep({}, props, theme.components.Marker.defaultProps));
    },
    [markup, props, theme]
  );

  return null;
}