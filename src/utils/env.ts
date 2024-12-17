export default function env<TSilent extends boolean, TDefault extends string>(
  name: string,
  options: {
    silent?: TSilent,
    defaultValue?: TDefault,
  } = {}
) {
  const { silent, defaultValue } = options;
  const value = process.env[name] || defaultValue;
  if (!value && !silent) throw new Error(`Invalid environment: Mising variable "${name}"`);

  return value;
}