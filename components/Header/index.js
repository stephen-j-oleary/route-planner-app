
import styles from "./styles.module.css";
import classnames from "classnames";

export default function Header({ className, ...props }) {
  return (
    <header
      className={classnames(className, styles.header)}
      {...props}
    >

    </header>
  )
}
