
import { useEffect, useRef, useState } from "react";

const SHOULD_REFRESH_INTERVAL = 5 * 60 * 1000; // 5 mins

export default function usePosition({ watch = false } = {}) {
  const lastRefresh = useRef(0);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState(null);
  const [error, setError] = useState(null);

  useEffect(
    () => {
      const handleChange = ({ coords: { latitude: lat, longitude: lng } }) => {
        lastRefresh.current = Date.now();
        setLoading(false);
        setValue({ lat, lng });
        setError(null);
      };
      const handleError = err => {
        setLoading(false);
        setValue(null);
        setError(err.message);
      };

      if (Date.now() < lastRefresh.current + SHOULD_REFRESH_INTERVAL) return;
      setLoading(true);

      const geo = window.navigator?.geolocation;
      if (!geo) return handleError(new Error("Geolocation not supported"));

      if (watch) {
        const watcherId = geo.watchPosition(handleChange, handleError);
        return () => geo.clearWatch(watcherId);
      }
      else {
        geo.getCurrentPosition(handleChange, handleError);
      }
    },
    [watch]
  );

  return { loading, value, error };
}
