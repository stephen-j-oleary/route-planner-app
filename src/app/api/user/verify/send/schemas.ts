import { boolean, InferType, object } from "yup";


export const ApiGetVerifySendQuerySchema = object()
  .shape({
    resend: boolean().optional(),
  })
  .optional()
  .noUnknown();
export type ApiGetVerifySendQuery = InferType<typeof ApiGetVerifySendQuerySchema>;