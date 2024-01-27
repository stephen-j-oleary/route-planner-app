import nextConnectBase from "next-connect";

import onError from "./middleware/error";
import onNoMatch from "./middleware/noMatch";
import mongooseMiddleware from "@/nextConnect/middleware/mongoose";
import parseQuery from "@/nextConnect/middleware/parseQuery";


declare module "next" {
  interface NextApiRequest {
    locals: {
      [key: string]: unknown,
    };
  }
}

export default function nextConnect(options = {}) {
  const nc = nextConnectBase({
    onError,
    onNoMatch,
    attachParams: true,
    ...options,
  });

  nc.use(mongooseMiddleware);
  nc.use(parseQuery);
  nc.use((req, _res, next) => {
    req.locals ??= {};
    return next();
  });

  return nc;
}