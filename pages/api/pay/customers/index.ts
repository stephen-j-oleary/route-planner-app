import Stripe from "stripe";
import { Required } from "utility-types";

import User from "@/shared/models/User";
import nextConnect from "@/shared/nextConnect";
import isUserAuthenticated from "@/shared/nextConnect/middleware/isUserAuthenticated";
import { AuthError } from "@/shared/utils/ApiErrors";
import { getAuthUser } from "@/shared/utils/auth/serverHelpers";
import { stripeApiClient } from "@/shared/utils/stripeClient";


const handler = nextConnect();

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