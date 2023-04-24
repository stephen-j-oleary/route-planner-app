import Link from "next/link";
import { forwardRef } from "react";


export default forwardRef(function NextLinkComposed({
  to,
  linkAs,
  ...props
}, ref) {
  return (
    <Link
      ref={ref}
      href={to}
      as={linkAs}
      {...props}
    />
  );
});