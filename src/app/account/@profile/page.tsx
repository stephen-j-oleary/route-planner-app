import { cookies } from "next/headers";

import { getUserById } from "@/app/api/user/actions";
import ProfileDetail from "@/components/Users/Profile/Detail";
import { auth } from "@/utils/auth";
import { fromMongoose } from "@/utils/mongoose";


export default async function Page() {
  const { userId } = await auth(cookies());
  const user = userId ? await getUserById(userId) : null;

  return (
    <ProfileDetail
      user={user ? fromMongoose(user) : null}
    />
  );
}