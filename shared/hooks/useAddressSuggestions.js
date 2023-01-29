
import { LoadingButton } from "@mui/lab";
import { List, ListItem, ListItemButton, ListItemText, Skeleton, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import axios from "axios";
import _ from "lodash";
import React, { useCallback, useEffect, useId, useState } from "react";
import { FaLocationArrow } from "react-icons/fa";
import useDebounce from "./useDebounce";
import usePosition from "./usePosition";
import usePrevious from "./usePrevious";

const SEARCH_RADIUS = 100_000; // 100 km
const SUGGESTIONS_LIMIT = 5; // 5 items


export function AddressSuggestions({
  id,
  slotProps = {},
  query,
  onSelect = _.noop,
  show,
}) {
  const internalId = useId();
  const theme = useTheme();
  const {
    quickSuggestions,
    suggestions,
    getSuggestionProps,
  } = useAddressSuggestions({
    id: id || internalId,
    query,
    show,
    onSelect
  });

  return (
    <List disablePadding>
      {
        (!_.isEmpty(quickSuggestions)) && (
          <ListItem
            divider
            disableGutters
            disablePadding
          >
            <Stack
              direction="row"
              justifyContent="flex-start"
              alignItems="stretch"
              spacing={1}
              padding={1}
              overflow="scroll hidden"
              sx={theme.hideScrollbar}
            >
              {
                quickSuggestions.map((suggestion, index) => (
                  <QuickSuggestion
                    key={suggestion.id || index}
                    {...getSuggestionProps({ suggestion })}
                    {...slotProps.quickSuggestion}
                  />
                ))
              }
            </Stack>
          </ListItem>
        )
      }

      {
        suggestions.map((suggestion, index) => (
          <Suggestion
            key={suggestion.id || index}
            {...getSuggestionProps({ suggestion })}
            {...slotProps.suggestion}
          />
        ))
      }
    </List>
  );
}


function QuickSuggestion({
  primary,
  primaryTypographyProps,
  secondary,
  secondaryTypographyProps,
  variant = "outlined",
  sx = {
    gap: "4px",
    padding: "4px 8px",
    flex: "1 1 50%",
    minWidth: "25%",
    maxWidth: "75%",
  },
  loadingPosition = "start",
  ...props
}) {
  return (
    <LoadingButton
      variant={variant}
      sx={sx}
      loadingPosition={loadingPosition}
      {...props}
    >
      <Typography
        component="span"
        textAlign="left"
        sx={{
          fontSize: ".8rem",
          lineHeight: ".9rem",
          fontWeight: 500,
        }}
        {...primaryTypographyProps}
      >
        {primary}
      </Typography>
      <Typography
        sx={{
          fontSize: ".6rem",
          lineHeight: ".5rem"
        }}
        {...secondaryTypographyProps}
      >
        {secondary}
      </Typography>
    </LoadingButton>
  );
}


function Suggestion({
  primary,
  primaryTypographyProps,
  secondary,
  secondaryTypographyProps,
  ...props
}) {
  const theme = useTheme();

  return (
    <ListItem
      disablePadding
      divider
    >
      <ListItemButton {...props}>
        <ListItemText
          primary={primary}
          primaryTypographyProps={_.defaults(
            primaryTypographyProps,
            {
              sx: {
                fontSize: ".9rem",
                lineHeight: "1.1rem",
                fontWeight: 500,
                ...theme.typography.limitLines(2)
              }
            }
          )}
          secondary={secondary}
          secondaryTypographyProps={_.defaults(
            secondaryTypographyProps,
            {
              sx: {
                fontSize: ".7rem",
                lineHeight: ".9rem",
                fontWeight: 400,
                ...theme.typography.limitLines(1)
              }
            }
          )}
        />
      </ListItemButton>
    </ListItem>
  );
}


export default function useAddressSuggestions({
  id,
  query,
  onSelect,
  show = false
}) {
  const [previousQuery, updatePreviousQuery] = usePrevious();
  const { permissionStatus, requestLocation } = usePosition();

  const [quickSuggestions, setQuickSuggestions] = useState([]);
  const currentLocationSuggestion = useCallback(
    () => ({
      id: `${id}_current-location`,
      startIcon: <FaLocationArrow size=".9rem" />,
      primary: "Current Location",
      value: async () => {
        const location = await requestLocation();
        return location ? `${location.lat},${location.lng}` : null;
      },
    }),
    [id, requestLocation]
  )
  useEffect(
    () => {
      if (!show) return;

      setQuickSuggestions([
        currentLocationSuggestion()
      ].filter(v => !_.isNil(v)));
    },
    [show, currentLocationSuggestion]
  )

  const [autocompleteState, setAutocompleteState] = useState({
    loading: false,
    data: []
  });
  const [suggestions, setSuggestions] = useState([]);
  const freeSoloSuggestion = useCallback(
    () => ((query && !_.isEmpty(query)) ? {
      id: `${id}_free-solo`,
      primary: query,
      value: query,
    } : null),
    [id, query]
  )
  const addressSuggestions = useCallback(
    () => ((!autocompleteState.loading)
      ? autocompleteState.data
      : [{ primary: <Skeleton variant="text" />, placeholder: true }]
    ),
    [autocompleteState]
  )
  useEffect(
    () => {
      if (!show) return;

      setSuggestions([
        freeSoloSuggestion(),
        ...addressSuggestions()
      ].filter(v => !_.isNil(v)));
    },
    [show, freeSoloSuggestion, addressSuggestions]
  )

  const debouncedAutocomplete = useDebounce(async (query, successCallback, errorCallback) => {
    if (!query || _.isEmpty(query)) return successCallback([]);

    try {
      const location = (permissionStatus !== "prompt") && await requestLocation().catch(console.error);

      const res = await axios.request({
        method: "get",
        url: "/api/autocomplete",
        params: {
          q: query,
          location: location
            ? `${location.lat},${location.lng}`
            : undefined,
          radius: location
            ? SEARCH_RADIUS
            : undefined,
          limit: SUGGESTIONS_LIMIT
        }
      });

      const results = res.data.results.map(item => ({
        id: `${id}_${item.id}`,
        primary: item.main_text,
        secondary: item.secondary_text,
        value: item.full_text,
      }));

      successCallback(results);
    }
    catch (err) {
      errorCallback(err);
    }
  }, 1000, []);

  // Update suggestion items any time value changes
  useEffect(
    () => {
      let active = true;

      if (_.isEmpty(query)) return setAutocompleteState({ data: [], loading: false });
      if (!show || query === previousQuery) return setAutocompleteState(v => ({ ...v, loading: false }));
      setAutocompleteState(v => ({ ...v, loading: true }));

      debouncedAutocomplete(
        query,
        data => {
          if (!active) return;
          updatePreviousQuery(query);
          setAutocompleteState({ data, loading: false });
        },
        () => {
          setAutocompleteState(v => ({ ...v, loading: false }));
        }
      );

      return () => active = false;
    },
    [show, query, previousQuery, updatePreviousQuery, debouncedAutocomplete]
  );

  const getSuggestionProps = ({ suggestion: { placeholder, ...suggestion } }) => ({
    ...suggestion,
    onClick: () => !placeholder && onSelect(suggestion),
    style: placeholder ? { backgroundColor: "transparent", cursor: "default" } : {}
  });

  return {
    quickSuggestions,
    suggestions,
    getSuggestionProps
  };
}
