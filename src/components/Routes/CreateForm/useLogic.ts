import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/router";
import React from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { array, InferType, number, object, string, tuple } from "yup";

import { CreateRouteFormContext } from "./Context";
import { HandleSubmitData } from "./useApi";
import useRouterQuery from "@/hooks/useRouterQuery";


export const MINIMUM_STOP_COUNT = 3;

const RouteFormSchema = object({
  stops: array()
    .min(MINIMUM_STOP_COUNT, "Plase add at least 3 stops")
    .required("Plase add at least 3 stops")
    .of(
      object({
        fullText: string().required("Please enter an address"),
        mainText: string().optional(),
        coordinates: tuple([number().required(), number().required()])
          .optional()
          .default(undefined),
        duration: number().optional(),
      })
    ),
  origin: number()
    .required("Please select an origin")
    .min(0, "This stop could not be found")
    .test(
      "max",
      "This stop could not be found",
      (value, ctx) => value < ctx.parent.stops.length,
    ),
  destination: number()
    .required("Please select a destination")
    .min(0, "This stop could not be found")
    .test(
      "max",
      "This stop could not be found",
      (value, ctx) => value < ctx.parent.stops.length,
    ),
  stopTime: number()
    .required("Please enter a stop time")
    .min(0, "Please enter a value that is above zero")
    .max(60, "The maximum value is 60 minutes"),
});

export type CreateRouteFormFields = InferType<typeof RouteFormSchema>;

export type UseCreateRouteFormLogicProps = {
  onSubmit: (data: HandleSubmitData) => Promise<string>,
}

export default function useCreateRouteFormLogic({
  onSubmit,
}: UseCreateRouteFormLogicProps) {
  const {
    defaultValues,
    setForm,
  } = React.useContext(CreateRouteFormContext);

  const router = useRouter();
  const query = useRouterQuery();

  const form = useForm({
    mode: "all",
    shouldFocusError: false,
    defaultValues,
    resolver: yupResolver(RouteFormSchema),
  });

  // Add the form to the context
  React.useEffect(
    () => setForm?.(form),
    [setForm, form]
  );

  React.useEffect(
    function syncQueryParams() {
      const { unsubscribe } = form.watch(data => {
        query.set("origin", data.origin || undefined);
        query.set("destination", data.destination || undefined);
        query.set("stopTime", data.stopTime || undefined);
      });
      return () => unsubscribe();
    },
    [form, query]
  );

  const submitMutation = useMutation({
    mutationFn: async (data: HandleSubmitData) => {
      const routeId = await onSubmit(data);

      router.push({
        pathname: "/routes/[routeId]",
        query: { routeId }
      });
    },
  });

  const getFormProps = () => ({
    onSubmit: form.handleSubmit(data => submitMutation.mutate(data)),
  });

  const getSubmitProps = () => ({
    loading: submitMutation.isLoading,
    disabled: form.formState.isLoading,
  });


  return {
    error: submitMutation.error instanceof Error && submitMutation.error.message,
    form,
    getFormProps,
    getSubmitProps,
  };
}