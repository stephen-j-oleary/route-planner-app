import { InferType, number, object, string } from "yup";


export const ApiGetAutocompleteQuerySchema = object()
  .shape({
    q: string().required(),
    limit: number().optional(),
  })
  .required()
  .noUnknown();
export type ApiGetAutocompleteQuery = InferType<typeof ApiGetAutocompleteQuerySchema>;