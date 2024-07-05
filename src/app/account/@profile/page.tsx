import { cookies } from "next/headers";

import UserProfileForm from "@/components/Users/ProfileForm";
import { getUser } from "@/services/users";
import { auth } from "@/utils/auth/server";


export default async function Page() {
  const { userId } = await auth(cookies());
  const user = userId ? await getUser() : null;

  return (
    <UserProfileForm
      user={user}
    />
  );
}