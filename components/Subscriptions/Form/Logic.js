import { yupResolver } from "@hookform/resolvers/yup";
import { groupBy } from "lodash";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import * as yup from "yup";

import SubscriptionFormView from "./View";

export const FIELD_NAMES = {
  group: "group",
  product: "product",
  price: "price",
};

const DEFAULT_VALUES = {
  [FIELD_NAMES.group]: "",
  [FIELD_NAMES.product]: "",
  [FIELD_NAMES.price]: "",
};

const SubscriptionFormSchema = yup.object().shape({
  [FIELD_NAMES.group]: yup.string().required(),
  [FIELD_NAMES.product]: yup.string().required(),
  [FIELD_NAMES.price]: yup.string().required(),
});


const groupProductsByPlan = data => groupBy(data, item => item.metadata.plan.split(" - ")[0]);

export default function SubscriptionFormLogic({
  isLoading = false,
  isError = false,
  onSubmit,
  createPreviewProps,
  hasCustomerSubscriptions,
  products,
  prices,
  customerSubscriptions,
}) {
  const router = useRouter();
  const redirect = useCallback(
    url => url && router.push(url),
    [router]
  );

  const form = useForm({
    mode: "all",
    shouldFocusError: false,
    shouldUnregister: true,
    defaultValues: DEFAULT_VALUES,
    resolver: yupResolver(SubscriptionFormSchema),
  });

  const handleSubmit = useMutation(
    data => onSubmit(
      { ...data, currentUrl: router.asPath },
      { onSuccess: res => redirect(res?.url) }
    )
  );

  const currentFieldValues = {
    group: form.watch(FIELD_NAMES.group),
    product: form.watch(FIELD_NAMES.product),
    price: form.watch(FIELD_NAMES.price),
  };


  const groupOptions = useMemo(
    () => groupProductsByPlan(products.data),
    [products.data]
  );
  const productOptions = useMemo(
    () => groupProductsByPlan(products.data)[currentFieldValues.group],
    [products.data, currentFieldValues.group]
  );
  const priceOptions = useMemo(
    () => prices.data?.filter(item => item.product === currentFieldValues.product),
    [prices.data, currentFieldValues.product]
  );


  useEffect(
    function handleGroupAutoselect() {
      if (!currentFieldValues.group && !!groupOptions && Object.keys(groupOptions).length === 1)
        return form.setValue(FIELD_NAMES.group, Object.keys(groupOptions)[0]);
    },
    [form, currentFieldValues.group, groupOptions]
  );

  useEffect(
    function handleProductAutoselect() {
      if (!!currentFieldValues.product && !productOptions?.some(item => item.id === currentFieldValues.product))
        return form.setValue(FIELD_NAMES.product, "");

      if (!currentFieldValues.product && !!productOptions && productOptions.length === 1)
        return form.setValue(FIELD_NAMES.product, productOptions[0].id);
    },
    [form, currentFieldValues.product, productOptions]
  );

  useEffect(
    function handlePriceAutoselect() {
      if (!!currentFieldValues.price && !priceOptions?.some(item => item.id === currentFieldValues.price))
        return form.setValue(FIELD_NAMES.price, "");

      if (!currentFieldValues.price && !!priceOptions && priceOptions.length === 1)
        return form.setValue(FIELD_NAMES.price, priceOptions[0].id);
    },
    [form, currentFieldValues.price, priceOptions]
  );


  const getFormProps = () => ({
    onSubmit: form.handleSubmit(
      handleSubmit.mutateAsync
    ),
  });

  const getInputProps = name => ({
    form,
    name,
    products,
    prices,
    groupOptions,
    productOptions,
    priceOptions,
    checkIsProductSubscribed: productId => customerSubscriptions.data?.some(sub => sub.items.data.some(item => item.price.product === productId)),
  });

  const getSubmitProps = () => ({
    tooltipText: !form.formState.isValid && "Please select a plan and price before continuing",
    submitText: `Continue to ${hasCustomerSubscriptions ? "preview" : "checkout"}`,
    type: hasCustomerSubscriptions ? "button" : "submit",
    loading: form.formState.isSubmitting,
    disabled: isLoading || !form.formState.isValid,
  });

  const getPreviewProps = () => createPreviewProps({
    product: currentFieldValues.product,
    price: currentFieldValues.price,
  });


  return (
    <SubscriptionFormView
      isError={isError}
      error={handleSubmit.isError && handleSubmit.error}
      form={form}
      hasCustomerSubscriptions={hasCustomerSubscriptions}
      getFormProps={getFormProps}
      getInputProps={getInputProps}
      getSubmitProps={getSubmitProps}
      getPreviewProps={getPreviewProps}
    />
  );
}