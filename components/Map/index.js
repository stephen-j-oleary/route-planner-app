
import styles from "./styles.module.css";
import classNames from "classnames";
import { useSelector, useDispatch } from "react-redux";
import { setState, selectIsState, selectOptions, mergeOptions, /* selectMarkers, selectPolylines, setHoveredMarker, setSelectedMarker, */ selectMarkup, setHoveredMarkup, setSelectedMarkup } from "../../redux/slices/map.js";

import LoadingDots from "../LoadingDots";
import GoogleMap from "../Google/Map";
import { useCallback } from "react";

export default function Map(props) {
  const isLoading = useSelector(state => selectIsState(state, "loading"));
  const { center, zoom, heading, ...options } = useSelector(selectOptions);
  const markup = useSelector(selectMarkup);
  /* const markers = useSelector(selectMarkers);
  const polylines = useSelector(selectPolylines); */
  const dispatch = useDispatch();

  // Map handlers
  const handleMapLoad = useCallback(
    () => dispatch(setState("view")),
    [dispatch]
  );
  const handleMapIdle = useCallback(
    m => {
      const center = m.getCenter()?.toJSON();
      const zoom = m.getZoom();
      const heading = m.getHeading();

      if (center) dispatch(mergeOptions({
        center,
        heading,
        zoom
      }));
    },
    [dispatch]
  );

  // Marker handlers
  const handleMarkupMouseOver = useCallback(
    m => dispatch(setHoveredMarkup(m.id)),
    [dispatch]
  );
  const handleMarkupMouseOut = useCallback(
    () => dispatch(setHoveredMarkup(null)),
    [dispatch]
  );
  const handleMarkupClick = useCallback(
    m => dispatch(setSelectedMarkup(m.id)),
    [dispatch]
  );

  return (
    <div
      {...props}
      className={classNames(
        props.className,
        styles.container
      )}
    >
      {isLoading && <CompPlaceholder />}
      <GoogleMap
        className={styles.map}
        center={center}
        zoom={zoom}
        heading={heading}
        options={options}
        markup={{
          items: markup,
          listeners: {
            mouseover: handleMarkupMouseOver,
            mouseout: handleMarkupMouseOut,
            click: handleMarkupClick
          }
        }}
        listeners={{
          tilesloaded: handleMapLoad,
          idle: handleMapIdle
        }}
      />
    </div>
  )
}

const CompPlaceholder = () => (
  <div
    className={classNames(
      styles.map,
      styles.placeholder
    )}
  >
    <LoadingDots />
    Loading Map...
  </div>
)
