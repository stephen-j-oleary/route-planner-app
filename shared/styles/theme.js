
import { createTheme } from "@mui/material/styles";


export const theme = createTheme({
  palette: {
    primary: {
      main: "rgb(50, 90, 205)",
      contrastText: "rgb(250, 250, 255)"
    }
  },
  shape: {
    borderRadius: "4px"
  },
  typography: {
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
  }
})
