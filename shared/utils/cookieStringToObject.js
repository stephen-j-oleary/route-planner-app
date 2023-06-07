/**
 * Parses a cookie string and returns an object
 * @param {string} cookieString Cookie string format from cookie header
 * @returns {{ [string]: string }}
 */
export default function cookieStringToObject(cookieString) {
  if (!cookieString || typeof cookieString !== "string") return {};
  return Object.fromEntries(
    cookieString
      .split(";")
      .map(cookie => {
        let [ name, ...rest] = cookie.split("=");
        name = name?.trim();
        if (!name) return;
        const value = rest.join("=").trim();
        if (!value) return;
        return [name, decodeURIComponent(value)];
      })
  )
}