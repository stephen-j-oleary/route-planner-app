
import styles from "./styles.module.css";
import { forwardRef } from "react";
import classnames from "classnames";

import Radio from "../Radio";
import { useSelector } from "react-redux";
import { selectSelectedStop } from "../../redux/slices/routeForm.js";

export default forwardRef(function StopOptions({ className, ...props }, ref) {
  const selectedStop = useSelector(selectSelectedStop);

  return (selectedStop !== -1) ? (
    <div
      name={`stops.${selectedStop}.modifiers`}
      className={classnames(className, styles.container)}
      {...props}
    >
      <div className={styles.header}>
        <label htmlFor={`stops.${selectedStop}.modifiers`}>
          Stop Options
        </label>
      </div>
      <div className={styles.body}>
        <div className={styles.inputGroup}>
          <label htmlFor={`stops.${selectedStop}.modifiers.type`}>
            Stop type
          </label>
          <Radio ref={ref} name={`stops.${selectedStop}.modifiers.type`} className="vertical">
            <Radio.Option value="middle" label="Middle" />
            <Radio.Option value="origin" label="Origin" />
            <Radio.Option value="destination" label="Destination" />
          </Radio>
        </div>
      </div>
    </div>
  ) : <div className={classnames(className, styles.container)} {...props}></div>
})
