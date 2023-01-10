
import { useEffect, useRef, useState } from "react";

const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 mins

export default function usePosition({ watch = false } = {}) {
  const [status, setStatus] = useState({
    loading: false,
    error: null,
    data: null
  });

  const lastRefresh = useRef(0);

  useEffect(
    () => {
      const handleChange = ({ coords: { latitude: lat, longitude: lng } }) => {
        lastRefresh.current = Date.now();
        setStatus({
          loading: false,
          error: null,
          data: { lat, lng }
        });
      };
      const handleError = err => {
        setStatus({
          loading: false,
          error: err.message,
          data: null
        });
      };

      if (Date.now() < lastRefresh.current + REFRESH_INTERVAL) return;
      setStatus(v => ({ ...v, loading: true }));

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

  return status;
}
