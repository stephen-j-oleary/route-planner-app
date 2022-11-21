
import styles from "./styles.module.css";
import classNames from "classnames";
import { createContext, forwardRef, useContext } from "react";
import { useFormContext } from "react-hook-form";
import _ from "lodash";

import Label from "../Label";

export const RadioContext = createContext({});

export function RadioOption({
  name,
  options,
  value,
  label,
  ...props
}) {
  const { name: ctxName, options: ctxOptions } = useContext(RadioContext);
  const { register } = useFormContext();

  const valueProps = _.isString(value)
    ? { value }
    : value;
  const labelProps = _.isString(label)
    ? { label }
    : label;

  return (
    <div
      {...props}
      className={classNames(
        props.className,
        styles.radioOption
      )}
    >
      <input
        {...valueProps}
        {...register(
          name || ctxName,
          options || ctxOptions || {}
        )}
        type="radio"
      />
      <Label {...labelProps} />
    </div>
  );
}

const Radio = forwardRef(function Radio({
  name,
  options = {},
  variant = "horizontal",
  children,
  ...props
}, ref) {
  return (
    <RadioContext.Provider value={{ name, options }}>
      <div
        {...props}
        ref={ref}
        className={classNames(
          props.className,
          styles.radio,
          styles[variant]
        )}
      >
        {children}
      </div>
    </RadioContext.Provider>
  )
})

export default Object.assign(Radio, {
  Option: RadioOption
})
