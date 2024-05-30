import PageSection from "@/components/ui/PageSection";


export default function SubscriptionsLayout({
  children,
  balance,
  invoices,
}: {
  children: React.ReactNode,
  balance: React.ReactNode,
  invoices: React.ReactNode,
}) {
  return (
    <>
      <PageSection
        title="Customer balance"
        body={balance}
      />

      {children}

      <PageSection
        title="Invoice history"
        body={invoices}
      />
    </>
  );
}