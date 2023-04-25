export default function TierTitleSecondary({ tier, prevTier, unitLabel }) {
  return (
    <span>
      for {
        !tier.up_to
          ? "additional"
          : prevTier
          ? "the next"
          : "up to"
      } {
        !tier.up_to
          ? ""
          : prevTier
          ? `${prevTier.up_to + 1} - ${tier.up_to}`
          : tier.up_to
      } {
        unitLabel
      }
    </span>
  );
}