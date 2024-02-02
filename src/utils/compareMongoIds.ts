import mongoose from "mongoose";


export default function compareMongoIds(...args: (string | mongoose.Types.ObjectId | undefined)[]) {
  const argStrings = args.map(item => (item?.toString?.() || item));

  return argStrings.every((v, _i, arr) => v === arr[0]);
}