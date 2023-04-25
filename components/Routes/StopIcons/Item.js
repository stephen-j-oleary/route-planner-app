import { mdiLocationEnter, mdiLocationExit, mdiMapMarkerCircle } from "@mdi/js";
import MdiIcon from "@mdi/react";

import CircleIcon from "@mui/icons-material/CircleOutlined";
import { ListItemIcon, Tooltip, Typography } from "@mui/material";


export default function StopIcon({
  size = StopIcon.defaultSize,
  spacer = false,
  isOrigin,
  isDestination,
  children,
  ...props
}) {
  const variant = isOrigin && isDestination
    ? "originDestination"
    : isOrigin
    ? "origin"
    : isDestination
    ? "destination"
    : "waypoint";
  const VARIANTS = {
    originDestination: {
      title: "Origin & Destination",
      icon: <MdiIcon path={mdiMapMarkerCircle} />
    },
    origin: {
      title: "Origin",
      icon: <MdiIcon path={mdiLocationExit} />
    },
    destination: {
      title: "Destination",
      icon: <MdiIcon path={mdiLocationEnter} />
    },
    waypoint: {
      title: "Waypoint",
      icon: <CircleIcon fontSize="inherit" />
    },
  };


  return (
    <ListItemIcon
      sx={{
        display: "grid",
        placeItems: "center",
        alignSelf: "flex-start",
        minWidth: 0,
        zIndex: 2,
        background: spacer ? "none" : "inherit",
        color: "text.secondary",
        height: spacer ? "auto" : `calc(${size} + 12px)`,
        width: size,
        marginTop: .5,
        fontSize: size,
        "& > *": { gridArea: "1/1/1/1" },
      }}
      {...props}
    >
      {
        !spacer && (
          <Tooltip
            title={VARIANTS[variant].title}
            enterDelay={500}
            enterNextDelay={200}
          >
            {VARIANTS[variant].icon}
          </Tooltip>
        )
      }

      {
        children && (
          <Typography fontSize={`calc(${size} - .4rem)`}>
            {children}
          </Typography>
        )
      }
    </ListItemIcon>
  );
}

StopIcon.defaultSize = "1.4rem";