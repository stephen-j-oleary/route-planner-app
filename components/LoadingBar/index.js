
import styles from "./styles.module.css";

export default function LoadingBar({ type = "progress", progress = 0, children }) {
  return (
    <div className={styles.border}>
      <div
        className={styles.fill}
        style={{
          width: type === "flow"
            ? "100%"
            : `${progress * 100}%`
        }}
      >
        {children}
      </div>
    </div>
  )
}