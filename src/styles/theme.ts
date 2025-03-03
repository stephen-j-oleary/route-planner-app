"use client";

import { createTheme } from "@mui/material/styles";

import { backgroundDefault, primaryDefault } from "./constants";


declare module "@mui/material/styles" {
  interface Theme {
    limitLines: (n: number) => object;
    hideScrollbar: object;
  }

  interface ThemeOptions {
    limitLines?: (n: number) => object;
    hideScrollbar?: object;
  }
}

export const theme = createTheme({
  palette: {
    primary: { main: primaryDefault },
    secondary: { main: "#42DDAA" },
    background: { default: backgroundDefault },
  },
  shape: {
    borderRadius: 4,
  },
  typography: {
    fontFamily: "var(--font-roboto)",
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
});