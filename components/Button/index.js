
import styles from "./styles.module.scss";
import { forwardRef, useState } from "react";
import classNames from "classnames";

import withTooltip from "../withTooltip/index.js";
import _ from "lodash";

const COLORS = {
  primary: ["50 90 205", "250 250 255", "150 150 160"]
};

export const RadioButton = ({
  options = [],
  value,
  initialValue,
  onChange = _.noop,
  variant = "primary",
  color = "primary",
  ...props
}) => {
  const [currentValue, setCurrentValue] = useState(value || initialValue || options[0].value);

  const handleClick = value => {
    setCurrentValue(value);
    onChange(value);
  }

  return (
    <div
      className={classNames(
        props.className,
        styles.radioButton,
      )}
      style={{
        "--color1": COLORS[color][0],
        "--color2": COLORS[color][1],
        "--color3": COLORS[color][2]
      }}
    >
      {
        options.map(item => (
          <Button
            key={item.value}
            className={classNames({ selected: (currentValue === item.value) })}
            variant={variant}
            color={color}
            onClick={() => handleClick(item.value)}
          >
            {item.label}
          </Button>
        ))
      }
    </div>
  );
}

const Button = forwardRef(function Button({
  type = "button",
  size = "sm",
  variant = "primary",
  color = "primary",
  children,
  ...props
}, ref) {
  return (
    <button
      {...props}
      ref={ref}
      className={classNames(
        props.className,
        styles.button,
        styles[variant],
        ...size.split("-").map(c => styles[c])
      )}
      style={{
        "--color1": COLORS[color][0],
        "--color2": COLORS[color][1],
        "--color3": COLORS[color][2]
      }}
      type={type}
    >
      {children}
    </button>
  );
})

export default withTooltip(Button)
