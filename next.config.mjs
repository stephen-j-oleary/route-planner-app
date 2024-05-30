import NextBundleAnalyzer from "@next/bundle-analyzer";
import { withSentryConfig } from "@sentry/nextjs";


/** @type {import("next").NextConfig} */
const moduleExports = {
  typescript: {
    ignoreBuildErrors: true,
  },
  modularizeImports: {
    lodash: {
      transform: "lodash/{{member}}",
      preventFullImport: true
    },
    "@mui/material": {
      transform: "@mui/material/{{member}}",
      preventFullImport: true
    },
    "@mui/material-icons": {
      transform: "@mui/material-icons/{{member}}",
      preventFullImport: true
    },
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

const withBundleAnalyzer = NextBundleAnalyzer({
  enabled: process.env.ANALYZE_BUNDLE === "true"
});

export default withSentryConfig(
  withBundleAnalyzer(moduleExports),
  {
    org: "stephen-z0",
    project: "loop-mapping",
    silent: true,
    widenClientFileUpload: true,
    hideSourceMaps: true,
    disableLogger: true,
  },
);