import { isString } from "lodash";
import Stripe from "stripe";


export const isValidSubscriptionStatus = (status: unknown): status is Stripe.SubscriptionListParams.Status => (
  isString(status) && ["active", "past_due", "unpaid", "canceled", "incomplete", "incomplete_expired", "trialing", "paused", "all", "ended"].includes(status)
);

export const isValidPriceType = (type: unknown): type is Stripe.PriceListParams.Type => (
  isString(type) && ["recurring", "one_time"].includes(type)
);