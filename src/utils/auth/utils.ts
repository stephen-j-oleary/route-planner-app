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
  searchParams?: Promise<Params> | Params,
  next?: string | boolean,
};


export async function getReferer() {
  return (await headers()).get("referer");
}

export async function getCallbackUrl(searchParams: Promise<Params> | Params, page?: string) {
  const callbackUrl = (await searchParams).callbackUrl;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const url = new URL(
    typeof callbackUrl === "string"
      ? decodeURIComponent(callbackUrl)
      : (page && !isAuthPage(page))
      ? page
      : await getReferer()
      || pages.routes.new,
    baseUrl
  );

  return (url.origin === baseUrl)
    ? url.pathname
    : pages.routes.new;
}

export async function parseSearchParams(searchParams: Promise<Params> | Params | undefined, page: string) {
  const _searchParams = (await searchParams) ?? {};
  const callbackUrl = await getCallbackUrl(_searchParams, page);
  const email = typeof _searchParams.email === "string" ? _searchParams.email : undefined;
  const existing = typeof _searchParams.existing === "string" ? _searchParams.existing : undefined;
  const plan = typeof _searchParams.plan === "string" ? _searchParams.plan : undefined;
  const intent = typeof _searchParams.intent === "string" ? _searchParams.intent : undefined;

  return {
    callbackUrl,
    email,
    existing,
    plan,
    intent,
  };
}