import { NextApiRequest, NextApiResponse } from "next";
import nextConnectBase from "next-connect";

import onError from "./middleware/error";
import onNoMatch from "./middleware/noMatch";
import parseBools from "./middleware/parseBools";


export interface NextApiResponseLocals {
  locals: {
    [key: string]: unknown,
  },
}

export default function nextConnect(options = {}) {
  const nc = nextConnectBase<NextApiRequest, NextApiResponse>({
    onError,
    onNoMatch,
    attachParams: true,
    ...options,
  });

  nc.use(parseBools);
  nc.use<NextApiRequest, NextApiResponseLocals>((_req, res, next) => {
    res.locals ??= {};
    next();
  });

  return nc;
}