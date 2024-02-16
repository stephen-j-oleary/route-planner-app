import React from "react";
import { useMutation } from "react-query";

import { LocationDisabledRounded, MyLocationRounded } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { LinearProgress, List, ListItem, ListProps, Stack, Typography, useTheme } from "@mui/material";

import { AddressSuggestion } from "@/hooks/useAddressSuggestions";
import usePosition from "@/hooks/usePosition";


type AddressAutocompleteGroupProps =
  & Omit<ListProps, "onChange">
  & {
    onChange: (option: AddressSuggestion | string) => void,
    isFetching: boolean,
  }

const AddressAutocompleteGroup = React.forwardRef<HTMLUListElement, AddressAutocompleteGroupProps>(
  function AddressInputGroup({
    onChange,
    isFetching,
    children,
    ...props
  }, ref) {
    const theme = useTheme();
    const position = usePosition();

    const locationMutation = useMutation({
      mutationFn: position.request,
      onSuccess: ({ lat, lng }) => {
        const coordinates: [number, number] = [lat, lng];
        onChange({
          mainText: "Current location",
          fullText: coordinates.join(", "),
          coordinates,
        });
      },
    });

    return (
      <List
        ref={ref}
        disablePadding
        sx={{ margin: 0 }}
        {...props}
      >
        <Stack
          spacing={1}
          padding={1}
          sx={{
            overflow: "scroll hidden",
            borderColor: "divider",
            borderStyle: "solid",
            borderWidth: 0,
            borderBottomWidth: ".5rem",
            ...theme.hideScrollbar,
          }}
        >
          <Stack
            direction="row"
            spacing={1}
          >
            <LoadingButton
              size="medium"
              variant="outlined"
              startIcon={
                position.status === "denied"
                  ? <LocationDisabledRounded fontSize="inherit" />
                  : <MyLocationRounded fontSize="inherit" />
              }
              loadingPosition="start"
              loading={locationMutation.isLoading}
              disabled={position.status === "loading" || position.status === "denied"}
              onClick={() => locationMutation.mutate()}
            >
              Current location
            </LoadingButton>
          </Stack>

          {
            typeof locationMutation.error === "string" && (
              <Typography variant="caption" component="p" color="error">
                {locationMutation.error}
              </Typography>
            )
          }
        </Stack>

        {
          isFetching && (
            <ListItem disablePadding>
              <LinearProgress sx={{ width: "100%" }} />
            </ListItem>
          )
        }

        {children}
      </List>
    );
  }
);


export default AddressAutocompleteGroup;