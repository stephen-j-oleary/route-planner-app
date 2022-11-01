
import _ from "lodash";

export default function resolve(value, ...args) {
  return _.isFunction(value)
    ? value(...args)
    : value;
}
