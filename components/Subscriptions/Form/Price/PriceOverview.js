import { List, ListItem, ListItemText } from "@mui/material";

import TierTitlePrimary from "@/components/Subscriptions/Form/Tier/TierTitlePrimary";
import TierTitleSecondary from "@/components/Subscriptions/Form/Tier/TierTitleSecondary";
import { useGetProductById } from "@/shared/reactQuery/useProducts";
import formatMoney from "@/shared/utils/formatMoney";

export default function PriceOverview({ price }) {
  const product = useGetProductById(price.product);
  const unitLabel = product.data?.unit_label || "units";
  const unitLabelSingular = unitLabel.slice(0, -1);

  const unitAmount = formatMoney(price.unit_amount);


  return (
    <List
      disablePadding
      dense
    >
      {
        price.billing_scheme === "per_unit"
          ? (
            <ListItem>
              <ListItemText
                primary={`$${unitAmount} per ${unitLabelSingular}`}
              />
            </ListItem>
          )
          : price.tiers.map((tier, i) => (
            <ListItem key={tier.up_to}>
              <ListItemText
                primary={
                  <TierTitlePrimary
                    tier={tier}
                    unitLabelSingular={unitLabelSingular}
                    variant="title"
                  />
                }
                secondary={
                  (price.tiers.length > 1)
                    ? (
                      <TierTitleSecondary
                        tier={tier}
                        prevTier={price.tiers[i - 1]}
                        unitLabel={unitLabel}
                      />
                    )
                    : null
                }
              />
            </ListItem>
          ))
      }
    </List>
  );
}