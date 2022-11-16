
import styles from "../shared/styles/stops.module.scss";
import classNames from "classnames";
import Header from "../components/Header";
import Map from "../components/Map";
import DirectionsForm from "../components/DirectionsForm";
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
      <DirectionsForm className={styles.form} />
      <Header className={styles.ad} />
    </div>
  );
}
