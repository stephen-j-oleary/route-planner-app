
import styles from "./styles.module.css";
import classNames from "classnames";
import React, { cloneElement, forwardRef } from "react"

export default forwardRef(function Loader({
  active = false,
  animation = "shimmer",
  element: Element,
  overlay: Overlay,
  speed = 2000,
  delay = 0,
  children,
  ...props
}, ref) {
  return (
    <div
      ref={ref}
      {...props}
      className={classNames(
        props.className,
        styles.wrapper
      )}
      style={{
        "--loading-animation": styles[animation],
        "--loading-speed": `${speed}ms`,
        "--loading-delay": `${delay}ms`
      }}
    >
      {
        (active && Overlay) && (
          <div className={styles.overlayWrapper}>
            <Overlay className={styles.overlay} color="255,255,255" />
          </div>
        )
      }
      {
        (active && Element)
          ? (
            <Element className={classNames({ [styles.loader]: active })} />
          )
          : (
            React.Children.map(children, child => (
              cloneElement(child, {
                className: classNames(
                  child.props.className,
                  { [styles.loader]: active }
                )
              })
            ))
          )
      }
    </div>
  );
})
