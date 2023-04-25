import { Alert, Divider, Stack, Typography } from "@mui/material";

import SubscriptionFormConfirmationPreview from "./inputs/ConfirmationPreview";
import SubscriptionFormGroupInput from "./inputs/GroupInput";
import SubscriptionFormPriceInput from "./inputs/PriceInput";
import SubscriptionFormProductInput from "./inputs/ProductInput";
import SubscriptionFormSubmit from "./inputs/Submit";
import { FIELD_NAMES } from "./Logic";
import ViewError from "@/components/ViewError";


export default function SubscriptionFormView({
  isError,
  error,
  form,
  hasCustomerSubscriptions,
  getFormProps,
  getInputProps,
  getSubmitProps,
  getPreviewProps,
}) {
  const selectedGroupId = form.watch(FIELD_NAMES.group);
  const selectedProductId = form.watch(FIELD_NAMES.product);


  if (isError) {
    return (
      <ViewError
        primary="An error occurred"
        secondary="Please try again"
      />
    );
  }

  return (
    <Stack
      component="form"
      {...getFormProps()}
      spacing={4}
    >
      <Typography
        component="h2"
        variant="h5"
      >
        Choose a plan
      </Typography>

      <SubscriptionFormGroupInput
        {...getInputProps(FIELD_NAMES.group)}
      />

      {
        selectedGroupId && (
          <SubscriptionFormProductInput
            {...getInputProps(FIELD_NAMES.product)}
          />
        )
      }

      {
        selectedProductId && (
          <>
            <Typography
              component="h2"
              variant="h5"
            >
              Choose a payment option
            </Typography>

            <SubscriptionFormPriceInput
              {...getInputProps(FIELD_NAMES.price)}
            />
          </>
        )
      }

      <Divider sx={{ borderBottomWidth: 2, borderColor: "grey.300" }} />

      {
        error && (
          <Alert severity="error">
            {error.message || "An error occurred. Please try again"}
          </Alert>
        )
      }

      {
        hasCustomerSubscriptions
          ? (
            <SubscriptionFormConfirmationPreview
              {...getPreviewProps()}
              renderTriggerButton={triggerProps => (
                <SubscriptionFormSubmit
                  {...getSubmitProps()}
                  {...triggerProps}
                />
              )}
            />
          )
          : (
            <SubscriptionFormSubmit
              {...getSubmitProps()}
            />
          )
      }
    </Stack>
  );
}