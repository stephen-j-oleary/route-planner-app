
import styles from "./styles.module.css";
import { forwardRef } from "react";
import classnames from "classnames";

import withTooltip from "../withTooltip/index.js";

const Button = forwardRef(function Button({ className, type = "button", children, ...props }, ref) {
  return (
    <button
      ref={ref}
      className={classnames(className, styles.button)}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
})

export default withTooltip(Button)