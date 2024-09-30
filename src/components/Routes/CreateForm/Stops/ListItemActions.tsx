import { UseFieldArrayReturn } from "react-hook-form";

import ClearIcon from "@mui/icons-material/ClearRounded";
import { Box, BoxProps, IconButton, Tooltip } from "@mui/material";

import { RouteFormFields } from "@/components/Routes/CreateForm/schema";


export type StopsListItemActionsProps = BoxProps & {
  stopIndex: number,
  fieldArray: UseFieldArrayReturn<RouteFormFields, "stops", "id">,
  disabled?: boolean,
}

export default function StopsListItemActions({
  stopIndex,
  fieldArray,
  disabled = false,
  ...props
}: StopsListItemActionsProps) {
  const isLastStop = stopIndex === fieldArray.fields.length - 1;
  const isMinStops = fieldArray.fields.length <= 1;
  const clearLabel = isMinStops ? "Clear stop" : "Remove stop";

  const handleClear = () => isMinStops
    ? fieldArray.update(stopIndex, { fullText: "" })
    : fieldArray.remove(stopIndex);


  return (
    <Box {...props}>
      <Tooltip
        placement="bottom"
        title={clearLabel}
      >
        <span>
          <IconButton
            size="small"
            color="primary"
            onClick={handleClear}
            aria-label={clearLabel}
            disabled={disabled || isLastStop}
          >
            <ClearIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
    </Box>
  )
}