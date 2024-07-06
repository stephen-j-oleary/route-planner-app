import "client-only";

import { ApiDeleteUserPaymentMethodByIdResponse } from "@/app/api/user/paymentMethods/[id]/route";
import fetchJson from "@/utils/fetchJson";
import pages from "pages";


export async function deleteUserPaymentMethodById(id: string) {
  const data = await fetchJson<ApiDeleteUserPaymentMethodByIdResponse>(
    `${pages.api.userPaymentMethods}/${id}`,
    { method: "DELETE" },
  );

  return data;
}