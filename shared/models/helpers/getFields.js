export default function getFields(
  model,
  scope = [],
  {
    includeUnscoped = false,
  } = {}
) {
  const scopeArr = (typeof scope === "string") ? [scope] : scope;
  if (scopeArr.length === 0) return null;

  const props = [];
  for (const [pathname, value] of Object.entries(model.schema.tree)) {
    const shouldInclude = () => {
      if (value.unselect) return false;
      if (pathname === "_id") return true;
      if (includeUnscoped && !value.scope) return true;
      if (scopeArr.some(sc => (value.scope === sc || value.scope?.includes?.(sc)))) return true;
      return false;
    };

    if (shouldInclude()) props.push(pathname);
  }

  return props;
}

export function getPublicFields(model, publicScopeName = "public") {
  return getFields(model, publicScopeName);
}