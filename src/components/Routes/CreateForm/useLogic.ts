import "client-only";

import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { array, InferType, number, object, string, tuple } from "yup";

import { minimumStopCount } from "./constants";
import { CreateRouteFormContext } from "./Context";
import { HandleSubmitData } from "./useApi";


const RouteFormSchema = object({
  stops: array()
    .min(minimumStopCount, `Please add at least ${minimumStopCount} stops`)
    .required(`Please add at least ${minimumStopCount} stops`)
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

  const submitMutation = useMutation({
    mutationFn: async (data: HandleSubmitData) => {
      const routeId = await onSubmit(data);

      router.push(`/routes/${routeId}`);
    },
  });

  const getFormProps = () => ({
    onSubmit: form.handleSubmit(data => submitMutation.mutate(data)),
  });

  const getSubmitProps = () => ({
    loading: submitMutation.isPending,
    disabled: form.formState.isLoading,
  });


  return {
    error: submitMutation.error instanceof Error && submitMutation.error.message,
    form,
    getFormProps,
    getSubmitProps,
  };
}