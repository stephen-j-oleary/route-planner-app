import { yupResolver } from "@hookform/resolvers/yup";
import { isEmpty } from "lodash";
import { useRouter } from "next/router.js";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import CreateRouteFormView from "@/components/Routes/CreateForm/View";
import useRouterQuery from "@/shared/hooks/useRouterQuery.js";
import Stop from "@/shared/models/Stop";


const RouteFormSchema = yup.object().shape({
  stops: yup.array()
    .min(Stop.MINIMUM_STOPS, "Plase add at least 3 stops")
    .required("Plase add at least 3 stops")
    .of(
      yup.object()
        .shape({
          value: yup.string().required("Please enter an address"),
          modifiers: yup.mixed(),
        })
    ),
  origin: yup.number()
    .min(0, "This stop could not be found")
    .required("Please select an origin"),
  destination: yup.number()
    .min(0, "This stop could not be found")
    .required("Please select a destination"),
  stopTime: yup.number()
    .min(0, "Please enter a value that is above zero")
    .required("Please enter a stop time"),
});


export default function CreateRouteFormLogic({ defaultValues, onSubmit, ...props }) {
  const router = useRouter();
  const query = useRouterQuery();
  const [error, setError] = useState(null);

  const form = useForm({
    mode: "onSubmit",
    shouldFocusError: false,
    defaultValues,
    resolver: yupResolver(RouteFormSchema),
  });

  const handleSubmit = async data => {
    setError(null);
    try {
      const { _id } = await onSubmit(data);

      router.push({
        pathname: "/routes/[_id]",
        query: { _id: _id.toString() }
      });
    }
    catch (err) {
      const { message } = err;
      console.error(err);
      setError(message);
    }
  };


  const updateQueryParam = name => {
    const _name = isStops(name) ? "stops" : name;
    let value = form.getValues(_name);
    if (isStops(name)) {
      value = value
        .map(v => v?.value)
        .filter(v => !isEmpty(v))
    }
    query.set(_name, value);
  };

  const getFormProps = () => ({
    onSubmit: form.handleSubmit(handleSubmit),
  });

  const getInputProps = name => ({
    name,
    form,
    onBlur: () => {
      updateQueryParam(name);
    },
    onKeyDown: e => {
      if (isStops(name) && e.key === "Enter") {
        e.preventDefault();
        updateQueryParam(name);
      }
    },
  });

  const getSubmitProps = () => ({
    loading: form.formState.isSubmitting,
    disabled: form.formState.isLoading,
  });


  return (
    <CreateRouteFormView
      error={error}
      form={form}
      updateQueryParam={updateQueryParam}
      getFormProps={getFormProps}
      getInputProps={getInputProps}
      getSubmitProps={getSubmitProps}
      {...props}
    />
  );
}

function isStops(name) {
  return name.startsWith("stops");
}