
import styles from "./styles.module.css";
import classnames from "classnames";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import PlaceholderMap from "../PlaceholderMap/index.js";

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

export default function EmbedMap() {
  const [isLoading, setIsLoading] = useState(true);
  const { mode, ...options } = useSelector(state => state.map.options);
  const query = new URLSearchParams(options).toString();
  const src = `https://www.google.com/maps/embed/v1/${mode}?key=${API_KEY}&${query}`;

  useEffect(() => {
    setIsLoading(true);
  }, [src]);

  const handleLoadComplete = () => {
    console.count("loadEnd");
    setIsLoading(false);
  }

  return (
    <div className={styles.container}>
      <PlaceholderMap
        loader
        className={styles.fadeOut}
        data-hidden={!isLoading}
      />
      <iframe
        title="embed-map"
        name="map"
        className={classnames(styles.iframe, styles.fadeIn)}
        referrerPolicy="no-referrer-when-downgrade"
        src={src}
        onLoad={handleLoadComplete}
        data-hidden={isLoading}
      >
      </iframe>
    </div>
  )
}
