
import styles from "./styles.module.scss";
import _ from "lodash";
import moment from "moment";
import { useFieldArray, useFormContext } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { selectIsState, selectSelectedStop, setSelectedStop, selectResults } from "../../../redux/slices/routeForm.js";
import { fromStopString } from "../../../shared/Stop.js";
import useStops from "../../../shared/hooks/useStops.js";

import { Fragment } from "react";
import Button from "../../Button";
import { FaTimes, FaPlus } from "react-icons/fa";
import Stop from "./Stop";
import Leg from "./Leg";
import LoadingPlaceholder from "../../LoadingPlaceholder";
import IconButton from "../../IconButton";
import { Box, List, ListItem, ListItemIcon, ListItemSecondaryAction, ListItemText, Skeleton, Stack, styled, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const MINIMUM_STOPS = 3;


const InputListItem = styled(props => <ListItem dense {...props} />, {
  shouldForwardProp: prop => (!["hover", "selected"].includes(prop))
})(({ theme, selected = false, hover = false }) => ({
  gap: theme.spacing(2),
  background: selected ? theme.palette.grey[200] : theme.palette.background.paper,
  ...(hover ? { "&:hover": { background: theme.palette.grey[100] } } : {}),
  "&& .MuiListItemText-root": { margin: 0 }
}))

const MarkerIcon = styled(ListItemIcon, {
  shouldForwardProp: prop => (!["size", "variant"].includes(prop))
})(({ theme, size = "1rem", variant }) => ({
  minWidth: 0,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 2,
  zIndex: 2,
  alignSelf: "center",
  background: (variant === "spacer") ? "none" : "inherit",
  color: theme.palette.text.secondary,
  height: (variant === "spacer") ? "auto" : `calc(${size} + 12px)`,
  width: size,
  padding: (variant === "space")
    ? 0
    : (variant === "circle")
    ? "7px 1px"
    : "6px 0",
  opacity: variant !== "spacer",
  "& > *": {
    height: "100%",
    width: "100%",
    color: theme.palette.text.secondary,
    fontSize: size,
    lineHeight: size,
    fontWeight: 900,
    textAlign: "center",
    flex: "0 0 auto",
    border: (variant === "circle") ? `2px solid ${theme.palette.text.secondary}` : "0",
    borderRadius: (variant === "circle") ? "50%" : "none"
  }
}))


export default function Stops(props) {
  const theme = useTheme();
  const markerSize = "1rem";

  const dispatch = useDispatch();
  const { formState: { errors }, getValues } = useFormContext();
  const isLoading = useSelector(state => selectIsState(state, "loading"));
  const isResults = useSelector(state => selectIsState(state, "results"));
  const selectedStop = useSelector(selectSelectedStop);
  const [, setStops] = useStops();
  const results = useSelector(selectResults);

  const fieldArrayHook = useFieldArray({
    name: "stops",
    rules: { minLength: MINIMUM_STOPS }
  });
  const { fields, update, append, remove } = fieldArrayHook;

  const updateStopParams = () => {
    setStops(getValues("stops"));
  };
  const handleRemoveStop = (index, _e) => {
    remove(index);
    updateStopParams();
    dispatch(setSelectedStop(-1));
  };
  const handleClearStop = (index, _e) => {
    update(index, fromStopString(""));
    updateStopParams();
  };
  const handleAddStop = () => {
    append(fromStopString(""));
    dispatch(setSelectedStop(getValues("stops").length - 1));
  };

  return (
    <Stack
      spacing={2}
      paddingY={2}
      {...props}
    >
      <Box
        sx={{ position: "relative" }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: `36px auto 36px calc(16px + (${markerSize} / 2) - 1px)`,
            width: "0px",
            border: `1px dashed ${theme.palette.text.secondary}`,
            zIndex: 1
          }}
        ></Box>

        <List disablePadding>
          <LoadingPlaceholder
            isLoading={isLoading}
            placeholder={CompPlaceholder}
          >
            {
              isResults
                ? results.stops.map((_, index) => (
                  <Fragment key={index}>
                    <InputListItem>
                      <MarkerIcon>
                        <div>{index + 1}</div>
                      </MarkerIcon>
                      <ListItemText>
                        <Stop stopIndex={index} />
                      </ListItemText>
                    </InputListItem>

                    {
                      (index < results.stops.length - 1) && (
                        <InputListItem>
                          <MarkerIcon variant="spacer"/>
                          <ListItemText>
                            <Leg legIndex={index} />
                          </ListItemText>
                        </InputListItem>
                      )
                    }
                  </Fragment>
                ))
                : fields.map((field, index) => (
                  <InputListItem
                    key={field.id}
                    selected={selectedStop === index}
                    hover
                  >
                    <MarkerIcon
                      size={markerSize}
                      variant="circle"
                    >
                      <div></div>
                    </MarkerIcon>
                    <ListItemText>
                      <Stop
                        name={`stops.${index}`}
                        stopIndex={index}
                        fullWidth
                      />
                    </ListItemText>
                    <ListItemSecondaryAction className={styles.actions}>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={e => {
                          const handler = (fields.length <= MINIMUM_STOPS) ? handleClearStop : handleRemoveStop;
                          handler(index, e);
                        }}
                        tooltip={{
                          placement: "bottom",
                          value: (fields.length <= MINIMUM_STOPS)
                            ? "Clear this stop"
                            : "Remove this stop"
                        }}
                      >
                        <FaTimes />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </InputListItem>
                ))
            }

            {
              !isResults && (
                <>
                  <InputListItem>
                    <MarkerIcon
                      size={markerSize}
                    >
                      <FaPlus />
                    </MarkerIcon>
                    <ListItemText>
                      <Button
                        fullWidth
                        size="small"
                        variant="outlined"
                        onClick={handleAddStop}
                      >
                        Add Stop
                      </Button>
                    </ListItemText>
                  </InputListItem>

                  {
                    errors.stops && (
                      <InputListItem>
                        <ListItemText color="error">
                          {errors.stops.message}
                        </ListItemText>
                      </InputListItem>
                    )
                  }
                </>
              )
            }
          </LoadingPlaceholder>
        </List>
      </Box>

      {
        isResults && (
          <Stack
            component="fieldset"
            justifyContent="flex-start"
            alignItems="stretch"
            spacing={.5}
            paddingX={3}
            sx={{
              "& > *": { margin: 0 }
            }}
          >
            <Typography
              component="legend"
              fontWeight="medium"
            >
              Summary
            </Typography>
            <Typography
              component="p"
              fontSize=".9rem"
              fontWeight="bold"
              sx={{
                "& > span": { paddingInline: 1 }
              }}
            >
              <span>
                {
                  (() => {
                    const duration = moment.duration(results.duration, "seconds");
                    const days = duration.days();
                    const hours = duration.hours();
                    const minutes = duration.minutes();

                    return [
                      days ? `${days} days` : undefined,
                      hours ? `${hours} hours` : undefined,
                      minutes ? `${minutes} mins` : undefined
                    ].join(" ")
                  })()
                }
              </span>
              <span>
                ({_.round(results.distance / 1000, 1)} kms)
              </span>
            </Typography>
          </Stack>
        )
      }
    </Stack>
  );
}

const CompPlaceholder = () => (
  <>
    {
      new Array(MINIMUM_STOPS).fill(0).map((_, index) => (
        <InputListItem key={index}>
          <MarkerIcon variant="circle">
            <div></div>
          </MarkerIcon>
          <ListItemText>
            <Stop fullWidth />
          </ListItemText>
        </InputListItem>
      ))
    }

    <InputListItem>
      <MarkerIcon>
        <FaPlus />
      </MarkerIcon>
      <ListItemText>
        <Skeleton
          variant="rounded"
          width="100%"
        >
          <Button
            fullWidth
            size="small"
            variant="outlined"
            children="Add Stop"
          />
        </Skeleton>
      </ListItemText>
    </InputListItem>
  </>
)
