import { cookies } from "next/headers";

import { getUserById } from "@/app/api/user/actions";
import UserProfileForm from "@/components/Users/ProfileForm";
import { auth } from "@/utils/auth";
import { fromMongoose } from "@/utils/mongoose";


export default async function Page() {
  const { userId } = await auth(cookies());
  const user = userId ? await getUserById(userId) : null;

  return (
    <UserProfileForm
      user={user ? fromMongoose(user) : null}
    />
  );
}