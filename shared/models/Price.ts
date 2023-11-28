import Stripe from "stripe";


export type StripePriceExpandedProduct = Omit<Stripe.Price, "product"> & { product: Exclude<Stripe.Price["product"], string> };
export type StripePriceActiveExpandedProduct = Omit<StripePriceExpandedProduct, "product"> & { product: Stripe.Product };