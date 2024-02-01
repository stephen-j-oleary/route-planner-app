export type FormatMoneyOptions = {
  trailingDecimals?: number,
  zeroAsUndefined?: boolean,
};

export default function formatMoney(value: number | null | undefined, { trailingDecimals = 2, zeroAsUndefined = false }: FormatMoneyOptions = {}) {
  if (zeroAsUndefined && value === 0) return undefined;
  if (value === null || value === undefined) return undefined;

  return (value / 100).toFixed(trailingDecimals);
}