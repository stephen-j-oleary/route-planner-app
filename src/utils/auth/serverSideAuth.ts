import { GetServerSidePropsContext } from "next/types";

import { getAuthUser } from "./serverHelpers";


export type ServerSideAuthContext =
  & Pick<GetServerSidePropsContext, "req" | "res" | "query" | "resolvedUrl">
  & { disableCallbackUrl?: boolean };
export type ServerSideAuthRedirects = {
  noUser?: string,
  hasUser?: string,
  notVerified?: string,
  isVerified?: string,
};

export default async function serverSideAuth(
  { req, res, query, resolvedUrl, disableCallbackUrl = false }: ServerSideAuthContext,
  { noUser, hasUser, notVerified, isVerified }: ServerSideAuthRedirects
) {
  const callbackUrl = query.callbackUrl || resolvedUrl;

  const createRedirect = (path: string) => {
    return {
      redirect: {
        destination: `${path}${disableCallbackUrl ? "" : `?callbackUrl=${callbackUrl}`}`,
        permanent: false,
      },
    };
  };

  const user = await getAuthUser(req, res).catch(() => null);
  if (!user && noUser) return createRedirect(noUser);
  if (user && hasUser) return createRedirect(hasUser);

  if (!user?.emailVerified && notVerified) return createRedirect(notVerified);
  if (user?.emailVerified && isVerified) return createRedirect(isVerified);

  return null;
}