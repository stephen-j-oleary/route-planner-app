
import { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { actions } from "../../redux/slices/map.js";

import GoogleMapWrapper from "../GoogleMapWrapper";

export default function Map() {
  return (
    <GoogleMapWrapper
      render={status => (
        <MapComponent googleReady={status === "SUCCESS"} />
      )}
    />
  );
}

function MapComponent({ googleReady }) {
  const gMap = useRef(null);
  const ref = useRef();

  const map = useSelector(state => state.map);
  const dispatch = useDispatch();

  useEffect(() => gMap.current?.setOptions(map), [map]);

  useEffect(() => {
    if (!googleReady || gMap.current) return;

    gMap.current = new window.google.maps.Map(ref.current, map);

    // Adjust redux store when ant properties change on map
    gMap.current.addListener("bounds_changed", () => dispatch(actions.setBounds(gMap.current.getBounds()?.toJSON())));
    gMap.current.addListener("center_changed", () => dispatch(actions.setCenter(gMap.current.getCenter()?.toJSON())));
    gMap.current.addListener("heading_changed", () => dispatch(actions.setHeading(gMap.current.getHeading())));
    gMap.current.addListener("zoom_changed", () => dispatch(actions.setZoom(gMap.current.getZoom())));
  }, [googleReady, map, dispatch]);

  return (
    <div ref={ref}></div>
  );
}
