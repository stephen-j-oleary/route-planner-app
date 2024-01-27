import { NextApiRequest, NextApiResponse } from "next";
import { NextHandler } from "next-connect";
import { ISchema, ValidationError } from "yup";

import { RequestError } from "@/utils/ApiErrors";


export type { InferType as ValidatedType } from "yup";

export default function validation(schema: ISchema<unknown>) {
  return async function(req: NextApiRequest, res: NextApiResponse, next: NextHandler) {
    req.locals.validated = await schema
      .validate(req, { stripUnknown: true })
      .catch(err => {
        if (err instanceof ValidationError) throw new RequestError(`Invalid param: ${err.path}`);
        throw new RequestError("Invalid request");
      });

    return next();
  }
}