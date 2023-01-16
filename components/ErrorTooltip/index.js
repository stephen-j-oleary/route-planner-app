
import _ from "lodash";

import Tooltip from "@mui/material/Tooltip";

export default function ErrorTooltip({ error, children, ...props }) {
  const _props = _.defaultsDeep(
    {},
    props,
    {
      title: error,
      placement: "bottom",
      leaveDelay: 300,
      ...(!error ? {
        disableFocusListener: true,
        disableHoverListener: true,
        disableTouchListener: true
      } : {})
    }
  );

  return (
    <Tooltip {..._props}>
      {children}
    </Tooltip>
  );
}
