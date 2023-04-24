import { match } from "css-mediaquery";

/**
 * Creates a matchMedia method mock to replace the default window.matchMedia
 * @param {Partial<import("css-mediaquery").MediaValues>} deviceMediaValues
 * @returns {(query: string) => MediaQueryList} Custom match media method
 */
export default function createMatchMediaMock(deviceMediaValues) {
  return (query) => ({
    matches: match(query, deviceMediaValues),
    addListener: () => {},
    removeListener: () => {},
  });
}