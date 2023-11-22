import { loadStripe } from "@stripe/stripe-js";
import Stripe from "stripe";


const apiVersion = "2022-11-15";

export const stripeApiClient = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion });

export const stripeAppClient = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY, { apiVersion });