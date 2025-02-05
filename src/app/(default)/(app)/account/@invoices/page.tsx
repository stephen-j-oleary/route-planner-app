import { cookies } from "next/headers";

import { getPrices } from "@/app/api/prices/actions";
import { getUserInvoices } from "@/app/api/user/invoices/actions";
import InvoicesList from "@/components/Invoices/List";
import { StripePriceActiveExpandedProduct } from "@/models/Price";
import auth from "@/utils/auth";
import pojo from "@/utils/pojo";


export default async function InvoicesPage() {
  await auth(cookies()).flow();

  const invoices = await getUserInvoices().catch(() => []);
  const prices = pojo(await getPrices({ active: true, expand: ["data.product"] }) as StripePriceActiveExpandedProduct[]);

  return (
    <InvoicesList
      invoices={invoices}
      prices={prices}
      visible={3}
    />
  );
}