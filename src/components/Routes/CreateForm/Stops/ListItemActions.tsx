import { useCallback } from "react";
import { UseFieldArrayReturn } from "react-hook-form";

import ClearIcon from "@mui/icons-material/ClearRounded";
import MoreIcon from "@mui/icons-material/MoreHorizRounded";
import { Box, BoxProps, IconButton, Tooltip } from "@mui/material";

import { CreateRouteFormFields, MINIMUM_STOP_COUNT } from "@/components/Routes/CreateForm/useLogic";


export type StopsListItemActionsProps = BoxProps & {
  item: {
    index: number,
    isOrigin: boolean,
    isDestination: boolean,
  },
  fieldArray: UseFieldArrayReturn<CreateRouteFormFields, "stops", "id">,
  onChange: () => void,
  disabled?: boolean,
}

export default function StopsListItemActions({
  item,
  fieldArray,
  onChange,
  disabled = false,
  ...props
}: StopsListItemActionsProps) {
  const { index } = item;

  const isMinStops = fieldArray.fields.length <= MINIMUM_STOP_COUNT;
  const clearLabel = isMinStops ? "Clear this stop" : "Remove this stop";

  const handleOptions = useCallback(
    () => {},
    []
  );
  const handleClear = useCallback(
    () => {
      isMinStops
        ? fieldArray.update(index, { fullText: "" })
        : fieldArray.remove(index);
      onChange();
    },
    [index, isMinStops, fieldArray, onChange]
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
          disabled={disabled}
        >
          <ClearIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  )
}