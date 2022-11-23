
import _ from "lodash";

import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

export default function ErrorTooltip({ error, children, ...props }) {
  _.defaultsDeep(props, {
    placement: "bottom",
    delay: { show: 0, hide: 300 },
    overlay: <Tooltip>{error}</Tooltip>,
    trigger: error ? ["hover", "focus"] : []
  });

  return (
    <OverlayTrigger {...props}>
      {children}
    </OverlayTrigger>
  );
}
