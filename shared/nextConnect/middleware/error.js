import { handleMongooseError } from "./mongoose";
import { handleStripeError } from "./stripe";


export default async function error(error, _req, res) {
  let err = error;

  err = handleMongooseError(err);
  err = handleStripeError(err);

  const {
    status = 500,
    message = "Unknown error",
    ...restErr
  } = err;

  res.status(status);
  res.json({ message, ...restErr });
}