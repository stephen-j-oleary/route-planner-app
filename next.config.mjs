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

export default moduleExports;