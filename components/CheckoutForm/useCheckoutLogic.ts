import Stripe from "stripe";

import { StripePriceActiveExpandedProduct } from "@/shared/models/Price";
import { useGetPriceById, useGetPrices } from "@/shared/reactQuery/usePrices";
import { selectCustomerId, useGetSession } from "@/shared/reactQuery/useSession";
import { useGetSubscriptions } from "@/shared/reactQuery/useSubscriptions";


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
  price: StripePriceActiveExpandedProduct,
}

const isPriceActive = (price: Stripe.Price): price is StripePriceActiveExpandedProduct => price.active;

export default function useCheckoutLogic({
  priceId,
  lookupKey,
}: useCheckoutLogicParams) {
  const { data: customerId } = useGetSession({ select: selectCustomerId });
  const subscriptions = useGetSubscriptions({ enabled: !!customerId });

  const priceById = useGetPriceById(
    priceId,
    {
      params: { expand: ["product"] },
      select: data => isPriceActive(data) ? data : undefined,
    }
  );
  const priceByLookupKey = useGetPrices({
    enabled: !priceId && !!lookupKey,
    params: {
      lookup_keys: [lookupKey],
      expand: ["data.product"],
    },
    select: data => isPriceActive(data[0]) ? data[0] : undefined,
  });
  const price = priceId ? priceById : priceByLookupKey;


  const isLoading =
    (!!customerId && (subscriptions.isIdle || (subscriptions.isLoading && !subscriptions.data)))
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
    subscriptions: subscriptions.data,
    price: price.data,
  };

  return response;
}