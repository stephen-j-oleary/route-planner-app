
import axios from "axios";
import _ from "lodash";
import { forwardRef, useCallback, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import mergeEvents from "../../shared/hooks/mergeEvents.js";
import useDebounce from "../../shared/hooks/useDebounce.js";
import sameWidthModifier from "../../shared/popperModifiers/sameWidth.js";

import Input from "../Input";
import withDropdown from "../withDropdown/index.js";

const offsetModifier = {
  name: "offset",
  enabled: true,
  options: {
    offset: [0, 4]
  }
};

const AddressInput = forwardRef(function AddressInput({ name, selection, setData, onChange, onFocus, ...props } = {}, ref) {
  const { register, setValue } = useFormContext();

  // Register additional fields that wont be rendered
  useEffect(() => {
    register(`${name}.id`);
    register(`${name}.coordinates`);
  }, [name, register]);

  const handleSelection = useCallback(
    () => {
      const { id, lat, lng, address } = selection?.data || {};

      if (!_.isUndefined(id)) setValue(`${name}.id`, id);
      if (!_.isUndefined(lat) && !_.isUndefined(lng)) setValue(`${name}.coordinates`, [lat, lng].join(","));
      if (!_.isUndefined(address?.formatted_address)) setValue(`${name}.address`, address.formatted_address);
    },
    [selection, name, setValue]
  );

  // Set field values when selected item changes (An address suggestion was clicked or the address input was changed)
  useEffect(
    () => {
      handleSelection();
    },
    [handleSelection]
  );

  const handleUpdate = useDebounce(async e => {
    const { value } = e.target;
    if (!value) return;

    const config = {
      method: "get",
      url: "/api/search",
      params: {
        q: value
      }
    };

    const res = await axios.request(config);

    const { results } = res.data;

    const suggestions = results.map(item => ({
      title: item.address.formatted_address,
      subtitle: `${item.lat}, ${item.lng}`,
      data: item
    }));

    setData(suggestions);
  }, 1000);

  const handleChange = e => {
    handleUpdate(e);
  };
  const handleFocus = e => {
    handleUpdate(e);
  };

  return (
    <Input
      ref={ref}
      name={`${name}.address`}
      type="search"
      placeholder="Enter an address"
      onChange={mergeEvents(onChange, handleChange)}
      onFocus={mergeEvents(onFocus, handleFocus)}
      {...props}
    />
  );
})

export default withDropdown(AddressInput, {
  modifiers: [offsetModifier, sameWidthModifier]
})
