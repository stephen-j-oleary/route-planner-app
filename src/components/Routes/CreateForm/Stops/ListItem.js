import { Box, ListItem } from "@mui/material";

import CreateRouteFormStopAddressInput from "@/components/Routes/CreateForm/inputs/StopAddressInput";
import StopsListItemActions from "@/components/Routes/CreateForm/Stops/ListItemActions";
import StopIcon from "@/components/Routes/StopIcons/Item";


export default function StopsListItem({
  name,
  form,
  item,
  fieldArray,
  updateQueryParam,
  ...props
}) {
  const { isOrigin, isDestination } = item;

  return (
    <ListItem
      sx={{
        gap: 2,
        backgroundColor: "background.default",
        paddingX: 0,
        cursor: "text",
        "& .actions": {
          transition: "opacity .2s ease-out",
          opacity: 1,
        },
        "@media (hover: hover)": {
          "&:not(:hover) .actions": { opacity: 0 },
        },
      }}
    >
      <StopIcon
        isOrigin={isOrigin}
        isDestination={isDestination}
      />

      <Box flex="1 1 auto">
        <CreateRouteFormStopAddressInput
          name={name}
          form={form}
          updateQueryParam={updateQueryParam}
          {...props}
        />
      </Box>

      <StopsListItemActions
        className="actions"
        form={form}
        item={item}
        fieldArray={fieldArray}
        updateQueryParam={updateQueryParam}
      />
    </ListItem>
  );
}