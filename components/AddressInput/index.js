
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
import { selectHoveredMarkup, selectSelectedMarkup, setHoveredMarkup, setMarkup } from "../../redux/slices/map.js";
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
const SUGGESTIONS_LIMIT = 5;

const AddressSuggestions = forwardRef(function AddressSuggestions({
  show,
  query,
  handleSelect,
  ...props
}, ref) {
  const dispatch = useDispatch();
  const position = usePosition();

  const [cards, setCards] = useState([]);
  const [itemsLoading, setItemsLoading] = useState(false);
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
          markup: {
            type: "marker",
            id,
            icon: {
              ...ICON_CONSTANTS["current-location"],
              fillColor: "rgb(120 160 255)",
            },
            title: "Current Location",
            position: position.value,
          },
          item: {
            id,
            icon: <FaLocationArrow />,
            title: "Current Location",
            data: position.value
          }
        }]);
      }

      if (position.loading) {
        setCards([{
          id,
          item: {
            id,
            icon: <FaLocationArrow />,
            title: "Locating...",
          }
        }]);
      }
    },
    [show, position.loading, position.value, dispatch]
  );

  const debouncedUpdate = useDebounce(async q => {
    if (!q) return setItems([]);
    setItemsLoading(true);

    const res = await axios.request({
      method: "get",
      url: "/api/search",
      params: { q }
    });

    const results = res.data.results.map((item, i) => ({
      id: item.id,
      markup: {
        type: "marker",
        id: item.id,
        title: item.address.formatted_address,
        label: (i + 1).toString(),
        position: _.pick(item, "lat", "lng"),
      },
      item: {
        id: item.id,
        title: item.address.formatted_address,
        subtitle: `${item.lat}, ${item.lng}`,
        label: (i + 1).toString(),
        data: item
      }
    }));

    setItemsLoading(false);
    setItems(results.slice(0, SUGGESTIONS_LIMIT));
  }, 1000);

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
      dispatch(setMarkup(_.reject([
        ...cards.map(v => v.markup),
        ...items.map(v => v.markup)
      ], _.isUndefined)));
    },
    [show, cards, items, dispatch]
  );

  // Markup selected
  useEffect(
    () => {
      if (selectedMarkup) handleSelect(selectedMarkup);
    },
    [selectedMarkup, handleSelect]
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
          cards.map(({ item }) => (
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
              {item.icon}
              {_.get(item, "title", item)}
            </Button>
          ))
        }
      </div>
      {
        itemsLoading ? (
          <div className={styles.item}>
            <p className={styles.stateItem}>Loading suggestions...</p>
          </div>
        ) : items.length ? (
          items.map(({ item }) => (
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
              <p className={styles.title}>{_.get(item, "title", item)}</p>
              {!_.isUndefined(item.subtitle) && <p className={styles.subtitle}>{item.subtitle}</p>}
            </div>
          ))
        ) : (
          <div className={styles.item}>
            <p className={styles.stateItem}>No results</p>
          </div>
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
    setShowSuggestions(false);
  };

  const { register, setValue, getValues } = useFormContext();
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
        query={getValues(`${name}.address`)}
        handleSelect={handleSelect}
      />
    </>
  );
})

export default AddressInput
