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
  reactStrictMode: true,
  pageExtensions: ["js", "jsx", "ts", "tsx"],
  async rewrites() {
    return [
      {
        source: "/register",
        destination: "/login",
      },
      {
        source: "/login",
        destination: "/login/email",
      },
      {
        source: "/routes",
        destination: "/routes/new",
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