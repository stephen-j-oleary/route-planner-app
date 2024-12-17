import Stripe from "stripe";

import env from "@/utils/env";

const secretKey = env("STRIPE_SECRET_KEY");
const apiVersion = env("NEXT_PUBLIC_STRIPE_VERSION");
if (!secretKey) throw new Error("Missing Stripe secret key");
if (!apiVersion) throw new Error("Missing Stripe version");


// @ts-expect-error Stripe api version may not match the expected value
const stripeClientNext = new Stripe(secretKey, { apiVersion });

export default stripeClientNext;