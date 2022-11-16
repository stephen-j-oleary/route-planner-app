
import styles from "./styles.module.css";
import classNames from "classnames";

export default function Label({ label, ...props }) {
  return (
    <label
      {...props}
      className={classNames(
        styles.label,
        props.className
      )}
    >
      {label}
    </label>
  );
}
