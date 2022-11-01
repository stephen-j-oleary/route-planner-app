
import styles from "./styles.module.css";
import classnames from "classnames";

import { createContext, forwardRef, useContext } from "react";
import { useFormContext } from "react-hook-form";

export const RadioContext = createContext({});

export function RadioOption({ className, dotClassName, labelClassName, name, label, options = {}, ...props }) {
  const { name: ctxName, options: ctxOptions } = useContext(RadioContext);
  const { register } = useFormContext();

  return (
    <div className={classnames(className, styles.radioOption)}>
      <input
        className={classnames(dotClassName, "dot")}
        type="radio"
        {...register(name || ctxName, options || ctxOptions)}
        {...props}
      />
      <label className={classnames(labelClassName, "label")}>
        {label}
      </label>
    </div>
  );
}

const Radio = forwardRef(function Radio({ variant = "horizontal", className, name, options = {}, children, ...props }, ref) {
  return (
    <RadioContext.Provider value={{ name, options }}>
      <div
        ref={ref}
        className={classnames(className, styles.radio, variant)}
        {...props}
      >
        {children}
      </div>
    </RadioContext.Provider>
  )
})

export default Object.assign(Radio, { Option: RadioOption })
