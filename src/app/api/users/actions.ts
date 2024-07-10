import { ApiGetUsersQuery } from "./schemas";
import User, { userPublicFields } from "@/models/User";
import connectMongoose from "@/utils/connectMongoose";


export async function getUsers(query: ApiGetUsersQuery) {
  await connectMongoose();

  return await User.find(query, userPublicFields).exec();
}