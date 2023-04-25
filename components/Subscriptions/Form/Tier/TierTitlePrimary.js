import { Typography } from "@mui/material";

import formatMoney from "@/shared/utils/formatMoney";


export default function TierTitlePrimary({
  tier,
  unitLabelSingular,
  variant = "text",
}) {
  const isTitle = variant === "title";

  const flatAmount = formatMoney(tier.flat_amount, { trailingDecimals: 0, zeroAsUndefined: true });
  const unitAmount = formatMoney(tier.unit_amount, { zeroAsUndefined: true });


  const AmountComponent = ({ amount, unit }) => isTitle
    ? (
      <>
        <Typography component="span" variant="h6">
          ${amount}
        </Typography>

        <Typography component="span" variant="caption">
          {unit}
        </Typography>
      </>
    )
    : <span>${amount} {unit}</span>;

  const PlusComponent = () => isTitle
    ? <Typography component="span" variant="caption">+</Typography>
    : <span>+</span>;


  return (
    <Typography
      component="span"
      sx={{
        "& > span": { marginX: .25 },
      }}
    >
      {flatAmount && <AmountComponent amount={flatAmount} unit="flat fee" />}

      {(flatAmount && unitAmount) && <PlusComponent />}

      {unitAmount && <AmountComponent amount={unitAmount} unit={`per ${unitLabelSingular}`} />}
    </Typography>
  );
}