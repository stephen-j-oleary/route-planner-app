import "@/styles/globals.css";
import { Roboto } from "next/font/google";
import { HTMLAttributes, ReactNode } from "react";

import { ThemeProvider } from "@mui/material/styles";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";

import { theme } from "@/styles/theme";


const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
});

export default function Body({
  children,
  style,
}: {
  children: ReactNode
  style?: HTMLAttributes<HTMLBodyElement>["style"],
}) {
  return (
    <body className={roboto.variable} style={style}>
      <AppRouterCacheProvider>
        <ThemeProvider theme={theme}>
          {children}
        </ThemeProvider>
      </AppRouterCacheProvider>
    </body>
  );
}