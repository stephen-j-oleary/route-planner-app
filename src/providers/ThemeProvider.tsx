import { ReactNode } from "react";

import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";

import { theme } from "@/styles/theme";


export default function ThemeProvider({
  children,
}: {
  children: ReactNode,
}) {
  return (
    <AppRouterCacheProvider>
      <MuiThemeProvider theme={theme}>
        {children}
      </MuiThemeProvider>
    </AppRouterCacheProvider>
  );
}