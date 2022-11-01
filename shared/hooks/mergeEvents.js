
import _ from "lodash";

export default function mergeEvents(...handlers) {
  return event => {
    for (const handler of handlers) {
      if (_.isFunction(handler)) handler(event);
    }
  }
}
