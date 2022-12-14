
import _ from "lodash";
import { useCallback, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { selectIsState, selectValues } from "../../../redux/slices/routeForm.js";
import { useFormContext } from "react-hook-form";
import useURL from "../../../shared/hooks/useURL.js";

import Button from "../../Button";
import Select from "../../Select";
import { Box, Collapse, Skeleton, Slide, Stack, Typography } from "@mui/material";

export default function Options(props) {
  const isLoading = useSelector(state => selectIsState(state, "loading"));
  const isResults = useSelector(state => selectIsState(state, "results"));
  const [showOptions, setShowOptions] = useState(false);
  const resultValues = useSelector(selectValues);
  const [url, setUrl] = useURL();
  const { getValues } = useFormContext();
  const stops = getValues("stops");

  const transitionContainer = useRef();

  const updateQueryValue = useCallback(
    name => {
      const value = getValues(name);
      const urlCpy = new URL(url);
      const queryParams = urlCpy.searchParams;
      queryParams.set(name, value);
      setUrl(urlCpy, "replace", { shallow: true });
    },
    [url, setUrl, getValues]
  );

  return (
    <Stack
      ref={transitionContainer}
      overflow="hidden"
      padding={2}
      {...props}
    >
      <Stack
        component="fieldset"
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
      >
        {
          isLoading ? (
            <>
              <legend></legend>
              <Skeleton variant="rounded">
                <Button
                  size="small"
                  variant="outlined"
                  children="Options..."
                />
              </Skeleton>
            </>
          ) : (
            <>
              <Slide
                in={showOptions}
                direction="down"
                container={transitionContainer.current}
              >
                <Typography
                  component="legend"
                  fontWeight="medium"
                >
                  {isResults ? "Calculated With Options" : "Route Options"}
                </Typography>
              </Slide>

              <div>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => setShowOptions(value => !value)}
                >
                  {showOptions ? "Hide" : "Options..."}
                </Button>
              </div>
            </>
          )
        }
      </Stack>

      <Collapse in={showOptions && !isLoading} unmountOnExit>
        <Box marginTop={3} display="grid" gridTemplateColumns="minmax(0, 1fr)" gap={2}>
          {
            isResults ? (
              <div>
                <Typography variant="subtitle2">
                  Origin
                </Typography>
                <Typography variant="body1">
                  {_.get(resultValues, `stops.${resultValues.origin}.address`)}
                </Typography>
              </div>
            ) : (
              <Select
                fullWidth
                name="origin"
                label="Origin"
                onChange={_.partial(updateQueryValue, "origin")}
              >
                {
                  stops
                    .filter(item => !_.isEmpty(item.address))
                    .map((item, i) => (
                      <Select.Option key={i} value={+i} label={item.address} />
                    ))
                }
              </Select>
            )
          }

          {
            isResults ? (
              <div>
                <Typography variant="subtitle2">
                  Destination
                </Typography>
                <Typography variant="body1">
                  {_.get(resultValues, `stops.${resultValues.destination}.address`)}
                </Typography>
              </div>
            ) : (
              <Select
                fullWidth
                name="destination"
                label="Destination"
                onChange={_.partial(updateQueryValue, "destination")}
              >
                {
                  stops
                    .filter(item => !_.isEmpty(item.address))
                    .map((item, i) => (
                      <Select.Option key={i} value={i} label={item.address} />
                    ))
                }
              </Select>
            )
          }
        </Box>
      </Collapse>
    </Stack>
  )
}
