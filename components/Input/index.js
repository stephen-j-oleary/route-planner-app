
import styles from "./styles.module.css";
import _ from "lodash";
import classNames from "classnames";
import { forwardRef } from "react";
import { useFormContext } from "react-hook-form";

import ErrorTooltip from "../ErrorTooltip";

const Input = forwardRef(function Input({ name, onBlur, onChange, options = {}, ...props }, forwardedRef) {
  const { register, formState: { errors } } = useFormContext();
  const error = _.get(errors, name);

  const opts = {
    onBlur,
    onChange,
    ...options
  };
  const { ref, ...formProps } = name
    ? register(name, opts)
    : {};

  return (
    <ErrorTooltip name={name}>
      <input
        {...props}
        {...formProps}
        ref={
          node => {
            if (ref) _.isFunction(ref) ? ref(node) : ref.current = node;
            if (forwardedRef) _.isFunction(forwardedRef) ? forwardedRef(node) : forwardedRef.current = node;
          }
        }
        className={classNames(
          props.className,
          styles.input,
          { invalid: error }
        )}
      />
    </ErrorTooltip>
  );
})

export default Input;
