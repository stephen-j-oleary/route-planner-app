import { array, InferType, object, string } from "yup";

import { postUserCheckoutSession } from "./actions";


export const ApiPostUserCheckoutSessionBodySchema = object()
  .shape({
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
  })
  .required()
  .noUnknown();
export type ApiPostUserCheckoutSessionBody = InferType<typeof ApiPostUserCheckoutSessionBodySchema>;
export type ApiPostUserCheckoutSessionResponse = Awaited<ReturnType<typeof postUserCheckoutSession>>;