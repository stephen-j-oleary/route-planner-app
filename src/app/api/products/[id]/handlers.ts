import stripeClientNext from "@/utils/stripeClient/next";


export type ApiGetProductByIdResponse = Awaited<ReturnType<typeof handleGetProductById>>;

export async function handleGetProductById(id: string) {
  return await stripeClientNext.products.retrieve(id);
}