
import NextBundleAnalyzer from "@next/bundle-analyzer";

const moduleExports = {
  env: process.env.NODE_ENV === "production" ? process.env : {},
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
