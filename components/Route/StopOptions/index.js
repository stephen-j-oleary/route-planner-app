
import { forwardRef, Fragment } from "react";
import { useSelector } from "react-redux";
import { selectSelectedStop } from "../../../redux/slices/routeForm.js";

import LoadingPlaceholder from "../../LoadingPlaceholder";
import { Box, Stack, Typography } from "@mui/material";
import { useFormContext } from "react-hook-form";

export default forwardRef(function StopOptions(props, ref) {
  const selectedStop = useSelector(selectSelectedStop);
  const { getValues } = useFormContext();
  const stopValue = getValues(`stops.${selectedStop}.address`);
  const baseName = `stops.${selectedStop}.modifiers`;

  return (
    <Stack
      key={baseName}
      name={baseName}
      justifyContent="flex-start"
      alignItems="stretch"
      gap={3}
      padding={3}
      {...props}
    >
      <LoadingPlaceholder
        isLoading={selectedStop === -1}
        placeholder={Fragment}
      >
        <Typography component="legend">
          <Typography component="p" fontWeight="medium">Stop Options</Typography>
          <Typography component="p" fontSize={12}>{stopValue}</Typography>
        </Typography>
        <Box
          display="grid"
          gridTemplateColumns="minmax(0, 1fr)"
          gap={2}
        >
        </Box>
      </LoadingPlaceholder>
    </Stack>
  )
})
