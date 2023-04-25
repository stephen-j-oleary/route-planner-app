import { useFieldArray } from "react-hook-form";

import AddIcon from "@mui/icons-material/AddCircleOutlineRounded";
import { Box, Button, List } from "@mui/material";

import StopsListItem from "@/components/Routes/CreateForm/Stops/ListItem";
import StopIconsContainer from "@/components/Routes/StopIcons/Container";
import StopModel from "@/shared/models/Stop";


export default function StopsList({
  form,
  getInputProps,
  updateQueryParam,
  ...props
}) {
  const { watch, getValues, setFocus, formState } = form;

  const stopsFieldArray = useFieldArray({ name: "stops" });
  const { fields, append } = stopsFieldArray;

  const origin = watch("origin", -1);
  const destination = watch("destination", -1);

  const isOrigin = index => index === +origin;
  const isDestination = index => index === +destination;

  const handleAdd = () => {
    append(new StopModel());
    setFocus(`stops.${getValues("stops").length - 1}.value`);
  };

  return (
    <Box>
      <Box
        sx={{ position: "relative" }}
        {...props}
      >
        <StopIconsContainer />

        <List disablePadding>
          {
            fields.map((field, index) => (
              <StopsListItem
                key={field.id}
                item={{
                  index,
                  isOrigin: isOrigin(index),
                  isDestination: isDestination(index),
                }}
                fieldArray={stopsFieldArray}
                updateQueryParam={updateQueryParam}
                {...getInputProps(`stops.${index}`)}
              />
            ))
          }
        </List>
      </Box>

      <Button
        size="medium"
        variant="text"
        startIcon={<AddIcon />}
        onClick={handleAdd}
        disabled={formState.isLoading}
      >
        Add Stop
      </Button>
    </Box>
  );
}