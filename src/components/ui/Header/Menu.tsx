import { Box } from "@mui/material";


export const MENU_ID = "header-menu-portal";

export default function HeaderMenu() {
  return (
    <Box
      id={MENU_ID}
      sx={{ gridColumn: "1 / -1" }}
    />
  );
}