
import { forwardRef } from "react"
import Loader from "../Loader/index.js";

export default function withLoading(Component) {
  return forwardRef(function ComponentWithLoading({ loading, ...props }, ref) {
    return (
      <Loader {...loading}>
        <Component
          ref={ref}
          {...props}
        />
      </Loader>
    );
  });
}
