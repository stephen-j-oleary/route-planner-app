import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

import { IUser } from "@/models/User";
import pages from "@/pages";
import { FromMongoose } from "@/utils/mongoose";
import { Pojo } from "@/utils/pojo";


export type AuthData = {
  user?: Omit<FromMongoose<IUser>, "countryCode"> & Required<Pick<FromMongoose<IUser>, "countryCode">>,
  customer?: Pojo<Pick<Stripe.Customer, "id" | "balance">>,
  subscriptions?: Pojo<Pick<Stripe.Subscription, "id">[]>,
};

export type AuthContext =
  | ReadonlyRequestCookies
  | { req: NextRequest, res: NextResponse };

export type FlowOptions =
  & {
    steps?: string[],
    skipSteps?: string[],
  }
  & (
    | { step?: never, callbackUrl?: never, plan?: never }
    | { step: string, callbackUrl: string, plan?: string }
  );


export function getCallbackUrl({
  searchParams,
  headerStore,
}: {
  searchParams: URLSearchParams | Record<string, string | string[] | undefined>,
  headerStore: Headers | Record<string, string | string[] | undefined>,
}) {
  if (searchParams instanceof URLSearchParams) searchParams = Object.fromEntries(searchParams.entries());
  if (headerStore instanceof Headers) headerStore = Object.fromEntries(headerStore.entries());
  const callbackUrl = searchParams?.callbackUrl;
  const referer = headerStore?.referer;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const url = new URL(
    typeof callbackUrl === "string"
      ? decodeURIComponent(callbackUrl)
      : typeof referer === "string"
      ? referer
      : pages.routes.new,
    baseUrl
  );

  return (url.origin !== baseUrl)
    ? url.pathname
    : pages.routes.new;
}