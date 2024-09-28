import mongoose from "mongoose";


type FromMongooseItem<T> = T extends mongoose.Types.ObjectId
  ? string // Replace ObjectId with string
  : T extends Array<infer Item>
  ? FromMongoose<Item>[] // Apply FromMongoLean to array items
  : T extends object
  ? FromMongoose<T>
  : T;
export type FromMongoose<T> = T extends mongoose.Types.ObjectId
  ? string
  : T extends Date
  ? T
  : T extends Array<infer Item>
  ? FromMongoose<Item>[]
  : T extends object
  ? {
    [Key in keyof T as Key extends "_id" ? "id" : Key]: // Replace "_id" key with "id"
    FromMongooseItem<T[Key]>;
  }
  : T;


export function fromMongoose<T extends Record<string, any> | Record<string, any>[] | undefined | null>(docOrItem: T): FromMongoose<T> | undefined | null {
  // Handle single values
  if (docOrItem instanceof mongoose.Types.ObjectId) return docOrItem.toString() as FromMongoose<T>;
  if (docOrItem instanceof Date) return docOrItem as FromMongoose<T>;
  if (Array.isArray(docOrItem)) return docOrItem.map(item => fromMongoose(item)) as FromMongoose<T>;
  if (typeof docOrItem === "function") return undefined;
  if (typeof docOrItem === "undefined" || docOrItem === null) return null;

  if (typeof docOrItem === "object") {
    const resultObj: Record<string, any> = {};

    // Build the object
    for (const key in docOrItem) {
      const element = docOrItem[key];

      const newKey = key === "_id" ? "id" : key;
      const newElement = fromMongoose(element);

      if (newElement) resultObj[newKey] = newElement;
    }

    return resultObj as FromMongoose<T>;
  }

  return docOrItem;
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