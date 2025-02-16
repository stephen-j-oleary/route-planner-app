import { AddRounded, CircleOutlined, FlagRounded, HomeRounded, PlaceRounded } from "@mui/icons-material";
import { Box, ListItemIcon, ListItemIconProps, Tooltip } from "@mui/material";


export type StopIconProps =
  & ListItemIconProps
  & {
    isOrigin?: boolean,
    isDestination?: boolean,
    isAdd?: boolean,
  }

export default function StopIcon({
  isOrigin = false,
  isDestination = false,
  isAdd = false,
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
      icon: <CircleOutlined fontSize="inherit" />,
    },
  };


  return (
    <ListItemIcon
      sx={{
        display: "grid",
        placeItems: "center",
        alignSelf: "stretch",
        minWidth: 0,
        background: "inherit",
        color: "text.secondary",
        "& > *": { gridArea: "1 / 1 / 1 / 1" },
      }}
      {...props}
    >
      <Tooltip
        title={VARIANTS[variant].title}
        enterDelay={300}
        enterNextDelay={200}
      >
        {VARIANTS[variant].icon}
      </Tooltip>

      {
        !isAdd && (
          <Box
            sx={{
              width: "0px",
              height: "50%",
              borderLeft: "2px dashed",
              borderColor: "text.secondary",
              transform: "translateX(-1px) translateY(100%)",
              zIndex: 1,
            }}
          />
        )
      }
    </ListItemIcon>
  );
}