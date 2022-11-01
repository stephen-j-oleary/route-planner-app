
import _ from "lodash";
import useURL from "./useURL.js";
import { fromStopString, toStopString } from "../Stop.js";

export default function useStops() {
  const [url, setUrl] = useURL();

  const stops = _.chain(url)
    .get("pathname", "")
    .trim("/")
    .split("/")
    .map(decodeURIComponent)
    .map(fromStopString)
    .value();

  const setStops = (value, index = null) => {
    const newStops = _.chain(stops)
      .cloneDeep()
      .thru(val => index
        ? _.set(val, index, value)
        : value)
      .map(toStopString)
      .map(encodeURIComponent)
      .join("/")
      .thru(val => "/" + val)
      .value();

    const urlCpy = new URL(url);
    urlCpy.pathname = newStops;

    setUrl(urlCpy, "replace", { shallow: true });
  };

  return [
    stops,
    setStops,
    !!url // isReady
  ];
}
