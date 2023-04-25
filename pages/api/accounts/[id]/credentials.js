import Account from "@/shared/models/Account";
import nextConnect from "@/shared/nextConnect";
import mongooseMiddleware from "@/shared/nextConnect/middleware/mongoose";
import { getAuthUser } from "@/shared/utils/auth/serverHelpers";
import compareMongoIds from "@/shared/utils/compareMongoIds";


const handler = nextConnect();

handler.use(mongooseMiddleware);

handler.patch(async (req, res) => {
  const { query, body } = req;
  const { id } = query;
  const { oldCredentials, ...credentials } = body;

  const authUser = await getAuthUser(req, res);
  if (!authUser?._id) throw { status: 401, message: "Not authorized" };

  const account = await Account.findById(id).exec();
  if (!account) throw { status: 404, message: "Resource not found" };

  if (!compareMongoIds(authUser._id, account.userId)) throw { status: 401, message: "Not authorized" };
  if (!(await account.checkCredentials(oldCredentials))) throw { status: 401, message: "Invalid credentials" };

  account.credentials = credentials;
  const updatedAccount = await account.save();

  res.status(200).json(updatedAccount.toJSON());
});

export default handler;