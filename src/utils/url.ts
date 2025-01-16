export function appendQuery(url: string | URL, params: Record<string, string>) {
  const _url = new URL(url, process.env.NEXT_PUBLIC_BASE_URL);
  const query = _url.searchParams;

  for (const key in params) {
    query.set(key, params[key]);
  }

  return `${_url.origin}${_url.pathname}?${query.toString()}`;
}


export function toAbsolute(url: string) {
  if (!url.startsWith("/")) return url;

  return [process.env.NEXT_PUBLIC_BASE_URL, url].join("/");
}