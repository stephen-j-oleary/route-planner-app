import { withSentryConfig } from "@sentry/nextjs";


/** @type {import("next").NextConfig} */
const moduleExports = {
  experimental: {
    instrumentationHook: true,
    turbo: {},
    optimizePackageImports: [
      "lodash-es",
      "@mui/material",
      "@mui/material-icons",
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: true,
  pageExtensions: ["js", "jsx", "ts", "tsx"],
  async rewrites() {
    return [
      {
        source: "/register",
        destination: "/login",
      },
    ];
  },
};

/**
 * @param {import("next").NextConfig} nextConfig
 */
const withSentry = nextConfig => process.env.NODE_ENV === "production"
  ? withSentryConfig(
    nextConfig,
    {
      org: "stephen-z0",
      project: "loop-mapping",
      silent: true,
      widenClientFileUpload: true,
      hideSourceMaps: true,
      disableLogger: true,
    },
  )
  : nextConfig;

export default withSentry(moduleExports);