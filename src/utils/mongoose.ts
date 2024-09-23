import mongoose from "mongoose";


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fromMongoose<T = Record<string, unknown>>(doc: Record<string, any>) {
  const obj: Record<string, unknown> = {};
  for (const key in doc) {
    const value = doc[key];

    if (key === "_id") {
      obj.id = value.toString();
    }
    else if (key === "userId") {
      obj[key] = value.toString();
    }
    else {
      obj[key] = value;
    }
  }
  return obj as T;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function toMongoose<T = Record<string, unknown>>(obj: Record<string, any>) {
  const doc: Record<string, unknown> = { _id: _id(obj.id) };

  for (const key in obj) {
    const value = obj[key]
    if (key === "userId") doc[key] = _id(value);
    else if (key === "id") continue;
    else doc[key] = value;
  }
  return doc as T & { _id: mongoose.Types.ObjectId };
}

export function _id(hex?: string) {
  if (hex?.length !== 24) return new mongoose.Types.ObjectId();
  return new mongoose.Types.ObjectId(hex);
}