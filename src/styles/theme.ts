"use client";

import { amber, blueGrey, green, lightBlue } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";

import { backgroundDefault } from "./constants";


declare module "@mui/material/styles" {
  interface Theme {
    limitLines: (n: number) => object;
    hideScrollbar: object;
  }

  interface ThemeOptions {
    limitLines?: (n: number) => object;
    hideScrollbar?: object;
  }

  interface Components {
    Map?: {
      defaultProps: {
        styles: {
          elementType: string,
          stylers: { weight: number }[],
        }[],
      },
    };
  }
}

export let theme = createTheme({
  palette: {
    primary: { main: lightBlue[900] },
    secondary: { main: "#42DDAA" },
    background: { default: backgroundDefault },
  },
  shape: {
    borderRadius: 4,
  },
  typography: {
    h1: {
      fontSize: "3.5rem",
      fontWeight: 700,
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 700,
    },
    h3: {
      fontSize: "1.5rem",
      fontWeight: 600,
    },
    h4: {
      fontSize: "1.3rem",
      fontWeight: 500,
    },
    h5: {
      fontSize: "1.1rem",
      fontWeight: 500,
    },
    h6: {
      fontSize: "1rem",
      fontWeight: 500,
    },
    button: {
      textTransform: "none"
    },
  },
  limitLines: n => ({
    overflow: "hidden",
    display: "-webkit-box",
    lineClamp: n,
    WebkitLineClamp: n,
    WebkitBoxOrient: "vertical"
  }),
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