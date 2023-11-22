import { NextApiRequest, NextApiResponse } from "next";
import { NextHandler } from "next-connect";
import qs, { ParsedQs } from "qs";


export default function parseQuery(req: Omit<NextApiRequest, "query"> & { query: ParsedQs }, _res: NextApiResponse, next: NextHandler) {
  if (req.query) {
    const queryString = qs.stringify(req.query);
    req.query = qs.parse(queryString);
  }
  next();
}