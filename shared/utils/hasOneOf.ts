import { isNil } from "lodash";


export type HasOneOf<T extends object, Keys extends keyof T> =
  & Omit<T, Keys>
  & {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Omit<T, K>>
  }[Keys]

export default function hasOneOf<T extends object, Keys extends (keyof T)[]>(
  obj: T, keys: Keys
): obj is HasOneOf<T, typeof keys[number]> {
  return Object.keys(obj).some(k => !isNil(k) && keys.some(item => item === k));
}