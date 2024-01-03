import { Controller, FormProvider } from "react-hook-form";

import { Alert, Box, BoxProps, Divider } from "@mui/material";

import StopsList from "./Stops/List";
import useCreateRouteFormApi from "./useApi";
import useCreateRouteFormLogic from "./useLogic";
import CollapseFieldset from "@/components/CollapseFieldset";
import CreateRouteFormSelectStopInput from "@/components/Routes/CreateForm/inputs/SelectStopInput";
import CreateRouteFormStopTimeInput from "@/components/Routes/CreateForm/inputs/StopTimeInput";
import CreateRouteFormSubmit from "@/components/Routes/CreateForm/inputs/Submit";
import { getAllErrorsMessage } from "@/utils/rhfHelpers";


export default function CreateRouteFormView(props: BoxProps) {
  const {
    defaultValues,
    onSubmit,
  } = useCreateRouteFormApi();
  const {
    error,
    form,
    getFormProps,
    getInputProps,
    getSubmitProps,
    updateQueryParam,
  } = useCreateRouteFormLogic({ defaultValues, onSubmit });
  const { getValues, formState } = form;

  const watchStops = (getValues("stops") || [])
    .map(({ fullText, ...stop }, i) => ({ fullText: fullText || `Stop ${i + 1}`, ...stop }));


  return (
    <FormProvider {...form}>
      <Box
        component="form"
        {...getFormProps()}
        {...props}
      >
        <StopsList
          control={form.control}
          setFocus={form.setFocus}
          watchStops={form.watch("stops")}
          watchOrigin={form.watch("origin")}
          watchDestination={form.watch("destination")}
          getInputProps={getInputProps}
          updateQueryParam={updateQueryParam}
          disabled={form.formState.isLoading}
        />

        <Divider
          sx={{
            marginY: 2,
            borderBottomWidth: 2,
            borderColor: "grey.300",
          }}
        />

        <CollapseFieldset
          primary="Route Options"
          defaultShow
        >
          <Box
            marginY={3}
            display="grid"
            gridTemplateColumns="minmax(0, 1fr)"
            gap={2}
          >
            <Controller
              name="origin"
              control={form.control}
              render={({ field, fieldState }) => (
                <CreateRouteFormSelectStopInput
                  {...getInputProps("origin")}
                  label="Origin"
                  watchStops={watchStops}
                  fieldState={fieldState}
                  {...field}
                />
              )}
            />

            <Controller
              name="destination"
              control={form.control}
              render={({ field, fieldState }) => (
                <CreateRouteFormSelectStopInput
                  {...getInputProps("destination")}
                  label="Destination"
                  watchStops={watchStops}
                  fieldState={fieldState}
                  {...field}
                />
              )}
            />

            <Controller
              name="stopTime"
              control={form.control}
              render={({ field, fieldState }) => (
                <CreateRouteFormStopTimeInput
                  {...getInputProps("stopTime")}
                  fieldState={fieldState}
                  {...field}
                />
              )}
            />
          </Box>
        </CollapseFieldset>

        <Box marginTop={3}>
          {
            (Object.keys(formState.errors).length > 0 || error) && (
              <Alert
                severity="error"
                sx={{
                  marginBottom: 2,
                  "& > :first-letter": { textTransform: "uppercase" },
                }}
              >
                {
                  Object.keys(formState.errors).length > 0
                    ? getAllErrorsMessage(formState.errors)
                    : error || "An error occurred"
                }
              </Alert>
            )
          }

          <CreateRouteFormSubmit
            {...getSubmitProps()}
          />
        </Box>
      </Box> {/* form */}
    </FormProvider>
  );
}