import Link, { LinkProps } from "next/link";
import { forwardRef } from "react";


export type NextLinkComposedProps = Omit<LinkProps, "href" | "as"> & {
  to: LinkProps["href"],
  linkAs?: LinkProps["as"],
}

const NextLinkComposed = forwardRef<HTMLAnchorElement, NextLinkComposedProps>(
  function NextLinkComposed({
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
  }
)


export default NextLinkComposed