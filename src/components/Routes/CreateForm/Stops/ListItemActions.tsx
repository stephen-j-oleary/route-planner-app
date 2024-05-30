import { UseFieldArrayReturn } from "react-hook-form";

import ClearIcon from "@mui/icons-material/ClearRounded";
import { Box, BoxProps, IconButton, Tooltip } from "@mui/material";

import { minimumStopCount } from "@/components/Routes/CreateForm/constants";
import { CreateRouteFormFields } from "@/components/Routes/CreateForm/useLogic";


export type StopsListItemActionsProps = BoxProps & {
  stopIndex: number,
  fieldArray: UseFieldArrayReturn<CreateRouteFormFields, "stops", "id">,
  disabled?: boolean,
}

export default function StopsListItemActions({
  stopIndex,
  fieldArray,
  disabled = false,
  ...props
}: StopsListItemActionsProps) {

  const isMinStops = fieldArray.fields.length <= minimumStopCount;
  const clearLabel = isMinStops ? "Clear stop" : "Remove stop";

  const handleClear = () => {
    isMinStops
      ? fieldArray.update(stopIndex, { fullText: "" })
      : fieldArray.remove(stopIndex);
  };


  return (
    <Box {...props}>
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