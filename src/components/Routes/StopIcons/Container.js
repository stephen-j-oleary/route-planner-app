import { Box } from "@mui/material";

import StopIcon from "./Item";


export default function StopIconsContainer() {
  return (
    <Box
      sx={{
        position: "absolute",
        inset: `36px auto 36px calc((${StopIcon.defaultSize} / 2) - 1px)`,
        width: "0px",
        borderLeft: "2px dashed",
        borderColor: "text.secondary",
        zIndex: 1
      }}
    />
  );
}