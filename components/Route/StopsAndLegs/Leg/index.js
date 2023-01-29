
import styles from "./styles.module.css";
import { get } from "lodash";
import { useSelector } from "react-redux";
import { selectResults } from "../../../../redux/slices/routeForm.js";

export default function Leg({ legIndex }) {
  const leg = useSelector(state => selectResults(state).legs[legIndex]);
  const distance = get(leg, "distance.text", "");
  const duration = get(leg, "duration.text", "");

  return leg && (
    <div className={styles.legResults}>
      <p>
        <span>{duration}</span>
        <span>({distance})</span>
      </p>
    </div>
  )
}
