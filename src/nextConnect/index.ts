import nextConnectBase from "next-connect";

import onError from "./middleware/error";
import onNoMatch from "./middleware/noMatch";
import parseBools from "./middleware/parseBools";


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

  nc.use(parseBools);
  nc.use((req, _res, next) => {
    req.locals ??= {};
    return next();
  });

  return nc;
}