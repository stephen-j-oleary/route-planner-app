import { cookies } from "next/headers";

import { getUserInvoices } from "@/app/api/user/invoices/actions";
import InvoicesList from "@/components/Invoices/List";
import { auth } from "@/utils/auth";


export default async function InvoicesPage() {
  const { customerId } = await auth(cookies());

  const invoices = customerId ? await getUserInvoices({ customer: customerId }) : [];

  return (
    <InvoicesList
      invoices={invoices}
      visible={3}
    />
  );
}