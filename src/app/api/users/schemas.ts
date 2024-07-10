import { InferType, object, string } from "yup";

import { getUsers } from "./actions";
import { userPublicFields } from "@/models/User";


export const ApiGetUsersQuerySchema = object()
  .shape({
    email: string()
      .typeError("Invalid email")
      .required("Missing email")
      .email("Invalid email"),
  })
  .noUnknown();
export type ApiGetUsersQuery = InferType<typeof ApiGetUsersQuerySchema>;
export type ApiGetUsersResponse = Pick<Awaited<ReturnType<typeof getUsers>>[number], typeof userPublicFields[number]>[];