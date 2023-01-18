
import _ from "lodash";
import useURL from "./useURL.js";
import Stop from "../Stop.js";
import { useCallback } from "react";

export default function useStopParams() {
  const [url, setUrl] = useURL();

  const stops = _.get(url, "pathname", "")
    .split("/")
    .filter(v => !_.isEmpty(v))
    .map(decodeURIComponent)
    .map(Stop.fromString);

  const setStops = useCallback(
    value => {
      if (!url) return;

      const newStops = "/" + value
        .map(Stop.toString)
        .map(encodeURIComponent)
        .filter(v => !_.isEmpty(v))
        .join("/");

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
