
import styles from "./styles.module.css";
import classNames from "classnames";
import _ from "lodash";
import { forwardRef } from "react";
import { useFormContext } from "react-hook-form";
import ErrorTooltip from "../ErrorTooltip";

export function SelectOption({ label, ...props }) {
  return (
    <option {...props}>
      {label}
    </option>
  );
}

const Select = forwardRef(function Select({
  name,
  onBlur,
  onChange,
  options = {},
  children,
  ...props
}, forwardedRef) {
  const { register, formState: { errors } } = useFormContext();
  const error = _.get(errors, name);
  const errorMessage = error && (error?.message || `Validation Error: ${error?.type}`);

  const opts = {
    onBlur,
    onChange,
    ...options
  };
  const { ref, ...formProps } = name
    ? register(name, opts)
    : {};

  return (
    <ErrorTooltip error={errorMessage}>
      <select
        {...props}
        {...formProps}
        ref={
          node => {
            if (ref) _.isFunction(ref)
              ? ref(node)
              : ref.current = node;
            if (forwardedRef) _.isFunction(forwardedRef)
              ? forwardedRef(node)
              : forwardedRef.current = node;
          }
        }
        className={classNames(
          props.className,
          styles.select
        )}
      >
        {children}
      </select>
    </ErrorTooltip>
  );
})

export default Object.assign(Select, {
  Option: SelectOption
})
