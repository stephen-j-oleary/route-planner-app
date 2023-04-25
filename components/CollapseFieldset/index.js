import { useRef, useState } from "react";

import { Box, Button, Collapse, Slide, Typography } from "@mui/material";


export default function CollapseFieldset({
  primary,
  secondary,
  show,
  onToggle,
  defaultShow = false,
  disableHideTitle = false,
  children,
  ...props
}) {
  const [internalShow, setInternalShow] = useState(defaultShow);
  const _show = (typeof show === "boolean") ? show : internalShow;
  const handleToggle = (typeof show === "boolean") ? onToggle : (() => setInternalShow(v => !v));
  const transitionContainer = useRef();

  return (
    <Box
      ref={transitionContainer}
      overflow="hidden"
      {...props}
    >
      <fieldset
        style={{
          margin: 0,
          padding: 0,
          border: "none",
        }}
      >
        <legend
          style={{
            position: "absolute !important",
            height: "1px",
            width: "1px",
            overflow: "hidden",
            clip: "rect(1px, 1px, 1px, 1px)",
            whiteSpace: "nowrap",
          }}
        >
          {primary}
        </legend>

        <Box
          display="grid"
          gridTemplateColumns="1fr auto"
          gridTemplateRows="1fr auto"
          columnGap={2}
          alignItems="center"
        >
          <Slide
            in={disableHideTitle || _show}
            direction="down"
            container={transitionContainer.current}
          >
            <Box>
              <Typography
                component="p"
                fontWeight="medium"
                sx={theme => theme.typography.limitLines(1)}
              >
                {primary}
              </Typography>

              {
                secondary && (
                  <Typography
                    component="p"
                    variant="caption"
                    lineHeight=".75rem"
                    sx={theme => theme.typography.limitLines(1)}
                  >
                    {secondary}
                  </Typography>
                )
              }
            </Box>
          </Slide>

          <Button
            size="small"
            variant="text"
            onClick={handleToggle}
            sx={{
              marginY: theme => `${theme.spacing(.5)} !important`,
              whiteSpace: "nowrap",
            }}
          >
            {_show ? "Hide" : disableHideTitle ? "Show" : `${primary}...`}
          </Button>

          <Collapse
            in={_show}
            unmountOnExit
            sx={{
              gridColumn: "1 / -1",
            }}
          >
            {children}
          </Collapse>
        </Box>
      </fieldset>
    </Box>
  );
}