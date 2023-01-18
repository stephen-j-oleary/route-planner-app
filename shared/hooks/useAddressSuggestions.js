
import { LinearProgress, ListItem, ListItemButton, ListItemText, Stack } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { mergeProps } from "@react-aria/utils";
import axios from "axios";
import _ from "lodash";
import React, { useCallback, useEffect, useId, useState } from "react";
import { FaLocationArrow } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../components/Button";
import { ICON_CONSTANTS } from "../../components/Google/Markup";
import { selectSelectedMarkup, setHoveredMarkup, setSelectedMarkup } from "../../redux/slices/map";
import useDebounce from "./useDebounce";
import useMarkupLink from "./useMarkupLink";
import usePosition from "./usePosition";
import usePrevious from "./usePrevious";

const SEARCH_RADIUS = 100_000; // 100 km
const SUGGESTIONS_LIMIT = 5; // 5 items


export function AddressSuggestions({
  query,
  onSelect = _.noop,
  show,
}) {
  const theme = useTheme();
  const { quick, search } = useAddressSuggestions(query, { show, onSelect });

  return (
    <>
      {
        (quick.loading || search.loading) && (
          <ListItem
            disableGutters
            disablePadding
          >
            <ListItemText>
              <LinearProgress />
            </ListItemText>
          </ListItem>
        )
      }

      {
        (!quick.error && _.isArray(quick.data) && !_.isEmpty(quick.data)) && (
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
                quick.data.map((item, index) => (
                  <AddressSuggestion
                    key={item.id || index}
                    variant="card"
                    item={item}
                    onChange={onSelect}
                  />
                ))
              }
            </Stack>
          </ListItem>
        )
      }

      {
        (search.error) && (
          <ListItem>
            <ListItemText
              primary="Couldn't load suggestions"
              primaryTypographyProps={{
                sx: {
                  fontSize: ".9rem",
                  lineHeight: "1.1rem",
                  fontWeight: 500
                },
              }}
            />
          </ListItem>
        )
      }

      {
        _.isArray(search.data) && search.data.map((item, index) => (
          <AddressSuggestion
            key={item.id || index}
            variant="list"
            item={item}
            onChange={onSelect}
          />
        ))
      }
    </>
  )
}


export function AddressSuggestion({
  item,
  onChange = _.noop,
  variant = "list",
  ...props
}) {
  const theme = useTheme();
  const dispatch = useDispatch();

  const handlers = {
    onMouseOver: () => dispatch(setHoveredMarkup(item.id)),
    onMouseOut: () => dispatch(setHoveredMarkup(null)),
    onClick: () => onChange(item)
  };

  return (variant === "card") ? (
    <Button
      variant="outlined"
      sx={{
        flexDirection: "column",
        alignItems: "center",
        gap: "4px",
        padding: "4px 8px",
        fontSize: ".7rem",
        lineHeight: ".7rem",
        whiteSpace: "nowrap",
        flex: "0 0 auto"
      }}
      {...mergeProps(handlers, props)}
    >
      {React.isValidElement(item.cardIcon) && React.cloneElement(item.cardIcon, { fontSize: "1.2rem" })}
      {item.title}
    </Button>
  ) : (
    <ListItem
      disablePadding
      divider
    >
      <ListItemButton
        {...mergeProps(handlers, props)}
      >
        <ListItemText
          sx={{
            flex: "0 0 1.2rem",
            fontSize: ".9rem",
            fontWeight: 600
          }}
        >
          {item.label}
        </ListItemText>
        <ListItemText
          sx={{
            flex: "1 1 auto"
          }}
          primary={item.main_text || item.full_text}
          primaryTypographyProps={{
            sx: {
              fontSize: ".9rem",
              lineHeight: "1.1rem",
              fontWeight: 500,
              ...theme.typography.limitLines(2)
            }
          }}
          secondary={item.secondary_text || (item.position ? `${_.round(item.position.lat, 4)}, ${_.round(item.position.lng, 4)}` : "")}
          secondaryTypographyProps={{
            sx: {
              fontSize: ".7rem",
              lineHeight: ".9rem",
              fontWeight: 400,
              ...theme.typography.limitLines(1)
            }
          }}
        />
      </ListItemButton>
    </ListItem>
  );
}


export default function useAddressSuggestions(value, { show = false, onSelect }) {
  const groupId = useId();

  const showSuggestions = _.isObject(show) ? show.suggestions : show;
  const showMarkup = _.isObject(show) ? show.markup : show;

  const dispatch = useDispatch();
  const position = usePosition();
  const [previousValue, updatePreviousValue] = usePrevious();
  const selectedMarkup = useSelector(selectSelectedMarkup);

  const [quick, setQuick] = useState({
    loading: true,
    error: null,
    data: null
  });
  const [search, setSearch] = useState({
    loading: false,
    error: null,
    data: null
  });

  useMarkupLink(showMarkup ? (quick.data || []) : []);

  // Handle markup click
  useEffect(
    () => {
      if (!selectedMarkup) return;
      const selectedItem = quick.data.find(item => selectedMarkup === item.id);
      if (!selectedItem) return;
      onSelect(selectedItem);
      dispatch(setSelectedMarkup(null));
    },
    [selectedMarkup, onSelect, quick.data, dispatch]
  );

  // Quick suggestions current location
  useEffect(
    () => {
      if (!showSuggestions) return;

      const id = `${groupId}_current-location`;

      if (position.data) {
        setQuick({
          loading: false,
          error: null,
          data: [{
            id,
            title: "Current Location",
            type: "marker",
            cardIcon: <FaLocationArrow />,
            icon: {
              ...ICON_CONSTANTS["current-location"],
              fillColor: "rgb(120 160 255)",
            },
            position: position.data,
            data: position.data
          }]
        });
      }

      if (position.loading) {
        setQuick({
          loading: false,
          error: null,
          data: [{
            id,
            cardIcon: <FaLocationArrow />,
            title: "Locating..."
          }]
        });
      }
    },
    [groupId, showSuggestions, position.loading, position.data, dispatch]
  );

  // Search suggestions
  const freeSoloResults = useCallback(
    (results = []) => {
      const freeSoloValue = (value && !_.isEmpty(value))
        ? [{
          id: `${groupId}_freeSolo`,
          full_text: value
        }]
        : [];
      return [
        ...freeSoloValue,
        ...results
      ];
    },
    [groupId, value]
  );

  const debouncedUpdate = useDebounce(async (query, callback) => {
    if (!query || _.isEmpty(query)) return callback(null, []);

    try {
      const res = await axios.request({
        method: "get",
        url: "/api/autocomplete",
        params: {
          q: query,
          location: position.data
            ? `${position.data.lat},${position.data.lng}`
            : undefined,
          radius: position.data
            ? SEARCH_RADIUS
            : undefined,
          limit: SUGGESTIONS_LIMIT
        }
      });

      const results = res.data.results.map((item, i) => ({
        id: `${groupId}_${item.id}`,
        label: (i + 1).toString(),
        full_text: item.full_text,
        main_text: item.main_text,
        secondary_text: item.secondary_text,
        type: "marker",
        position: (item.lat && item.lng) ? _.pick(item, "lat", "lng") : undefined,
        data: item
      }));

      callback(null, results);
    }
    catch (err) {
      callback(err);
    }
  }, 1000, []);

  // Update suggestion items any time value changes
  useEffect(
    () => {
      let active = true;

      if (!showSuggestions) return;
      if (value === previousValue) return setSearch(v => ({ ...v, loading: false }));

      setSearch(v => ({ ...v, loading: true }));

      debouncedUpdate(
        value,
        (err, results) => {
          if (!active) return;
          if (err) return setSearch({
            loading: false,
            error: err.message,
            data: freeSoloResults([])
          });

          updatePreviousValue(value);
          setSearch({
            loading: false,
            error: null,
            data: freeSoloResults(results)
          });
        }
      );

      return () => active = false;
    },
    [showSuggestions, value, previousValue, updatePreviousValue, debouncedUpdate, freeSoloResults]
  );

  return { quick, search };
}
