import type { Metadata } from "next";

// import DeleteAccount from "@/components/Users/DeleteAccount";


export default async function AccountPage() {
  return null;
  //return (
    {/* <PageSection
      title="Delete account"
      body={
        <DeleteAccount
          userId={authUser.data.id}
          variant="outlined"
          size="medium"
          disabled={!authUser.isFetched}
        />
      }
    /> */}
  //);
}

export const metadata: Metadata = {
  robots: { index: false },
  title: "Loop Mapping - Account",
  description: "Manage your Loop Mapping account. Update your personal information and access your subscription details, payment method, and invoices",
};