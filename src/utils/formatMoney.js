export default function formatMoney(value, { trailingDecimals = 2, zeroAsUndefined = false } = {}) {
  if (zeroAsUndefined && value === 0) return undefined;
  if (value == null) return undefined;

  return (value / 100).toFixed(trailingDecimals);
}