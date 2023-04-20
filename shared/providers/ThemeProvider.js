import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";

import { theme } from "@/shared/styles/theme";


export default function ThemeProvider(props) {
  return (
    <MuiThemeProvider
      theme={theme}
      {...props}
    />
  );
}