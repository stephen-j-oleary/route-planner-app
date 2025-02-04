import { cookies } from "next/headers";

import { getUserById } from "@/app/api/user/actions";
import ProfileDetail from "@/components/Users/Profile/Detail";
import auth from "@/utils/auth";


export default async function Page() {
  const { user: { id: userId } = {} } = await auth(cookies()).flow();

  const user = await getUserById(userId);

  return (
    <ProfileDetail
      user={user}
    />
  );
}