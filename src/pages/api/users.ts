import { InferType, object, string } from "yup";

import User, { userPublicFields } from "@/models/User";
import nextConnect from "@/nextConnect";
import validation, { ValidatedType } from "@/nextConnect/middleware/validation";


const handler = nextConnect();


const ApiGetUsersSchema = object({
  query: object({
    email: string().required(),
  }),
});
export type ApiGetUsersQuery = InferType<typeof ApiGetUsersSchema>["query"];
export type ApiGetUsersResponse = Pick<Awaited<ReturnType<typeof handleGetUsers>>[number], typeof userPublicFields[number]>[];

export async function handleGetUsers(query: ApiGetUsersQuery) {
  return (await User.find(query, userPublicFields).lean().exec()) || [];
}

handler.get(
  validation(ApiGetUsersSchema),
  async (req, res) => {
    const { query } = req.locals.validated as ValidatedType<typeof ApiGetUsersSchema>;

    // Get the users
    const users = await handleGetUsers(query);

    res.status(200).json(users satisfies NonNullable<ApiGetUsersResponse>);
  }
);


export default handler;