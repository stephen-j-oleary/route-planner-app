import nextConnect from "@/nextConnect";
import authorization, { AuthorizedType } from "@/nextConnect/middleware/authorization";
import { NotFoundError } from "@/utils/ApiErrors";
import { stripeApiClient } from "@/utils/stripeClient";


const handler = nextConnect();


export type ApiGetUserCustomerResponse = Awaited<ReturnType<typeof handleGetUserCustomer>>;

export async function handleGetUserCustomer(id: string) {
  return await stripeApiClient.customers.retrieve(id);
}

handler.get(
  authorization({ isCustomer: true }),
  async (req, res) => {
    const { customerId } = req.locals.authorized as AuthorizedType;

    const data = await handleGetUserCustomer(customerId!);
    if (!data) throw new NotFoundError();

    res.status(200).json(data satisfies NonNullable<ApiGetUserCustomerResponse>);
  }
);


export type ApiDeleteUserCustomerRepsonse = Awaited<ReturnType<typeof handleDeleteUserCustomer>>;

export async function handleDeleteUserCustomer(id: string) {
  const { deleted } = await stripeApiClient.customers.del(id);
  return { deletedCount: +deleted };
}

handler.delete(
  authorization({ isCustomer: true }),
  async (req, res) => {
    const { customerId } = req.locals.authorized as AuthorizedType;

    const data = await handleDeleteUserCustomer(customerId!);
    if (!data.deletedCount) throw new NotFoundError();

    res.status(204).end();
  }
);


export default handler;