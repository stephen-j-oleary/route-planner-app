import type { Metadata } from "next";

import { getUserById } from "@/app/api/user/actions";
import ProfileForm from "@/components/Users/Profile/Form";
import pages from "@/pages";
import auth from "@/utils/auth";


export default async function Page() {
  const { user: { id: userId } = {} } = await auth(pages.account.editProfile).flow();

  const user = await getUserById(userId);

  return (
    <ProfileForm
      user={user}
    />
  );
}

export const metadata: Metadata = {
  robots: { index: false },
  title: "Loop Mapping - Edit Profile",
};