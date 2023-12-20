import { isNil, isString, isUndefined, omitBy } from "lodash";
import Stripe from "stripe";
import { Required } from "utility-types";

import { handleDeleteCustomer, handleGetCustomerById } from "@/pages/api/pay/customers/[customerId]";
import { handleGetUsers } from "@/pages/api/users";
import User from "@/shared/models/User";
import nextConnect from "@/shared/nextConnect";
import isUserAuthenticated from "@/shared/nextConnect/middleware/isUserAuthenticated";
import { AuthError, ForbiddenError, NotFoundError, RequestError } from "@/shared/utils/ApiErrors";
import { getAuthUser } from "@/shared/utils/auth/serverHelpers";
import hasOneOf from "@/shared/utils/hasOneOf";
import { stripeApiClient } from "@/shared/utils/stripeClient";


const handler = nextConnect();


export type ApiGetCustomersQuery = {
  email: string,
}
export type ApiGetCustomersResponse = Awaited<ReturnType<typeof handleGetCustomers>>

export async function handleGetCustomers(query: ApiGetCustomersQuery) {
  const users = await handleGetUsers(query);
  if (!users) return [];

  const customers = [];
  for (const user of users) {
    if (!user.customerId) continue;
    const customer = await handleGetCustomerById(user.customerId);
    customers.push(customer);
  }

  return customers;
}

export type ApiPostCustomerBody = Omit<Stripe.CustomerCreateParams, "email">;
export type ApiPostCustomerResponse = Awaited<ReturnType<typeof handleCreateCustomer>>;

export async function handleCreateCustomer(body: Required<Stripe.CustomerCreateParams, "email">) {
  const data = await stripeApiClient.customers.create(body);

  await User.findOneAndUpdate(
    { email: body.email },
    { $set: { customerId: data.id } }
  ).exec();

  return data;
}

handler.post(
  isUserAuthenticated,
  async (req, res) => {
    const authUser = await getAuthUser(req, res);
    if (!authUser?.email) throw new AuthError("Authentication missing email");

    const data = await handleCreateCustomer({
      ...req.body,
      email: authUser.email,
    });

    res.status(201).json(data);
  }
);


export type ApiDeleteCustomersQuery =
  | { userId: string, email?: string }
  | { userId?: string, email: string }
export type ApiDeleteCustomerResponse = Awaited<ReturnType<typeof handleDeleteCustomer>>

export async function handleDeleteCustomers(query: ApiDeleteCustomersQuery) {
  const users = await handleGetUsers(query);
  if (!users) return { deletedCount: 0 };

  let deletedCount = 0;
  for (const user of users) {
    if (!user.customerId) continue;
    const res = await handleDeleteCustomer(user.customerId);
    deletedCount += res.deletedCount;
  }

  return { deletedCount };
}

handler.delete(
  isUserAuthenticated,
  async (req, res) => {
    const { userId, email } = req.query;
    if (!isUndefined(userId) && !isString(userId)) throw new RequestError("Invalid param: 'userId'");
    if (!isUndefined(email) && !isString(email)) throw new RequestError("Invalid param: 'email'");
    const query = omitBy({ userId, email }, isNil);
    if (!hasOneOf(query, ["email", "userId"])) throw new RequestError("Missing required param: 'userId' or 'email'");

    const authUser = await getAuthUser(req, res);
    if (email !== authUser.email) throw new ForbiddenError();

    const { deletedCount } = await handleDeleteCustomers(query);
    if (deletedCount === 0) throw new NotFoundError();

    res.status(204).end()
  }
)