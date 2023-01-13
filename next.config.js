
const { withSentryConfig } = require('@sentry/nextjs');

const moduleExports = {
  env: {
    NEXT_PUBLIC_GOOGLE_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
    DIRECTIONS_API_URL: process.env.DIRECTIONS_API_URL,
    SEARCH_API_URL: process.env.SEARCH_API_URL,
    RAPID_API_HOST: process.env.RAPID_API_HOST,
    RAPID_API_KEY: process.env.RAPID_API_KEY,
    SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN,
    SENTRY_ORG: process.env.SENTRY_ORG,
    SENTRY_PROJECT: process.env.SENTRY_PROJECT,
    SENTRY_URL: process.env.SENTRY_URL,
    NEXT_PUBLIC_ANALYTICS_MEASUREMENT_ID: process.env.NEXT_PUBLIC_ANALYTICS_MEASUREMENT_ID
  },
  sentry: {
    hideSourceMaps: true
  },
  reactStrictMode: true
}

const sentryWebpackPluginOptions = {
  silent: true
}

module.exports = withSentryConfig(moduleExports, sentryWebpackPluginOptions);
