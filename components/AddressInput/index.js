
import classNames from "classnames";
import styles from "./styles.module.scss";
import axios from "axios";
import _ from "lodash";
import { forwardRef, useCallback, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import usePosition from "../../shared/hooks/usePosition.js";
import useDebounce from "../../shared/hooks/useDebounce.js";
import sameWidthModifier from "../../shared/popperModifiers/sameWidth.js";
import { selectHoveredMarkup, selectSelectedMarkup, setHoveredMarkup, setSelectedMarkup, setMarkup } from "../../redux/slices/map.js";
import usePrevious from "../../shared/hooks/usePrevious.js";
import useStops from "../../shared/hooks/useStops.js";
import { usePopper } from "react-popper";
import { ICON_CONSTANTS } from "../Google/Markup/index.js";

import Input from "../Input";
import { FaLocationArrow } from "react-icons/fa";
import Button from "../Button/index.js";
import Label from "../Label/index.js";

const offsetModifier = {
  name: "offset",
  enabled: true,
  options: {
    offset: [0, 4]
  }
};
const SEARCH_RADIUS = 100_000; // 100 km
const SUGGESTIONS_LIMIT = 5; // 5 items

const AddressSuggestions = forwardRef(function AddressSuggestions({
  show,
  query,
  handleSelect,
  ...props
}, ref) {
  const dispatch = useDispatch();
  const position = usePosition();

  const [cards, setCards] = useState([]);
  const [itemsState, setItemsState] = useState("none");
  const [items, setItems] = useState([]);

  const [previousQuery, updatePreviousQuery] = usePrevious();

  const selectedMarkup = useSelector(selectSelectedMarkup);
  const hoveredMarkup = useSelector(selectHoveredMarkup);

  // Remove markup when hiding
  useEffect(
    () => {
      if (!show) dispatch(setMarkup([]));
    },
    [show, dispatch]
  );

  // Add current location card
  useEffect(
    () => {
      if (!show) return;

      const id = "current-location";

      if (position.value) {
        setCards([{
          id,
          title: "Current Location",
          type: "marker",
          cardIcon: <FaLocationArrow />,
          icon: {
            ...ICON_CONSTANTS["current-location"],
            fillColor: "rgb(120 160 255)",
          },
          position: position.value,
          data: position.value
        }]);
      }

      if (position.loading) {
        setCards([{
          id,
          cardIcon: <FaLocationArrow />,
          title: "Locating..."
        }]);
      }
    },
    [show, position.loading, position.value, dispatch]
  );

  const debouncedUpdate = useDebounce(async q => {
    setItemsState("loading");

    if (!q || _.isEmpty(q)) {
      setItems([]);
      setItemsState("none");
      return;
    }

    try {
      const res = await axios.request({
        method: "get",
        url: "/api/search",
        params: {
          q,
          location: position.value
            ? `${position.value.lat},${position.value.lng}`
            : undefined,
          radius: position.value
            ? SEARCH_RADIUS
            : undefined,
          limit: SUGGESTIONS_LIMIT
        }
      });

      const results = res.data.results.map((item, i) => ({
        id: item.id,
        label: (i + 1).toString(),
        title: item.address.formatted_address,
        subtitle: `${_.round(item.lat, 4)}, ${_.round(item.lng, 4)}`,
        type: "marker",
        position: _.pick(item, "lat", "lng"),
        data: item
      }));

      setItems(results);
      setItemsState(results.length ? "results" : "none");
    }
    catch (err) {
      console.error(err);
      setItemsState("error");
    }
  }, 1000, []);

  // Update suggestion items any time value changes
  useEffect(
    () => {
      if (!show || query === previousQuery) return;
      updatePreviousQuery(query);
      debouncedUpdate(query);
    },
    [show, query, previousQuery, updatePreviousQuery, debouncedUpdate]
  );

  // Add map markup
  useEffect(
    () => {
      if (!show) return;
      dispatch(setMarkup(
        _.chain([...cards, ...items])
          .map(v => _.pick(v, ["id", "icon", "label", "title", "type", "position"]))
          .reject(_.isUndefined)
          .reject(v => !v.type)
          .value()
      ));
    },
    [show, cards, items, dispatch]
  );

  // Markup selected
  useEffect(
    () => {
      if (!selectedMarkup) return;
      const selectedItem = [...cards, ...items].find(item => selectedMarkup === item.id);
      if (!selectedItem) return;
      handleSelect(selectedItem);
      dispatch(setSelectedMarkup(null));
    },
    [selectedMarkup, handleSelect, cards, items, dispatch]
  );

  return (
    <div
      {...props}
      ref={ref}
      className={classNames(
        props.className,
        styles.dropdown,
        { [styles.show]: show }
      )}
    >
      <div className={styles.cards}>
        {
          cards.map(item => (
            <Button
              variant="ghost"
              key={item.id}
              className={classNames(
                styles.card,
                {
                  active: (selectedMarkup === item.id),
                  hover: (hoveredMarkup === item.id)
                }
              )}
              onClick={() => handleSelect(item)}
              onMouseOver={() => dispatch(setHoveredMarkup(item.id))}
              onMouseOut={() => dispatch(setHoveredMarkup(null))}
              data-clickable={true}
            >
              {item.cardIcon}
              {item.title}
            </Button>
          ))
        }
      </div>
      {
        (itemsState === "loading") && (
          <div className={styles.item}>
            <p className={styles.stateItem}>Loading suggestions...</p>
          </div>
        )
      }
      {
        (itemsState === "error") && (
          <div className={styles.item}>
            <p className={styles.stateItem}>Couldn't load suggestions</p>
          </div>
        )
      }
      {
        (itemsState === "none") && (
          <div className={styles.item}>
            <p className={styles.stateItem}>No results</p>
          </div>
        )
      }
      {
        (itemsState === "results" || items.length > 0) && (
          items.map(item => (
            <div
              key={item.id}
              className={classNames(
                styles.item,
                {
                  active: (selectedMarkup === item.id),
                  hover: (hoveredMarkup === item.id)
                }
              )}
              onClick={() => handleSelect(item)}
              onMouseOver={() => dispatch(setHoveredMarkup(item.id))}
              onMouseOut={() => dispatch(setHoveredMarkup(null))}
              data-clickable={true}
            >
              <Label label={item.label} />
              <p className={styles.title}>{item.title}</p>
              {!_.isUndefined(item.subtitle) && <p className={styles.subtitle}>{item.subtitle}</p>}
            </div>
          ))
        )
      }
    </div>
  )
})

const AddressInput = forwardRef(function AddressInput({
  name,
  ...props
}, ref) {
  // Popper
  const [refEl, setRefEl] = useState(null);
  const [popEl, setPopEl] = useState(null);
  const { styles, attributes } = usePopper(refEl, popEl, {
    modifiers: [offsetModifier, sameWidthModifier]
  });

  // Dropdown
  const [showSuggestions, setShowSuggestions] = useState(false);
  const handleFocus = () => {
    setShowSuggestions(true);
  };
  const handleBlur = () => {
    _.delay(setShowSuggestions, 100, false);
  };

  const { register, setValue, getValues, watch } = useFormContext();
  const [, setStops] = useStops();

  // Register additional fields that wont be rendered
  useEffect(() => {
    register(`${name}.id`);
    register(`${name}.coordinates`);
  }, [name, register]);

  const updateStopParams = useCallback(
    () => setStops(getValues("stops")),
    [getValues, setStops]
  );

  const handleSelect = useCallback(
    item => {
      if (!item) return;

      const { data: { id, lat, lng, address } } = item;

      const coordinates = (!_.isUndefined(lat) && !_.isUndefined(lng)) ? [lat, lng].join(",") : null;
      const addressStr = (!_.isUndefined(address?.formatted_address)) ? address.formatted_address : null;

      if (!_.isUndefined(id)) setValue(`${name}.id`, id);
      if (coordinates) setValue(`${name}.coordinates`, [lat, lng].join(","));
      if (addressStr || coordinates) setValue(`${name}.address`, addressStr || coordinates);
      updateStopParams();
    },
    [name, setValue, updateStopParams]
  );

  return (
    <>
      <Input
        {...props}
        ref={node => {
          if (ref) ref.current = node;
          setRefEl(node);
        }}
        onFocus={handleFocus}
        onBlur={handleBlur}
        name={`${name}.address`}
        type="search"
        placeholder="Enter an address"
      />
      <AddressSuggestions
        {...attributes.popper}
        ref={setPopEl}
        style={styles.popper}
        show={showSuggestions}
        query={watch(`${name}.address`)}
        handleSelect={handleSelect}
      />
    </>
  );
})

export default AddressInput
