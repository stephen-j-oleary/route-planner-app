import { useState } from "react";

import AddressInput from "@/components/AddressInput";


export default function CreateRouteFormStopAddressInput({
  name,
  form,
  updateQueryParam,
  ...props
}) {
  const [label, setLabel] = useState(null);

  const { setValue } = form;

  const handleSelect = ({ primary, value }) => {
    setValue(`${name}.value`, value);
    setLabel(primary !== value ? primary : null);
    updateQueryParam("stops");
  };

  return (
    <AddressInput
      textFieldProps={{ label }}
      name={`${name}.value`}
      form={form}
      onSelect={handleSelect}
      disabled={form.formState.isLoading}
      {...props}
    />
  );
}