export function handleStripeError(err: object) {
  if ("type" in err) {
    switch (err.type) {
      case "StripeCardError":
        return {
          status: 400,
          message: `Card error${"message" in err ? `: ${err.message}` : ""}`,
        };

      case "StripeRateLimitError":
        return {
          status: 429,
          message: "Too many requests",
        };

      case "StripeInvalidRequestError":
        return {
          status: 400,
          message: `Invalid request${"message" in err ? `: ${err.message}` : ""}`,
        };

      case "StripeAPIError":
      case "StripeConnectionError":
        return {
          status: 500,
          message: "An error occured contacting the payment portal",
        };

      case "StripeAuthenticationError":
        return {
          status: 401,
          message: "Not authorized",
        };
    }
  }

  return {
    status: 500,
    ...err,
  };
}