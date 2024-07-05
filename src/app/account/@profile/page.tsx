import { cookies } from "next/headers";

import { handleGetUserById } from "@/app/api/user/route";
import UserProfileForm from "@/components/Users/ProfileForm";
import { auth } from "@/utils/auth/server";


export default async function Page() {
  const { userId } = await auth(cookies());
  const user = userId ? await handleGetUserById(userId) : null;

  return (
    <UserProfileForm
      user={user}
    />
  );
}