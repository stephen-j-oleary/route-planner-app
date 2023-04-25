export function handleStripeError(err) {
  switch (err.type) {
    case "StripeCardError":
      return {
        status: 400,
        message: "Card error",
      };

    case "StripeRateLimitError":
      return {
        status: 429,
        message: "Too many requests",
      };

    case "StripeInvalidRequestError":
      return {
        status: 400,
        message: "Invalid request",
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

  return err;
}