import Link from "next/link";

import { Button, MenuItem, Stack } from "@mui/material";

import DropdownButton from "@/components/ui/DropdownButton";
import { MenuProps } from "@/components/ui/Layout/Header/NavigationMenu";


export default function DesktopMenu({
  pages,
  isPageActive
}: MenuProps) {
  return (
    <Stack
      component="nav"
      direction="row"
      spacing={.5}
    >
      {
        pages.map(page => {
          const { name, path, pages } = page;
          const ButtonComponent = pages ? DropdownButton : Button;

          return (
            <ButtonComponent
              key={path}
              id={path}
              component={Link}
              href={path}
              color="inherit"
              aria-label={name}
              sx={{ backgroundColor: isPageActive(page) ? "grey.100" : "inherit" }}
              {...(pages ? {
                menuProps: {
                  PaperProps: {
                    sx: { minWidth: "min(100px, 100vw)" }
                  },
                  children: (
                    pages?.map((nestedPage) => (
                      <MenuItem
                        key={nestedPage.path}
                        component={Link}
                        href={nestedPage.path}
                        color="inherit"
                        sx={{ backgroundColor: isPageActive(nestedPage) ? "grey.100" : "inherit" }}
                        aria-label={nestedPage.name}
                      >
                        {nestedPage.name}
                      </MenuItem>
                    ))
                  ),
                }
              } : {})}
            >
              {name}
            </ButtonComponent>
          );
        })
      }
    </Stack>
  );
}