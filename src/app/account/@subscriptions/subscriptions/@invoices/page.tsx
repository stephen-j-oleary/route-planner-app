import { cookies } from "next/headers";

import { handleGetUserInvoices } from "@/app/api/user/invoices/route";
import InvoicesList from "@/components/Invoices/List";
import { auth } from "@/utils/auth/server";


export default async function InvoicesPage() {
  const { customerId } = await auth(cookies());

  const invoices = customerId ? await handleGetUserInvoices({ customer: customerId }) : [];

  return (
    <InvoicesList
      invoices={invoices}
      visible={3}
    />
  );
}