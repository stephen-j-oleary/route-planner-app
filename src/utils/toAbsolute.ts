export default function toAbsolute(url: string) {
  if (!url.startsWith("/")) return url;

  return [process.env.NEXT_PUBLIC_BASE_URL, url].join("/");
}