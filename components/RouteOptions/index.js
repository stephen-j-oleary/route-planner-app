
import styles from "./styles.module.css";
import classnames from "classnames";
import { useState } from "react";

import Input from "../Input";
import Button from "../Button";
import { PlaceholderButton } from "react-bootstrap";
import { useSelector } from "react-redux";
import { selectIsState } from "../../redux/slices/routeForm.js";

export default function RouteOptions({ className, ...props }) {
  const isLoading = useSelector(state => selectIsState(state, "loading"));
  const [showOptions, setShowOptions] = useState(false);

  return isLoading
    ? <CompPlaceholder />
    : (
      <div
        className={classnames(className, styles.container)}
        {...props}
      >
        <div className={styles.header}>
          <label htmlFor="modifiers">
            {showOptions ? "Route Options" : ""}
          </label>
          <Button onClick={() => setShowOptions(value => !value)}>
            {showOptions ? "Close" : "Options..."}
          </Button>
        </div>

        {showOptions && (
          <div className={styles.body}>
            <div className={styles.inputGroup}>
              <label htmlFor="modifiers.stopLength">
                Stop Length (seconds)
              </label>
              <Input
                type="number"
                name="modifiers.stopLength"
              />
            </div>
          </div>
        )}
      </div>
    )
}

const CompPlaceholder = () => (
  <div className={styles.container}>
    <div className={styles.header}>
      <div></div>
      <PlaceholderButton xs={3} size="md" />
    </div>
  </div>
)
