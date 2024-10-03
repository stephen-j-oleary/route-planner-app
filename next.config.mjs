import BundleAnalyzer from "@next/bundle-analyzer";


/** @type {import("next").NextConfig} */
const moduleExports = {
  experimental: {
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

const withBundleAnalyzer = BundleAnalyzer({
  enabled: process.env.ANALYZE_BUNDLE === "true",
})

export default withBundleAnalyzer(moduleExports);