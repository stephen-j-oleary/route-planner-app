import { useMutation, useQueryClient } from "react-query";

import SubscriptionFormLogic from "@/components/Subscriptions/Form/Logic";
import { useGetPrices } from "@/shared/reactQuery/usePrices";
import { useGetProducts } from "@/shared/reactQuery/useProducts";
import { selectUser, useGetSession } from "@/shared/reactQuery/useSession";
import { useGetSubscriptionsByCustomer } from "@/shared/reactQuery/useSubscriptions";
import { createCheckoutSession } from "@/shared/services/checkoutSessions";
import { updateSubscriptionById } from "@/shared/services/subscriptions";


const selectActive = data => data?.filter(item => item.active);
const selectById = (data, id) => data?.find(p => p.id === id);

export default function SubscriptionFormApi() {
  const queryClient = useQueryClient();

  const authUser = useGetSession({ select: selectUser });
  const products = useGetProducts({ select: selectActive });
  const prices = useGetPrices({ select: selectActive });

  const customerSubscriptions = useGetSubscriptionsByCustomer(
    authUser.data?.customerId,
    { enabled: authUser.isSuccess }
  );

  const hasCustomerSubscriptions = customerSubscriptions.data?.length > 0;


  const handleSubmit = useMutation(
    async ({ product, price, currentUrl }) => {
      if (customerSubscriptions.data?.some(sub => sub.items.data.some(item => item.price.id === price))) throw new Error("You are already subscribed to this plan");

      const productObj = selectById(products.data, product);
      const priceObj = selectById(prices.data, price);
      if (!priceObj || !productObj) throw new Error("An error occured. Please try again");

      const line_items = [{
        id: customerSubscriptions.data?.[0]?.items?.data[0]?.id || undefined,
        price,
        quantity: priceObj.recurring?.usage_type === "metered" ? undefined : 1,
      }];

      if (hasCustomerSubscriptions) {
        await updateSubscriptionById(
          customerSubscriptions.data?.[0]?.id,
          { items: line_items }
        );

        return { url: "/profile/subscriptions" };
      }
      else {
        return await createCheckoutSession({
          line_items,
          mode: priceObj.type === "recurring" ? "subscription" : "payment",
          success_url: "/profile/subscriptions#create-successful",
          cancel_url: currentUrl,
          metadata: { userId: authUser.data?._id },
          customer: authUser.data?.customerId || undefined,
          customer_email: (!authUser.data?.customerId && authUser.data?.email) || undefined,
        });
      }
    },
    {
      onSuccess() {
        queryClient.invalidateQueries("subscriptions");
      },
    }
  );

  const createPreviewProps = ({ product, price }) => {
    const productObj = selectById(products.data, product);
    const priceObj = selectById(prices.data, price);

    const line_items = [{
      id: customerSubscriptions.data?.[0]?.items?.data[0]?.id || undefined,
      price,
      quantity: priceObj?.recurring?.usage_type === "metered" ? undefined : 1,
    }];

    return {
      productName: productObj?.name,
      subscription: customerSubscriptions.data?.[0],
      lineItems: line_items,
      prorationDate: Math.floor(Date.now() / 1000),
    };
  };


  return (
    <SubscriptionFormLogic
      isLoading={authUser.isLoading
        || products.isLoading
        || prices.isLoading
        || customerSubscriptions.isLoading}
      isError={authUser.isError
        || products.isError
        || prices.isError
        || customerSubscriptions.isError}
      onSubmit={handleSubmit.mutateAsync}
      hasCustomerSubscriptions={hasCustomerSubscriptions}
      createPreviewProps={createPreviewProps}
      products={products}
      prices={prices}
      customerSubscriptions={customerSubscriptions}
    />
  );
}