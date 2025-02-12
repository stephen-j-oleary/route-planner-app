import { getPrices } from "@/app/api/prices/actions";
import { getUserSubscriptions } from "@/app/api/user/subscriptions/actions";
import SubscriptionsList from "@/components/Subscriptions/List";
import { StripePriceActiveExpandedProduct } from "@/models/Price";
import pages from "@/pages";
import auth from "@/utils/auth";
import { Pojo } from "@/utils/pojo";


export default async function Page() {
  await auth(pages.account.root).flow();

  const subscriptions = await getUserSubscriptions().catch(() => []);
  const prices = await getPrices({ active: true, expand: ["data.product"] }) as Pojo<StripePriceActiveExpandedProduct[]>;

  return (
    <SubscriptionsList
      subscriptions={subscriptions}
      prices={prices}
      visible={3}
    />
  );
}