import absoluteUrl from "next-absolute-url";


export default function createAbsoluteUrl(relativePath: string) {
  try {
    const { origin } = absoluteUrl();
    return [origin, relativePath].join("");
  }
  catch {
    return "";
  }
}