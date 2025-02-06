"use client";

import { Button, Stack, StackProps } from "@mui/material";

import { useIsPageActive } from "../hooks";
import NextLinkComposed from "@/components/ui/NextLinkComposed";
import { navigation } from "@/pages";


export default function NavigationMenuExpanded(props: StackProps) {
  const isPageActive = useIsPageActive();

  return (
    <Stack
      component="nav"
      direction="row"
      spacing={.5}
      {...props}
    >
      {
        navigation.map(([name, path]) => (
          <Button
            key={path}
            component={NextLinkComposed}
            to={path}
            color="inherit"
            sx={{ backgroundColor: isPageActive(path) ? "grey.100" : "inherit" }}
          >
            {name}
          </Button>
        ))
      }
    </Stack>
  );
}