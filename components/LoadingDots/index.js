
import styles from "./styles.module.css";
import classNames from "classnames";

export default function LoadingDots({ count = 3, speed = 1200, color = "0,0,0", ...props }) {
  return (
    <div
      {...props}
      className={classNames(
        props.className,
        styles.dots
      )}
    >
      {
        new Array(count).fill(0).map((v, i) => (
          <span
            key={i}
            className={styles.dot}
            style={{
              "--count": count,
              "--index": i,
              "--speed": `${speed}ms`,
              "--color": color
            }}
          ></span>
        ))
      }
    </div>
  )
}