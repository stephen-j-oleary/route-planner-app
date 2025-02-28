import BundleAnalyzer from "@next/bundle-analyzer";


/** @type {import("next").NextConfig} */
const moduleExports = {
  experimental: {
    optimizePackageImports: [
      "lodash-es",
      "@mui/material",
      "@mui/icons-material",
      "@mui/lab",
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
  pageExtensions: ["js", "jsx", "ts", "tsx"],
  async redirects() {
    return [
      {
        source: "/routes",
        destination: "/routes/new",
        permanent: true,
      },
    ];
  },
  webpack: (config) => {
    config.watchOptions = {
      ignored: /node_modules/,
    };
    return config;
  },
};

const withBundleAnalyzer = BundleAnalyzer({
  enabled: process.env.ANALYZE_BUNDLE === "true",
})

export default withBundleAnalyzer(moduleExports);