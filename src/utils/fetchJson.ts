import queryString from "query-string";


export default async function fetchJson<JSON = unknown>(
  input: RequestInfo,
  { data, query, ...init }:
    & RequestInit
    & {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data?: Record<string, any>,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      query?: Record<string, any>,
    }
  = {},
): Promise<JSON> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  if (!baseUrl) throw new Error("Missing base url");

  let url = input.toString().startsWith("/")
    ? `${baseUrl}${input.toString()}`
    : input;

  const body = data ? JSON.stringify(data) : undefined;
  const params = query ? queryString.stringify(query, { arrayFormat: "bracket" }) : undefined;

  if (params) url += `?${params}`;

  const res = await fetch(
    url,
    {
      ...init,
      ...(body ? { body } : {}),
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        ...init?.headers,
      },
    }
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (res.status === 204) return undefined as any;

  const json = await res.json();
  if (!res.ok) throw json;

  return json;
}