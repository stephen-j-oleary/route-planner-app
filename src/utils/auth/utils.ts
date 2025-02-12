import "server-only";

import { headers } from "next/headers";
import Stripe from "stripe";

import { isAuthPage } from "./helpers";
import { IUser } from "@/models/User";
import pages from "@/pages";
import { Params } from "@/types/next";
import { FromMongoose } from "@/utils/mongoose";
import { Pojo } from "@/utils/pojo";


export type AuthData = {
  user?: Omit<FromMongoose<IUser>, "countryCode"> & Required<Pick<FromMongoose<IUser>, "countryCode">>,
  customer?: Pojo<Pick<Stripe.Customer, "id" | "balance">>,
  subscriptions?: Pojo<Pick<Stripe.Subscription, "id">[]>,
};

export type FlowOptions = {
  page: string,
  searchParams?: Params,
  next?: string | boolean,
};


export function getReferer() {
  return headers().get("referer");
}

export function getCallbackUrl(searchParams: Params, page?: string) {
  const callbackUrl = searchParams.callbackUrl;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const url = new URL(
    typeof callbackUrl === "string"
      ? decodeURIComponent(callbackUrl)
      : (page && !isAuthPage(page))
      ? page
      : getReferer()
      || pages.routes.new,
    baseUrl
  );

  return (url.origin === baseUrl)
    ? url.pathname
    : pages.routes.new;
}

export function parseSearchParams(searchParams: Params, page: string) {
  const callbackUrl = getCallbackUrl(searchParams, page);
  const email = typeof searchParams.email === "string" ? searchParams.email : undefined;
  const existing = typeof searchParams.existing === "string" ? searchParams.existing : undefined;
  const plan = typeof searchParams.plan === "string" ? searchParams.plan : undefined;
  const intent = typeof searchParams.intent === "string" ? searchParams.intent : undefined;

  return {
    callbackUrl,
    email,
    existing,
    plan,
    intent,
  };
}