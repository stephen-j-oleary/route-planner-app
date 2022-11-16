
import styles from "../shared/styles/stops.module.scss";
import Header from "../components/Header";
import Map from "../components/Map";
import DirectionsForm from "../components/DirectionsForm";

export default function App() {
  return (
    <div className={styles.app}>
      <Header className={styles.header} />
      <aside className={styles.sidebar}>
        <DirectionsForm />
      </aside>
      <Map className={styles.main} />
    </div>
  );
}
