import { FieldPath, UseFieldArrayReturn } from "react-hook-form";

import { Box, ListItem } from "@mui/material";

import AddressInput, { AddressInputProps } from "@/components/AddressInput";
import StopsListItemActions from "@/components/Routes/CreateForm/Stops/ListItemActions";
import { CreateRouteFormFields } from "@/components/Routes/CreateForm/useLogic";
import StopIcon from "@/components/Routes/StopIcons/Item";


export type StopsListItemProps = AddressInputProps & {
  item: {
    index: number,
    isOrigin: boolean,
    isDestination: boolean,
  },
  fieldArray: UseFieldArrayReturn<CreateRouteFormFields, "stops", "id">,
  updateQueryParam: (name: FieldPath<CreateRouteFormFields>) => void,
  disabled?: boolean,
};

export default function StopsListItem({
  value,
  onChange,
  item,
  fieldArray,
  updateQueryParam,
  disabled,
  ...props
}: StopsListItemProps) {
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
        <AddressInput
          value={value}
          onChange={option => {
            onChange(option);
            updateQueryParam("stops");
          }}
          disabled={disabled}
          {...props}
        />
      </Box>

      <StopsListItemActions
        className="actions"
        item={item}
        fieldArray={fieldArray}
        onChange={() => updateQueryParam("stops")}
        disabled={disabled}
      />
    </ListItem>
  );
}