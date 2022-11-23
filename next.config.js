
const { withSentryConfig } = require('@sentry/nextjs');

const moduleExports = {
  env: {
    NEXT_PUBLIC_GOOGLE_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_API_KEY
  },
  sentry: {
    hideSourceMaps: true
  }
}

const sentryWebpackPluginOptions = {
  silent: true
}

module.exports = withSentryConfig(moduleExports, sentryWebpackPluginOptions);
