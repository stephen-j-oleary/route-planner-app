
import styles from "../shared/styles/stops.module.scss";
import classNames from "classnames";
import Map from "../components/Map";
import Route from "../components/Route";
import { useSelector } from "react-redux";
import { selectViewMode } from "../redux/slices/routeForm.js";

export default function App() {
  const viewMode = useSelector(selectViewMode);

  return (
    <div
      className={classNames(
        styles.app,
        { [styles.listMode]: viewMode === "list" }
      )}
    >
      <Map className={styles.map} />
      <Route className={styles.form} />
    </div>
  );
}
