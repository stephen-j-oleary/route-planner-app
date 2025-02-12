import { getUserById } from "@/app/api/user/actions";
import ProfileDetail from "@/components/Users/Profile/Detail";
import pages from "@/pages";
import auth from "@/utils/auth";


export default async function Page() {
  const { user: { id: userId } = {} } = await auth(pages.account.root).flow();

  const user = await getUserById(userId);

  return (
    <ProfileDetail
      user={user}
    />
  );
}