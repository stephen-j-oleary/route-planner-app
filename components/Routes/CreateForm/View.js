import { isEmpty } from "lodash";
import { FormProvider } from "react-hook-form";

import { Alert, Box, Divider } from "@mui/material";

import StopsList from "./Stops/List";
import CollapseFieldset from "@/components/CollapseFieldset";
import CreateRouteFormSelectStopInput from "@/components/Routes/CreateForm/inputs/SelectStopInput";
import CreateRouteFormStopTimeInput from "@/components/Routes/CreateForm/inputs/StopTimeInput";
import CreateRouteFormSubmit from "@/components/Routes/CreateForm/inputs/Submit";
import { getAllErrorsMessage } from "@/shared/utils/rhfHelpers";


export default function CreateRouteFormView({
  error,
  form,
  getFormProps,
  getInputProps,
  getSubmitProps,
  updateQueryParam,
  ...props
}) {
  const { getValues, formState } = form;

  const currentStops = (getValues("stops") || []).map(({ value }, i) => (isEmpty(value) ? { value: `Stop ${i + 1}` } : { value }));


  return (
    <FormProvider {...form}>
      <Box
        component="form"
        {...getFormProps()}
        {...props}
      >
        <StopsList
          form={form}
          getInputProps={getInputProps}
          updateQueryParam={updateQueryParam}
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
            <CreateRouteFormSelectStopInput
              {...getInputProps("origin")}
              label="Origin"
              stops={currentStops}
            />

            <CreateRouteFormSelectStopInput
              {...getInputProps("destination")}
              label="Destination"
              stops={currentStops}
            />

            <CreateRouteFormStopTimeInput
              {...getInputProps("stopTime")}
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