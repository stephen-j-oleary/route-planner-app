
import { useState, useEffect } from "react";

const DEFAULT_COORDS = {
  lat: 0,
  lng: 0
};

export default function usePosition({ watch = false } = {}) {
  const [coords, setCoords] = useState(DEFAULT_COORDS);
  const [error, setError] = useState(null);

  const handleChange = ({ coords: { latitude: lat, longitude: lng } }) => {
    setCoords({ lat, lng });
  }
  const handleError = err => setError(err.message);

  useEffect(
    () => {
      const geo = navigator?.geolocation;

      if (!geo) return handleError(new Error("Geolocation not supported"));

      if (watch) {
        const watcherId = geo.watchPosition(handleChange, handleError);
        return () => {
          geo.clearWatch(watcherId);
        };
      }
      else {
        geo.getCurrentPosition(handleChange, handleError);
      }
    },
    [watch]
  );

  return {
    ...coords,
    err: error
  };
}
