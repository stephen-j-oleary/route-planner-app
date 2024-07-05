import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// import DeleteAccount from "@/components/Users/DeleteAccount";
import { auth } from "@/utils/auth/server";


export default async function AccountPage() {
  const { userId } = await auth(cookies());
  if (!userId) redirect("/login");

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

export const metadata = {
  title: "Loop Mapping - Profile",
};