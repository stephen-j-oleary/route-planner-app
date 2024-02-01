import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { ThemeProviderProps } from "@mui/material/styles/ThemeProvider";

import { theme } from "@/styles/theme";


export default function ThemeProvider(props: Omit<ThemeProviderProps, "theme">) {
  return (
    <MuiThemeProvider
      theme={theme}
      {...props}
    />
  );
}