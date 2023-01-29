
import { isFunction } from "lodash"

export default function mergeRefs(...refs) {
  return node => {
    for (const ref of refs) {
      if (ref) isFunction(ref)
        ? ref(node)
        : ref.current = node;
    }
  }
}
