export default function compareMongoIds(...args) {
  const argStrings = args.map(item => (item?.toString?.() || item));

  return argStrings.every((v, _i, arr) => v === arr[0]);
}