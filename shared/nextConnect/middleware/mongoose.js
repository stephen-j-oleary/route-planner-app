import connectMongoose from "@/shared/utils/connectMongoose";


export default async function mongooseMiddleware(_req, res, next) {
  try {
    await connectMongoose();
    return next();
  }
  catch ({ status, message }) {
    return res.status(status || 500).json({ message });
  }
}

export function handleMongooseError(err) {
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map(({ path, message }) => ([path, message]));

    return {
      status: 400,
      message: "Invalid request",
      fields: Object.fromEntries(errors),
    };
  }

  if (err.code && err.code === 11000) {
    return {
      status: 409,
      message: "Duplicate field",
      fields: err.keyValue,
    };
  }

  return err;
}