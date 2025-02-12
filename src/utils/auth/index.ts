import "server-only";

import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { _getNextPage, _getSessionOptions, AUTH_ERRORS, isAuthPage } from "./helpers";
import { AuthData, FlowOptions, parseSearchParams } from "./utils";
import { ApiError } from "@/utils/apiError";
import { appendQuery } from "@/utils/url";


export async function authSession() {
  return await getIronSession<AuthData>(
    cookies(),
    _getSessionOptions(),
  );
}

export async function authFlow(opts: FlowOptions) {
  const { page, searchParams = {} } = opts;

  const session = await authSession();
  const nextPage = _getNextPage(session, opts);

  if (nextPage && nextPage !== page)
    redirect(isAuthPage(nextPage) ? appendQuery(nextPage, parseSearchParams(searchParams, page)) : nextPage);

  return session;
}

export async function authApi(opts: FlowOptions) {
  const { page } = opts;
  const session = await authSession();
  const nextPage = _getNextPage(session, opts);

  if (nextPage && nextPage !== page) {
    const error = AUTH_ERRORS[nextPage];
    throw new ApiError(error.code ?? 500, error.message ?? "An unknown error occurred");
  }

  return session;
}


export default function auth(page: string) {
  return {
    session: authSession,
    flow: (opts: Omit<FlowOptions, "page"> = {}) => authFlow({ page, ...opts }),
    api: (opts: Omit<FlowOptions, "page"> = {}) => authApi({ page, ...opts }),
  };
}