import { Divider, Skeleton, Stack, Typography } from "@mui/material";

import TierTitlePrimary from "@/components/Subscriptions/Form/Tier/TierTitlePrimary";
import TierTitleSecondary from "@/components/Subscriptions/Form/Tier/TierTitleSecondary";
import { useGetPrices } from "@/shared/reactQuery/usePrices";
import formatMoney from "@/shared/utils/formatMoney";
import { getLowestPrice, getNthTier } from "@/shared/utils/subscriptionHelpers";


const selectActive = data => data?.filter(item => item.active);

export default function PlanProductTitle({ product }) {
  const name = product.metadata.plan.split(" - ")[1];
  const unitLabel = product.unit_label || "units";
  const unitLabelSingular = unitLabel.slice(0, -1);

  const price = useGetPrices({
    select: data => (
      selectActive(data).find(item => item.id === product.default_price)
        || getLowestPrice(selectActive(data).filter(item => item.product === product.id))
    )
  });


  if (!price.isSuccess) {
    return (
      <Typography variant="body1">
        <Skeleton width={200} />
      </Typography>
    );
  }

  const unitAmount = formatMoney(price.data.unit_amount);
  const firstTier = getNthTier(price.data.tiers, 0);

  return (
    <Stack
      direction="row"
      spacing={1}
      alignItems="center"
    >
      {
        name && (
          <>
            <Typography
              component="p"
              variant="body1"
            >
              {name}
            </Typography>

            <Divider
              sx={{
                display: "inline-block",
                width: ".5rem",
              }}
            />
          </>
        )
      }

      <Typography
        component="p"
        variant="body2"
        sx={{
          "& > span": { marginX: .25 },
        }}
      >
        {
          (price.data.billing_scheme === "per_unit")
            ? (
              <span>
                ${unitAmount} per {unitLabelSingular}
              </span>
            )
            : (
              <>
                <TierTitlePrimary
                  tier={firstTier}
                  unitLabelSingular={unitLabelSingular}
                />

                <span>
                  {
                    (price.data.tiers.length > 1)
                      ? (
                        <TierTitleSecondary
                          tier={firstTier}
                          unitLabel={unitLabel}
                        />
                      )
                      : null
                  }
                </span>
              </>
            )
        }
      </Typography>
    </Stack>
  );
}