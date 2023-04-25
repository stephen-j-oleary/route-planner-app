import { sortBy } from "lodash";


export function getLowestPrice(prices = []) {
  const [lowest] = sortBy(prices, ["unit_amount"]);
  return lowest;
}

export function getNthTier(tiers = [], n = 0) {
  const sortedTiers = sortBy(tiers, ["up_to"]);
  return sortedTiers[n];
}