import React from "react";

import { AddRounded, HomeRounded, FlagRounded, PlaceRounded } from "@mui/icons-material";
import CircleIcon from "@mui/icons-material/CircleOutlined";
import { ListItemIcon, ListItemIconProps, Tooltip, Typography } from "@mui/material";


export type StopIconProps = ListItemIconProps & {
  isOrigin?: boolean,
  isDestination?: boolean,
  isAdd?: boolean,
  size?: string,
  spacer?: boolean,
  children?: React.ReactNode,
}

export default function StopIcon({
  isOrigin = false,
  isDestination = false,
  isAdd = false,
  size = StopIcon.defaultSize,
  spacer = false,
  children,
  ...props
}: StopIconProps) {
  const variant = isAdd
    ? "add"
    : isOrigin && isDestination
    ? "originDestination"
    : isOrigin
    ? "origin"
    : isDestination
    ? "destination"
    : "waypoint";
  const VARIANTS = {
    add: {
      title: "Add Stop",
      icon: <AddRounded fontSize="inherit" />,
    },
    originDestination: {
      title: "Origin & Destination",
      icon: <PlaceRounded fontSize="inherit" />,
    },
    origin: {
      title: "Origin",
      icon: <HomeRounded fontSize="inherit" />,
    },
    destination: {
      title: "Destination",
      icon: <FlagRounded fontSize="inherit" />,
    },
    waypoint: {
      title: "Waypoint",
      icon: <CircleIcon fontSize="inherit" />,
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
            enterDelay={300}
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

StopIcon.defaultSize = "1.2rem";