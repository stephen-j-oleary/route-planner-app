
import styles from "./styles.module.css";
import { useSelector, useDispatch } from "react-redux";
import { setState, selectIsState, selectOptions, mergeOptions, selectMarkup, setHoveredMarkup, setSelectedMarkup, toggleHideMap, selectHideMap } from "../../redux/slices/map.js";

import LoadingDots from "../LoadingDots";
import GoogleMap from "../Google/Map";
import { useCallback } from "react";
import { FaMap } from "react-icons/fa";
import { useTheme } from "@mui/material/styles";
import Button from "../Button";
import { Box, Stack, useMediaQuery } from "@mui/material";

export default function Map(props) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const isLoading = useSelector(state => selectIsState(state, "loading"));
  const { center, zoom, heading, ...options } = useSelector(selectOptions);
  const markup = useSelector(selectMarkup);
  const dispatch = useDispatch();
  const hideMap = useSelector(selectHideMap);

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

  const toggleMapView = () => {
    dispatch(toggleHideMap());
  };

  return (
    <Box
      flex={{ md: 2 }}
      height={!isDesktop ? (hideMap ? "calc(36px + 2rem)" : "50vh") : "auto"}
      minWidth="400px"
      sx={{
        transition: "height .25s ease-in-out",
        background: theme.palette.background.default
      }}
      {...props}
    >
      <Box
        className={!isDesktop && (hideMap ? styles.hideMap : styles.showMap)}
        width="100%"
        height="100%"
        sx={{
          position: "relative"
        }}
      >
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
        {
          isLoading && (
            <Stack
              justifyContent="center"
              alignItems="center"
              sx={{
                background: `rgb(${theme.palette.background.defaultChannel} / .5)`
              }}
              className={styles.map}
            >
              <LoadingDots />
              Loading Map...
            </Stack>
          )
        }
      </Box>

      <Button
        variant="contained"
        className={styles.hideMapBtn}
        onClick={toggleMapView}
        startIcon={<FaMap />}
        sx={isDesktop ? {
          display: "none"
        } : {}}
      >
        {hideMap ? "Show" : "Hide"}
      </Button>
    </Box>
  )
}
