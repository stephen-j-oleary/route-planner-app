
import _ from "lodash";
import { forwardRef } from "react";
import Tooltip from "@mui/material/Tooltip";

export default function withTooltip(Component) {
  return forwardRef(function ComponentWithTooltip({ tooltip, ...props }, ref) {
    const shouldRender = !!tooltip;

    const _props = _.chain(tooltip)
      .thru(v => _.isString(v) ? { title: v } : v)
      .thru(v => _.isObject(v) ? v : {})
      .value();

    const element = <Component ref={ref} {...props} />;

    return (
      shouldRender ? (
        <Tooltip {..._props}>
          {element}
        </Tooltip>
      ) : element
    );
  })
}
