import "server-only";

import { redirect } from "next/navigation";

import { _getFirstAuthIssue, _getSession } from "./helpers";
import { AuthContext, FlowOptions } from "./utils";
import pages from "@/pages";
import { ApiError } from "@/utils/apiError";
import { appendQuery } from "@/utils/url";


async function flow(ctx: AuthContext, {
  steps,
  skipSteps,
  step,
  callbackUrl,
  plan,
}: FlowOptions = {}) {
  const session = await _getSession(ctx);
  const firstIssue = await _getFirstAuthIssue(session, { steps, skipSteps });

  if ((step || firstIssue) && step !== firstIssue?.page) {
    if (firstIssue?.page === pages.plans && plan) redirect(`${pages.subscribe}/${plan}`);
    redirect(firstIssue ? appendQuery(firstIssue.page, { callbackUrl, plan }) : callbackUrl ?? pages.routes.new);
  }

  return session;
}

async function api(ctx: AuthContext, {
  steps,
  skipSteps,
}: FlowOptions = {}) {
  const session = await _getSession(ctx);
  const firstIssue = await _getFirstAuthIssue(session, { steps, skipSteps });

  if (firstIssue) throw new ApiError(firstIssue.error.code, firstIssue.error.message);

  return session;
}


export default function auth(ctx: AuthContext) {
  return {
    session: async () => await _getSession(ctx),
    flow: async (opts?: FlowOptions) => await flow(ctx, opts),
    api: async (opts?: FlowOptions) => await api(ctx, opts),
  };
}