import NextBundleAnalyzer from "@next/bundle-analyzer";


/** @type {import("next").NextConfig} */
const moduleExports = {
  typescript: {
    tsconfigPath: "./tsconfig.prod.json"
  },
  modularizeImports: {
    lodash: {
      transform: "lodash/{{member}}",
      preventFullImport: true
    }
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

export default withBundleAnalyzer(moduleExports);