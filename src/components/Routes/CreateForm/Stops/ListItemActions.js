import { useCallback } from "react";

import ClearIcon from "@mui/icons-material/ClearRounded";
import MoreIcon from "@mui/icons-material/MoreHorizRounded";
import { Box, IconButton, Tooltip } from "@mui/material";

import StopModel from "@/models/Stop";


export default function StopsListItemActions({
  form,
  item,
  fieldArray,
  updateQueryParam,
  ...props
}) {
  const { index } = item;

  const isMinStops = fieldArray.fields.length <= StopModel.MINIMUM_STOPS;
  const clearLabel = isMinStops ? "Clear this stop" : "Remove this stop";

  const handleOptions = useCallback(
    () => {},
    []
  );
  const handleClear = useCallback(
    () => {
      isMinStops
        ? fieldArray.update(index, new StopModel())
        : fieldArray.remove(index);
      updateQueryParam("stops");
    },
    [index, isMinStops, fieldArray, updateQueryParam]
  );


  return (
    <Box {...props}>
      <Tooltip
        placement="bottom"
        title="Options"
      >
        <IconButton
          size="small"
          color="primary"
          onClick={handleOptions}
          aria-label="Options"
        >
          <MoreIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Tooltip
        placement="bottom"
        title={clearLabel}
      >
        <IconButton
          size="small"
          color="primary"
          onClick={handleClear}
          aria-label={clearLabel}
          disabled={form.formState.isLoading}
        >
          <ClearIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  )
}