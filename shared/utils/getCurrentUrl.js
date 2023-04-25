import absoluteUrl from "next-absolute-url";


export default function getCurrentUrl(router) {
  const { origin } = absoluteUrl();
  const path = router.asPath;
  return [origin, path].join("");
}