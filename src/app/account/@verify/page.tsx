import { cookies } from "next/headers";

import PageSection from "@/components/ui/PageSection";
import UserVerifyAlert from "@/components/Users/Verify/Alert";
import { auth } from "@/utils/auth";


export default async function Page() {
  const { emailVerified } = await auth(cookies());
  if (emailVerified) return null;

  return (
    <PageSection
      borders="bottom"
      body={
        <UserVerifyAlert />
      }
    />
  );
}