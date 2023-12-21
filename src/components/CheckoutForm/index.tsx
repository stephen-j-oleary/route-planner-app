import { Paper, PaperProps } from "@mui/material";

import CheckoutFormChangeSubscription from "@/components/CheckoutForm/ChangeSubscription";
import CheckoutFormNewSubscription from "@/components/CheckoutForm/NewSubscription";
import useCheckoutLogic from "@/components/CheckoutForm/useCheckoutLogic";
import ListSkeleton from "@/components/ui/ListSkeleton";
import ViewError from "@/components/ui/ViewError";


export type CheckoutFormProps = PaperProps & (
  | { priceId: string, lookupKey?: string }
  | { priceId?: string, lookupKey: string }
);

export default function CheckoutForm({
  priceId,
  lookupKey,
  ...props
}: CheckoutFormProps) {
  const {
    state,
    subscriptions,
    price,
  } = useCheckoutLogic({
    priceId,
    lookupKey,
  });

  return (
    <Paper
      role="form"
      aria-busy={state === "loading"}
      sx={{ padding: 2 }}
      {...props}
    >
      {(() => {
        switch (state) {
          case "loading":
            return <ListSkeleton />;

          case "error":
            return <ViewError secondary="Failed to load plan details" />;

          case "change":
            return (
              <CheckoutFormChangeSubscription
                activeSubscriptions={subscriptions}
                newPrice={price}
              />
            );

          case "subscribe":
            return (
              <CheckoutFormNewSubscription newPrice={price} />
            );
        }
      })()}
    </Paper>
  );
}