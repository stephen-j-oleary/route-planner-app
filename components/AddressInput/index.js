
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

import Input from "../Input";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { FaLocationArrow } from "react-icons/fa";
import Button from "../Button/index.js";
import usePrevious from "../../shared/hooks/usePrevious.js";
import { ICON_CONSTANTS } from "../Google/Markup/index.js";
import useStops from "../../shared/hooks/useStops.js";
import Label from "../Label/index.js";

const offsetModifier = {
  name: "offset",
  enabled: true,
  options: {
    offset: [0, 4]
  }
};

const AddressSuggestions = forwardRef(function AddressSuggestions({
  targetValue,
  handleSelect,
  ...props
}, ref) {
  const dispatch = useDispatch();
  const position = usePosition();

  const [cards, setCards] = useState([]);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [items, setItems] = useState([]);

  const previousTargetValue = usePrevious(targetValue);
  const previousCards = usePrevious(cards);
  const previousItems = usePrevious(items);

  const selectedMarkup = useSelector(selectSelectedMarkup);
  const hoveredMarkup = useSelector(selectHoveredMarkup);

  useEffect(() => () => {
    dispatch(setMarkup([]));
  }, [dispatch]);

  // Add current location card
  useEffect(
    () => {
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
    [position.loading, position.value, dispatch]
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
    setItems(results);
  }, 1000);

  // Update suggestion items any time value changes
  useEffect(
    () => {
      if (targetValue === previousTargetValue) return;
      debouncedUpdate(targetValue);
    },
    [targetValue]
  );

  // Add map markup
  useEffect(
    () => {
      if (_.isEqual(cards, previousCards) && _.isEqual(items, previousItems)) return;
      dispatch(setMarkup(_.reject([
        ...cards.map(v => v.markup),
        ...items.map(v => v.markup)
      ], _.isUndefined)));
    },
    [cards, previousCards, items, previousItems, dispatch]
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
        styles.dropdown
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
            <p className={styles.stateItem}>Loading suddestions...</p>
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
  const { register, setValue, getValues } = useFormContext();
  const addressInputValue = getValues(`${name}.address`);
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
    <OverlayTrigger
      placement="bottom"
      delay={{ show: 0, hide: 1000 }}
      trigger="focus"
      popperConfig={{
        modifiers: [offsetModifier, sameWidthModifier]
      }}
      overlay={({ placement, arrowProps, show: _show, popper, ...props }) => (
        <AddressSuggestions
          {...props}
          targetValue={addressInputValue}
          handleSelect={handleSelect}
        />
      )}
    >
      <Input
        {...props}
        ref={ref}
        name={`${name}.address`}
        type="search"
        placeholder="Enter an address"
      />
    </OverlayTrigger>
  );
})

export default AddressInput
