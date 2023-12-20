import { amber, blueGrey, green, lightBlue } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";

import marker from "@/components/Google/Markup/gmMarkerIcons/marker";


export let theme = createTheme({
  palette: {
    primary: { main: lightBlue[900] },
    secondary: { main: "#42DDAA" },
    background: { default: "#F4F9FF" },
  },
  shape: {
    borderRadius: "4px"
  },
  typography: {
    h1: {
      fontSize: "3rem",
      fontWeight: 400,
    },
    limitLines: n => ({
      overflow: "hidden",
      display: "-webkit-box",
      lineClamp: n,
      WebkitLineClamp: n,
      WebkitBoxOrient: "vertical"
    }),
    button: {
      textTransform: "none"
    }
  },
  hideScrollbar: {
    MsOverflowStyle: "none",
    scrollbarWidth: "none",
    "&::-webkit-scrollbar": { display: "none" }
  },
  components: {
    MuiTextField: {
      defaultProps: {
        fullWidth: true,
        variant: "outlined",
        size: "small",
      },
    },
    MuiSelect: {
      defaultProps: {
        fullWidth: true,
        variant: "outlined",
        size: "small",
        native: true,
      },
    },
    MuiPopper: {
      defaultProps: {
        sx: { zIndex: theme => theme.zIndex.drawer }
      }
    },
  },
})

theme = createTheme(theme, {
  components: {
    Marker: {
      defaultProps: {
        optimized: false,
        icon: marker,
      },
    },
    Polyline: {
      defaultProps: {
        strokeColor: theme.palette.primary.light,
        strokeOpacity: 1,
        strokeWeight: 4,
      },
    },
    Map: {
      defaultProps: {
        styles: [
          {
            elementType: "geometry.fill",
            stylers: [{ weight: 2.5 }],
          },
          {
            elementType: "geometry.stroke",
            stylers: [{ weight: 1 }],
          },
          {
            elementType: "labels.text.stroke",
            stylers: [{ weight: 1 }],
          },
          {
            featureType: "landscape.natural",
            elementType: "geometry.fill",
            stylers: [{ color: green[100] }],
          },
          {
            featureType: "poi.park",
            elementType: "geometry.fill",
            stylers: [{ color: green[100] }],
          },
          {
            featureType: "administrative.land_parcel",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
          {
            featureType: "road.highway",
            elementType: "geometry.fill",
            stylers: [{ color: amber[100] }],
          },
          {
            featureType: "road.highway",
            elementType: "geometry.stroke",
            stylers: [{ color: amber[500] }],
          },
          {
            featureType: "road.arterial",
            elementType: "geometry.fill",
            stylers: [{ color: "#ffffff" }],
          },
          {
            featureType: "road.arterial",
            elementType: "geometry.stroke",
            stylers: [{ color: blueGrey[200] }],
          },
          {
            featureType: "road.local",
            elementType: "geometry.fill",
            stylers: [{ color: "#ffffff" }],
          },
          {
            featureType: "road.local",
            elementType: "geometry.stroke",
            stylers: [{ color: blueGrey[100] }],
          },
          {
            featureType: "transit",
            stylers: [{ visibility: "off" }],
          },
        ],
      },
    },
  },
});