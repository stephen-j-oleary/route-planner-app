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
  title: "Loop Mapping - Account",
};