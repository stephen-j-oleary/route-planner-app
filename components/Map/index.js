
import styles from "./styles.module.css";
import classnames from "classnames";
import { useSelector } from "react-redux";
import { MAP_TYPES } from "../../redux/slices/map.js";

import EmbedMap from "../EmbedMap";
import InteractiveMap from "../InteractiveMap";
import PlaceholderMap from "../PlaceholderMap";

export default function Map({ className, ...props }) {
  const type = useSelector(state => state.map.type);

  const Component = (type === MAP_TYPES.embed)
    ? EmbedMap
    : (type === MAP_TYPES.interactive)
    ? InteractiveMap
    : PlaceholderMap

  return (
    <div className={classnames(className, styles.container)} {...props}>
      <Component />
    </div>
  )
}