import getScopeProjection from "@/shared/models/plugins/scopeProjection";
import User from "@/shared/models/User";
import nextConnect from "@/shared/nextConnect";
import mongooseMiddleware from "@/shared/nextConnect/middleware/mongoose";
import { getAuthScope } from "@/shared/utils/auth/serverHelpers";


const handler = nextConnect();

handler.use(mongooseMiddleware);

handler.head(async (req, res) => {
  const filter = createUserFilter(req);
  const scope = await getAuthScope(req, res);
  const projection = getScopeProjection(scope, User.schema);

  const users = await User.find(filter, projection).lean().exec();
  if (!users) throw { status: 404 };

  res.status(200).send();
});

handler.get(async (req, res) => {
  const filter = createUserFilter(req);
  const scope = await getAuthScope(req, res);
  const projection = getScopeProjection(scope, User.schema);

  const users = await User.find(filter, projection).exec();
  if (!users) throw { status: 404, message: "Resource not found" };

  res.status(200).json(users);
});

handler.post(async (req, res) => {
  const { body } = req;

  const user = await User.create({
    name: body.name,
    email: body.email,
    image: body.image,
  });

  return res.status(201).json(user.toJSON());
});


export default handler;


function createUserFilter({ query }) {
  return {
    email: query.email,
  };
}