import { loadStripe } from "@stripe/stripe-js";
import Stripe from "stripe";

const SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const PUBLIC_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY;
if (!SECRET_KEY) throw new Error("Missing Stripe secret key");
if (!PUBLIC_KEY) throw new Error("Missing Stripe public key");


const apiVersion = "2023-10-16";

export const stripeApiClient = new Stripe(SECRET_KEY, { apiVersion });

export const stripeAppClient = loadStripe(PUBLIC_KEY, { apiVersion });