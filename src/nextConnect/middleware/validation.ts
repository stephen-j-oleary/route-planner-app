/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextApiRequest, NextApiResponse } from "next";
import { NextHandler } from "next-connect";
import { ISchema, ValidationError } from "yup";
import { InferType } from "yup";

import { RequestError } from "@/utils/ApiErrors";


export default function validation<Schemas extends { [k: string]: ISchema<any> }>(schemas: Schemas) {
  return async function(req: Omit<NextApiRequest, keyof Schemas> & { [K in keyof Schemas]: InferType<Schemas[K]> }, _res: NextApiResponse, next: NextHandler) {
    for (const schemaKey in schemas) {
      const schema = schemas[schemaKey];
      if (schema) {
        await schema
          .validate(req[schemaKey], { stripUnknown: true })
          .catch(err => {
            if (err instanceof ValidationError) throw new RequestError(`Invalid param: ${err.path}`);
            throw new RequestError("Invalid request");
          });
      }
    }

    next();
  }
}