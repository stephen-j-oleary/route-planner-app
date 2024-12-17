import { loadStripe } from "@stripe/stripe-js";

import env from "@/utils/env";

const publicKey = env("NEXT_PUBLIC_STRIPE_PUBLIC_KEY");
const apiVersion = env("NEXT_PUBLIC_STRIPE_VERSION");
if (!publicKey) throw new Error("Missing Stripe public key");
if (!apiVersion) throw new Error("Missing Stripe version");


const stripeClientReact = loadStripe(publicKey, { apiVersion });

export default stripeClientReact;