import type { Metadata } from "next";
import { cookies } from "next/headers";

import { getUserById } from "@/app/api/user/actions";
import ProfileForm from "@/components/Users/Profile/Form";
import auth from "@/utils/auth";


export default async function Page() {
  const { user: { id: userId } = {} } = await auth(cookies()).flow();

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