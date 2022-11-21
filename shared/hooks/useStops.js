
import _ from "lodash";
import useURL from "./useURL.js";
import { fromStopString, toStopString } from "../Stop.js";
import { useCallback } from "react";

export default function useStops() {
  const [url, setUrl] = useURL();

  const stops = _.chain(url)
    .get("pathname", "")
    .trim("/")
    .split("/")
    .map(decodeURIComponent)
    .map(fromStopString)
    .value();

  const setStops = useCallback(
    (value) => {
      if (!url) return;

      const newStops = _.chain(value)
        .cloneDeep()
        .map(toStopString)
        .map(encodeURIComponent)
        .join("/")
        .thru(val => "/" + val) // Add leading slash
        .value();

      const urlCpy = new URL(url);
      urlCpy.pathname = newStops;

      setUrl(urlCpy, "replace", { shallow: true });
    },
    [url, setUrl]
  );

  return [
    stops,
    setStops,
    !!url // isReady
  ];
}
