
import NextBundleAnalyzer from "@next/bundle-analyzer";

const moduleExports = {
  env: {
    NEXT_PUBLIC_GOOGLE_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
    DIRECTIONS_API_URL: process.env.DIRECTIONS_API_URL,
    SEARCH_API_URL: process.env.SEARCH_API_URL,
    AUTOCOMPLETE_API_URL: process.env.AUTOCOMPLETE_API_URL,
    RAPID_API_HOST: process.env.RAPID_API_HOST,
    RAPID_API_KEY: process.env.RAPID_API_KEY,
    SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN,
    SENTRY_ORG: process.env.SENTRY_ORG,
    SENTRY_PROJECT: process.env.SENTRY_PROJECT,
    SENTRY_URL: process.env.SENTRY_URL,
    SENTRY_IGNORE_API_RESOLUTION_ERROR: process.env.SENTRY_IGNORE_API_RESOLUTION_ERROR,
    NEXT_PUBLIC_ANALYTICS_MEASUREMENT_ID: process.env.NEXT_PUBLIC_ANALYTICS_MEASUREMENT_ID
  },
  reactStrictMode: true,
}

const withBundleAnalyzer = NextBundleAnalyzer({
  enabled: process.env.ANALYZE_BUNDLE === "true"
});

export default withBundleAnalyzer(moduleExports);
