
import NextBundleAnalyzer from "@next/bundle-analyzer";

const moduleExports = {
  env: {
    DIRECTIONS_API_URL: process.env.DIRECTIONS_API_URL,
    SEARCH_API_URL: process.env.SEARCH_API_URL,
    AUTOCOMPLETE_API_URL: process.env.AUTOCOMPLETE_API_URL,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    RAPID_API_KEY: process.env.RAPID_API_KEY,
    RAPID_API_HOST: process.env.RAPID_API_HOST,
    NEXT_PUBLIC_GOOGLE_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
    NEXT_PUBLIC_ANALYTICS_MEASUREMENT_ID: process.env.NEXT_PUBLIC_ANALYTICS_MEASUREMENT_ID,
    MONGO_URI: process.env.MONGO_URI,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    GOOGLE_AUTH_ID: process.env.GOOGLE_AUTH_ID,
    GOOGLE_AUTH_SECRET: process.env.GOOGLE_AUTH_SECRET,
    STRIPE_URL: process.env.STRIPE_URL,
    STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    PAY_WEBHOOK_SECRET: process.env.PAY_WEBHOOK_SECRET,
  },
  modularizeImports: {
    lodash: {
      transform: "lodash/{{member}}",
      preventFullImport: true
    }
  },
  reactStrictMode: true,
}

const withBundleAnalyzer = NextBundleAnalyzer({
  enabled: process.env.ANALYZE_BUNDLE === "true"
});

export default withBundleAnalyzer(moduleExports);
