import _ from "lodash";
import { forwardRef } from "react";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

const DEFAULT_OPTIONS = {
  placement: "auto"
}

export default function withTooltip(Component) {
  return forwardRef(function ComponentWithTooltip({ tooltip, ...props }, ref) {
    const shouldRender = !!tooltip;

    const overlayOptions = _.chain(tooltip)
      .thru(v => _.isString(v) ? { value: v } : v)
      .thru(v => _.isObject(v) ? v : {})
      .defaults(DEFAULT_OPTIONS)
      .mapKeys((_v, k) => (k === "value") ? "overlay" : k)
      .update("overlay", v => <Tooltip>{v}</Tooltip>)
      .value();

    const element = <Component ref={ref} {...props} />;

    return (
      shouldRender ? (
        <OverlayTrigger {...overlayOptions}>
          {element}
        </OverlayTrigger>
      ) : element
    );
  })
}
