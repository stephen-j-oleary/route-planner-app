import { cookies } from "next/headers";

import { getPrices } from "@/app/api/prices/actions";
import { getUserInvoices } from "@/app/api/user/invoices/actions";
import { getUserUpcomingInvoice } from "@/app/api/user/invoices/upcoming/actions";
import InvoicesList from "@/components/Invoices/List";
import { StripePriceActiveExpandedProduct } from "@/models/Price";
import { auth } from "@/utils/auth";


export default async function InvoicesPage() {
  const { customerId } = await auth(cookies());

  const upcoming = customerId ? await getUserUpcomingInvoice({ customer: customerId }) : null;
  const invoices = customerId ? await getUserInvoices({ customer: customerId }) : [];
  const prices = customerId ? await getPrices({ active: true, expand: ["data.product"] }) as StripePriceActiveExpandedProduct[] : [];

  return (
    <InvoicesList
      invoices={[
        ...(upcoming ? [upcoming] : []),
        ...invoices
      ]}
      prices={prices}
      visible={3}
    />
  );
}