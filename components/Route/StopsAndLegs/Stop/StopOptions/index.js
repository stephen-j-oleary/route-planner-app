
import styles from "./styles.module.css";
import classNames from "classnames";
import { forwardRef, Fragment } from "react";
import { useSelector } from "react-redux";
import { selectSelectedStop } from "../../../redux/slices/routeForm.js";

import Label from "../../Label";
import LoadingPlaceholder from "../../LoadingPlaceholder";

export default forwardRef(function StopOptions(props, ref) {
  const selectedStop = useSelector(selectSelectedStop);
  const baseName = `stops.${selectedStop}.modifiers`;

  return (
    <div
      {...props}
      key={baseName}
      name={baseName}
      className={classNames(
        styles.container,
        props.className
      )}
    >
      <LoadingPlaceholder
        isLoading={selectedStop === -1}
        placeholder={Fragment}
      >
        <Label
          className={styles.header}
          htmlFor={baseName}
          label="Stop Options"
        />
        <div className={styles.body}>
          <div className={styles.inputGroup}>
          </div>
        </div>
      </LoadingPlaceholder>
    </div>
  )
})
