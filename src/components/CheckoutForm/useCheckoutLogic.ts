import Stripe from "stripe";

import { StripePriceActiveExpandedProduct } from "@/models/Price";
import { useGetPriceById, useGetPrices } from "@/reactQuery/usePrices";
import { useGetUserSubscriptions } from "@/reactQuery/useSubscriptions";


export type useCheckoutLogicParams =
  | { priceId: string, lookupKey?: string }
  | { priceId?: string, lookupKey: string };

export type useCheckoutLogicReturn = {
  /**
   * The state the checkout form should render in
   * loading: The required data is stll loading
   * error: Unable to load required data
   * subscribe: The customer has not active subscriptions
   * change: The customer is attempting to change subscriptions
   */
  state: "loading" | "error" | "subscribe" | "change",
  subscriptions: Stripe.Subscription[],
  price: StripePriceActiveExpandedProduct | undefined,
}

const isPriceActive = (price?: Stripe.Price): price is StripePriceActiveExpandedProduct => !!price?.active;

export default function useCheckoutLogic({
  priceId,
  lookupKey,
}: useCheckoutLogicParams) {
  const subscriptions = useGetUserSubscriptions();

  const priceById = useGetPriceById(
    priceId,
    {
      params: { expand: ["product"] },
      select: data => data && isPriceActive(data) ? data : undefined,
    }
  );
  const priceByLookupKey = useGetPrices({
    enabled: !priceId && !!lookupKey,
    params: {
      lookup_keys: lookupKey ? [lookupKey] : [],
      expand: ["data.product"],
    },
    select: (data): StripePriceActiveExpandedProduct | undefined => isPriceActive(data[0]) ? data[0] : undefined,
  });
  const price = priceId ? priceById : priceByLookupKey;


  const isLoading =
    subscriptions.isIdle || (subscriptions.isLoading && !subscriptions.data)
      || price.isIdle || (price.isLoading && !price.data);
  const isError = subscriptions.isError || price.isError;
  const hasSubscription = !!subscriptions.data?.length;


  const response: useCheckoutLogicReturn =  {
    state: isLoading
      ? "loading"
      : isError
      ? "error"
      : hasSubscription
      ? "change"
      : "subscribe",
    subscriptions: subscriptions.data || [],
    price: price.data,
  };

  return response;
}