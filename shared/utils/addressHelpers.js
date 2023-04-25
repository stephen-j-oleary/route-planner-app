export function splitAddressPrimary(address) {
  const [primary, ...rest] = address.split(",");
  const secondary = rest.join(",").trim();
  return { primary, secondary };
}