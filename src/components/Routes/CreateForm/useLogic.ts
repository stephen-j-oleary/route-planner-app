import { yupResolver } from "@hookform/resolvers/yup";
import { isEmpty } from "lodash";
import { useRouter } from "next/router";
import React from "react";
import { FieldPath, useForm } from "react-hook-form";
import { useMutation } from "react-query";
import * as yup from "yup";

import { HandleSubmitData } from "./useApi";
import useRouterQuery from "@/hooks/useRouterQuery";


export const MINIMUM_STOP_COUNT = 3;

const RouteFormSchema = yup.object().shape({
  stops: yup.array()
    .min(MINIMUM_STOP_COUNT, "Plase add at least 3 stops")
    .required("Plase add at least 3 stops")
    .of(
      yup.object()
        .shape({
          fullText: yup.string().required("Please enter an address"),
          mainText: yup.string(),
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

export type CreateRouteFormFields = yup.InferType<typeof RouteFormSchema>;

export type UseCreateRouteFormLogicProps = {
  defaultValues: CreateRouteFormFields | (() => Promise<CreateRouteFormFields>),
  onSubmit: (data: HandleSubmitData) => Promise<{ _id: string }>,
}

export default function useCreateRouteFormLogic({
  defaultValues,
  onSubmit,
}: UseCreateRouteFormLogicProps) {
  const router = useRouter();
  const query = useRouterQuery();

  const form = useForm({
    mode: "onSubmit",
    shouldFocusError: false,
    defaultValues,
    resolver: yupResolver(RouteFormSchema),
  });

  const submitMutation = useMutation({
    mutationFn: async (data: HandleSubmitData) => {
      const { _id } = await onSubmit(data);

      router.push({
        pathname: "/routes/[_id]",
        query: { _id: _id.toString() }
      });
    },
  });


  const updateQueryParam = (name: FieldPath<CreateRouteFormFields>) => {
    const _name = name.startsWith("stops") ? "stops" : name;
    const value = (_name === "stops")
      ? (form.getValues(_name) || [])
          .map(v => v?.fullText)
          .filter(v => !isEmpty(v))
      : form.getValues(_name);
    query.set(_name, value);
  };

  const getFormProps = () => ({
    onSubmit: form.handleSubmit(data => submitMutation.mutate(data)),
  });

  const getInputProps = (name: FieldPath<CreateRouteFormFields>) => ({
    onBlur: () => updateQueryParam(name),
    onKeyDown: (e: React.KeyboardEvent) => {
      if (isStops(name) && e.key === "Enter") {
        e.preventDefault();
        updateQueryParam(name);
      }
    },
  });

  const getSubmitProps = () => ({
    loading: submitMutation.isLoading,
    disabled: form.formState.isLoading,
  });


  return {
    error: submitMutation.error instanceof Error && submitMutation.error.message,
    form,
    updateQueryParam,
    getFormProps,
    getInputProps,
    getSubmitProps,
  };
}

function isStops(name: string) {
  return name.startsWith("stops");
}