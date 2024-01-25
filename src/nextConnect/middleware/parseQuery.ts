import { NextApiRequest, NextApiResponse } from "next";
import { NextHandler } from "next-connect";
import queryString, { ParsedQuery } from "query-string";


export default function parseQuery(req: Omit<NextApiRequest, "query"> & { query: ParsedQuery<string | number | boolean | undefined> }, _res: NextApiResponse, next: NextHandler) {
  if (req.query) {
    const qs = queryString.stringify(req.query);
    req.query = queryString.parse(qs, { parseBooleans: true, parseNumbers: true, arrayFormat: "bracket" });
  }
  next();
}