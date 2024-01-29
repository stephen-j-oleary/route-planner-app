import { NextApiRequest } from "next";
import { InferType, object, string } from "yup";

import User, { userPublicFields } from "@/models/User";
import nextConnect from "@/nextConnect";
import authorization, { AuthorizedType } from "@/nextConnect/middleware/authorization";
import validation, { ValidatedType } from "@/nextConnect/middleware/validation";
import { handleGetUserById } from "@/pages/api/users/[id]";


const handler = nextConnect();


const ApiGetUsersSchema = object({
  query: object({
    email: string().when("$req", ([req]: NextApiRequest[], schema) => {
      // Require email in request when not logged in
      const { userId } = req.locals.authorized as AuthorizedType;
      return userId ? schema : schema.required();
    }),
  }),
});
export type ApiGetUsersQuery = InferType<typeof ApiGetUsersSchema>["query"];
export type ApiGetUsersAuthorizedResponse = Awaited<ReturnType<typeof handleGetUsers>>;
export type ApiGetUsersUnauthorizedResponse = Pick<ApiGetUsersAuthorizedResponse[number], typeof userPublicFields[number]>[];
export type ApiGetUsersResponse =
  | ApiGetUsersAuthorizedResponse
  | ApiGetUsersUnauthorizedResponse;

export async function handleGetUsers(query: ApiGetUsersQuery) {
  return (await User.find(query).lean().exec()) || [];
}

export async function handleGetUsersUnauthorized(query: ApiGetUsersQuery) {
  return (await User.find(query, userPublicFields).lean().exec()) || [];
}

handler.get(
  authorization({}), // Populate the authorized local
  validation(ApiGetUsersSchema),
  async (req, res) => {
    const { query } = req.locals.validated as ValidatedType<typeof ApiGetUsersSchema>;
    const { userId } = req.locals.authorized as AuthorizedType;

    let users;
    if (userId) {
      const user = await handleGetUserById(userId);
      users = user ? [user] : [];
    }
    else {
      users = await handleGetUsersUnauthorized(query);
    }

    res.status(200).json(users satisfies NonNullable<ApiGetUsersResponse>);
  }
);


export default handler;