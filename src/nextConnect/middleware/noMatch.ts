import { NextApiRequest, NextApiResponse } from "next";


export default function noMatch(req: NextApiRequest, res: NextApiResponse) {
  res.status(404).json({ message: "Page not found" });
}