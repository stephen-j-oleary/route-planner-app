import nextConnectBase from "next-connect";

import onError from "./middleware/error";
import onNoMatch from "./middleware/noMatch";
import parseBools from "./middleware/parseBools";


export default function nextConnect(options) {
  const nc = nextConnectBase({
    onError,
    onNoMatch,
    attachParams: true,
    ...options,
  });

  nc.use(parseBools);
  nc.use((_req, res, next) => {
    res.locals ??= {};
    next();
  });

  return nc;
}