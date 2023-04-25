import { isUndefined, omitBy } from "lodash";

import Account from "@/shared/models/Account";
import nextConnect from "@/shared/nextConnect";
import mongooseMiddleware from "@/shared/nextConnect/middleware/mongoose";


const handler = nextConnect();

handler.use(mongooseMiddleware);

handler.head(async (req, res) => {
  const filter = createAccountFilter(req);

  const accounts = await Account.find(filter, ["provider"]).lean().exec();
  if (!accounts) throw { status: 404 };

  res.status(200).send();
});

handler.get(async (req, res) => {
  const filter = createAccountFilter(req);

  const accounts = await Account.find(filter, ["provider"]).lean().exec();
  if (!accounts) throw { status: 404, message: "Resource not found" };

  return res.status(200).json(accounts);
});


export default handler;


function createAccountFilter({ query }) {
  return omitBy({
    userId: query.userId,
    provider: query.provider,
  }, isUndefined);
}