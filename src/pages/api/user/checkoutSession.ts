import { array, InferType, object, string } from "yup";

import { handleGetUser } from ".";
import nextConnect from "@/nextConnect";
import authorization, { AuthorizedType } from "@/nextConnect/middleware/authorization";
import validation, { ValidatedType } from "@/nextConnect/middleware/validation";
import { stripeApiClient } from "@/utils/stripeClient";


function createAbsoluteUrl(url?: string) {
  if (!url) return undefined;
  return (url.startsWith("/") ? process.env.STRIPE_URL : "") + url;
}


const handler = nextConnect();


const ApiPostUserCheckoutSessionSchema = object({
  body: object({
    cancel_url: string().when("ui_mode", {
      is: "hosted",
      then: schema => schema.required(),
    }),
    success_url: string().when("ui_mode", {
      is: "hosted",
      then: schema => schema.required(),
    }),
    return_url: string().when("ui_mode", {
      is: "enbedded",
      then: schema => schema.required(),
    }),
    expand: array(string().required()).optional(),
    line_items: array().optional(),
    mode: string().oneOf(["payment", "setup", "subscription"]).optional(),
    ui_mode: string().oneOf(["embedded", "hosted"]).optional(),
  }),
});
export type ApiPostUserCheckoutSessionBody = InferType<typeof ApiPostUserCheckoutSessionSchema>["body"];
export type ApiPostUserCheckoutSessionResponse = Awaited<ReturnType<typeof handlePostUserCheckoutSession>>;

export async function handlePostUserCheckoutSession({ success_url, cancel_url, return_url, ...data }: ApiPostUserCheckoutSessionBody & { customer?: string, customer_email?: string }) {
  return await stripeApiClient.checkout.sessions.create({
    success_url: createAbsoluteUrl(success_url),
    cancel_url: createAbsoluteUrl(cancel_url),
    return_url: createAbsoluteUrl(return_url),
    currency: "cad",
    payment_method_types: ["card"],
    ...data,
  });
}

handler.post(
  authorization({ isUser: true }),
  validation(ApiPostUserCheckoutSessionSchema),
  async (req, res) => {
    const { body } = req.locals.validated as ValidatedType<typeof ApiPostUserCheckoutSessionSchema>;
    const { userId, customerId } = req.locals.authorized as AuthorizedType;

    const user = await handleGetUser(userId!);
    const customerEmail = user?.email;

    const session = await handlePostUserCheckoutSession({
      ...body,
      customer: customerId || undefined,
      customer_email: !customerId && customerEmail || undefined,
    });

    res.status(201).json(session satisfies NonNullable<ApiPostUserCheckoutSessionResponse>);
  }
);


export default handler;