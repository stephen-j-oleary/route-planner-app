
import _ from "lodash";
import { useFormContext } from "react-hook-form";
import { useMemo } from "react";

import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

export default function ErrorTooltip({ name, children }) {
    const { formState: { errors } } = useFormContext();
    const error = useMemo(
      () => _.get(errors, name),
      [errors, name]
    );

    return error
      ? (
        <OverlayTrigger
          placement="bottom"
          delay={{ show: 0, hide: 1000 }}
          overlay={
            <Tooltip>
              {error?.message || `Validation Error: ${error?.type}`}
            </Tooltip>
          }
        >
          {children}
        </OverlayTrigger>
      )
      : children;
}
