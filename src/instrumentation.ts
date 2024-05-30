import * as Sentry from "@sentry/nextjs";


export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    Sentry.init({
      dsn: "https://61ba438a91a79ba8a018bd8a04143e83@o4504206209843200.ingest.sentry.io/4506703377793024",
      tracesSampleRate: 1.0,
      debug: false,
    });
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    Sentry.init({
      dsn: "https://61ba438a91a79ba8a018bd8a04143e83@o4504206209843200.ingest.sentry.io/4506703377793024",
      tracesSampleRate: 1.0,
      debug: false,
    });
  }
}