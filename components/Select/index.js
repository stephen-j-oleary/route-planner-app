
import styles from "./styles.module.css";
import { forwardRef } from "react";
import { useFormContext } from "react-hook-form";
import classnames from "classnames";

export default forwardRef(function Select({ className, name, options, children, ...props }, ref) {
  const { register } = useFormContext();

  return (
    <select
      ref={ref}
      className={classnames(className, styles.select)}
      {...register(name, options)}
      {...props}
    >
      {children}
    </select>
  );
})
