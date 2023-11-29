import { NextApiRequest, NextApiResponse } from "next";
import { NextHandler } from "next-connect";
import queryString from "query-string";


export default function parseQuery(req: Omit<NextApiRequest, "query"> & { query: queryString.ParsedQuery<string | boolean> }, _res: NextApiResponse, next: NextHandler) {
  if (req.query) {
    const qs = queryString.stringify(req.query);
    req.query = queryString.parse(qs, { parseBooleans: true, arrayFormat: "bracket" });
  }
  next();
}