import Stripe from "stripe";

import { CheckRounded } from "@mui/icons-material";
import { ToggleButton, ToggleButtonProps } from "@mui/material";

import formatMoney from "@/utils/formatMoney";


export type SubscriptionPlanSelectPriceProps =
  & Omit<ToggleButtonProps, "value" | "onSelect">
  & {
    price: Stripe.Price,
    selected: boolean,
    onSelect: () => void,
  };

const getPriceIdentifier = (price: Stripe.Price) => price.lookup_key || price.id;

export default function SubscriptionPlanSelectPrice({
  price,
  selected,
  onSelect,
  ...props
}: SubscriptionPlanSelectPriceProps) {
  return (
    <div>
      <input
        type="radio"
        name="price_identifier"
        value={getPriceIdentifier(price)}
        checked={selected}
        onChange={() => onSelect()}
        disabled={props.disabled}
        style={{ display: "none" }}
      />

      <ToggleButton
        value={getPriceIdentifier(price)}
        selected={selected}
        onChange={() => onSelect()}
        {...props}
      >
        {selected && <CheckRounded fontSize="inherit" sx={{ mr: 1 }} />}
        {
          price.unit_amount === 0
            ? "Free"
            : `$${formatMoney(price.unit_amount, { trailingDecimals: 0 })} ${price.currency.toUpperCase()} per ${price.recurring?.interval}`
        }
      </ToggleButton>
    </div>
  );
}