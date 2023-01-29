
import { get, partial, isEmpty } from "lodash";
import { useCallback, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { selectIsState, selectValues } from "../../../redux/slices/routeForm.js";
import { useFormContext } from "react-hook-form";
import useURL from "../../../shared/hooks/useURL.js";

import Button from "../../Button";
import Select from "../../Select";
import Input from "../../Input";
import { Box, Collapse, Skeleton, Slide, Stack, Tooltip, Typography } from "@mui/material";

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
                >
                  Options...
                </Button>
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
                  {get(resultValues, `stops.${resultValues.origin}.value`)}
                </Typography>
              </div>
            ) : (
              <Select
                fullWidth
                name="origin"
                label="Origin"
                onChange={partial(updateQueryValue, "origin")}
              >
                {
                  stops
                    .filter(item => !isEmpty(item.value))
                    .map((item, i) => (
                      <Select.Option key={i} value={+i} label={item.value} />
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
                  {get(resultValues, `stops.${resultValues.destination}.value`)}
                </Typography>
              </div>
            ) : (
              <Select
                fullWidth
                name="destination"
                label="Destination"
                onChange={partial(updateQueryValue, "destination")}
              >
                {
                  stops
                    .filter(item => !isEmpty(item.value))
                    .map((item, i) => (
                      <Select.Option key={i} value={i} label={item.value} />
                    ))
                }
              </Select>
            )
          }

          {
            isResults ? (
              <div>
                <Typography variant="subtitle2">
                  Stop Time
                </Typography>
                <Typography variant="body1">
                  {resultValues.stopTime} mins
                </Typography>
              </div>
            ) : (
              <Tooltip
                title="The number of minutes to add for each stop"
                enterDelay={500}
                placement="bottom-start"
              >
                <Input
                  fullWidth
                  name="stopTime"
                  type="number"
                  label="Stop Time"
                  onChange={partial(updateQueryValue, "stopTime")}
                  inputProps={{ min: 0 }}
                />
              </Tooltip>
            )
          }
        </Box>
      </Collapse>
    </Stack>
  )
}
