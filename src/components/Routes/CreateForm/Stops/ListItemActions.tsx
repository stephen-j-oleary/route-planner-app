import { ClearRounded } from "@mui/icons-material";
import { Box, BoxProps, IconButton, Tooltip } from "@mui/material";

import useRouteForm from "../hooks";
import { Stop } from "@/models/Route";


export type StopsListItemActionsProps =
  & BoxProps
  & {
    form: ReturnType<typeof useRouteForm>,
    stopIndex: number,
    onChange: (value: Partial<Stop>) => void,
    onRemove: () => void,
  };

export default function StopsListItemActions({
  form,
  stopIndex,
  onChange,
  onRemove,
  ...props
}: StopsListItemActionsProps) {
  const isLastStop = stopIndex === form.stops.length - 1;
  const isMinStops = form.stops.length <= 1;
  const clearLabel = isMinStops ? "Clear stop" : "Remove stop";

  const handleClear = () => isMinStops
    ? onChange({ fullText: "" })
    : onRemove();


  return (
    <Box
      visibility={!isLastStop ? "visible" : "hidden"}
      {...props}
    >
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
          >
            <ClearRounded fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
    </Box>
  );
}