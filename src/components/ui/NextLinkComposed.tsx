import Link, { LinkProps } from "next/link";
import React from "react";


export type NextLinkComposedProps = Omit<LinkProps, "href" | "as"> & {
  to: LinkProps["href"],
  linkAs?: LinkProps["as"],
}

const NextLinkComposed = React.forwardRef<HTMLAnchorElement, NextLinkComposedProps>(
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