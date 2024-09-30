import { cookies } from "next/headers";

import { getPrices } from "@/app/api/prices/actions";
import { getUserInvoices } from "@/app/api/user/invoices/actions";
import InvoicesList from "@/components/Invoices/List";
import { StripePriceActiveExpandedProduct } from "@/models/Price";
import { auth } from "@/utils/auth";


export default async function InvoicesPage() {
  const { customerId } = await auth(cookies());

  const invoices = customerId ? await getUserInvoices({ customer: customerId }) : [];
  const prices = customerId ? await getPrices({ active: true, expand: ["data.product"] }) as StripePriceActiveExpandedProduct[] : [];

  return (
    <InvoicesList
      invoices={invoices}
      prices={prices}
      visible={3}
    />
  );
}