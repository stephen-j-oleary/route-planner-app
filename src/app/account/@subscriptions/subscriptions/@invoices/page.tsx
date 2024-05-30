import { cookies } from "next/headers";

import InvoicesList from "@/components/Invoices/List";
import { getUserInvoices } from "@/services/invoices";
import { auth } from "@/utils/auth";


export default async function InvoicesPage() {
  const { customerId } = await auth(cookies());

  const invoices = customerId ? await getUserInvoices() : [];

  return (
    <InvoicesList
      invoices={invoices}
      visible={3}
    />
  );
}