import "client-only";

import { revalidatePath } from "next/cache";

import { ApiDeleteUserPaymentMethodByIdResponse } from "@/app/api/user/paymentMethods/[id]/route";
import fetchJson from "@/utils/fetchJson";
import pages from "pages";


export async function deleteUserPaymentMethodById(id: string) {
  const data = await fetchJson<ApiDeleteUserPaymentMethodByIdResponse>(
    `${pages.api.userPaymentMethods}/${id}`,
    { method: "DELETE" },
  );

  revalidatePath(pages.api.userPaymentMethods);

  return data;
}